import React from "react";

export default function Fluency() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white py-16 px-4">

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center text-purple-700">
        Fluency Shaping
      </h1>

      <p className="text-center text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
        Learn smooth, controlled speech patterns to improve fluency.
      </p>

      {/* Card */}
      <div className="max-w-3xl mx-auto mt-12 bg-white p-10 rounded-3xl shadow-xl border border-purple-100">

        <h2 className="text-2xl font-semibold text-purple-700 mb-6 text-center">
          Techniques Included:
        </h2>

        <ul className="space-y-3 text-gray-700 text-lg leading-relaxed pl-4">
          <li>• Slow speech initiation</li>
          <li>• Gentle airflow control</li>
          <li>• Soft voice onsets</li>
          <li>• Continuous phonation</li>
          <li>• Controlled rate reduction</li>
        </ul>

        <p className="mt-8 text-gray-700 text-lg leading-relaxed text-center">
          This program builds a smooth-speech pattern to reduce blocks and
          improve overall fluency stability.
        </p>

      </div>

    </div>
  );
}
