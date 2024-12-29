import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Tilt } from 'react-tilt';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGraduationCap, FaChartLine, FaCertificate, FaUserTie, 
         FaBriefcase, FaCode, FaLanguage, FaPalette, FaLightbulb,
         FaRocket, FaGlobe, FaUsers, FaAward, FaStar, FaCheck,
         FaLaptop, FaPencilAlt, FaBrain, FaHandshake, FaComments } from 'react-icons/fa';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const AboutServices = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const navigate = useNavigate();

  const marketingServices = [
    "Platforms & Ad Strategies",
    "Video Editing", 
    "Graphical Posts",
    "Engagement Services",
    "Security & IT Solutions", 
    "Content Creation",
    "Company Profiles",
    "News & Articles",
    "Business Consultation",
    "Photography & Videography",
    "Influencer Marketing",
    "Page Arrangement",
    "Logo Design",
    "Daily Stories & Stationary Design",
    "Packaging Design",
    "Customer Service Workshops"
  ];

  const trainingAreas = [
    { icon: <FaLanguage />, title: "Languages" },
    { icon: <FaCode />, title: "Programming" },
    { icon: <FaGraduationCap />, title: "Teaching & Training" },
    { icon: <FaChartLine />, title: "Accounting" },
    { icon: <FaBriefcase />, title: "Engineering" },
    { icon: <FaUserTie />, title: "Tutoring" },
    { icon: <FaBrain />, title: "Medical Courses" },
    { icon: <FaPalette />, title: "Art & Design" }
  ];

  const excellence = [
    { icon: <FaUsers />, title: "Personalized Learning", desc: "Tailored educational experiences" },
    { icon: <FaCertificate />, title: "Accredited Certificates", desc: "Recognized certifications" },
    { icon: <FaBriefcase />, title: "Internship Opportunities", desc: "Hands-on experience" },
    { icon: <FaGraduationCap />, title: "Qualified Instructors", desc: "Expert professionals" }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        scrollTrigger: {
          trigger: ".fade-up",
          start: "top center+=100",
          toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100">
      <main ref={containerRef} className="relative overflow-hidden pt-24">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#1a1f35] to-[#0B1120]">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full mix-blend-screen filter blur-[100px]"
                style={{
                  background: `radial-gradient(circle, ${
                    i === 0 ? '#ff4d4d' : i === 1 ? '#4d7fff' : i === 2 ? '#4dff77' : '#9f4dff'
                  } 0%, transparent 70%)`,
                  width: '600px',
                  height: '600px',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  delay: i * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            style={{ y }}
            className="max-w-7xl mx-auto text-center relative z-10"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 
                       bg-gradient-to-r from-rose-500 via-cyan-500 to-violet-500 
                       text-transparent bg-clip-text animate-gradient"
            >
              About Our Institution
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto 
                       mb-12 leading-relaxed"
            >
              The Barbish Institution is a privately owned, non-denominational educational 
              establishment catering to students of diverse ages, educational backgrounds, 
              and orientations. We offer two learning modes—self-paced learning and live 
              sessions—designed to provide flexibility and convenience for our students.
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={() => navigate('/courses')}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-violet-500 
                       rounded-full text-white text-xl font-semibold
                       hover:shadow-lg hover:shadow-rose-500/30 
                       transition-all duration-300 transform hover:scale-105"
            >
              Explore Our Programs
            </motion.button>
          </motion.div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Tilt className="transform-gpu">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 
                           border border-white/10 hover:border-white/20 
                           transition-all duration-300 group h-full"
                >
                  <div className="text-4xl text-rose-500 mb-6 group-hover:scale-110 
                               transform transition-all duration-300">
                    <FaLightbulb />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-white">Our Mission</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We aim to provide students with the resources and opportunities necessary 
                    to excel in their academic pursuits and future careers.
                  </p>
                </motion.div>
              </Tilt>

              <Tilt className="transform-gpu">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 
                           border border-white/10 hover:border-white/20 
                           transition-all duration-300 group h-full"
                >
                  <div className="text-4xl text-violet-500 mb-6 group-hover:scale-110 
                               transform transition-all duration-300">
                    <FaRocket />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-white">Our Vision</h2>
                  <p className="text-gray-300 leading-relaxed">
                    To be recognized as one of the leading local and international institutions 
                    in teaching and training, delivering excellence in education and skill 
                    development.
                  </p>
                </motion.div>
              </Tilt>
            </div>
          </div>
        </section>

        {/* Excellence Section */}
        <section className="py-20 relative px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-center mb-16 text-white"
            >
              Our Excellence
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {excellence.map((item, index) => (
                <Tilt key={index} className="transform-gpu">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 
                             border border-white/10 hover:border-white/20 
                             transition-all duration-300 group h-full"
                  >
                    <div className="text-3xl text-cyan-500 mb-4 group-hover:scale-110 
                                 transform transition-all duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-center mb-16 text-white"
            >
              Our Services
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 
                         border border-white/10 group"
              >
                <h3 className="text-3xl font-bold text-white mb-6">Teaching & Training</h3>
                <p className="text-gray-300 mb-6">
                  We identify gaps in knowledge, skills, and competencies to develop targeted 
                  training programs that enhance employee performance.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {trainingAreas.map((area, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <span className="text-rose-500">{area.icon}</span>
                      {area.title}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 
                         border border-white/10 group"
              >
                <h3 className="text-3xl font-bold text-white mb-6">Marketing Services</h3>
                <div className="grid grid-cols-2 gap-4">
                  {marketingServices.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <FaCheck className="text-violet-500 flex-shrink-0" />
                      {service}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Programs & Certificates */}
        <section className="py-20 relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 
                             border border-white/10 group">
                  <div className="text-3xl text-cyan-500 mb-4 group-hover:scale-110 
                               transform transition-all duration-300">
                    <FaGraduationCap />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Our Programs</h3>
                  <p className="text-gray-300">
                    We offer enriching programs led by seasoned professionals and subject 
                    matter experts, ensuring high-quality education and training for all 
                    participants.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 
                             border border-white/10 group">
                  <div className="text-3xl text-rose-500 mb-4 group-hover:scale-110 
                               transform transition-all duration-300">
                    <FaCertificate />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Accredited Certificates
                  </h3>
                  <p className="text-gray-300">
                    Our accredited certificates signify successful completion of rigorous 
                    training programs, providing formal recognition from reputable 
                    accreditation bodies.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 
                             border border-white/10 group">
                  <div className="text-3xl text-violet-500 mb-4 group-hover:scale-110 
                               transform transition-all duration-300">
                    <FaBriefcase />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Internships</h3>
                  <p className="text-gray-300">
                    The Barbish Institution provides practical, hands-on internship 
                    opportunities to complement academic learning and prepare students for 
                    the workforce.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 
                             border border-white/10 group">
                  <div className="text-3xl text-cyan-500 mb-4 group-hover:scale-110 
                               transform transition-all duration-300">
                    <FaUserTie />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    High-Quality Instructors
                  </h3>
                  <p className="text-gray-300">
                    Our instructors are highly qualified professionals with extensive 
                    expertise in their respective fields, ensuring exceptional standards 
                    in teaching and training.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partners & Reviews */}
        <section className="py-20 relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Tilt className="transform-gpu">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 
                           border border-white/10 hover:border-white/20 
                           transition-all duration-300 group h-full"
                >
                  <div className="text-4xl text-rose-500 mb-6 group-hover:scale-110 
                               transform transition-all duration-300">
                    <FaHandshake />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Our Partners</h3>
                  <p className="text-gray-300">
                    We collaborate with reputable organizations and institutions to deliver 
                    exceptional education and services.
                  </p>
                </motion.div>
              </Tilt>

              <Tilt className="transform-gpu">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 
                           border border-white/10 hover:border-white/20 
                           transition-all duration-300 group h-full"
                >
                  <div className="text-4xl text-violet-500 mb-6 group-hover:scale-110 
                               transform transition-all duration-300">
                    <FaComments />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Review & Feedback</h3>
                  <p className="text-gray-300">
                    We deeply value the reviews and feedback from our stakeholders. Your 
                    insights help us continuously improve to meet your evolving needs.
                  </p>
                </motion.div>
              </Tilt>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutServices;