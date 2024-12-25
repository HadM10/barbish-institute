// components/User/Home/Statistics.js
import React from 'react';

const Statistics = () => {
  const stats = [
    { number: "1000+", label: "Students Enrolled" },
    { number: "50+", label: "Professional Courses" },
    { number: "30+", label: "Expert Instructors" },
    { number: "95%", label: "Success Rate" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white rounded-xl shadow-lg"
            >
              <h3 className="text-4xl font-bold text-highlight mb-2">{stat.number}</h3>
              <p className="text-primary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;