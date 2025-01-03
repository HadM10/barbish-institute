import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import CourseCard from './CourseCard';
import course from "../../../assets/images/course.png";

const featuredCourses = [
  {
    id: 1,
    title: "Full Stack Development",
    image: course,
    shortDescription: "Master modern web development with React and Node.js",
    duration: "12 weeks",
    instructor: "John Smith",
    price: "$499",
    fullDescription: "Comprehensive course covering front-end and back-end development, including modern frameworks and best practices."
  },
  {
    id: 2,
    title: "AutoCAD Mastery",
    image: course,
    shortDescription: "Professional AutoCAD training for engineers and architects",
    duration: "8 weeks",
    instructor: "Sarah Johnson",
    price: "$399",
    fullDescription: "Learn AutoCAD from basics to advanced techniques, including 2D and 3D modeling."
  },
  {
    id: 3,
    title: "Digital Marketing",
    image: course,
    shortDescription: "Complete digital marketing strategy and implementation",
    duration: "10 weeks",
    instructor: "Mike Wilson",
    price: "$449",
    fullDescription: "Master SEO, social media marketing, content strategy, and digital advertising."
  },
  {
    id: 4,
    title: "AI & Machine Learning",
    image: course,
    shortDescription: "Practical AI applications and machine learning basics",
    duration: "14 weeks",
    instructor: "Emma Davis",
    price: "$599",
    fullDescription: "Learn AI fundamentals, machine learning algorithms, and practical applications."
  },
];

const FeaturedCourses = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Featured Courses</h2>
          <button 
            onClick={() => navigate('/courses')} // Add onClick handler
            className="px-6 py-2 bg-highlight text-white rounded-lg hover:bg-secondary transition-all duration-300"
          >
            View All Courses
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;