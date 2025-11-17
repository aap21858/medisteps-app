import React from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AppointmentStatus,
  AppointmentType,
  UrgencyLevel,
  StaffResponse,
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

interface AppointmentFiltersProps {
  searchTerm: string;
  filterStatus: string;
  filterPhysician: string;
  filterType: string;
  filterUrgency: string;
  physicians: StaffResponse[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPhysicianChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onUrgencyChange: (value: string) => void;
}

export const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  searchTerm,
  filterStatus,
  filterPhysician,
  filterType,
  filterUrgency,
  physicians,
  onSearchChange,
  onStatusChange,
  onPhysicianChange,
  onTypeChange,
  onUrgencyChange,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Filters */}
          <Select value={filterPhysician} onValueChange={onPhysicianChange}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="All Physicians" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Physicians</SelectItem>
              {physicians.map((physician) => (
                <SelectItem key={physician.id} value={physician.id?.toString() || ""}>
                  {physician.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(AppointmentStatus).map(([key, value]) => (
                <SelectItem key={value} value={value}>
                  {STATUS_CONFIG[value]?.label || value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={AppointmentType.Opd}>OPD</SelectItem>
              <SelectItem value={AppointmentType.Ipd}>IPD</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterUrgency} onValueChange={onUrgencyChange}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="All Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgency</SelectItem>
              {Object.entries(UrgencyLevel).map(([key, value]) => (
                <SelectItem key={value} value={value}>
                  {URGENCY_CONFIG[value]?.label || value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
