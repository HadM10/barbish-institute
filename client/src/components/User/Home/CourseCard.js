// components/User/Home/CourseCard.js
import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const CourseCard = ({ course }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <div className="aspect-square w-full relative">
          <img
            src={course.image}
            alt={course.title}
            className="absolute w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-primary mb-2">{course.title}</h3>
          <p className="text-text/80 mb-4">{course.shortDescription}</p>
          <button
            className="w-full bg-highlight text-white py-2 rounded-lg hover:bg-secondary transition-all duration-300 flex items-center justify-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <FaWhatsapp />
            <span>Enquire Now</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div 
          className="fixed inset-0 bg-primary/80 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <div 
            className="bg-white rounded-xl overflow-hidden max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-[400px] relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">{course.title}</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <h4 className="font-semibold text-accent">Duration</h4>
                  <p>{course.duration}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-accent">Instructor</h4>
                  <p>{course.instructor}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-accent">Price</h4>
                  <p>{course.price}</p>
                </div>
              </div>

              <p className="text-text mb-6">{course.fullDescription}</p>

              <div className="flex justify-between items-center">
                <button
                  className="bg-highlight text-white px-8 py-3 rounded-lg hover:bg-secondary transition-all duration-300 flex items-center gap-2"
                >
                  <FaWhatsapp />
                  <span>Enquire Now</span>
                </button>
                
                <button
                  onClick={handleClose}
                  className="text-highlight hover:text-secondary px-4 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;