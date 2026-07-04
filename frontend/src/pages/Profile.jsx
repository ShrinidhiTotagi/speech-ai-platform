import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: "", email: "", created_at: null, provider: "password" });
  const [stats, setStats] = useState({ total: 0, stuttering: 0, normal: 0 });
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPwSection, setShowPwSection] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchProfile();
    fetchStats();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/auth/profile`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setProfile(data);
      setNameInput(data.name || "");
    } catch {
      toast.error("Could not load profile");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/history`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      const history = data.history || [];
      setStats({
        total: history.length,
        stuttering: history.filter((h) => h.status === "Stuttering Detected").length,
        normal: history.filter((h) => h.status === "Normal Speech").length,
      });
    } catch {}
  };

  const saveName = async () => {
    setSavingName(true);
    try {
      const res = await fetch(`${API}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ name: nameInput }),
      });
      if (!res.ok) throw new Error();
      setProfile((p) => ({ ...p, name: nameInput }));
      setEditName(false);
      toast.success("Name updated!");
    } catch {
      toast.error("Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { toast.error("Passwords do not match"); return; }
    if (pwForm.next.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setSavingPw(true);
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ current_password: pwForm.current, new_password: pwForm.next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed");
      toast.success("Password changed successfully!");
      setPwForm({ current: "", next: "", confirm: "" });
      setShowPwSection(false);
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSavingPw(false);
    }
  };

  const email = profile.email || user?.email || "";
  const displayName = profile.name || email.split("@")[0];
  const avatar = displayName.charAt(0).toUpperCase();
  const joinedDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* ── COVER CARD ── */}
        <div style={s.cover}>
          <div style={s.avatarRing}>
            <div style={s.avatar}>{avatar}</div>
          </div>
          <h1 style={s.coverName}>{displayName}</h1>
          <p style={s.coverEmail}>{email}</p>
          <div style={s.badges}>
            <span style={s.badge}>
              {profile.provider === "google" ? "🔵 Google Account" : "📧 Email Account"}
            </span>
            <span style={{ ...s.badge, background: "rgba(255,255,255,0.25)" }}>
              ✅ Active
            </span>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div style={s.statsRow}>
          {[
            { label: "Total Analyses", value: stats.total, icon: "🎙️", color: "#7c3aed" },
            { label: "Stuttering Detected", value: stats.stuttering, icon: "⚠️", color: "#ef4444" },
            { label: "Normal Speech", value: stats.normal, icon: "✅", color: "#16a34a" },
          ].map((st) => (
            <div key={st.label} style={s.statCard}>
              <div style={{ fontSize: 28 }}>{st.icon}</div>
              <div style={{ ...s.statValue, color: st.color }}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* ── PROFILE INFO ── */}
        <div style={s.card}>
          <h2 style={s.sectionTitle}>Profile Information</h2>

          {/* Name row */}
          <div style={s.row}>
            <div>
              <div style={s.rowLabel}>Display Name</div>
              {editName ? (
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <input
                    style={s.inlineInput}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your name"
                    autoFocus
                  />
                  <button style={s.saveBtn} onClick={saveName} disabled={savingName}>
                    {savingName ? "..." : "Save"}
                  </button>
                  <button style={s.cancelBtn} onClick={() => setEditName(false)}>Cancel</button>
                </div>
              ) : (
                <div style={s.rowValue}>{profile.name || <span style={{ color: "#9ca3af" }}>Not set</span>}</div>
              )}
            </div>
            {!editName && (
              <button style={s.editBtn} onClick={() => setEditName(true)}>✏️ Edit</button>
            )}
          </div>

          <div style={s.divider} />

          <div style={s.row}>
            <div>
              <div style={s.rowLabel}>Email Address</div>
              <div style={s.rowValue}>{email}</div>
            </div>
            <span style={s.verifiedBadge}>✓ Verified</span>
          </div>

          <div style={s.divider} />

          <div style={s.row}>
            <div>
              <div style={s.rowLabel}>Member Since</div>
              <div style={s.rowValue}>{joinedDate}</div>
            </div>
          </div>

          <div style={s.divider} />

          <div style={s.row}>
            <div>
              <div style={s.rowLabel}>Login Method</div>
              <div style={s.rowValue}>{profile.provider === "google" ? "Google OAuth" : "Email & Password"}</div>
            </div>
          </div>
        </div>

        {/* ── CHANGE PASSWORD ── */}
        {profile.provider !== "google" && (
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={s.sectionTitle}>Security</h2>
              <button style={s.editBtn} onClick={() => setShowPwSection(!showPwSection)}>
                {showPwSection ? "Cancel" : "🔒 Change Password"}
              </button>
            </div>

            {showPwSection && (
              <form onSubmit={changePassword} style={{ marginTop: 20 }}>
                {[
                  { key: "current", label: "Current Password", placeholder: "Enter current password" },
                  { key: "next", label: "New Password", placeholder: "Min. 8 characters" },
                  { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label style={s.rowLabel}>{label}</label>
                    <div style={{ position: "relative", marginTop: 6 }}>
                      <input
                        type={showPw[key] ? "text" : "password"}
                        style={{ ...s.inlineInput, width: "100%", paddingRight: 40 }}
                        placeholder={placeholder}
                        value={pwForm[key]}
                        onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        style={s.eyeBtn}
                        onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}
                      >
                        {showPw[key] ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                ))}
                <button type="submit" style={s.submitBtn} disabled={savingPw}>
                  {savingPw ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── DANGER ZONE ── */}
        <div style={{ ...s.card, border: "1px solid #fecaca" }}>
          <h2 style={{ ...s.sectionTitle, color: "#dc2626" }}>Account Actions</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <button
              style={s.dangerBtn}
              onClick={() => { logout(); navigate("/login"); }}
            >
              🚪 Sign Out
            </button>
            <button
              style={{ ...s.dangerBtn, background: "#fff", color: "#6b7280", border: "1px solid #e5e7eb" }}
              onClick={() => navigate("/dashboard")}
            >
              📊 View Dashboard
            </button>
          </div>
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
  container: { maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 },
  cover: {
    background: "linear-gradient(135deg,#7c3aed,#9333ea,#ec4899)",
    borderRadius: 24,
    padding: "48px 32px 36px",
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 20px 50px rgba(124,58,237,0.3)",
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    border: "3px solid rgba(255,255,255,0.5)",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "#fff",
    color: "#7c3aed",
    fontSize: 34,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  coverName: { fontSize: 26, fontWeight: 700, margin: "0 0 4px" },
  coverEmail: { fontSize: 14, opacity: 0.85, margin: "0 0 16px" },
  badges: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" },
  badge: {
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 999,
    padding: "5px 14px",
    fontSize: 13,
    fontWeight: 600,
  },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 },
  statCard: {
    background: "#fff",
    borderRadius: 18,
    padding: "20px 16px",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid rgba(196,132,252,0.12)",
  },
  statValue: { fontSize: 28, fontWeight: 800, margin: "8px 0 4px" },
  statLabel: { fontSize: 12, color: "#6b7280", fontWeight: 500 },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "28px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid rgba(196,132,252,0.1)",
  },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: "#111", margin: "0 0 4px" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" },
  rowLabel: { fontSize: 13, color: "#6b7280", fontWeight: 500 },
  rowValue: { fontSize: 15, fontWeight: 600, color: "#111", marginTop: 2 },
  divider: { height: 1, background: "#f3f4f6" },
  inlineInput: {
    padding: "9px 12px",
    borderRadius: 10,
    border: "1.5px solid #e5e7eb",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  saveBtn: {
    padding: "9px 16px",
    borderRadius: 10,
    border: "none",
    background: "#7c3aed",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "9px 16px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#6b7280",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  editBtn: {
    padding: "7px 14px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fafafa",
    color: "#374151",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  verifiedBadge: {
    background: "#dcfce7",
    color: "#16a34a",
    fontSize: 12,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 999,
  },
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
  submitBtn: {
    padding: "11px 24px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(90deg,#7c3aed,#ec4899)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    marginTop: 4,
  },
  dangerBtn: {
    padding: "10px 20px",
    borderRadius: 12,
    border: "none",
    background: "#fef2f2",
    color: "#dc2626",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
};
