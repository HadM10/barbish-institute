import axios from 'axios';

// Point this to wherever your server actually runs.
// If your backend is listening on port 5000, keep it as is.
// If it's on a different port, update accordingly.
const API_BASE_URL = 'http://localhost:5000';

/**
 * Helper: Convert the API's user object { isActive: bool }
 *         into a front-end user object { status: 'active'|'inactive' }
 */
function toFrontendUser(user) {
  return {
    ...user,
    // Convert boolean isActive -> string 'active' or 'inactive'
    status: user.isActive ? 'active' : 'inactive',
  };
}

/**
 * Helper: Convert the front-end user data { status: 'active'|'inactive' }
 *         into the object the API (Sequelize) expects { isActive: bool }
 */
function toBackendPayload(userData) {
  return {
    ...userData,
    // Convert 'active'/'inactive' -> boolean true/false
    isActive: userData.status === 'active',
  };
}

// GET all users
export async function getAllUsers() {
  try {
    // Your route is GET /api/users (based on your route + app.use('/api/users', ...))
    const response = await axios.get(`${API_BASE_URL}/api/users`);
    // response.data should be an array of raw user objects with isActive, etc.
    const transformedUsers = response.data.map((u) => toFrontendUser(u));
    return { success: true, data: transformedUsers };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// POST (create) a new user
export async function createUser(formData) {
  try {
    // Convert { status: 'active'|'inactive' } -> { isActive: bool }
    const backendPayload = toBackendPayload(formData);

    const response = await axios.post(
      `${API_BASE_URL}/api/users`,
      backendPayload
    );

    // Server returns newly created user (with isActive, etc.)
    // Transform it so front-end sees { status: 'active'|'inactive' }
    const createdUser = toFrontendUser(response.data);

    return { success: true, data: createdUser };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// PUT (update) a user by ID
export async function updateUser(userId, formData) {
  try {
    // Convert { status: 'active'|'inactive' } -> { isActive: bool }
    const backendPayload = toBackendPayload(formData);

    const response = await axios.put(
      `${API_BASE_URL}/api/users/${userId}`,
      backendPayload
    );

    // Transform response back to front-end shape
    const updatedUser = toFrontendUser(response.data);

    return { success: true, data: updatedUser };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// DELETE a user by ID
export async function deleteUser(userId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/users/${userId}`);
    // The controller returns { message: "User deleted successfully" } etc.
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
