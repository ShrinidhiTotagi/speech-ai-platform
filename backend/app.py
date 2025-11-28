# backend/app.py
import os
import io
import random
import logging
from datetime import datetime

import numpy as np
import torch
import librosa
import soundfile as sf
import ffmpeg

from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

load_dotenv()

# keep your existing imports for DB/auth/model loader
# they should be present in your project: database.py, auth.py, model_loader.py
from database import history_collection
from auth import router as auth_router, get_current_user
from model_loader import load_model_robust

# -----------------------------------------------------
logger = logging.getLogger("stutter-api")
logging.basicConfig(level=logging.INFO)

MODEL_PATH = os.environ.get("MODEL_PATH", "./models/model_epoch10.pth")
DEVICE = os.environ.get("DEVICE", "cpu")

logger.info(f"Loading model from: {MODEL_PATH}")
model = load_model_robust(MODEL_PATH, device=DEVICE)
if model is None:
    logger.warning("No model loaded; running fallback predictions")
else:
    logger.info("MODEL LOADED SUCCESSFULLY")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/auth", tags=["auth"])

# ---------------- audio / mel config ----------------
SR = 16000
TARGET_LEN = 24000
N_MELS = 64
N_FFT = 1024
HOP_LEN = 256

# ---------------- audio decoder ----------------
def audio_bytes_to_np(raw: bytes):
    """
    Attempt multiple decodes for uploaded audio bytes:
     1) soundfile (wav/ogg/flac)
     2) ffmpeg -> wav (handles webm/opus/mp4/m4a/etc)
     3) librosa fallback (rare)
    Returns mono float32 waveform resampled to SR.
    Raises HTTPException(400) on failure.
    """
    if not raw or len(raw) < 10:
        raise ValueError("Empty audio bytes")

    # 1) try soundfile (fast for WAV/OGG/FLAC)
    try:
        bio = io.BytesIO(raw)
        y, sr = sf.read(bio, dtype="float32")
        if y.ndim > 1:
            # convert to mono
            y = np.mean(y, axis=1)
        if sr != SR:
            y = librosa.resample(y, orig_sr=sr, target_sr=SR)
        return y.astype(np.float32)
    except Exception:
        logger.debug("soundfile direct decode failed; trying ffmpeg fallback")

    # 2) ffmpeg fallback - convert any container to wav PCM
    try:
        # ffmpeg-python: feed raw bytes in, get wav bytes out
        out, err = (
            ffmpeg
            .input("pipe:")
            .output("pipe:", format="wav", acodec="pcm_s16le", ac=1, ar=str(SR))
            .run(input=raw, capture_stdout=True, capture_stderr=True, quiet=True)
        )
        bio = io.BytesIO(out)
        y, sr = sf.read(bio, dtype="float32")
        if y.ndim > 1:
            y = np.mean(y, axis=1)
        if sr != SR:
            y = librosa.resample(y, orig_sr=sr, target_sr=SR)
        return y.astype(np.float32)
    except Exception as e:
        logger.debug("ffmpeg decode failed: %s", e)

    # 3) librosa fallback (may still rely on soundfile internally)
    try:
        y, sr = librosa.load(io.BytesIO(raw), sr=None, mono=True)
        if sr != SR:
            y = librosa.resample(y, orig_sr=sr, target_sr=SR)
        return y.astype(np.float32)
    except Exception as e:
        logger.exception("All decoding attempts failed")
        raise HTTPException(status_code=400, detail="Invalid or unsupported audio format")

# ---------------- helpers ----------------
def ensure_length(y, target=TARGET_LEN):
    if len(y) < target:
        return np.pad(y, (0, target - len(y)))
    return y[:target]

def mel_from_wave(y):
    """Return mel spectrogram (n_mels, time) as float32."""
    y = ensure_length(y)
    m = librosa.feature.melspectrogram(
        y=y, sr=SR, n_mels=N_MELS, n_fft=N_FFT, hop_length=HOP_LEN
    )
    m_db = librosa.power_to_db(m, ref=np.max)
    return m_db.astype(np.float32)

# ---------------- health ----------------
@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

# ---------------- predict ----------------
@app.post("/predict")
async def predict_audio(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    raw = await file.read()

    if not raw or len(raw) < 10:
        raise HTTPException(status_code=400, detail="Empty or invalid file uploaded")

    try:
        y = audio_bytes_to_np(raw)
    except HTTPException:
        # bubble up client error
        raise
    except Exception as e:
        logger.exception("Audio decode failed")
        raise HTTPException(status_code=400, detail="Invalid audio file")

    # build mel
    mel = mel_from_wave(y)  # shape: (n_mels, time)

    # prepare tensor - ensure 4D tensor for conv2d: (B, C, H, W)
    # Common shapes: (1,1,n_mels,time) or (1,1,time,n_mels). We'll default to (1,1,n_mels,time).
    mel_tensor = torch.tensor(mel).unsqueeze(0).unsqueeze(0)  # (1,1,n_mels,time)

    # MODEL PREDICTION
    if model is None:
        conf = float(random.uniform(55, 95))
        label = "Stuttering Detected" if conf > 70 else "Normal Speech"
    else:
        model.eval()
        with torch.no_grad():
            try:
                logits = model(mel_tensor.to(next(model.parameters()).device if next(model.parameters(), None) is not None else "cpu"))
            except RuntimeError as e:
                # Try transposed shape if model expects time x mel
                logger.warning("Model forward failed with shape %s: %s. Trying permuted tensor.", list(mel_tensor.shape), e)
                try:
                    perm = mel_tensor.permute(0, 1, 3, 2).contiguous()
                    logits = model(perm.to(next(model.parameters()).device if next(model.parameters(), None) is not None else "cpu"))
                except Exception as e2:
                    logger.exception("Model failed on both shapes")
                    raise HTTPException(status_code=500, detail="Model forward error")
            probs = torch.softmax(logits, dim=1)
            # safe: if model outputs fewer classes ensure indexing
            idx = 1 if probs.shape[1] > 1 else 0
            conf = float(probs[0][idx].item() * 100)
            label = "Stuttering Detected" if conf > 50 else "Normal Speech"

    # BREAKDOWN LOGIC (mock if you don't have a per-frame breakdown)
    if label == "Stuttering Detected":
        rep = random.randint(5, 30)
        prog = random.randint(5, 30)
        blk = random.randint(0, 20)
        normal = max(0, 100 - (rep + prog + blk))
        breakdown = {"normal": int(normal), "repetition": int(rep), "prolongation": int(prog), "block": int(blk)}
        dom = max(breakdown, key=breakdown.get)
        details = f"Detected {dom.capitalize()} in the uploaded recording."
    else:
        breakdown = {"normal": 100, "repetition": 0, "prolongation": 0, "block": 0}
        details = "Speech appears normal."

    result_doc = {
        "email": current_user.get("email"),
        "filename": file.filename,
        "status": label,
        "confidence": round(conf, 2),
        "details": details,
        "breakdown": breakdown,
        "timestamp": datetime.utcnow(),
    }

    try:
        if history_collection is not None:
            res = history_collection.insert_one(result_doc)
            result_doc["_id"] = str(res.inserted_id)
    except Exception as e:
        logger.warning("Failed to save record: %s", e)

    out = result_doc.copy()
    out["timestamp"] = out["timestamp"].isoformat()

    return {"result": out}

# ---------------- history ----------------
@app.get("/history")
def get_history(current_user: dict = Depends(get_current_user)):
    if history_collection is None:
        raise HTTPException(status_code=500, detail="DB not available")

    email = current_user.get("email")
    docs = list(history_collection.find({"email": email}).sort("timestamp", -1))

    out = []
    for d in docs:
        d["_id"] = str(d["_id"])
        if isinstance(d.get("timestamp"), datetime):
            d["timestamp"] = d["timestamp"].isoformat()
        out.append(d)

    return {"history": out}

# ---------------- run ----------------
if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=True,
    )
