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
    onSuccess: (data) => {
      // Store email for verify page
      storage.setUserEmail(data.email);
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
