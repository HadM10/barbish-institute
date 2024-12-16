// Category.js
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Category = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Programming', courses: 15, students: 234 },
    { id: 2, name: 'Design', courses: 8, students: 156 },
    { id: 3, name: 'Marketing', courses: 12, students: 189 },
  ]);

  const [modalData, setModalData] = useState({ name: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalData.name.trim()) {
      if (isEditing) {
        // Update existing category
        setCategories(categories.map(cat => 
          cat.id === modalData.id 
            ? { ...cat, name: modalData.name }
            : cat
        ));
        toast.success('Category updated successfully!');
      } else {
        // Add new category
        const newCategory = {
          id: categories.length + 1,
          name: modalData.name,
          courses: 0,
          students: 0
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
    setModalData({ name: '' });
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleAddNew = () => {
    setModalData({ name: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage your course categories</p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 
                     text-white rounded-xl shadow-lg shadow-indigo-500/30 
                     hover:shadow-indigo-500/40 transition-all duration-200
                     flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Category</span>
        </button>
      </div>
{/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {/* Total Categories Card */}
  <div className="bg-gradient-to-br from-sky-500 to-sky-400 p-6 rounded-2xl shadow-lg shadow-sky-500/30">
    <div className="text-gray-800 text-sm font-medium mb-2">Total Categories</div>
    <div className="text-3xl font-bold text-gray-900">{categories.length}</div>
  </div>

  {/* Total Courses Card */}
  <div className="bg-gradient-to-br from-indigo-500 to-indigo-400 p-6 rounded-2xl shadow-lg shadow-indigo-500/30">
    <div className="text-gray-800 text-sm font-medium mb-2">Total Courses</div>
    <div className="text-3xl font-bold text-gray-900">
      {categories.reduce((acc, cat) => acc + cat.courses, 0)}
    </div>
  </div>

  {/* Total Students Card */}
  <div className="bg-gradient-to-br from-orange-500 to-orange-400 p-6 rounded-2xl shadow-lg shadow-orange-500/30">
    <div className="text-gray-800 text-sm font-medium mb-2">Total Students</div>
    <div className="text-3xl font-bold text-gray-900">
      {categories.reduce((acc, cat) => acc + cat.students, 0)}
    </div>
  </div>
</div>
      {/* Categories Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Courses</th>
                <th className="px-6 py-4 text-left">Students</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{category.courses}</td>
                  <td className="px-6 py-4 text-gray-600">{category.students}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-sky-500 hover:text-sky-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setCategories(categories.filter(c => c.id !== category.id));
                          toast.success('Category deleted successfully!');
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                placeholder="Category name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/30"
                >
                  {isEditing ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Category;