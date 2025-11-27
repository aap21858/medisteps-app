import * as z from "zod";
import type { PatientResponse, AppointmentResponse, VitalsResponse } from "@/generated/models";
import { VitalsRequestTemperatureUnitEnum, VitalsRequestBmiStatusEnum } from "@/generated/models";

// Vitals Form Schema
export const vitalsSchema = z.object({
  weight: z.coerce.number().positive("Weight must be positive").optional().or(z.literal("")),
  height: z.coerce.number().positive("Height must be positive").optional().or(z.literal("")),
  headCircumference: z.coerce.number().positive().optional().or(z.literal("")),
  temperature: z.coerce.number().positive().optional().or(z.literal("")),
  temperatureUnit: z.enum(["F", "C"]).optional(),
  heartRate: z.coerce.number().positive().optional().or(z.literal("")),
  respiratoryRate: z.coerce.number().positive().optional().or(z.literal("")),
  systolicBp: z.coerce.number().positive().optional().or(z.literal("")),
  diastolicBp: z.coerce.number().positive().optional().or(z.literal("")),
  spo2: z.coerce.number().min(0).max(100).optional().or(z.literal("")),
  randomBloodSugar: z.coerce.number().positive().optional().or(z.literal("")),
  painLevel: z.coerce.number().min(0).max(10).optional().or(z.literal("")),
  symptoms: z.string().optional(),
});

export type VitalsFormData = z.infer<typeof vitalsSchema>;

// Medical History Form
export interface MedicalHistoryFormData {
  knownAllergies: string;
  currentMedications: string;
  chronicConditions: string;
  pastSurgeries: string;
  familyMedicalHistory: string;
  disability: string;
}

// Common props for tab components
export interface PatientTabProps {
  patient: PatientResponse;
  patientId: string;
}

export interface VitalsTabProps extends PatientTabProps {
  currentAppointment: AppointmentResponse | null;
  vitals: VitalsResponse[] | undefined;
  isEditingVitals: boolean;
  setIsEditingVitals: (value: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export interface MedicalHistoryTabProps extends PatientTabProps {
  isEditingMedicalHistory: boolean;
  setIsEditingMedicalHistory: (value: boolean) => void;
  medicalHistoryForm: MedicalHistoryFormData;
  setMedicalHistoryForm: (form: MedicalHistoryFormData) => void;
}

export interface PastAppointmentsTabProps extends PatientTabProps {
  pastAppointments: AppointmentResponse[];
  isLoading: boolean;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  setDateFrom: (date: Date | undefined) => void;
  setDateTo: (date: Date | undefined) => void;
}

export interface CurrentVisitTabProps extends PatientTabProps {
  currentAppointment: AppointmentResponse | null;
  vitals: VitalsResponse[] | undefined;
}

// BMI utilities
export const getBmiStatus = (bmi: string | null): VitalsRequestBmiStatusEnum | null => {
  if (!bmi) return null;
  const bmiNum = parseFloat(bmi);
  if (bmiNum < 18.5) return VitalsRequestBmiStatusEnum.Underweight;
  if (bmiNum < 25) return VitalsRequestBmiStatusEnum.Normal;
  if (bmiNum < 30) return VitalsRequestBmiStatusEnum.Overweight;
  return VitalsRequestBmiStatusEnum.Obese;
};

export const getBmiStatusColor = (status: string | null): string => {
  switch (status) {
    case VitalsRequestBmiStatusEnum.Underweight:
      return "bg-yellow-100 text-yellow-800";
    case VitalsRequestBmiStatusEnum.Normal:
      return "bg-green-100 text-green-800";
    case VitalsRequestBmiStatusEnum.Overweight:
      return "bg-orange-100 text-orange-800";
    case VitalsRequestBmiStatusEnum.Obese:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
