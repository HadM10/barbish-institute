import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/User/Home/Navbar.js";
import "./css/tailwind.css";
import Home from "./pages/ClientSide/Home";
import Courses from './pages/ClientSide/Courses';
import RecordedSessions from './pages/ClientSide/RecordedSessions';
import AITools from './pages/ClientSide/AITools';
import BonusCards from './pages/ClientSide/BonusCards.js';
import Contact from './pages/ClientSide/Contact.js';
import AboutServices from './pages/ClientSide/AboutServices.js'; // New import

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/recorded-sessions" element={<RecordedSessions />} />
        <Route path="/services" element={<AITools />} />
        <Route path="/bonus" element={<BonusCards />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about-services" element={<AboutServices />} /> {/* New route */}
      </Routes>
    </div>
  );
};

export default App;