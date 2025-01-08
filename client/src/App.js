import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaChevronUp } from "react-icons/fa";
import AppRoutes from "./routes";
import Navbar from "./components/User/Home/Navbar.js";
import Footer from "./components/User/Home/Footer.js";
import "./css/tailwind.css";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Handle scroll event to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <div className="flex-1">
        <AppRoutes />
      </div>
      {!isAdminRoute && (
        <>
          <div className="relative z-50">
            <Footer />
          </div>
          {showScrollButton && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full 
                       shadow-lg hover:bg-blue-700 transition-all duration-300 z-50
                       transform hover:scale-110"
              aria-label="Scroll to top"
            >
              <FaChevronUp className="text-xl" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default App;