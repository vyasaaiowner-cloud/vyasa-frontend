'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { requestOTP, verifyOTP, decodeJWT, type RequestOTPParams, type VerifyOTPParams } from './api';
import { storage } from '@/lib/storage';
import { setSchoolContext, clearSchoolContext } from '@/lib/school-scope';

/**
 * Hook for requesting OTP
 */
export function useRequestOTP() {
  const router = useRouter();

  return useMutation({
    mutationFn: (params: RequestOTPParams) => requestOTP(params),
    retry: false, // Don't retry OTP requests automatically
    onSuccess: (data, variables) => {
      // Phase 0: Mobile-only OTP - always clear email
      storage.setUserEmail('');
      
      // Store mobile data for OTP verification
      storage.setPendingMobile(variables.mobileNo, variables.countryCode);
      
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
    retry: false, // Don't retry OTP verification automatically
    onSuccess: (data) => {
      // Validate response data
      if (!data || !data.accessToken) {
        throw new Error('Invalid response from server');
      }

      // Store access token
      storage.setToken(data.accessToken);
      
      // Decode JWT to extract user information
      const userInfo = decodeJWT(data.accessToken);
      
      // Set school context for data isolation
      if (userInfo.schoolId && userInfo.schoolId !== 'platform') {
        setSchoolContext(userInfo.schoolId);
      }
      
      // Clear stored email and pending data
      storage.setUserEmail('');
      storage.clearPendingMobile();
      
      // Redirect based on user role
      // Backend roles: SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, PARENT
      const role = userInfo.role?.toUpperCase();
      
      switch (role) {
        case 'SUPER_ADMIN':
          router.push('/dashboard/super-admin');
          break;
        case 'SCHOOL_ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'TEACHER':
          router.push('/dashboard/teacher/attendance');
          break;
        case 'PARENT':
          router.push('/dashboard/parent');
          break;
        default:
          console.warn('Unknown role:', userInfo.role);
          router.push('/dashboard');
      }
    },
    onError: (error) => {
      console.error('OTP verification failed:', error);
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
    clearSchoolContext();
    router.push('/auth/login');
  };
}

