// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, Legend,
} from "recharts";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#34d399", "#fb7185", "#a78bfa", "#facc15"];

  useEffect(() => {
    if (!user) {
      toast.error("Login required");
      navigate("/login");
      return;
    }
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const token = user.token;
      const res = await fetch(`${API_BASE}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load history");

      const json = await res.json();
      setHistory(json.history || []);
    } catch (err) {
      toast.error("Could not load history");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // FEEDBACK GENERATION LOGIC
  // -------------------------
  const generateFeedback = (item) => {
    const b = item.breakdown;

    if (item.status === "Normal Speech") {
      return {
        summary: "Your speech is clear and fluent.",
        recommendation: "No issues detected. Keep practicing naturally.",
        plan: "Maintain confidence and regular speech habits."
      };
    }

    const main = Object.entries(b).sort((a, b) => b[1] - a[1])[0][0];

    switch (main) {
      case "repetition":
        return {
          summary: "Frequent repetition patterns detected.",
          recommendation:
            "Try slowing your pace. Focus on controlled breathing before speaking.",
          plan:
            "Practice reading short sentences slowly, then gradually increase pace."
        };

      case "prolongation":
        return {
          summary: "Prolongation in speech is noticeable.",
          recommendation:
            "Work on airflow control and gentle onset techniques.",
          plan:
            "Daily exercise: Start each sentence with a soft onset (hh → word)."
        };

      case "block":
        return {
          summary: "Speech blocks detected.",
          recommendation:
            "Practice relaxation and breathing exercises before speaking.",
          plan:
            "Use Pausing Technique: Pause for 1 second before difficult words."
        };

      default:
        return {
          summary: "Mixed stuttering patterns detected.",
          recommendation: "Try paced breathing and slow, deliberate speech.",
          plan: "Practice reading aloud 5–10 minutes daily with controlled pacing."
        };
    }
  };

  // -----------------------------
  // REPORT DOWNLOAD
  // -----------------------------
  const downloadReport = (item) => {
    const fb = generateFeedback(item);

    const report = `
====== STUTTER AI REPORT ======

Date: ${new Date(item.timestamp).toLocaleString()}
File: ${item.filename}

Status: ${item.status}
Confidence: ${item.confidence}%

Breakdown:
Normal: ${item.breakdown.normal}%
Repetition: ${item.breakdown.repetition}%
Prolongation: ${item.breakdown.prolongation}%
Block: ${item.breakdown.block}%

Summary: ${fb.summary}
Recommendation: ${fb.recommendation}
Practice Plan: ${fb.plan}

Powered by FluencyAssist
`;

    const blob = new Blob([report], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${item.filename}_report.txt`;
    a.click();
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  if (history.length === 0)
    return (
      <p className="text-center text-gray-600 mt-20 text-xl">
        No analysis history yet. Run a speech analysis first.
      </p>
    );

  // CHARTS DATA
  const latest = history[0];
  const pieData = [
    { name: "Normal", value: latest.breakdown.normal },
    { name: "Repetition", value: latest.breakdown.repetition },
    { name: "Prolongation", value: latest.breakdown.prolongation },
    { name: "Block", value: latest.breakdown.block },
  ];

  const lineData = history
    .slice()
    .reverse()
    .map((h, i) => ({
      index: i + 1,
      confidence: h.confidence,
    }));

  const barData = [
    {
      name: "Counts",
      Normal: history.filter((h) => h.breakdown.normal > 70).length,
      Repetition: history.filter((h) => h.breakdown.repetition > 10).length,
      Prolongation: history.filter((h) => h.breakdown.prolongation > 10).length,
      Block: history.filter((h) => h.breakdown.block > 5).length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-10">
      <h1 className="text-4xl font-extrabold text-purple-600 mb-10 text-center">
        Dashboard & Analytics
      </h1>

      {/* CHARTS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-6 rounded-2xl shadow-xl border">
          <h3 className="text-lg font-bold text-purple-600 mb-3 text-center">
            Latest Speech Breakdown
          </h3>

          <PieChart width={360} height={320}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <div className="text-center text-gray-600 mt-2">
            Breakdown for: {latest.filename}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border">
          <h3 className="text-lg font-bold text-purple-600 mb-3 text-center">
            Confidence Trend Over Time
          </h3>

          <LineChart width={400} height={300} data={lineData}>
            <Line type="monotone" dataKey="confidence" stroke="#a855f7" strokeWidth={3} />
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="index" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
          </LineChart>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-purple-600 mb-3 text-center">
            Stutter Pattern Frequency
          </h3>

          <BarChart width={700} height={320} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Normal" fill="#34d399" />
            <Bar dataKey="Repetition" fill="#fb7185" />
            <Bar dataKey="Prolongation" fill="#a78bfa" />
            <Bar dataKey="Block" fill="#facc15" />
          </BarChart>
        </div>
      </div>

      {/* FULL HISTORY */}
      <h2 className="text-3xl font-bold mt-12 mb-6 text-purple-700 text-center">
        Your Full History
      </h2>

      <div className="max-w-4xl mx-auto space-y-6">
        {history.map((item) => {
          const fb = generateFeedback(item);

          return (
            <div key={item._id} className="bg-white p-6 rounded-xl shadow-lg border">

              <div className="flex justify-between">
                <h3 className="text-lg font-bold text-purple-600">{item.filename}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>

              <p className="mt-1 text-gray-700"><b>Status:</b> {item.status}</p>
              <p className="text-gray-700"><b>Confidence:</b> {item.confidence}%</p>

              {/* Breakdown */}
              <div className="mt-2 text-gray-700">
                <b>Breakdown:</b>
                <ul className="ml-4">
                  <li>Normal: {item.breakdown.normal}%</li>
                  <li>Repetition: {item.breakdown.repetition}%</li>
                  <li>Prolongation: {item.breakdown.prolongation}%</li>
                  <li>Block: {item.breakdown.block}%</li>
                </ul>
              </div>

              {/* FEEDBACK SECTION */}
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="font-semibold text-purple-700">Feedback Summary:</p>
                <p className="text-gray-600">{fb.summary}</p>

                <p className="font-semibold text-purple-700 mt-3">Recommendation:</p>
                <p className="text-gray-600">{fb.recommendation}</p>

                <p className="font-semibold text-purple-700 mt-3">Practice Plan:</p>
                <p className="text-gray-600">{fb.plan}</p>
              </div>

              <button
                onClick={() => downloadReport(item)}
                className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Download Report
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
