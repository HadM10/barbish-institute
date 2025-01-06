/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FaWhatsapp,
  FaFilter,
  FaTimes,
  FaClock,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaLightbulb,
} from "react-icons/fa";
import { motion } from "framer-motion";
import CategoryAPI from '../../api/categoryAPI';
import { getAllCourses } from '../../api/courseAPI';
import englishCourseImg from '../../assets/images/english-course.jpg';
import { useLocation, useNavigate } from 'react-router-dom';

const Courses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { highlightCourseId, searchTerm: initialSearchTerm, categoryId, categoryName } = location.state || {};
  
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "all");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categories.length) return [];
    
    // If we have a specific category from search, show that category first
    if (categoryId) {
      const selectedCat = categories.find(cat => cat.id === categoryId);
      if (selectedCat) {
        return [
          selectedCat,
          ...categories.filter(cat => cat.id !== categoryId)
        ];
      }
    }
    
    return categories;
  }, [categories, categoryId]);

  // Filter courses based on category and search
  const filteredCourses = useMemo(() => {
    if (!courses.length) return [];
    
    // If viewing all courses
    if (selectedCategory === "all") {
      return courses;
    }
    
    // If searching for a specific course
    if (location.state?.type === 'course' && location.state?.highlightCourseId) {
      return courses.filter(course => course.id === location.state.highlightCourseId);
    }
    
    // Filter by category
    return courses.filter(course => 
      course.categoryId === selectedCategory || 
      course.category_id === selectedCategory
    );
  }, [courses, selectedCategory, location.state]);

  // Set initial category when component mounts or when categoryId changes
  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [categoryId]);

  // Fetch categories and courses when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoryResult = await CategoryAPI.getAllCategories();
        if (categoryResult.success) {
          setCategories([
            { id: "all", name: "All Courses" },
            ...categoryResult.data.data
          ]);
        }

        // Fetch courses
        const courseResult = await getAllCourses();
        if (courseResult.success) {
          const coursesData = courseResult.data.data || courseResult.data || [];
          setCourses(coursesData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll handler for categories
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 200;
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount;
      } else {
        current.scrollLeft += scrollAmount;
      }
    }
  };

  const CourseCard = ({ course }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    return (
      <div className="relative group animate-fadeIn">
        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform 
                     transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                     border border-gray-100"
          onClick={() => setIsExpanded(true)}
        >
          {/* Image Container */}
          <div className="relative h-[280px] overflow-hidden">
            <img
              src={englishCourseImg}
              alt={course.title}
              className="w-full h-full object-cover transform 
                       group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

            {/* Price Badge */}
            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600
                           px-4 py-2 rounded-tl-lg shadow-lg">
              <span className="text-white font-bold text-lg">${course.price}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1 group-hover:text-blue-600
                           transition-colors duration-300">
              {course.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-5 line-clamp-2">
              {course.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <FaClock className="text-blue-600 text-sm" />
                <span className="text-sm text-blue-600 font-medium">
                  {course.duration} hours
                </span>
              </div>
              <button
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                         font-medium rounded-full hover:shadow-xl hover:shadow-blue-600/20
                         transition-all duration-300 transform hover:scale-105
                         flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <FaWhatsapp className="text-lg" />
                <span>Enquire Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isExpanded && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-xl w-full max-w-[400px] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Toggle Button */}
                <button
                  className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "View Image" : "View Details"}
                </button>

                {showDetails ? (
                  <div className="p-5 bg-gradient-to-br from-[#4338ca] to-[#5b21b6] overflow-y-auto">
                    {/* Header with Price and Close */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="bg-white/95 px-4 py-2 rounded-full">
                        <span className="text-primary font-bold text-lg">${course.price}</span>
                      </div>
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <FaTimes className="text-white text-lg" />
                      </button>
                    </div>

                    {/* Course Title */}
                    <h2 className="text-xl font-bold text-white mb-4">{course.title}</h2>

                    {/* Course Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white/10 rounded-lg p-2.5">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-white text-sm" />
                          <span className="text-white text-sm">{course.duration} hours</span>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2.5">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-white text-sm" />
                          <span className="text-white text-sm">{course.instructor || 'Mahdi'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Course Description */}
                    <div className="mb-4">
                      <h3 className="text-white font-semibold mb-2">Description</h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* What You'll Learn */}
                    <div className="mb-4">
                      <h3 className="text-white font-semibold mb-2">What You'll Learn</h3>
                      <ul className="space-y-2">
                        {course.content?.split('\n').map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-white/90 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-1.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full">
                    <img
                      src={englishCourseImg}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  };

  // Simplify the state management useEffect
  useEffect(() => {
    const locationState = location.state;
    
    if (!locationState) {
      setSelectedCategory("all");
      return;
    }

    if (locationState.type === 'category') {
      setSelectedCategory(locationState.categoryId);
    } else if (locationState.type === 'course') {
      setSelectedCategory(locationState.categoryId || "all");
    }
  }, [location.state]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowFilters(false); // Close the filter box
    const newState = {
      categoryId,
      type: 'category',
      highlightCourseId: null,
      searchTerm: null
    };
    navigate(location.pathname, { state: newState, replace: true });
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-[160px]">
        <div className="bg-white border-b border-gray-200 z-30">
          <div className="container mx-auto px-4">
            <div className="relative flex items-center justify-between py-4">
              <div className="flex-1 overflow-x-auto hide-scrollbar">
                {isLoading ? (
                  <div className="flex items-center justify-center w-full py-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 py-3">{error}</div>
                ) : (
                  <div
                    ref={scrollContainerRef}
                    className="flex items-center gap-3 py-2 overflow-x-auto hide-scrollbar touch-pan-x"
                  >
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-full transition-all duration-300
                          ${selectedCategory === category.id
                            ? "bg-gradient-to-r from-[#4338ca] to-[#5b21b6] text-white shadow-lg"
                            : "bg-white/10 text-gray-800 hover:bg-gray-100"
                          }`}
                      >
                        <span className="font-medium text-sm">{category.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="ml-3">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full
                           bg-gradient-to-r from-blue-500 to-purple-500 text-white
                           shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <FaFilter className="text-sm" />
                  <span className="hidden sm:inline text-sm">Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Popup */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
            onClick={() => setShowFilters(false)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Select Category</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full transition-all duration-300
                      ${selectedCategory === category.id
                        ? "bg-gradient-to-r from-[#4338ca] to-[#5b21b6] text-white shadow-lg"
                        : "bg-white/10 text-gray-800 hover:bg-gray-100"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Motivational Section */}
        <div className="container mx-auto px-4 py-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <FaLightbulb className="text-yellow-500" />
            "Unlock Your Potential with Our Courses"
          </h2>
          <p className="text-gray-600 mt-2">
            Discover new skills and advance your career with our expertly crafted courses.
          </p>
        </div>

        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-12">{error}</div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 text-xl">
                No courses found in this category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FaChevronUp />
        </button>
      </div>
    </div>
  );
};

export default Courses;