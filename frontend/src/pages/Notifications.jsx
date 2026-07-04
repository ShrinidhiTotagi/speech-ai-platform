import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const API = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

const DEFAULTS = {
  analysisComplete: true,
  weeklyReport: false,
  therapyReminder: true,
  progressMilestone: true,
  emailAlerts: true,
  browserAlerts: false,
};

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API}/auth/settings`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.settings?.notifications) {
        setPrefs({ ...DEFAULTS, ...data.settings.notifications });
      }
    } catch {}
  };

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/auth/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ notifications: prefs }),
      });
      if (!res.ok) throw new Error();
      toast.success("Notification preferences saved!");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const groups = [
    {
      title: "Activity Notifications",
      icon: "🔔",
      items: [
        { key: "analysisComplete", label: "Analysis Complete", desc: "Notify when speech analysis finishes" },
        { key: "progressMilestone", label: "Progress Milestones", desc: "Celebrate when you hit a new milestone" },
        { key: "therapyReminder", label: "Therapy Reminders", desc: "Daily reminder to complete therapy exercises" },
        { key: "weeklyReport", label: "Weekly Report", desc: "Get a summary of your weekly progress" },
      ],
    },
    {
      title: "Delivery Channels",
      icon: "📬",
      items: [
        { key: "emailAlerts", label: "Email Notifications", desc: "Receive updates via email" },
        { key: "browserAlerts", label: "Browser Notifications", desc: "Show desktop push notifications" },
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
            <h1 style={s.title}>Notifications</h1>
            <p style={s.sub}>Control how and when you receive updates</p>
          </div>
        </div>

        {groups.map((group) => (
          <div key={group.title} style={s.card}>
            <div style={s.groupHeader}>
              <span style={{ fontSize: 22 }}>{group.icon}</span>
              <h2 style={s.groupTitle}>{group.title}</h2>
            </div>
            {group.items.map((item, i) => (
              <div key={item.key}>
                {i > 0 && <div style={s.divider} />}
                <div style={s.row}>
                  <div>
                    <div style={s.rowLabel}>{item.label}</div>
                    <div style={s.rowDesc}>{item.desc}</div>
                  </div>
                  <Toggle on={prefs[item.key]} onToggle={() => toggle(item.key)} />
                </div>
              </div>
            ))}
          </div>
        ))}

        <button style={s.saveBtn} onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{ ...s.track, background: on ? "#7c3aed" : "#d1d5db" }}>
      <div style={{ ...s.thumb, transform: on ? "translateX(22px)" : "translateX(2px)" }} />
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
    background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer",
    whiteSpace: "nowrap", marginTop: 4,
  },
  title: { fontSize: 26, fontWeight: 800, color: "#111", margin: "0 0 4px" },
  sub: { fontSize: 14, color: "#6b7280", margin: 0 },
  card: {
    background: "#fff", borderRadius: 20, padding: "24px 28px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)", border: "1px solid rgba(196,132,252,0.1)",
  },
  groupHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  groupTitle: { fontSize: 16, fontWeight: 700, color: "#111", margin: 0 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" },
  rowLabel: { fontSize: 15, fontWeight: 600, color: "#111" },
  rowDesc: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  divider: { height: 1, background: "#f3f4f6" },
  track: {
    width: 46, height: 26, borderRadius: 999, cursor: "pointer",
    position: "relative", transition: "background 0.25s", flexShrink: 0,
  },
  thumb: {
    position: "absolute", top: 3, width: 20, height: 20,
    borderRadius: "50%", background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)", transition: "transform 0.25s",
  },
  saveBtn: {
    padding: "14px", borderRadius: 14, border: "none",
    background: "linear-gradient(90deg,#7c3aed,#ec4899)",
    color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer",
  },
};
