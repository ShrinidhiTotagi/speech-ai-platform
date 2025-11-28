// src/components/Footer.jsx
import React from "react";
import "../index.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-title">Stutter AI</div>
          <div className="footer-text">Smart speech analysis & therapy tools</div>
        </div>

        <div>
          <div className="footer-sub">Links</div>
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/therapy" className="footer-link">Therapy</Link>
          <Link to="/dashboard" className="footer-link">Dashboard</Link>
        </div>

        <div>
          <div className="footer-sub">Contact</div>
          <div className="footer-text">support@stutterai.com</div>
          <div className="footer-text">+1 (555) 123-4567</div>
        </div>

        <div>
          <div className="footer-sub">About</div>
          <Link to="/about" className="footer-link">Our Mission</Link>
          <Link to="/help" className="footer-link">Help</Link>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Stutter AI · All rights reserved.
      </div>
    </footer>
  );
}
