// client/src/components/Admin/Category.js
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BookOpenIcon,
  RectangleStackIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import CategoryAPI from "../../api/categoryAPI";
import "react-toastify/dist/ReactToastify.css";
import { getAllCourses } from '../../api/courseAPI';

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

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [modalData, setModalData] = useState({ name: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      // Get all courses first
      const coursesRes = await getAllCourses();
      const allCourses = coursesRes.success ? coursesRes.data : [];

      // Get categories
      const res = await CategoryAPI.getAllCategories();
      if (res.success) {
        // Map categories and count courses for each
        const categoriesWithCounts = res.data.data.map(category => {
          const courseCount = allCourses.filter(
            course => course.categoryId === category.id || course.category_id === category.id
          ).length;
          
          return {
            ...category,
            Courses: new Array(courseCount) // Create array with length equal to course count
          };
        });
        
        setCategories(categoriesWithCounts);
      } else {
        setCategories([]);
        showNotification("No categories found", 'error');
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      showNotification("Error loading categories", 'error');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modalData.name) {
      showNotification("Please fill all fields", 'error');
      return;
    }

    try {
      const response = isEditing
        ? await CategoryAPI.updateCategory(modalData.id, modalData)
        : await CategoryAPI.createCategory(modalData);

      if (response?.success) {
        showNotification(`Category ${isEditing ? "updated" : "created"} successfully`);
        handleCloseModal();
        await fetchCategories();
      } else {
        showNotification(response?.message || "Operation failed", 'error');
      }
    } catch (error) {
      console.error("Operation error:", error);
      showNotification("Operation failed", 'error');
    }
  };
  const handleEdit = (category) => {
    setModalData(category);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalData({ name: "" });
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const result = await CategoryAPI.deleteCategory(id);
      if (result.success) {
        showNotification("Category deleted successfully", 'delete');
        fetchCategories();
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      showNotification("Delete failed", 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 p-8">
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                Course Categories
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your course categories
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Search Box */}
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
              {/* Keep your existing Add Category button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Category</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-medium">Total Categories</p>
                <h3 className="text-3xl font-bold text-white mt-1">
                  {categories.length}
                </h3>
              </div>
              <div className="bg-white/20 p-3 rounded-xl text-white">
                <RectangleStackIcon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 
                         rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5"
                   style={{
                     backgroundImage: `radial-gradient(circle at 1px 1px, #4338ca 1px, transparent 0)`,
                     backgroundSize: '16px 16px'
                   }}
              />
              
              {/* Content */}
              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {category.name}
                    </h3>
                    {/* Course Count Badge */}
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full 
                                  bg-indigo-100 text-indigo-800 text-sm font-medium">
                      {category.Courses?.length || 0} {category.Courses?.length === 1 ? 'Course' : 'Courses'}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add No Results Message */}
        {searchTerm && filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No categories found matching your search.
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50"
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {isEditing ? "Edit Category" : "Add New Category"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={modalData.name}
                      onChange={(e) =>
                        setModalData({ ...modalData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isEditing ? "Update" : "Add"} Category
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default Category;