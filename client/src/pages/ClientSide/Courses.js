import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaWhatsapp,
  FaTimes,
  FaClock,
  FaUser,
  FaChevronUp,
  FaLightbulb,
} from 'react-icons/fa';
import CategoryAPI from '../../api/categoryAPI';
import { getAllCourses } from '../../api/courseAPI';
import englishCourseImg from '../../assets/images/english-course.jpg';

const Courses = () => {
  const location = useLocation();
  
  // Initialize with "all" by default
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchedCourse, setSearchedCourse] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [sortOption, setSortOption] = useState('default');

  // Update initialization effect
  useEffect(() => {
    if (location.state?.searchTerm && location.state?.courseId) {
      const course = courses.find(course => course.id === location.state.courseId);
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

  // Update fetchData
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categoryResult = await CategoryAPI.getAllCategories();
        if (categoryResult.success) {
          setCategories([
            { id: "all", name: "All Courses" },
            ...categoryResult.data.data
          ]);
        }

        const courseResult = await getAllCourses();
        if (courseResult.success) {
          const coursesData = courseResult.data.data || courseResult.data || [];
          setCourses(coursesData);
          
          if (location.state?.searchTerm && location.state?.courseId) {
            const exactCourse = coursesData.find(course => 
              course.id === location.state.courseId
            );
            if (exactCourse) {
              setSearchedCourse(exactCourse);
              setSelectedCategory(exactCourse.categoryId || exactCourse.category_id);
            }
          } else if (!location.state?.categoryId) {
            setSelectedCategory("all");
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
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
    setShowFilterOptions(false);
  };

  // Update filtered courses logic
  const filteredCourses = useMemo(() => {
    if (!courses.length) return [];
    
    // Show only exact searched course if we have an active search
    if (searchedCourse && location.state?.courseId) {
      return [searchedCourse];
    }
    
    // Otherwise show all courses in the selected category
    if (selectedCategory === "all") {
      return courses;
    }
    
    return courses.filter(course => 
      course.categoryId === selectedCategory || 
      course.category_id === selectedCategory
    );
  }, [courses, selectedCategory, searchedCourse, location.state?.courseId]);

  const sortedAndFilteredCourses = useMemo(() => {
    let result = [...filteredCourses];
    
    switch (sortOption) {
      case 'price-low-high':
        return result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-high-low':
        return result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'duration-low-high':
        return result.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
      case 'duration-high-low':
        return result.sort((a, b) => parseFloat(b.duration) - parseFloat(a.duration));
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
            { id: "all", name: "All Courses" },
            ...categoryResult.data.data
          ]);
        }

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

  const getCategoryCourseCount = (categoryId) => {
    if (categoryId === "all") return courses.length;
    return courses.filter(course => course.categoryId === categoryId || course.category_id === categoryId).length;
  };

  const CourseCard = ({ course }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLargeScreen = window.innerWidth >= 1024;

    return (
      <div className="relative group animate-fadeIn">
        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform 
                     transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                     border border-gray-100"
          onClick={() => setIsExpanded(true)}
        >
          <div className="relative h-[280px] overflow-hidden">
            <img
              src={englishCourseImg}
              alt={course.title}
              className="w-full h-full object-cover transform 
                       group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600
                           px-4 py-2 rounded-tl-lg shadow-lg">
              <span className="text-white font-bold text-lg">${course.price}</span>
            </div>
          </div>

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

        {isExpanded && (
          <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`
                bg-white rounded-xl overflow-hidden shadow-2xl relative
                ${isLargeScreen 
                  ? 'w-[70%] max-w-[1000px] flex flex-col' 
                  : 'w-[90%] max-w-[500px]'}
                max-h-[90vh]
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {isLargeScreen ? (
                <div className="grid grid-cols-2 h-full">
                  <div className="relative h-full">
                    <img
                      src={englishCourseImg}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="bg-[#1E3A8A] flex flex-col h-full">
                    <div className="p-8 flex-1 overflow-y-auto">
                      <div className="relative mb-6">
                        <button
                          onClick={() => setIsExpanded(false)}
                          className="absolute -top-2 right-0 p-2 bg-black/20 hover:bg-black/30 
                                   rounded-full backdrop-blur-sm transition-colors"
                        >
                          <FaTimes className="text-white text-xl" />
                        </button>
                        
                        <h2 className="text-2xl font-bold text-white pr-12 mb-3">{course.title}</h2>
                        <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 
                                     px-4 py-2 rounded-full">
                          <span className="text-white font-bold">${course.price}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/10 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <FaClock className="text-blue-400 text-lg" />
                            <div>
                              <p className="text-white/70 text-sm">Duration</p>
                              <p className="text-white font-semibold">{course.duration} hours</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <FaUser className="text-blue-400 text-lg" />
                            <div>
                              <p className="text-white/70 text-sm">Instructor</p>
                              <p className="text-white font-semibold">{course.instructor || 'Mahdi'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                          <p className="text-gray-300 leading-relaxed">
                            {course.description}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">What You'll Learn</h3>
                          <ul className="space-y-2">
                            {course.content?.split('\n').map((item, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                                <span className="text-gray-300">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-6">
                          <button 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white
                                     px-6 py-4 rounded-xl transition-all duration-300
                                     hover:shadow-xl hover:shadow-blue-600/20
                                     flex items-center justify-center gap-2 text-lg font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add your enquire logic here
                            }}
                          >
                            <FaWhatsapp className="text-xl" />
                            <span>Enquire Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="relative h-[300px]">
                    <img
                      src={englishCourseImg}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/30 
                               rounded-full backdrop-blur-sm transition-colors"
                    >
                      <FaTimes className="text-white text-xl" />
                    </button>
                  </div>

                  <div className="p-6 bg-[#1E3A8A]">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white flex-1">{course.title}</h2>
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 rounded-full ml-4">
                        <span className="text-white font-bold">${course.price}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h3 className="text-white font-semibold mb-2">Description</h3>
                        <p className="text-white/90 text-sm">
                          {course.description}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-semibold mb-2">What You'll Learn</h3>
                        <ul className="space-y-1">
                          {course.content?.split('\n').map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-white/90 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-1.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button className="w-full bg-white text-indigo-600 px-6 py-3 rounded-xl
                                   flex items-center justify-center gap-2 font-semibold">
                      <FaWhatsapp className="text-lg" />
                      <span>Enquire Now</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    );
  };

  const FilterSection = () => (
    <div className="ml-3 relative">
      <button
        onClick={() => setShowFilterOptions(!showFilterOptions)}
        className={`
          flex items-center gap-3 px-5 py-2.5 rounded-xl
          bg-white border border-gray-200 hover:border-blue-400
          text-gray-700 hover:text-blue-600
          shadow-sm hover:shadow-md
          transition-all duration-300 ease-in-out
          ${showFilterOptions ? 'border-blue-400 text-blue-600' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          <svg 
            className="w-5 h-5" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7Z" 
              fill="currentColor"
            />
            <path 
              d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z" 
              fill="currentColor"
            />
            <path 
              d="M9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z" 
              fill="currentColor"
            />
          </svg>
          <span className="font-medium">Refine</span>
        </div>
        <div className={`
          transform transition-transform duration-300
          ${showFilterOptions ? 'rotate-180' : ''}
        `}>
          <svg 
            className="w-4 h-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M19 9L12 16L5 9" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Enhanced Filter Options Dropdown */}
      {showFilterOptions && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl 
                      border border-gray-100 overflow-hidden z-50
                      transform transition-all duration-300 ease-out">
          <div className="divide-y divide-gray-100">
            {/* Sort Options */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg 
                  className="w-5 h-5 text-blue-500" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M3 4H16M3 8H12M3 12H9M13 12L17 8M17 8L21 12M17 8V20" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                Sort By
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'default', label: 'Most Relevant' },
                  { id: 'price-low-high', label: 'Price: Low to High' },
                  { id: 'price-high-low', label: 'Price: High to Low' },
                  { id: 'duration-low-high', label: 'Duration: Shortest First' },
                  { id: 'duration-high-low', label: 'Duration: Longest First' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortOption(option.id);
                      setShowFilterOptions(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200
                      flex items-center justify-between
                      ${sortOption === option.id 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    <span>{option.label}</span>
                    {sortOption === option.id && (
                      <svg 
                        className="w-5 h-5 text-blue-600" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M20 6L9 17L4 12" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg 
                  className="w-5 h-5 text-blue-500" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M4 6H20M4 12H20M4 18H20" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                Categories
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      handleCategoryChange(category.id);
                      setShowFilterOptions(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200
                      flex items-center justify-between
                      ${selectedCategory === category.id 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    <span>{category.name}</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                      {getCategoryCourseCount(category.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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
                  <div className="flex items-center gap-3 py-2">
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

              <FilterSection />
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
          ) : sortedAndFilteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 text-xl">
                No courses found in this category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedAndFilteredCourses.map((course) => (
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

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FaChevronUp />
        </button>
      </div>
    </div>
  );
};

export default Courses;