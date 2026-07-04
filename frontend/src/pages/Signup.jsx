import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const getStrength = (p) => {
    if (p.length === 0) return { label: "", color: "#e5e7eb", width: "0%" };
    if (p.length < 6) return { label: "Weak", color: "#ef4444", width: "25%" };
    if (p.length < 8) return { label: "Fair", color: "#f97316", width: "50%" };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Good", color: "#eab308", width: "75%" };
    return { label: "Strong", color: "#22c55e", width: "100%" };
  };

  const strength = getStrength(form.password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const result = await signup(form.email, form.password, form.name);
    setLoading(false);
    if (result.success) {
      navigate("/login", { state: { message: "Account created! Please sign in." } });
    } else {
      setError(result.message || "Signup failed");
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

        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.sub}>Start your speech improvement journey</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              style={styles.input}
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

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
            <label style={styles.label}>Password</label>
            <div style={styles.passWrap}>
              <input
                type={showPass ? "text" : "password"}
                style={{ ...styles.input, paddingRight: 44 }}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            {form.password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={styles.strengthBar}>
                  <div style={{ ...styles.strengthFill, width: strength.width, background: strength.color }} />
                </div>
                <span style={{ fontSize: 12, color: strength.color, fontWeight: 600 }}>{strength.label}</span>
              </div>
            )}
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Sign in</Link>
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
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" },
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
  strengthBar: {
    height: 5,
    borderRadius: 4,
    background: "#e5e7eb",
    overflow: "hidden",
    marginBottom: 4,
  },
  strengthFill: { height: "100%", borderRadius: 4, transition: "width 0.3s, background 0.3s" },
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
  },
  footer: { textAlign: "center", fontSize: 14, color: "#6b7280", marginTop: 20 },
  link: { color: "#7c3aed", fontWeight: 600, textDecoration: "none" },
};
