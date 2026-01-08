import React from "react";
import { useAuth } from "../context/AuthContext";
import "../index.css";

export default function Profile() {
  const { user } = useAuth();
  const email = user?.email || "Unknown";
  const avatar = email.charAt(0).toUpperCase();

  return (
    <div className="profile-page">

      {/* HEADER / COVER */}
      <div className="profile-cover">
        <div className="profile-avatar-large">
          {avatar}
        </div>

        <h1 className="profile-name">
          {email.split("@")[0]}
        </h1>

        <p className="profile-email">
          {email}
        </p>
      </div>

      {/* INFO CARD */}
      <div className="profile-info-card">
        <div className="profile-row">
          <span className="profile-label">Account Email</span>
          <span className="profile-value">{email}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Membership</span>
          <span className="premium-badge">Free User</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Account Status</span>
          <span className="profile-value success">Active</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Last Updated</span>
          <span className="profile-value muted">Just now</span>
        </div>
      </div>

    </div>
  );
}
