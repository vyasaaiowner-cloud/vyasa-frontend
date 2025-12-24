'use client';

import { useRouter } from 'next/navigation';
import { BulkUploadDialog } from '@/components/bulk-upload-dialog';
import { teachersApi } from '@/features/teachers/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TeachersBulkUploadPage() {
  const router = useRouter();

  const handleUpload = async (file: File) => {
    return await teachersApi.bulkUpload(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Bulk Upload Teachers</h1>
          <p className="text-slate-600">Upload multiple teachers at once using CSV or Excel file</p>
        </div>
      </div>

      <BulkUploadDialog
        title="Upload Teachers"
        description="Upload a CSV or Excel file with teacher information"
        templateUrl="/templates/teachers-template.csv"
        onUpload={handleUpload}
        acceptedFormats=".csv,.xlsx"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Template Format</h3>
        <p className="text-sm text-blue-800 mb-3">
          The CSV file should contain the following columns (exact names, case-sensitive):
        </p>
        <div className="bg-white rounded p-3 font-mono text-sm">
          <div className="grid grid-cols-4 gap-4 text-xs font-semibold mb-2">
            <span>name</span>
            <span>countryCode</span>
            <span>mobileNo</span>
            <span>email</span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-xs text-slate-600">
            <span>John Smith</span>
            <span>+91</span>
            <span>1234567890</span>
            <span>john@school.com</span>
          </div>
        </div>
        <p className="text-xs text-blue-700 mt-3">
          * Required fields: name, countryCode, mobileNo
        </p>
        <p className="text-xs text-blue-700">
          * Field names are case-sensitive (use camelCase as shown above)
        </p>
      </div>
    </div>
  );
}
