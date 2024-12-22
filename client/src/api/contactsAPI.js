// src/api/contactAPI.js
import axios from 'axios';

// If your backend is running on http://localhost:5000
// and your Express route is app.use("/api/contact", contactRoutes),
// the endpoints are:
//   GET /api/contact
//   POST /api/contact
//   PATCH /api/contact/:id
//
// The DB model has only { id, name, email, message, status (boolean) }.

const API_BASE_URL = 'http://localhost:5000';

export async function getAllContacts() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/contact`);
    // The controller returns { success: true, data: contacts }
    // So response.data looks like { success: true, data: [...] }
    return response.data; // e.g. { success: true, data: [ ...contact objects... ] }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch contacts',
    };
  }
}

export async function createContact(contactData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/contact`, contactData);
    // The controller returns { success: true, data: contact, ... }
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to create contact',
    };
  }
}

/**
 * Update the "status" field (boolean) via PATCH /api/contact/:id
 * Example: await updateContactStatus(contactId, true);
 */
export async function updateContactStatus(contactId, status) {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/contact/${contactId}`, {
      status,
    });
    // The controller returns { success: true, message: "...", ... }
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to update contact status',
    };
  }
}
