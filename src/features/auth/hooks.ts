'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { requestOTP, verifyOTP, decodeJWT, googleAuth, deviceLogin, emailLogin, type RequestOTPParams, type VerifyOTPParams, type GoogleAuthParams, type DeviceLoginParams, type EmailLoginParams } from './api';
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

/**
 * Helper function to handle successful login and routing
 */
function handleLoginSuccess(
  accessToken: string,
  deviceToken: string | undefined,
  rememberDevice: boolean,
  router: ReturnType<typeof useRouter>
) {
  // Store access token
  storage.setToken(accessToken);
  
  // Store device token if "remember me" is enabled
  if (rememberDevice && deviceToken) {
    storage.setDeviceToken(deviceToken);
    storage.setRememberDevice(true);
  }
  
  // Decode JWT to extract user information
  const userInfo = decodeJWT(accessToken);
  
  // Set school context for data isolation
  if (userInfo.schoolId && userInfo.schoolId !== 'platform') {
    setSchoolContext(userInfo.schoolId);
  }
  
  // Redirect based on user role
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
}

/**
 * Hook for Google OAuth login
 */
export function useGoogleAuth(rememberDevice = false) {
  const router = useRouter();

  return useMutation({
    mutationFn: (params: GoogleAuthParams) => googleAuth(params),
    retry: false,
    onSuccess: (data) => {
      if (!data || !data.accessToken) {
        throw new Error('Invalid response from server');
      }

      handleLoginSuccess(data.accessToken, data.deviceToken, rememberDevice, router);
    },
    onError: (error) => {
      console.error('Google OAuth failed:', error);
    },
  });
}

/**
 * Hook for device-based login (for remembered devices)
 */
export function useDeviceLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (params: DeviceLoginParams) => deviceLogin(params),
    retry: false,
    onSuccess: (data) => {
      if (!data || !data.accessToken) {
        throw new Error('Invalid response from server');
      }

      // Device login doesn't create new device tokens, it uses existing ones
      handleLoginSuccess(data.accessToken, undefined, false, router);
    },
    onError: (error) => {
      console.error('Device login failed:', error);
      // Clear invalid device token
      storage.removeDeviceToken();
      storage.setRememberDevice(false);
    },
  });
}

/**
 * Hook for email/password login
 */
export function useEmailLogin(rememberDevice = false) {
  const router = useRouter();

  return useMutation({
    mutationFn: (params: EmailLoginParams) => emailLogin(params),
    retry: false,
    onSuccess: (data) => {
      if (!data || !data.accessToken) {
        throw new Error('Invalid response from server');
      }

      handleLoginSuccess(data.accessToken, data.deviceToken, rememberDevice, router);
    },
    onError: (error) => {
      console.error('Email login failed:', error);
    },
  });
}

