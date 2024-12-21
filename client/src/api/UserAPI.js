import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/users';

class UserAPI {
  static async getAllUsers() {
    try {
      const response = await axios.get(API_URL);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get users error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users'
      };
    }
  }

  static async getUserById(id) {
    try {
      if (!id) throw new Error('User ID is required');
      const response = await axios.get(`${API_URL}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user'
      };
    }
  }

  static async createUser(userData) {
    try {
      const response = await axios.post(API_URL, userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Create user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create user'
      };
    }
  }

  static async updateUser(id, userData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user'
      };
    }
  }

  static async deleteUser(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user'
      };
    }
  }
}

export default UserAPI;