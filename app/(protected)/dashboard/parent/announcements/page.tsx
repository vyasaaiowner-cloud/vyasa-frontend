'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { announcementsApi } from '@/features/announcements/api';

export default function ParentAnnouncementsPage() {
  // Fetch announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => announcementsApi.getAll(),
  });

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
          <p className="text-slate-600">School announcements and updates</p>
        </div>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              School Announcements
              {announcements.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {announcements.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Latest updates from the school</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 animate-pulse">
                    <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Bell className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-sm">No announcements yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map(announcement => (
                  <div
                    key={announcement.id}
                    className="border rounded-lg p-4 border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      {announcement.targetAll ? (
                        <Badge variant="secondary" className="ml-2">All</Badge>
                      ) : (
                        <Badge variant="secondary" className="ml-2">
                          {announcement.targetClass}
                          {announcement.targetSection && ` - ${announcement.targetSection}`}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">{announcement.content}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
