import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaUserGraduate, FaBookOpen, FaChalkboardTeacher, FaTrophy } from 'react-icons/fa';

const Testimonials = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    });
  }, [controls]);

  const stats = [
    {
      icon: FaUserGraduate,
      number: "1000+",
      label: "Students Enrolled",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: FaBookOpen,
      number: "50+",
      label: "Professional Courses",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaChalkboardTeacher,
      number: "30+",
      label: "Expert Instructors",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: FaTrophy,
      number: "95%",
      label: "Success Rate",
      color: "from-red-500 to-orange-500"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#0A0F2C]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                backgroundColor: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Our Impact in Numbers
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
            <p className="text-blue-200 text-xl">Transforming Education</p>
            <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"
                   style={{ background: `linear-gradient(to right, ${stat.color})` }} />
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8
                            border border-white/20 hover:border-white/40 transition-all duration-500
                            transform hover:-translate-y-2">
                <div className="flex flex-col items-center">
                  <stat.icon className="text-3xl text-blue-400 mb-4" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.3, type: "spring" }}
                    className="text-3xl font-bold text-white mb-2"
                  >
                    {stat.number}
                  </motion.div>
                  <p className="text-blue-200 text-base text-center">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Level Advancement Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-3xl mx-auto
                    border border-white/20 hover:border-white/40 transition-all duration-500"
        >
          <div className="flex flex-col items-center justify-between mb-8 sm:flex-row">
            <h3 className="text-xl font-bold text-white">Level Advancement</h3>
            <div className="flex items-center gap-4">
              <span className="text-blue-300">B1</span>
              <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <span className="text-blue-300">C1</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ delay: 1, duration: 1.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
            <p className="text-blue-200 text-center">
              85% of our students advance two levels within 6 months
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;