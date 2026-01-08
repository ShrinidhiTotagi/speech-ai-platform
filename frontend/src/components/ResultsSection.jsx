import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ResultsSection = ({ analysisResult }) => {
  if (!analysisResult) {
    return (
      <p className="text-center text-gray-500 text-lg mt-6">
        No analysis yet.
      </p>
    );
  }

  const breakdown = analysisResult.breakdown || {
    normal: 0,
    repetition: 0,
    prolongation: 0,
    block: 0,
  };

  const pieData = {
    labels: ["Normal", "Repetition", "Prolongation", "Block"],
    datasets: [
      {
        data: [
          breakdown.normal,
          breakdown.repetition,
          breakdown.prolongation,
          breakdown.block,
        ],
        backgroundColor: ["#4ade80", "#fb7185", "#fbbf24", "#60a5fa"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["Normal", "Repetition", "Prolongation", "Block"],
    datasets: [
      {
        label: "Percentage",
        data: [
          breakdown.normal,
          breakdown.repetition,
          breakdown.prolongation,
          breakdown.block,
        ],
        backgroundColor: ["#4ade80", "#fb7185", "#fbbf24", "#60a5fa"],
      },
    ],
  };

  // ✅ TOKEN-SAFE DOWNLOAD
  const handleDownload = async () => {
    if (!analysisResult?._id) {
      alert("Report not ready");
      return;
    }

    const saved = localStorage.getItem("stutter_user_v1");
    const token = saved ? JSON.parse(saved).token : null;

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/download-report/${analysisResult._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        alert("Failed to download report");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Stutter_AI_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Error downloading report");
    }
  };

  return (
    <div className="mt-12 max-w-5xl mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-purple-200">

      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
        Analysis Results
      </h2>

      <p className="text-center text-xl font-semibold text-purple-600 mt-4">
        {analysisResult.status}
      </p>

      <div className="flex justify-center mt-3">
        <span className="px-4 py-1 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 shadow">
          Confidence: {analysisResult.confidence}%
        </span>
      </div>

      <p className="text-center text-gray-600 mt-5 max-w-2xl mx-auto">
        {analysisResult.details}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100">
          <h3 className="text-center font-semibold text-purple-600 mb-4">
            Breakdown Overview
          </h3>
          <div className="h-[260px]">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100">
          <h3 className="text-center font-semibold text-purple-600 mb-4">
            Category Distribution
          </h3>
          <div className="h-[260px]">
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, max: 100 } },
              }}
            />
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        {analysisResult.filename} •{" "}
        {analysisResult.timestamp &&
          new Date(analysisResult.timestamp).toLocaleString()}
      </p>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleDownload}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold shadow hover:opacity-90 transition"
        >
          Download Report (PDF)
        </button>
      </div>

    </div>
  );
};

export default ResultsSection;
