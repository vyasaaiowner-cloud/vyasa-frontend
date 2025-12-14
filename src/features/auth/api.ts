import api from '@/lib/api';

export interface RequestOTPParams {
  email: string;
}

export interface RequestOTPResponse {
  message: string;
  email: string;
}

export interface VerifyOTPParams {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

/**
 * Request OTP to be sent to user's email
 */
export async function requestOTP(params: RequestOTPParams): Promise<RequestOTPResponse> {
  const response = await api.post<RequestOTPResponse>('/auth/request-otp', params);
  return response.data;
}

/**
 * Verify OTP and get access token
 */
export async function verifyOTP(params: VerifyOTPParams): Promise<VerifyOTPResponse> {
  const response = await api.post<VerifyOTPResponse>('/auth/verify-otp', params);
  return response.data;
}

/**
 * Get current user profile (requires authentication)
 */
export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}
