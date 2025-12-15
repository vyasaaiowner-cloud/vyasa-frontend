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
    onSuccess: (data, variables) => {
      // Store email only if email login method is used
      if (variables.email) {
        storage.setUserEmail(variables.email);
      } else {
        storage.setUserEmail(''); // Clear email if using mobile
      }
      
      // Store mobile data only if mobile login method is used
      if (typeof window !== 'undefined') {
        if (variables.mobileNo && variables.countryCode) {
          localStorage.setItem('pendingMobileNo', variables.mobileNo);
          localStorage.setItem('pendingCountryCode', variables.countryCode);
        } else {
          localStorage.removeItem('pendingMobileNo');
          localStorage.removeItem('pendingCountryCode');
        }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pendingMobileNo');
        localStorage.removeItem('pendingCountryCode');
      }
      
      // Redirect based on user role
      // Backend roles: SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, PARENT
      const role = userInfo.role?.toUpperCase();
      
      switch (role) {
        case 'SUPER_ADMIN':
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

