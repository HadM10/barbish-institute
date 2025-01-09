import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VideoCameraIcon,
  LinkIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
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
  const bgColor = type === 'error' || type === 'delete' 
    ? 'bg-red-500' 
    : 'bg-emerald-500';

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 
                rounded-lg shadow-lg ${bgColor}`}
    >
      {type === 'delete' ? (
        <TrashIcon className="w-6 h-6 text-white" />
      ) : type === 'success' ? (
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
    videoUrl: "",
    courseName: "", // Store courseName to display in the form
    isActive: "active",
  });

  // Add notification state
  const [notification, setNotification] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Add filtered sessions logic
  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          isActive: session.isActive ? "active" : "inactive",
        }));
        setSessions(adapted);
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
    const { name, value } = e.target;

    if (name === "courseName") {
      courses.find(
        (course) => course.courseName === value
      );
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Add showNotification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.duration || !formData.courseName) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const selectedCourse = courses.find(
      (course) => course.title === formData.courseName
    );
    const isActive = formData.status === "active";
    const courseId = selectedCourse.id;

    if (!selectedCourse) {
      showNotification("Invalid course selection", "error");
      return;
    }

    const sessionData = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      duration: formData.duration,
      videoUrl: formData.videoUrl,
      courseId, // Ensure the courseId is passed correctly
      isActive,
    };

    try {
      if (isEditing) {
        const res = await updateSession(editId, sessionData);
        if (res.success) {
          setSessions((prev) =>
            prev.map((session) =>
              session.id === editId ? { ...session, ...formData, courseName: selectedCourse.title } : session
            )
          );
          showNotification('Session updated successfully!');
        } else {
          showNotification('Failed to update session: ' + res.message, 'error');
        }
      } else {
        const res = await createSession(sessionData);
        if (res.success) {
          const newSession = res.data;
          const adapted = {
            id: newSession.id,
            title: newSession.title,
            description: newSession.description,
            content: newSession.content || "No content",
            duration: newSession.duration || "Unknown Duration",
            videoUrl: newSession.videoUrl || "No Video URL",
            courseName: selectedCourse.title,  // Adapted to include the course title
            isActive: newSession.isActive ? "active" : "inactive",
          };
          setSessions((prev) => [...prev, adapted]);
          showNotification('Session added successfully!');
        } else {
          showNotification('Failed to add session: ' + (res.message || 'Unknown error'), 'error');
        }
      }
    } catch (error) {
      showNotification('Error creating/updating session: ' + error.message, 'error');
    }
  
    resetForm();
  };

  const handleEdit = (session) => {
    setIsEditing(true);
    setEditId(session.id);
    setFormData({
      title: session.title,
      description: session.description,
      content: session.content || "",
      duration: session.duration.toString(),
      videoUrl: session.videoUrl || "",
      courseName: session.courseName, // Set courseName to display in the form
      isActive: session.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        const res = await deleteSession(id);
        if (res.success) {
          setSessions((prev) => prev.filter((session) => session.id !== id));
          showNotification('Session deleted successfully!', 'delete');
        } else {
          showNotification('Failed to delete session: ' + res.message, 'error');
        }
      } catch (error) {
        showNotification('Error deleting session: ' + error.message, 'error');
      }
    }
  };

  const handleStatusToggle = async (id) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      try {
        const newStatus = session.isActive === "active" ? "inactive" : "active";
        const res = await updateSession(id, { isActive: newStatus === "active" });

        if (res.success) {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === id ? { ...s, isActive: newStatus } : s
            )
          );
          showNotification(`Session status changed to ${newStatus}`);
        } else {
          showNotification("Failed to update status", "error");
        }
      } catch (error) {
        showNotification("Error updating status", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      duration: "",
      videoUrl: "",
      courseName: "", // Reset courseName
      isActive: true,
    });
    setIsEditing(false);
    setEditId(null);
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-8">
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
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <VideoCameraIcon className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Recorded Sessions</h1>
        </div>
        <p className="text-purple-100 mb-6">
          Manage and organize your recorded sessions
        </p>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chapter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration (min)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Video Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.courseName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusToggle(session.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.isActive === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      } transition-colors duration-200`}
                    >
                      {session.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
              ))}
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

      {/* Add/Edit Session Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditing ? "Edit Session" : "Add New Session"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
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

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                  />
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

              <div className="mt-6 text-center">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
                >
                  {isEditing ? "Update Session" : "Add Session"}
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