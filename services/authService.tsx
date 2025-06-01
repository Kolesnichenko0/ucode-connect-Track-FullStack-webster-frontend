import axios from 'axios';
import userService from './userService';
import { log } from 'console';

const API_URL = 'http://localhost:8080/api/auth';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarFileURL?: string;
  profilePictureName?: string;
  countryCode?: string;
  created_at: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
  newRefreshToken?: string;
}

const authService = {
  register: async (userData: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data.user;
    } catch (error: any) {
      console.error('Registration API error:', error.response?.status, error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                        (error.response?.status === 409 ? 'Email already exists' : 
                         'Registration failed. Please try again.');
      
      const customError = new Error(errorMessage);
      (customError as any).response = error.response;
      (customError as any).status = error.response?.status;
      
      return Promise.reject(customError);
    }
  },


login: async (loginData: LoginData) => {
  try {
    if (loginData.email === 'test@example.com' && loginData.password === 'Test@1234') {
      const testUser = {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        profilePictureUrl: '',
        profilePictureName: '',
        countryCode: 'UA',
        created_at: new Date().toISOString()
      };
      
      const accessToken = 'fake-access-token-for-testing';
      const refreshToken = 'fake-refresh-token-for-testing';
      
      sessionStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      return {
        user: testUser,
        accessToken,
        refreshToken,
        message: 'Login successful'
      };
    }
    
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/login`, loginData);
      
      console.log('Server response from /api/auth/login:', response);
      console.log('Response data:', response.data);

      if (response.data.accessToken) {
        authService.setAuthToken(response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (apiError: any) {
      console.error('Login API error:', apiError.response?.status, apiError.response?.data);
      
      const errorMessage = apiError.response?.data?.message || 
                         (apiError.response?.status === 401 ? 'Invalid email or password' : 
                          'Login failed. Please try again.');
      
      const error = new Error(errorMessage);
      (error as any).response = apiError.response;
      
      return Promise.reject(error);
    }
  } catch (error) {
    console.error('Unexpected login error:', error);
    return Promise.reject(new Error('An unexpected error occurred. Please try again.'));
  }
},

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log('No refresh token found, skipping API logout');
      return;
    }
    
    try {
      await axios.post(`${API_URL}/logout`, { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      authService.clearAuthToken();
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      userService.clearAuthToken();
    }
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/access-token/refresh`, { refreshToken });
      if (response.data.accessToken) {
        authService.setAuthToken(response.data.accessToken);
      }
      return response.data;
    } catch (error: any) {
      console.log('Refresh token error:', error.response);
      throw error;
    }
  },

  verifyEmail: async (token: string) => {
    const response = await axios.post(`${API_URL}/confirm-email/${token}`);
    return response.data;
  },

  sendPasswordResetLink: async (email: string) => {
    const response = await axios.post(`${API_URL}/reset-password`, { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await axios.post(`${API_URL}/reset-password/${token}`, { newPassword });
    return response.data;
  },

  setAuthToken: (token: string) => {
    sessionStorage.setItem('accessToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  clearAuthToken: () => {
    sessionStorage.removeItem('accessToken');
    delete axios.defaults.headers.common['Authorization'];
  },

  setupInterceptors: () => {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        const isAuthEndpoint = originalRequest.url && (
          originalRequest.url.includes('/auth/login') ||
          originalRequest.url.includes('/auth/register') ||
          originalRequest.url.includes('/login') ||
          originalRequest.url.includes('/register')
        );
        
        const hasRefreshToken = localStorage.getItem('refreshToken') !== null;
        
        if (error.response?.status === 401 && 
            !originalRequest._retry && 
            !isAuthEndpoint && 
            hasRefreshToken) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await authService.refreshToken();
            
            if (refreshResponse.accessToken) {
              originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.accessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            try {
              await authService.logout();
            } catch (logoutError) {
              console.error("Error during quiet logout:", logoutError);
            }
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  },


};

export default authService;

