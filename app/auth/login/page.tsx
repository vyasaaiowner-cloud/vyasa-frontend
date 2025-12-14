'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRequestOTP } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const requestOTPMutation = useRequestOTP();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestOTPMutation.mutate({ email });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome to Vyasa</CardTitle>
          <CardDescription>Enter your email to receive a one-time password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={requestOTPMutation.isPending}
              />
            </div>
            {requestOTPMutation.isError && (
              <p className="text-sm text-red-600">
                {requestOTPMutation.error instanceof Error
                  ? requestOTPMutation.error.message
                  : 'Failed to send OTP. Please try again.'}
              </p>
            )}
            {requestOTPMutation.isSuccess && (
              <p className="text-sm text-green-600">
                OTP sent! Redirecting to verification...
              </p>
            )}
            <Button type="submit" className="w-full" disabled={requestOTPMutation.isPending}>
              {requestOTPMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
            </Button>
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-medium text-slate-900 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
