// src/pages/AdminPanel/Admin.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import Dashboard from "../../components/Admin/Dashboard";
import Category from "../../components/Admin/Category";
import Users from "../../components/Admin/Users";
import Subscriptions from "../../components/Admin/Subscriptions";
import RecordedSessions from "../../components/Admin/RecordedSessions";
import Courses from "../../components/Admin/Courses";
import ContactUs from "../../components/Admin/ContactUs";
import BonusCard from "../../components/Admin/BonusCards";
import { ToastContainer, toast } from 'react-toastify';
import { 
  GiftIcon
} from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';

// Create a reusable ComingSoon component
const ComingSoon = ({ title, icon: Icon, description }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-indigo-900">{title}</h2>
      <span className="px-3 py-1 text-sm text-orange-600 bg-orange-100 rounded-full">
        Coming Soon
      </span>
    </div>
    <div className="p-8 text-center bg-gray-50 rounded-xl">
      <div className="mb-4">
        {Icon && <Icon className="w-12 h-12 mx-auto text-gray-400" />}
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        className="px-4 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        onClick={() => toast.info('Feature coming soon!')}
      >
        Get Notified When Ready
      </button>
    </div>
  </div>
);

const Admin = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 pt-20 lg:pt-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="category" element={<Category />} />
          <Route path="users" element={<Users />} />
          <Route path="subscription" element={<Subscriptions />} />
          <Route path="recorded-sessions" element={<RecordedSessions />} />
          <Route path="courses" element={<Courses />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="bonus-card" element={<BonusCard />} />
          <Route 
            path="bonus-card" 
            element={
              <ComingSoon
                title="Bonus Card Management"
                icon={GiftIcon}
                description="Bonus card system is being developed. You'll be able to manage reward programs here."
              />
            }
          />
        </Routes>
        <ToastContainer />
      </main>
    </div>
  );
};

export default Admin;