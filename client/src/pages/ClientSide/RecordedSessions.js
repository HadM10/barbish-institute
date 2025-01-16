// pages/ClientSide/RecordedSessions.js
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaVideo,
  FaChevronRight,
  FaBookReader,
  FaChevronDown,
  FaCheckCircle,
  FaChevronUp,
} from "react-icons/fa";
import { MdSubscriptions, MdOndemandVideo } from "react-icons/md";
import Navbar from "../../components/User/Home/Navbar";
import { getUserSubscribedCourses } from "../../api/userAPI";
import {
  markSessionAsWatched,
  getSessionProgress,
} from "../../api/userSessionAPI";
import { AnimatePresence, motion } from "framer-motion";
import Login from "../../components/Common/Login";

const RecordedSessions = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [sessionsProgress, setSessionsProgress] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // EmptyState Component
  // EmptyState Component
const EmptyState = ({ type, courseName, setIsLoginOpen }) => {
  const content = {
    notLoggedIn: {
      icon: <MdSubscriptions className="text-6xl text-blue-500 mb-4" />,
      title: "Login Required",
      description:
        "Please login to access your courses and learning materials.",
      actionText: "Login Now",
      showAction: true,
    },
    noSubscription: {
      icon: <FaBookReader className="text-6xl text-blue-500 mb-4" />,
      title: "No Active Subscriptions",
      description: "Subscribe to our courses to start your learning journey!",
      actionText: "Browse Courses",
      actionLink: "/courses",
      showAction: true,
    },
    noSessions: {
      icon: <FaVideo className="text-6xl text-gray-400 mb-4" />,
      title: "Coming Soon",
      description: `We're currently preparing the recorded sessions for ${courseName}. Our team is working hard to create high-quality content that meets our standards. You'll be notified as soon as new content becomes available.`,
      showAction: false,
    },
  };

  const currentContent = content[type];

  const handleAction = () => {
    if (type === 'notLoggedIn') {
      setIsLoginOpen(true);
    }
  };

  const renderAction = () => {
    if (!currentContent.showAction) return null;

    if (type === 'notLoggedIn') {
      return (
        <button
          onClick={handleAction}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl 
                    hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          {currentContent.actionText}
          <FaChevronRight className="ml-2" />
        </button>
      );
    }

    return (
      <Link
        to={currentContent.actionLink}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl 
                  hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
      >
        {currentContent.actionText}
        <FaChevronRight className="ml-2" />
      </Link>
    );
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-8 text-center">
      <div className="flex justify-center">{currentContent.icon}</div>
      <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
        {currentContent.title}
      </h2>
      <p className="text-gray-600 text-base mb-6">{currentContent.description}</p>
      {renderAction()}
    </div>
  );
};

  

  // Fetch progress for a specific course
  const fetchCourseProgress = useCallback(async (courseId) => {
    try {
      console.log("Fetching progress for course:", courseId);
      const response = await getSessionProgress(courseId);
      if (response.status === "success") {
        setSessionsProgress((prev) => ({
          ...prev,
          [courseId]: response.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching course progress:", error);
    }
  }, []);

  // Handle watch status updates
  const handleWatchStatusUpdate = async (courseId, sessionId) => {
    try {
      const currentProgress = sessionsProgress[courseId];
      const sessionProgress = currentProgress?.sessions?.find(
        (s) => s.sessionId === sessionId
      );
      const newWatchStatus = !sessionProgress?.isWatched;

      const response = await markSessionAsWatched(sessionId, newWatchStatus);

      if (response.status === "success") {
        await fetchCourseProgress(courseId);
        console.log(
          `Successfully ${
            newWatchStatus ? "marked as watched" : "marked as unwatched"
          }`
        );
      }
    } catch (error) {
      console.error("Error updating watch status:", error);
      alert("Failed to update watch status. Please try again.");
    }
  };

  // Handle watch click
  const handleWatchClick = (sessionId) => {
    navigate(`/video-player/${sessionId}`);
  };

  // Toggle course expansion
  const toggleCourse = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  // Fetch all courses
  const fetchCourses = useCallback(async () => {
    try {
      const response = await getUserSubscribedCourses();
      setCourses(response.data);

      const initialExpandedState = {};
      response.data.forEach((course) => {
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

  // Session Item Component
  const SessionItem = ({
    session,
    index,
    isWatched,
    onToggleWatch,
    onWatch,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const parseContent = (content) => {
      if (!content) return [];
      return content
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.trim());
    };

    return (
      <div
        className="bg-white border-b border-gray-100 transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`p-3 md:p-4 ${isHovered ? "bg-blue-50/50" : ""}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <div className="flex-shrink-0 mt-1 sm:mt-0">
                {isWatched ? (
                  <FaCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                ) : (
                  <MdOndemandVideo className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 w-full text-left group">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1 sm:line-clamp-none group-hover:text-blue-600">
                      Session {index + 1}: {session.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs ${
                          isWatched ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {isWatched ? "Completed" : "Not started"}
                      </span>
                      {session.duration && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {session.duration} min
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-7 sm:ml-0">
              <button
                onClick={onToggleWatch}
                className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm font-medium
                  ${
                    isWatched
                      ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                      : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  } 
                  transition-all duration-200`}
              >
                <MdOndemandVideo className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">
                  {isWatched ? "Mark as Unwatched" : "Mark as Watched"}
                </span>
                <span className="sm:hidden">
                  {isWatched ? "Unwatch" : "Watch"}
                </span>
              </button>
              <button
                onClick={onWatch}
                className="flex items-center px-3 py-1 sm:px-4 sm:py-1.5 bg-blue-600 text-white rounded
                         hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-sm"
              >
                <span>Watch</span>
                <FaChevronRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>

          {/* Updated Hover Content Preview */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pl-8"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Description Card */}
                  {session.description && (
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Session Description
                      </h4>
                      <p className="text-sm text-gray-600">
                        {session.description}
                      </p>
                    </div>
                  )}

                  {/* Content Card */}
                  {session.content && (
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        What you'll learn
                      </h4>
                      <div className="space-y-2">
                        {parseContent(session.content).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 group"
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0 
                                          group-hover:bg-blue-500 transition-colors duration-200"
                            />
                            <p
                              className="text-sm text-gray-600 group-hover:text-gray-900 
                                        transition-colors duration-200"
                            >
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // Course Card Component
  const CourseCard = ({ course, progress, isExpanded, onToggle }) => {
    console.log("Session data:", course.Sessions);

    const watchedCount = progress?.watchedSessions || 0;
    const totalCount = course.Sessions?.length || 0;
    const percentage =
      totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div
          onClick={onToggle}
          className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 cursor-pointer 
                   hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-blue-100 text-xs sm:text-sm font-medium">
                {course.Category?.name}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1 truncate">
                {course.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <span className="text-blue-100 text-sm">
                  {percentage}% Complete
                </span>
                <div className="w-24 h-1.5 bg-blue-800/50 rounded-full mt-1">
                  <div
                    className="h-full bg-blue-100 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              {isExpanded ? (
                <FaChevronUp className="text-white h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <FaChevronDown className="text-white h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div>
            <div className="sm:hidden p-3 border-b border-gray-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {percentage}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {course.Sessions?.map((session, index) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  index={index}
                  isWatched={
                    progress?.sessions?.find((s) => s.sessionId === session.id)
                      ?.isWatched
                  }
                  onToggleWatch={() =>
                    handleWatchStatusUpdate(course.id, session.id)
                  }
                  onWatch={() => handleWatchClick(session.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render empty states if needed
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="pt-40 pb-20">
          <EmptyState 
            type="notLoggedIn" 
            setIsLoginOpen={setIsLoginOpen}
          />
        </div>
        <Login 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)}
        />
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

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-56 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-10 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Recorded Sessions
            </h1>
            <p className="text-lg text-gray-600">
              Track your progress and access your course materials
            </p>
          </div>

          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="relative">
                <CourseCard
                  course={course}
                  progress={sessionsProgress[course.id]}
                  isExpanded={expandedCourses[course.id]}
                  onToggle={() => toggleCourse(course.id)}
                />

                {expandedCourses[course.id] &&
                  course.Sessions?.length === 0 && (
                    <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
                      <EmptyState type="noSessions" courseName={course.title} />
                    </div>
                  )}
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="mt-8">
              <Login
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
              />
              <EmptyState type="noSubscription" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordedSessions;
