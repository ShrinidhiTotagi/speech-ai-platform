// src/pages/Therapy/PracticeTherapy.jsx
import React from "react";
import "../../index.css";

export default function PracticeTherapy() {
  return (
    <div className="therapy-detail-page">

      <h1 className="therapy-detail-title">Practice Exercises</h1>
     <p className="highlight-sub">
  Short, daily routines to improve fluency over time.
</p>


      <div className="therapy-detail-card">
        
        <h2 className="section-header">Daily Fluency Routine</h2>

        <ul className="detail-list">
          <li><strong>Warm-up (5 min):</strong> Breathing & gentle humming.</li>
          <li><strong>Speak slowly (10 min):</strong> Read passages with extended vowels.</li>
          <li><strong>Controlled repetition (10 min):</strong> Practice phrases with easy onsets.</li>
          <li><strong>Real-world practice:</strong> Short conversations applying techniques.</li>
        </ul>

      </div>

    </div>
  );
}
