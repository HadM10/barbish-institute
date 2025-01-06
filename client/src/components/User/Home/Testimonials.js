import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: "Hadi Makki",
    feedback: "This institution has transformed my career. The courses are top-notch and the instructors are very knowledgeable.",
    role: "Software Engineer"
  },
  {
    name: "Lara Fayad",
    feedback: "I love the flexibility and the quality of the courses offered. Highly recommend to anyone looking to upskill.",
    role: "Project Manager"
  },
  {
    name: "Sam AL-Haj",
    feedback: "The learning experience here is unparalleled. The support from the staff is amazing.",
    role: "Data Analyst"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900
                     tracking-tight leading-tight mb-4"
          >
            What Our Students Say
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <p className="text-gray-700 text-base">
              Hear from our students about their learning experiences.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg flex flex-col justify-between"
            >
              <div>
                <FaQuoteLeft className="text-blue-500 text-3xl mb-4" />
                <p className="text-gray-800 text-lg mb-4">{testimonial.feedback}</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 font-semibold text-center">{testimonial.name}</p>
                <p className="text-gray-500 text-sm text-center">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;