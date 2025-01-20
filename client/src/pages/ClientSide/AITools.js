import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaRobot, FaGraduationCap, FaLaptopCode, FaBrain, 
  FaHeartbeat, FaChartLine, FaPaperPlane,
  FaBook, FaPalette, FaDumbbell, FaUserTie
} from 'react-icons/fa';
import Navbar from '../../components/User/Home/Navbar';
import axios from 'axios';

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

  // OpenRouter API key
  const OPENROUTER_KEY = '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';

  useEffect(() => {
    setMessages([{
      type: 'ai',
      content: "Hello! I'm your AI assistant powered by advanced language models. I can help you with any questions, discussions, or tasks you have in mind. How can I assist you today?",
      timestamp: new Date()
    }]);
  }, []);

  const getAIResponse = async (message) => {
    setIsTyping(true);
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "mistralai/mistral-7b-instruct", // One of the best free models
          messages: [
            {
              role: "system",
              content: "You are a helpful, intelligent, and professional AI assistant. Provide detailed, accurate, and helpful responses."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_KEY}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'AI Learning Assistant',
            'Content-Type': 'application/json',
          }
        }
      );

      const aiResponse = response.data.choices[0]?.message?.content || 
        "I apologize, but I'm having trouble understanding. Could you rephrase that?";

      setMessages(prev => [...prev, {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error:', error);
      handleFallbackResponse();
    } finally {
      setIsTyping(false);
    }
  };

  const handleFallbackResponse = () => {
    const fallbackResponses = [
      "I apologize, but I'm having temporary issues. Could you please try again?",
      "I understand this is important. Could you rephrase your question?",
      "Let me help you with that. Could you provide more details?",
      "I want to give you the best answer. Could you elaborate further?",
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    setMessages(prev => [...prev, {
      type: 'ai',
      content: randomResponse,
      timestamp: new Date()
    }]);
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
    await getAIResponse(inputMessage);
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

      <div className="pt-36 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text 
                         bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
              AI Chat Assistant
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Ask me anything - I'm here to help!
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
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                  <div className="flex items-center gap-3">
                    <FaRobot className="text-2xl text-white" />
                    <h2 className="text-xl font-bold text-white">Chat Assistant</h2>
                  </div>
                </div>
                
                <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
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

                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
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