import librosa, librosa.display, matplotlib.pyplot as plt, numpy as np

audio_path = "audio/sample.wav"
audio, sr = librosa.load(audio_path)

# Waveform
plt.figure(figsize=(10,4))
librosa.display.waveshow(audio, sr=sr)
plt.title("Waveform")
plt.savefig("reports/waveform.png")
plt.close()

# Spectrogram
spectrogram = librosa.feature.melspectrogram(y=audio, sr=sr)
librosa.display.specshow(librosa.power_to_db(spectrogram, ref=np.max),
                         sr=sr, x_axis='time', y_axis='mel')
plt.title("Mel Spectrogram")
plt.savefig("reports/spectrogram.png")
plt.close()

print("Features generated and saved in reports/")
