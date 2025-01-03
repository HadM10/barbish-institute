import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from './CourseCard';
import axios from 'axios';

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/course/most-subscribed');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Featured Courses</h2>
          <button 
            onClick={() => navigate('/courses')}
            className="px-6 py-2 bg-highlight text-white rounded-lg hover:bg-secondary transition-all duration-300"
          >
            View All Courses
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;