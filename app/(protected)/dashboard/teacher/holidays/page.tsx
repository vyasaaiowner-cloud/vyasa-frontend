'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { holidaysApi } from '@/features/holidays/api';

export default function TeacherHolidaysPage() {
  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => holidaysApi.getAll(),
  });

  // Sort holidays by date
  const sortedHolidays = [...holidays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Separate upcoming and past holidays
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingHolidays = sortedHolidays.filter(h => new Date(h.date) >= today);
  const pastHolidays = sortedHolidays.filter(h => new Date(h.date) < today);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate days until holiday
  const daysUntil = (dateString: string) => {
    const holidayDate = new Date(dateString);
    holidayDate.setHours(0, 0, 0, 0);
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `in ${diffDays} days`;
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">School Holidays</h2>
          <p className="text-slate-600">View upcoming holidays and school closures</p>
        </div>

        {/* Upcoming Holidays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Holidays
            </CardTitle>
            <CardDescription>
              {upcomingHolidays.length} upcoming holiday{upcomingHolidays.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            ) : upcomingHolidays.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No upcoming holidays scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingHolidays.map((holiday) => (
                  <div
                    key={holiday.id}
                    className="flex items-center justify-between p-4 rounded-lg border-2 border-slate-200 bg-slate-50"
                  >
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">{holiday.name}</h3>
                      <p className="text-sm text-slate-600">{formatDate(holiday.date)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-slate-700 bg-slate-200 px-3 py-1.5 rounded-full">
                        {daysUntil(holiday.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Holidays */}
        {pastHolidays.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Past Holidays</CardTitle>
              <CardDescription>Previous holidays this year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pastHolidays.slice(-10).reverse().map((holiday) => (
                  <div
                    key={holiday.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white opacity-75"
                  >
                    <div>
                      <p className="font-medium text-slate-700">{holiday.name}</p>
                      <p className="text-sm text-slate-500">{formatDate(holiday.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
}
