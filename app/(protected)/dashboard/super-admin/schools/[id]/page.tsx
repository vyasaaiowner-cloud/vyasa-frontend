'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Mail, Phone, MapPin, Users, GraduationCap, BookOpen } from 'lucide-react';
import { schoolsApi } from '@/features/schools';
import { ErrorBoundary } from '@/components/error-boundary';

export default function SchoolDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.id as string;

  const { data: school, isLoading, error } = useQuery({
    queryKey: ['school', schoolId],
    queryFn: () => schoolsApi.getById(schoolId),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading school details...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/super-admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-red-600">Error Loading School</h2>
            <p className="text-slate-600">Unable to load school details</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-slate-500">
              {error instanceof Error ? error.message : 'School not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/super-admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold tracking-tight">{school.name}</h2>
                <Badge variant={school.isActive ? 'default' : 'secondary'}>
                  {school.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-slate-600">School Code: {school.schoolCode}</p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/dashboard/super-admin/schools/${schoolId}/edit`}>
              Edit School
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        {school._count && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <Users className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{school._count.teachers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{school._count.students}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{school._count.classes}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* School Information */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>School details and location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {school.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">Address</p>
                    <p className="text-sm">{school.address}</p>
                    {(school.city || school.state || school.country) && (
                      <p className="text-sm text-slate-600">
                        {[school.city, school.state, school.country].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {school.pincode && (
                      <p className="text-sm text-slate-600">PIN: {school.pincode}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-slate-600">Created:</span>{' '}
                  {new Date(school.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-slate-600">Last Updated:</span>{' '}
                  {new Date(school.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>How to reach the school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {school.contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-600">Email</p>
                    <a 
                      href={`mailto:${school.contactEmail}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {school.contactEmail}
                    </a>
                  </div>
                </div>
              )}
              
              {school.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-600">Phone</p>
                    <a 
                      href={`tel:${school.contactCountryCode || ''}${school.contactPhone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {school.contactCountryCode} {school.contactPhone}
                    </a>
                  </div>
                </div>
              )}

              {!school.contactEmail && !school.contactPhone && (
                <p className="text-sm text-slate-500">No contact information available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}
