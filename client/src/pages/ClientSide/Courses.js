// File: src/pages/ClientSide/Courses.js
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
  FaSearch,
} from "react-icons/fa";
import { motion } from "framer-motion";
import CategoryAPI from '../../api/categoryAPI';
import { getAllCourses } from '../../api/courseAPI';
import englishCourseImg from '../../assets/images/english-course.jpg';

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories and courses when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        console.log('Fetching categories...');
        const categoryResult = await CategoryAPI.getAllCategories();
        console.log('Category result:', categoryResult);

        if (categoryResult.success) {
          const categoriesData = categoryResult.data.data || [];
          setCategories([
            { 
              id: "all", 
              name: "All Courses"
            },
            ...categoriesData
          ]);
        }

        // Fetch courses
        console.log('Fetching courses...');
        const courseResult = await getAllCourses();
        console.log('Course result:', courseResult);

        if (courseResult.success) {
          const coursesData = courseResult.data.data || courseResult.data || [];
          console.log('Raw courses data:', coursesData);
          // Log a sample course to see its structure
          if (coursesData.length > 0) {
            console.log('Sample course structure:', coursesData[0]);
          }
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

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Add search functionality for both categories and courses
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Updated filtering logic to include search
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "all" || 
        course.categoryId === selectedCategory || 
        course.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [selectedCategory, courses, searchTerm]);

  // Log filtered results
  console.log('Filtered courses count:', filteredCourses.length);

  const CourseCard = ({ course }) => {
    const [isExpanded, setIsExpanded] = useState(false);

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
            <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600
                           px-4 py-2 rounded-full shadow-lg">
              <span className="text-white font-bold text-lg">
                ${course.price}
              </span>
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
              className="bg-gradient-to-br from-[#4338ca] to-[#5b21b6] rounded-3xl w-full max-w-5xl 
                         max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[90vh]">
                {/* Left Side - Responsive Image (clean, no buttons) */}
                <div className="relative h-[300px] lg:h-full">
                  <img
                    src={englishCourseImg}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Side - Content with price and close button */}
                <div className="overflow-y-auto p-6 sm:p-8 max-h-[calc(90vh-300px)] lg:max-h-[90vh]
                              scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {/* Add price and close button at the top */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white line-clamp-2">
                      {course.title}
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/95 px-6 py-3 rounded-full shadow-lg">
                        <span className="text-primary font-bold text-xl sm:text-2xl">
                          ${course.price}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                                  bg-white/10 hover:bg-white/20 transition-colors duration-300 
                                  flex items-center justify-center backdrop-blur-sm"
                      >
                        <FaTimes className="text-white text-lg sm:text-xl" />
                      </button>
                    </div>
                  </div>

                  {/* Course Stats - Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
                    <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 
                                      flex items-center justify-center">
                          <FaClock className="text-white text-lg sm:text-xl" />
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Duration</p>
                          <p className="text-white font-semibold text-base sm:text-lg">
                            {course.duration} hours
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 
                                      flex items-center justify-center">
                          <FaUser className="text-white text-lg sm:text-xl" />
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Instructor</p>
                          <p className="text-white font-semibold text-base sm:text-lg">
                            {course.instructor || 'Mahdi'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Description - Auto-truncating */}
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                      Course Description
                    </h3>
                    <p className="text-white/80 leading-relaxed text-sm sm:text-base 
                                 overflow-auto max-h-[150px] scrollbar-thin 
                                 scrollbar-thumb-white/20 scrollbar-track-transparent">
                      {course.description}
                    </p>
                  </div>

                  {/* What You'll Learn - Scrollable List */}
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                      What You'll Learn
                    </h3>
                    <div className="max-h-[200px] overflow-y-auto scrollbar-thin 
                                  scrollbar-thumb-white/20 scrollbar-track-transparent">
                      <ul className="space-y-2 sm:space-y-3">
                        {course.content?.split('\n').map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-white/80 text-sm sm:text-base">
                            <div className="w-2 h-2 rounded-full bg-white/40 mt-2" />
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Enquire Button - Always Visible */}
                  <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-[#4338ca] to-transparent">
                    <button
                      className="w-full bg-white hover:bg-white/90 text-indigo-600 
                               px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 
                               flex items-center justify-center gap-2 sm:gap-3 
                               text-base sm:text-lg font-semibold shadow-xl
                               hover:shadow-white/20"
                    >
                      <FaWhatsapp className="text-xl sm:text-2xl" />
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

  return (
    <div className="min-h-screen bg-[#1E1B4B]">
      <div className="pt-24">
        <div className="bg-gradient-to-br from-[#1E1B4B] via-[#2A2665] to-[#312C7E] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" 
               style={{
                 backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                 backgroundSize: '24px 24px'
               }}
          />
          <div className="container mx-auto px-4 py-20 relative">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-white/10 rounded-full text-[#64B5F6] font-medium">
                  Our Courses
                </span>
                <span className="h-px flex-1 bg-[#64B5F6]/20" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your Career with Professional Training
              </h1>
              <p className="text-xl text-[#64B5F6] leading-relaxed max-w-2xl">
                Choose from our wide range of industry-focused courses designed
                to help you succeed in today's digital world
              </p>
            </div>
          </div>
        </div>

        {/* Add Search Box */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-white/10 rounded-full text-white 
                         placeholder-white/50 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/50 transition-all duration-300"
              />
              <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 
                                 text-white/50 text-xl" />
            </div>
          </div>
        </div>

        <div className="sticky top-20 bg-[#1E1B4B] border-b border-white/10 z-30">
          <div className="container mx-auto px-4">
            <div className="relative flex items-center justify-between">
              <div className="flex-1 flex items-center gap-2 overflow-x-auto hide-scrollbar">
                {isLoading ? (
                  <div className="flex items-center justify-center w-full py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 py-4">{error}</div>
                ) : (
                  <>
                    <button
                      onClick={() => scroll('left')}
                      className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      <FaChevronLeft />
                    </button>
                    
                    <div
                      ref={scrollContainerRef}
                      className="flex items-center gap-3 py-4 overflow-x-auto hide-scrollbar"
                    >
                      {filteredCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            console.log('Setting category:', category.id);
                            setSelectedCategory(category.id);
                          }}
                          className={`flex-shrink-0 px-6 py-2.5 rounded-full transition-all duration-300
                            ${selectedCategory === category.id
                              ? "bg-gradient-to-r from-[#4338ca] to-[#5b21b6] text-white shadow-lg"
                              : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                        >
                          <span className="font-medium">{category.name}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => scroll('right')}
                      className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>

              <div className="ml-4 relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full
                           bg-white/10 hover:bg-white/20 text-white
                           transition-all duration-300"
                >
                  <FaFilter className="text-sm" />
                  <span className="hidden sm:inline">Filters</span>
                </button>

                {/* Filter Dropdown */}
                {showFilters && (
                  <>
                    <div 
                      className="fixed inset-0 bg-black/20 z-40"
                      onClick={() => setShowFilters(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl 
                                  border border-gray-100 z-50 max-h-[80vh] overflow-y-auto">
                      <div className="sticky top-0 p-4 border-b border-gray-100 bg-white">
                        <h3 className="font-semibold text-gray-800">All Categories</h3>
                      </div>
                      <div className="p-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setShowFilters(false);
                            }}
                            className={`w-full px-4 py-3 flex items-center rounded-lg
                                      transition-colors duration-200
                                      ${selectedCategory === category.id 
                                        ? 'bg-[#4338ca]/10 text-[#4338ca]' 
                                        : 'hover:bg-gray-50'}`}
                          >
                            <span className="font-medium">{category.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-12">{error}</div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/70 text-xl">
                No courses found matching your search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
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
      </div>
    </div>
  );
};

export default Courses;
