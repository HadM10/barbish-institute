// src/components/Admin/ContactMessages.js
import React, { useState, useEffect } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. Import API methods from EXACT file name "contactAPI.js"
import {
  getAllContacts,
  updateContactStatus,
} from '../../api/contactsAPI';


const ContactMessages = () => {
  // "messages" now comes from the DB in useEffect
  const [messages, setMessages] = useState([]);

  const [expandedMessage, setExpandedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read

  // 2. On component mount, fetch from the API
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await getAllContacts();
      if (res.success) {
        // "res.data" is an array of objects { id, name, email, message, status, createdAt, ... }
        // Convert them to your front-end shape: add placeholders for phone, subject, replied, etc.
        const adapted = res.data.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: '',            // not in DB
          subject: '',          // not in DB
          message: c.message,
          status: c.status ? 'read' : 'unread',  // boolean -> 'read'/'unread'
          createdAt: c.createdAt,
          replied: false        // not in DB
        }));
        setMessages(adapted);
      } else {
        toast.error('Failed to fetch contacts: ' + (res.message || 'Unknown error'));
      }
    } catch (error) {
      toast.error('Error fetching contacts: ' + error.message);
    }
  };

  // 3. Delete is not in the controller, so we remove locally only
  const handleDelete = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted locally (no real API delete).');
    }
  };

  // 4. Send a reply (purely local, no real email sending)
  const handleReply = (messageId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }
    // Just set replied = true locally
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, replied: true } : msg
    ));
    toast.success('Reply sent successfully (simulated)');
    setReplyText('');
    setShowReplyForm(null);
  };

  // 5. Mark message as read => DB status = true
  const handleMarkAsRead = async (messageId) => {
    try {
      const res = await updateContactStatus(messageId, true);
      if (res.success) {
        // Update local state
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        ));
      } else {
        toast.error('Failed to mark as read: ' + (res.message || 'Unknown error'));
      }
    } catch (error) {
      toast.error('Error marking as read: ' + error.message);
    }
  };

  // 6. Filter messages by 'all', 'unread', or 'read'
  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return msg.status === 'unread';
    if (filter === 'read') return msg.status === 'read';
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
        <p className="text-gray-600 mt-2">Manage and respond to incoming messages</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div 
            key={message.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden
              ${message.status === 'unread' ? 'border-l-4 border-indigo-500' : ''}
            `}
          >
            {/* Message Header */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => {
                setExpandedMessage(expandedMessage === message.id ? null : message.id);
                if (message.status === 'unread') {
                  handleMarkAsRead(message.id);
                }
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {message.subject || 'No Subject'} 
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-1" />
                      {message.name}
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-4 h-4 mr-1" />
                      {message.email}
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 mr-1" />
                      {message.phone || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {message.status === 'unread' && (
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs">
                      New
                    </span>
                  )}
                  {message.replied && (
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                      Replied
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                  {expandedMessage === message.id ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedMessage === message.id && (
              <div className="p-4 border-t border-gray-100">
                {/* Message Content */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Message:</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>

                {/* Reply Section */}
                {showReplyForm === message.id ? (
                  <div className="mt-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setShowReplyForm(null);
                          setReplyText('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReply(message.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                      >
                        <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                        Send Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowReplyForm(message.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                    Reply
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <EnvelopeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No messages found</h3>
          <p className="text-gray-500">There are no messages matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
