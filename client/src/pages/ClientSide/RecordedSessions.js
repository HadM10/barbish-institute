// pages/ClientSide/RecordedSessions.js
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaVideo, FaChevronRight, FaBookReader, FaChevronDown, FaCheckCircle } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import Navbar from "../../components/User/Home/Navbar";
import { getUserSubscribedCourses } from "../../api/userAPI";
import { markSessionAsWatched, getSessionProgress } from "../../api/userSessionAPI";

// Progress Bar Component
const ProgressBar = ({ watchedCount, totalCount }) => {
  const percentage = totalCount > 0 ? (watchedCount / totalCount) * 100 : 0;
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-600">
        {watchedCount}/{totalCount} completed
      </span>
    </div>
  );
};

const EmptyState = ({ type, courseName }) => {
  const content = {
    notLoggedIn: {
      icon: <MdSubscriptions className="text-6xl text-blue-500 mb-4" />,
      title: "Login Required",
      description: "Please login to access your courses and learning materials.",
      actionText: "Login Now",
      actionLink: "/login",
    },
    noSubscription: {
      icon: <FaBookReader className="text-6xl text-blue-500 mb-4" />,
      title: "No Active Subscriptions",
      description: "Subscribe to our courses to start your learning journey!",
      actionText: "Browse Courses",
      actionLink: "/courses",
    },
    noSessions: {
      icon: <FaVideo className="text-6xl text-blue-500 mb-4" />,
      title: "No Recorded Sessions",
      description: `This course doesn't have any recorded sessions yet. Our team is working on creating high-quality content for ${courseName}. We'll notify you when new sessions are added.`,
      actionText: "Back to Courses",
      actionLink: "/courses",
    },
  };

  const { icon, title, description, actionText, actionLink } = content[type];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
      <div className="flex justify-center">{icon}</div>
      <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-3">{title}</h2>
      <p className="text-gray-600 text-lg mb-8">{description}</p>
      <Link
        to={actionLink}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl 
                 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
      >
        {actionText}
        <FaChevronRight className="ml-2" />
      </Link>
    </div>
  );
};

const RecordedSessions = () => {
  const [courses, setCourses] = useState([]);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [sessionsProgress, setSessionsProgress] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch progress for a specific course
  const fetchCourseProgress = useCallback(async (courseId) => {
    try {
      console.log('Fetching progress for course:', courseId);
      const response = await getSessionProgress(courseId);
      console.log('Progress response:', response);
      if (response.status === 'success') {
        setSessionsProgress(prev => ({
          ...prev,
          [courseId]: response.data
        }));
      }
    } catch (error) {
      console.error("Error fetching course progress:", error);
    }
  }, []);

  // Fetch all courses and their progress
  const fetchCourses = useCallback(async () => {
    try {
      const response = await getUserSubscribedCourses();
      setCourses(response.data);
      
      // Initialize expanded state and fetch progress for each course
      const initialExpandedState = {};
      response.data.forEach(course => {
        initialExpandedState[course.id] = false;
        fetchCourseProgress(course.id);
      });
      setExpandedCourses(initialExpandedState);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [fetchCourseProgress]);

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [fetchCourses, token]);

  const handleWatchClick = (sessionId) => {
    navigate(`/video-player/${sessionId}`);
  };

  const handleMarkAsWatched = async (courseId, sessionId) => {
    try {
      const response = await markSessionAsWatched(sessionId);
      if (response.status === 'success') {
        // Refetch the course progress to update the UI
        await fetchCourseProgress(courseId);
        
        // Optionally show a success message
        console.log('Session marked as watched successfully');
      }
    } catch (error) {
      console.error("Error marking session as watched:", error);
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="pt-40 pb-20">
          <EmptyState type="notLoggedIn" />
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="pt-40 pb-20">
          <EmptyState type="noSubscription" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-52 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            My Learning Journey
          </h1>

          <div className="space-y-4">
            {courses.map((course) => {
              const courseProgress = sessionsProgress[course.id] || { 
                totalSessions: course.Sessions?.length || 0, 
                watchedSessions: 0, 
                sessions: [] 
              };
              
              return (
                <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div
                    onClick={() => toggleCourse(course.id)}
                    className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-blue-100 text-sm font-medium">
                          {course.Category?.name}
                        </span>
                        <h2 className="text-xl font-bold text-white mt-1">
                          {course.title}
                        </h2>
                      </div>
                      <FaChevronDown
                        className={`text-white transition-transform duration-300 ${
                          expandedCourses[course.id] ? "transform rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className={`transition-all duration-300 ease-in-out
                               ${expandedCourses[course.id] ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                    
                    {/* Progress Bar */}
                    <div className="p-4 border-b border-gray-200">
                      <ProgressBar 
                        watchedCount={courseProgress.watchedSessions}
                        totalCount={courseProgress.totalSessions}
                      />
                    </div>

                    {!course.Sessions?.length ? (
                      <div className="p-6">
                        <EmptyState type="noSessions" courseName={course.title} />
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {course.Sessions.map((session, index) => {
                          const sessionProgress = courseProgress.sessions.find(
                            s => s.sessionId === session.id
                          );
                          const isWatched = sessionProgress?.isWatched;

                          return (
                            <div key={session.id} className="p-4 hover:bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    {isWatched ? (
                                      <FaCheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <FaVideo className="h-5 w-5 text-blue-500" />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                      Session {index + 1}: {session.title}
                                    </h3>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {!isWatched && (
                                    <button
                                      onClick={() => handleMarkAsWatched(course.id, session.id)}
                                      className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                      Mark as Watched
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleWatchClick(session.id)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent 
                                             text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                  >
                                    Watch Now
                                    <FaChevronRight className="ml-2 h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordedSessions;
