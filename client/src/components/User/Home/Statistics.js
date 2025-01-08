// components/User/Home/Statistics.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaAward, FaCertificate, FaHandshake } from 'react-icons/fa';

const Statistics = () => {
  const stats = [
    { 
      icon: FaGlobe,
      number: "25+", 
      label: "Countries Reached",
      description: "Global learning community"
    },
    { 
      icon: FaAward,
      number: "15", 
      label: "Industry Awards",
      description: "Excellence in education"
    },
    { 
      icon: FaCertificate,
      number: "8+", 
      label: "Accreditations",
      description: "International recognition"
    },
    { 
      icon: FaHandshake,
      number: "12+", 
      label: "Corporate Partners",
      description: "Industry connections"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Global Recognition & Achievement
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-2xl opacity-0 
                            group-hover:opacity-5 transform group-hover:scale-105 
                            transition-all duration-300"></div>
              <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl 
                            transition-all duration-300 border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center 
                                justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <stat.icon className="text-2xl text-blue-600" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-800 mb-2 
                               bg-gradient-to-r from-blue-600 to-purple-600 
                               bg-clip-text text-transparent">
                    {stat.number}
                  </h3>
                  <p className="text-lg font-semibold text-gray-700 mb-2">{stat.label}</p>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 
                              rounded-full opacity-20"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-600 
                              rounded-full opacity-20"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 bg-blue-600 rounded-2xl text-center text-white"
        >
          <p className="text-xl font-semibold">
            Recognized for Excellence in International Education
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics;