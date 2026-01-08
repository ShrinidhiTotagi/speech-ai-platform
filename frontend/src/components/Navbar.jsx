import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../index.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const closeMenus = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const email = user?.email || null;
  const avatar = email ? email.charAt(0).toUpperCase() : "U";

  return (
    <header className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <Link to="/" className="brand-title">
          Fluency<span>Assist</span>
        </Link>
      </div>

      {/* CENTER (DESKTOP) */}
      <nav className="navbar-center desktop-menu">
        <Link to="/" className="navbar-link">Analysis</Link>
        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
        <Link to="/therapy" className="navbar-link">Therapy</Link>
        <Link to="/about" className="navbar-link">About</Link>
        <Link to="/contact" className="navbar-link">Contact</Link>
      </nav>

      {/* RIGHT */}
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
                  <div className="profile-popup-email" title={email}>
  {email}
</div>

                </div>

                <div className="profile-popup-links">
                  <Link to="/profile" className="profile-popup-item">Profile</Link>
                  <Link to="/settings" className="profile-popup-item">Settings</Link>
                  <Link to="/help" className="profile-popup-item">Help</Link>
                  <Link to="/therapy" className="profile-popup-item">Therapy</Link>
                </div>

                <button
                  className="profile-popup-logout"
                  onClick={() => {
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

      {/* MOBILE MENU */}
      <div
        className="hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        ref={menuRef}
      >
        <span></span>
        <span></span>
        <span></span>
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
