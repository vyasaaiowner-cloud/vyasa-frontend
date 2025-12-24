'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, AlertCircle, CheckCircle, X } from 'lucide-react';

interface BulkUploadProps {
  title: string;
  description: string;
  templateUrl: string;
  onUpload: (file: File) => Promise<BulkUploadResult>;
  acceptedFormats?: string;
}

interface BulkUploadResult {
  success: number;
  failed: number;
  errors?: Array<{
    row: number;
    error: string;
  }>;
}

export function BulkUploadDialog({ title, description, templateUrl, onUpload, acceptedFormats = '.csv,.xlsx' }: BulkUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const result = await onUpload(selectedFile);
      setUploadResult(result);
      
      // Clear file input if upload was successful
      if (result.failed === 0) {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        success: 0,
        failed: 1,
        errors: [{ row: 0, error: error instanceof Error ? error.message : 'Upload failed' }],
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Download Template */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="font-medium">Step 1: Download Template</p>
            <p className="text-sm text-slate-600">Download the CSV template to see required format</p>
          </div>
          <Button variant="outline" asChild>
            <a href={templateUrl} download>
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        </div>

        {/* Upload File */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Step 2: Upload Filled File</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats}
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </div>
            {selectedFile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {selectedFile && (
            <p className="text-sm text-slate-600">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Process
            </>
          )}
        </Button>

        {/* Upload Result */}
        {uploadResult && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                {uploadResult.failed === 0 ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-600">Upload Successful!</p>
                      <p className="text-sm text-slate-600">
                        {uploadResult.success} record{uploadResult.success !== 1 ? 's' : ''} added successfully
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Upload Completed with Errors</p>
                      <p className="text-sm text-slate-600">
                        Success: {uploadResult.success} | Failed: {uploadResult.failed}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Error Details */}
            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <p className="font-medium text-red-900 mb-2">Errors:</p>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {uploadResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-800">
                      <span className="font-medium">Row {error.row}:</span> {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-slate-600 space-y-1 pt-2 border-t">
          <p className="font-medium">Instructions:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Download the template and fill in your data</li>
            <li>Make sure all required fields are filled</li>
            <li>Save as CSV or Excel file</li>
            <li>Upload the file and review results</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
