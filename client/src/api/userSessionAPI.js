import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const markSessionAsWatched = async (sessionId) => {
  try {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();

    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(
      `${API_URL}/api/user-sessions/mark-watched`,
      { userId, sessionId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Mark as watched API error:', error);
    throw error;
  }
};

export const getSessionProgress = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();

    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(
      `${API_URL}/api/user-sessions/progress/${userId}/${courseId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Get progress API error:', error);
    throw error;
  }
}; 