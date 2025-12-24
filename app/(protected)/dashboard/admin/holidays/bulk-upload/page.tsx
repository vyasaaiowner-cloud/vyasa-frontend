'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BulkUploadDialog } from '@/components/bulk-upload-dialog';
import { holidaysApi } from '@/features/holidays/api';

export default function HolidaysBulkUploadPage() {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" asChild>
        <Link href="/dashboard/admin/holidays">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Holidays
        </Link>
      </Button>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload Holidays</CardTitle>
          <CardDescription>
            Upload multiple holidays at once using a CSV or Excel file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <BulkUploadDialog
            title="Upload Holidays File"
            description="Select a CSV or Excel file containing holiday data"
            templateUrl="/templates/holidays-template.csv"
            onUpload={holidaysApi.bulkUpload}
          />

          {/* Instructions */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold text-lg">Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
              <li>Download the CSV template by clicking the "Download Template" button above</li>
              <li>Fill in the holiday information following the format in the template</li>
              <li>Save your file as CSV or Excel format (.csv, .xlsx, .xls)</li>
              <li>Upload the file using the upload area above</li>
              <li>Review the results and fix any errors if needed</li>
            </ol>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">CSV Format:</h4>
              <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs">
                <div className="font-semibold mb-2">name,date</div>
                <div className="text-slate-600">Republic Day,2025-01-26</div>
                <div className="text-slate-600">Holi,2025-03-14</div>
                <div className="text-slate-600">Independence Day,2025-08-15</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Required Fields:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li><strong>name:</strong> Holiday name (e.g., "Republic Day", "Diwali")</li>
                <li><strong>date:</strong> Holiday date in YYYY-MM-DD format (e.g., "2025-01-26")</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Dates must be in ISO format (YYYY-MM-DD). 
                Duplicate holidays for the same date will be skipped.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
