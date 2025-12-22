import axios from 'axios';
import { env } from './env';
import { storage } from './storage';
import { extractErrorMessage, formatErrorForLogging } from './error-handler';

const api = axios.create({
  baseURL: env.apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (unauthorized) - clear token and redirect to login
// Also enhance error messages for better user experience
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', formatErrorForLogging(error));
    }
    
    // Handle 401 errors (unauthorized) - clear token and redirect to login
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      storage.clearAll();
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    // Create a new error with user-friendly message
    const userFriendlyMessage = extractErrorMessage(error);
    const enhancedError = new Error(userFriendlyMessage);
    
    // Preserve original error properties for debugging
    (enhancedError as any).originalError = error;
    (enhancedError as any).isAxiosError = true;
    (enhancedError as any).response = error.response;
    (enhancedError as any).request = error.request;
    (enhancedError as any).config = error.config;
    
    return Promise.reject(enhancedError);
  }
);

export default api;
