/**
 * Safe localStorage wrapper with SSR-friendly checks
 * 
 * ⚠️ SECURITY WARNING: localStorage is vulnerable to XSS attacks
 * TODO: Migrate to httpOnly cookies for production
 * 
 * Migration path:
 * 1. Backend: Set token in httpOnly cookie on login/verify
 * 2. Frontend: Remove token storage, rely on automatic cookie sending
 * 3. Update api.ts to not manually attach Authorization header
 * 4. Update this file to only store non-sensitive user preferences
 * 
 * Benefits of httpOnly cookies:
 * - Not accessible via JavaScript (XSS protection)
 * - Automatically sent with requests
 * - Server-side validation possible in middleware
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER_EMAIL: 'userEmail',
} as const;

class Storage {
  private isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  setToken(token: string): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  getToken(): string | null {
    if (!this.isAvailable()) return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Failed to read token:', error);
      return null;
    }
  }

  removeToken(): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  }

  setUserEmail(email: string): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
    } catch (error) {
      console.error('Failed to save email:', error);
    }
  }

  getUserEmail(): string | null {
    if (!this.isAvailable()) return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_EMAIL);
    } catch (error) {
      console.error('Failed to read email:', error);
      return null;
    }
  }

  clearAll(): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export const storage = new Storage();
