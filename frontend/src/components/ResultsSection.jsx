// src/components/ResultsSection.jsx
import React, { useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

import "../index.css";

// Register charts
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ResultsSection = ({ analysisResult }) => {

  if (!analysisResult)
    return (
      <p className="text-center text-gray-500 text-lg mt-6">
        No analysis yet.
      </p>
    );

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
        label: "Speech Breakdown",
        data: [
          breakdown.normal,
          breakdown.repetition,
          breakdown.prolongation,
          breakdown.block,
        ],
        backgroundColor: [
          "#4ade80",
          "#fb7185",
          "#fbbf24",
          "#60a5fa",
        ],
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
        backgroundColor: [
          "#4ade80",
          "#fb7185",
          "#fbbf24",
          "#60a5fa",
        ],
      },
    ],
  };

  const handleDownload = () => {
    const date = new Date().toLocaleString();
    const report = `
=============================
 STUTTER AI - ANALYSIS REPORT
=============================

Date: ${date}
File: ${analysisResult.filename || "N/A"}

Status: ${analysisResult.status}
Confidence: ${analysisResult.confidence}%

Details:
${analysisResult.details}

Breakdown:
 - Normal: ${breakdown.normal}%
 - Repetition: ${breakdown.repetition}%
 - Prolongation: ${breakdown.prolongation}%
 - Block: ${breakdown.block}%

Powered by STUTTER AI
`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `stutter_report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-10 bg-white p-10 rounded-3xl shadow-2xl border border-purple-200 max-w-4xl mx-auto">

      {/* Title */}
      <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
        Analysis Results
      </h2>

      {/* Status */}
      <p className="text-center text-xl font-semibold text-purple-600">
        {analysisResult.status}
      </p>

      {/* Confidence */}
      <p className="text-center mt-2 text-white inline-block px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow">
        Confidence: {analysisResult.confidence}%
      </p>

      {/* Details */}
      <p className="text-center text-gray-600 mt-4">
        {analysisResult.details}
      </p>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">

        {/* Pie chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100">
          <h3 className="text-center font-semibold text-purple-600 mb-3">
            Breakdown Overview
          </h3>
          <Pie data={pieData} />
        </div>

        {/* Bar chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100">
          <h3 className="text-center font-semibold text-purple-600 mb-3">
            Category Distribution
          </h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* Filename + timestamp */}
      <p className="text-center text-sm text-gray-500 mt-6">
        {analysisResult.filename} •{" "}
        {analysisResult.timestamp &&
          new Date(analysisResult.timestamp).toLocaleString()}
      </p>

      {/* Only Download button now */}
      <div className="flex justify-center mt-8">
        <button
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold shadow hover:opacity-90"
          onClick={handleDownload}
        >
          Download Report
        </button>
      </div>

    </div>
  );
};

export default ResultsSection;
