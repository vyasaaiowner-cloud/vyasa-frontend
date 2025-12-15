import api from '@/lib/api';

// School scope guard middleware
let currentSchoolId: string | null = null;

/**
 * Set the current school context
 * Should be called after login with the user's school ID
 */
export function setSchoolContext(schoolId: string) {
  currentSchoolId = schoolId;
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentSchoolId', schoolId);
  }
}

/**
 * Get the current school context
 */
export function getSchoolContext(): string | null {
  if (currentSchoolId) return currentSchoolId;
  
  if (typeof window !== 'undefined') {
    currentSchoolId = localStorage.getItem('currentSchoolId');
  }
  
  return currentSchoolId;
}

/**
 * Clear school context (on logout)
 */
export function clearSchoolContext() {
  currentSchoolId = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentSchoolId');
  }
}

/**
 * Validate that a school ID matches the current context
 * Throws error if there's a mismatch
 */
export function validateSchoolScope(schoolId: string): void {
  const currentSchool = getSchoolContext();
  
  if (!currentSchool) {
    throw new Error('No school context set');
  }
  
  if (currentSchool !== schoolId) {
    throw new Error('Unauthorized: School scope mismatch');
  }
}

/**
 * Wrap API calls to automatically include school ID
 * and validate responses
 */
export async function scopedApiCall<T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any
): Promise<T> {
  const schoolId = getSchoolContext();
  
  if (!schoolId) {
    throw new Error('School context not set. Please login again.');
  }
  
  // Add schoolId to request
  const config = {
    params: method === 'get' ? { ...data, schoolId } : undefined,
    data: method !== 'get' ? { ...data, schoolId } : undefined,
  };
  
  const response = await api.request<T>({
    method,
    url,
    ...config,
  });
  
  // Validate response data contains correct school scope
  if (response.data && typeof response.data === 'object') {
    const responseSchoolId = (response.data as any).schoolId;
    if (responseSchoolId && responseSchoolId !== schoolId) {
      console.error('School scope violation detected in response');
      throw new Error('Data isolation error: Invalid school scope');
    }
  }
  
  return response.data;
}

/**
 * React hook for school-scoped queries
 */
export function useSchoolScope() {
  const schoolId = getSchoolContext();
  
  if (!schoolId) {
    console.warn('No school context available');
  }
  
  return {
    schoolId,
    setSchoolContext,
    clearSchoolContext,
    validateSchoolScope,
  };
}
