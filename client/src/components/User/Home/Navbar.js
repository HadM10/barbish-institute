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
        !course.isArchived && // Exclude archived courses
        (course.title.toLowerCase().includes(value.toLowerCase()) ||
         course.description?.toLowerCase().includes(value.toLowerCase()))
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
          <div className="flex justify-between items-center py-3">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-5">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-highlight to-secondary rounded-full blur opacity-30"></div>
                <img
                  src={logo}
                  alt="Barbish Logo"
                  className="h-14 w-14 rounded-full relative object-cover"
                />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold tracking-wide">
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
                  className="w-[270px] px-5 py-2.5 rounded-full bg-white/10 text-white text-sm
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
                <button onClick={logout} className="px-7 py-2.5 text-sm rounded-full bg-highlight text-white
                                                  hover:scale-105 hover:tracking-wider transition-all duration-500">
                  Logout
                </button>
              ) : (
                <button onClick={() => setIsLoginOpen(true)} className="px-7 py-2.5 text-sm rounded-full bg-highlight text-white
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

        {/* Mobile Search Overlay - Modern Version */}
        <AnimatePresence>
          {isSearchBoxOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="lg:hidden fixed left-0 right-0 top-0 z-[102] bg-[#1a1a1a]/95 backdrop-blur-lg"
                ref={searchResultsRef}
              >
                <div className="container mx-auto px-4 py-4">
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search courses or categories..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-white/10 text-white 
                               placeholder-white/50 focus:outline-none focus:ring-2 
                               focus:ring-highlight/50 transition-all duration-300
                               pr-12 text-base"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setIsSearchBoxOpen(false);
                        setSearchTerm('');
                        setIsSearching(false);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 
                               text-white/50 hover:text-white p-2"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  {/* Search Results with Animation */}
                  <AnimatePresence>
                    {(isSearching || searchTerm.trim()) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto
                                  border border-white/10 bg-[#1a1a1a]"
                      >
                        {/* Categories Section */}
                        {searchResults.categories?.length > 0 && (
                          <div className="border-b border-white/10">
                            <div className="px-4 py-3 bg-[#252525]/80 backdrop-blur-sm sticky top-0 z-10">
                              <h3 className="text-sm font-semibold text-highlight flex items-center gap-2">
                                <span className="w-1 h-4 bg-highlight rounded-full"></span>
                                Categories
                              </h3>
                            </div>
                            {searchResults.categories.map((category) => (
                              <motion.button
                                key={category.id}
                                whileHover={{ x: 4 }}
                                onClick={() => handleResultClick(category, 'category')}
                                className="w-full px-4 py-4 text-left hover:bg-white/5
                                         flex items-center gap-3 transition-all duration-300"
                              >
                                <div className="w-10 h-10 rounded-xl bg-highlight/10 
                                             flex items-center justify-center group-hover:bg-highlight/20">
                                  <FaSearch className="text-highlight" />
                                </div>
                                <span className="font-medium text-white">
                                  {category.name}
                                </span>
                              </motion.button>
                            ))}
                          </div>
                        )}

                        {/* Courses Section */}
                        {searchResults.courses?.length > 0 && (
                          <div>
                            <div className="px-4 py-3 bg-[#252525]/80 backdrop-blur-sm sticky top-0 z-10">
                              <h3 className="text-sm font-semibold text-highlight flex items-center gap-2">
                                <span className="w-1 h-4 bg-highlight rounded-full"></span>
                                Courses
                              </h3>
                            </div>
                            {searchResults.courses.map((course) => (
                              <motion.button
                                key={course.id}
                                whileHover={{ x: 4 }}
                                onClick={() => handleResultClick(course, 'course')}
                                className="w-full px-4 py-4 text-left hover:bg-white/5
                                         flex items-center gap-3 transition-all duration-300"
                              >
                                <div className="w-10 h-10 rounded-xl bg-highlight/10 
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
                              </motion.button>
                            ))}
                          </div>
                        )}

                        {/* No Results - Enhanced Version */}
                        {searchTerm.trim() && (!searchResults.courses?.length && !searchResults.categories?.length) && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="px-4 py-8 text-center"
                          >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 
                                          flex items-center justify-center">
                              <FaSearch className="text-3xl text-gray-500" />
                            </div>
                            <p className="text-white/90 font-medium">No results found</p>
                            <p className="text-sm text-gray-400 mt-2">
                              Try different keywords or browse our categories
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Enhanced Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[101] lg:hidden"
                onClick={() => {
                  setIsSearchBoxOpen(false);
                  setSearchTerm('');
                  setIsSearching(false);
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Navigation Links */}
        <div
          ref={mobileMenuRef}
          className={`border-t border-white/10 ${
            isMobileMenuOpen ? "block" : "hidden lg:block"
          }`}
        >
          <ul className="flex flex-col lg:flex-row justify-center items-center space-y-3 lg:space-y-0 lg:space-x-10 py-4">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (item.path === "/login") setIsLoginOpen(true);
                  }}
                  className={`text-white text-[14px] tracking-wide font-medium relative group py-1.5
                           hover:text-highlight transition-colors duration-300 flex items-center gap-2
                           ${item.isSpecial
                             ? "bg-highlight/20 px-4 py-1.5 rounded-full"
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
            
            {/* Mobile Login/Logout */}
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