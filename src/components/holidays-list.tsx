'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { holidaysApi } from '@/features/holidays/api';

export function HolidaysList() {
  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => holidaysApi.getAll(),
  });

  // Sort holidays by date
  const sortedHolidays = [...holidays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Filter upcoming holidays
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingHolidays = sortedHolidays.filter(h => new Date(h.date) >= today);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Holidays
        </CardTitle>
        <CardDescription>School holidays and observances</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : upcomingHolidays.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No upcoming holidays</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingHolidays.slice(0, 5).map((holiday) => (
              <div
                key={holiday.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-slate-50"
              >
                <div>
                  <p className="font-medium text-slate-900">{holiday.name}</p>
                  <p className="text-sm text-slate-600">{formatDate(holiday.date)}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-700 bg-slate-200 px-2 py-1 rounded">
                    {daysUntil(holiday.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
