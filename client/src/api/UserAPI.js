// client/src/api/UserAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

function toFrontendUser(user) {
  return {
    ...user,
    status: user.isActive ? 'active' : 'inactive',
  };
}

function toBackendPayload(userData) {
  return {
    ...userData,
    isActive: userData.status === 'active',
  };
}

export async function getAllUsers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users`);
    const transformedUsers = response.data.map((u) => toFrontendUser(u));
    return { success: true, data: transformedUsers };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function createUser(formData) {
  try {
    const backendPayload = toBackendPayload(formData);
    const response = await axios.post(`${API_BASE_URL}/api/users`, backendPayload);
    const createdUser = toFrontendUser(response.data);
    return { success: true, data: createdUser };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateUser(userId, formData) {
  try {
    const backendPayload = toBackendPayload(formData);
    const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, backendPayload);
    const updatedUser = toFrontendUser(response.data);
    return { success: true, data: updatedUser };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function deleteUser(userId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/users/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}