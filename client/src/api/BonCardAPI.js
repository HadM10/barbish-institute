import axios from "axios";

// If your backend runs on http://localhost:5000:
const API_BASE_URL = "http://localhost:5000";

// GET all bonCards
export async function getAllBonCards() {
  try {
    // /api/boncards is defined in your route file
    const response = await axios.get(`${API_BASE_URL}/api/boncards`);
    // The controller returns { success: true, data: [...] }
    return response.data; // { success: true, data: [...] }
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch bonCards"
    };
  }
}

// CREATE a new bonCard
export async function createBonCard(bonCardData) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/boncards`,
      bonCardData
    );
    // The controller returns { success: true, data: newBonCard, ... }
    return response.data; // e.g. { success: true, data: {...} }
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to create bonCard"
    };
  }
}

// UPDATE a bonCard by ID
export async function updateBonCard(bonCardId, bonCardData) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/boncards/${bonCardId}`,
      bonCardData
    );
    // The controller returns { success: true, data: updatedBonCard, ... }
    return response.data; 
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to update bonCard"
    };
  }
}

// DELETE a bonCard by ID
export async function deleteBonCard(bonCardId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/boncards/${bonCardId}`
    );
    // The controller returns { success: true, message: "BonCard deleted successfully." }
    return response.data; 
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to delete bonCard"
    };
  }
}
