// components/User/Home/HeroCarousel.js
import React, { useState, useEffect } from 'react';
import homeImage from "../../../assets/images/homeImage.png";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      id: 1,
      
      title: "Transform Your Career with Barbish",
      subtitle: "Professional Development & Technical Training",
    },
    {
      id: 2,
     
      title: "Learn From Industry Experts",
      subtitle: "Gain practical skills for the modern workplace",
    },
    {
      id: 3,
      
      title: "Flexible Learning Solutions",
      subtitle: "Online and in-person courses tailored to your needs",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {carouselSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl pt-[80px] md:pt-[100px] lg:pt-0"> {/* Added padding top for mobile */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-sky mb-6 md:mb-8">
                  {slide.subtitle}
                </p>
                <button className="mt-4 px-6 py-2.5 md:px-8 md:py-3 bg-highlight text-white rounded-full 
                                 hover:bg-secondary transition-all duration-300 text-sm md:text-base
                                 hover:shadow-lg hover:shadow-highlight/20">
                  Explore Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
              currentSlide === index ? 'bg-highlight' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;