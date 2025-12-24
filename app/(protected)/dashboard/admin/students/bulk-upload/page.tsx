'use client';

import { useRouter } from 'next/navigation';
import { BulkUploadDialog } from '@/components/bulk-upload-dialog';
import { studentsApi } from '@/features/students/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function StudentsBulkUploadPage() {
  const router = useRouter();

  const handleUpload = async (file: File) => {
    return await studentsApi.bulkUpload(file);
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
          <h1 className="text-3xl font-bold">Bulk Upload Students</h1>
          <p className="text-slate-600">Upload multiple students at once using CSV or Excel file</p>
        </div>
      </div>

      <BulkUploadDialog
        title="Upload Students"
        description="Upload a CSV or Excel file with student information"
        templateUrl="/templates/students-template.csv"
        onUpload={handleUpload}
        acceptedFormats=".csv,.xlsx"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Template Format</h3>
        <p className="text-sm text-blue-800 mb-3">
          The CSV file should contain the following columns (exact names, case-sensitive):
        </p>
        <div className="bg-white rounded p-3 font-mono text-sm overflow-x-auto">
          <div className="grid grid-cols-8 gap-2 text-xs font-semibold mb-2 min-w-max">
            <span>name</span>
            <span>className</span>
            <span>section</span>
            <span>rollNo</span>
            <span>parentName</span>
            <span>parentCountryCode</span>
            <span>parentMobileNo</span>
            <span>parentEmail</span>
          </div>
          <div className="grid grid-cols-8 gap-2 text-xs text-slate-600 min-w-max">
            <span>John Doe</span>
            <span>10</span>
            <span>A</span>
            <span>1</span>
            <span>Jane Doe</span>
            <span>+91</span>
            <span>1234567890</span>
            <span>jane@email.com</span>
          </div>
        </div>
        <p className="text-xs text-blue-700 mt-3">
          * Required fields: name, className, section, rollNo
        </p>
        <p className="text-xs text-blue-700">
          * Field names are case-sensitive (use camelCase as shown above)
        </p>
      </div>
    </div>
  );
}
