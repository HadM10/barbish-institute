import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { FaChevronUp } from "react-icons/fa";
import AppRoutes from "./routes";
import Navbar from "./components/User/Home/Navbar.js";
import Footer from "./components/User/Home/Footer.js";
import "./css/tailwind.css";
import "./styles/translate.css";

const App = () => {
  const location = useLocation();
  const isAdminRoute = useMemo(
    () => location.pathname.startsWith("/admin"),
    [location.pathname]
  );
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = React.useRef(null);

  // Smart loading detection
  const startLoading = useCallback(() => {
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    // Only show loader if content takes more than 150ms to load
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(true);
    }, 150);
  }, []);

  const stopLoading = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(false);
  }, []);

  // Handle route changes
  useEffect(() => {
    const handleLoadStart = () => startLoading();
    const handleLoadEnd = () => stopLoading();

    // Listen for actual loading events
    window.addEventListener("loadstart", handleLoadStart);
    window.addEventListener("load", handleLoadEnd);

    // Check if images are still loading
    const images = document.querySelectorAll("img");
    let loadingImages = 0;

    const imageLoadHandler = () => {
      loadingImages--;
      if (loadingImages === 0) {
        stopLoading();
      }
    };

    images.forEach((img) => {
      if (!img.complete) {
        loadingImages++;
        img.addEventListener("load", imageLoadHandler);
        img.addEventListener("error", imageLoadHandler);
      }
    });

    // Start loading if there are pending images
    if (loadingImages > 0) {
      startLoading();
    }

    return () => {
      window.removeEventListener("loadstart", handleLoadStart);
      window.removeEventListener("load", handleLoadEnd);
      images.forEach((img) => {
        img.removeEventListener("load", imageLoadHandler);
        img.removeEventListener("error", imageLoadHandler);
      });
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [location.pathname, startLoading, stopLoading]);

  // Optimize scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollButton(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <div className="flex-1">
        <AppRoutes />
      </div>

      {/* Optimized Preloader - Only shows when actually needed */}
      {isLoading && (
        <div
          className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] 
                    flex items-center justify-center transition-opacity duration-300"
        >
          <div className="relative flex flex-col items-center">
            <div className="w-16 h-16 relative">
              {/* Main spinner */}
              <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />

              {/* Pulsing core */}
              <div className="absolute inset-0 m-auto w-6 h-6">
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Loading indicator - Only shows for longer loads */}
            <div className="mt-4 px-4 py-2 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm">
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Loading...
              </span>
            </div>
          </div>
        </div>
      )}

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

// Add this to your tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         'spin-slow': 'spin 3s linear infinite',
//       }
//     }
//   }
// }

export default App;
