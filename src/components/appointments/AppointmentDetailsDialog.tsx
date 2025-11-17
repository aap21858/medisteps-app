import React from "react";
import { format, parseISO } from "date-fns";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AppointmentResponse,
  AppointmentStatus,
  UrgencyLevel,
} from "@/generated/models";
import { getAllowedNextStatuses } from "./statusUtils";
import { FileText, XCircle, Timer, Activity, Stethoscope, CheckCircle2, AlertCircle } from "lucide-react";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  [AppointmentStatus.Draft]: {
    color: "bg-gray-500 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "Draft",
  },
  [AppointmentStatus.Confirmed]: {
    color: "bg-blue-500 text-white",
    icon: <CheckCircle2 className="h-3 w-3" />,
    label: "Confirmed",
  },
  [AppointmentStatus.Waiting]: {
    color: "bg-yellow-500 text-white",
    icon: <Timer className="h-3 w-3" />,
    label: "Waiting",
  },
  [AppointmentStatus.InTriage]: {
    color: "bg-purple-500 text-white",
    icon: <Activity className="h-3 w-3" />,
    label: "In Triage",
  },
  [AppointmentStatus.InConsultation]: {
    color: "bg-indigo-600 text-white",
    icon: <Stethoscope className="h-3 w-3" />,
    label: "In Consultation",
  },
  [AppointmentStatus.ToInvoice]: {
    color: "bg-orange-500 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "To Invoice",
  },
  [AppointmentStatus.Completed]: {
    color: "bg-green-600 text-white",
    icon: <CheckCircle2 className="h-3 w-3" />,
    label: "Completed",
  },
  [AppointmentStatus.Cancelled]: {
    color: "bg-red-500 text-white",
    icon: <XCircle className="h-3 w-3" />,
    label: "Cancelled",
  },
  [AppointmentStatus.NoShow]: {
    color: "bg-gray-600 text-white",
    icon: <AlertCircle className="h-3 w-3" />,
    label: "No Show",
  },
  [AppointmentStatus.Admitted]: {
    color: "bg-teal-600 text-white",
    icon: <Activity className="h-3 w-3" />,
    label: "Admitted",
  },
  [AppointmentStatus.InTreatment]: {
    color: "bg-cyan-600 text-white",
    icon: <Activity className="h-3 w-3" />,
    label: "In Treatment",
  },
  [AppointmentStatus.DischargeReady]: {
    color: "bg-lime-600 text-white",
    icon: <CheckCircle2 className="h-3 w-3" />,
    label: "Discharge Ready",
  },
  [AppointmentStatus.Discharged]: {
    color: "bg-green-700 text-white",
    icon: <CheckCircle2 className="h-3 w-3" />,
    label: "Discharged",
  },
};

const URGENCY_CONFIG: Record<string, { color: string; label: string }> = {
  [UrgencyLevel.Normal]: {
    color: "bg-green-100 text-green-800 border-green-300",
    label: "Normal",
  },
  [UrgencyLevel.Urgent]: {
    color: "bg-orange-100 text-orange-800 border-orange-300",
    label: "Urgent",
  },
  [UrgencyLevel.Emergency]: {
    color: "bg-red-100 text-red-800 border-red-300",
    label: "Emergency",
  },
};

interface AppointmentDetailsDialogProps {
  appointment: AppointmentResponse;
  physicianName: string;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onStatusChange: (status: AppointmentStatus) => void;
}

export const AppointmentDetailsDialog: React.FC<AppointmentDetailsDialogProps> = ({
  appointment,
  physicianName,
  open,
  onClose,
  onEdit,
  onStatusChange,
}) => {
  const aptDate = parseISO(appointment.appointmentDate!);
  const statusConfig = STATUS_CONFIG[appointment.status || AppointmentStatus.Draft];
  const urgencyConfig = URGENCY_CONFIG[appointment.urgencyLevel || UrgencyLevel.Normal];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            Appointment ID: {appointment.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Actions */}
          <div className="flex items-center justify-between">
            <Badge className={statusConfig.color}>
              {statusConfig.icon}
              <span className="ml-1">{statusConfig.label}</span>
            </Badge>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          <Separator />

          {/* Patient Information */}
          <div>
            <h3 className="font-semibold mb-3">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Patient Name</p>
                <p className="font-medium">{appointment.patientName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Urgency Level</p>
                <Badge variant="outline" className={urgencyConfig.color}>
                  {urgencyConfig.label}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appointment Details */}
          <div>
            <h3 className="font-semibold mb-3">Appointment Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">{format(aptDate, "MMMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="font-medium">{appointment.appointmentTime?.substring(0, 5)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">{appointment.duration || 30} minutes</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">{appointment.appointmentType || "OPD"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Physician</p>
                <p className="font-medium">{physicianName}</p>
              </div>
              {appointment.consultationRoom && (
                <div>
                  <p className="text-muted-foreground">Room</p>
                  <p className="font-medium">{appointment.consultationRoom}</p>
                </div>
              )}
            </div>
          </div>

          {/* Chief Complaint */}
          {appointment.chiefComplaint && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Chief Complaint</h3>
                <p className="text-sm">{appointment.chiefComplaint}</p>
              </div>
            </>
          )}

          {/* Notes */}
          {appointment.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
              </div>
            </>
          )}

          {/* Quick Status Change */}
          <div>
            <h3 className="font-semibold mb-3">Quick Status Change</h3>
            <div className="flex flex-wrap gap-2">
              {getAllowedNextStatuses(appointment.status as AppointmentStatus).map((status) => {
                const config = STATUS_CONFIG[status];
                return (
                  <Button
                    key={status}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onStatusChange(status);
                      onClose();
                    }}
                  >
                    {config.icon}
                    <span className="ml-2">{config.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
