import React from "react";

export default function Modification() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white py-16 px-4">

      {/* Main Heading */}
      <h1 className="text-4xl font-bold text-center text-purple-700">
        Stuttering Modification
      </h1>

      <p className="text-center text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
        Reduce struggle and tension during moments of stutter.
      </p>

      {/* Content Card */}
      <div className="max-w-3xl mx-auto mt-12 bg-white p-10 rounded-3xl shadow-xl border border-purple-100">

        <h2 className="text-2xl font-semibold text-purple-700 mb-6 text-center">
          Techniques Included:
        </h2>

        <ul className="space-y-3 text-gray-700 text-lg leading-relaxed pl-4">
          <li>• Cancellation</li>
          <li>• Pull-out</li>
          <li>• Preparatory sets</li>
          <li>• Voluntary stuttering</li>
          <li>• Tension reduction</li>
        </ul>

        <p className="mt-8 text-gray-700 text-lg leading-relaxed text-center">
          This program teaches methods to modify the stutter moment, reduce fear,
          and regain speaking control.
        </p>

      </div>

    </div>
  );
}
