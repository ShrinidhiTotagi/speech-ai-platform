import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="settings-wrapper">

      {/* HEADER */}
      <div className="settings-header">
        <button className="settings-back" onClick={() => navigate(-1)}>←</button>
        <h1>Settings</h1>
      </div>

      {/* SETTINGS LIST */}
      <div className="settings-list-card">

        <SettingItem
          icon="👤"
          title="Account"
          subtitle="Profile, email, login method"
          onClick={() => navigate("/profile")}
        />

        <SettingItem
          icon="🔔"
          title="Notifications"
          subtitle="Session updates & alerts"
          onClick={() => navigate("/notifications")}
        />

        <SettingItem
          icon="🔒"
          title="Privacy & Security"
          subtitle="Data usage & protection"
          onClick={() => navigate("/privacy")}
        />

        <SettingItem
          icon="💬"
          title="Help & Support"
          subtitle="FAQs and contact support"
          onClick={() => navigate("/contact")}
        />

        <SettingItem
          icon="ℹ️"
          title="About"
          subtitle="FluencyAssist information"
          onClick={() => navigate("/about")}
          last
        />

      </div>
    </div>
  );
}

/* SINGLE ROW COMPONENT */
function SettingItem({ icon, title, subtitle, onClick, last }) {
  return (
    <div
      className={`settings-item ${last ? "last" : ""}`}
      onClick={onClick}
    >
      <div className="settings-item-left">
        <span className="settings-icon">{icon}</span>
        <div>
          <div className="settings-title">{title}</div>
          <div className="settings-subtitle">{subtitle}</div>
        </div>
      </div>

      <div className="settings-arrow">›</div>
    </div>
  );
}
