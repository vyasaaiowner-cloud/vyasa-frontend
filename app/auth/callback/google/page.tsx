'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGoogleAuth } from '@/features/auth';
import { Card, CardContent } from '@/components/ui/card';
import { storage } from '@/lib/storage';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  // Get remember device preference from storage
  const rememberDevice = storage.getRememberDevice();
  const googleAuthMutation = useGoogleAuth(rememberDevice);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Google authentication was cancelled or failed.');
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      return;
    }

    if (!code) {
      setError('No authorization code received from Google.');
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      return;
    }

    // Exchange code for access token
    const deviceToken = storage.getDeviceToken();
    googleAuthMutation.mutate({ 
      code,
      deviceToken: rememberDevice ? deviceToken || undefined : undefined
    });
  }, [searchParams]);

  // Handle mutation error
  useEffect(() => {
    if (googleAuthMutation.isError) {
      setError(
        googleAuthMutation.error instanceof Error
          ? googleAuthMutation.error.message
          : 'Authentication failed. Please try again.'
      );
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    }
  }, [googleAuthMutation.isError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            {!error ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                <h2 className="text-xl font-semibold">Signing you in with Google...</h2>
                <p className="text-sm text-slate-600 text-center">
                  Please wait while we complete your authentication.
                </p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-red-100 p-3">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-red-600">Authentication Failed</h2>
                <p className="text-sm text-slate-600 text-center">{error}</p>
                <p className="text-sm text-slate-500">Redirecting to login page...</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
