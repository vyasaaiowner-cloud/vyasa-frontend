/**
 * Environment variable validation and type-safe access
 */

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
}

export const env = {
  // apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000'),
  apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'https://vyasa-backend.onrender.com'),
  googleClientId: getEnvVar('NEXT_PUBLIC_GOOGLE_CLIENT_ID', '85393428710-j6siqe4c3ak4b0dbucc82464b8cg003j.apps.googleusercontent.com'),
  googleRedirectUri: getEnvVar('NEXT_PUBLIC_GOOGLE_REDIRECT_URI', 'https://www.vyasaai.com/auth/callback/google'),
  // googleRedirectUri: typeof window !== 'undefined' ? 'http://localhost:8000/auth/callback/google' : '',
} as const;

// Validate on module load (client-side only for NEXT_PUBLIC_ vars)
if (typeof window !== 'undefined') {
  if (!env.apiBaseUrl) {
    console.error('Missing NEXT_PUBLIC_API_BASE_URL environment variable');
  }
}
