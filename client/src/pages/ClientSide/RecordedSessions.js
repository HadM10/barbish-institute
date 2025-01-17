// pages/ClientSide/RecordedSessions.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  const EmptyState = ({ type, courseName, setIsLoginOpen }) => {
    const content = {
      notLoggedIn: {
        icon: (
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <MdSubscriptions className="w-10 h-10 text-blue-500" />
          </div>
        ),
        title: "Access Your Learning Materials",
        description: "Please sign in with your provided credentials to access your recorded sessions.",
        primaryAction: {
          text: "Sign In",
          onClick: () => setIsLoginOpen(true)
        }
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

    return (
      <div className="max-w-md mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center">
            {currentContent.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {currentContent.title}
          </h2>
          <p className="text-gray-600 mb-8">
            {currentContent.description}
          </p>
          
          {currentContent.primaryAction && (
            <button
              onClick={currentContent.primaryAction.onClick}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl 
                       hover:bg-blue-700 transition-all duration-200 
                       transform hover:scale-[1.02] active:scale-[0.98]
                       font-medium shadow-sm hover:shadow-md"
            >
              {currentContent.primaryAction.text}
            </button>
          )}
        </div>
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
    const [isExpanded, setIsExpanded] = useState(false);

    const parseContent = (content) => {
      if (!content) return [];
      return content
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.trim());
    };

    return (
      <div className="bg-white border-b border-gray-100">
        <div className="p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {/* Left side with icon and title */}
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <div className="flex-shrink-0 mt-1 sm:mt-0">
                {isWatched ? (
                  <FaCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                ) : (
                  <MdOndemandVideo className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1 sm:line-clamp-none">
                      Session {index + 1}: {session.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`text-xs ${isWatched ? "text-green-600" : "text-gray-500"}`}>
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

            {/* Right side with buttons */}
            <div className="flex flex-wrap items-center gap-3 ml-7 sm:ml-0">
              <button
                onClick={onToggleWatch}
                className={`group relative flex items-center px-4 py-1.5 sm:px-5 sm:py-2 rounded-full 
                  text-xs sm:text-sm font-medium transition-all duration-300 
                  border-2 shadow-sm hover:shadow-md active:scale-95
                  ${
                    isWatched
                      ? "border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                      : "border-blue-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                  }
                  before:absolute before:inset-0 before:rounded-full
                  before:bg-gradient-to-r
                  ${
                    isWatched
                      ? "before:from-red-100/50 before:to-red-50/50"
                      : "before:from-blue-100/50 before:to-blue-50/50"
                  }
                  before:opacity-0 hover:before:opacity-100 before:transition-opacity
                  overflow-hidden`}
              >
                <MdOndemandVideo className={`mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 
                  ${isWatched ? "text-red-500" : "text-blue-500"}`} />
                <span className="relative">
                  <span className="hidden sm:inline">
                    {isWatched ? "Mark as Unwatched" : "Mark as Watched"}
                  </span>
                  <span className="sm:hidden">
                    {isWatched ? "Unwatch" : "Watch"}
                  </span>
                </span>
              </button>

              <button
                onClick={onWatch}
                className="group relative flex items-center px-4 py-1.5 sm:px-5 sm:py-2 
                         bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full
                         hover:from-blue-700 hover:to-blue-600 transition-all duration-300
                         shadow-md hover:shadow-lg active:scale-95 font-medium text-xs sm:text-sm"
              >
                <span className="mr-2">Watch Now</span>
                <FaChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 
                                       group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center w-8 h-8 text-gray-400 
                         hover:text-blue-600 hover:bg-blue-50 rounded-full 
                         transition-all duration-200 border-2 border-transparent
                         hover:border-blue-200"
              >
                {isExpanded ? (
                  <FaChevronUp className="h-4 w-4" />
                ) : (
                  <FaChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pl-8"
              >
                <div className="grid md:grid-cols-2 gap-4">
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

                  {session.content && (
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        What you'll learn
                      </h4>
                      <div className="space-y-2">
                        {parseContent(session.content).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                            <p className="text-sm text-gray-600">{item}</p>
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4">
          <div className="pt-48 pb-20">
            <EmptyState 
              type="notLoggedIn" 
              setIsLoginOpen={setIsLoginOpen}
            />
          </div>
        </div>
        <Login 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)}
          redirectPath="/recorded-sessions"
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
