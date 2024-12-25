// src/routes.js
import React from "react";
import { Routes, Route, Link } from "react-router-dom"; // Added Link import
import Admin from "./pages/AdminPanel/Admin";
import Home from "./pages/ClientSide/Home";
import Courses from "./pages/ClientSide/Courses";
import RecordedSessions from "./pages/ClientSide/RecordedSessions";
import AITools from "./pages/ClientSide/AITools";
import BonusCards from "./pages/ClientSide/BonusCards.js";
import Contact from "./pages/ClientSide/Contact.js";
import AboutServices from "./pages/ClientSide/AboutServices.js"; // New import

// 404 Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-lg w-full">
      <div className="mb-6">
        <h2 className="text-6xl font-bold text-red-500">404</h2>
        <p className="text-xl font-semibold text-gray-800 mt-4">
          Page Not Found
        </p>
      </div>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="space-x-4">
        <Link // Changed from <a> to <Link>
          to="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Return Home
        </Link>
        <Link // Changed from <a> to <Link>
          to="/admin"
          className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

const AppRoutes = () => (
  <Routes>
    {/* <Route path="/" element={<Home />} /> */}
    <Route path="/admin/*" element={<Admin />} />
    <Route path="*" element={<NotFound />} />
    <Route path="/" element={<Home />} />
    <Route path="/courses" element={<Courses />} />
    <Route path="/recorded-sessions" element={<RecordedSessions />} />
    <Route path="/services" element={<AITools />} />
    <Route path="/bonus" element={<BonusCards />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/about-services" element={<AboutServices />} />{" "}
    {/* New route */}
  </Routes>
);

export default AppRoutes;
