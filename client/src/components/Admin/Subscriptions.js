// src/components/Admin/Subscriptions.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilIcon,
  ChartBarIcon,
  ClockIcon,
  CreditCardIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. Import your subscription API
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription as updateSubscriptionAPI,
  deleteSubscription as deleteSubscriptionAPI
} from '../../api/subscriptionAPI';
const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([
    // We'll fetch real data from the DB in useEffect, 
    // but let's keep this as an empty array or dummy data initially
  ]);

  const courses = [
    { id: 1, name: "Advanced React Development", price: 299 },
    { id: 2, name: "Node.js Masterclass", price: 199 },
    { id: 3, name: "Full Stack Development", price: 499 },
  ];

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    courseName: '',
    startDate: '',
    endDate: '',
    amount: '',
    status: 'active'
  });

  // 2. Fetch from the DB on mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await getAllSubscriptions();
      if (res.success) {
        // res.data is an array of subscriptions, 
        // each sub might look like: 
        // { id, userId, courseId, startDate, endDate, isActive, User: {...}, Course: {...} }
        // We adapt them to our local front-end shape:
        const adapted = res.data.map((sub) => {
          return {
            id: sub.id,
            // We'll combine "User" and "Course" to get userName + courseName
            userName: sub.User?.username || 'Unknown User',
            courseName: sub.Course?.title || 'Unknown Course',
            startDate: sub.startDate?.split('T')[0] || '',
            endDate: sub.endDate?.split('T')[0] || '',
            // Convert boolean isActive -> 'active'/'inactive'
            status: sub.isActive ? 'active' : 'inactive',
            // We don't store "amount" in DB, so let's default to 0 or something
            amount: 0,
            // If you want to store "planType" or other front-end only fields, you can default them here
            planType: 'Premium'
          };
        });
        setSubscriptions(adapted);
      } else {
        toast.error('Failed to fetch subscriptions: ' + res.message);
      }
    } catch (error) {
      toast.error('Error fetching subscriptions: ' + error.message);
    }
  };

  // 3. Handle create/edit in the DB
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userName || !formData.courseName || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // We must convert userName -> userId, courseName -> courseId
    // For now, let's assume userName = "John Doe" → userId=1 in real DB. 
    // If you had a user list, you'd do a real lookup. 
    // We'll just do a dummy approach here:
    let userId = 1; // Hardcode for the sake of example
    if (formData.userName.toLowerCase().includes('john')) userId = 1; 
    else if (formData.userName.toLowerCase().includes('sarah')) userId = 2; 
    else userId = 999; // fallback

    // Convert courseName -> courseId by searching "courses" array:
    const selectedCourse = courses.find((c) => c.name === formData.courseName);
    const courseId = selectedCourse ? selectedCourse.id : 9999;

    // Convert status 'active'/'inactive' -> isActive boolean
    const isActive = formData.status === 'active';

    const dbPayload = {
      userId,
      courseId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive
    };

    if (isEditing) {
      // UPDATE existing
      try {
        const res = await updateSubscriptionAPI(editId, dbPayload);
        if (res.success) {
          // Also update local state
          setSubscriptions((prev) => 
            prev.map((sub) =>
              sub.id === editId
                ? { ...sub, ...formData } 
                : sub
            )
          );
          toast.success('Subscription updated successfully!');
        } else {
          toast.error('Failed to update subscription: ' + (res.message || 'Unknown error'));
        }
      } catch (error) {
        toast.error('Error updating subscription: ' + error.message);
      }
    } else {
      // CREATE new
      try {
        const res = await createSubscription(dbPayload);
        if (res.success) {
          // res.data => newly created subscription in DB
          // We'll adapt it to front-end shape
          const newSub = res.data; 
          const adapted = {
            id: newSub.id,
            userName: formData.userName,
            courseName: formData.courseName,
            startDate: newSub.startDate.split('T')[0],
            endDate: newSub.endDate.split('T')[0],
            status: newSub.isActive ? 'active' : 'inactive',
            amount: formData.amount || 0,
            planType: 'Premium'
          };
          setSubscriptions((prev) => [...prev, adapted]);
          toast.success('Subscription created successfully!');
        } else {
          toast.error('Failed to create subscription: ' + (res.message || 'Unknown error'));
        }
      } catch (error) {
        toast.error('Error creating subscription: ' + error.message);
      }
    }

    resetForm();
  };

  // 4. Handle local edit
  const handleEdit = (subscription) => {
    setIsEditing(true);
    setEditId(subscription.id);
    setFormData({
      userName: subscription.userName,
      courseName: subscription.courseName,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      amount: subscription.amount,
      status: subscription.status
    });
    setShowModal(true);
  };

  // 5. Delete from DB
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        const res = await deleteSubscriptionAPI(id);
        if (res.success) {
          setSubscriptions(prev => prev.filter(sub => sub.id !== id));
          toast.success('Subscription deleted successfully!');
        } else {
          toast.error('Failed to delete subscription: ' + (res.message || 'Unknown error'));
        }
      } catch (error) {
        toast.error('Error deleting subscription: ' + error.message);
      }
    }
  };

  // Toggle local status
  const handleStatusToggle = (id) => {
    setSubscriptions(prev => 
      prev.map(sub => {
        if (sub.id === id) {
          const newStatus = sub.status === 'active' ? 'inactive' : 'active';
          toast.success(`Subscription status changed to ${newStatus}`);
          return { ...sub, status: newStatus };
        }
        return sub;
      })
    );
  };

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If the user picks a courseName, set the "amount" from the local courses array
    if (name === 'courseName') {
      const selectedCourse = courses.find(course => course.name === value);
      if (selectedCourse) {
        setFormData(prev => ({ ...prev, amount: selectedCourse.price }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      userName: '',
      courseName: '',
      startDate: '',
      endDate: '',
      amount: '',
      status: 'active'
    });
    setIsEditing(false);
    setEditId(null);
    setShowModal(false);
  };

  // Stats data
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const totalRevenue = subscriptions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const averageRevenue = totalRevenue / (subscriptions.length || 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-2">Subscriptions Dashboard</h1>
          <p className="text-purple-100">Manage and monitor all subscription activities</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Subscriptions"
            value={subscriptions.length}
            icon={<UserGroupIcon className="w-6 h-6" />}
            trend="+12%"
            color="from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Active Plans"
            value={activeSubscriptions}
            icon={<CheckCircleIcon className="w-6 h-6" />}
            trend="+5%"
            color="from-green-500 to-green-600"
          />
          <StatsCard
            title="Total Revenue"
            value={`$${totalRevenue}`}
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            trend="+8%"
            color="from-amber-500 to-amber-600"
          />
          <StatsCard
            title="Avg. Revenue"
            value={`$${averageRevenue.toFixed(2)}`}
            icon={<ChartBarIcon className="w-6 h-6" />}
            trend="+3%"
            color="from-rose-500 to-rose-600"
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
              <h2 className="text-xl font-bold text-gray-800">Subscriptions List</h2>
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
                {subscriptions.map((sub) => (
                  <motion.tr 
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.courseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.endDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sub.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(sub.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sub.status === 'active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
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
                  {isEditing ? 'Edit Subscription' : 'Add New Subscription'}
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
                    User Name
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                    required
                  />
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
                    {courses.map(course => (
                      <option key={course.id} value={course.name}>
                        {course.name} - ${course.price}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150 bg-gray-50"
                    readOnly
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
                    {isEditing ? 'Update Subscription' : 'Save Subscription'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, trend, color }) => (
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
      <div className="bg-white/20 p-3 rounded-xl">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className="text-white/90">{trend} from last month</span>
    </div>
  </motion.div>
);
export default Subscriptions;
