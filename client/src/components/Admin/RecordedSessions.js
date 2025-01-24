import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VideoCameraIcon,
  LinkIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import {
  getAllSessions,
  createSession,
  updateSession,
  deleteSession,
} from "../../api/sessionAPI";

import { getAllCourses } from "../../api/courseAPI";

// Add Notification Component
const Notification = ({ message, type, onClose }) => {
  const bgColor =
    type === "error" || type === "delete" ? "bg-red-500" : "bg-emerald-500";

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 
                rounded-lg shadow-lg ${bgColor}`}
    >
      {type === "delete" ? (
        <TrashIcon className="w-6 h-6 text-white" />
      ) : type === "success" ? (
        <CheckCircleIcon className="w-6 h-6 text-white" />
      ) : (
        <XCircleIcon className="w-6 h-6 text-white" />
      )}
      <p className="text-white font-medium">{message}</p>
    </motion.div>
  );
};

const RecordedSessions = () => {
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    duration: "",
    video: null,
    courseName: "",
    courseId: "",
  });

  // Add notification state
  const [notification, setNotification] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Add filtered sessions logic
  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch sessions and courses on component mount
  useEffect(() => {
    fetchSessions();
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await getAllSessions();
      if (res.success) {
        const adapted = res.data.map((session) => ({
          id: session.id,
          title: session.title || "Unknown Session",
          description: session.description || "Unknown description",
          content: session.content || "Unknown content",
          courseName: session.Course?.title || "Unknown Course",
          duration: session.duration || "Unknown Duration",
          videoUrl: session.videoUrl || "No Video URL",
          createdAt: session.createdAt || new Date(),
        }));

        // Sort by createdAt in ascending order (oldest first)
        const sortedSessions = adapted.sort((a, b) => {
          // First sort by course
          if (a.courseName !== b.courseName) {
            return a.courseName.localeCompare(b.courseName);
          }
          // Then sort by creation date (ascending - oldest first)
          return new Date(a.createdAt) - new Date(b.createdAt);
        });

        setSessions(sortedSessions);
      } else {
        showNotification("Failed to fetch sessions: " + res.message, "error");
      }
    } catch (error) {
      showNotification("Error fetching sessions: " + error.message, "error");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      if (res.success) {
        setCourses(res.data);
      } else {
        showNotification("Failed to fetch courses: " + res.message, "error");
      }
    } catch (error) {
      showNotification("Error fetching courses: " + error.message, "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        video: files[0],
      }));
    } else if (name === "courseName") {
      const selectedCourse = courses.find((course) => course.title === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        courseId: selectedCourse?.id,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add showNotification helper
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.courseId) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionData = {
        ...formData,
      };

      if (isEditing) {
        const res = await updateSession(editId, sessionData);
        if (res.success) {
          setSessions((prev) =>
            prev.map((session) =>
              session.id === editId
                ? {
                    ...session,
                    ...sessionData,
                    courseName: formData.courseName,
                  }
                : session
            )
          );
          showNotification("Session updated successfully!");
        } else {
          showNotification("Failed to update session: " + res.message, "error");
        }
      } else {
        const res = await createSession(sessionData);
        if (res.success) {
          setSessions((prev) => [
            ...prev,
            {
              ...res.data,
              courseName: formData.courseName,
            },
          ]);
          showNotification("Session added successfully!");
        } else {
          showNotification("Failed to add session: " + res.message, "error");
        }
      }
      resetForm();
    } catch (error) {
      showNotification("Error: " + error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (session) => {
    setIsEditing(true);
    setEditId(session.id);
    
    // Find the course ID based on the course name
    const selectedCourse = courses.find(course => course.title === session.courseName);
    
    setFormData({
      title: session.title,
      description: session.description,
      content: session.content || "",
      duration: session.duration.toString(),
      videoUrl: session.videoUrl || "",
      courseName: session.courseName,
      courseId: selectedCourse?.id, // Add the courseId to the form data
      video: null // Reset video since we already have videoUrl
    });
    
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        const res = await deleteSession(id);
        if (res.success) {
          setSessions((prev) => prev.filter((session) => session.id !== id));
          showNotification("Session deleted successfully!", "delete");
        } else {
          showNotification("Failed to delete session: " + res.message, "error");
        }
      } catch (error) {
        showNotification("Error deleting session: " + error.message, "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      duration: "",
      video: null,
      courseName: "",
      courseId: "",
    });
    setIsEditing(false);
    setEditId(null);
    setShowModal(false);
  };

  // Add this function before the return statement, alongside other helper functions
  const isValidYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const testYoutubeLink = (url) => {
    if (!url) {
      showNotification("Please enter a YouTube URL first", "error");
      return;
    }
    
    if (!isValidYoutubeUrl(url)) {
      showNotification("Please enter a valid YouTube URL", "error");
      return;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="p-2 md:p-6 w-full overflow-hidden">
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-xl md:rounded-3xl p-4 md:p-8 text-white">
        <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
          <VideoCameraIcon className="w-6 h-6 md:w-8 md:h-8" />
          <h1 className="text-xl md:text-3xl font-bold">Recorded Sessions</h1>
        </div>
        <p className="text-purple-100 text-sm md:text-base mb-4 md:mb-6">
          Manage and organize your recorded sessions
        </p>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg mt-4 md:mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 md:mb-6">
          {/* Search Box */}
          <div className="relative flex-1 w-full max-w-md">
            <input
              type="text"
              placeholder="Search sessions or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Add Session Button */}
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                     transition-all duration-300 transform hover:scale-105 flex-shrink-0"
            onClick={() => setShowModal(true)}
          >
            Add Session
          </button>
        </div>

        {/* Search Results Summary */}
        {searchTerm && (
          <div className="mb-4 text-sm text-gray-500">
            Showing results for "{searchTerm}"
            <button
              onClick={() => setSearchTerm("")}
              className="ml-2 text-purple-600 hover:text-purple-700"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Sessions Table */}
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Name
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="max-w-[150px] md:max-w-[200px]">
                      Chapter
                    </div>
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration (min)
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Video Link
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.map((session, index) => {
                  // Get the session number within its course
                  const courseSessionIndex =
                    filteredSessions
                      .filter((s) => s.courseName === session.courseName)
                      .findIndex((s) => s.id === session.id) + 1;

                  return (
                    <tr
                      key={session.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {courseSessionIndex}
                          </span>
                          {session.title}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                        <div className="max-w-[100px] md:max-w-full">
                          <p
                            className="text-sm text-gray-900 truncate"
                            title={session.courseName}
                          >
                            {session.courseName.length > 15 
                              ? `${session.courseName.substring(0, 15)}...` 
                              : session.courseName}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                        <div className="max-w-[150px] md:max-w-[200px]">
                          <p
                            className="text-sm text-gray-900 truncate"
                            title={session.description}
                          >
                            {session.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                        {session.duration}
                      </td>
                      <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                        {session.videoUrl && (
                          <a
                            href={session.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 transition-colors duration-150"
                            title="Watch Session"
                          >
                            <LinkIcon className="w-5 h-5 transform hover:scale-110 transition-transform duration-150" />
                          </a>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(session)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(session.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-150"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* No Results Message */}
            {filteredSessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No sessions found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Session Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-[95%] md:max-w-2xl lg:max-w-4xl my-4 md:my-8">
            <div className="flex justify-between items-center mb-4 md:mb-6 sticky top-0 bg-white z-10 pb-4 border-b">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                {isEditing ? "Edit Session" : "Add New Session"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="grid gap-4 md:gap-6">
                {/* Session Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Name *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150 min-h-[100px] resize-y"
                    rows="3"
                  ></textarea>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (min) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                    required
                  />
                </div>

                {/* YouTube URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube Video URL *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl || ""}
                        onChange={handleInputChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 
                                 transition-all duration-150"
                        required
                      />
                      <VideoCameraIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => testYoutubeLink(formData.videoUrl)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                               transition-all duration-200 flex items-center gap-2"
                    >
                      <LinkIcon className="w-5 h-5" />
                      Test Link
                    </button>
                  </div>
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <select
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 text-center sticky bottom-0 bg-white pt-4 border-t">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                            transition-all duration-200 ${
                              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      {isEditing ? "Updating..." : "Adding..."}
                    </div>
                  ) : isEditing ? (
                    "Update Session"
                  ) : (
                    "Add Session"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordedSessions;