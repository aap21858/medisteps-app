import React, { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import { CsvUploadResponse } from "@/generated/models/csv-upload-response";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, AlertCircle, CheckCircle } from "lucide-react";

const PatientBulkOnboarding: React.FC = () => {
  const [csvPatients, setCsvPatients] = useState<any[]>([]);
  const [csvError, setCsvError] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<CsvUploadResponse | null>(null);
  const { toast } = useToast();
  const { request } = useAuthorizedApi();

  const handleDownloadTemplate = async () => {
    try {
      const response: any = await request({
        method: "get",
        url: "/api/patients/download-csv-template",
        responseType: "blob",
      });
      
      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data as any], { type: "text/csv" });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "patient-template.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Template downloaded successfully.",
      });
    } catch (error) {
      console.error('Template download error:', error);
      toast({
        title: "Error downloading template",
        description: "Failed to download CSV template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setCsvError("Please upload a CSV file.");
      setCsvPatients([]);
      setUploadFile(null);
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setCsvError("File size must be less than 10MB.");
      setCsvPatients([]);
      setUploadFile(null);
      return;
    }

    setUploadFile(file);
    setUploadResult(null); // Reset previous results

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          setCsvError("Error parsing CSV file.");
          setCsvPatients([]);
          setUploadFile(null);
        } else {
          setCsvError("");
          setCsvPatients(results.data as any[]);
        }
      },
    });
  };

  const handleBulkOnboard = async () => {
    if (!uploadFile) {
      toast({
        title: "Error",
        description: "Please upload a CSV file first.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      console.log('Uploading file:', uploadFile.name, 'Size:', uploadFile.size);

      const response = await request({
        method: 'post',
        url: '/api/patients/upload-csv',
        data: formData,
      });

      console.log('Upload response:', response);

      if (response && (response as any).error) {
        const err = (response as any).error;
        const errorMsg =
          typeof err === 'string'
            ? err
            : err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string'
            ? (err as any).message
            : JSON.stringify(err) || "Failed to process the upload.";

        toast({
          title: "Upload Failed",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }

      const result = response.data as CsvUploadResponse;
      setUploadResult(result);

      if (result.failureCount === 0) {
        toast({
          title: "Success! 🎉",
          description: `Successfully onboarded all ${result.successCount} patients.`,
        });
        // Reset the form on complete success
        setCsvPatients([]);
        setUploadFile(null);
      } else if (result.successCount === 0) {
        const firstError = result.validationErrors?.[0];
        const errorMessage = firstError
          ? `Row ${firstError.rowNumber}: ${firstError.errors?.[0] || 'Validation error'}`
          : 'Please check the data and try again.';
        toast({
          title: "Upload Failed",
          description: `Failed to onboard any patients. ${errorMessage}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Partial Success ⚠️",
          description: `Successfully onboarded ${result.successCount} patients, but ${result.failureCount} failed.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to process the upload. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setCsvPatients([]);
    setUploadFile(null);
    setUploadResult(null);
    setCsvError("");
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-12">
      <h1 className="text-2xl font-bold mb-4">Patient Bulk Onboarding (CSV)</h1>

      {/* Instructions */}
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Download the CSV template below</li>
            <li>Fill in patient details (required: firstName, lastName, dateOfBirth, gender, mobileNumber, city, pinCode)</li>
            <li>Upload the completed CSV file</li>
            <li>Review the results and fix any errors if needed</li>
          </ol>
        </AlertDescription>
      </Alert>

      {/* Download Template Button */}
      <div className="flex gap-4 mb-4">
        <Button variant="outline" onClick={handleDownloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Download CSV Template
        </Button>
      </div>

      {/* File Upload */}
      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="mb-2"
          disabled={isUploading}
        />
        {uploadFile && (
          <p className="text-sm text-muted-foreground">
            Selected: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      {csvError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{csvError}</AlertDescription>
        </Alert>
      )}

      {/* CSV Preview Table */}
      {csvPatients.length > 0 && !uploadResult && (
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border">
            <thead>
              <tr>
                {Object.keys(csvPatients[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 bg-muted font-bold">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvPatients.slice(0, 10).map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border px-2 py-1">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {csvPatients.length > 10 && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing 10 of {csvPatients.length} rows
            </p>
          )}
          <Button 
            className="mt-4" 
            onClick={handleBulkOnboard} 
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Onboard Patients"}
          </Button>
        </div>
      )}

      {/* Upload Results */}
      {uploadResult && (
        <div className="space-y-4">
          {/* Summary */}
          <Alert variant={uploadResult.failureCount === 0 ? "default" : "destructive"}>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Upload Complete</strong>
              <br />
              Total Rows: {uploadResult.totalRows} | Success: {uploadResult.successCount} | Failed: {uploadResult.failureCount}
            </AlertDescription>
          </Alert>

          {/* Validation Errors */}
          {uploadResult.validationErrors && uploadResult.validationErrors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Failed Registrations ({uploadResult.failureCount})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1 bg-muted">Row</th>
                      <th className="border px-2 py-1 bg-muted">Error Type</th>
                      <th className="border px-2 py-1 bg-muted">Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadResult.validationErrors.map((error, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{error.rowNumber}</td>
                        <td className="border px-2 py-1">
                          <span className="inline-block px-2 py-1 text-xs rounded bg-destructive/10 text-destructive">
                            {error.errorType}
                          </span>
                        </td>
                        <td className="border px-2 py-1">
                          <ul className="list-disc list-inside">
                            {error.errors?.map((err, i) => (
                              <li key={i} className="text-destructive">{err}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reset Button */}
          <Button variant="outline" onClick={resetForm}>
            Upload Another File
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatientBulkOnboarding;