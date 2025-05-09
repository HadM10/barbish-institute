import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/boncards`;

// GET all bonCards
export async function getAllBonCards() {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch bonCards",
    };
  }
}

// CREATE a new bonCard
export async function createBonCard(bonCardData) {
  try {
    const formData = new FormData();

    // Add all fields to FormData
    Object.keys(bonCardData).forEach((key) => {
      if (key === "image" && bonCardData[key] instanceof File) {
        formData.append("image", bonCardData[key]);
      } else if (key !== "image") {
        formData.append(key, bonCardData[key]);
      }
    });

    const response = await axios.post(`${API_BASE_URL}`, formData);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to create bonCard",
    };
  }
}

// UPDATE a bonCard
export async function updateBonCard(bonCardId, bonCardData) {
  try {
    const formData = new FormData();

    // Add all fields to FormData
    Object.keys(bonCardData).forEach((key) => {
      if (key === "image" && bonCardData[key] instanceof File) {
        formData.append("image", bonCardData[key]);
      } else if (key !== "image") {
        formData.append(key, bonCardData[key]);
      }
    });

    const response = await axios.put(`${API_BASE_URL}/${bonCardId}`, formData);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to update bonCard",
    };
  }
}

// DELETE a bonCard
export async function deleteBonCard(bonCardId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${bonCardId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to delete bonCard",
    };
  }
}
