// Users.js
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
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
      lastLogin: '2023-12-14'
    },
    { 
      id: 3, 
      username: 'mike_wilson',
      email: 'mike@example.com',
      password: '********',
      status: 'inactive',
      createdAt: '2023-12-03',
      lastLogin: '2023-12-10'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const newUserData = {
      id: users.length + 1,
      ...newUser,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: '-'
    };

    setUsers([...users, newUserData]);
    setIsModalOpen(false);
    setNewUser({ username: '', email: '', password: '' });
    toast.success('User added successfully!');
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('User deleted successfully!');
  };

  const handleStatusToggle = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    toast.success('User status updated successfully!');
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 
                   text-white rounded-xl shadow-lg shadow-indigo-500/30 
                   hover:shadow-indigo-500/40 transition-all duration-200
                   flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="text-gray-600 mb-2">Total Users</div>
          <div className="text-3xl font-bold text-gray-900">{users.length}</div>
        </div>
        <div className="bg-[#6366f1] rounded-2xl shadow-md p-6">
          <div className="text-white mb-2">Active Users</div>
          <div className="text-3xl font-bold text-white">
            {users.filter(user => user.status === 'active').length}
          </div>
        </div>
        <div className="bg-[#f97316] rounded-2xl shadow-md p-6">
          <div className="text-white mb-2">Inactive Users</div>
          <div className="text-3xl font-bold text-white">
            {users.filter(user => user.status === 'inactive').length}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-3 rounded-xl border focus:border-indigo-500 
                   focus:ring-2 focus:ring-indigo-500/20 outline-none"
        />
      </div>

      {/* Users Table with Responsive Wrapper */}
      <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-xl">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white">
            <tr>
              <th className="px-6 py-4 text-left">Username</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Created At</th>
              <th className="px-6 py-4 text-left">Last Login</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span 
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.createdAt}</td>
                <td className="px-6 py-4 text-gray-600">{user.lastLogin}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStatusToggle(user.id)}
                      className={`text-sm px-3 py-1 rounded-md ${
                        user.status === 'active'
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
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

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">Add New User</h2>
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border focus:border-indigo-500 
                           focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border focus:border-indigo-500 
                           focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border focus:border-indigo-500 
                           focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 
                           text-white rounded-xl shadow-lg shadow-indigo-500/30"
                >
                  Add User
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

export default Users;