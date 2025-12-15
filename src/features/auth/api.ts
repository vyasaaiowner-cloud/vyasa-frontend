import api from '@/lib/api';

export interface RequestOTPParams {
  countryCode: string;
  mobileNo: string;
  email: string;
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
  email: string;
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
  const response = await api.post<RequestOTPResponse>('/auth/send-otp', params);
  return response.data;
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
  const response = await api.post<VerifyOTPResponse>('/auth/login', params);
  
  // Validate response structure
  if (!response.data || !response.data.accessToken) {
    console.error('Invalid login response structure:', response.data);
    throw new Error('Invalid response from server. Please try again.');
  }
  
  return response.data;
}

/**
 * Get current user profile (requires authentication)
 */
export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}
