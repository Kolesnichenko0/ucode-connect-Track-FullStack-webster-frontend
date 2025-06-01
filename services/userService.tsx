import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

const userService = {
  setAuthToken: (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  clearAuthToken: () => {
    delete axios.defaults.headers.common['Authorization'];
  },

  getCurrentUser: async (userId: string) => {
    const response = await axios.get(`${API_URL}/me`)
    return response.data
},
updateCurrentUser: async (userData: any, userId: string) => {
    const response = await axios.patch(`${API_URL}/${userId}`, userData)
    return response.data
},
updatePasswordUser: async (userData: any, userId: string) => {
    const response = await axios.patch(`${API_URL}/${userId}/password`, userData)
    return response.data
},
getUserById: async (userId: string) => {
    const response = await axios.get(`${API_URL}/${userId}`)
    return response.data
},
uploadAvatar: async (formData: FormData, userId: string) => {
    const response = await axios.post(`${API_URL}/${userId}/upload-avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
},
fetchUserAvatar: async (avatarFileURL: string) => {
    try {
      const response = await axios.get(avatarFileURL, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching avatar from API:', error);
      throw error;
    }
  },
  deleteUserAvatar: async (userId: string, fileKey: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${userId}/avatar/${fileKey}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting avatar from API:', error);
      throw error;
    }
  },
  deleteUser: async (userId: string, data?: any) => {
    try {
      const response = await axios.delete(`${API_URL}/${userId}`, { data });
      return response.data;
    } catch (error) {
      console.error('Error deleting user from API:', error);
      throw error;
    }
  },
};

export default userService;


