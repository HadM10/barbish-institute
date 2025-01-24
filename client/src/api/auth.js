import axios from "axios";

// Base URL of your backend
const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

// Configure axios with auth token interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.code === "ACCOUNT_DEACTIVATED") {
      // Dispatch a custom event that AuthContext will listen for
      window.dispatchEvent(new CustomEvent("userDeactivated"));
    }
    return Promise.reject(error);
  }
);

export const login = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData); // No need to append /login
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
  }
};

export const checkUserStatus = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
