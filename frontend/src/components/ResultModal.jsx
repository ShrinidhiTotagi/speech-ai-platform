// src/components/ResultModal.jsx
import React, { useEffect, useRef } from "react";
import "../index.css";

export default function ResultModal({ isOpen, onClose, result }) {
  const canvasRef = useRef(null);

  if (!isOpen || !result) return null;

  const confidenceValue = parseInt(
    String(result.confidence).replace("%", "")
  );

  /* ───────────────────────────────────────────────
     OPTIONAL WAVEFORM RENDERING (if backend supplies)
  ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!result.waveform || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const arr = result.waveform;

    canvas.width = 800;
    canvas.height = 140;

    ctx.fillStyle = "#0f1724";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#a855f7"; // purple-500
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < canvas.width; i++) {
      const idx = Math.floor(i * (arr.length / canvas.width));
      const v = arr[idx] || 0;
      const y = canvas.height - v * canvas.height;
      i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
    }

    ctx.stroke();
  }, [result]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Title */}
        <h2 className="modal-title">Speech Analysis Report</h2>

        {/* Confidence Gauge */}
        <div className="gauge-wrapper">
          <div className="gauge-circle">
            <svg width="160" height="160">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#f3d0ff"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#ff3c8a"
                strokeWidth="12"
                fill="none"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={
                  (2 * Math.PI * 70) * (1 - confidenceValue / 100)
                }
                strokeLinecap="round"
                style={{ transition: "0.4s ease" }}
              />
            </svg>
            <div className="gauge-text">{confidenceValue}%</div>
          </div>
        </div>

        {/* Status */}
        <div className="modal-status">{result.status}</div>

        {/* Details */}
        <p className="modal-details">{result.details}</p>

        {/* Filename + Timestamp */}
        <p className="text-sm text-gray-500 mt-1">
          {result.filename || "Unknown file"} •{" "}
          {result.timestamp
            ? new Date(result.timestamp).toLocaleString()
            : ""}
        </p>

        {/* Waveform (optional) */}
        {result.waveform && (
          <canvas
            ref={canvasRef}
            className="w-full rounded-xl mt-4"
            height={140}
          />
        )}

        {/* Buttons */}
        <div className="modal-btn-row">
          <button
            className="modal-btn primary"
            onClick={() => {
              const blob = new Blob(
                [
                  `Speech Analysis Report\n\nStatus: ${
                    result.status
                  }\nConfidence: ${result.confidence}\nDetails: ${
                    result.details
                  }\nTimestamp: ${new Date(
                    result.timestamp
                  ).toLocaleString()}`,
                ],
                { type: "text/plain" }
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "analysis_report.txt";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download Report
          </button>

          <button className="modal-btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
