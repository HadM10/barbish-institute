// src/routes.js
import React, { lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";

// Eagerly load Home for fast initial load
import Home from "./pages/ClientSide/Home";

// Lazy load other components
const Admin = lazy(() => import("./pages/AdminPanel/Admin"));
const Courses = lazy(() => import("./pages/ClientSide/Courses"));
const RecordedSessions = lazy(() =>
  import("./pages/ClientSide/RecordedSessions")
);
const AITools = lazy(() => import("./pages/ClientSide/AITools"));
const BonusCards = lazy(() => import("./pages/ClientSide/BonusCards"));
const Contact = lazy(() => import("./pages/ClientSide/Contact"));
const AboutServices = lazy(() => import("./pages/ClientSide/AboutServices"));
const VideoPlayer = lazy(() => import("./pages/ClientSide/VideoPlayer"));

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
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Return Home
        </Link>
        <Link
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
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin bg-gradient-to-r from-primary via-accent to-sky"></div>
          <span className="text-lg font-medium bg-gradient-to-r from-primary via-accent to-sky bg-clip-text text-transparent">
            Loading...
          </span>
        </div>
      </div>
    }
  >
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/*" element={<Admin />} />

      {/* Client Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/recorded-sessions" element={<RecordedSessions />} />
      <Route path="/video-player/:sessionId" element={<VideoPlayer />} />
      <Route path="/services" element={<AITools />} />
      <Route path="/bonus" element={<BonusCards />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about-services" element={<AboutServices />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
