'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRequestOTP } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNo, setMobileNo] = useState('');
  const requestOTPMutation = useRequestOTP();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestOTPMutation.mutate({ countryCode, mobileNo });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>Enter your mobile number to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="flex gap-2">
                <Input
                  id="countryCode"
                  type="text"
                  placeholder="+91"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  required
                  className="w-20"
                  disabled={requestOTPMutation.isPending}
                />
                <Input
                  id="mobileNo"
                  type="tel"
                  placeholder="1234567890"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ''))}
                  required
                  disabled={requestOTPMutation.isPending}
                />
              </div>
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
            <Button 
              type="submit" 
              className="w-full" 
              disabled={requestOTPMutation.isPending}
            >
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
