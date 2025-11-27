import {
  FileText,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Droplet,
  Scale,
  TrendingUp,
  TestTube,
  AlertCircle,
  Pill,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CurrentVisitTabProps } from "./types";

export default function CurrentVisitTab({
  patient,
  currentAppointment,
  vitals,
}: CurrentVisitTabProps) {
  return (
    <div className="space-y-4">
      {/* Chief Complaint */}
      {currentAppointment?.chiefComplaint && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Chief Complaint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{currentAppointment.chiefComplaint}</p>
          </CardContent>
        </Card>
      )}

      {/* Today's Vitals */}
      {vitals && vitals.length > 0 && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Today's Vitals
            </CardTitle>
            <CardDescription>
              {vitals[0].systolicBp && vitals[0].diastolicBp && (
                <span>
                  BP {vitals[0].systolicBp}/{vitals[0].diastolicBp},{" "}
                </span>
              )}
              {vitals[0].temperature && (
                <span>
                  {" "}
                  Temp {vitals[0].temperature}°{vitals[0].temperatureUnit},{" "}
                </span>
              )}
              {vitals[0].heartRate && <span> HR {vitals[0].heartRate}, </span>}
              {vitals[0].respiratoryRate && <span> RR {vitals[0].respiratoryRate}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vitals[0].systolicBp && vitals[0].diastolicBp && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">Blood Pressure</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {vitals[0].systolicBp}/{vitals[0].diastolicBp}
                  </p>
                  <p className="text-xs text-muted-foreground">mmHg</p>
                </div>
              )}
              {vitals[0].temperature && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Thermometer className="h-4 w-4" />
                    <span className="text-xs">Temperature</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {vitals[0].temperature}°{vitals[0].temperatureUnit}
                  </p>
                </div>
              )}
              {vitals[0].heartRate && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs">Heart Rate</span>
                  </div>
                  <p className="text-lg font-semibold">{vitals[0].heartRate}</p>
                  <p className="text-xs text-muted-foreground">bpm</p>
                </div>
              )}
              {vitals[0].respiratoryRate && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wind className="h-4 w-4" />
                    <span className="text-xs">Respiratory Rate</span>
                  </div>
                  <p className="text-lg font-semibold">{vitals[0].respiratoryRate}</p>
                  <p className="text-xs text-muted-foreground">/min</p>
                </div>
              )}
              {vitals[0].spo2 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplet className="h-4 w-4" />
                    <span className="text-xs">SpO2</span>
                  </div>
                  <p className="text-lg font-semibold">{vitals[0].spo2}%</p>
                </div>
              )}
              {vitals[0].weight && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Scale className="h-4 w-4" />
                    <span className="text-xs">Weight</span>
                  </div>
                  <p className="text-lg font-semibold">{vitals[0].weight} kg</p>
                </div>
              )}
              {vitals[0].bmi && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">BMI</span>
                  </div>
                  <p className="text-lg font-semibold">{vitals[0].bmi}</p>
                  {vitals[0].bmiStatus && (
                    <Badge variant="outline" className="text-xs">
                      {vitals[0].bmiStatus}
                    </Badge>
                  )}
                </div>
              )}
              {vitals[0].randomBloodSugar && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TestTube className="h-4 w-4" />
                    <span className="text-xs">Blood Sugar</span>
                  </div>
                  <p className="text-lg font-semibold">{vitals[0].randomBloodSugar}</p>
                  <p className="text-xs text-muted-foreground">mg/dL</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symptoms */}
      {vitals && vitals.length > 0 && vitals[0].symptoms && vitals[0].symptoms.length > 0 && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {vitals[0].symptoms.map((symptom, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                  {symptom}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medical History Alert - if review required */}
      {patient.medicalHistory && (
        <Card className="border-l-4 border-l-amber-500 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <AlertCircle className="h-5 w-5" />
              Medical History Review
            </CardTitle>
            <CardDescription className="text-amber-800">
              Important medical information for current visit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {patient.medicalHistory.knownAllergies &&
              patient.medicalHistory.knownAllergies.length > 0 && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-amber-900">Allergies:</span>
                    <p className="text-sm text-amber-800">
                      {patient.medicalHistory.knownAllergies.join(", ")}
                    </p>
                  </div>
                </div>
              )}
            {patient.medicalHistory.currentMedications &&
              patient.medicalHistory.currentMedications.length > 0 && (
                <div className="flex items-start gap-2">
                  <Pill className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-amber-900">Current Medications:</span>
                    <p className="text-sm text-amber-800">
                      {patient.medicalHistory.currentMedications.join(", ")}
                    </p>
                  </div>
                </div>
              )}
            {patient.medicalHistory.chronicConditions && (
              <div className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-amber-900">Chronic Conditions:</span>
                  <p className="text-sm text-amber-800">
                    {patient.medicalHistory.chronicConditions}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
