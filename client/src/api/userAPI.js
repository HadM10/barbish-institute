// client/src/api/UserAPI.js
import axios from "axios";
const API_URL = `${process.env.REACT_APP_API_URL}`;

function toFrontendUser(user) {
  return {
    ...user,
    status: user.isActive ? "active" : "inactive",
  };
}

function toBackendPayload(userData) {
  return {
    ...userData,
    isActive: userData.status === "active",
  };
}

export async function getAllUsers() {
  try {
    const response = await axios.get(`${API_URL}/users`);
    const transformedUsers = response.data.map((u) => toFrontendUser(u));
    return { success: true, data: transformedUsers };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function createUser(formData) {
  try {
    const backendPayload = toBackendPayload(formData);
    const response = await axios.post(`${API_URL}/users`, backendPayload);
    const createdUser = toFrontendUser(response.data);
    return { success: true, data: createdUser };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateUser(userId, formData) {
  try {
    const backendPayload = toBackendPayload(formData);
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      backendPayload
    );
    const updatedUser = toFrontendUser(response.data);
    return { success: true, data: updatedUser };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function deleteUser(userId) {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export const getUserSubscribedCourses = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/auth/my-courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subscribed courses:", error);
    throw error;
  }
};
