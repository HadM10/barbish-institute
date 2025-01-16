import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp, FaClock, FaGraduationCap, FaTrophy } from "react-icons/fa";
import { getMostSubCourses } from "../../../api/mostSubCoursesAPI";
import englishCourseImg from "../../../assets/images/english-course.jpg";

const CourseCard = ({ course, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="w-full max-w-[350px] mx-auto h-full"
    >
      <div
        className="group relative bg-gradient-to-br from-white/10 to-white/5 
                    backdrop-blur-sm rounded-xl p-0.5 
                    hover:shadow-xl hover:shadow-blue-500/20 
                    transition-all duration-300 flex flex-col"
      >
        <div className="relative overflow-hidden rounded-xl bg-[#1a1d2d] h-full flex flex-col">
          <div className="relative w-full">
            <img
              src={course.image || englishCourseImg}
              alt={course.title}
              className="w-full object-cover"
              style={{ aspectRatio: "4/3" }}
              onError={(e) => {
                e.target.src = englishCourseImg;
              }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t 
                         from-[#1a1d2d] via-[#1a1d2d]/50 to-transparent"
            />

            {index === 0 && (
              <div className="absolute top-3 left-3">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 
                             rounded-full bg-gradient-to-r from-amber-500 to-orange-600 
                             backdrop-blur-sm shadow-lg"
                >
                  <FaTrophy className="text-white text-base" />
                  <span className="text-white text-base font-semibold">
                    Most Popular
                  </span>
                </div>
              </div>
            )}

            <div
              className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600
                           px-3 py-1.5 rounded-tl-lg shadow-lg"
            >
              <span className="text-white font-bold text-base lg:text-lg">
                ${course.price}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-2.5 flex-grow flex flex-col">
            <div className="space-y-1.5 flex-grow">
              <h3
                className="text-base font-bold text-white leading-tight
                          group-hover:text-blue-400 transition-colors duration-300
                          line-clamp-1 lg:text-lg"
              >
                {course.title}
              </h3>

              <p
                className="text-white/70 text-base leading-relaxed
                          line-clamp-2 lg:text-lg"
              >
                {course.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-auto">
              <div
                className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm
                          hover:bg-white/15 transition-colors duration-300"
              >
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <FaClock className="text-blue-400 text-sm lg:text-base" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium lg:text-base">
                      Duration
                    </p>
                    <p className="text-white text-sm font-semibold lg:text-base">
                      {course.duration}h
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm
                          hover:bg-white/15 transition-colors duration-300"
              >
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 bg-purple-500/20 rounded-lg">
                    <FaGraduationCap className="text-purple-400 text-sm lg:text-base" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium lg:text-base">
                      Students
                    </p>
                    <p className="text-white text-sm font-semibold lg:text-base">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 
                           rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 
                           text-white text-base font-semibold
                           shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 
                           transform hover:scale-[1.02] transition-all duration-300 "
            >
              <FaWhatsapp className="text-base" />
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
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="relative py-12 bg-white">
      <div className="absolute inset-0">
        <motion.div
          className="absolute"
          style={{
            width: "6px",
            height: "6px",
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
            borderRadius: "4px",
          }}
          animate={{
            pathLength: 1,
            pathOffset: 0,
          }}
          initial={{
            top: 0,
            left: 0,
          }}
          transition={{
            duration: 4,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <motion.div
            animate={{
              x: ["0%", "100%", "100%", "0%", "0%"],
              y: ["0%", "0%", "100%", "100%", "0%"],
            }}
            transition={{
              duration: 8,
              ease: "linear",
              repeat: Infinity,
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          />
        </motion.div>
      </div>

      <div className="container mx-auto px-8 py-4 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full 
                     bg-white shadow-md border border-gray-100 mb-3"
          >
            <FaTrophy className="text-amber-500 text-lg" />
            <span
              className="bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text text-transparent font-semibold"
            >
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

        <div className="relative max-w-7xl mx-auto mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-2">
            {courses.slice(0, 3).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <CourseCard course={course} index={index} />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => navigate("/courses")}
            className="group relative inline-flex items-center gap-3 px-8 py-4 
                     overflow-hidden rounded-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />

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
