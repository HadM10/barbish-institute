/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import { getAllContacts, updateContactStatus } from "../../api/contactsAPI";

// Notification Component
const Notification = memo(({ message, type }) => {
  const bgColor = type === "error" ? "bg-red-500" : "bg-emerald-500";

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${bgColor}`}
    >
      {type === "success" ? (
        <CheckCircleIcon className="w-6 h-6 text-white" />
      ) : (
        <XCircleIcon className="w-6 h-6 text-white" />
      )}
      <p className="text-white font-medium">{message}</p>
    </motion.div>
  );
});

const ContactMessages = () => {
  const [notification, setNotification] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await getAllContacts();
      if (res.success) {
        const adapted = res.data
          .map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            message: c.message,
            status: c.status ? "read" : "unread",
            createdAt: c.createdAt,
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date, newest first
        setMessages(adapted);
      } else {
        showNotification("Failed to fetch contacts", "error");
      }
    } catch (error) {
      showNotification("Error loading contacts", "error");
    }
  };

  const handleToggleStatus = useCallback(async (messageId, currentStatus) => {
    try {
      const newStatus = currentStatus === "read" ? false : true;
      const res = await updateContactStatus(messageId, newStatus);
      if (res.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  status: newStatus ? "read" : "unread",
                }
              : msg
          )
        );
        if (selectedMessage?.id === messageId) {
          setSelectedMessage((prev) => ({
            ...prev,
            status: newStatus ? "read" : "unread",
          }));
        }
        showNotification(`Message marked as ${newStatus ? "read" : "unread"}`);
      } else {
        showNotification("Failed to update status", "error");
      }
    } catch (error) {
      showNotification("Error updating message status", "error");
    }
  }, []);

  const handleRowClick = (message) => {
    setSelectedMessage(message);
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || msg.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-2 md:p-6 w-full overflow-hidden">
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
          />
        )}
      </AnimatePresence>

      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg mb-4 md:mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                Contact Messages
              </h1>
              <p className="text-gray-600 mt-2">
                View and manage incoming messages
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 
                           focus:ring-indigo-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 
                         focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-white font-semibold">
                    Name
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-white font-semibold">
                    Email
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-white font-semibold">
                    Message
                  </th>
                  <th className="px-3 md:px-6 py-3 text-center text-white font-semibold w-20">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-3 text-center text-white font-semibold w-16">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(message)}
                  >
                    <td className="px-3 md:px-6 py-3">
                      <div className="flex items-center">
                        <UserIcon className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                        <span
                          className="font-medium truncate max-w-[80px] sm:max-w-[120px] md:max-w-[150px]"
                          title={message.name}
                        >
                          {message.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3">
                      <div className="flex items-center">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                        <span
                          className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-[150px]"
                          title={message.email}
                        >
                          {message.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3">
                      <p
                        className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]"
                        title={message.message}
                      >
                        {message.message}
                      </p>
                    </td>
                    <td className="px-3 md:px-6 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs whitespace-nowrap
                        ${
                          message.status === "unread"
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {message.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(message.id, message.status);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={`Mark as ${
                            message.status === "read" ? "unread" : "read"
                          }`}
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Message Details
                  </h3>
                  <p className="text-gray-500">From: {selectedMessage.name}</p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-gray-900">{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Message
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-xs
                    ${
                      selectedMessage.status === "unread"
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {selectedMessage.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    handleToggleStatus(
                      selectedMessage.id,
                      selectedMessage.status
                    )
                  }
                  className="px-4 py-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 
                           text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Mark as{" "}
                  {selectedMessage.status === "read" ? "unread" : "read"}
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <EnvelopeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No messages found
            </h3>
            <p className="text-gray-500">
              There are no messages matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ContactMessages);
