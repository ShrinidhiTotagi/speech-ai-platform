import os
import io
import random
import logging
from datetime import datetime
import uuid

import numpy as np
import torch
import librosa
import soundfile as sf
import ffmpeg
import imageio_ffmpeg

from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
from dotenv import load_dotenv
from bson import ObjectId

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm

# ================= LOAD ENV =================
load_dotenv()

# ================= PROJECT IMPORTS =================
from database import history_collection
from auth import router as auth_router, get_current_user
from contact import router as contact_router
from model_loader import load_model_robust

# ================= LOGGING =================
logger = logging.getLogger("stutter-api")
logging.basicConfig(level=logging.INFO)

# ================= MODEL LOAD =================
MODEL_PATH = os.environ.get("MODEL_PATH", "./models/model_epoch10.pth")
DEVICE = os.environ.get("DEVICE", "cpu")

logger.info(f"Loading model from: {MODEL_PATH}")
model = load_model_robust(MODEL_PATH, device=DEVICE)

if model is not None:
    model.eval()
    logger.info("MODEL LOADED SUCCESSFULLY")
else:
    logger.warning("Model not loaded – fallback mode enabled")

# ================= FASTAPI APP =================
app = FastAPI()

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if os.environ.get("FRONTEND_URL"):
    ALLOWED_ORIGINS.append(os.environ.get("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= ROUTERS =================
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(contact_router, tags=["contact"])

# ================= AUDIO CONFIG =================
SR = 16000
TARGET_LEN = 24000
N_MELS = 64
N_FFT = 1024
HOP_LEN = 256

# ================= AUDIO DECODER =================
def audio_bytes_to_np(raw: bytes):
    if not raw or len(raw) < 10:
        raise HTTPException(status_code=400, detail="Empty audio")

    try:
        y, sr = sf.read(io.BytesIO(raw), dtype="float32")
        if y.ndim > 1:
            y = np.mean(y, axis=1)
        if sr != SR:
            y = librosa.resample(y, sr, SR)
        return y
    except Exception:
        pass

    try:
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        out, _ = (
            ffmpeg.input("pipe:", loglevel="quiet")
            .output("pipe:", format="wav", acodec="pcm_s16le", ac=1, ar=str(SR))
            .run(
                input=raw,
                capture_stdout=True,
                capture_stderr=True,
                cmd=ffmpeg_exe,
            )
        )
        y, _ = sf.read(io.BytesIO(out), dtype="float32")
        return y
    except Exception:
        raise HTTPException(status_code=400, detail="Unsupported audio format")

# ================= HELPERS =================
def ensure_length(y):
    if len(y) < TARGET_LEN:
        return np.pad(y, (0, TARGET_LEN - len(y)))
    return y[:TARGET_LEN]

# ================= MEL SPECTROGRAM =================
def mel_from_wave(y):
    logger.info("Mel Step 1: ensure_length()")

    y = ensure_length(y)

    logger.info(f"Audio Length = {len(y)}")

    logger.info("Mel Step 2: Creating Mel Spectrogram")

    mel = librosa.feature.melspectrogram(
        y=y,
        sr=SR,
        n_mels=N_MELS,
        n_fft=N_FFT,
        hop_length=HOP_LEN,
    )

    logger.info("Mel Step 3: Mel Spectrogram Created")

    mel_db = librosa.power_to_db(mel, ref=np.max)

    logger.info("Mel Step 4: Converted to dB")

    mel_db = mel_db.astype(np.float32)

    logger.info("Mel Step 5: Returning Mel")

    return mel_db
# ================= PDF GENERATOR =================
def generate_pdf_report(result: dict, filepath: str):
    c = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4
    y = height - 2 * cm

    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width / 2, y, "FLUENCY ASSIST – ANALYSIS REPORT")

    y -= 1.5 * cm
    c.setFont("Helvetica", 11)
    c.drawString(2 * cm, y, f"Email: {result['email']}")
    y -= 0.6 * cm
    c.drawString(2 * cm, y, f"File: {result['filename']}")
    y -= 0.6 * cm
    c.drawString(2 * cm, y, f"Date: {result['timestamp']}")

    y -= 1.2 * cm
    c.setFont("Helvetica-Bold", 14)
    c.drawString(2 * cm, y, "Result Summary")

    y -= 0.8 * cm
    c.setFont("Helvetica", 12)
    c.drawString(2 * cm, y, f"Status: {result['status']}")
    y -= 0.6 * cm
    c.drawString(2 * cm, y, f"Confidence: {result['confidence']}%")

    y -= 1 * cm
    c.setFont("Helvetica-Bold", 13)
    c.drawString(2 * cm, y, "Speech Breakdown (%)")

    y -= 0.7 * cm
    c.setFont("Helvetica", 11)
    for k, v in result["breakdown"].items():
        c.drawString(2.5 * cm, y, f"{k.capitalize()}: {v}%")
        y -= 0.5 * cm

    c.setFont("Helvetica-Oblique", 9)
    c.drawCentredString(width / 2, 1.5 * cm, "Generated by Fluency Assist")
    c.showPage()
    c.save()

ALLOWED_AUDIO_TYPES = {
    "audio/wav", "audio/wave", "audio/x-wav",
    "audio/mpeg", "audio/mp3", "audio/ogg",
    "audio/webm", "audio/flac", "audio/x-flac",
    "video/webm", "application/octet-stream", "",
}

def is_valid_audio(raw: bytes) -> bool:
    """Check magic bytes to detect real audio formats."""
    if len(raw) < 4:
        return False
    # RIFF/WAV
    if raw[:4] == b'RIFF':
        return True
    # MP3 (ID3 tag or sync bytes)
    if raw[:3] == b'ID3' or raw[:2] in (b'\xff\xfb', b'\xff\xf3', b'\xff\xf2'):
        return True
    # OGG
    if raw[:4] == b'OggS':
        return True
    # FLAC
    if raw[:4] == b'fLaC':
        return True
    # WebM / MKV (EBML header)
    if raw[:4] == b'\x1a\x45\xdf\xa3':
        return True
    # MP4/M4A
    if raw[4:8] in (b'ftyp', b'moov', b'mdat'):
        return True
    return False

# ================= HEALTH =================
@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

# ================= PREDICT =================
@app.post("/predict")
async def predict_audio(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    logger.info("========== PREDICT REQUEST START ==========")

    # -------- Read File --------
    logger.info("Step 1: Reading uploaded file")
    raw = await file.read()

    logger.info(f"Step 2: File received -> {file.filename}")
    logger.info(f"File size: {len(raw)} bytes")

    if not is_valid_audio(raw):
        logger.error("Invalid audio file")
        raise HTTPException(
            status_code=400,
            detail="Unsupported or invalid audio file",
        )

    # -------- Decode --------
    logger.info("Step 3: Decoding audio")
    y = audio_bytes_to_np(raw)
    logger.info(f"Step 4: Audio decoded successfully. Samples={len(y)}")

    # -------- Mel Spectrogram --------
    logger.info("Step 5: Creating Mel Spectrogram")

    mel = mel_from_wave(y)

    logger.info("Step 6: Mel Spectrogram Created")
    logger.info(f"Mel Shape = {mel.shape}")

        # -------- Tensor --------
    logger.info("Step 7: Creating Tensor")

    mel_tensor = torch.from_numpy(mel).float()

    logger.info(f"Tensor Before Unsqueeze = {mel_tensor.shape}")

    mel_tensor = mel_tensor.unsqueeze(0).unsqueeze(0)

    logger.info(f"Tensor Shape = {mel_tensor.shape}")

    # -------- Model --------
    logger.info("Step 8: Starting Model Inference")

    if model is None:
        logger.warning("Model Missing -> Using Random Prediction")
        prob = random.uniform(0.4, 0.9)
    else:
        with torch.no_grad():
            out = model(mel_tensor)

        logger.info("Step 9: Model Finished")
        logger.info(f"Raw Output = {out}")

        if out.shape[1] == 1:
            prob = torch.sigmoid(out)[0][0].item()
        else:
            prob = torch.softmax(out, dim=1)[0][1].item()

    logger.info(f"Step 10: Probability = {prob}")

    conf = round(prob * 100, 2)
    label = "Stuttering Detected" if prob > 0.5 else "Normal Speech"

    # -------- Breakdown --------
    if label == "Stuttering Detected":
        rep = round(conf * 0.4)
        prog = round(conf * 0.35)
        blk = round(conf * 0.25)
        normal = max(0, 100 - (rep + prog + blk))

        breakdown = {
            "normal": normal,
            "repetition": rep,
            "prolongation": prog,
            "block": blk,
        }

        details = "Stuttering patterns detected in speech."
    else:
        breakdown = {
            "normal": 100,
            "repetition": 0,
            "prolongation": 0,
            "block": 0,
        }

        details = "Speech appears normal."

    logger.info("Step 11: Saving to MongoDB")

    doc = {
        "email": current_user["email"],
        "filename": file.filename,
        "status": label,
        "confidence": conf,
        "details": details,
        "breakdown": breakdown,
        "timestamp": datetime.utcnow(),
    }

    res = history_collection.insert_one(doc)

    logger.info("Step 12: Saved Successfully")

    doc["_id"] = str(res.inserted_id)
    doc["timestamp"] = doc["timestamp"].isoformat()

    logger.info("========== PREDICT REQUEST COMPLETED ==========")

    return {
        "result": doc
    }