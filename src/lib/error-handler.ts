import { AxiosError } from 'axios';

/**
 * Standard error response format from backend
 */
export interface BackendError {
  message: string;
  error?: string;
  statusCode?: number;
  details?: any;
}

/**
 * Extract user-friendly error message from backend error response
 */
export function extractErrorMessage(error: unknown): string {
  // Handle AxiosError (from axios)
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<BackendError>;
    
    // Backend returned error response
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      
      // Handle array of error messages (validation errors)
      if (Array.isArray(data.message)) {
        return data.message.join(', ');
      }
      
      // Handle string message
      if (typeof data.message === 'string' && data.message) {
        return data.message;
      }
      
      // Handle error field
      if (typeof data.error === 'string' && data.error) {
        return data.error;
      }
      
      // Handle validation details
      if (data.details && typeof data.details === 'object') {
        const validationErrors = Object.entries(data.details)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        if (validationErrors) {
          return validationErrors;
        }
      }
    }
    
    // Network errors
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    
    // HTTP status code specific messages
    const status = axiosError.response?.status;
    if (status) {
      switch (status) {
        case 400:
          return 'Invalid request. Please check your input and try again.';
        case 401:
          return 'Your session has expired. Please login again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'This operation conflicts with existing data.';
        case 422:
          return 'The data provided is invalid. Please check and try again.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'An internal server error occurred. Please try again later.';
        case 502:
          return 'Bad gateway. The server is temporarily unavailable.';
        case 503:
          return 'Service unavailable. Please try again later.';
        default:
          if (status >= 500) {
            return 'A server error occurred. Please try again later.';
          }
          return `Request failed with status ${status}. Please try again.`;
      }
    }
    
    // Generic axios error message
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback for unknown error types
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Format error for logging/debugging
 */
export function formatErrorForLogging(error: unknown): string {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<BackendError>;
    return JSON.stringify({
      message: axiosError.message,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      code: axiosError.code,
      url: axiosError.config?.url,
      method: axiosError.config?.method,
    }, null, 2);
  }
  
  if (error instanceof Error) {
    return JSON.stringify({
      name: error.name,
      message: error.message,
      stack: error.stack,
    }, null, 2);
  }
  
  return JSON.stringify(error, null, 2);
}

/**
 * Check if error is a specific HTTP status code
 */
export function isErrorStatus(error: unknown, status: number): boolean {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.status === status;
  }
  return false;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError;
    return axiosError.code === 'ERR_NETWORK' || axiosError.code === 'ECONNABORTED';
  }
  return false;
}

/**
 * Check if error is an authentication error (401)
 */
export function isAuthError(error: unknown): boolean {
  return isErrorStatus(error, 401);
}

/**
 * Check if error is a permission error (403)
 */
export function isPermissionError(error: unknown): boolean {
  return isErrorStatus(error, 403);
}

/**
 * Check if error is a validation error (400 or 422)
 */
export function isValidationError(error: unknown): boolean {
  return isErrorStatus(error, 400) || isErrorStatus(error, 422);
}
