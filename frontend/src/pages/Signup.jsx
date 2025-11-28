// src/pages/Signup.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const res = await signup(email, password);

    if (res.success) {
      toast.success("Signup successful");
      navigate("/login");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Account</h2>

      <input
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border rounded mb-3"
      />

      <input
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        className="w-full p-2 border rounded mb-3"
      />

      <button
        onClick={handleSubmit}
        className="w-full py-2 bg-pink-500 text-white rounded"
      >
        Signup
      </button>
    </div>
  );
}
