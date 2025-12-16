'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users } from 'lucide-react';
import { teachersApi } from '@/features/teachers/api';
import { ErrorBoundary } from '@/components/error-boundary';
import { TableSkeleton } from '@/components/skeletons';
import { getSchoolContext } from '@/lib/school-scope';

export default function TeacherClassesPage() {
  const schoolId = getSchoolContext();

  // Fetch current teacher's data
  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ['teachers', schoolId],
    queryFn: () => teachersApi.getAll(false),
  });

  // For now, we'll get the first teacher - in a real app, you'd get the current logged-in teacher
  // TODO: Add an API endpoint to get current teacher's assignments
  const currentTeacher = teachers[0];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Classes</h2>
          <p className="text-slate-600">Classes and sections assigned to you</p>
        </div>
        <TableSkeleton rows={3} />
      </div>
    );
  }

  if (!currentTeacher) {
    return (
      <ErrorBoundary>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Classes</h2>
            <p className="text-slate-600">Classes and sections assigned to you</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-slate-500">
                No teacher profile found. Please contact your administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    );
  }

  // Group assignments by class
  interface ClassGroup {
    className: string;
    classId: string;
    sections: any[];
  }
  
  const assignmentsByClass = currentTeacher.assignments.reduce((acc: Record<string, ClassGroup>, assignment: any) => {
    const className = assignment.section.class.name;
    if (!acc[className]) {
      acc[className] = {
        className,
        classId: assignment.section.classId,
        sections: [],
      };
    }
    acc[className].sections.push(assignment.section);
    return acc;
  }, {});

  const classGroups = Object.values(assignmentsByClass);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Classes</h2>
          <p className="text-slate-600">
            You are assigned to {currentTeacher.assignments.length} section
            {currentTeacher.assignments.length !== 1 ? 's' : ''} across {classGroups.length} class
            {classGroups.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* No Assignments */}
        {currentTeacher.assignments.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  You haven't been assigned to any classes yet.
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Contact your school administrator to get assigned to classes.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Classes Grid */}
        {classGroups.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classGroups.map((classGroup: ClassGroup) => (
              <Card key={classGroup.classId}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {classGroup.className}
                  </CardTitle>
                  <CardDescription>
                    {classGroup.sections.length} section{classGroup.sections.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {classGroup.sections.map((section: any) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="font-semibold text-slate-700">
                              {section.name}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">Section {section.name}</p>
                            {section._count?.students !== undefined && (
                              <p className="text-sm text-slate-600 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {section._count.students} students
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Teacher Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Your teacher profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium text-slate-600">Name:</span>{' '}
                {currentTeacher.user.name}
              </p>
              <p>
                <span className="font-medium text-slate-600">Email:</span>{' '}
                {currentTeacher.user.email || 'Not provided'}
              </p>
              <p>
                <span className="font-medium text-slate-600">Phone:</span>{' '}
                {currentTeacher.user.phoneE164}
              </p>
              <p>
                <span className="font-medium text-slate-600">Status:</span>{' '}
                <Badge variant={currentTeacher.isActive ? 'default' : 'secondary'}>
                  {currentTeacher.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
