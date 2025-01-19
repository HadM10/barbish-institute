// Sidebar.js
import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Import the AuthContext
import {
  HomeIcon,
  Square3Stack3DIcon,
  UserGroupIcon,
  CreditCardIcon,
  VideoCameraIcon,
  BookOpenIcon,
  EnvelopeIcon,
  GiftIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
  
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      name: "Categories",
      path: "/admin/category",
      icon: <Square3Stack3DIcon className="w-5 h-5" />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <UserGroupIcon className="w-5 h-5" />,
    },
    {
      name: "Subscription",
      path: "/admin/subscription",
      icon: <CreditCardIcon className="w-5 h-5" />,
    },
    {
      name: "Recorded Sessions",
      path: "/admin/recorded-sessions",
      icon: <VideoCameraIcon className="w-5 h-5" />,
    },
    {
      name: "Courses",
      path: "/admin/courses",
      icon: <BookOpenIcon className="w-5 h-5" />,
    },
    {
      name: "Contact Us",
      path: "/admin/contact",
      icon: <EnvelopeIcon className="w-5 h-5" />,
    },
    {
      name: "Bonus Card",
      path: "/admin/bonus-card",
      icon: <GiftIcon className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-900 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 
          text-white w-72 min-h-screen p-6 shadow-xl
          overflow-y-auto
        `}
      >
        {/* Header/Logo Section */}
        <div className="text-2xl font-bold mb-10 text-center py-4 border-b border-indigo-700/50">
          <span className="text-sky-400">Admin</span>
          <span className="text-orange-400 ml-1">Panel</span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center px-4 py-3 rounded-xl transition-all duration-200
                ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-lg shadow-sky-500/30'
                    : 'hover:bg-white/10 hover:shadow-md hover:translate-x-1'
                }
              `}
            >
              <div className="mr-3">{item.icon}</div>
              <span className={`font-medium ${location.pathname === item.path ? 'text-white' : 'text-gray-100'}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="fixed bottom-8 w-60 lg:absolute">
          <button
            className="flex items-center px-4 py-3 w-full text-white rounded-xl
              bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500
              transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
              onClick={() => {
                console.log('Logout clicked');
                logout(); // Call logout function from AuthContext
                setIsOpen(false); // Close the sidebar after logout
              }}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;