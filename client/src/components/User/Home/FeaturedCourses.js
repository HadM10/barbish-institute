import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaWhatsapp,
  FaClock,
  FaGraduationCap,
  FaTrophy
} from 'react-icons/fa';
import { getMostSubCourses } from '../../../api/mostSubCoursesAPI';
import englishCourseImg from '../../../assets/images/english-course.jpg';

const CourseCard = ({ course, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="w-full max-w-[370px] mx-auto"
    >
      <div className="group relative bg-gradient-to-br from-white/10 to-white/5 
                    backdrop-blur-sm rounded-3xl p-0.5 
                    hover:shadow-2xl hover:shadow-blue-500/20 
                    transition-all duration-500 transform scale-[0.98]">
        <div className="relative overflow-hidden rounded-[24px] bg-[#1a1d2d]">
          {/* Image Container with improved resolution */}
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img
              src={englishCourseImg}
              alt={course.title}
              className="w-full h-full object-cover transform 
                       group-hover:scale-105 transition-transform duration-700
                       rendering-crisp-edges"
            />
            <div className="absolute inset-0 bg-gradient-to-t 
                         from-[#1a1d2d] via-[#1a1d2d]/50 to-transparent" />

            {/* Most Popular Badge with improved text rendering */}
            {index === 0 && (
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 px-4 py-2 
                             rounded-full bg-gradient-to-r from-amber-500 to-orange-600 
                             backdrop-blur-sm shadow-lg">
                  <FaTrophy className="text-white text-sm antialiased" />
                  <span className="text-white text-sm font-semibold antialiased">Most Popular</span>
                </div>
              </div>
            )}

            {/* Price Tag with improved text rendering */}
            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600
                           px-4 py-2 rounded-tl-lg shadow-lg">
              <span className="text-white font-bold text-lg antialiased">${course.price}</span>
            </div>
          </div>

          {/* Content Section with improved text rendering */}
          <div className="p-5 space-y-3.5">
            <div className="space-y-2.5">
              <h3 className="text-xl font-bold text-white leading-tight antialiased
                          group-hover:text-blue-400 transition-colors duration-300">
                {course.title}
              </h3>
              
              <p className="text-white/70 text-sm leading-relaxed antialiased">
                {course.description}
              </p>
            </div>

            {/* Course Stats with improved rendering */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-sm
                          hover:bg-white/15 transition-colors duration-300">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FaClock className="text-blue-400 text-lg antialiased" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-medium mb-0.5 antialiased">Duration</p>
                    <p className="text-white text-base font-semibold antialiased">
                      {course.duration}h
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-sm
                          hover:bg-white/15 transition-colors duration-300">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FaGraduationCap className="text-purple-400 text-lg antialiased" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-medium mb-0.5 antialiased">Students</p>
                    <p className="text-white text-base font-semibold antialiased">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enquire Button with improved rendering */}
            <button
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 
                      rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 
                      text-white text-base font-semibold tracking-wide antialiased
                      shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 
                      transform hover:scale-[1.02] transition-all duration-300
                      hover:from-blue-600 hover:to-violet-600"
            >
              <FaWhatsapp className="text-lg" />
              <span>Enquire Now</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getMostSubCourses();
        if (response.success) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="relative py-12 bg-white overflow-hidden">
      {/* LED Line Effect */}
      <div className="absolute inset-0">
        {/* Horizontal LED line */}
        <motion.div 
          className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ 
            x: "100%",
            transition: {
              repeat: Infinity,
              duration: 3,
              ease: "linear"
            }
          }}
        />
        
        {/* Vertical LED lines */}
        <div className="absolute inset-0 flex justify-between">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-[2px] h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
              initial={{ y: "-100%" }}
              animate={{
                y: "100%",
                transition: {
                  repeat: Infinity,
                  duration: 4,
                  delay: i * 0.5,
                  ease: "linear"
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full 
                     bg-white shadow-md border border-gray-100 mb-3"
          >
            <FaTrophy className="text-amber-500 text-lg" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text text-transparent font-semibold">
              Featured Collection
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900
                     tracking-tight leading-tight mb-4 drop-shadow-sm"
          >
            Most Subscribed Courses
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base text-gray-600 max-w-2xl mx-auto"
          >
            Join thousands of students in our most popular professional courses
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="relative max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative z-20"
              >
                <CourseCard course={course} index={index} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Improved CTA Button */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => navigate('/courses')}
            className="group relative inline-flex items-center gap-3 px-8 py-4 
                     overflow-hidden rounded-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Static Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />
            
            {/* Button Content */}
            <span className="relative z-10 text-white font-semibold">
              Explore All Courses
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCourses;