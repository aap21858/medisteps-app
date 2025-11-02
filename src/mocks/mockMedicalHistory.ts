import type { MedicalHistoryRequest } from "@/generated/models/medical-history-request";

export const mockMedicalHistory: MedicalHistoryRequest = {
  knownAllergies: "Penicillin, Sulfa Drugs",
  currentMedications: "Metformin 500mg twice daily",
  pastSurgeries: "Appendectomy (2020)",
  chronicConditions: "Type 2 Diabetes, Hypertension",
  familyMedicalHistory: "Father: Diabetes, Mother: Hypertension",
  disability: "",
};

export const mockMinimalMedicalHistory: MedicalHistoryRequest = {
  knownAllergies: "None",
  currentMedications: "",
  pastSurgeries: "",
  chronicConditions: "",
  familyMedicalHistory: "",
  disability: "",
};