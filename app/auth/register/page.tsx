'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRequestOTP } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const requestOTPMutation = useRequestOTP();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For OTP flow, we just need email. Name will be collected after verification
    requestOTPMutation.mutate({ email });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>Enter your email to get started with Vyasa</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@school.edu"
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
              {requestOTPMutation.isPending ? 'Sending OTP...' : 'Continue with OTP'}
            </Button>
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-slate-900 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
