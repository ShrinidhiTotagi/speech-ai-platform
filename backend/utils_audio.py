import numpy as np
import librosa

TARGET_LEN = 24000  # 1.5s at 16k sample rate
N_MELS = 64
N_FFT = 1024
HOP_LEN = 256

def load_audio_from_bytes(file_bytes, sr=16000):
    # file_bytes: bytes object (file.read())
    # librosa accepts file-like objects only via soundfile or via saving to temp file.
    # We'll use soundfile via librosa.load by writing to np.frombuffer and using soundfile if necessary.
    import io, soundfile as sf
    bio = io.BytesIO(file_bytes)
    y, orig_sr = sf.read(bio, dtype='float32')
    if orig_sr != sr:
        y = librosa.resample(y, orig_sr, sr)
    return y, sr

def ensure_length(y, target_len=TARGET_LEN):
    if len(y) < 500:
        y = np.zeros(target_len, dtype=np.float32)
    if len(y) < target_len:
        y = np.pad(y, (0, target_len - len(y)))
    else:
        y = y[:target_len]
    return y

def waveform_to_mel(y, sr=16000, n_mels=N_MELS, n_fft=N_FFT, hop_length=HOP_LEN):
    y = ensure_length(y, TARGET_LEN)
    mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=n_mels, n_fft=n_fft, hop_length=hop_length)
    mel_db = librosa.power_to_db(mel, ref=np.max)
    return mel_db.astype(np.float32)   # shape: (n_mels, time_frames)
