// client/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const categoryAPI = {
  getAllCategories: () => axios.get(`${API_URL}/categories`),
  createCategory: (data) => axios.post(`${API_URL}/categories`, data),
  updateCategory: (id, data) => axios.put(`${API_URL}/categories/${id}`, data),
  deleteCategory: (id) => axios.delete(`${API_URL}/categories/${id}`)
};

export default categoryAPI;