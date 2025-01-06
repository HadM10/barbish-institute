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
      className="w-full"
    >
      <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.03] 
                    backdrop-blur-sm rounded-2xl p-0.5 
                    hover:shadow-xl hover:shadow-blue-500/10 
                    transition-all duration-500">
        <div className="relative overflow-hidden rounded-[18px] bg-[#1a1d2d]">
          {/* Image Container */}
          <div className="relative h-[245px] overflow-hidden">
            <img
              src={englishCourseImg}
              alt={course.title}
              className="w-full h-full object-cover transform 
                       group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t 
                         from-[#1a1d2d] via-transparent to-transparent" />

            {/* Most Popular Badge */}
            {index === 0 && (
              <div className="absolute top-3 left-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 
                             rounded-full bg-gradient-to-r from-amber-500/90 to-orange-600/90 
                             backdrop-blur-sm shadow-lg">
                  <FaTrophy className="text-white text-xs" />
                  <span className="text-white text-xs font-medium">Most Popular</span>
                </div>
              </div>
            )}

            {/* Price Tag */}
            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600
                           px-4 py-2 rounded-tl-lg shadow-lg">
              <span className="text-white font-bold text-lg">${course.price}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-3">
            <h3 className="text-lg font-bold text-white line-clamp-1 
                        group-hover:text-blue-400 transition-colors duration-300">
              {course.title}
            </h3>
            
            <p className="text-white/60 text-sm line-clamp-2 min-h-[2.5rem]">
              {course.description}
            </p>

            {/* Course Details */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center gap-1.5">
                  <FaClock className="text-blue-400 text-xs" />
                  <div>
                    <p className="text-white/60 text-[10px]">Duration</p>
                    <p className="text-white text-xs">
                      {course.duration} hours
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center gap-1.5">
                  <FaGraduationCap className="text-blue-400 text-xs" />
                  <div>
                    <p className="text-white/60 text-[10px]">Students</p>
                    <p className="text-white text-xs">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enquire Button */}
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 
                      rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 
                      text-white text-sm font-medium shadow-lg shadow-blue-500/25
                      hover:shadow-blue-500/40 transform hover:scale-[1.02] 
                      transition-all duration-300"
            >
              <FaWhatsapp className="text-sm" />
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
    <section className="py-4 bg-white">
      <div className="container mx-auto px-3 max-w-6xl">
        {/* More Compact Header */}
        <div className="text-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                     bg-gray-200 backdrop-blur-sm border border-gray-300 mb-2"
          >
            <FaTrophy className="text-amber-500 text-sm" />
            <span className="text-gray-800 text-sm font-semibold">Featured Collection</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold text-gray-900
                     tracking-tight leading-tight mb-1.5"
          >
            Most Subscribed Courses
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-sm mx-auto"
          >
            <p className="text-gray-700 text-base">
              Join thousands of students in our most popular professional courses
            </p>
          </motion.div>
        </div>

        {/* Tighter Grid */}
        <div className="max-w-5xl mx-auto mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {courses.slice(0, 3).map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </div>

        {/* Compact View All Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/courses')}
            className="group relative inline-flex items-center gap-2 px-7 py-3 
                     bg-gradient-to-r from-blue-500 to-violet-500 
                     text-white text-base font-semibold rounded-full overflow-hidden
                     shadow-md hover:shadow-lg transition-all duration-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">View All Courses</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCourses;