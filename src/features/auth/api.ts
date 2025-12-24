import api from '@/lib/api';
import { extractErrorMessage } from '@/lib/error-handler';

export interface RequestOTPParams {
  countryCode: string;
  mobileNo: string;
}

export interface RequestOTPResponse {
  message: string;
  email?: string;
  mobileNo?: string;
}

export interface VerifyOTPParams {
  countryCode: string;
  mobileNo: string;
  otp: string;
}

export interface VerifyOTPResponse {
  accessToken: string;
  needsRegistration: boolean;
}

export interface JWTPayload {
  sub: string;        // user ID
  phone: string;
  role: string;
  schoolId: string;
  iat: number;
  exp: number;
}

/**
 * Request OTP to be sent to user's phone
 */
export async function requestOTP(params: RequestOTPParams): Promise<RequestOTPResponse> {
  try {
    const response = await api.post<RequestOTPResponse>('/auth/send-otp', params);
    return response.data;
  } catch (error) {
    // Error is already enhanced by API interceptor, just re-throw
    throw error;
  }
}

/**
 * Decode JWT token to extract payload
 */
export function decodeJWT(token: string): JWTPayload {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    throw new Error('Invalid token format');
  }
}

/**
 * Verify OTP and login to get access token
 */
export async function verifyOTP(params: VerifyOTPParams): Promise<VerifyOTPResponse> {
  try {
    const response = await api.post<VerifyOTPResponse>('/auth/login', params);
    
    // Validate response structure
    if (!response.data || !response.data.accessToken) {
      console.error('Invalid login response structure:', response.data);
      throw new Error('Invalid response from server. Please try again.');
    }
    
    return response.data;
  } catch (error) {
    // Error is already enhanced by API interceptor
    throw error;
  }
}

/**
 * Get current user profile (requires authentication)
 */
export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}

/**
 * Email/Password login types and functions
 */
export interface EmailLoginParams {
  email: string;
  password: string;
  deviceToken?: string;
}

export interface EmailLoginResponse {
  accessToken: string;
  deviceToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId: string;
  };
}

/**
 * Login with email and password
 */
export async function emailLogin(params: EmailLoginParams): Promise<EmailLoginResponse> {
  try {
    const response = await api.post<EmailLoginResponse>('/auth/email-login', params);
    
    if (!response.data || !response.data.accessToken) {
      throw new Error('Invalid response from server. Please try again.');
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Google OAuth types and functions
 */
export interface GoogleAuthParams {
  code: string;
  deviceToken?: string;
}

export interface GoogleAuthResponse {
  accessToken: string;
  deviceToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId: string;
  };
}

/**
 * Exchange Google OAuth code for access token
 */
export async function googleAuth(params: GoogleAuthParams): Promise<GoogleAuthResponse> {
  try {
    const response = await api.post<GoogleAuthResponse>('/auth/google', params);
    
    if (!response.data || !response.data.accessToken) {
      throw new Error('Invalid response from server. Please try again.');
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Login with device token (for remembered devices)
 */
export interface DeviceLoginParams {
  deviceToken: string;
}

export interface DeviceLoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId: string;
  };
}

export async function deviceLogin(params: DeviceLoginParams): Promise<DeviceLoginResponse> {
  try {
    const response = await api.post<DeviceLoginResponse>('/auth/device-login', params);
    
    if (!response.data || !response.data.accessToken) {
      throw new Error('Invalid response from server. Please try again.');
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
}
