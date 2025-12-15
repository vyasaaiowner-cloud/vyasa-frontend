'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { requestOTP, verifyOTP, type RequestOTPParams, type VerifyOTPParams } from './api';
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
      // Store access token
      storage.setToken(data.accessToken);
      
      // Set school context for data isolation
      if (data.user.schoolId) {
        setSchoolContext(data.user.schoolId);
      }
      
      // Clear stored email and pending data
      storage.setUserEmail('');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pendingMobileNo');
        localStorage.removeItem('pendingCountryCode');
      }
      
      // Redirect based on user role
      const role = data.user.role?.toLowerCase();
      if (role === 'admin') {
        router.push('/dashboard/admin');
      } else if (role === 'teacher') {
        router.push('/dashboard/teacher/attendance');
      } else if (role === 'parent') {
        router.push('/dashboard/parent');
      } else {
        router.push('/dashboard');
      }
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

