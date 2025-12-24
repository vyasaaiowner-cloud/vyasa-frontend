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

  // Sort holidays by date (upcoming first, then past)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const sortedHolidays = [...holidays].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const isAUpcoming = dateA >= today;
    const isBUpcoming = dateB >= today;
    
    // Upcoming holidays first
    if (isAUpcoming && !isBUpcoming) return -1;
    if (!isAUpcoming && isBUpcoming) return 1;
    
    // Within same category, sort by date
    return dateA.getTime() - dateB.getTime();
  });

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

  // Calculate days until/since holiday
  const daysUntil = (dateString: string) => {
    const holidayDate = new Date(dateString);
    holidayDate.setHours(0, 0, 0, 0);
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0) return `in ${diffDays} days`;
    if (diffDays === -1) return 'Yesterday';
    return `${Math.abs(diffDays)} days ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Holidays
        </CardTitle>
        <CardDescription>All school holidays and observances</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : sortedHolidays.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No holidays found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedHolidays.map((holiday) => {
              const holidayDate = new Date(holiday.date);
              const isPast = holidayDate < today;
              return (
                <div
                  key={holiday.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isPast ? 'bg-slate-100 opacity-60' : 'bg-slate-50'
                  }`}
                >
                  <div>
                    <p className={`font-medium ${isPast ? 'text-slate-600' : 'text-slate-900'}`}>
                      {holiday.name}
                    </p>
                    <p className="text-sm text-slate-600">{formatDate(holiday.date)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      isPast 
                        ? 'text-slate-600 bg-slate-200' 
                        : 'text-slate-700 bg-slate-200'
                    }`}>
                      {daysUntil(holiday.date)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
