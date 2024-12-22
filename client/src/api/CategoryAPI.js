// client/src/api/CategoryAPI.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/categories';

class CategoryAPI {
  static async getAllCategories() {
    try {
      const response = await axios.get(API_URL);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch categories'
      };
    }
  }

  static async createCategory(categoryData) {
    try {
      const response = await axios.post(API_URL, categoryData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create category'
      };
    }
  }

  static async updateCategory(id, categoryData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, categoryData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update category'
      };
    }
  }

  static async deleteCategory(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete category'
      };
    }
  }
}

export default CategoryAPI;