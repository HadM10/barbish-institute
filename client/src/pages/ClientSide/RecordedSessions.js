// pages/ClientSide/RecordedSessions.js
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaVideo, FaChevronRight, FaBookReader, FaChevronDown, FaCheckCircle, FaChevronUp } from "react-icons/fa";
import { MdSubscriptions, MdOndemandVideo } from "react-icons/md";
import Navbar from "../../components/User/Home/Navbar";
import { getUserSubscribedCourses } from "../../api/userAPI";
import { markSessionAsWatched, getSessionProgress } from "../../api/userSessionAPI";

// EmptyState Component
const EmptyState = ({ type, courseName }) => {
  const content = {
    notLoggedIn: {
      icon: <MdSubscriptions className="text-6xl text-blue-500 mb-4" />,
      title: "Login Required",
      description: "Please login to access your courses and learning materials.",
      actionText: "Login Now",
      actionLink: "/login",
      showAction: true
    },
    noSubscription: {
      icon: <FaBookReader className="text-6xl text-blue-500 mb-4" />,
      title: "No Active Subscriptions",
      description: "Subscribe to our courses to start your learning journey!",
      actionText: "Browse Courses",
      actionLink: "/courses",
      showAction: true
    },
    noSessions: {
      icon: <FaVideo className="text-6xl text-gray-400 mb-4" />,
      title: "Coming Soon",
      description: `We're currently preparing the recorded sessions for ${courseName}. Our team is working hard to create high-quality content that meets our standards. You'll be notified as soon as new content becomes available.`,
      showAction: false
    },
  };

  const { icon, title, description, actionText, actionLink, showAction } = content[type];

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-8 text-center">
      <div className="flex justify-center">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">{title}</h2>
      <p className="text-gray-600 text-base mb-6">{description}</p>
      {showAction && (
        <Link
          to={actionLink}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl 
                   hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          {actionText}
          <FaChevronRight className="ml-2" />
        </Link>
      )}
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

  // Handle watch status updates
  const handleWatchStatusUpdate = async (courseId, sessionId) => {
    try {
      const currentProgress = sessionsProgress[courseId];
      const sessionProgress = currentProgress?.sessions?.find(s => s.sessionId === sessionId);
      const newWatchStatus = !sessionProgress?.isWatched;

      const response = await markSessionAsWatched(sessionId, {
        isWatched: newWatchStatus,
        courseId: courseId,
        updatedAt: new Date().toISOString()
      });
      
      if (response.status === 'success') {
        await fetchCourseProgress(courseId);
        console.log(`Successfully ${newWatchStatus ? 'marked as watched' : 'marked as unwatched'}`);
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
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  // Fetch all courses
  const fetchCourses = useCallback(async () => {
    try {
      const response = await getUserSubscribedCourses();
      setCourses(response.data);
      
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

  // Session Item Component
  const SessionItem = ({ session, index, isWatched, onToggleWatch, onWatch }) => {
    return (
      <div className="p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {isWatched ? (
                <FaCheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <MdOndemandVideo className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Session {index + 1}: {session.title}
              </h3>
              <span className={`text-xs ${isWatched ? 'text-green-600' : 'text-gray-500'}`}>
                {isWatched ? 'Completed' : 'Not started'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleWatch}
              className={`flex items-center px-3 py-1.5 rounded text-sm font-medium
                ${isWatched 
                  ? 'text-red-600 hover:text-red-700' 
                  : 'text-blue-600 hover:text-blue-700'}`}
            >
              <MdOndemandVideo className="mr-1 h-4 w-4" />
              {isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
            </button>
            <button
              onClick={onWatch}
              className="flex items-center px-4 py-1.5 bg-blue-600 text-white rounded
                       hover:bg-blue-700 transition-colors duration-200"
            >
              Watch Now
              <FaChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Course Card Component
  const CourseCard = ({ course, progress, isExpanded, onToggle }) => {
    const watchedCount = progress?.watchedSessions || 0;
    const totalCount = course.Sessions?.length || 0;
    const percentage = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div
          onClick={onToggle}
          className="p-4 bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-blue-100 text-sm font-medium">
                {course.Category?.name}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                {course.title}
              </h2>
            </div>
            {isExpanded ? (
              <FaChevronUp className="text-white h-5 w-5" />
            ) : (
              <FaChevronDown className="text-white h-5 w-5" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Course Progress</span>
                <span className="text-sm font-medium text-blue-600">{percentage}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {watchedCount}/{totalCount} sessions completed
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {course.Sessions?.map((session, index) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  index={index}
                  isWatched={progress?.sessions?.find(s => s.sessionId === session.id)?.isWatched}
                  onToggleWatch={() => handleWatchStatusUpdate(course.id, session.id)}
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

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            My Learning Journey
          </h1>

          <div className="space-y-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={sessionsProgress[course.id]}
                isExpanded={expandedCourses[course.id]}
                onToggle={() => toggleCourse(course.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordedSessions;
