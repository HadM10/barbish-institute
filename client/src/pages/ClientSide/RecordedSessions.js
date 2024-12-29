// pages/ClientSide/RecordedSessions.js
import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaChevronRight, FaChevronLeft,
  FaLaptopCode, FaMobileAlt, FaDatabase,
  FaBrain, FaCloud, FaShieldAlt, 
  FaPalette, FaServer, FaBookOpen,
  FaPlay, FaClock, FaVideo, FaTimes
} from 'react-icons/fa';
import Navbar from '../../components/User/Home/Navbar';
import CategoryAPI from '../../api/categoryAPI';
import * as courseAPI from '../../api/courseAPI';
import * as sessionAPI from '../../api/sessionAPI';

const RecordedSessions = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Organized data state
  const [organizedData, setOrganizedData] = useState({
    categories: [],
    coursesByCategory: {},
    sessionsByCourse: {}
  });

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [categoriesResult, coursesResult, sessionsResult] = await Promise.all([
          CategoryAPI.getAllCategories(),
          courseAPI.getAllCourses(),
          sessionAPI.getAllSessions()
        ]);

        if (categoriesResult.success && coursesResult.success && sessionsResult.success) {
          const categories = categoriesResult.data.data || [];
          const courses = coursesResult.data || [];
          const sessions = sessionsResult.data || [];

          // Create a map of courses by category
          const coursesByCategory = {};
          courses.forEach(course => {
            // Using 'categoryId' from the course data
            const categoryId = course.categoryId;
            if (categoryId) {
              if (!coursesByCategory[categoryId]) {
                coursesByCategory[categoryId] = [];
              }
              coursesByCategory[categoryId].push({
                ...course,
                _id: course.id, // Map id to _id for consistency
                sessionCount: 0
              });
            }
          });

          // Create a map of sessions by course
          const sessionsByCourse = {};
          sessions.forEach(session => {
            // Using 'courseId' from the session data
            const courseId = session.courseId;
            if (courseId) {
              if (!sessionsByCourse[courseId]) {
                sessionsByCourse[courseId] = [];
              }
              sessionsByCourse[courseId].push({
                ...session,
                _id: session.id // Map id to _id for consistency
              });

              // Update course session count
              Object.keys(coursesByCategory).forEach(categoryId => {
                const coursesInCategory = coursesByCategory[categoryId];
                const courseToUpdate = coursesInCategory.find(c => c.id === courseId);
                if (courseToUpdate) {
                  courseToUpdate.sessionCount++;
                }
              });
            }
          });

          // Filter out courses with no sessions
          Object.keys(coursesByCategory).forEach(categoryId => {
            coursesByCategory[categoryId] = coursesByCategory[categoryId].filter(
              course => course.sessionCount > 0
            );
          });

          // Update categories with course counts and map id to _id
          const categoriesWithCounts = categories
            .map(category => ({
              ...category,
              _id: category.id, // Map id to _id for consistency
              coursesCount: (coursesByCategory[category.id] || []).length
            }))
            .filter(category => category.coursesCount > 0);

          setOrganizedData({
            categories: categoriesWithCounts,
            coursesByCategory,
            sessionsByCourse
          });
        } else {
          setError('Failed to fetch some data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Web Development': <FaLaptopCode className="text-blue-400" />,
      'Mobile Development': <FaMobileAlt className="text-purple-400" />,
      'Data Science': <FaDatabase className="text-emerald-400" />,
      'AI': <FaBrain className="text-indigo-400" />,
      'Cloud Computing': <FaCloud className="text-sky-400" />,
      'Cyber Security': <FaShieldAlt className="text-red-400" />,
      'UI/UX': <FaPalette className="text-pink-400" />,
      'DevOps': <FaServer className="text-teal-400" />
    };
    return iconMap[categoryName] || <FaBookOpen className="text-gray-400" />;
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedCourse(null);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse({
      ...course,
      sessions: organizedData.sessionsByCourse[course._id] || []
    });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedCourse(null);
  };

  const filteredCategories = organizedData.categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#2A2665] to-[#312C7E] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#2A2665] to-[#312C7E]">
      <Navbar />
      
      <div className="pt-48 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {error ? (
            <div className="text-center text-red-500 bg-red-100/10 p-8 rounded-xl backdrop-blur-lg">
              <FaTimes className="text-4xl mx-auto mb-4" />
              <p className="text-xl mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-white
                         transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : !selectedCategory && !selectedCourse ? (
            <>
              <div className="max-w-4xl mx-auto text-center mb-20">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Professional Learning Hub
                </h1>
                <p className="text-xl text-gray-300 mb-12">
                  Access enterprise-level courses curated by industry experts
                </p>
                
                <div className="max-w-2xl mx-auto mb-20">
                  <div className="flex items-center bg-white/10 rounded-xl px-6 py-4">
                    <FaSearch className="text-white/50 text-xl mr-4" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent w-full text-white placeholder-white/50 
                               focus:outline-none text-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCategories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category)}
                    className="bg-white/10 rounded-xl p-8 text-left
                             hover:bg-white/15 transition-colors duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-3xl mb-6">
                        {getCategoryIcon(category.name)}
                      </div>
                      <FaChevronRight className="text-white/30" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-3">
                        {category.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-300">
                        <FaBookOpen className="mr-2" />
                        <span>
                          {category.coursesCount} {category.coursesCount === 1 ? 'Course' : 'Courses'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : selectedCategory && !selectedCourse ? (
            <>
              <div className="mb-16">
                <button 
                  onClick={handleBackToCategories}
                  className="text-white flex items-center gap-3 hover:text-gray-300 
                           transition-all duration-300 text-lg group
                           px-10 py-5 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <FaChevronLeft className="transform group-hover:-translate-x-1 transition-transform" />
                  Back to Categories
                </button>
              </div>

              <div className="mt-12 mb-16">
                <div className="flex items-center gap-8 p-10 bg-white/10 rounded-xl backdrop-blur-lg mb-16">
                  <span className="text-7xl">{getCategoryIcon(selectedCategory.name)}</span>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                      {selectedCategory.name}
                    </h2>
                    <p className="text-xl text-gray-300 flex items-center gap-3">
                      <FaVideo />
                      {organizedData.coursesByCategory[selectedCategory._id]?.length || 0} available courses
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-20">
                  {organizedData.coursesByCategory[selectedCategory._id]?.map((course) => (
                    <div
                      key={course._id}
                      onClick={() => handleCourseClick(course)}
                      className="group bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden
                               hover:bg-white/15 transition-all duration-300 cursor-pointer
                               border border-white/10 transform hover:scale-105"
                    >
                      {course.image && (
                        <div className="h-56 overflow-hidden">
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-full h-full object-cover transform group-hover:scale-110
                                     transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              {course.title}
                            </h3>
                            <p className="text-gray-300 line-clamp-2">{course.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm mt-4">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-300 flex items-center gap-2">
                              <FaVideo className="text-primary" />
                              {course.sessionCount} sessions
                            </span>
                          </div>
                          <div className="bg-primary/20 px-4 py-2 rounded-full">
                            <FaPlay className="text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full">
              <div className="mb-16">
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="text-white flex items-center gap-3 hover:text-gray-300 
                           transition-all duration-300 text-lg group
                           px-8 py-4 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <FaChevronLeft className="transform group-hover:-translate-x-1 transition-transform" />
                  Back to Courses
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-primary to-secondary p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {selectedCourse.title}
                  </h2>
                  <p className="text-white/80 text-base md:text-lg">
                    {selectedCourse.description}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {selectedCourse.sessions.map((session, index) => (
                  <div
                    key={session._id}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-6
                             hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start md:items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full 
                                    bg-primary/20 flex-shrink-0
                                    flex items-center justify-center">
                          <FaPlay className="text-primary text-lg md:text-xl" />
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <h4 className="text-lg md:text-xl font-medium text-white 
                                     mb-2 md:mb-1 line-clamp-2">
                            Session {index + 1}: {session.title}
                          </h4>
                          <p className="text-gray-300 flex items-center gap-2 text-sm md:text-base">
                            <FaClock />
                            <span>{session.duration} minutes</span>
                          </p>
                        </div>
                      </div>

                      <div className="ml-14 md:ml-0">
                        <button className="w-full md:w-auto px-6 py-3 rounded-full 
                                       bg-primary text-white font-medium 
                                       hover:bg-primary/90 transition-colors duration-300
                                       flex items-center justify-center gap-2 
                                       whitespace-nowrap">
                          <FaPlay className="text-sm" />
                          <span>Watch Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordedSessions;