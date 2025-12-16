'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { schoolsApi } from '@/features/schools';
import type { CreateSchoolDto } from '@/features/schools';
import { toast } from 'sonner';
import { ErrorBoundary } from '@/components/error-boundary';

export default function NewSchoolPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateSchoolDto>({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    contactEmail: '',
    contactPhone: '',
    contactCountryCode: '+91',
    adminName: '',
    adminEmail: '',
    adminPhoneCode: '+91',
    adminPhoneNumber: '',
  });
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: CreateSchoolDto) => schoolsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('School created successfully!');
      router.push('/dashboard/super-admin');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create school: ${error.message}`);
    },
  });

  // Auto-populate city, state from pincode
  const handlePincodeChange = async (pincode: string) => {
    const sanitizedPincode = pincode.replace(/\D/g, '').slice(0, 6);
    setFormData({ ...formData, pincode: sanitizedPincode });

    // Only fetch if we have a complete 6-digit pincode
    if (sanitizedPincode.length === 6) {
      setIsLoadingPincode(true);
      try {
        // Using India Post API for pincode lookup
        const response = await fetch(`https://api.postalpincode.in/pincode/${sanitizedPincode}`);
        const data = await response.json();

        if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.[0]) {
          const location = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            pincode: sanitizedPincode,
            city: location.District || prev.city,
            state: location.State || prev.state,
            country: location.Country || prev.country,
          }));
          toast.success('Location details populated from pincode');
        } else {
          toast.info('Could not find location for this pincode');
        }
      } catch (error) {
        console.error('Failed to fetch pincode data:', error);
        toast.error('Failed to fetch location details');
      } finally {
        setIsLoadingPincode(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/super-admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Add New School</h2>
            <p className="text-slate-600">Create a new school in the platform</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>School Details</CardTitle>
            <CardDescription>Enter the information for the new school</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* School Name & Code */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter school name"
                    required
                    disabled={createMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">School Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SCH001"
                    required
                    minLength={3}
                    disabled={createMutation.isPending}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="school@example.com"
                    disabled={createMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <div className="flex gap-2">
                    <Input
                      id="countryCode"
                      value={formData.contactCountryCode}
                        onChange={(e) => setFormData({ ...formData, contactCountryCode: e.target.value.trim() })}
                      placeholder="+91"
                      className="w-20"
                      disabled={createMutation.isPending}
                    />
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value.replace(/\D/g, '') })}
                      placeholder="1234567890"
                      disabled={createMutation.isPending}
                    />
                  </div>
                </div>
              </div>

              {/* Admin Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">School Admin Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Admin Name *</Label>
                    <Input
                      id="adminName"
                      value={formData.adminName}
                      onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                      placeholder="Enter admin name"
                      required
                      minLength={2}
                      disabled={createMutation.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email *</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      placeholder="admin@school.com"
                      required
                      disabled={createMutation.isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPhone">Admin Phone *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="adminPhoneCode"
                      value={formData.adminPhoneCode}
                        onChange={(e) => setFormData({ ...formData, adminPhoneCode: e.target.value.trim() })}
                      placeholder="+91"
                      className="w-20"
                      required
                      disabled={createMutation.isPending}
                    />
                    <Input
                      id="adminPhoneNumber"
                      type="tel"
                      value={formData.adminPhoneNumber}
                      onChange={(e) => setFormData({ ...formData, adminPhoneNumber: e.target.value.replace(/\D/g, '') })}
                      placeholder="1234567890"
                      required
                      minLength={10}
                      maxLength={10}
                      disabled={createMutation.isPending}
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                  disabled={createMutation.isPending}
                />
              </div>

              {/* Pincode (with auto-populate) */}
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  disabled={createMutation.isPending || isLoadingPincode}
                />
                {isLoadingPincode && (
                  <p className="text-xs text-slate-500">Fetching location details...</p>
                )}
              </div>

              {/* Location Details (auto-populated) */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    disabled={createMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                    disabled={createMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Country"
                    disabled={createMutation.isPending}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/super-admin')}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create School'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
