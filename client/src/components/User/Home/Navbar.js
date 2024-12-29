import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import { FaBars, FaTimes, FaSearch, FaGift } from 'react-icons/fa';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar if we're in admin routes
  if (location.pathname.includes('/admin')) {
    return null;
  }   
  

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
      icon: <FaGift className="text-lg" />,
      count: 3
    }
    
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/courses?search=${e.target.value}`);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-primary via-primary/95 to-primary fixed w-full z-50">
      <div className="container mx-auto px-4">
        {/* Upper Section */}
        <div className="flex justify-between items-center py-4 backdrop-blur-sm">
          {/* Logo and Institution Name */}
          <Link to="/" className="flex items-center space-x-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-highlight to-secondary rounded-full blur opacity-30"></div>
              <img src={logo} alt="Barbish Logo" className="h-14 w-auto relative" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold tracking-wide">Barbish Institution</h1>
              <p className="text-sm text-sky/90 tracking-wider">Empowering Future Innovators</p>
            </div>
          </Link>

          {/* Desktop Search and Login */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                onKeyPress={handleSearch}
                className="w-72 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white 
                         placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-highlight/50"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <FaSearch className="text-white/50" />
              </div>
            </div>
            <Link 
              to="/login"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-highlight to-secondary 
                      text-white hover:shadow-lg hover:shadow-highlight/20 transition-all duration-300"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <FaSearch className="text-white text-xl" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <FaTimes className="text-white text-xl" />
              ) : (
                <FaBars className="text-white text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden py-4 px-2">
            <input
              type="text"
              placeholder="Search courses..."
              onKeyPress={handleSearch}
              className="w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 
                     text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-highlight/50"
            />
          </div>
        )}

        {/* Navigation Links */}
        <div className={`border-t border-white/10 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <ul className="flex flex-col lg:flex-row justify-center items-center space-y-4 lg:space-y-0 lg:space-x-12 py-4">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-white text-[15px] tracking-wide font-medium relative group py-2
                           hover:text-highlight transition-colors duration-300 flex items-center gap-2
                           ${item.isSpecial ? 'bg-highlight/20 px-4 py-2 rounded-full' : ''}`}
                >
                  {item.icon && (
                    <span className="relative">
                      {item.icon}
                      {item.count && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 
                                     rounded-full flex items-center justify-center text-xs 
                                     text-white font-bold animate-pulse">
                          {item.count}
                        </span>
                      )}
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;