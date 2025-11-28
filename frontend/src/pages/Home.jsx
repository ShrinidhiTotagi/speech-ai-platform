import React, { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// FIXED imports
import AudioRecorder from "../components/AudioRecorder";
import AudioUploader from "../components/AudioUploader";
import ResultsSection from "../components/ResultsSection";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    return () => {
      if (wavesurferRef.current) wavesurferRef.current.destroy();
    };
  }, []);

  const ensureLoginThen = (cb) => {
    if (!user) {
      toast("Please login to continue", { icon: "🔒" });
      setTimeout(() => navigate("/login"), 700);
      return false;
    }
    cb();
    return true;
  };

  const renderWaveform = (audioURL) => {
    if (wavesurferRef.current) wavesurferRef.current.destroy();

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#f1c5e8",
      progressColor: "#a184ff",
      cursorColor: "white",
      barWidth: 2,
      height: 100,
    });

    wavesurferRef.current.load(audioURL);
  };

  const onFileSelected = (file) => {
    ensureLoginThen(() => {
      setSelectedFile(file);
      setRecordedBlob(null);
      setAnalysisResult(null);
      renderWaveform(URL.createObjectURL(file));
      toast.success(`File selected: ${file.name}`);
    });
  };

  const onRecordingComplete = (blob) => {
    ensureLoginThen(() => {
      setRecordedBlob(blob);
      setSelectedFile(null);
      setAnalysisResult(null);
      renderWaveform(URL.createObjectURL(blob));
      toast.success("Recording saved");
    });
  };

  const handleAnalyze = async () => {
    if (!user) {
      toast.error("Login required");
      navigate("/login");
      return;
    }

    const audio = selectedFile || recordedBlob;

    if (!audio) {
      toast.error("Please record or upload audio first");
      return;
    }

    setIsAnalyzing(true);
    toast.loading("Analyzing audio...");

    try {
      const token =
        user?.token ||
        (localStorage.getItem("stutter_user_v1") &&
          JSON.parse(localStorage.getItem("stutter_user_v1")).token);

      if (!token) {
        toast.dismiss();
        toast.error("Invalid session. Please log in again.");
        navigate("/login");
        return;
      }

      const form = new FormData();
      form.append("file", audio, audio.name || "recorded_audio.webm");

      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (res.status === 401) {
        toast.dismiss();
        toast.error("Unauthorized - please login again");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const t = await res.text().catch(() => null);
        toast.dismiss();
        toast.error(`Server error: ${res.status} ${t ? "- " + t : ""}`);
        return;
      }

      const json = await res.json();
      const result = json.result || json;

      setAnalysisResult(result);

      toast.dismiss();
      toast.success("Analysis complete");
    } catch (err) {
      toast.dismiss();
      toast.error("Network or server error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 via-purple-50 to-white py-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* HERO */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-purple-600 drop-shadow-sm">
             Speech Fluency and Stutter Detection 
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Record or upload speech to analyze fluency patterns.
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-purple-100">

          <h2 className="text-center text-3xl font-semibold text-pink-500 mb-10">
            Speech Analysis
          </h2>

          {/* TWO BOXES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Recorder */}
            <div className="p-8 bg-white rounded-2xl shadow-lg border border-purple-100">
              <AudioRecorder
                onRecordingComplete={onRecordingComplete}
                authorizeStart={() => ensureLoginThen(() => true)}
              />
            </div>

            {/* Uploader */}
            <div className="p-8 bg-white rounded-2xl shadow-lg border border-purple-100">
              <AudioUploader
                onFileSelected={onFileSelected}
                selectedFile={selectedFile}
                authorizeStart={() => ensureLoginThen(() => true)}
              />
            </div>

          </div>

          {/* WAVEFORM */}
          <div ref={waveformRef} className="mt-10 mx-auto w-full max-w-3xl"></div>

          {/* ANALYZE BUTTON */}
          <div className="text-center mt-10">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!selectedFile && !recordedBlob)}
              className="px-12 py-4 rounded-full text-white font-semibold shadow-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 disabled:opacity-50 transition-all text-lg"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Speech"}
            </button>
          </div>

          {/* RESULTS */}
          <div className="mt-12">
            <ResultsSection analysisResult={analysisResult} />
          </div>

        </div>
      </div>
    </div>
  );
}
