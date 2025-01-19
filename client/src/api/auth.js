import axios from "axios";

// Base URL of your backend
const API_URL = "http://localhost:5000/api/auth";

export const login = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData); // No need to append /login
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
  }
};
