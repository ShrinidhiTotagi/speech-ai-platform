import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    category: "Getting Started",
    icon: "🚀",
    items: [
      {
        q: "How does the speech analysis work?",
        a: "We extract mel-spectrogram features from your audio and run them through our trained deep learning model to detect stuttering patterns like repetitions, prolongations, and blocks.",
      },
      {
        q: "What audio formats are supported?",
        a: "We support WAV, MP3, OGG, WEBM, and FLAC formats. For best results, use a clear recording with minimal background noise.",
      },
      {
        q: "How long should my audio clip be?",
        a: "Clips between 3–30 seconds work best. Very short clips (under 1 second) may not produce accurate results.",
      },
    ],
  },
  {
    category: "Privacy & Data",
    icon: "🔒",
    items: [
      {
        q: "Is my audio data private?",
        a: "Your audio is processed on our server and the result is stored in your personal history. Only you can access your history when logged in.",
      },
      {
        q: "Can I delete my analysis history?",
        a: "Yes. You can view and manage all your past analyses from the Dashboard page.",
      },
    ],
  },
  {
    category: "Troubleshooting",
    icon: "🛠️",
    items: [
      {
        q: "Why did my file fail to analyze?",
        a: "This usually happens with corrupted files, unsupported formats, or very short clips. Try re-recording or converting your file to WAV/MP3.",
      },
      {
        q: "Why is my confidence score very low?",
        a: "Low confidence can mean the audio quality is poor, the clip is too short, or there is heavy background noise. Try recording in a quiet environment.",
      },
      {
        q: "I can't log in with Google. What should I do?",
        a: "Make sure pop-ups are allowed in your browser for this site. If the issue persists, try using email/password login instead.",
      },
    ],
  },
  {
    category: "Therapy & Features",
    icon: "🎯",
    items: [
      {
        q: "What is the Therapy section?",
        a: "The Therapy section provides guided exercises for fluency shaping, stuttering modification, and daily practice routines tailored to your needs.",
      },
      {
        q: "How do I download my report?",
        a: "After an analysis, go to your Dashboard, find the result, and click the Download Report button to get a detailed PDF.",
      },
    ],
  },
];

export default function Help() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openItem, setOpenItem] = useState(null);

  const filtered = faqs.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  const toggle = (key) => setOpenItem(openItem === key ? null : key);

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* HERO */}
        <div style={s.hero}>
          <div style={s.heroIcon}>💬</div>
          <h1 style={s.heroTitle}>How can we help you?</h1>
          <p style={s.heroSub}>Search our knowledge base or browse by category</p>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input
              style={s.searchInput}
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button style={s.clearBtn} onClick={() => setSearch("")}>✕</button>
            )}
          </div>
        </div>

        {/* FAQ SECTIONS */}
        {filtered.length === 0 ? (
          <div style={s.noResult}>
            <div style={{ fontSize: 48 }}>🤔</div>
            <p style={{ color: "#6b7280", marginTop: 12 }}>No results found for "<b>{search}</b>"</p>
          </div>
        ) : (
          filtered.map((cat) => (
            <div key={cat.category} style={s.section}>
              <div style={s.catHeader}>
                <span style={s.catIcon}>{cat.icon}</span>
                <h2 style={s.catTitle}>{cat.category}</h2>
              </div>
              <div style={s.faqList}>
                {cat.items.map((item, i) => {
                  const key = `${cat.category}-${i}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={key} style={{ ...s.faqItem, ...(isOpen ? s.faqItemOpen : {}) }}>
                      <button style={s.faqQ} onClick={() => toggle(key)}>
                        <span>{item.q}</span>
                        <span style={{ ...s.chevron, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                          ▾
                        </span>
                      </button>
                      {isOpen && <div style={s.faqA}>{item.a}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* CONTACT SUPPORT CARD */}
        <div style={s.supportCard}>
          <div style={s.supportLeft}>
            <div style={{ fontSize: 40 }}>🙋</div>
            <div>
              <h3 style={s.supportTitle}>Still need help?</h3>
              <p style={s.supportSub}>Our support team is ready to assist you with any issue.</p>
            </div>
          </div>
          <div style={s.supportBtns}>
            <button style={s.primaryBtn} onClick={() => navigate("/contact")}>
              📧 Contact Support
            </button>
            <button style={s.ghostBtn} onClick={() => navigate("/dashboard")}>
              📊 Go to Dashboard
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
  container: { maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 },

  hero: {
    background: "linear-gradient(135deg,#7c3aed,#9333ea,#ec4899)",
    borderRadius: 24,
    padding: "48px 32px",
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 20px 50px rgba(124,58,237,0.25)",
  },
  heroIcon: { fontSize: 48, marginBottom: 12 },
  heroTitle: { fontSize: 32, fontWeight: 800, margin: "0 0 8px" },
  heroSub: { fontSize: 16, opacity: 0.85, margin: "0 0 28px" },
  searchWrap: {
    position: "relative",
    maxWidth: 480,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: { position: "absolute", left: 16, fontSize: 16 },
  searchInput: {
    width: "100%",
    padding: "14px 44px",
    borderRadius: 14,
    border: "none",
    fontSize: 15,
    outline: "none",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  },
  clearBtn: {
    position: "absolute",
    right: 14,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    fontSize: 14,
  },

  noResult: { textAlign: "center", padding: "60px 20px" },

  section: {
    background: "#fff",
    borderRadius: 20,
    padding: "28px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid rgba(196,132,252,0.1)",
  },
  catHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  catIcon: { fontSize: 24 },
  catTitle: { fontSize: 18, fontWeight: 700, color: "#111", margin: 0 },
  faqList: { display: "flex", flexDirection: "column", gap: 10 },
  faqItem: {
    borderRadius: 12,
    border: "1.5px solid #f3f4f6",
    overflow: "hidden",
    transition: "border-color 0.2s",
  },
  faqItemOpen: { border: "1.5px solid #c084fc" },
  faqQ: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
    color: "#111",
    textAlign: "left",
    gap: 12,
  },
  chevron: { fontSize: 18, color: "#7c3aed", transition: "transform 0.2s", flexShrink: 0 },
  faqA: {
    padding: "0 16px 16px",
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 1.7,
    borderTop: "1px solid #f3f4f6",
    paddingTop: 12,
  },

  supportCard: {
    background: "linear-gradient(135deg,#faf5ff,#fdf2f8)",
    borderRadius: 20,
    padding: "32px",
    border: "1px solid rgba(196,132,252,0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 20,
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  },
  supportLeft: { display: "flex", alignItems: "center", gap: 16 },
  supportTitle: { fontSize: 18, fontWeight: 700, color: "#111", margin: "0 0 4px" },
  supportSub: { fontSize: 14, color: "#6b7280", margin: 0 },
  supportBtns: { display: "flex", gap: 12, flexWrap: "wrap" },
  primaryBtn: {
    padding: "11px 22px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(90deg,#7c3aed,#ec4899)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  ghostBtn: {
    padding: "11px 22px",
    borderRadius: 12,
    border: "1.5px solid #e5e7eb",
    background: "#fff",
    color: "#374151",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
};
