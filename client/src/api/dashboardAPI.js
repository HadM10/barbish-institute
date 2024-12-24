import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard"; // Adjust URL as needed

class DashboardAPI {
  // Fetch all dashboard stats
  static async getStats() {
    try {
      const response = await axios.get(API_URL);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch stats",
      };
    }
  }
}

export default DashboardAPI;
