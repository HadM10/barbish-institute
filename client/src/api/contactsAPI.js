// src/api/contactAPI.js
import axios from "axios";

// If your backend is running on http://localhost:5000
// and your Express route is app.use("/api/contact", contactRoutes),
// the endpoints are:
//   GET /api/contact
//   POST /api/contact
//   PATCH /api/contact/:id
//
// The DB model has only { id, name, email, message, status (boolean) }.

const API_URL = `${process.env.REACT_APP_API_URL}/contact`;

export async function getAllContacts() {
  try {
    const response = await axios.get(API_URL);
    // The controller returns { success: true, data: contacts }
    // So response.data looks like { success: true, data: [...] }
    return response.data; // e.g. { success: true, data: [ ...contact objects... ] }
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch contacts",
    };
  }
}

export async function createContact(contactData) {
  try {
    const response = await axios.post(API_URL, contactData);
    // The controller returns { success: true, data: contact, ... }
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to create contact",
    };
  }
}

export const deleteContact = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Update the "status" field (boolean) via PATCH /api/contact/:id
 * Example: await updateContactStatus(contactId, true);
 */
export async function updateContactStatus(contactId, status) {
  try {
    const response = await axios.patch(`${API_URL}/${contactId}`, {
      status,
    });
    // The controller returns { success: true, message: "...", ... }
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to update contact status",
    };
  }
}
