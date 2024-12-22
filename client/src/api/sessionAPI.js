// src/api/sessionAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/sessions';

// Fetch all sessions
export const getAllSessions = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

// Fetch a session by ID
export const getSessionById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

// Create a new session
export const createSession = async (sessionData) => {
  try {
    const response = await axios.post(API_BASE_URL, sessionData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

// Update a session by ID
export const updateSession = async (id, sessionData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, sessionData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

// Delete a session by ID
export const deleteSession = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};
