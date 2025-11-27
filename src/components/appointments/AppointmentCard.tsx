import React from "react";
import { parseISO, isToday, isTomorrow, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  Edit,
  XCircle,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  AppointmentResponse,
  AppointmentStatus,
  UrgencyLevel,
} from "@/generated/models";
import { getAllowedNextStatuses } from "./statusUtils";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  [AppointmentStatus.Draft]: {
    color: "bg-gray-500 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "Draft",
  },
  [AppointmentStatus.Confirmed]: {
    color: "bg-blue-500 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "Confirmed",
  },
  [AppointmentStatus.Waiting]: {
    color: "bg-yellow-500 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "Waiting",
  },
  [AppointmentStatus.InConsultation]: {
    color: "bg-indigo-600 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "In Consultation",
  },
  [AppointmentStatus.ToInvoice]: {
    color: "bg-orange-500 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "To Invoice",
  },
  [AppointmentStatus.Completed]: {
    color: "bg-green-600 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "Completed",
  },
  [AppointmentStatus.Cancelled]: {
    color: "bg-red-500 text-white",
    icon: <XCircle className="h-3 w-3" />,
    label: "Cancelled",
  },
  [AppointmentStatus.NoShow]: {
    color: "bg-gray-600 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "No Show",
  },
  [AppointmentStatus.Admitted]: {
    color: "bg-teal-600 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "Admitted",
  },
  [AppointmentStatus.InTreatment]: {
    color: "bg-cyan-600 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "In Treatment",
  },
  [AppointmentStatus.DischargeReady]: {
    color: "bg-lime-600 text-white",
    icon: <FileText className="h-3 w-3" />,
    label: "Discharge Ready",
  },
  [AppointmentStatus.Discharged]: {
    color: "bg-green-700 text-white",
    icon: <FileText className="h-3 w-3" />,
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

interface AppointmentCardProps {
  appointment: AppointmentResponse;
  physicianName: string;
  onEdit: (appointment: AppointmentResponse) => void;
  onViewDetails: (appointment: AppointmentResponse) => void;
  onStatusChange: (appointment: AppointmentResponse, status: AppointmentStatus) => void;
  onCancel: (appointment: AppointmentResponse) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  physicianName,
  onEdit,
  onViewDetails,
  onStatusChange,
  onCancel,
}) => {
  const navigate = useNavigate();
  const aptDate = parseISO(appointment.appointmentDate!);
  const statusConfig = STATUS_CONFIG[appointment.status || AppointmentStatus.Draft];
  const urgencyConfig = URGENCY_CONFIG[appointment.urgencyLevel || UrgencyLevel.Normal];

  const getDateLabel = () => {
    if (isToday(aptDate)) return "Today";
    if (isTomorrow(aptDate)) return "Tomorrow";
    return format(aptDate, "MMM d, yyyy");
  };

  const handlePatientClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (appointment.patientId) {
      window.open(`/patients/${appointment.patientId}`, '_blank');
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left Section */}
          <div className="flex-1 space-y-3">
            {/* Patient Info */}
            <div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3
                  className="font-semibold text-lg hover:text-primary cursor-pointer hover:underline transition-colors flex items-center gap-1"
                  onClick={handlePatientClick}
                >
                  {appointment.patientName}
                  <ExternalLink className="h-3 w-3" />
                </h3>
                {appointment.urgencyLevel !== UrgencyLevel.Normal && (
                  <Badge variant="outline" className={cn("text-xs", urgencyConfig.color)}>
                    {urgencyConfig.label}
                  </Badge>
                )}
              </div>
              {appointment.chiefComplaint && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {appointment.chiefComplaint}
                </p>
              )}
            </div>

            {/* Appointment Details */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{getDateLabel()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {appointment.appointmentTime?.substring(0, 5)} ({appointment.duration || 30}m)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span>{physicianName}</span>
              </div>
            </div>

            {/* Status and Type */}
            <div className="flex items-center gap-2">
              <Badge className={statusConfig.color}>
                {statusConfig.icon}
                <span className="ml-1">{statusConfig.label}</span>
              </Badge>
              <Badge variant="outline">{appointment.appointmentType || "OPD"}</Badge>
              {appointment.consultationRoom && (
                <Badge variant="secondary">{appointment.consultationRoom}</Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onViewDetails(appointment)}>
                <FileText className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(appointment)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              {getAllowedNextStatuses(appointment.status as AppointmentStatus)
                .slice(0, 8)
                .map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => onStatusChange(appointment, status)}
                  >
                    {STATUS_CONFIG[status]?.label || status}
                  </DropdownMenuItem>
                ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onCancel(appointment)}
                className="text-destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
