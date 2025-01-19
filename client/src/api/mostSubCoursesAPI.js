import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export async function getMostSubCourses() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/mostSubCourses`);
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch most subscribed courses",
    };
  }
}