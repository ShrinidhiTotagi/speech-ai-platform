import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../index.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const email = user?.email || null;
  const avatar = email ? email.charAt(0).toUpperCase() : "U";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand-title">FluencyAssist</Link>
      </div>

      <div className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
        <span></span><span></span><span></span>
      </div>

      <nav className="navbar-center desktop-menu">
        <Link to="/" className="navbar-link">Analysis</Link>
        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
        <Link to="/therapy" className="navbar-link">Therapy</Link>
        <Link to="/about" className="navbar-link">About</Link>
        <Link to="/contact" className="navbar-link">Contact</Link>
      </nav>

      <div className="navbar-right" ref={profileRef}>
        {!email ? (
          <>
            <Link to="/login" className="nav-link-plain">Login</Link>
            <Link to="/signup" className="nav-cta">Sign Up</Link>
          </>
        ) : (
          <>
            <div
              className="profile-avatar"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {avatar}
            </div>

            {profileOpen && (
              <div className="profile-popup">
                <div className="profile-popup-header">
                  <div className="profile-popup-avatar">{avatar}</div>
                  <div>
                    <div className="profile-popup-name">{email}</div>
                  </div>
                </div>

                <Link to="/profile" className="profile-popup-item">Profile</Link>
                <Link to="/settings" className="profile-popup-item">Settings</Link>
                <Link to="/help" className="profile-popup-item">Help</Link>
                <Link to="/therapy" className="profile-popup-item">Therapy</Link>

                <button
                  className="profile-popup-logout"
                  onClick={() => {
                    localStorage.removeItem("stutter_user_v1");
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMobileOpen(false)}>Analysis</Link>
          <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          <Link to="/therapy" onClick={() => setMobileOpen(false)}>Therapy</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>

          {!email ? (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>Signup</Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
              <Link to="/settings" onClick={() => setMobileOpen(false)}>Settings</Link>

              <button
                className="mobile-logout"
                onClick={() => {
                  localStorage.removeItem("stutter_user_v1");
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
