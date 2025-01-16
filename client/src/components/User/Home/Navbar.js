import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaGift, FaSearch } from "react-icons/fa";
import { getAllCourses } from '../../../api/courseAPI';
import logo from "../../../assets/images/logo.png";
import Login from "../../../components/Common/Login";
import { AuthContext } from "../../../context/AuthContext";
import CategoryAPI from '../../../api/categoryAPI';
import { motion, AnimatePresence } from "framer-motion";
import TranslateButton from '../../Common/TranslateButton';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({ courses: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);
  const searchResultsRef = useRef(null);
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);

  // Fetch both courses and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const courseResult = await getAllCourses();
        if (courseResult.success) {
          setCourses(courseResult.data.data || courseResult.data || []);
        }

        // Fetch categories
        const categoryResult = await CategoryAPI.getAllCategories();
        if (categoryResult.success) {
          setCategories(categoryResult.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle search with categories
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim()) {
      // Filter courses
      const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(value.toLowerCase()) ||
        course.description?.toLowerCase().includes(value.toLowerCase())
      );

      // Filter categories
      const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(value.toLowerCase())
      );

      setSearchResults({
        courses: filteredCourses,
        categories: filteredCategories
      });
      setIsSearching(true);
    } else {
      setSearchResults({ courses: [], categories: [] });
      setIsSearching(false);
    }
  };

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigate to course/category
  const handleResultClick = (item, type) => {
    setIsSearching(false);
    setSearchTerm('');
    setIsSearchBoxOpen(false);
    
    if (type === 'course') {
      // Find the course's category
      const courseCategory = courses.find(c => c.id === item.id)?.categoryId || 
                           courses.find(c => c.id === item.id)?.category_id;
      
      navigate(`/courses`, { 
        state: { 
          highlightCourseId: item.id,
          searchTerm: item.title,
          categoryId: courseCategory,
          type: 'course'
        }
      });
    } else if (type === 'category') {
      navigate(`/courses`, { 
        state: { 
          categoryId: item.id,
          categoryName: item.name,
          type: 'category'
        }
      });
    }
  };

  const menuItems = [
    { title: "Home Page", path: "/" },
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
      <nav className="bg-gradient-to-r from-primary via-primary/95 to-primary fixed w-full z-[100]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
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

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses or categories..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-[300px] px-6 py-3 rounded-full bg-white/10 text-white 
                           placeholder-white/50 focus:outline-none focus:ring-2 
                           focus:ring-highlight/50 transition-all duration-300"
                />
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" />

                {/* Desktop Search Results - Higher z-index and solid background */}
                <AnimatePresence>
                  {isSearching && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      ref={searchResultsRef}
                      className="absolute mt-2 w-[400px] right-0 bg-[#1a1a1a] 
                               rounded-2xl shadow-2xl border border-highlight/20 
                               overflow-hidden z-[101] max-h-[70vh] overflow-y-auto"
                      style={{
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {/* Categories Section */}
                      {searchResults.categories?.length > 0 && (
                        <div className="border-b border-highlight/10">
                          <div className="px-4 py-3 bg-[#252525]">
                            <h3 className="text-sm font-semibold text-highlight">Categories</h3>
                          </div>
                          {searchResults.categories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => handleResultClick(category, 'category')}
                              className="w-full px-6 py-4 text-left hover:bg-[#2a2a2a] 
                                       flex items-center gap-4 transition-all duration-300 group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center 
                                           justify-center group-hover:bg-highlight/20 transition-colors duration-300">
                                <FaSearch className="text-highlight group-hover:text-highlight" />
                              </div>
                              <span className="font-medium text-white group-hover:text-highlight 
                                             transition-colors duration-300">
                                {category.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Courses Section */}
                      {searchResults.courses?.length > 0 && (
                        <div>
                          <div className="px-4 py-3 bg-[#252525]">
                            <h3 className="text-sm font-semibold text-highlight">Courses</h3>
                          </div>
                          {searchResults.courses.map((course) => (
                            <button
                              key={course.id}
                              onClick={() => handleResultClick(course, 'course')}
                              className="w-full px-6 py-4 text-left hover:bg-[#2a2a2a] 
                                       flex items-center gap-4 transition-all duration-300 group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center 
                                           justify-center group-hover:bg-highlight/20 transition-colors duration-300">
                                <FaSearch className="text-highlight group-hover:text-highlight" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white group-hover:text-highlight 
                                             transition-colors duration-300 truncate">
                                  {course.title}
                                </h4>
                                <p className="text-sm text-gray-400 line-clamp-1">
                                  {course.description}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* No Results */}
                      {(!searchResults.courses?.length && !searchResults.categories?.length) && (
                        <div className="px-6 py-8 text-center bg-[#1a1a1a]">
                          <FaSearch className="mx-auto text-3xl mb-3 text-gray-500" />
                          <p className="text-gray-400">No results found</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Try different keywords or browse categories
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Add TranslateButton before Login/Logout */}
              <TranslateButton />
              
              {/* Login/Logout Button */}
              {auth ? (
                <button onClick={logout} className="px-8 py-3 rounded-full bg-highlight text-white
                                                  hover:scale-105 hover:tracking-wider transition-all duration-500">
                  Logout
                </button>
              ) : (
                <button onClick={() => setIsLoginOpen(true)} className="px-8 py-3 rounded-full bg-highlight text-white
                                                                      hover:scale-105 hover:tracking-wider transition-all duration-500">
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">
              <button
                onClick={() => setIsSearchBoxOpen(!isSearchBoxOpen)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 
                         transition-all duration-300 text-white"
              >
                <FaSearch className="text-xl" />
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
        </div>

        {/* Mobile Search Overlay - Compact Version */}
        <AnimatePresence>
          {isSearchBoxOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden fixed left-0 right-0 z-[102] px-4"
              style={{ top: '75px' }} // Adjust based on your navbar height
            >
              <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-[500px] mx-auto
                            border border-highlight/20 overflow-hidden">
                {/* Search Input */}
                <div className="p-4 border-b border-highlight/10">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search courses or categories..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full px-6 py-3 rounded-full bg-white/10 text-white 
                               placeholder-white/50 focus:outline-none focus:ring-2 
                               focus:ring-highlight/50 transition-all duration-300"
                      autoFocus
                    />
                    <button
                      onClick={() => setIsSearchBoxOpen(false)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 
                               text-white/50 hover:text-white"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {isSearching && (
                  <div className="max-h-[400px] overflow-y-auto">
                    {/* Categories Section */}
                    {searchResults.categories?.length > 0 && (
                      <div className="border-b border-highlight/10">
                        <div className="px-4 py-3 bg-[#252525] sticky top-0 z-10">
                          <h3 className="text-sm font-semibold text-highlight">
                            Categories
                          </h3>
                        </div>
                        {searchResults.categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleResultClick(category, 'category')}
                            className="w-full px-4 py-3 text-left bg-[#1a1a1a] 
                                     hover:bg-[#2a2a2a] active:bg-[#2a2a2a]
                                     flex items-center gap-3 transition-all duration-300"
                          >
                            <div className="w-10 h-10 rounded-lg bg-highlight/10 
                                         flex items-center justify-center">
                              <FaSearch className="text-highlight" />
                            </div>
                            <span className="font-medium text-white">
                              {category.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Courses Section */}
                    {searchResults.courses?.length > 0 && (
                      <div>
                        <div className="px-4 py-3 bg-[#252525] sticky top-0 z-10">
                          <h3 className="text-sm font-semibold text-highlight">
                            Courses
                          </h3>
                        </div>
                        {searchResults.courses.map((course) => (
                          <button
                            key={course.id}
                            onClick={() => handleResultClick(course, 'course')}
                            className="w-full px-4 py-3 text-left bg-[#1a1a1a] 
                                     hover:bg-[#2a2a2a] active:bg-[#2a2a2a]
                                     flex items-center gap-3 transition-all duration-300"
                          >
                            <div className="w-10 h-10 rounded-lg bg-highlight/10 
                                         flex items-center justify-center">
                              <FaSearch className="text-highlight" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white truncate">
                                {course.title}
                              </div>
                              <p className="text-sm text-gray-400 truncate">
                                {course.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No Results */}
                    {(!searchResults.courses?.length && !searchResults.categories?.length) && (
                      <div className="px-4 py-6 text-center">
                        <FaSearch className="mx-auto text-2xl mb-2 text-gray-500" />
                        <p className="text-gray-400">No results found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Try different keywords
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Optional overlay to handle clicks outside */}
        {isSearchBoxOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-[101] lg:hidden"
            onClick={() => setIsSearchBoxOpen(false)}
          />
        )}

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
                    if (item.path === "/login") setIsLoginOpen(true);
                  }}
                  className={`text-white text-[15px] tracking-wide font-medium relative group py-2
                           hover:text-highlight transition-colors duration-300 flex items-center gap-2
                           ${item.isSpecial
                             ? "bg-highlight/20 px-4 py-2 rounded-full"
                             : ""
                           }
                           ${location.pathname === item.path 
                             ? "text-highlight" 
                             : ""
                           }`}
                >
                  {item.icon && <span className="relative">{item.icon}</span>}
                  {item.title}
                  {!item.isSpecial && (
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-highlight transition-all duration-300
                                ${location.pathname === item.path 
                                  ? "w-full" 
                                  : "w-0 group-hover:w-full"
                                }`}
                    ></span>
                  )}
                </Link>
              </li>
            ))}
            {/* Add Login/Logout to Mobile Menu */}
            <li className="lg:hidden">
              <div className="flex items-center justify-center gap-3">
                <TranslateButton />
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
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* Login Modal */}
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navbar;