// src/components/AudioRecorder.jsx
import React, { useRef, useState, useEffect } from "react";

const AudioRecorder = ({ onRecordingComplete, authorizeStart }) => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
        setProgressWidth((w) => (w >= 100 ? 0 : w + 2));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTime = (t) => {
    const mm = String(Math.floor(t / 60)).padStart(2, "0");
    const ss = String(t % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const startRecording = async () => {
    if (authorizeStart && !authorizeStart()) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];
      setAudioUrl(null);

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onRecordingComplete && onRecordingComplete(blob);
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {}
      };

      mr.start();
      setIsRecording(true);
      setIsPaused(false);
      setTimer(0);
      setProgressWidth(0);

    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    try {
      mr.stop();
    } catch {}
    setIsRecording(false);
    setIsPaused(false);
    setProgressWidth(0);
  };

  const pauseRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr?.state === "recording") {
      try {
        mr.pause();
        setIsPaused(true);
      } catch {}
    }
  };

  const resumeRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr?.state === "paused") {
      try {
        mr.resume();
        setIsPaused(false);
      } catch {}
    }
  };

  const renderBars = () => {
    return Array.from({ length: 14 }).map((_, i) => (
      <span
        key={i}
        className="w-2 bg-purple-300 rounded-full animate-pulse"
        style={{ height: `${12 + i * 5}px` }}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100">
      <h3 className="text-xl font-semibold text-purple-600 mb-4 text-center">
        Record Live Audio
      </h3>

      {!isRecording ? (
        <>
          <button
            className="px-6 py-3 w-full rounded-xl text-white font-medium
                       bg-gradient-to-r from-orange-400 to-pink-500 shadow-md hover:opacity-90"
            onClick={startRecording}
          >
            Start Recording
          </button>

          <p className="text-center text-gray-500 mt-3 text-sm">
            Use your microphone to record speech.
          </p>
        </>
      ) : (
        <>
          {/* Controls */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              onClick={stopRecording}
            >
              Stop
            </button>

            {!isPaused ? (
              <button
                className="px-5 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
                onClick={pauseRecording}
              >
                Pause
              </button>
            ) : (
              <button
                className="px-5 py-2 bg-purple-300 rounded-lg shadow hover:bg-purple-400"
                onClick={resumeRecording}
              >
                Resume
              </button>
            )}
          </div>

          {/* Fake waveform */}
          <div className="flex items-end justify-center gap-1 mb-4 h-16">
            {renderBars()}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 transition-all"
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          <p className="text-center text-gray-600 text-sm">
            {isPaused ? "Paused" : "Recording"} — {formatTime(timer)}
          </p>
        </>
      )}

      {/* Playback after recording */}
      {audioUrl && !isRecording && (
        <div className="mt-5">
          <p className="text-center text-gray-700 font-medium mb-2">
            Recording Complete
          </p>
          <audio controls src={audioUrl} className="w-full rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
