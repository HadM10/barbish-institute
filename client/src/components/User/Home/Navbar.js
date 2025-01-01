import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { FaBars, FaTimes, FaGift } from "react-icons/fa";
import Login from "../../../components/Common/Login";
import { AuthContext } from "../../../context/AuthContext"; // Import AuthContext

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  const { auth, logout } = useContext(AuthContext); // Access auth state and logout function from context

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
    },
  ];

  useEffect(() => {
    if (location.pathname === '/recorded-sessions' && !auth) {
      setIsLoginOpen(true); // Open login form
      navigate("/"); // Prevent navigation to /recorded-sessions and go back to the previous page
    }
    if (location.pathname === '/recorded-sessions' && auth) {
      setIsLoginOpen(false); 
      navigate("/recorded-sessions");
    }
  }, [location.pathname, auth, navigate]);


  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hide navbar if we're in admin routes
  if (location.pathname.includes("/admin")) {
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
                <img
                  src={logo}
                  alt="Barbish Logo"
                  className="h-16 w-16 rounded-full relative object-cover"
                />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold tracking-wide">
                  Barbish Institution
                </h1>
                <p className="text-sm text-sky/90 tracking-wider">
                  Empowering Future Innovators
                </p>
              </div>
            </Link>

            {/* Desktop Login/Logout */}
            <div className="hidden lg:flex items-center">
              {auth ? (
                <button
                  onClick={logout}
                  className="px-8 py-3 rounded-full bg-highlight text-white
                  hover:scale-105 hover:tracking-wider transition-all duration-500"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-8 py-3 rounded-full bg-highlight text-white
                  hover:scale-105 hover:tracking-wider transition-all duration-500"
                >
                  Login
                </button>
              )}
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
          <div
            ref={mobileMenuRef}
            className={`border-t border-white/10 ${
              isMobileMenuOpen ? "block" : "hidden lg:block"
            }`}
          >
            <ul className="flex flex-col lg:flex-row justify-center items-center space-y-4 lg:space-y-0 lg:space-x-12 py-4">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (item.path === "/login") setIsLoginOpen(true); // Open login if login item is clicked
                    }}
                    className={`text-white text-[15px] tracking-wide font-medium relative group py-2
                             hover:text-highlight transition-colors duration-300 flex items-center gap-2
                             ${
                               item.isSpecial
                                 ? "bg-highlight/20 px-4 py-2 rounded-full"
                                 : ""
                             }`}
                  >
                    {item.icon && <span className="relative">{item.icon}</span>}
                    {item.title}
                    {!item.isSpecial && (
                      <span
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-highlight 
                                     group-hover:w-full transition-all duration-300"
                      ></span>
                    )}
                  </Link>
                </li>
              ))}
              {/* Add Login/Logout to Mobile Menu */}
              <li className="lg:hidden">
                {auth ? (
                  <button
                    onClick={logout}
                    className="px-8 py-3 rounded-full bg-highlight text-white
                  hover:scale-105 hover:tracking-wider transition-all duration-500"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                   className="px-8 py-3 rounded-full bg-highlight text-white
                  hover:scale-105 hover:tracking-wider transition-all duration-500"
                  >
                    Login
                  </button>
                )}
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
