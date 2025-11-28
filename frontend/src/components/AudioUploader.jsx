// src/components/AudioUploader.jsx
import React, { useRef, useState } from "react";

const AudioUploader = ({ onFileSelected, authorizeStart }) => {
  const inputRef = useRef(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const chooseFile = () => {
    if (authorizeStart && !authorizeStart()) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const valid = ["audio/wav", "audio/mp3", "audio/mpeg", "audio/webm", "audio/ogg"];
    const maxMB = 20;

    if (!valid.includes(f.type)) {
      alert("Invalid file type. Upload WAV, MP3, WEBM, or OGG.");
      return;
    }

    if (f.size / 1024 / 1024 > maxMB) {
      alert(`File too large — must be < ${maxMB}MB`);
      return;
    }

    setFileInfo({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2),
      type: f.type.split("/")[1].toUpperCase(),
    });

    setAudioUrl(URL.createObjectURL(f));
    onFileSelected && onFileSelected(f);
  };

  const removeFile = () => {
    setAudioUrl(null);
    setFileInfo(null);
    inputRef.current.value = "";
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
      <h3 className="text-xl font-semibold text-purple-600 mb-4 text-center">
        Upload Audio File
      </h3>

      {!fileInfo ? (
        <>
          <button
            onClick={chooseFile}
            className="w-full px-6 py-3 rounded-xl text-white font-medium
                       bg-gradient-to-r from-orange-400 to-pink-500 shadow-md hover:opacity-90 transition"
          >
            Choose File
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <p className="text-center text-gray-500 text-sm mt-4">
            Supported: WAV, MP3, WEBM, OGG — Max 20MB
          </p>
        </>
      ) : (
        <>
          <div className="text-center text-gray-700 font-medium">
            {fileInfo.name} — {fileInfo.size} MB
          </div>

          <audio controls src={audioUrl} className="w-full mt-4 rounded-lg shadow-sm" />

          <button
            onClick={removeFile}
            className="mt-4 w-full px-4 py-2 rounded-lg text-red-600 border border-red-400
                       hover:bg-red-50 transition"
          >
            Remove File
          </button>
        </>
      )}
    </div>
  );
};

export default AudioUploader;
