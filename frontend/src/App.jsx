import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Therapy from "./pages/Therapy/Therapy";
import FluencyTherapy from "./pages/Therapy/FluencyTherapy";
import ModificationTherapy from "./pages/Therapy/ModificationTherapy";
import PracticeTherapy from "./pages/Therapy/PracticeTherapy";

import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* THERAPY */}
        <Route path="/therapy" element={<Therapy />} />
        <Route path="/therapy/fluency" element={<FluencyTherapy />} />
        <Route path="/therapy/modification" element={<ModificationTherapy />} />
        <Route path="/therapy/practice" element={<PracticeTherapy />} />

        {/* STATIC */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
