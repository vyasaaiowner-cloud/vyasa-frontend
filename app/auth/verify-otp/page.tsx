'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyOTP } from '@/features/auth';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyOTPPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const verifyOTPMutation = useVerifyOTP();

  useEffect(() => {
    // Get email from storage
    const storedEmail = storage.getUserEmail();
    if (!storedEmail) {
      // No email stored, redirect to login
      router.push('/auth/login');
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    verifyOTPMutation.mutate({ email, otp });
  };

  const handleResendOTP = () => {
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => {
                  // Only allow numbers and max 6 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                }}
                required
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                disabled={verifyOTPMutation.isPending}
                autoComplete="one-time-code"
              />
            </div>
            {verifyOTPMutation.isError && (
              <p className="text-sm text-red-600">
                {verifyOTPMutation.error instanceof Error
                  ? verifyOTPMutation.error.message
                  : 'Invalid OTP. Please try again.'}
              </p>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={verifyOTPMutation.isPending || otp.length !== 6}
            >
              {verifyOTPMutation.isPending ? 'Verifying...' : 'Verify & Sign In'}
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
                disabled={verifyOTPMutation.isPending}
              >
                Didn't receive code? Request new OTP
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
