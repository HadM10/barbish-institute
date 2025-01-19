// components/User/Home/CourseCard.js
import React, { useState } from "react";
import { FaWhatsapp, FaClock, FaUser, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const CourseCard = ({ course }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative group animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform 
                   transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                   border border-gray-100"
        onClick={() => setIsExpanded(true)}
      >
        {/* Image Container */}
        <div className="relative h-[280px] overflow-hidden">
          <img
            src={course.image || englishCourseImg}
            alt={course.title}
            className="w-full h-full object-cover transform 
                     group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.target.src = englishCourseImg;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3
            className="text-xl font-bold text-gray-800 mb-3 line-clamp-1 group-hover:text-blue-600
                         transition-colors duration-300"
          >
            {course.title}
          </h3>

          <p className="text-gray-600 text-sm mb-5 line-clamp-2">
            {course.description}
          </p>

          {/* Price Section */}
          <div className="flex items-center justify-center mb-4">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600
                           px-4 py-2 rounded-full shadow-lg"
            >
              <span className="text-white font-bold text-lg">
                ${course.price}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
              <FaClock className="text-blue-600 text-sm" />
              <span className="text-sm text-blue-600 font-medium">
                {course.duration} hours
              </span>
            </div>
            <button
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                       font-medium rounded-full hover:shadow-xl hover:shadow-blue-600/20
                       transition-all duration-300 transform hover:scale-105
                       flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <FaWhatsapp className="text-lg" />
              <span>Enquire Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-xl w-full max-w-[90%] md:max-w-[700px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-auto">
              {/* Square Image Container */}
              <div className="w-full h-[200px] md:h-[300px] flex-shrink-0">
                <img
                  src={course.image || englishCourseImg}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = englishCourseImg;
                  }}
                />
              </div>

              {/* Content Container */}
              <div className="flex-1 bg-gradient-to-br from-[#4338ca] to-[#5b21b6] p-5 overflow-y-auto">
                {/* Header with Price and Close */}
                <div className="flex justify-between items-center mb-4">
                  <div className="bg-white/95 px-4 py-2 rounded-full">
                    <span className="text-primary font-bold text-lg">
                      ${course.price}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <FaTimes className="text-white text-lg" />
                  </button>
                </div>

                {/* Course Title */}
                <h2 className="text-xl font-bold text-white mb-4">
                  {course.title}
                </h2>

                {/* Course Details Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white/10 rounded-lg p-2.5">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-white text-sm" />
                      <span className="text-white text-sm">
                        {course.duration} hours
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2.5">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-white text-sm" />
                      <span className="text-white text-sm">
                        {course.instructor || "Mahdi"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Description */}
                <div className="mb-4">
                  <h3 className="text-white font-semibold mb-2">Description</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* What You'll Learn */}
                <div className="mb-4">
                  <h3 className="text-white font-semibold mb-2">
                    What You'll Learn
                  </h3>
                  <ul className="space-y-2">
                    {course.content?.split("\n").map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-white/90 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enquire Button - Fixed at bottom */}
                <div className="sticky bottom-0 pt-2">
                  <button
                    className="w-full bg-white hover:bg-white/90 text-indigo-600 
                             py-2.5 rounded-lg font-medium flex items-center 
                             justify-center gap-2 transition-colors"
                  >
                    <FaWhatsapp className="text-lg" />
                    <span>Enquire Now</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
