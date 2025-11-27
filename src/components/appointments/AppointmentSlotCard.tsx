import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AppointmentResponse,
  AppointmentStatus,
} from "@/generated/models";
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

interface AppointmentSlotCardProps {
  appointment: AppointmentResponse;
  physicianName: string;
  onEdit: (appointment: AppointmentResponse) => void;
  onViewDetails: (appointment: AppointmentResponse) => void;
}

export const AppointmentSlotCard: React.FC<AppointmentSlotCardProps> = ({
  appointment,
  physicianName,
  onEdit,
  onViewDetails,
}) => {
  const statusConfig = STATUS_CONFIG[appointment.status || AppointmentStatus.Draft];

  return (
    <div
      className={cn(
        "p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all",
        "bg-card",
        statusConfig.color.split(" ")[0]
      )}
      onClick={() => onViewDetails(appointment)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{appointment.patientName}</p>
          <p className="text-sm text-muted-foreground truncate">{physicianName}</p>
          {appointment.chiefComplaint && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {appointment.chiefComplaint}
            </p>
          )}
        </div>
        <Badge className={cn("text-xs", statusConfig.color)}>
          {statusConfig.icon}
        </Badge>
      </div>
    </div>
  );
};
