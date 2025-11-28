import React from "react";
import { Link } from "react-router-dom";

export default function Therapy() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white py-16 px-4">

      <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-700">
        Therapies We Offer
      </h1>
      <p className="text-center text-gray-600 mt-2 text-lg">
        Evidence-based exercises & guidance to help improve speech fluency.
      </p>

      {/* FIXED: Horizontal cards */}
      <div className="flex flex-wrap justify-center gap-10 mt-12">

        {/* Fluency Shaping */}
        <div className="therapy-card w-80 bg-white rounded-2xl shadow-lg p-6 text-center border border-purple-100">
          <h2 className="text-xl font-bold text-purple-700">Fluency Shaping</h2>
          <p className="text-gray-600 mt-2">
            Learn structured breathing & smooth-speech techniques.
          </p>
          <Link to="/therapy/fluency">
            <button className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
              Explore
            </button>
          </Link>
        </div>

        {/* Stuttering Modification */}
        <div className="therapy-card w-80 bg-white rounded-2xl shadow-lg p-6 text-center border border-purple-100">
          <h2 className="text-xl font-bold text-purple-700">Stuttering Modification</h2>
          <p className="text-gray-600 mt-2">
            Reduce struggle using cancellations, pull-outs, and easy stuttering.
          </p>
          <Link to="/therapy/modification">
            <button className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
              Explore
            </button>
          </Link>
        </div>

        {/* Daily Exercises */}
        <div className="therapy-card w-80 bg-white rounded-2xl shadow-lg p-6 text-center border border-purple-100">
          <h2 className="text-xl font-bold text-purple-700">Daily Exercises</h2>
          <p className="text-gray-600 mt-2">
            Warm-ups, drills, and structured practice routines.
          </p>
          <Link to="/therapy/practice">
            <button className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
              Explore
            </button>
          </Link>
        </div>

      </div>

    </div>
  );
}
