// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();
const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("stutter_user_v1");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("stutter_user_v1", JSON.stringify(user));
    } else {
      localStorage.removeItem("stutter_user_v1");
    }
  }, [user]);

  /* SIGNUP FIXED */
  const signup = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: json.detail || "Signup failed" };
      }

      return { success: true, message: json.message };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  /* LOGIN FIXED */
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: json.detail || "Login failed" };
      }

      const userObj = {
        email,
        token: json.token,
      };

      setUser(userObj);
      return { success: true };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("stutter_user_v1");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
