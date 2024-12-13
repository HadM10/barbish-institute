import axios from 'axios';

// Base URL of your backend
const API_URL = 'http://localhost:5000/api/auth';

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    throw new Error(errorMessage);
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

// Approve user function
export const approveUser = async (userId, token) => {
  try {
    const response = await axios.put(`${API_URL}/approve/${userId}`, null, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};

// Function to get unapproved admins
export const getUnapprovedAdmins = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/unapproved-admins`, {
      headers: { 'x-auth-token': token },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch unapproved admins';
    throw new Error(errorMessage);
  }
};

export const blockUser = async (userId, token) => {
  try {
    const response = await axios.put(`${API_URL}/block/${userId}`, null, {
      headers: { 'x-auth-token': token },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Block failed';
    throw new Error(errorMessage);
  }
};

export const getAllAdmins = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admins`, {
      headers: { 'x-auth-token': token },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch admins';
    throw new Error(errorMessage);
  }
};

// Function to request a password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to request password reset';
    throw new Error(errorMessage);
  }
};

// Function to reset the password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to reset password';
    throw new Error(errorMessage);
  }
};