import { AppointmentStatus } from "@/generated/models";

// Mirror server-side allowed transitions
const ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  [AppointmentStatus.Draft]: [AppointmentStatus.Confirmed, AppointmentStatus.Cancelled],
  [AppointmentStatus.Confirmed]: [
    AppointmentStatus.Waiting,
    AppointmentStatus.Cancelled,
    AppointmentStatus.NoShow,
  ],
  [AppointmentStatus.Waiting]: [
    AppointmentStatus.InConsultation,
    AppointmentStatus.Cancelled,
    AppointmentStatus.NoShow,
  ],
  [AppointmentStatus.InConsultation]: [
    AppointmentStatus.ToInvoice,
    AppointmentStatus.Completed,
    AppointmentStatus.Cancelled,
  ],
  [AppointmentStatus.ToInvoice]: [AppointmentStatus.Completed, AppointmentStatus.Cancelled],

  // Terminal / other statuses: no forward transitions
  [AppointmentStatus.Completed]: [],
  [AppointmentStatus.Cancelled]: [],
  [AppointmentStatus.NoShow]: [],

  // Hospital flow statuses - keep empty by default
  [AppointmentStatus.Admitted]: [],
  [AppointmentStatus.InTreatment]: [],
  [AppointmentStatus.DischargeReady]: [],
  [AppointmentStatus.Discharged]: [],
};

export function getAllowedNextStatuses(current: AppointmentStatus): AppointmentStatus[] {
  if (!current) return [];
  // allow noop? UI will exclude current status from options
  return ALLOWED_TRANSITIONS[current] || [];
}

export function isTerminalStatus(status: AppointmentStatus) {
  return (
    status === AppointmentStatus.Completed ||
    status === AppointmentStatus.Cancelled ||
    status === AppointmentStatus.NoShow
  );
}
