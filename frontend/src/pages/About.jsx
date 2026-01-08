import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#fff7f2] px-6 py-20">
      <div className="max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">

          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-5xl font-extrabold text-purple-600 leading-tight mb-6">
              About Fluency Assist
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed">
              Fluency Assist is a modern AI-powered platform designed to analyze
              speech fluency, generate meaningful insights, and support structured
              practice in a private and accessible manner.
            </p>
          </div>

          {/* RIGHT VISUAL CARD */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-60"></div>

            <div className="relative bg-white rounded-3xl shadow-xl p-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Why Fluency Assist?
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Speech fluency challenges require tools that are accurate,
                supportive, and easy to use. Fluency Assist combines machine
                learning with human-centered design to make progress measurable
                and improvement actionable.
              </p>
            </div>
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-purple-600 mb-3 text-center">
              Mission
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              Make speech therapy guidance accessible through evidence-based AI
              assistance.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-purple-600 mb-3 text-center">
              Accuracy Focused
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              Optimized for reliable confidence scoring and interpretable speech
              breakdowns.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-purple-600 mb-3 text-center">
              Real Insights
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              Track progress over time, export reports, and receive tailored
              feedback.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-purple-600 mb-3 text-center">
              Privacy First
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              User data is stored securely and never shared with external
              services.
            </p>
          </div>

        </div>

        {/* FOOTER NOTE */}
        <div className="text-center mt-24 text-gray-500 text-sm">
          Fluency Assist is a research-driven project exploring the intersection
          of artificial intelligence, speech analysis, and user-centered design.
        </div>

      </div>
    </div>
  );
}
