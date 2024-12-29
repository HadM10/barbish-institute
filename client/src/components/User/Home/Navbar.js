import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import { FaBars, FaTimes, FaGift } from 'react-icons/fa';
import Login from '../../../components/Common/Login';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  const menuItems = [
    { title: "Home", path: "/" },
    { title: "Courses", path: "/courses" },
    { title: "Recorded Sessions", path: "/recorded-sessions" },
    { title: "AI Tools", path: "/services" },
    { title: "Contact Us", path: "/contact" },
    { title: "About & Services", path: "/about-services" },
    { 
      title: "Bonus Cards", 
      path: "/bonus",
      isSpecial: true,
      icon: <FaGift className="text-lg" />
    }
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Hide navbar if we're in admin routes
  if (location.pathname.includes('/admin')) {
    return null;
  }

  return (
    <>
      <nav className="bg-gradient-to-r from-primary via-primary/95 to-primary fixed w-full z-50">
        <div className="container mx-auto px-4">
          {/* Upper Section */}
          <div className="flex justify-between items-center py-4 backdrop-blur-sm">
            {/* Logo and Institution Name */}
            <Link to="/" className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-highlight to-secondary rounded-full blur opacity-30"></div>
                <img src={logo} alt="Barbish Logo" className="h-16 w-16 rounded-full relative object-cover" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold tracking-wide">Barbish Institution</h1>
                <p className="text-sm text-sky/90 tracking-wider">Empowering Future Innovators</p>
              </div>
            </Link>

            {/* Desktop Login */}
            <div className="hidden lg:flex items-center">
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-highlight to-secondary 
                        text-white hover:shadow-lg hover:shadow-highlight/20 transition-all duration-300"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? (
                  <FaTimes className="text-white text-xl" />
                ) : (
                  <FaBars className="text-white text-xl" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div ref={mobileMenuRef} className={`border-t border-white/10 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <ul className="flex flex-col lg:flex-row justify-center items-center space-y-4 lg:space-y-0 lg:space-x-12 py-4">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (item.path === '/login') setIsLoginOpen(true); // Open login if login item is clicked
                    }}
                    className={`text-white text-[15px] tracking-wide font-medium relative group py-2
                             hover:text-highlight transition-colors duration-300 flex items-center gap-2
                             ${item.isSpecial ? 'bg-highlight/20 px-4 py-2 rounded-full' : ''}`}
                  >
                    {item.icon && (
                      <span className="relative">
                        {item.icon}
                      </span>
                    )}
                    {item.title}
                    {!item.isSpecial && (
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-highlight 
                                     group-hover:w-full transition-all duration-300"></span>
                    )}
                  </Link>
                </li>
              ))}
              {/* Add Login to Mobile Menu */}
              <li className="lg:hidden">
                <button 
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-white text-[15px] tracking-wide font-medium relative group py-2
                           hover:text-highlight transition-colors duration-300 flex items-center justify-center gap-2
                           bg-gradient-to-r from-highlight to-secondary px-4 py-2 rounded-full"
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Add Login Modal */}
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navbar;