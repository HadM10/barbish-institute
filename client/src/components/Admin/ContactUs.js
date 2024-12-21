// src/components/Admin/ContactMessages.js
import React, { useState } from 'react';
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

const ContactMessages = () => {
  // Sample messages data (will be replaced with API data later)
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 8900",
      subject: "Course Inquiry",
      message: "I'm interested in the Advanced React Development course. Could you provide more details about the curriculum?",
      status: "unread",
      createdAt: "2024-01-20T10:30:00",
      replied: false
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "+1 987 654 3210",
      subject: "Technical Support",
      message: "Having trouble accessing the course materials. Need assistance.",
      status: "read",
      createdAt: "2024-01-19T15:45:00",
      replied: true
    }
  ]);

  const [expandedMessage, setExpandedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read

  // Handle message deletion
  const handleDelete = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted successfully');
    }
  };

  // Handle sending reply
  const handleReply = (messageId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    // Here you would typically make an API call to send the email
    console.log(`Sending reply to message ${messageId}:`, replyText);
    
    // Update message status
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, replied: true } : msg
    ));

    // Reset form
    setReplyText('');
    setShowReplyForm(null);
    toast.success('Reply sent successfully');
  };

  // Mark message as read
  const handleMarkAsRead = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    ));
  };

  // Filter messages
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
        {filteredMessages.map(message => (
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
                    {message.subject}
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
                      {message.phone}
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