import { PatientRegistrationRequest } from "@/generated";

export interface PatientFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  aadharNumber: string;
  phone: string;
  email: string;
  preferredContactMethod: string;
  address: string;
  city: string;
  pinCode: string;

  // Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;

  // Insurance Information
  insuranceCoverage: "yes" | "no";
  insuranceType: string;
  schemeName: string;
  policyNumber: string;
  insuranceProvider: string;
  policyHolderName: string;
  relationshipToHolder: string;
  policyExpiryDate: string;
  claimAmountLimit: string;

  // Medical History
  knownAllergies: string[];
  otherAllergy: string;
  drugAllergies: string;
  foodAllergies: string;
  currentMedications: string;
  chronicConditions: string[];
  pastSurgeries: string;
  familyMedicalHistory: string;
  disability: string;

  // Communication Preferences
  contactMethods: string[];
}

export interface FormSectionProps {
  formData: PatientRegistrationRequest;
  onInputChange: (field: string, value: any) => void;
}