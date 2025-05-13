import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import authService from '../services/authService';
import userService from '../services/userService';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
  profilePictureName?: string;
  countryCode?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<any>;
  sendPasswordResetLink: (email: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
  clearError: () => void;
  updateUserProfile: (userData: any) => Promise<any>;
  uploadUserAvatar: (formData: FormData, userId: string) => Promise<any>;
  updateUserState: (updatedUserData: Partial<User>) => void;
  refreshUser: () => void;
  updateUserPassword: (userData: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }

    const responseInterceptor = axios.interceptors.response.use(
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
        
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403) &&
          !originalRequest._retry &&
          !isAuthEndpoint &&
          hasRefreshToken
        ) {
          originalRequest._retry = true;
          try {
            const refreshedTokenData = await authService.refreshToken();
            if (refreshedTokenData.newRefreshToken) {
              localStorage.setItem("refreshToken", refreshedTokenData.newRefreshToken);
            }
            originalRequest.headers['Authorization'] = `Bearer ${refreshedTokenData.accessToken}`;
            sessionStorage.setItem('accessToken', refreshedTokenData.accessToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshedTokenData.accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            setUser(null);
            localStorage.removeItem('user');
            sessionStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            router.push('/login');
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse user from localStorage', err);
        localStorage.removeItem('user');
      } finally {
        setInitialLoading(false);
      }
    }

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

const register = async (firstName: string, lastName: string, email: string, password: string) => {
  try {
    setLoading(true);
    setError(null);
    
    const userData = { 
      firstName, 
      lastName, 
      email, 
      password
    };
    
    try {
      const response = await authService.register(userData);
      return response;
    } catch (apiError: any) {
      console.error('API registration error handled in AuthContext:', apiError.message);
      
      const errorMessage = apiError.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      

      return {
        error: true,
        message: errorMessage,
        details: apiError.response?.data || {}
      };
    }
  } catch (err: any) {
    console.error('Unexpected registration error in AuthContext:', err);
    
    const errorMessage = 'An unexpected error occurred. Please try again.';
    setError(errorMessage);
    
    return {
      error: true,
      message: errorMessage
    };
  } finally {
    setLoading(false);
  }
};

const login = async (email: string, password: string) => {
  try {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        if (response.accessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
        }
      }
      return response;
    } catch (apiError: any) {
      console.error('Login error handled in AuthContext:', apiError.message);
      
      setError(apiError.message || 'Login failed. Try test@example.com / Test@1234');
      
      return {
        error: true,
        message: apiError.message || 'Login failed'
      };
    }
  } catch (err: any) {
    console.error('Unexpected login error in AuthContext:', err);
    setError('An unexpected error occurred. Please try again.');
    
    return {
      error: true,
      message: 'An unexpected error occurred'
    };
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    try {
      setLoading(true);
      const refreshToken = localStorage.getItem('refreshToken');
      

      if (refreshToken) {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout API error:', error);

        }
      }
      
      setUser(null);
      localStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      router.push('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.response?.data?.message || 'Logout failed');

      setUser(null);
      localStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };


  const verifyEmail = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.verifyEmail(token);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email verification failed');
      setLoading(false);
      throw err;
    }
  };

  const sendPasswordResetLink = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.sendPasswordResetLink(email);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link');
      setLoading(false);
      throw err;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.resetPassword(token, newPassword);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed');
      setLoading(false);
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const updateUserState = (updatedUserData: Partial<User>) => {
    if (user) {
      const newUserData = { ...user, ...updatedUserData };
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
    }
  };


const updateUserProfile = async (userData: any) => {
  try {
    setLoading(true);
    setError(null);

    if (!user) {
      return {
        error: true,
        message: 'User not authenticated'
      };
    }

    try {
      const updatedUserData = await userService.updateCurrentUser(userData, user.id);

      updateUserState(updatedUserData);
      
      return {
        success: true,
        message: 'Profile successfully updated',
        data: updatedUserData
      };
    } catch (apiError: any) {
      console.error('API profile update error:', apiError.response?.status, apiError.response?.data);
      
      const errorMessage = apiError.response?.data?.message || 
                         (apiError.response?.status === 403 ? 'Permission denied' : 
                          'Failed to update profile. Please try again.');
      
      setError(errorMessage);
      
      return {
        error: true,
        message: errorMessage,
        details: apiError.response?.data
      };
    }
  } catch (err: any) {
    console.error('Unexpected error updating profile:', err);
    const errorMessage = 'An unexpected error occurred. Please try again.';
    setError(errorMessage);
    
    return {
      error: true,
      message: errorMessage
    };
  } finally {
    setLoading(false);
  }
};

const updateUserPassword = async (userData: any) => {
  try {
    setLoading(true);
    setError(null);

    if (!user) {
      return {
        error: true,
        message: 'User not authenticated'
      };
    }

    try {
      const response = await userService.updatePasswordUser(userData, user.id);
      
      return {
        success: true,
        message: 'Password successfully updated',
        data: response
      };
    } catch (apiError: any) {
      console.error('API password update error:', apiError.response?.status, apiError.response?.data);
      
      let errorMessage = 'Failed to update password. Please try again.';
      
      if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError.response?.status === 400) {
        errorMessage = 'Current password is incorrect';
      } else if (apiError.response?.status === 403) {
        errorMessage = 'Permission denied';
      }
      
      setError(errorMessage);
      
      return {
        error: true,
        message: errorMessage,
        details: apiError.response?.data
      };
    }
  } catch (err: any) {
    console.error('Unexpected error updating password:', err);
    const errorMessage = 'An unexpected error occurred. Please try again.';
    setError(errorMessage);
    
    return {
      error: true,
      message: errorMessage
    };
  } finally {
    setLoading(false);
  }
};

const uploadUserAvatar = async (formData: FormData, userId: string) => {
  try {
    setLoading(true);
    setError(null);
    
    if (!user) {
      return {
        error: true,
        message: 'User not authenticated'
      };
    }
    
    try {
      const response = await userService.uploadAvatar(formData, userId);
      
      if (response.server_filename) {
        const baseUrl = 'http://localhost:8080/uploads/user-avatars/';
        const profilePictureUrl = `${baseUrl}${response.server_filename}`;
        
        setUser(prevUser => {
          if (!prevUser) return prevUser;
          return { 
            ...prevUser, 
            profilePictureName: response.server_filename,
            profilePictureUrl: profilePictureUrl 
          };
        });
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const mergedUser = { 
              ...parsedUser, 
              profilePictureName: response.server_filename,
              profilePictureUrl: profilePictureUrl
            };
            localStorage.setItem('user', JSON.stringify(mergedUser));
            
            window.dispatchEvent(new Event('storage'));
          } catch (err) {
            console.error('Failed to update user in localStorage', err);
          }
        }
        
        return {
          success: true,
          message: 'Avatar successfully uploaded',
          data: response,
          profilePictureUrl: profilePictureUrl
        };
      } else {
        return {
          error: true,
          message: 'Failed to process uploaded avatar'
        };
      }
    } catch (apiError: any) {
      console.error('API avatar upload error:', apiError.response?.status, apiError.response?.data);
      
      const errorMessage = apiError.response?.data?.message || 
                         (apiError.response?.status === 413 ? 'Image is too large' : 
                          'Failed to upload avatar. Please try again.');
      
      setError(errorMessage);
      
      return {
        error: true,
        message: errorMessage,
        details: apiError.response?.data
      };
    }
  } catch (err: any) {
    console.error('Unexpected error uploading avatar:', err);
    const errorMessage = 'An unexpected error occurred. Please try again.';
    setError(errorMessage);
    
    return {
      error: true,
      message: errorMessage
    };
  } finally {
    setLoading(false);
  }
};


const refreshUser = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error('Failed to parse user from localStorage', err);
    }
  }
};
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      initialLoading,
      register, 
      logout, 
      verifyEmail,
      sendPasswordResetLink,
      resetPassword,
      clearError,
      updateUserProfile,
      uploadUserAvatar,
      updateUserState,
      refreshUser,
      updateUserPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

