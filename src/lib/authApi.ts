import axiosInstance from './axiosInstance';
import { AUTH_ENDPOINTS } from './api';

export interface SignupData {
  business_name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  detail?: string;
  user?: {
    id: string;
    email: string;
    business_name: string;
  };
  token?: string;
  access_token?: string;
  accessToken?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  business_name: string;
}

// Register a new tenant
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.SIGNUP, data);
  
  // Store token if returned (check common token field names)
  const token = response.data.token || response.data.access_token || response.data.accessToken;
  if (token) {
    localStorage.setItem('auth_token', token);
    // Set cookie for middleware authentication (expires in 7 days)
    document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    // Set the token in axios defaults for future requests
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  return response.data;
};

// Authenticate and login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, data);

  console.log('Login response:', response.data); // Debug: see what backend returns

  // Store token if returned (check common token field names)
  const token = response.data.token || response.data.access_token || response.data.accessToken;
  if (token) {
    localStorage.setItem('auth_token', token);
    // Set cookie for middleware authentication (expires in 7 days)
    document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    // Set the token in axios defaults for future requests
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
  try {
    await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Logout API error:', error);
  }
  // Clear stored token
  localStorage.removeItem('auth_token');
  // Clear the auth cookie
  document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax';
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

