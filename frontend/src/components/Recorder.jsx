// src/components/Recorder.jsx
import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";

// Recorder provides Start / Stop / Pause controls, timer and returns final Blob via onComplete
export default function Recorder({ onComplete }) {
  const mediaRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      stopAllTracks();
      clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const stopAllTracks = () => {
    try {
      if (mediaRef.current) {
        mediaRef.current.getTracks().forEach((t) => t.stop());
      }
    } catch {}
    mediaRef.current = null;
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = stream;
      chunksRef.current = [];
      // prefer webm or fallback
      const options = [{ mimeType: "audio/webm" }, { mimeType: "audio/webm;codecs=opus" }].find((o) =>
        MediaRecorder.isTypeSupported ? MediaRecorder.isTypeSupported(o.mimeType) : true
      ) || {};

      const mr = new MediaRecorder(stream, options);
      recorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "audio/webm" });
        // give caller the blob
        if (typeof onComplete === "function") onComplete(blob);
        stopAllTracks();
      };

      mr.start();
      setIsRecording(true);
      setIsPaused(false);
      setSeconds(0);
      startTimer();
      toast.success("Recording started");
    } catch (err) {
      console.error("rec start err", err);
      toast.error("Microphone access denied or unavailable");
    }
  };

  const stop = () => {
    try {
      if (recorderRef.current && (recorderRef.current.state === "recording" || recorderRef.current.state === "paused")) {
        recorderRef.current.stop();
      }
    } catch (err) {
      console.warn("stop error", err);
    }
    setIsRecording(false);
    setIsPaused(false);
    stopTimer();
  };

  const pause = () => {
    try {
      if (recorderRef.current && recorderRef.current.state === "recording") {
        recorderRef.current.pause();
        setIsPaused(true);
        stopTimer();
      }
    } catch (err) {
      console.warn("pause error", err);
    }
  };

  const resume = () => {
    try {
      if (recorderRef.current && recorderRef.current.state === "paused") {
        recorderRef.current.resume();
        setIsPaused(false);
        startTimer();
      }
    } catch (err) {
      console.warn("resume error", err);
    }
  };

  const format = (s) => {
    const mm = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-purple-600 mb-3">Record Live Audio</h3>

      {!isRecording ? (
        <div>
          <button onClick={start} className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow">
            Start Recording
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button onClick={stop} className="px-4 py-2 rounded-lg bg-red-500 text-white">Stop</button>

          {!isPaused ? (
            <button onClick={pause} className="px-3 py-2 rounded bg-gray-200">Pause</button>
          ) : (
            <button onClick={resume} className="px-3 py-2 rounded bg-gray-200">Resume</button>
          )}

          <div className="ml-4 text-sm text-gray-600">Recording — {format(seconds)}</div>
        </div>
      )}
    </div>
  );
}
