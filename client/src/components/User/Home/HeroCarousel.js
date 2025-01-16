// components/User/Home/HeroCarousel.js
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import homeImage from "../../../assets/images/homeImage.png";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const carouselSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070",
      title: "Transform Your Career with Barbish",
      subtitle: "Professional Development & Technical Training",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070",
      title: "Learn From Industry Experts",
      subtitle: "Gain practical skills for the modern workplace",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070",
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  return (
    <section className="relative min-h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {carouselSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 transform
            ${currentSlide === index ? 'opacity-100 translate-x-0' : 
              currentSlide < index ? 'opacity-0 translate-x-full' : 'opacity-0 -translate-x-full'}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl pt-[80px] md:pt-[100px] lg:pt-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-sky mb-6 md:mb-8">
                  {slide.subtitle}
                </p>
                <button 
                  onClick={() => navigate('/courses')}
                  className="mt-4 px-6 py-2.5 md:px-8 md:py-3 bg-highlight text-white rounded-full 
                           hover:bg-secondary transition-all duration-300 text-sm md:text-base
                           hover:shadow-lg hover:shadow-highlight/20"
                >
                  Explore Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                 bg-black/30 text-white hover:bg-black/50 transition-all
                 opacity-0 group-hover:opacity-100 z-10"
      >
        <FaChevronLeft className="text-xl" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                 bg-black/30 text-white hover:bg-black/50 transition-all
                 opacity-0 group-hover:opacity-100 z-10"
      >
        <FaChevronRight className="text-xl" />
      </button>
      
      {/* Dots Navigation */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-300 
              ${currentSlide === index ? 'bg-highlight' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;