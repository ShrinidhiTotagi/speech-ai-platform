// src/pages/VerifyOTP.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export default function VerifyOTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    setMessage("Sending OTP...");
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) setMessage("OTP sent to your email ✔️");
    else setMessage(data.detail || "Error sending OTP ❌");
  };

  const verifyOtp = async () => {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Verification Successful ✔️");
      setTimeout(() => navigate("/login"), 1000);
    } else setMessage(data.detail || "Invalid OTP ❌");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Verify Email OTP</h2>

        <input
          className="auth-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="auth-btn" onClick={sendOtp}>
          Send OTP
        </button>

        <input
          className="auth-input"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="auth-btn" onClick={verifyOtp}>
          Verify OTP
        </button>

        <p className="text-center mt-3 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
