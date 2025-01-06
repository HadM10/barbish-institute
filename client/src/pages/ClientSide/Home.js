import React from 'react';
import Navbar from '../../components/User/Home/Navbar';
import HeroCarousel from '../../components/User/Home/HeroCarousel';
import FeaturedCourses from '../../components/User/Home/FeaturedCourses';
import WhyChooseUs from '../../components/User/Home/WhyChooseUs';
import Statistics from '../../components/User/Home/Statistics';
import Testimonials from '../../components/User/Home/Testimonials';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="pt-[80px]">
        <HeroCarousel />
        <FeaturedCourses />
        <WhyChooseUs />
        <Statistics />
        <Testimonials />
      </div>
    </div>
  );
};

export default HomePage;