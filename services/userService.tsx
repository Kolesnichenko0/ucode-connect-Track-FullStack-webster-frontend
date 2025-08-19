import axios from 'axios';
import {getUsersUrl} from "../utils/urls";

const userService = {
  setAuthToken: (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  clearAuthToken: () => {
    delete axios.defaults.headers.common['Authorization'];
  },

  getCurrentUser: async (userId: string) => {
    const response = await axios.get(`${getUsersUrl()}/me`)
    return response.data
},
updateCurrentUser: async (userData: any, userId: string) => {
    const response = await axios.patch(`${getUsersUrl()}/${userId}`, userData)
    return response.data
},
updatePasswordUser: async (userData: any, userId: string) => {
    const response = await axios.patch(`${getUsersUrl()}/${userId}/password`, userData)
    return response.data
},
getUserById: async (userId: string) => {
    const response = await axios.get(`${getUsersUrl()}/${userId}`)
    return response.data
},
uploadAvatar: async (formData: FormData, userId: string) => {
    const response = await axios.post(`${getUsersUrl()}/${userId}/upload-avatar`, formData, {
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
      const response = await axios.delete(`${getUsersUrl()}/${userId}/avatar/${fileKey}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting avatar from API:', error);
      throw error;
    }
  },
  deleteUser: async (userId: string, data?: any) => {
    try {
      const response = await axios.delete(`${getUsersUrl()}/${userId}`, { data });
      return response.data;
    } catch (error) {
      console.error('Error deleting user from API:', error);
      throw error;
    }
  },
};

export default userService;


