import api from '@/lib/api';
import { extractErrorMessage } from '@/lib/error-handler';

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
 * Wrap API calls to automatically include school ID via header
 * Supports both signatures for compatibility:
 * 1. scopedApiCall(url, options) - fetch-like (most APIs)
 * 2. scopedApiCall(method, url, data) - legacy (holidays API)
 * 
 * ⚠️ SECURITY NOTE: Backend MUST derive schoolId from JWT, not from client headers
 * This header is for routing/caching only, not authorization
 */
export async function scopedApiCall<T>(
  urlOrMethod: string,
  optionsOrUrl?: any,
  legacyData?: any
): Promise<T> {
  const schoolId = getSchoolContext();
  
  if (!schoolId) {
    throw new Error('School context not set. Please login again.');
  }
  
  // Detect which signature is being used
  const isLegacySignature = ['get', 'post', 'put', 'patch', 'delete'].includes(urlOrMethod.toLowerCase());
  
  let method: string;
  let url: string;
  let options: any = {};
  
  if (isLegacySignature) {
    // Legacy: scopedApiCall('get', '/teachers', data)
    method = urlOrMethod;
    url = optionsOrUrl;
    options = { data: legacyData };
  } else {
    // Modern: scopedApiCall('/teachers', { method: 'GET', body: ... })
    url = urlOrMethod;
    options = optionsOrUrl || {};
    method = options.method || 'GET';
  }
  
  try {
    // Detect if body is FormData to avoid setting Content-Type
    const isFormData = options.body instanceof FormData || legacyData instanceof FormData;
    
    // Build axios config
    const axiosConfig: any = {
      method: method.toLowerCase(),
      url,
      headers: {
        'X-School-Id': schoolId, // For backend routing/caching (NOT authorization)
        ...(options.headers || {}),
      },
    };
    
    // Only set Content-Type if not FormData (browser will set it with boundary)
    if (!isFormData && !axiosConfig.headers['Content-Type']) {
      axiosConfig.headers['Content-Type'] = 'application/json';
    }
    
    // Handle body/data
    if (options.body) {
      axiosConfig.data = options.body;
    } else if (options.data) {
      axiosConfig.data = options.data;
    } else if (legacyData) {
      axiosConfig.data = legacyData;
    }
    
    // Handle query params
    if (options.params) {
      axiosConfig.params = options.params;
    }
    
    const response = await api.request<T>(axiosConfig);
    
    // Validate response data contains correct school scope (optional check)
    // Backend is authoritative, this is just a sanity check
    if (response.data && typeof response.data === 'object') {
      const responseSchoolId = (response.data as any).schoolId;
      if (responseSchoolId && responseSchoolId !== schoolId) {
        console.error('School scope mismatch:', { expected: schoolId, received: responseSchoolId });
        // Don't throw - backend is authoritative
      }
    }
    
    return response.data;
  } catch (error) {
    // Error is already enhanced by the API interceptor
    // Just re-throw it with additional context if needed
    const errorMessage = extractErrorMessage(error);
    throw new Error(errorMessage);
  }
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
