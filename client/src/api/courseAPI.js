// src/api/courseAPI.js
import axios from 'axios';

// Point this to your backend's URL and port.
const API_BASE_URL = 'http://localhost:5000';

// GET all courses (GET /api/course)
export async function getAllCourses() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/course`);
    // The controller returns an array of courses directly, e.g. [ { id, title, ... }, ... ]
    // So 'response.data' should be that array.
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch courses',
    };
  }
}

// CREATE a new course (POST /api/course)
export async function createCourse(courseData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/course`, courseData);
    // The controller returns the newly created course object, e.g. { id, title, image, ... }
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to create course',
    };
  }
}

// UPDATE a course by ID (PUT /api/course/:id)
export async function updateCourse(courseId, courseData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/course/${courseId}`, courseData);
    // The controller returns the updated course object
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to update course',
    };
  }
}

// DELETE a course by ID (DELETE /api/course/:id)
export async function deleteCourse(courseId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/course/${courseId}`);
    // The controller returns { message: "Course deleted successfully" }
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to delete course',
    };
  }
}
