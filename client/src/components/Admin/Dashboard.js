// components/Admin/Dashboard.js
import React from 'react';
import { 
  UserGroupIcon, 
  VideoCameraIcon, 
  BookOpenIcon, 
  EnvelopeIcon,
  CreditCardIcon,
  Square3Stack3DIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  // Mock data
  const stats = {
    totalUsers: 1234,
    activeUsers: 892,
    totalCategories: 48,
    totalSessions: 156,
    totalMessages: 324,
    totalRevenue: 45600,
    totalCourses: 75,
    totalSubscriptions: 456
  };

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-3xl p-8 text-white mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to Dashboard</h1>
        <p className="text-indigo-100">Monitor your platform's performance and manage all components</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-500/10 p-3 rounded-xl">
              <UserGroupIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              +12% ↑
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
          <p className="text-gray-600">Total Users</p>
        </div>

        {/* Categories Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500/10 p-3 rounded-xl">
              <Square3Stack3DIcon className="w-8 h-8 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              +8% ↑
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalCategories}</h3>
          <p className="text-gray-600">Total Categories</p>
        </div>

        {/* Sessions Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-sky-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-sky-500/10 p-3 rounded-xl">
              <VideoCameraIcon className="w-8 h-8 text-sky-600" />
            </div>
            <span className="text-sm font-medium text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
              +15% ↑
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalSessions}</h3>
          <p className="text-gray-600">Total Sessions</p>
        </div>

        {/* Revenue Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/10 p-3 rounded-xl">
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              +20% ↑
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Statistics */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <UserGroupIcon className="w-6 h-6 text-indigo-600" />
                <span className="text-gray-700">Active Users</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">{stats.activeUsers}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <BookOpenIcon className="w-6 h-6 text-orange-600" />
                <span className="text-gray-700">Total Courses</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">{stats.totalCourses}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <CreditCardIcon className="w-6 h-6 text-sky-600" />
                <span className="text-gray-700">Subscriptions</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">{stats.totalSubscriptions}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <EnvelopeIcon className="w-6 h-6 text-green-600" />
                <span className="text-gray-700">New Messages</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">{stats.totalMessages}</span>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Overview</h2>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
            <ChartBarIcon className="w-16 h-16 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;