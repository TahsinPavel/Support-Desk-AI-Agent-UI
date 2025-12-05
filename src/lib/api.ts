// Use /api proxy to avoid CORS issues (proxied to backend via next.config.ts rewrites)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic fetcher function for SWR
export const fetcher = (url: string) => fetch(`${API_BASE_URL}${url}`, {
  credentials: 'include',
}).then((res) => res.json());

// Auth API endpoints
export const AUTH_ENDPOINTS = {
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  ME: '/auth/me',
  LOGOUT: '/auth/logout',
};

// SMS API endpoints
export const SMS_ENDPOINTS = {
  RECEIVE: '/sms/receive',
  SUMMARY: '/analytics/sms/summary',
  DAILY: '/analytics/sms/daily',
  TYPES: '/analytics/sms/types',
};

// Email API endpoints
export const EMAIL_ENDPOINTS = {
  RECEIVE: '/email/receive',
  SUMMARY: '/analytics/email/summary',
  DAILY: '/analytics/email/daily',
  TYPES: '/analytics/email/types',
};

// Voice API endpoints
export const VOICE_ENDPOINTS = {
  RECEIVE: '/voice/receive',
  SUMMARY: '/analytics/voice/summary',
  DAILY: '/analytics/voice/daily',
  TYPES: '/analytics/voice/types',
};

// Chat API endpoints
export const CHAT_ENDPOINTS = {
  RECEIVE: '/chat/receive',
  SUMMARY: '/analytics/chat/summary',
  DAILY: '/analytics/chat/daily',
  TYPES: '/analytics/chat/types',
};

// Unified endpoints
export const ANALYTICS_ENDPOINTS = {
  RECENT_ACTIVITY: '/analytics/recent-activity',
  ASSISTANT_PERFORMANCE: '/analytics/assistant-performance',
};