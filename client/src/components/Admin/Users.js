// Users.js
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { 
  PencilIcon, 
  TrashIcon, 
  UserPlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      username: 'john_doe',
      email: 'john@example.com',
      password: '********',
      status: 'active',
      createdAt: '2023-12-01',
      lastLogin: '2023-12-15'
    },
    { 
      id: 2, 
      username: 'jane_smith',
      email: 'jane@example.com',
      password: '********',
      status: 'active',
      createdAt: '2023-12-02',
      lastLogin: '2023-12-16'
    },
    { 
      id: 3, 
      username: 'mike_wilson',
      email: 'mike@example.com',
      password: '********',
      status: 'inactive',
      createdAt: '2023-12-03',
      lastLogin: '2023-12-14'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleEdit = (user) => {
    setIsEditing(true);
    setEditingId(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: ''
    });
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || (!isEditing && !formData.password)) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isEditing) {
      setUsers(prev => prev.map(user => {
        if (user.id === editingId) {
          return {
            ...user,
            username: formData.username,
            email: formData.email,
            ...(formData.password && { password: formData.password })
          };
        }
        return user;
      }));
      toast.success('User updated successfully!');
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '-'
      };
      setUsers(prev => [...prev, newUser]);
      toast.success('User added successfully!');
    }

    resetForm();
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.error('User deleted successfully!');
  };

  const handleStatusToggle = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        toast.info(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Users Management
              </h1>
              <p className="text-gray-600 mt-2">Manage and monitor user accounts</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="group w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                       text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                       flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <UserPlusIcon className="w-5 h-5" />
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Users</p>
                <h3 className="text-3xl font-bold text-indigo-600 mt-1">{users.length}</h3>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <UserGroupIcon className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Active Users</p>
                <h3 className="text-3xl font-bold text-green-600 mt-1">
                  {users.filter(user => user.status === 'active').length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Inactive Users */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Inactive Users</p>
                <h3 className="text-3xl font-bold text-red-600 mt-1">
                  {users.filter(user => user.status === 'inactive').length}
                </h3>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <XCircleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Table Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl bg-gray-50 border border-gray-200
                         focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 
                         outline-none transition-all duration-300"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  <th className="px-6 py-4 text-left text-white font-semibold">Username</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Created At</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Last Login</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 
                                    flex items-center justify-center text-white font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 font-medium text-gray-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${user.status === 'active' 
                            ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20' 
                            : 'bg-red-100 text-red-800 ring-1 ring-red-600/20'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 
                            ${user.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}>
                          </span>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.createdAt}</td>
                    <td className="px-6 py-4 text-gray-600">{user.lastLogin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 
                                   hover:scale-110 hover:shadow-lg"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleStatusToggle(user.id)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
                            hover:scale-105 hover:shadow-lg min-w-[100px] text-center
                            ${user.status === 'active'
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 
                                   hover:scale-110 hover:shadow-lg"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 -mx-6 -mt-6 px-6 py-4 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit User' : 'Add New User'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 
                             focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 
                             outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 
                             focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 
                             outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isEditing ? 'New Password (optional)' : 'Password'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 
                             focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 
                             outline-none transition-all duration-200"
                    {...(!isEditing && { required: true })}
                  />
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 
                             hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                             text-white rounded-xl shadow-lg hover:shadow-xl 
                             transition-all duration-200"
                  >
                    {isEditing ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
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
        theme="light"
      />
    </div>
  );
};

export default Users;