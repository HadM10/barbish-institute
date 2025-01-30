import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/dashboard`;

export const getStats = async () => {
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
};
