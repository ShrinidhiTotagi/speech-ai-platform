// src/pages/Profile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import "../index.css";

export default function Profile() {
  const { user } = useAuth();
  const email = user?.email || "Unknown";
  const avatar = email.charAt(0).toUpperCase();

  return (
    <div className="profile-page">

      <div className="profile-cover">
        <div className="profile-avatar-large">{avatar}</div>
        <h1 className="profile-name">{email}</h1>
        
      </div>

      <div className="profile-info-card">
        <div className="profile-row">
          <span>Account Email</span>
          <span>{email}</span>
        </div>

        <div className="profile-row">
          <span>Membership</span>
          <span className="premium-badge">Free User</span>
        </div>

        <div className="profile-row">
          <span>Last Updated</span>
          <span>Just now</span>
        </div>
      </div>
    </div>
  );
}
