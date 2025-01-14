import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaTimes,
  FaClock,
  FaUser,
  FaChevronUp,
  FaLightbulb,
} from "react-icons/fa";
import CategoryAPI from "../../api/categoryAPI";
import { getAllCourses } from "../../api/courseAPI";
import englishCourseImg from "../../assets/images/english-course.jpg";

const Courses = () => {
  const location = useLocation();

  // Initialize with "all" by default
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchedCourse, setSearchedCourse] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryContainerRef = useRef(null);

  // Add effect to handle scroll on navigation
  useEffect(() => {
    // Scroll to top when component mounts or when navigating to courses
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]); // Add location.pathname as dependency

  // Update initialization effect
  useEffect(() => {
    if (location.state?.searchTerm && location.state?.courseId) {
      const course = courses.find(
        (course) => course.id === location.state.courseId
      );
      if (course) {
        setSearchedCourse(course);
        setSelectedCategory(course.categoryId || course.category_id);
      }
    } else if (location.state?.categoryId) {
      setSelectedCategory(location.state.categoryId);
    } else {
      // Reset to "all" when no specific category or search is present
      setSelectedCategory("all");
    }
  }, [location.state, courses]);

  // Update initialization effect to handle navbar search
  useEffect(() => {
    if (location.state?.searchTerm) {
      const searchQuery = location.state.searchTerm.toLowerCase();

      // Find the exact course that matches the search
      const exactMatch = courses.find(
        (course) =>
          course.title.toLowerCase() === searchQuery ||
          course.id === location.state.courseId
      );

      if (exactMatch) {
        // Set the searched course
        setSearchedCourse(exactMatch);
        // Set category to the course's category
        const courseCategory = exactMatch.categoryId || exactMatch.category_id;
        setSelectedCategory(courseCategory);

        // Scroll to top when searching
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } else {
      // Reset search when no search term is present
      setSearchedCourse(null);
    }
  }, [location.state, courses]);

  // Update fetchData
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categoryResult = await CategoryAPI.getAllCategories();
        if (categoryResult.success) {
          setCategories([
            { id: "all", name: "All Courses", icon: "📚" },
            ...categoryResult.data.data,
          ]);
        }

        const courseResult = await getAllCourses();
        if (courseResult.success) {
          const coursesData = courseResult.data.data || courseResult.data || [];
          setCourses(coursesData);

          if (location.state?.searchTerm && location.state?.courseId) {
            const exactCourse = coursesData.find(
              (course) => course.id === location.state.courseId
            );
            if (exactCourse) {
              setSearchedCourse(exactCourse);
              setSelectedCategory(
                exactCourse.categoryId || exactCourse.category_id
              );
            }
          } else if (!location.state?.categoryId) {
            setSelectedCategory("all");
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchedCourse(null);
    
    // Find the selected category button and scroll it into view smoothly
    if (categoryContainerRef.current) {
      const selectedButton = categoryContainerRef.current.querySelector(`[data-category-id="${categoryId}"]`);
      if (selectedButton) {
        const container = categoryContainerRef.current;
        const buttonLeft = selectedButton.offsetLeft;
        const containerWidth = container.clientWidth;
        const scrollPosition = buttonLeft - (containerWidth / 2) + (selectedButton.offsetWidth / 2);
        
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  };

  // Update filtered courses logic
  const filteredCourses = useMemo(() => {
    // First filter out archived courses
    let filtered = courses.filter(course => !course.isArchived);
    
    // If there's a searched course, show it in its category
    if (searchedCourse) {
      const courseCategory = searchedCourse.categoryId || searchedCourse.category_id;
      if ((selectedCategory === courseCategory || selectedCategory === "all") && !searchedCourse.isArchived) {
        return [searchedCourse];
      }
      return [];
    }

    // Normal category filtering when not searching
    if (selectedCategory === "all") {
      return filtered;
    }

    return filtered.filter(
      (course) =>
        course.categoryId === selectedCategory ||
        course.category_id === selectedCategory
    );
  }, [courses, selectedCategory, searchedCourse]);

  const sortedAndFilteredCourses = useMemo(() => {
    let result = [...filteredCourses];

    switch (sortOption) {
      case "price-low-high":
        return result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case "price-high-low":
        return result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case "duration-low-high":
        return result.sort(
          (a, b) => parseFloat(a.duration) - parseFloat(b.duration)
        );
      case "duration-high-low":
        return result.sort(
          (a, b) => parseFloat(b.duration) - parseFloat(a.duration)
        );
      default:
        return result;
    }
  }, [filteredCourses, sortOption]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categoryResult = await CategoryAPI.getAllCategories();
        if (categoryResult.success) {
          setCategories([
            { id: "all", name: "All Courses", icon: "📚" },
            ...categoryResult.data.data,
          ]);
        }

        const courseResult = await getAllCourses();
        if (courseResult.success) {
          const coursesData = courseResult.data.data || courseResult.data || [];
          setCourses(coursesData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") return courses.length;
    return courses.filter(
      (course) =>
        course.categoryId === categoryId || course.category_id === categoryId
    ).length;
  };

  const CourseCard = ({ course }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="relative group animate-fadeIn w-full h-full">
        <div 
          className="bg-white rounded-lg shadow-sm hover:shadow-md 
                    overflow-hidden cursor-pointer transform transition-all duration-300 
                    hover:-translate-y-1 border border-gray-100 h-full flex flex-col"
          onClick={() => setIsExpanded(true)}
        >
          {/* Fixed aspect ratio for card image */}
          <div className="relative w-full aspect-square">
            <img
              src={englishCourseImg}
              alt={course.title}
              className="w-full h-full object-contain bg-gray-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
            <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 bg-gradient-to-r from-purple-600 to-blue-600
                         px-2 py-1 lg:px-4 lg:py-2 rounded-lg shadow-lg">
              <span className="text-white font-bold text-xs sm:text-sm lg:text-lg">${course.price}</span>
            </div>
          </div>

          {/* Fixed height content container */}
          <div className="p-2 sm:p-3 lg:p-6 flex flex-col flex-1">
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm lg:text-xl font-bold text-gray-800 mb-1 sm:mb-2 lg:mb-4 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-gray-600 text-xs lg:text-base mb-2 lg:mb-6 line-clamp-2">
                {course.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 lg:gap-4 mt-auto">
              <div className="flex items-center gap-1 lg:gap-2 bg-blue-50 px-2 py-1 lg:px-5 lg:py-3 rounded-full"> 
                <FaClock className="text-blue-600 text-xs lg:text-lg" />
                <span className="text-xs lg:text-lg text-blue-600 font-medium">
                  {course.duration}h
                </span>
              </div>
              <button
                className="px-2 py-1 lg:px-6 lg:py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white text-xs lg:text-lg font-medium rounded-full
                         transition-all duration-300 flex items-center gap-1 lg:gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
              >
                <FaWhatsapp className="text-xs lg:text-lg" />
                <span className="hidden sm:inline">Enquire</span>
              </button>
            </div>
          </div>
        </div>

        {/* Popup with uncropped image */}
        {isExpanded && (
          <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-xl shadow-2xl relative overflow-hidden 
                w-[85%] max-w-[400px] md:w-[90%] md:max-w-[1400px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile popup remains unchanged */}
              <div className="md:hidden flex flex-col h-full">
                <div className="relative h-[25vh]">
                  <img
                    src={englishCourseImg}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="absolute top-2 right-2 p-1.5 bg-black/20 rounded-full"
                  >
                    <FaTimes className="text-white text-base" />
                  </button>
                </div>

                <div className="flex-1 bg-[#1E3A8A] p-3 overflow-y-auto">
                  <h2 className="text-base font-bold text-white mb-2">{course.title}</h2>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/10 rounded-lg p-2">
                        <p className="text-white/70 text-xs">Duration</p>
                        <p className="text-white text-sm font-medium">{course.duration}h</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <p className="text-white/70 text-xs">Price</p>
                        <p className="text-white text-sm font-medium">${course.price}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-white text-xs font-medium mb-1">Description</h3>
                      <p className="text-white/80 text-xs">{course.description}</p>
                    </div>

                    <div>
                      <h3 className="text-white text-xs font-medium mb-1">What You'll Learn</h3>
                      <ul className="space-y-1.5">
                        {course.content?.split("\n").map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5" />
                            <span className="text-white/80 text-xs">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="sticky bottom-0 pt-3 mt-3 border-t border-white/10">
                    <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 
                                     rounded-lg text-white text-xs font-medium 
                                     flex items-center justify-center gap-1.5">
                      <FaWhatsapp className="text-sm" />
                      <span>Enquire Now</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop popup with perfect square image */}
              <div className="hidden md:flex aspect-[2/1]">
                <div className="w-1/2 bg-gray-100">
                  <div className="relative w-full h-full">
                    <img
                      src={englishCourseImg}
                      alt={course.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="w-1/2 bg-[#1E3A8A] flex flex-col">
                  <div className="p-8 border-b border-white/10 flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                        {course.title}
                      </h2>
                      <div className="inline-flex bg-gradient-to-r from-blue-600 to-purple-600 
                                  px-6 py-3 rounded-full shadow-lg">
                        <span className="text-white font-bold text-xl">${course.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <FaTimes className="text-white text-2xl" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-8 space-y-8">
                      {/* Course Info Grid */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/10 rounded-xl p-6">
                          <div className="flex items-center gap-4">
                            <FaClock className="text-blue-400 text-2xl" />
                            <div>
                              <p className="text-white/70 text-lg">Duration</p>
                              <p className="text-white font-medium text-xl">{course.duration} hours</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-6">
                          <div className="flex items-center gap-4">
                            <FaUser className="text-blue-400 text-2xl" />
                            <div>
                              <p className="text-white/70 text-lg">Instructor</p>
                              <p className="text-white font-medium text-xl">Expert Tutor</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-white font-medium text-2xl mb-4">Description</h3>
                        <p className="text-white/80 leading-relaxed text-lg">{course.description}</p>
                      </div>

                      <div>
                        <h3 className="text-white font-medium text-2xl mb-4">What You'll Learn</h3>
                        <ul className="space-y-4">
                          {course.content?.split("\n").map((item, index) => (
                            <li key={index} className="flex items-start gap-4">
                              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2.5" />
                              <span className="text-white/80 text-lg">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-gradient-to-t from-[#1E3A8A] via-[#1E3A8A] to-transparent">
                    <button className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 
                           rounded-xl text-white text-xl font-medium flex items-center 
                           justify-center gap-3 hover:shadow-lg transition-all duration-300">
                      <FaWhatsapp className="text-2xl" />
                      <span>Enquire Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowCategoryDropdown(false);
        setShowSortOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update the sort handling
  const handleSort = (option) => {
    setSortOption(option);
    setShowSortOptions(false);
  };

  // Add effect to reset to "All Courses" on page load/refresh
  useEffect(() => {
    setSelectedCategory("all");
    setSortOption("default");
  }, []); // Empty dependency array means this runs once on mount

  // Update the scroll handler to prevent re-renders
  const handleScroll = useCallback((direction) => {
    const container = categoryContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, container.scrollLeft - scrollAmount)
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  }, []);

  const getActiveCategories = async () => {
    try {
      const [categoriesRes, coursesRes] = await Promise.all([
        CategoryAPI.getAllCategories(),
        getAllCourses()
      ]);

      if (categoriesRes.success && coursesRes.success) {
        // Get all courses
        const allCourses = coursesRes.data.data || coursesRes.data;
        
        // Filter categories that have at least one active course
        const categoriesWithActiveCourses = categoriesRes.data.data.filter(category => {
          const categoryCourses = allCourses.filter(course => 
            (course.categoryId === category.id || course.category_id === category.id) && 
            !course.isArchived
          );
          return categoryCourses.length > 0;
        });

        setCategories(categoriesWithActiveCourses);
      }
    } catch (error) {
      console.error('Error fetching active categories:', error);
    }
  };

  useEffect(() => {
    getActiveCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-[160px]">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-2">
            {/* Mobile buttons with dropdowns */}
            <div className="md:hidden flex flex-col py-2 gap-2 relative">
              <div className="flex justify-between gap-2">
                <div className="flex-1 relative dropdown-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCategoryDropdown(!showCategoryDropdown);
                      setShowSortOptions(false); // Close other dropdown
                    }}
                    className="w-full h-8 px-3 rounded-lg text-[11px]
                             bg-gradient-to-r from-purple-600 to-indigo-600
                             text-white shadow-md flex items-center justify-between"
                  >
                    <span className="font-medium">Browse Categories</span>
                    <svg className={`w-3 h-3 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} 
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Categories Dropdown */}
                  {showCategoryDropdown && categories.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl z-[9999] 
                                  border border-gray-100 max-h-[60vh] overflow-y-auto">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            handleCategoryChange('all');
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[11px]
                                    flex items-center justify-between
                                    ${selectedCategory === 'all' 
                                      ? "bg-blue-50 text-blue-600" 
                                      : "hover:bg-gray-50"}`}
                        >
                          <span>All Courses</span>
                          <span className="bg-gray-100 px-2 py-1 rounded-full">
                            {courses.filter(c => !c.isArchived).length}
                          </span>
                        </button>
                        
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              handleCategoryChange(category.id);
                              setShowCategoryDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[11px]
                                      flex items-center justify-between
                                      ${selectedCategory === category.id 
                                        ? "bg-blue-50 text-blue-600" 
                                        : "hover:bg-gray-50"}`}
                          >
                            <span>{category.name}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded-full">
                              {courses.filter(c => 
                                (c.categoryId === category.id || c.category_id === category.id) && 
                                !c.isArchived
                              ).length}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 relative dropdown-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSortOptions(!showSortOptions);
                      setShowCategoryDropdown(false); // Close other dropdown
                    }}
                    className="w-full h-8 px-3 rounded-lg text-[11px]
                             bg-gradient-to-r from-purple-600 to-indigo-600
                             text-white shadow-md flex items-center justify-between"
                  >
                    <span className="font-medium">Sort By</span>
                    <svg className={`w-3 h-3 transition-transform ${showSortOptions ? 'rotate-180' : ''}`} 
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Sort Dropdown */}
                  {showSortOptions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl z-[9999] 
                                  border border-gray-100">
                      <div className="p-2">
                        {[
                          { id: "default", label: "Default" },
                          { id: "price-low-high", label: "Price: Low to High" },
                          { id: "price-high-low", label: "Price: High to Low" },
                          { id: "duration-low-high", label: "Duration: Shortest First" },
                          { id: "duration-high-low", label: "Duration: Longest First" },
                        ].map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              handleSort(option.id);
                              setShowSortOptions(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[11px]
                                      ${sortOption === option.id 
                                        ? "bg-blue-50 text-blue-600" 
                                        : "hover:bg-gray-50"}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop navigation remains unchanged */}
            <div className="hidden md:flex relative items-center justify-center py-4">
              {/* Browse Categories dropdown - Left side */}
              <div className="absolute left-4 z-50 dropdown-container">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-[180px] h-11 px-6 rounded-xl 
                           bg-gradient-to-r from-purple-600 to-indigo-600
                           hover:from-purple-700 hover:to-indigo-700
                           transition-all duration-300
                           flex items-center justify-between
                           text-white shadow-lg"
                >
                  <span className="font-medium text-sm">Browse Categories</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 
                               ${showCategoryDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCategoryDropdown && (
                  <div className="absolute mt-2 w-[180px] bg-white rounded-xl shadow-xl z-50 border border-gray-100">
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">Select Category</h3>
                      
                      <div className="relative">
                        <div className="space-y-1 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => {
                                handleCategoryChange(category.id);
                                setShowCategoryDropdown(false);
                              }}
                              className={`
                                w-full text-left px-3 py-2 rounded-lg transition-all duration-200
                                flex items-center justify-between whitespace-nowrap
                                ${selectedCategory === category.id
                                  ? "bg-blue-50 text-blue-600"
                                  : "hover:bg-gray-50"
                                }
                              `}
                            >
                              <span className="truncate mr-2 text-sm">{category.name}</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                                {getCategoryCount(category.id)}
                              </span>
                            </button>
                          ))}
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-1 h-8 bg-gradient-to-t from-white pointer-events-none
                                      flex items-center justify-center">
                          <div className="animate-bounce text-gray-400 text-xs flex items-center gap-1">
                            <span>Scroll for more</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Category Buttons Container - Center */}
              <div className="hidden md:block relative max-w-3xl mx-auto px-[120px]">
                <div 
                  ref={categoryContainerRef}
                  className="overflow-x-auto hide-scrollbar relative scroll-smooth"
                >
                  <div className="flex items-center gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        data-category-id={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`flex-shrink-0 h-10 px-4 rounded-lg transition-all duration-300 z-30 
                          ${selectedCategory === category.id
                            ? "bg-gradient-to-r from-[#4338ca] to-[#5b21b6] text-white shadow-lg"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                      >
                        <span className="font-medium text-sm whitespace-nowrap">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows - Closer positioning */}
                <div className="absolute left-0 top-0 bottom-0 flex items-center z-40">
                  <button
                    onClick={() => handleScroll('left')}
                    className="flex items-center justify-center w-8 h-8
                              bg-gradient-to-br from-indigo-500/95 to-purple-600/95
                              hover:from-indigo-600 hover:to-purple-700 rounded-lg
                              transform transition-all duration-300 ease-out
                              hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/25"
                  >
                    <svg 
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24" 
                      fill="none" 
                    >
                      <path 
                        d="M14.5 17l-5-5 5-5"
                        stroke="currentColor" 
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="absolute right-0 top-0 bottom-0 flex items-center z-40">
                  <button
                    onClick={() => handleScroll('right')}
                    className="flex items-center justify-center w-8 h-8
                              bg-gradient-to-br from-indigo-500/95 to-purple-600/95
                              hover:from-indigo-600 hover:to-purple-700 rounded-lg
                              transform transition-all duration-300 ease-out
                              hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/25"
                  >
                    <svg 
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24" 
                      fill="none" 
                    >
                      <path 
                        d="M9.5 17l5-5-5-5"
                        stroke="currentColor" 
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Gradient overlays - Adjusted width */}
                <div className="absolute left-[120px] top-0 bottom-0 w-12 
                              bg-gradient-to-r from-white via-white/95 to-transparent 
                              pointer-events-none z-20" />
                <div className="absolute right-[120px] top-0 bottom-0 w-12 
                              bg-gradient-to-l from-white via-white/95 to-transparent 
                              pointer-events-none z-20" />
              </div>

              {/* Sort By dropdown - Right side */}
              <div className="absolute right-4 z-50 dropdown-container">
                <button
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  className="w-[180px] h-11 px-6 rounded-xl 
                           bg-gradient-to-r from-purple-600 to-indigo-600
                           hover:from-purple-700 hover:to-indigo-700
                           transition-all duration-300
                           flex items-center justify-between
                           text-white shadow-lg"
                >
                  <span className="font-medium text-sm">Sort By</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 
                               ${showSortOptions ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showSortOptions && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl z-50 border border-gray-100">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sort By</h3>
                      <div className="space-y-2">
                        {[
                          { id: "default", label: "Default" },
                          { id: "price-low-high", label: "Price: Low to High" },
                          { id: "price-high-low", label: "Price: High to Low" },
                          { id: "duration-low-high", label: "Duration: Shortest First" },
                          { id: "duration-high-low", label: "Duration: Longest First" },
                        ].map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleSort(option.id)}
                            className={`
                              w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                              ${sortOption === option.id
                                ? "bg-blue-50 text-blue-600"
                                : "hover:bg-gray-50"
                              }
                            `}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Section */}
        <div className="container mx-auto px-4 py-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <FaLightbulb className="text-yellow-500" />
            "Unlock Your Potential with Our Courses"
          </h2>
          <p className="text-gray-600 mt-2">
            Discover new skills and advance your career with our expertly
            crafted courses.
          </p>
        </div>

        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-12">{error}</div>
          ) : sortedAndFilteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 text-xl">
                No courses found in this category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                          gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {sortedAndFilteredCourses.map((course) => (
                <div key={course.id} className="w-full">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FaChevronUp />
        </button>
      </div>
    </div>
  );
};

export default Courses;
