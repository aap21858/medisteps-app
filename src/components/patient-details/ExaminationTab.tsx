import { Stethoscope, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ExaminationTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Examination & Diagnosis
        </CardTitle>
        <CardDescription>Current visit examination details</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This tab will show examination findings, diagnosis, and treatment plan for the
            current visit. Integrated with active appointment context.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
