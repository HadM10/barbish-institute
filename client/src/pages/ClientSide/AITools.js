import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, FaGraduationCap, FaLaptopCode, FaBrain, 
  FaHeartbeat, FaChartLine, FaPaperPlane, FaMicrophone,
  FaBook, FaPalette, FaDumbbell, FaUserTie
} from 'react-icons/fa';
import Navbar from '../../components/User/Home/Navbar';

const AITools = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  const backgroundIcons = [
    { Icon: FaGraduationCap, title: 'Education' },
    { Icon: FaLaptopCode, title: 'Programming' },
    { Icon: FaBrain, title: 'Psychology' },
    { Icon: FaHeartbeat, title: 'Health' },
    { Icon: FaChartLine, title: 'Business' },
    { Icon: FaBook, title: 'Literature' },
    { Icon: FaPalette, title: 'Arts' },
    { Icon: FaDumbbell, title: 'Fitness' },
    { Icon: FaUserTie, title: 'Career' }
  ];

  const simulateAIResponse = async (message) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate different types of responses based on keywords
    let response = "I'm here to help you with any questions about our courses, career advice, or personal development.";
    
    if (message.toLowerCase().includes('course')) {
      response = "We offer various courses in technology, business, health, and personal development. What specific area interests you?";
    } else if (message.toLowerCase().includes('career')) {
      response = "I can help you explore career paths, improve your skills, and prepare for professional growth. What's your current goal?";
    } else if (message.toLowerCase().includes('help')) {
      response = "I'm your AI assistant, ready to help with course selection, study tips, career guidance, or personal development. What would you like to know?";
    }

    setMessages(prev => [...prev, {
      type: 'ai',
      content: response,
      timestamp: new Date()
    }]);
    setIsTyping(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    await simulateAIResponse(inputMessage);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      <Navbar />
      
      {/* Animated Background Icons */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {backgroundIcons.map((IconObj, index) => (
          Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`${index}-${i}`}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                rotate: 0
              }}
              animate={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                rotate: 360
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute text-white/50"
            >
              <IconObj.Icon className="text-4xl md:text-6xl" />
            </motion.div>
          ))
        ))}
      </div>

      <div className="pt-[156px] pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text 
                         bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6">
              AI Learning Assistant
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your personal guide for education, career development, and life improvement
            </p>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden 
                          shadow-2xl border border-white/10">
              <div className="h-[600px] flex flex-col">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <div className="flex items-center gap-3">
                    <FaRobot className="text-2xl text-white" />
                    <h2 className="text-xl font-bold text-white">AI Learning Assistant</h2>
                  </div>
                  <p className="text-white/80 text-sm mt-2">
                    Ask me anything about courses, career advice, or personal development
                  </p>
                </div>
                
                <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-white/50 py-8">
                      <FaRobot className="text-4xl mx-auto mb-4" />
                      <p>Start a conversation with your AI Learning Assistant</p>
                    </div>
                  )}
                  
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-4 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-white/10 text-white'
                      }`}>
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center gap-2 text-white/50">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-2 h-2 bg-white/50 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-2 h-2 bg-white/50 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-2 h-2 bg-white/50 rounded-full"
                      />
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="p-3 rounded-full bg-white/5 text-white/80 hover:bg-white/10 
                               transition-colors duration-300"
                    >
                      <FaMicrophone />
                    </button>
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask about courses, career advice, or personal development..."
                      className="flex-1 px-6 py-3 rounded-full bg-white/5 border border-white/10 
                               text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 
                               text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AITools;