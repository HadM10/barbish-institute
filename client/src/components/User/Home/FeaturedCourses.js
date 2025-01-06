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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="w-full max-w-xs mx-auto"
    >
      <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.03] 
                    backdrop-blur-sm rounded-xl p-0.5 
                    hover:shadow-lg hover:shadow-blue-500/10 
                    transition-all duration-500">
        <div className="relative overflow-hidden rounded-[12px] bg-[#1a1d2d]">
          {/* Square Image Container */}
          <div className="relative w-full h-[204px] overflow-hidden">
            <img
              src={englishCourseImg}
              alt={course.title}
              className="w-full h-full object-cover transform 
                       group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t 
                         from-[#1a1d2d] via-transparent to-transparent" />
            
            {/* Badges */}
            {index === 0 && (
              <div className="absolute top-2 left-2">
                <div className="flex items-center gap-1 px-2 py-0.5 
                             rounded-full bg-gradient-to-r from-amber-500/90 to-orange-600/90 
                             backdrop-blur-sm shadow-sm">
                  <FaTrophy className="text-white text-[9px]" />
                  <span className="text-white text-[9px] font-medium">Popular</span>
                </div>
              </div>
            )}
            
            <div className="absolute top-2 right-2">
              <div className="px-2 py-0.5 rounded-full 
                           bg-gradient-to-r from-blue-600/90 to-violet-600/90 
                           backdrop-blur-sm shadow-sm">
                <span className="text-white text-[10px] font-bold">
                  ${course.price}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 space-y-1.5">
            <h3 className="text-sm font-bold text-white line-clamp-1 
                        group-hover:text-blue-400 transition-colors duration-300">
              {course.title}
            </h3>
            
            <p className="text-white/60 text-[10px] line-clamp-2 min-h-[24px]">
              {course.description}
            </p>

            {/* Course Details */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-white/5 rounded-md p-1.5">
                <div className="flex items-center gap-1">
                  <FaClock className="text-blue-400 text-[9px]" />
                  <span className="text-white text-[9px]">
                    {course.duration}h
                  </span>
                </div>
              </div>
              <div className="bg-white/5 rounded-md p-1.5">
                <div className="flex items-center gap-1">
                  <FaGraduationCap className="text-blue-400 text-[9px]" />
                  <span className="text-white text-[9px]">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              className="w-full flex items-center justify-center gap-1 px-3 py-1.5 
                      rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 
                      text-white text-[10px] font-medium shadow-sm
                      hover:shadow-md transform hover:scale-[1.01] 
                      transition-all duration-300"
            >
              <FaWhatsapp className="text-[9px]" />
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
      <div className="container mx-auto px-2 max-w-5xl">
        {/* Minimal Header */}
        <div className="text-center mb-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full 
                     bg-gray-200 backdrop-blur-sm border border-gray-300 mb-1.5"
          >
            <FaTrophy className="text-amber-500 text-[10px]" />
            <span className="text-gray-800 text-[10px] font-medium">Featured Collection</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-bold text-gray-900
                     tracking-tight leading-tight mb-1"
          >
            Most Subscribed Courses
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xs mx-auto"
          >
            <p className="text-gray-700 text-[11px]">
              Join thousands of students in our most popular professional courses
            </p>
          </motion.div>
        </div>

        {/* Adjusted Grid */}
        <div className="max-w-4xl mx-auto mb-3">
          <div className="flex justify-center gap-4">
            {courses.slice(0, 3).map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </div>

        {/* Minimal View All Button */}
        <motion.div 
          className="text-center pb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => navigate('/courses')}
            className="group relative inline-flex items-center gap-1.5 px-4 py-1.5 
                     bg-gradient-to-r from-blue-500 to-violet-500 
                     text-white text-[11px] font-medium rounded-full overflow-hidden
                     shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">View All Courses</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCourses;