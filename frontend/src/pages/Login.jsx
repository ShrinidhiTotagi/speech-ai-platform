import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../index.css";

// Backend API
const API = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth(); // ✅ IMPORTANT
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ================= EMAIL LOGIN =================
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(form.email, form.password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        alert(result.message || "Login failed");
      }
    } catch {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = async (googleIdToken) => {
    try {
      const res = await axios.post(
        `${API}/auth/google`,
        { token: googleIdToken },
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ UPDATE AUTH CONTEXT (THIS FIXES REDIRECT)
      googleLogin(res.data.token);

      // ✅ NOW REDIRECT WORKS
      navigate("/dashboard");
    } catch (err) {
      console.error("GOOGLE LOGIN ERROR:", err.response || err);
      alert(err.response?.data?.detail || "Google login failed");
    }
  };

  // ================= UI =================
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Choose a method to sign in</p>

        {/* GOOGLE LOGIN */}
        <GoogleLogin
          onSuccess={(response) => {
            if (!response.credential) {
              alert("No Google credential received");
              return;
            }
            handleGoogleLogin(response.credential);
          }}
          onError={() => alert("Google login popup error")}
        />

        <div className="divider">
          <span>OR</span>
        </div>

        {/* EMAIL LOGIN */}
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <a href="/signup">Create one</a>
        </p>
      </div>
    </div>
  );
}
