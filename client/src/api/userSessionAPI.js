import axios from 'axios';

const API_URL = "http://localhost:5000/api";

export const updateSessionProgress = async (sessionId, progress) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/user-sessions/${sessionId}/progress`,
      {
        completed: progress.completed,
        watchTime: progress.watchTime || 0
      },
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.status === 'success') {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update progress');
    }
  } catch (error) {
    console.error('Error updating session progress:', error);
    throw error;
  }
};

export const getSessionProgress = async (sessionId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/user-sessions/${sessionId}/progress`,
      {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting session progress:', error);
    throw error;
  }
};

export const bulkUpdateProgress = async (sessionIds) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found');
      return { status: 'success', data: [] };
    }

    if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
      console.log('Invalid or empty sessionIds:', sessionIds);
      return { status: 'success', data: [] };
    }

    // Filter out any invalid IDs
    const validSessionIds = sessionIds.filter(id => 
      id && !isNaN(parseInt(id))
    );

    if (validSessionIds.length === 0) {
      console.log('No valid session IDs after filtering');
      return { status: 'success', data: [] };
    }

    console.log('Requesting progress for sessions:', validSessionIds);

    const response = await axios.get(
      `${API_URL}/user-sessions/progress`,
      {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        params: {
          sessionIds: validSessionIds.join(',')
        }
      }
    );

    console.log('Progress response:', response.data);

    if (!response.data || !Array.isArray(response.data.data)) {
      console.warn('Invalid progress data received:', response.data);
      return { status: 'success', data: [] };
    }

    return response.data;
  } catch (error) {
    console.error('Error getting bulk progress:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return { status: 'success', data: [] };
  }
}; 