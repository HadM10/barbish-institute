// src/components/Admin/Subscriptions.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  StarIcon,
  PencilIcon,
  ClockIcon,
  CreditCardIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription as updateSubscriptionAPI,
  deleteSubscription as deleteSubscriptionAPI,
} from "../../api/subscriptionAPI";
import { getAllCourses } from "../../api/courseAPI"; // Import course API
import { getAllUsers } from "../../api/userAPI"; // Import user API

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

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    courseName: "",
    startDate: "",
    endDate: "",
    amount: "",
    status: "active",
  });

  // Add notification and search states
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Add showNotification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter subscriptions based on search
  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch subscriptions, courses, and users on mount
  useEffect(() => {
    fetchSubscriptions();
    fetchCourses();
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("Courses:", courses);
    // Only update amount if the course is selected and courses are loaded
    if (formData.courseName && courses.length > 0) {
      const selectedCourse = courses.find(
        (course) => course.title === formData.courseName
      );
      if (selectedCourse) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          amount: selectedCourse.price,
        }));
      }
    }
  }, [formData.courseName, courses]); // Trigger when courseName or courses change

  const fetchSubscriptions = async () => {
    try {
      const res = await getAllSubscriptions();
      if (res.success) {
        const adapted = res.data.map((sub) => {
          
          return {
            
            id: sub.id,
            userName: sub.User?.username || "Unknown User",
            courseName: sub.Course?.title || "Unknown Course",
            startDate: sub.startDate?.split("T")[0] || "",
            endDate: sub.endDate?.split("T")[0] || "",
            status: sub.isActive ? "active" : "inactive",
            amount: sub.amount,
          };
        });
       
        setSubscriptions(adapted);
      } else {
        toast.error("Failed to fetch subscriptions: " + res.message);
      }
    } catch (error) {
      toast.error("Error fetching subscriptions: " + error.message);
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

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      if (res.success) {
        setUsers(res.data);
      } else {
        toast.error("Failed to fetch users: " + res.message);
      }
    } catch (error) {
      toast.error("Error fetching users: " + error.message);
    }
  };

  // Handle form submission for create/edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.courseName || !formData.startDate || !formData.endDate) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const selectedUser = users.find((user) => user.username === formData.userName);
    const selectedCourse = courses.find((course) => course.title === formData.courseName);

    if (!selectedUser || !selectedCourse) {
      showNotification('Invalid user or course selection', 'error');
      return;
    }

    const userId = selectedUser.id;
    const courseId = selectedCourse.id;
    const isActive = formData.status === "active";

    const dbPayload = {
      userId,
      courseId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      amount: formData.amount,
      isActive,
    };

    try {
      if (isEditing) {
        const res = await updateSubscriptionAPI(editId, dbPayload);
        if (res.success) {
          setSubscriptions((prev) =>
            prev.map((sub) =>
              sub.id === editId
                ? {
                    ...sub,
                    ...formData,
                    userName: selectedUser.username,
                    courseName: selectedCourse.title,
                  }
                : sub
            )
          );
          showNotification('Subscription updated successfully!');
        } else {
          showNotification('Failed to update subscription: ' + (res.message || 'Unknown error'), 'error');
        }
      } else {
        const res = await createSubscription(dbPayload);
        if (res.success) {
          const newSub = res.data;
          const adapted = {
            id: newSub.id,
            userName: selectedUser.username,
            courseName: selectedCourse.title,
            startDate: newSub.startDate.split("T")[0],
            endDate: newSub.endDate.split("T")[0],
            status: newSub.isActive ? "active" : "inactive",
            amount: formData.amount || 0,
          };
          setSubscriptions((prev) => [...prev, adapted]);
          showNotification('Subscription created successfully!');
        } else {
          showNotification('Failed to create subscription: ' + (res.message || 'Unknown error'), 'error');
        }
      }
    } catch (error) {
      showNotification('Error creating/updating subscription: ' + error.message, 'error');
    }

    resetForm();
  };

  const handleEdit = (subscription) => {
    setIsEditing(true);
    setEditId(subscription.id);
    setFormData({
      userName: subscription.userName,
      courseName: subscription.courseName,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      amount: subscription.amount,
      status: subscription.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      try {
        const res = await deleteSubscriptionAPI(id);
        if (res.success) {
          setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
          showNotification('Subscription deleted successfully!', 'delete');
        } else {
          showNotification('Failed to delete subscription: ' + (res.message || 'Unknown error'), 'error');
        }
      } catch (error) {
        showNotification('Error deleting subscription: ' + error.message, 'error');
      }
    }
  };

  const handleStatusToggle = (id) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          const newStatus = sub.status === "active" ? "inactive" : "active";
          showNotification(`Subscription status changed to ${newStatus}`);
          return { ...sub, status: newStatus };
        }
        return sub;
      })
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "courseName") {
      const selectedCourse = courses.find(
        (course) => course.courseName === value
      );
      setFormData({
        ...formData,
        [name]: value,
        amount: selectedCourse ? selectedCourse.price : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      courseName: "",
      startDate: "",
      endDate: "",
      amount: "",
      status: "active",
    });
    setIsEditing(false);
    setEditId(null);
    setShowModal(false);
  };

  const [totalRevenue, setTotalRevenue] = useState(0);

  // Calculate total revenue whenever subscriptions change
  useEffect(() => {
    const total = subscriptions.reduce(
      (sum, subscription) => sum + subscription.amount,
      0
    );
    setTotalRevenue(total);
  }, [subscriptions]); // Recalculate when subscriptions change

  const [activeSubscriptions, setActiveSubscriptions] = useState(0);

  // Calculate active subscriptions whenever subscriptions change
  useEffect(() => {
    const activeCount = subscriptions.filter(
      (subscription) => subscription.status === "active"
    ).length;
    setActiveSubscriptions(activeCount);
  }, [subscriptions]); // Recalculate when subscriptions change

  const [mostSubscribedCourse, setMostSubscribedCourse] = useState("");

  useEffect(() => {
    if (subscriptions.length > 0 && courses.length > 0) {
      // Count subscriptions per course
      const courseCount = subscriptions.reduce((acc, subscription) => {
        const courseName = subscription.courseName; // Or use subscription.courseId if it's by ID
        acc[courseName] = (acc[courseName] || 0) + 1;
        return acc;
      }, {});

      // Find the course with the maximum count
      const maxCourseName = Object.keys(courseCount).reduce((a, b) =>
        courseCount[a] > courseCount[b] ? a : b
      );

      // Find the course details using the most subscribed course name
      const courseDetails = courses.find(
        (course) => course.title === maxCourseName
      );
      setMostSubscribedCourse(courseDetails);
    }
  }, [subscriptions, courses]); // Recalculate when subscriptions or courses change

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Subscriptions Dashboard</h1>
              <p className="text-purple-100">Manage and monitor all subscription activities</p>
            </div>
            
            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-white/10 border border-white/20 
                         text-white placeholder-white/70 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-white/50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Results Summary */}
        {searchTerm && (
          <div className="text-sm text-gray-500">
            Showing results for "{searchTerm}"
            <button 
              onClick={() => setSearchTerm("")}
              className="ml-2 text-purple-600 hover:text-purple-700"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Subscriptions"
            value={subscriptions.length}
            icon={<UserGroupIcon className="w-6 h-6" />}
            color="from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Active Plans"
            value={activeSubscriptions}
            icon={<CheckCircleIcon className="w-6 h-6" />}
            color="from-green-500 to-green-600"
          />
          <StatsCard
            title="Most Subscribed Course"
            value={mostSubscribedCourse.title}
            icon={<StarIcon className="w-6 h-6" />}
            color="from-red-500 to-red-600"
          />
          <StatsCard
            title="Total Revenue"
            value={`$${totalRevenue}`}
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            color="from-amber-500 to-amber-600"
          />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Subscriptions List
              </h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg 
                         hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
              >
                <CreditCardIcon className="w-5 h-5" />
                Add Subscription
              </motion.button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-4 h-4" />
                      User
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Start Date
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      End Date
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      Amount
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubscriptions.map((sub) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sub.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sub.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sub.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sub.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${sub.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(sub.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sub.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        } transition-colors duration-200`}
                      >
                        {sub.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(sub)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-150"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {isEditing ? "Edit Subscription" : "Add New Subscription"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <select
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                    required
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.username}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.title}>
                        {course.title} - ${course.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg 
                             hover:from-purple-700 hover:to-indigo-700 transition-all duration-150"
                  >
                    {isEditing ? "Update Subscription" : "Save Subscription"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-white/80">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="bg-white/20 p-3 rounded-xl">{icon}</div>
    </div>
  </motion.div>
);
export default Subscriptions;
