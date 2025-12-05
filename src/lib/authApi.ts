import axiosInstance from './axiosInstance';
import { AUTH_ENDPOINTS } from './api';

export interface SignupData {
  name: string;
  business_name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    business_name: string;
  };
  token?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  business_name: string;
}

// Register a new tenant
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.SIGNUP, data);
  return response.data;
};

// Authenticate and login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, data);
  
  // Store token if returned
  if (response.data.token) {
    localStorage.setItem('auth_token', response.data.token);
    // Set the token in axios defaults for future requests
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
  }
  
  return response.data;
};

// Get current authenticated user profile
export const getMe = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get(AUTH_ENDPOINTS.ME);
  return response.data;
};

// Logout
export const logout = async (): Promise<void> => {
  await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
  // Clear stored token
  localStorage.removeItem('auth_token');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

// Initialize auth from stored token (call on app mount)
export const initializeAuth = (): void => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('auth_token');
  }
  return false;
};

