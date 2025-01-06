import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaWhatsapp,
  FaFilter,
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
  const { categoryId } = location.state || {};
  
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "all");
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryList, setShowCategoryList] = useState(false);

  const filteredCourses = useMemo(() => {
    if (!courses.length) return [];
    if (selectedCategory === "all") {
      return courses;
    }
    return courses.filter(course => 
      course.categoryId === selectedCategory || 
      course.category_id === selectedCategory
    );
  }, [courses, selectedCategory]);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [categoryId]);

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

  const CourseCard = ({ course }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
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
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm mt-[100px]"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`bg-white rounded-xl overflow-hidden shadow-2xl
                         ${isLargeScreen ? 'w-full max-w-3xl h-[500px]' : 'w-full max-w-[240px]'}`}
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
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 
                               rounded-full backdrop-blur-sm transition-colors"
                    >
                      <FaTimes className="text-white text-xl" />
                    </button>
                  </div>

                  <div className="p-8 relative bg-[#1E3A8A] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white">{course.title}</h2>
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 
                                     px-6 py-2 rounded-full">
                          <span className="text-white font-bold text-xl">${course.price}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <FaClock className="text-blue-600 text-lg" />
                            <div>
                              <p className="text-gray-600 text-sm">Duration</p>
                              <p className="font-semibold">{course.duration} hours</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <FaUser className="text-blue-600 text-lg" />
                            <div>
                              <p className="text-gray-600 text-sm">Instructor</p>
                              <p className="font-semibold">{course.instructor || 'Mahdi'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                        <p className="text-gray-300 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">What You'll Learn</h3>
                        <ul className="space-y-2">
                          {course.content?.split('\n').map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                              <span className="text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white
                                 px-8 py-4 rounded-xl transition-all duration-300
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
              ) : (
                <div className="relative">
                  <button
                    className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 
                             rounded-full shadow-lg z-10"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? "View Image" : "View Details"}
                  </button>

                  {showDetails ? (
                    <div className="p-5 bg-gradient-to-br from-[#4338ca] to-[#5b21b6]">
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
                      <h2 className="text-xl font-bold text-white mb-4">{course.title}</h2>
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
                      <div className="mb-4">
                        <h3 className="text-white font-semibold mb-2">Description</h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {course.description}
                        </p>
                      </div>
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

                      <div className="sticky bottom-0 left-0 right-0 pt-4 
                                    bg-gradient-to-t from-[#4338ca] to-transparent">
                        <button
                          className="w-full bg-white hover:bg-white/90 text-indigo-600
                                   px-6 py-3 rounded-xl transition-all duration-300
                                   flex items-center justify-center gap-2
                                   text-lg font-semibold shadow-xl"
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
              )}
            </motion.div>
          </div>
        )}
      </div>
    );
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategoryList(false);
  };

  const getCategoryCourseCount = (categoryId) => {
    if (categoryId === "all") return courses.length;
    return courses.filter(course => course.categoryId === categoryId || course.category_id === categoryId).length;
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

              <div className="ml-3 relative">
                <button
                  onClick={() => setShowCategoryList(!showCategoryList)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full
                           bg-gradient-to-r from-blue-500 to-purple-500 text-white
                           shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <FaFilter className="text-sm" />
                  <span className="hidden sm:inline text-sm">Filters</span>
                </button>

                {/* Category List */}
                {showCategoryList && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
                    <h3 className="text-lg font-bold mb-4">Categories</h3>
                    <ul className="space-y-2">
                      {categories.map((category) => (
                        <li key={category.id} className="flex justify-between items-center">
                          <button
                            onClick={() => handleCategoryChange(category.id)}
                            className="text-blue-600 hover:underline"
                          >
                            {category.name}
                          </button>
                          <span className="text-gray-600">
                            {getCategoryCourseCount(category.id)} courses
                          </span>
                        </li>
                      ))}
                    </ul>
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