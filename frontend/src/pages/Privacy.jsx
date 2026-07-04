import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const API = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export default function Privacy() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [deletingHistory, setDeletingHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const deleteHistory = async () => {
    if (confirmText !== "DELETE") {
      toast.error('Type "DELETE" to confirm');
      return;
    }
    setDeletingHistory(true);
    try {
      const res = await fetch(`${API}/history/all`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("All analysis history deleted");
      setShowDeleteConfirm(false);
      setConfirmText("");
    } catch {
      toast.error("Failed to delete history");
    } finally {
      setDeletingHistory(false);
    }
  };

  const sections = [
    {
      icon: "🗄️",
      title: "Data We Store",
      items: [
        "Your email address and display name",
        "Speech analysis results and confidence scores",
        "Breakdown percentages (repetition, prolongation, block)",
        "Timestamps of each analysis session",
      ],
    },
    {
      icon: "🚫",
      title: "Data We Do NOT Store",
      items: [
        "Your raw audio files — they are processed and discarded",
        "Payment or financial information",
        "Location or device data",
        "Third-party browsing activity",
      ],
    },
    {
      icon: "🔐",
      title: "How We Protect Your Data",
      items: [
        "Passwords are hashed using PBKDF2-SHA256 with a unique salt",
        "All API requests require a signed JWT token",
        "Google login uses OAuth 2.0 — we never see your Google password",
        "HTTPS encryption in production",
      ],
    },
  ];

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* HEADER */}
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => navigate("/settings")}>← Back</button>
          <div>
            <h1 style={s.title}>Privacy & Security</h1>
            <p style={s.sub}>Understand how your data is used and protected</p>
          </div>
        </div>

        {/* INFO SECTIONS */}
        {sections.map((sec) => (
          <div key={sec.title} style={s.card}>
            <div style={s.secHeader}>
              <span style={{ fontSize: 24 }}>{sec.icon}</span>
              <h2 style={s.secTitle}>{sec.title}</h2>
            </div>
            <ul style={s.list}>
              {sec.items.map((item) => (
                <li key={item} style={s.listItem}>
                  <span style={s.dot}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* SESSION INFO */}
        <div style={s.card}>
          <div style={s.secHeader}>
            <span style={{ fontSize: 24 }}>🖥️</span>
            <h2 style={s.secTitle}>Active Session</h2>
          </div>
          <div style={s.sessionRow}>
            <div>
              <div style={s.rowLabel}>Logged in as</div>
              <div style={s.rowValue}>{user?.email}</div>
            </div>
            <span style={s.activeBadge}>● Active</span>
          </div>
          <div style={s.divider} />
          <div style={s.sessionRow}>
            <div>
              <div style={s.rowLabel}>Login method</div>
              <div style={s.rowValue}>{user?.provider === "google" ? "Google OAuth" : "Email & Password"}</div>
            </div>
            <button style={s.signOutBtn} onClick={() => { logout(); navigate("/login"); }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div style={{ ...s.card, border: "1.5px solid #fecaca" }}>
          <div style={s.secHeader}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <h2 style={{ ...s.secTitle, color: "#dc2626" }}>Danger Zone</h2>
          </div>

          <div style={s.dangerRow}>
            <div>
              <div style={s.rowLabel}>Delete Analysis History</div>
              <div style={s.rowDesc}>Permanently remove all your past speech analysis records</div>
            </div>
            <button style={s.dangerBtn} onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}>
              🗑️ Delete History
            </button>
          </div>

          {showDeleteConfirm && (
            <div style={s.confirmBox}>
              <p style={{ fontSize: 14, color: "#374151", marginBottom: 10 }}>
                Type <b>DELETE</b> to confirm. This action cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  style={s.confirmInput}
                  placeholder='Type "DELETE"'
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
                <button
                  style={{ ...s.dangerBtn, opacity: confirmText === "DELETE" ? 1 : 0.5 }}
                  onClick={deleteHistory}
                  disabled={deletingHistory}
                >
                  {deletingHistory ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#f5f3ff,#fdf2f8,#fff7ed)",
    padding: "40px 20px",
  },
  container: { maxWidth: 620, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 },
  header: { display: "flex", alignItems: "flex-start", gap: 16 },
  backBtn: {
    padding: "8px 16px", borderRadius: 10, border: "1.5px solid #e5e7eb",
    background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14,
    cursor: "pointer", whiteSpace: "nowrap", marginTop: 4,
  },
  title: { fontSize: 26, fontWeight: 800, color: "#111", margin: "0 0 4px" },
  sub: { fontSize: 14, color: "#6b7280", margin: 0 },
  card: {
    background: "#fff", borderRadius: 20, padding: "24px 28px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)", border: "1px solid rgba(196,132,252,0.1)",
  },
  secHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  secTitle: { fontSize: 16, fontWeight: 700, color: "#111", margin: 0 },
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  listItem: { display: "flex", gap: 10, fontSize: 14, color: "#374151", lineHeight: 1.6 },
  dot: { color: "#7c3aed", fontWeight: 800, flexShrink: 0 },
  divider: { height: 1, background: "#f3f4f6", margin: "12px 0" },
  sessionRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" },
  rowLabel: { fontSize: 13, color: "#6b7280", marginBottom: 2 },
  rowValue: { fontSize: 15, fontWeight: 600, color: "#111" },
  rowDesc: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  activeBadge: {
    background: "#dcfce7", color: "#16a34a", fontSize: 13,
    fontWeight: 700, padding: "4px 12px", borderRadius: 999,
  },
  signOutBtn: {
    padding: "8px 16px", borderRadius: 10, border: "1.5px solid #e5e7eb",
    background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer",
  },
  dangerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" },
  dangerBtn: {
    padding: "9px 16px", borderRadius: 10, border: "none",
    background: "#fef2f2", color: "#dc2626", fontWeight: 700, fontSize: 13, cursor: "pointer",
    whiteSpace: "nowrap",
  },
  confirmBox: {
    marginTop: 16, padding: "16px", background: "#fef2f2",
    borderRadius: 12, border: "1px solid #fecaca",
  },
  confirmInput: {
    flex: 1, padding: "9px 12px", borderRadius: 10,
    border: "1.5px solid #fca5a5", fontSize: 14, outline: "none",
  },
};
