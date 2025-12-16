'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { School, Users, BookOpen, Building2, Plus } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { StatCardsSkeleton, TableSkeleton } from '@/components/skeletons';
import { schoolsApi } from '@/features/schools';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SuperAdminDashboard() {
  // Fetch all schools
  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['schools'],
    queryFn: () => schoolsApi.getAll(),
  });

  // Calculate stats
  const totalSchools = schools.length;
  const activeSchools = schools.filter(s => s.isActive).length;
  const totalStudents = schools.reduce((acc, s) => acc + (s._count?.students || 0), 0);
  const totalTeachers = schools.reduce((acc, s) => acc + (s._count?.teachers || 0), 0);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Vyasa Admin Dashboard</h2>
            <p className="text-slate-600">Platform-wide overview and school management</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/super-admin/schools/new">
              <Plus className="h-4 w-4 mr-2" />
              Add School
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <StatCardsSkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                <Building2 className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSchools}</div>
                <p className="text-xs text-slate-600 mt-1">
                  {activeSchools} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-slate-600 mt-1">
                  Across all schools
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <BookOpen className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTeachers}</div>
                <p className="text-xs text-slate-600 mt-1">
                  Across all schools
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
                <School className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSchools}</div>
                <p className="text-xs text-slate-600 mt-1">
                  {totalSchools - activeSchools} inactive
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Schools List */}
        <Card>
          <CardHeader>
            <CardTitle>Schools</CardTitle>
            <CardDescription>Manage all schools in the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton />
            ) : schools.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-sm">No schools found. Add your first school!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Teachers</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.map(school => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {school.city && school.state ? (
                            <>{school.city}, {school.state}</>
                          ) : (
                            <span className="text-slate-400">Not set</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{school._count?.students || 0}</TableCell>
                      <TableCell>{school._count?.teachers || 0}</TableCell>
                      <TableCell>{school._count?.classes || 0}</TableCell>
                      <TableCell>
                        {school.isActive ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/dashboard/super-admin/schools/${school.id}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
