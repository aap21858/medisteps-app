import React from "react";
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

interface AppointmentWeekCardProps {
  appointment: AppointmentResponse;
  physicianName: string;
  onClick: () => void;
}

export const AppointmentWeekCard: React.FC<AppointmentWeekCardProps> = ({
  appointment,
  physicianName,
  onClick,
}) => {
  const statusConfig = STATUS_CONFIG[appointment.status || AppointmentStatus.Draft];

  return (
    <div
      className={cn(
        "p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity",
        statusConfig.color
      )}
      onClick={onClick}
    >
      <p className="font-medium truncate">{appointment.patientName}</p>
      <p className="text-[10px] opacity-90 truncate mt-0.5">
        {appointment.duration || 30}m
      </p>
    </div>
  );
};
