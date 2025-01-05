import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaWhatsapp,
  FaTimes,
  FaClock,
  FaGraduationCap,
  FaTrophy
} from 'react-icons/fa';
import { getMostSubCourses } from '../../../api/mostSubCoursesAPI';
import englishCourseImg from '../../../assets/images/english-course.jpg';

const CourseCard = ({ course, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div
        onClick={() => setIsExpanded(true)}
        className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.03] 
                 backdrop-blur-sm rounded-3xl p-1 cursor-pointer
                 hover:shadow-2xl hover:shadow-blue-500/10 
                 transition-all duration-500"
      >
        <div className="relative overflow-hidden rounded-[22px] bg-[#1a1d2d]">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={englishCourseImg}
              alt={course.title}
              className="w-full h-full object-cover transform 
                       group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t 
                        from-[#1a1d2d] via-transparent to-transparent" />
            
            {/* Premium Badge */}
            {index === 0 && (
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 px-4 py-2 
                            rounded-full bg-gradient-to-r from-amber-500/90 to-orange-600/90 
                            backdrop-blur-sm shadow-lg">
                  <FaTrophy className="text-white" />
                  <span className="text-white font-medium">Most Popular</span>
                </div>
              </div>
            )}
            
            {/* Price Tag */}
            <div className="absolute top-4 right-4">
              <div className="px-4 py-2 rounded-full 
                          bg-gradient-to-r from-blue-600/90 to-violet-600/90 
                          backdrop-blur-sm shadow-lg">
                <span className="text-white font-bold">
                  ${course.price}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-3 
                       group-hover:text-blue-400 transition-colors duration-300">
              {course.title}
            </h3>
            
            <p className="text-white/60 text-sm mb-6 line-clamp-2">
              {course.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-4 py-2 
                          rounded-full bg-white/5">
                <FaClock className="text-blue-400" />
                <span className="text-white/80">
                  {course.duration} hours
                </span>
              </div>
              
              <button
                className="flex items-center gap-2 px-6 py-2.5 
                        rounded-full bg-gradient-to-r from-blue-500 to-violet-500 
                        text-white font-medium shadow-lg shadow-blue-500/25
                        hover:shadow-blue-500/40 transform hover:scale-105 
                        transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <FaWhatsapp />
                <span>Enquire</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-[#1a1d2d] rounded-2xl overflow-hidden shadow-2xl
                     w-[90%] sm:w-[400px] md:w-[450px] max-w-[500px]
                     max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] w-full">
              <img
                src={englishCourseImg}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d2d] via-transparent to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 p-2 rounded-full 
                         bg-black/30 hover:bg-black/40 
                         transition-colors duration-200"
              >
                <FaTimes className="text-white text-lg" />
              </button>

              {/* Price Badge */}
              <div className="absolute top-4 left-4">
                <div className="px-4 py-2 rounded-full 
                            bg-gradient-to-r from-blue-600/90 to-violet-600/90 
                            backdrop-blur-sm shadow-lg">
                  <span className="text-white font-bold">${course.price}</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">
                {course.title}
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-400" />
                    <div>
                      <p className="text-white/60 text-xs">Duration</p>
                      <p className="text-white font-medium text-sm">
                        {course.duration} hours
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <FaGraduationCap className="text-blue-400" />
                    <div>
                      <p className="text-white/60 text-xs">Students</p>
                      <p className="text-white font-medium text-sm">
                        Active Students
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {course.description}
              </p>

              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-3 
                        rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 
                        text-white font-medium shadow-lg shadow-blue-500/25
                        hover:shadow-blue-500/40 transform hover:scale-[0.98] 
                        transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <FaWhatsapp className="text-lg" />
                <span>Enquire Now</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
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
    <section className="py-16 bg-gradient-to-b from-[#1E1B4B] via-[#1E1B4B] to-[#2D2A5E]">
      <div className="container mx-auto px-4">
        {/* Compact Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full 
                     bg-white/5 backdrop-blur-sm border border-white/10 mb-4"
          >
            <FaTrophy className="text-amber-400 text-sm" />
            <span className="text-white/80 text-sm font-medium">Featured Collection</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
                     bg-gradient-to-r from-white via-blue-200 to-white
                     tracking-tight leading-tight mb-4"
          >
            Most Subscribed Courses
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <p className="text-white/60 text-base">
              Join thousands of students in our most popular professional courses
            </p>
          </motion.div>
        </div>

        {/* Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/courses')}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 
                     bg-gradient-to-r from-white/10 to-white/5 
                     backdrop-blur-md rounded-full overflow-hidden
                     border border-white/10 shadow-2xl shadow-blue-500/10
                     hover:shadow-blue-500/20 transition-all duration-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 text-white font-medium">
              View All Courses
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600"
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