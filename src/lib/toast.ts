import { toast as sonnerToast } from 'sonner';
import { extractErrorMessage } from './error-handler';

/**
 * Enhanced toast utilities that automatically format errors
 */
export const toast = {
  /**
   * Show success message
   */
  success: (message: string) => {
    sonnerToast.success(message);
  },

  /**
   * Show error message (automatically extracts from Error objects)
   */
  error: (error: unknown, fallbackMessage?: string) => {
    let message: string;
    
    if (typeof error === 'string') {
      message = error;
    } else {
      message = extractErrorMessage(error);
    }
    
    // If the extracted message is generic and we have a fallback, use fallback with context
    if (fallbackMessage && message === 'An unexpected error occurred. Please try again.') {
      message = fallbackMessage;
    }
    
    sonnerToast.error(message);
  },

  /**
   * Show info message
   */
  info: (message: string) => {
    sonnerToast.info(message);
  },

  /**
   * Show warning message
   */
  warning: (message: string) => {
    sonnerToast.warning(message);
  },

  /**
   * Show loading message
   */
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  /**
   * Dismiss toast
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },

  /**
   * Promise toast - automatically shows loading, success, or error
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error?: string | ((error: unknown) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: (err) => {
        if (messages.error) {
          return typeof messages.error === 'function'
            ? messages.error(err)
            : messages.error;
        }
        return extractErrorMessage(err);
      },
    });
  },
};
