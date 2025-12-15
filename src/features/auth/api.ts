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
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId?: string;
  };
}

/**
 * Request OTP to be sent to user's phone
 */
export async function requestOTP(params: RequestOTPParams): Promise<RequestOTPResponse> {
  const response = await api.post<RequestOTPResponse>('/auth/send-otp', params);
  return response.data;
}

/**
 * Verify OTP and login to get access token
 */
export async function verifyOTP(params: VerifyOTPParams): Promise<VerifyOTPResponse> {
  const response = await api.post<VerifyOTPResponse>('/auth/login', params);
  return response.data;
}

/**
 * Get current user profile (requires authentication)
 */
export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}
