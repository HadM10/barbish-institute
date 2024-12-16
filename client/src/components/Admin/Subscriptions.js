// src/components/Admin/Subscriptions.js
import React, { useState } from 'react';
import { 
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      userName: "John Doe",
      courseName: "Advanced React Development",
      planType: "Premium",
      startDate: "2023-12-01",
      endDate: "2024-12-01",
      status: "active",
      amount: 299,
    }
  ]);

  // Sample courses data (replace with your actual courses)
  const courses = [
    { id: 1, name: "Advanced React Development", price: 299 },
    { id: 2, name: "Node.js Masterclass", price: 199 },
    { id: 3, name: "Full Stack Development", price: 499 },
  ];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    courseName: '',
    startDate: '',
    endDate: '',
    amount: '',
    status: 'active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update amount when course is selected
    if (name === 'courseName') {
      const selectedCourse = courses.find(course => course.name === value);
      if (selectedCourse) {
        setFormData(prev => ({
          ...prev,
          amount: selectedCourse.price
        }));
      }
    }
  };

  const handleStatusToggle = (id) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === id) {
        const newStatus = sub.status === 'active' ? 'inactive' : 'active';
        toast.success(`Subscription status changed to ${newStatus}`);
        return { ...sub, status: newStatus };
      }
      return sub;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.userName || !formData.courseName || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Add new subscription
    const newSubscription = {
      id: subscriptions.length + 1,
      ...formData
    };

    setSubscriptions(prev => [...prev, newSubscription]);
    setShowModal(false);
    setFormData({
      userName: '',
      courseName: '',
      startDate: '',
      endDate: '',
      amount: '',
      status: 'active'
    });
    toast.success('Subscription added successfully!');
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header section */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <UserGroupIcon className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Subscriptions Management</h1>
        </div>
        <p className="text-indigo-100 mb-6">
          Manage and monitor all subscription activities
        </p>
      </div>
      
      {/* Main content */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Subscriptions List</h2>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={() => setShowModal(true)}
          >
            Add Subscription
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="w-4 h-4" />
                    User
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Start Date
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    End Date
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    Amount
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Status
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{sub.userName}</td>
                  <td className="px-6 py-4">{sub.courseName}</td>
                  <td className="px-6 py-4">{sub.startDate}</td>
                  <td className="px-6 py-4">{sub.endDate}</td>
                  <td className="px-6 py-4">${sub.amount}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(sub.id)}
                      className={`px-3 py-1 rounded-full transition-colors duration-200 ${
                        sub.status === 'active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {sub.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Subscription</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  readOnly
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;