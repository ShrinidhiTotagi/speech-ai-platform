import React, { useState, useEffect, useRef } from "react";

const BOT_NAME = "FluencyBot";

const QUICK_REPLIES = [
  "How to use this app?",
  "How does analysis work?",
  "What is stuttering?",
  "Therapy tips",
  "How to record audio?",
  "What is my dashboard?",
];

const KB = [
  {
    patterns: ["hello", "hi", "hey", "good morning", "good evening", "howdy"],
    response: "Hey there! I'm FluencyBot, your FluencyAssist assistant. I can help you navigate the website, understand your results, or learn about stuttering therapy. What do you need?",
  },
  {
    patterns: ["what is fluencyassist", "about this website", "about fluency assist", "what is this app", "what does this website do", "what is this site"],
    response: "FluencyAssist is an AI-powered speech fluency platform. Here's what it does:\n\n- Analyzes your speech for stuttering patterns\n- Shows confidence scores and breakdowns\n- Provides personalized therapy exercises\n- Tracks your progress over time\n- Generates downloadable reports\n\nIt's built for people who stutter and want to monitor and improve their fluency!",
  },
  {
    patterns: ["how to use", "get started", "where to start", "how to begin", "what do i do first"],
    response: "Getting started is easy:\n\n1. Click Sign Up to create a free account\n2. Go to the Home / Analysis page\n3. Record your voice or upload an audio file\n4. Click Analyze Speech\n5. View your results instantly\n6. Check your Dashboard for history and charts\n\nThat's it!",
  },
  {
    patterns: ["pages", "sections", "navigation", "menu", "what pages", "what sections"],
    response: "FluencyAssist has these main sections:\n\nHome - Record or upload audio for analysis\nDashboard - View history, charts and reports\nTherapy - Guided therapy exercises\nProfile - Edit your name and password\nSettings - Notifications, privacy, account\nContact - Reach our support team\nHelp - FAQs and guides",
  },
  {
    patterns: ["how does analysis work", "how analysis", "how does it work", "how predict", "how model", "how does speech analysis"],
    response: "Here's how the speech analysis works:\n\n1. You record or upload audio on the Home page\n2. The audio is sent to our FastAPI backend\n3. We extract mel-spectrogram features from your voice\n4. A deep learning model analyzes the patterns\n5. You get a confidence score and breakdown of:\n   - Normal speech %\n   - Repetition %\n   - Prolongation %\n   - Block %\n\nResults are saved to your history automatically!",
  },
  {
    patterns: ["upload", "how to upload", "upload audio", "upload file"],
    response: "To upload audio:\n\n1. Go to the Home page\n2. Click the upload area on the right side\n3. Select a WAV, MP3, OGG, WEBM, or FLAC file\n4. You'll see a waveform preview\n5. Click Analyze Speech\n\nTip: Use clear recordings with minimal background noise for best results!",
  },
  {
    patterns: ["record", "how to record", "microphone", "record audio", "record voice"],
    response: "To record your voice:\n\n1. Go to the Home page\n2. Click the microphone button on the left\n3. Allow microphone access when prompted\n4. Speak naturally for 5-30 seconds\n5. Click Stop when done\n6. Click Analyze Speech\n\nTip: Speak a sentence you find challenging for the most accurate results!",
  },
  {
    patterns: ["confidence score", "what is confidence", "confidence mean", "score mean"],
    response: "The confidence score (0-100%) shows how strongly the model detected stuttering:\n\n- 0-40% = Normal speech, low stutter likelihood\n- 41-60% = Mild patterns detected\n- 61-80% = Moderate stuttering detected\n- 81-100% = Strong stuttering patterns\n\nThe breakdown shows which type (repetition, prolongation, block) is most prominent.",
  },
  {
    patterns: ["dashboard", "history", "past results", "my results", "my history"],
    response: "Your Dashboard shows:\n\n- Pie chart: Latest speech breakdown\n- Line chart: Confidence trend over time\n- Bar chart: Stutter pattern frequency\n- Full history: All past analyses with feedback\n- Download report: Get a PDF for any session\n\nGo to Dashboard from the navbar to check it out!",
  },
  {
    patterns: ["report", "download report", "pdf", "download pdf"],
    response: "To download a report:\n\n1. Go to Dashboard\n2. Find the analysis you want\n3. Click Download Report\n4. A report downloads with:\n   - Status and confidence score\n   - Speech breakdown\n   - Personalized feedback\n   - Practice plan",
  },
  {
    patterns: ["therapy", "therapy section", "therapy page", "treatment", "how to treat", "therapy tips"],
    response: "The Therapy section has 3 modules:\n\n1. Fluency Shaping - Techniques to speak more fluently (slow rate, gentle onset, airflow)\n2. Stuttering Modification - Learn to stutter more easily and reduce struggle\n3. Practice Exercises - Daily drills to build confidence and fluency\n\nClick Therapy in the navbar to get started!",
  },
  {
    patterns: ["fluency shaping", "fluency therapy"],
    response: "Fluency Shaping focuses on changing how you speak:\n\n- Slow speech rate\n- Gentle voice onset\n- Continuous airflow\n- Light articulatory contacts\n\nFind this in the Therapy section of FluencyAssist!",
  },
  {
    patterns: ["modification therapy", "stuttering modification"],
    response: "Stuttering Modification teaches you to stutter more easily:\n\n- Identify your stuttering moments\n- Use cancellation (pause after a stutter, redo the word)\n- Use pull-outs (ease out of a stutter mid-word)\n- Use preparatory sets (plan before difficult words)\n\nFind this in Therapy - Modification section!",
  },
  {
    patterns: ["practice", "practice exercises", "daily practice"],
    response: "The Practice section has daily exercises:\n\n- Reading aloud exercises\n- Paced speech drills\n- Breathing warm-ups\n- Confidence-building scripts\n\nConsistency is key - even 10 minutes daily makes a big difference!",
  },
  {
    patterns: ["profile", "my profile", "edit profile", "my account"],
    response: "In your Profile page you can:\n\n- Edit your display name\n- View your analysis stats (total, stuttering, normal)\n- Change your password\n- See your member since date\n- See your login method (Google or Email)\n\nAccess it from the navbar avatar - Profile!",
  },
  {
    patterns: ["settings", "my settings"],
    response: "The Settings page has:\n\n- Account - Go to Profile\n- Notifications - Toggle email and activity alerts\n- Privacy and Security - View data policy, delete history\n- Help and Support - FAQs\n- About - App information\n\nAccess it from the navbar avatar - Settings!",
  },
  {
    patterns: ["notification", "notifications", "alerts", "email alert"],
    response: "In Settings - Notifications you can toggle:\n\n- Analysis Complete alerts\n- Progress Milestone notifications\n- Therapy Reminders\n- Weekly Report emails\n- Email Notifications\n- Browser Push Notifications\n\nAll preferences are saved to your account!",
  },
  {
    patterns: ["privacy", "my data", "delete history", "delete data"],
    response: "In Settings - Privacy and Security you can:\n\n- See exactly what data we store\n- See what we do NOT store (raw audio is never saved!)\n- Learn how your data is protected\n- View your active session\n- Delete all your analysis history\n\nYour audio files are processed and immediately discarded - never stored!",
  },
  {
    patterns: ["change password", "forgot password", "reset password", "update password"],
    response: "To change your password:\n\n1. Go to Profile page\n2. Scroll to the Security section\n3. Click Change Password\n4. Enter your current password\n5. Enter and confirm your new password (min 8 chars)\n6. Click Update Password\n\nNote: Google login accounts cannot change password here.",
  },
  {
    patterns: ["sign up", "signup", "create account", "register", "how to register"],
    response: "To create an account:\n\n1. Click Sign Up in the navbar\n2. Enter your name, email, and password (min 8 chars)\n3. Click Create Account\n4. You'll be redirected to login\n\nYou can also sign in with Google for one-click access!",
  },
  {
    patterns: ["login", "sign in", "how to login", "log in"],
    response: "To log in:\n\n1. Click Login in the navbar\n2. Enter your email and password\n   OR click Sign in with Google\n3. You'll be redirected to the Dashboard\n\nTip: Use the eye button to show/hide your password!",
  },
  {
    patterns: ["logout", "sign out", "log out"],
    response: "To log out:\n\n1. Click your avatar (top-right of navbar)\n2. Click Logout in the dropdown\n\nOr go to Profile - Sign Out button at the bottom.",
  },
  {
    patterns: ["google login", "google sign in", "sign in with google"],
    response: "FluencyAssist supports Google Sign-In!\n\n1. Go to Login page\n2. Click the Google button\n3. Choose your Google account\n4. You're in!\n\nNo password needed - we use OAuth 2.0 so we never see your Google password.",
  },
  {
    patterns: ["contact", "contact us", "support", "reach out", "email support"],
    response: "You can reach us through the Contact page:\n\n1. Click Contact in the navbar\n2. Fill in your name, email, and message\n3. Click Send Message\n\nOur team will get back to you as soon as possible!",
  },
  {
    patterns: ["what is stuttering", "define stutter", "stutter mean", "what is stutter"],
    response: "Stuttering is a speech disorder where the flow of speech is disrupted by involuntary repetitions, prolongations, or blocks. It affects about 1% of adults worldwide. The exact cause involves genetics, neurological factors, and sometimes anxiety.",
  },
  {
    patterns: ["repetition", "what is repetition"],
    response: "Repetition is when a sound, syllable, or word is repeated - like 'I-I-I want to go'. It's one of the most common stuttering patterns. Slowing down your speech rate and pausing before difficult words can help.",
  },
  {
    patterns: ["prolongation", "what is prolongation"],
    response: "Prolongation is when a sound is stretched out - like 'Sssssometimes'. It often happens on vowels or fricative sounds. Gentle onset techniques (starting sounds softly) can help manage prolongations.",
  },
  {
    patterns: ["block", "what is block", "speech block"],
    response: "A block is when airflow or voicing stops completely during speech, causing a silent pause. It can feel like being stuck. Breathing exercises and relaxation techniques before speaking are very effective.",
  },
  {
    patterns: ["improve fluency", "how to improve", "get better", "tips", "advice"],
    response: "Proven tips to improve fluency:\n\n1. Slow down your speech rate\n2. Practice diaphragmatic breathing\n3. Use gentle onset on first words\n4. Pause before difficult words\n5. Read aloud daily for 10 minutes\n6. Reduce anxiety with mindfulness\n\nUse FluencyAssist to track your progress over time!",
  },
  {
    patterns: ["breathing", "breath", "breathing exercise"],
    response: "Breathing exercises for stuttering:\n\n1. Diaphragmatic breathing - Breathe from your belly\n2. Slow exhale - Exhale slowly before speaking\n3. Pause and breathe - Breathe at natural pauses\n\nTry: Inhale 4 counts, Hold 2, Exhale 6. Repeat 5 times before speaking.",
  },
  {
    patterns: ["anxiety", "nervous", "fear", "scared", "confidence"],
    response: "Speech anxiety is very common with stuttering:\n\n- Accept that stuttering is okay - don't fight it\n- Prepare what you want to say beforehand\n- Make eye contact to build confidence\n- Join a support group (NSA, BSA)\n- CBT therapy can help with anxiety\n\nYou're not alone!",
  },
  {
    patterns: ["cause", "why stutter", "reason", "why do people stutter"],
    response: "Stuttering causes:\n\n- Genetics: Runs in families\n- Neurological: Differences in speech motor control\n- Developmental: Common during language development\n- Psychological: Anxiety worsens it but doesn't cause it\n\nIt's NOT caused by nervousness, low intelligence, or bad parenting.",
  },
  {
    patterns: ["famous", "celebrity", "who stutter", "famous people"],
    response: "Famous people who stutter:\n\n- Ed Sheeran\n- Marilyn Monroe\n- Joe Biden\n- Isaac Newton\n- Samuel L. Jackson\n\nStuttering doesn't define your potential!",
  },
  {
    patterns: ["children", "kids", "child stutter"],
    response: "Stuttering in children is common - about 5% of children stutter at some point. Most outgrow it by age 7. Early therapy is recommended if:\n- Stuttering lasts more than 6 months\n- The child shows frustration\n- Family history of stuttering\n\nConsult a Speech-Language Pathologist (SLP) for children.",
  },
  {
    patterns: ["thank", "thanks", "thank you", "thx"],
    response: "You're welcome! Feel free to ask me anything else about FluencyAssist or stuttering therapy. I'm always here!",
  },
  {
    patterns: ["bye", "goodbye", "see you", "exit"],
    response: "Goodbye! Keep practicing and stay confident. You've got this!",
  },
  {
    patterns: ["help", "what can you do", "what do you know"],
    response: "I can help you with:\n\n- Website: Navigation, features, how to use\n- Analysis: How it works, recording, uploading\n- Dashboard: Charts, history, reports\n- Therapy: Techniques and exercises\n- Account: Login, signup, settings, privacy\n- Stuttering: Types, causes, tips\n\nJust ask me anything!",
  },
];

function getBotResponse(input) {
  const lower = input.toLowerCase().trim();
  for (const entry of KB) {
    if (entry.patterns.some((p) => lower.includes(p))) {
      return entry.response;
    }
  }
  return "I'm not sure about that! Try asking about stuttering types, therapy techniques, how to record audio, or how to use the Dashboard. You can also visit our Help page for more info.";
}

function Message({ msg }) {
  const isBot = msg.from === "bot";
  return (
    <div style={{ display: "flex", justifyContent: isBot ? "flex-start" : "flex-end", marginBottom: 12 }}>
      {isBot && <div style={s.botAvatar}>🤖</div>}
      <div style={{ ...s.bubble, ...(isBot ? s.botBubble : s.userBubble) }}>
        {msg.text.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < msg.text.split("\n").length - 1 && <br />}
          </span>
        ))}
        <div style={s.time}>{msg.time}</div>
      </div>
    </div>
  );
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm FluencyBot, your speech therapy assistant. How can I help you today?", time: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: msg, time: getTime() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: getBotResponse(msg), time: getTime() }]);
    }, 800);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      <button style={s.fab} onClick={() => setOpen(!open)} title="Chat with FluencyBot">
        {open ? "x" : "💬"}
        {!open && messages.length > 1 && (
          <span style={s.badge}>{messages.filter((m) => m.from === "bot").length}</span>
        )}
      </button>

      {open && (
        <div style={s.window}>
          <div style={s.header}>
            <div style={s.headerLeft}>
              <div style={s.headerAvatar}>🤖</div>
              <div>
                <div style={s.headerName}>{BOT_NAME}</div>
                <div style={s.headerStatus}>Online</div>
              </div>
            </div>
            <button style={s.closeBtn} onClick={() => setOpen(false)}>x</button>
          </div>

          <div style={s.messages}>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {typing && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={s.botAvatar}>🤖</div>
                <div style={{ ...s.bubble, ...s.botBubble, padding: "10px 14px" }}>
                  <span>...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={s.quickWrap}>
            {QUICK_REPLIES.map((q) => (
              <button key={q} style={s.quickBtn} onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <div style={s.inputRow}>
            <input
              style={s.input}
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button style={s.sendBtn} onClick={() => send()}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

const s = {
  fab: {
    position: "fixed", bottom: 28, right: 28, zIndex: 9999,
    width: 58, height: 58, borderRadius: "50%", border: "none",
    background: "linear-gradient(135deg,#7c3aed,#ec4899)",
    color: "#fff", fontSize: 24, cursor: "pointer",
    boxShadow: "0 8px 30px rgba(124,58,237,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  badge: {
    position: "absolute", top: -4, right: -4,
    background: "#ef4444", color: "#fff", fontSize: 11,
    fontWeight: 700, borderRadius: "50%", width: 18, height: 18,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  window: {
    position: "fixed", bottom: 100, right: 28, zIndex: 9998,
    width: 360, height: 520, background: "#fff", borderRadius: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
    display: "flex", flexDirection: "column",
    border: "1px solid rgba(196,132,252,0.2)", overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg,#7c3aed,#ec4899)",
    padding: "14px 16px", display: "flex",
    justifyContent: "space-between", alignItems: "center",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  headerAvatar: {
    width: 38, height: 38, borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
  },
  headerName: { color: "#fff", fontWeight: 700, fontSize: 15 },
  headerStatus: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  closeBtn: {
    background: "rgba(255,255,255,0.2)", border: "none",
    color: "#fff", borderRadius: "50%", width: 28, height: 28,
    cursor: "pointer", fontSize: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  messages: {
    flex: 1, overflowY: "auto", padding: "16px",
    display: "flex", flexDirection: "column", background: "#fafafa",
  },
  botAvatar: {
    width: 30, height: 30, borderRadius: "50%",
    background: "linear-gradient(135deg,#7c3aed,#ec4899)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, flexShrink: 0, marginRight: 8, alignSelf: "flex-end",
  },
  bubble: {
    maxWidth: "75%", padding: "10px 14px",
    borderRadius: 16, fontSize: 13, lineHeight: 1.6, wordBreak: "break-word",
  },
  botBubble: {
    background: "#fff", color: "#111", borderBottomLeftRadius: 4,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  userBubble: {
    background: "linear-gradient(135deg,#7c3aed,#ec4899)",
    color: "#fff", borderBottomRightRadius: 4,
  },
  time: { fontSize: 10, opacity: 0.5, marginTop: 4, textAlign: "right" },
  quickWrap: {
    display: "flex", gap: 6, padding: "8px 12px",
    overflowX: "auto", borderTop: "1px solid #f3f4f6", background: "#fff",
  },
  quickBtn: {
    padding: "5px 10px", borderRadius: 999, border: "1.5px solid #e5e7eb",
    background: "#fff", color: "#7c3aed", fontSize: 11, fontWeight: 600,
    cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
  },
  inputRow: {
    display: "flex", gap: 8, padding: "10px 12px",
    borderTop: "1px solid #f3f4f6", background: "#fff",
  },
  input: {
    flex: 1, padding: "10px 14px", borderRadius: 12,
    border: "1.5px solid #e5e7eb", fontSize: 13,
    outline: "none", background: "#fafafa",
  },
  sendBtn: {
    padding: "0 16px", borderRadius: 12, border: "none",
    background: "linear-gradient(135deg,#7c3aed,#ec4899)",
    color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
  },
};
