// src/pages/Help.jsx
import React from "react";
import "../index.css";

export default function Help() {
  return (
    <div className="help-page">
      <h1 className="help-title">Help & Support</h1>
      <p className="help-sub">Find answers or contact our team.</p>

      <div className="help-card">
        <details className="faq-item">
          <summary>How does the analysis work?</summary>
          <p>We extract audio features and run our trained model to estimate stutter probability and breakdowns.</p>
        </details>

        <details className="faq-item">
          <summary>Is my data private?</summary>
          <p>Audio files are sent to the backend and logged for your history. You control the account and can delete history from the dashboard.</p>
        </details>

        <details className="faq-item">
          <summary>Why are some files not analyzed?</summary>
          <p>Upload valid audio files (WAV/MP3/WEBM/OGG). Very short or corrupted files might fail decoding.</p>
        </details>
      </div>

      <div className="help-support">
        <h2>Still need help?</h2>
        <button className="therapy-btn">Contact Support</button>
      </div>
    </div>
  );
}
