'use client';

import { ErrorBoundary } from '@/components/error-boundary';
import { HolidaysList } from '@/components/holidays-list';

export default function ParentHolidaysPage() {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Holidays</h2>
          <p className="text-slate-600">School holidays and observances</p>
        </div>

        {/* Holidays Component */}
        <HolidaysList />
      </div>
    </ErrorBoundary>
  );
}
