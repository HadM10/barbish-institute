// components/User/Home/WhyChooseUs.js
import React from 'react';
import { 
  FaGraduationCap,
  FaLaptopCode,
  FaHandshake,
  FaGlobe 
} from 'react-icons/fa';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaGraduationCap className="text-5xl text-highlight mb-4" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of experience"
    },
    {
      icon: <FaLaptopCode className="text-5xl text-highlight mb-4" />,
      title: "Hands-on Training",
      description: "Practical experience with real-world projects"
    },
    {
      icon: <FaHandshake className="text-5xl text-highlight mb-4" />,
      title: "Career Support",
      description: "Dedicated career guidance and placement assistance"
    },
    {
      icon: <FaGlobe className="text-5xl text-highlight mb-4" />,
      title: "Global Recognition",
      description: "Internationally recognized certifications and programs"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary via-accent to-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Why Choose Barbish Institution?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center transform hover:scale-105 transition-all duration-300"
            >
              {item.icon}
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sky">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;