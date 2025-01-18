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
    const formData = new FormData();
    Object.keys(sessionData).forEach((key) => {
      if (key === "video" && sessionData[key] instanceof File) {
        formData.append("video", sessionData[key]);
      } else if (key !== "video") {
        formData.append(key, sessionData[key]);
      }
    });

    const response = await axios.post(API_BASE_URL, formData);
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
    const formData = new FormData();
    Object.keys(sessionData).forEach((key) => {
      if (key === "video" && sessionData[key] instanceof File) {
        formData.append("video", sessionData[key]);
      } else if (key !== "video") {
        formData.append(key, sessionData[key]);
      }
    });

    const response = await axios.put(`${API_BASE_URL}/${id}`, formData);
    return { success: true, data: response.data };
  } catch (error) {
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