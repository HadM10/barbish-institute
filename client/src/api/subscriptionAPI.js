// src/api/subscriptionAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Existing Subscription APIs
export async function getAllSubscriptions() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/subscription`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to fetch subscriptions' };
  }
}

export async function createSubscription(subData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/subscription`, subData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to create subscription' };
  }
}

export async function updateSubscription(subscriptionId, subData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/subscription/${subscriptionId}`, subData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to update subscription' };
  }
}

export async function deleteSubscription(subscriptionId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/subscription/${subscriptionId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to delete subscription' };
  }
}

