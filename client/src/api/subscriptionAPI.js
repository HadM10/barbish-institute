// src/api/subscriptionAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Existing Subscription APIs
export async function getAllSubscriptions() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/subscriptions`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to fetch subscriptions' };
  }
}

export async function createSubscription(subData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/subscriptions`, subData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to create subscription' };
  }
}

export async function updateSubscription(subscriptionId, subData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/subscriptions/${subscriptionId}`, subData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to update subscription' };
  }
}

export async function deleteSubscription(subscriptionId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/subscriptions/${subscriptionId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to delete subscription' };
  }
}

// New APIs to fetch users and courses
export async function getAllUsers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to fetch users' };
  }
}

export async function getAllCourses() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/course`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to fetch courses' };
  }
}
