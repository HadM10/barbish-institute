// Category.js
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BookOpenIcon,
  RectangleStackIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';

const Category = () => {
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: 'Programming', 
      courses: 15, 
      description: 'Learn coding and software development'
    },
    { 
      id: 2, 
      name: 'Design', 
      courses: 8, 
      description: 'Master graphic and UI/UX design'
    },
    { 
      id: 3, 
      name: 'Marketing', 
      courses: 12, 
      description: 'Digital marketing strategies'
    }
  ]);

  const [modalData, setModalData] = useState({ name: '', description: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalData.name.trim() && modalData.description.trim()) {
      if (isEditing) {
        setCategories(categories.map(cat => 
          cat.id === modalData.id 
            ? { ...cat, name: modalData.name, description: modalData.description }
            : cat
        ));
        toast.success('Category updated successfully!');
      } else {
        const newCategory = {
          id: Date.now(),
          name: modalData.name,
          description: modalData.description,
          courses: 0
        };
        setCategories([...categories, newCategory]);
        toast.success('Category added successfully!');
      }
      handleCloseModal();
    }
  };

  const handleEdit = (category) => {
    setModalData(category);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalData({ name: '', description: '' });
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    toast.error('Category deleted successfully!');
  };

  const getTotalCourses = () => categories.reduce((acc, cat) => acc + cat.courses, 0);
  const getAverageCourses = () => Math.round(getTotalCourses() / (categories.length || 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
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
              <p className="text-gray-600 mt-2">Manage your course categories</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 
                       text-white rounded-xl shadow-lg hover:shadow-xl 
                       transition-all duration-200 flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Category</span>
            </motion.button>
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
                <h3 className="text-3xl font-bold text-white mt-1">{categories.length}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-xl text-white">
                <RectangleStackIcon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-700 via-purple-600 to-purple-700 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 font-medium">Total Courses</p>
                <h3 className="text-3xl font-bold text-white mt-1">{getTotalCourses()}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-xl text-white">
                <BookOpenIcon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 font-medium">Average Courses</p>
                <h3 className="text-3xl font-bold text-white mt-1">{getAverageCourses()}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-xl text-white">
                <AcademicCapIcon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {categories.map((category, index) => (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-br from-slate-400 via-gray-500 to-neutral-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{category.name}</h3>
          <p className="text-white/90 text-sm mt-1">{category.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(category)}
            className="p-2 text-white bg-white/20 rounded-lg transition-colors hover:bg-white/30"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(category.id)}
            className="p-2 text-white bg-white/20 rounded-lg transition-colors hover:bg-white/30"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <BookOpenIcon className="w-5 h-5 text-white/90" />
        <span className="text-white/90">{category.courses} Courses</span>
      </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={modalData.name}
                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={modalData.description}
                    onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    rows="3"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg
                             hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 
                             text-white rounded-lg shadow-lg hover:shadow-xl 
                             transition-all duration-200"
                  >
                    {isEditing ? 'Update' : 'Add'} Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
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

export default Category;