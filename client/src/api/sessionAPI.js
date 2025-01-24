// src/api/sessionAPI.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/session";

// Fetch all sessions
export const getAllSessions = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || error.message,
    };
  }
};

// Fetch a session by ID
export const getSessionById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || error.message,
    };
  }
};

// Create a new session
export const createSession = async (sessionData) => {
  try {
    // Send data directly as JSON
    const response = await axios.post(API_BASE_URL, {
      title: sessionData.title,
      description: sessionData.description,
      content: sessionData.content,
      duration: sessionData.duration,
      videoUrl: sessionData.videoUrl,
      courseId: sessionData.courseId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || error.message,
    };
  }
};

// Update a session by ID
export const updateSession = async (id, sessionData) => {
  try {
    console.log('Sending update request:', {
      id,
      sessionData
    });

    const response = await axios.put(`${API_BASE_URL}/${id}`, {
      title: sessionData.title,
      description: sessionData.description,
      content: sessionData.content,
      duration: sessionData.duration,
      videoUrl: sessionData.videoUrl,
      courseId: sessionData.courseId,
    });

    console.log('Update response:', response.data);

    if (response.data) {
      return { success: true, data: response.data };
    } else {
      console.error('No data in response');
      return {
        success: false,
        message: "No data received from server"
      };
    }
  } catch (error) {
    console.error('Update error:', error);
    return {
      success: false,
      message: error.response?.data?.error || error.message,
    };
  }
};

// Delete a session by ID
export const deleteSession = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || error.message,
    };
  }
};