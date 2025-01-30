import React, { useState, useEffect, memo, useMemo } from "react";
import {getStats} from "../../api/dashboardAPI"; // Import the StatsAPI
import {
  UserGroupIcon,
  VideoCameraIcon,
  BookOpenIcon,
  EnvelopeIcon,
  CreditCardIcon,
  Square3Stack3DIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const ProgressCircle = memo(({ percentage, color, size = 120 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#F3F4F6"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        fill="none"
        className="transition-all duration-1000 ease-out"
      />
      {/* Percentage text */}
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        className="transform rotate-90"
        fill={color}
        style={{ fontSize: "16px", fontWeight: "bold" }}
      >
        {percentage}%
      </text>
    </svg>
  );
});

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCategories: 0,
    totalSessions: 0,
    totalMessages: 0,
    totalRevenue: 5,
    totalCourses: 0,
    totalSubscriptions: 0,
  });

  const [error, setError] = useState("");

  // Fetch stats when the component mounts
  useEffect(() => {
    const fetchStats = async () => {
      const result = await getStats();
      if (result.success) {
        setStats(result.data); // Set the stats data to state
      } else {
        setError(result.message); // Set error message
      }
    };

    fetchStats();
  }, []); // Empty array ensures it runs only once when the component mounts

  // Add useMemo for performanceData
  const performanceData = useMemo(
    () => [
      { label: "System Usage", value: 78, color: "#4F46E5" },
      { label: "User Growth", value: 92, color: "#F97316" },
      { label: "Course Completion", value: 85, color: "#0EA5E9" },
      { label: "Revenue Target", value: 64, color: "#22C55E" },
    ],
    []
  );

  return (
    <div className="p-6">
      {/* Display error message if there's any */}
      {error && (
        <div className="text-red-500 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-3xl p-8 text-white mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to Dashboard</h1>
        <p className="text-indigo-100">
          Monitor your platform's performance and manage all components
        </p>
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
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.totalUsers}
          </h3>
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
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.totalCategories}
          </h3>
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
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.totalSessions}
          </h3>
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
          <h3 className="text-2xl font-bold text-gray-900">
            $ {stats.totalRevenue}
          </h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Statistics */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Platform Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <UserGroupIcon className="w-6 h-6 text-indigo-600" />
                <span className="text-gray-700">Active Users</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {stats.activeUsers}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <BookOpenIcon className="w-6 h-6 text-orange-600" />
                <span className="text-gray-700">Total Courses</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {stats.totalCourses}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <CreditCardIcon className="w-6 h-6 text-sky-600" />
                <span className="text-gray-700">Subscriptions</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {stats.totalSubscriptions}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <EnvelopeIcon className="w-6 h-6 text-green-600" />
                <span className="text-gray-700">New Messages</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {stats.totalMessages}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Performance Overview
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {performanceData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-4">
                  <ProgressCircle percentage={item.value} color={item.color} />
                </div>
                <span className="text-gray-600 text-sm text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Overall Performance Bar */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Overall Performance</span>
              <span className="text-indigo-600 font-semibold">
                {Math.round(
                  performanceData.reduce((acc, curr) => acc + curr.value, 0) /
                    performanceData.length
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.round(
                    performanceData.reduce((acc, curr) => acc + curr.value, 0) /
                      performanceData.length
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Dashboard);
