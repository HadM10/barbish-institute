import axios from "axios";
const API_URL = `${process.env.REACT_APP_API_URL}/mostSubCourses`;

export async function getMostSubCourses() {
  try {
    const response = await axios.get(API_URL);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch most subscribed courses",
    };
  }
}
