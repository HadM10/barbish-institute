// pages/ClientSide/RecordedSessions.js
import React, { useState } from 'react';
import { FaPlay, FaLock, FaClock, FaChevronDown, FaTimes, FaGraduationCap } from 'react-icons/fa';
import Navbar from '../../components/User/Home/Navbar';

const RecordedSessions = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const categories = [
    { id: 'web', name: 'Web Development', icon: '🌐', coursesCount: 12 },
    { id: 'mobile', name: 'Mobile Development', icon: '📱', coursesCount: 8 },
    { id: 'data', name: 'Data Science', icon: '📊', coursesCount: 10 },
    { id: 'ai', name: 'AI & Machine Learning', icon: '🤖', coursesCount: 7 },
    { id: 'cloud', name: 'Cloud Computing', icon: '☁️', coursesCount: 6 },
    { id: 'security', name: 'Cyber Security', icon: '🔒', coursesCount: 5 },
    { id: 'design', name: 'UI/UX Design', icon: '🎨', coursesCount: 8 },
    { id: 'devops', name: 'DevOps', icon: '⚙️', coursesCount: 6 }
  ];

  const courses = {
    'web': [
      {
        id: 1,
        title: 'Full Stack Development',
        description: 'Master modern web development with React and Node.js',
        totalLessons: 24,
        duration: '32 hours',
        progress: 30,
        image: 'path/to/image',
        chapters: [
          {
            id: 'chapter1',
            title: 'Chapter 1: Getting Started with Web Development',
            lessons: [
              {
                id: 'lesson1_1',
                title: 'Introduction to Web Development',
                duration: '15:30',
                isCompleted: true
              },
              {
                id: 'lesson1_2',
                title: 'Setting Up Development Environment',
                duration: '20:45',
                isCompleted: false
              },
              {
                id: 'lesson1_3',
                title: 'HTML5 Fundamentals',
                duration: '25:15',
                isCompleted: false
              }
            ]
          },
          {
            id: 'chapter2',
            title: 'Chapter 2: CSS and Styling',
            lessons: [
              {
                id: 'lesson2_1',
                title: 'CSS Basics and Selectors',
                duration: '28:10',
                isCompleted: false
              },
              {
                id: 'lesson2_2',
                title: 'Flexbox and Grid Layouts',
                duration: '32:45',
                isCompleted: false
              }
            ]
          }
        ]
      },
      {
        id: 2,
        title: 'React.js Advanced Concepts',
        description: 'Deep dive into React hooks, context, and advanced patterns',
        totalLessons: 18,
        duration: '24 hours',
        progress: 0,
        chapters: [
          {
            id: 'chapter1',
            title: 'Chapter 1: React Hooks in Depth',
            lessons: [
              {
                id: 'lesson1_1',
                title: 'useState and useEffect',
                duration: '22:15',
                isCompleted: false
              },
              {
                id: 'lesson1_2',
                title: 'Custom Hooks Creation',
                duration: '18:30',
                isCompleted: false
              }
            ]
          }
        ]
      },
      {
        id: 3,
        title: 'Node.js Backend Development',
        description: 'Build scalable backend services with Node.js and Express',
        totalLessons: 20,
        duration: '28 hours',
        progress: 65,
        chapters: [
          {
            id: 'chapter1',
            title: 'Chapter 1: Node.js Fundamentals',
            lessons: [
              {
                id: 'lesson1_1',
                title: 'Introduction to Node.js',
                duration: '20:00',
                isCompleted: true
              }
            ]
          }
        ]
      }
    ],
    'mobile': [
      {
        id: 4,
        title: 'React Native Mobile Apps',
        description: 'Create cross-platform mobile applications',
        totalLessons: 22,
        duration: '30 hours',
        progress: 15,
        chapters: [
          {
            id: 'chapter1',
            title: 'Chapter 1: React Native Basics',
            lessons: [
              {
                id: 'lesson1_1',
                title: 'Setting Up React Native',
                duration: '25:00',
                isCompleted: true
              },
              {
                id: 'lesson1_2',
                title: 'Components and Props',
                duration: '28:30',
                isCompleted: false
              }
            ]
          }
        ]
      },
      {
        id: 5,
        title: 'iOS Development with Swift',
        description: 'Build native iOS applications using Swift',
        totalLessons: 25,
        duration: '35 hours',
        progress: 0,
        chapters: [
          {
            id: 'chapter1',
            title: 'Chapter 1: Swift Programming',
            lessons: [
              {
                id: 'lesson1_1',
                title: 'Swift Basics',
                duration: '23:45',
                isCompleted: false
              }
            ]
          }
        ]
      }
    ],
    'data': [
      {
        id: 6,
        title: 'Data Science with Python',
        description: 'Learn data analysis and visualization',
        totalLessons: 28,
        duration: '40 hours',
        progress: 45,
        chapters: [
          {
            id: 'chapter1',
            title: 'Chapter 1: Python for Data Science',
            lessons: [
              {
                id: 'lesson1_1',
                title: 'NumPy Fundamentals',
                duration: '30:00',
                isCompleted: true
              },
              {
                id: 'lesson1_2',
                title: 'Pandas DataFrames',
                duration: '35:15',
                isCompleted: false
              }
            ]
          }
        ]
      }
    ],
    'ai': [
      {
        id: 7,
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to ML algorithms and implementations',
        totalLessons: 30,
        duration: '45 hours',
        progress: 20,
        chapters: [
          {
            id: 'chapter1',
            title: 'Chapter 1: Introduction to ML',
            lessons: [
              {
                id: 'lesson1_1',
                title: 'What is Machine Learning?',
                duration: '20:30',
                isCompleted: true
              },
              {
                id: 'lesson1_2',
                title: 'Supervised Learning',
                duration: '25:45',
                isCompleted: false
              }
            ]
          }
        ]
      }
    ]
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowCourseModal(true);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-[156px]">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Recorded Sessions
            </h1>
            <p className="text-xl text-gray-600">
              Choose a category to explore available courses and their recordings
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-xl 
                         transition-all duration-300 text-left"
              >
                <div className="text-3xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 
                           group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-500">
                  {category.coursesCount} courses
                </p>
              </button>
            ))}
          </div>

          {/* Courses Modal */}
          {showCourseModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedCategory.icon}</span>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCategory.name} Courses
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowCourseModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses[selectedCategory.id]?.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => handleCourseClick(course)}
                        className="group bg-gray-50 rounded-xl p-6 cursor-pointer 
                                 hover:bg-primary/5 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 
                                       group-hover:text-primary transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-gray-600">{course.description}</p>
                          </div>
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <FaGraduationCap className="text-primary text-xl" />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-500">
                              {course.totalLessons} lessons
                            </span>
                            <span className="text-gray-500">
                              {course.duration}
                            </span>
                          </div>
                          {course.progress > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-gray-200 rounded-full">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <span className="text-primary">{course.progress}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Course Content Modal */}
          {selectedCourse && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {selectedCourse.title}
                      </h2>
                      <p className="text-white/80">{selectedCourse.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <FaTimes className="text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {selectedCourse.chapters.map((chapter) => (
                    <div key={chapter.id} className="mb-6">
                      <button
                        onClick={() => setExpandedChapter(
                          expandedChapter === chapter.id ? null : chapter.id
                        )}
                        className="w-full flex items-center justify-between p-4 
                                 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <span className="font-semibold text-gray-900">
                          {chapter.title}
                        </span>
                        <FaChevronDown className={`transform transition-transform 
                          ${expandedChapter === chapter.id ? 'rotate-180' : ''}`} 
                        />
                      </button>

                      {expandedChapter === chapter.id && (
                        <div className="mt-4 space-y-2">
                          {chapter.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-4 
                                       rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex 
                                  items-center justify-center ${
                                    isLoggedIn 
                                      ? 'bg-primary/10' 
                                      : 'bg-gray-100'
                                  }`}
                                >
                                  {isLoggedIn ? (
                                    <FaPlay className="text-primary" />
                                  ) : (
                                    <FaLock className="text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {lesson.title}
                                  </h4>
                                  <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <FaClock className="text-xs" />
                                    {lesson.duration}
                                  </p>
                                </div>
                              </div>
                              {!isLoggedIn ? (
                                <span className="text-sm text-primary">
                                  Login to watch
                                </span>
                              ) : (
                                <button className="px-4 py-2 rounded-full bg-primary 
                                                 text-white text-sm hover:bg-primary/90">
                                  Watch Now
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordedSessions;