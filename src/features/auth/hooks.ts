'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { requestOTP, verifyOTP, type RequestOTPParams, type VerifyOTPParams } from './api';
import { storage } from '@/lib/storage';

/**
 * Hook for requesting OTP
 */
export function useRequestOTP() {
  const router = useRouter();

  return useMutation({
    mutationFn: (params: RequestOTPParams) => requestOTP(params),
    onSuccess: (data, variables) => {
      // Store mobile number and country code for verify page
      storage.setUserEmail(variables.email);
      // Store additional data for OTP verification
      if (typeof window !== 'undefined') {
        localStorage.setItem('pendingMobileNo', variables.mobileNo);
        localStorage.setItem('pendingCountryCode', variables.countryCode);
      }
      // Navigate to OTP verification
      router.push('/auth/verify-otp');
    },
  });
}

/**
 * Hook for verifying OTP and logging in
 */
export function useVerifyOTP() {
  const router = useRouter();

  return useMutation({
    mutationFn: (params: VerifyOTPParams) => verifyOTP(params),
    onSuccess: (data) => {
      // Store access token
      storage.setToken(data.accessToken);
      // Clear stored email
      storage.setUserEmail('');
      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
}

/**
 * Hook for logging out
 */
export function useLogout() {
  const router = useRouter();

  return () => {
    storage.clearAll();
    router.push('/auth/login');
  };
}
