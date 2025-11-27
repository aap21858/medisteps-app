import { format, parseISO } from "date-fns";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Activity,
  FileText,
  Droplet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PatientResponse, AppointmentResponse } from "@/generated/models";

interface PatientHeaderProps {
  patient: PatientResponse;
  currentAppointment: AppointmentResponse | null;
}

export default function PatientHeader({ patient, currentAppointment }: PatientHeaderProps) {
  const calculateAge = (dateOfBirth: string) => {
    return Math.floor(
      (new Date().getTime() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950 dark:to-background">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  ID: {patient.patientId}
                </span>
                <span className="flex items-center gap-1">
                  {patient.gender === "MALE" ? "♂" : patient.gender === "FEMALE" ? "♀" : "⚧"}
                  {patient.gender}
                </span>
                {patient.dateOfBirth && (
                  <span className="flex items-center gap-1">
                    {format(parseISO(patient.dateOfBirth), "MMM d, yyyy")}
                    <span className="text-xs">({calculateAge(patient.dateOfBirth)} yrs)</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              variant="outline"
              className={`px-3 py-1 ${
                patient.gender === "MALE"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : patient.gender === "FEMALE"
                  ? "bg-pink-50 text-pink-700 border-pink-200"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }`}
            >
              {patient.gender === "MALE" ? "♂ Male" : patient.gender === "FEMALE" ? "♀ Female" : "Other"}
            </Badge>
            {patient.bloodGroup && (
              <Badge variant="secondary" className="bg-red-50 text-red-700">
                <Droplet className="h-3 w-3 mr-1" />
                {patient.bloodGroup}
              </Badge>
            )}
          </div>
        </div>

        {/* Contact Info Row */}
        <div className="mt-4 pt-4 border-t flex flex-wrap gap-6 text-sm">
          {patient.mobileNumber && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{patient.mobileNumber}</span>
            </div>
          )}
          {patient.emailId && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{patient.emailId}</span>
            </div>
          )}
          {(patient.city || patient.state) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{[patient.city, patient.state].filter(Boolean).join(", ")}</span>
            </div>
          )}
          {currentAppointment && (
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="default" className="gap-1">
                <Activity className="h-3 w-3" />
                Active: {currentAppointment.status}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
