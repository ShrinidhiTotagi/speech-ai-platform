// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ================= LOAD USER ON REFRESH =================
  useEffect(() => {
    const raw = localStorage.getItem("stutter_user_v1");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
    } catch {
      localStorage.removeItem("stutter_user_v1");
    }
  }, []);

  // ================= PERSIST USER =================
  useEffect(() => {
    if (user) {
      localStorage.setItem("stutter_user_v1", JSON.stringify(user));
    } else {
      localStorage.removeItem("stutter_user_v1");
    }
  }, [user]);

  // ================= EMAIL SIGNUP =================
  const signup = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          message: json.detail || "Signup failed",
        };
      }

      return { success: true };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // ================= EMAIL LOGIN =================
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          message: json.detail || "Login failed",
        };
      }

      const userObj = {
        email,
        token: json.token,
        provider: "password",
      };

      setUser(userObj);
      return { success: true };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // ================= GOOGLE LOGIN (REAL FIX) =================
  const googleLogin = (googleJwt, backendToken) => {
    try {
      const decoded = jwtDecode(googleJwt);

      const userObj = {
        email: decoded.email,
        token: backendToken, // 🔥 IMPORTANT: backend JWT
        provider: "google",
      };

      setUser(userObj);
    } catch (err) {
      console.error("Google JWT decode failed", err);
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("stutter_user_v1");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
