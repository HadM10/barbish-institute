import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaUser,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaHeadset,
} from "react-icons/fa";
import { createContact } from "../../api/contactsAPI";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        status: false,
      });

      if (response.success) {
        setShowSuccess(true);
        setFormData({
          name: "",
          email: "",
          message: "",
        });

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = `
    @keyframes slideIn {
      0% {
        transform: translateY(-100%);
        opacity: 0;
      }
      50% {
        transform: translateY(-50%);
        opacity: 0.5;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }

    .animate-fadeIn {
      animation: fadeIn 2s ease-in-out;
    }
  `;

  return (
    <div className="relative flex flex-col min-h-screen">
      <style>{styles}</style>
      <main className="flex-1 relative">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 z-0">
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="relative z-10 pt-48">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 md:mb-16"
            >
              <div
                className="inline-block p-1.5 md:p-2 px-4 md:px-6 rounded-full bg-blue-500/10 text-blue-300 mb-4 md:mb-6
                            border border-blue-500/20 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <FaHeadset className="text-base md:text-lg" />
                  <span className="text-sm md:text-base">
                    24/7 Support Available
                  </span>
                </div>
              </div>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-8 
                            bg-gradient-to-r from-white via-blue-100 to-indigo-200 
                            text-transparent bg-clip-text"
              >
                Get in Touch
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
                Have questions about our services? We're here to help! Reach out
                to us and we'll get back to you as soon as possible.
              </p>
            </motion.div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-8"
              >
                <div
                  className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10
                              hover:border-white/20 transition-all duration-300 shadow-xl shadow-black/5 flex-1"
                >
                  <h2
                    className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 
                                bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                  >
                    Ways to Connect
                  </h2>

                  <div className="space-y-8">
                    {[
                      {
                        icon: <FaMapMarkerAlt className="text-2xl" />,
                        title: "Visit Our Campus",
                        content: "Sarafand, main road",
                        color: "from-blue-400 to-blue-600",
                      },
                      {
                        icon: <FaEnvelope className="text-2xl" />,
                        title: "Email Us",
                        content: "info@barbish-institution.com",
                        color: "from-indigo-400 to-indigo-600",
                      },
                      {
                        icon: <FaWhatsapp className="text-2xl" />,
                        title: "WhatsApp Support",
                        content: "+96171020724",
                        color: "from-green-400 to-green-600",
                      },
                      {
                        icon: <FaClock className="text-2xl" />,
                        title: "Business Hours",
                        content: "Monday - Friday, 9:00 AM - 6:00 PM",
                        color: "from-purple-400 to-purple-600",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4 group"
                      >
                        <div
                          className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} 
                                      transform transition-all duration-300 group-hover:scale-110 
                                      shadow-lg`}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg font-semibold text-white mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm md:text-base text-blue-100/70">
                            {item.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div
                  className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10
                              shadow-xl shadow-black/5"
                >
                  <h3
                    className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 
                                bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                  >
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {[
                      "How can I enroll in a course?",
                      "What payment methods do you accept?",
                      "Do you offer student discounts?",
                      "Can I get a course completion certificate?",
                    ].map((question, index) => (
                      <div key={index} className="group cursor-pointer">
                        <p
                          className="text-sm md:text-base text-blue-100/70 hover:text-white 
                                      transition-colors duration-300 flex items-center"
                        >
                          <span className="mr-2 text-blue-400">•</span>
                          {question}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10
                         shadow-xl shadow-black/5 h-full relative"
              >
                <h2
                  className="text-xl md:text-2xl font-bold mb-6 md:mb-8 
                              bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                >
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6 relative">
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/95 to-indigo-600/95 
                                 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center justify-center
                                 text-white z-[9999]"
                    >
                      <div className="text-6xl mb-6">✨</div>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                        Notification
                      </h3>
                      <div className="text-lg md:text-xl font-semibold mb-2">
                        Message Sent Successfully!
                      </div>
                      <p className="text-sm md:text-base text-center text-white/90 mb-4 md:mb-6">
                        Thank you for contacting us. <br />
                        Our team will get back to you soon.
                      </p>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
                      >
                        <FaPaperPlane className="text-2xl" />
                      </motion.div>
                    </motion.div>
                  )}

                  {[
                    {
                      label: "Full Name",
                      icon: FaUser,
                      type: "text",
                      name: "name",
                      placeholder: "Mahdi Assi",
                    },
                    {
                      label: "Email Address",
                      icon: FaEnvelope,
                      type: "email",
                      name: "email",
                      placeholder: "mahdi@example.com",
                    },
                  ].map((field, index) => (
                    <div key={index} className="group">
                      <label className="text-sm md:text-base text-blue-100/90 mb-1.5 md:mb-2 block">
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required
                          className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 
                                    text-sm md:text-base text-white placeholder-blue-200/50 focus:outline-none 
                                    focus:border-blue-400/50 transition-all duration-300
                                    group-hover:border-blue-400/30"
                          placeholder={field.placeholder}
                        />
                        <field.icon
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200/30 
                                             group-hover:text-blue-400/50 transition-colors duration-300"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="group">
                    <label className="text-sm md:text-base text-blue-100/90 mb-1.5 md:mb-2 block">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 
                                text-sm md:text-base text-white placeholder-blue-200/50 focus:outline-none 
                                focus:border-blue-400/50 transition-all duration-300
                                group-hover:border-blue-400/30 resize-none"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                              text-white font-semibold text-base md:text-lg
                              hover:shadow-lg hover:shadow-blue-500/30 
                              transition-all duration-300
                              disabled:opacity-50 disabled:cursor-not-allowed
                              flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div
                        className="w-6 h-6 border-2 border-white/20 border-t-white 
                                    rounded-full animate-spin"
                      />
                    ) : (
                      <>
                        <FaPaperPlane className="animate-bounce" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
