// src/api/subscriptionAPI.js
import axios from "axios";
const API_URL = `${process.env.REACT_APP_API_URL}/subscription`;

// Existing Subscription APIs
export async function getAllSubscriptions() {
  try {
    const response = await axios.get(API_URL);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch subscriptions",
    };
  }
}

export async function createSubscription(subData) {
  try {
    const response = await axios.post(API_URL, subData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to create subscription",
    };
  }
}

export async function updateSubscription(subscriptionId, subData) {
  try {
    const response = await axios.put(`${API_URL}/${subscriptionId}`, subData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to update subscription",
    };
  }
}

export async function deleteSubscription(subscriptionId) {
  try {
    const response = await axios.delete(`${API_URL}/${subscriptionId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to delete subscription",
    };
  }
}
