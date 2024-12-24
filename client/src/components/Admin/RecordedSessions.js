import React, { useState, useEffect } from "react";
import {
  VideoCameraIcon,
  LinkIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getAllSessions,
  createSession,
  updateSession,
  deleteSession,
} from "../../api/sessionAPI";

import { getAllCourses } from "../../api/courseAPI";

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

  // Fetch sessions and courses on component mount
  useEffect(() => {
    fetchSessions();
    fetchCourses();
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
        toast.error("Failed to fetch sessions: " + res.message);
      }
    } catch (error) {
      toast.error("Error fetching sessions: " + error.message);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      if (res.success) {
        setCourses(res.data);
      } else {
        toast.error("Failed to fetch courses: " + res.message);
      }
    } catch (error) {
      toast.error("Error fetching courses: " + error.message);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.duration ||
      !formData.courseName
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedCourse = courses.find(
      (course) => course.title === formData.courseName
    );
    const isActive = formData.status === "active";
    const courseId = selectedCourse.id;

    if (!selectedCourse) {
      toast.error("Invalid course selection");
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
              session.id === editId ? { ...session, ...formData, courseName: selectedCourse.title, } : session
            )
          );
          toast.success("Session updated successfully!");
        } else {
          toast.error("Failed to update session: " + res.message);
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
          toast.success("Session added successfully!");
        } else {
          toast.error("Failed to add session: " + (res.message || "Unknown error"));
        }
      }
    } catch (error) {
      toast.error("Error creating/updating session: " + error.message);
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
          toast.success("Session deleted successfully!");
        } else {
          toast.error("Failed to delete session: " + res.message);
        }
      } catch (error) {
        toast.error("Error deleting session: " + error.message);
      }
    }
  };

  const handleStatusToggle = async (id) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      const updatedStatus = !session.isActive;
      const res = await updateSession(id, { isActive: updatedStatus });
      if (res.success) {
        setSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isActive: updatedStatus } : s))
        );
        toast.success(
          `Session status changed to ${updatedStatus ? "active" : "inactive"}`
        );
      } else {
        toast.error("Failed to update status: " + res.message);
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Sessions List</h2>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
            onClick={() => setShowModal(true)}
          >
            Add Session
          </button>
        </div>

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
              {sessions.map((session) => (
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
                        session.isActive
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
