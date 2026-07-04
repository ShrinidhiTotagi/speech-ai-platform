import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const API = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (location.state?.message) toast.success(location.state.message);
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate("/dashboard");
    else setError(result.message || "Login failed");
  };

  const handleGoogleLogin = async (googleIdToken) => {
    setError("");
    try {
      const res = await axios.post(`${API}/auth/google`, { token: googleIdToken });
      googleLogin(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Google login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🎙️</div>
          <span style={styles.brandName}>FluencyAssist</span>
        </div>

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.sub}>Sign in to continue your journey</p>

        {/* Google */}
        <div style={styles.googleWrap}>
          <GoogleLogin
            onSuccess={(r) => r.credential && handleGoogleLogin(r.credential)}
            onError={() => setError("Google login failed")}
            width="100%"
            theme="outline"
            shape="rectangular"
            text="signin_with"
          />
        </div>

        <div style={styles.divider}><span style={styles.dividerText}>or continue with email</span></div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleEmailLogin}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label style={styles.label}>Password</label>
            </div>
            <div style={styles.passWrap}>
              <input
                type={showPass ? "text" : "password"}
                style={{ ...styles.input, paddingRight: 44 }}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 50%, #fff7ed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: 24,
    padding: "44px 40px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 20px 60px rgba(124,58,237,0.12)",
    border: "1px solid rgba(196,132,252,0.15)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
    justifyContent: "center",
  },
  brandIcon: { fontSize: 28 },
  brandName: {
    fontSize: 20,
    fontWeight: 800,
    background: "linear-gradient(90deg,#7c3aed,#ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  title: { fontSize: 26, fontWeight: 700, color: "#111", textAlign: "center", margin: 0 },
  sub: { fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 6, marginBottom: 24 },
  googleWrap: { display: "flex", justifyContent: "center", marginBottom: 20 },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
    gap: 12,
  },
  dividerText: {
    fontSize: 13,
    color: "#9ca3af",
    whiteSpace: "nowrap",
    flex: 1,
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
    paddingTop: 0,
    position: "relative",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 14,
    marginBottom: 16,
  },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1.5px solid #e5e7eb",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    background: "#fafafa",
  },
  passWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    padding: 0,
  },
  btn: {
    width: "100%",
    padding: "13px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(90deg,#7c3aed,#ec4899)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
    transition: "opacity 0.2s",
  },
  footer: { textAlign: "center", fontSize: 14, color: "#6b7280", marginTop: 20 },
  link: { color: "#7c3aed", fontWeight: 600, textDecoration: "none" },
};
