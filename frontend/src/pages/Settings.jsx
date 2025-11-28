// src/pages/Settings.jsx
import React, { useState } from "react";
import "../index.css";

export default function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [aiTips, setAiTips] = useState(true);

  return (
    <div className="page-wrapper">

      {/* TITLE */}
      <h1 className="page-title">Settings</h1>
      <p className="highlight-sub">Customize your Stutter AI experience</p>

      {/* CARD */}
      <div className="settings-card-pro">

        <div className="settings-row-pro">
          <span>Email Alerts</span>
          <label className="switch-pro">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={() => setEmailAlerts(!emailAlerts)}
            />
            <span className="slider-pro"></span>
          </label>
        </div>

        <div className="settings-row-pro">
          <span>Dark Mode</span>
          <label className="switch-pro">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider-pro"></span>
          </label>
        </div>

        <div className="settings-row-pro">
          <span>AI Suggestion Tips</span>
          <label className="switch-pro">
            <input
              type="checkbox"
              checked={aiTips}
              onChange={() => setAiTips(!aiTips)}
            />
            <span className="slider-pro"></span>
          </label>
        </div>

        <div className="settings-row-pro">
          <span>Language</span>
          <select className="settings-select-pro">
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Hindi</option>
            <option>Kannada</option>
          </select>
        </div>

      </div>

    </div>
  );
}
