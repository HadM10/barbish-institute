// src/components/Admin/ContactMessages.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  TrashIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

import {
  getAllContacts,
  updateContactStatus,
} from '../../api/contactsAPI';

// Notification Component
const Notification = ({ message, type }) => {
  const bgColor = type === 'error' || type === 'delete' 
    ? 'bg-red-500' 
    : 'bg-emerald-500';

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${bgColor}`}
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

const ContactMessages = () => {
  const [notification, setNotification] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await getAllContacts();
      if (res.success) {
        const adapted = res.data.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: '',
          subject: '',
          message: c.message,
          status: c.status ? 'read' : 'unread',
          createdAt: c.createdAt,
          replied: false
        }));
        setMessages(adapted);
      } else {
        showNotification('Failed to fetch contacts', 'error');
      }
    } catch (error) {
      showNotification('Error loading contacts', 'error');
    }
  };

  const handleDelete = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      showNotification('Message deleted successfully', 'delete');
    }
  };

  const handleReply = (messageId) => {
    if (!replyText.trim()) {
      showNotification('Please enter a reply message', 'error');
      return;
    }
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, replied: true } : msg
    ));
    showNotification('Reply sent successfully');
    setReplyText('');
    setShowReplyForm(null);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const res = await updateContactStatus(messageId, true);
      if (res.success) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        ));
        showNotification('Message marked as read');
      } else {
        showNotification('Failed to mark as read', 'error');
      }
    } catch (error) {
      showNotification('Error updating message status', 'error');
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || msg.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 p-8">
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                Contact Messages
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and respond to incoming messages
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 
                           focus:ring-indigo-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 
                         focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Message</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="font-medium">{message.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
                        {message.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="truncate max-w-xs">{message.message}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs
                        ${message.status === 'unread' 
                          ? 'bg-indigo-100 text-indigo-600' 
                          : 'bg-green-100 text-green-600'}`}
                      >
                        {message.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setShowReplyForm(message.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(message.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

        {/* Reply Modal */}
        {showReplyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Reply to Message</h3>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowReplyForm(null);
                    setReplyText('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReply(showReplyForm)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 
                           text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <EnvelopeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No messages found</h3>
            <p className="text-gray-500">There are no messages matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;
