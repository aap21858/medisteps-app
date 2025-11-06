import type { PatientRegistrationRequest } from "@/generated/models/patient-registration-request";
import { BloodGroup } from "@/generated/models/blood-group";
import { Gender } from "@/generated/models/gender";
import { PreferredContactMethod } from "@/generated/models/preferred-contact-method";
import { mockEmergencyContacts } from "./mockEmergencyContact";
import { mockInsurance, mockNoInsurance, mockPrivateInsurance } from "./mockInsurance";
import { mockMedicalHistory, mockMinimalMedicalHistory } from "./mockMedicalHistory";

export const mockPatient: PatientRegistrationRequest = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: undefined,
  bloodGroup: undefined,
  aadharNumber: undefined,
  photoUrl: "",
  mobileNumber: "",
  emailId: "",
  preferredContactMethod: undefined,
  addressLine1: "",
  city: "",
  district: "",
  state: "",
  pinCode: "",
  emergencyContacts: [],
  insurance: undefined,
  medicalHistory: undefined,
};

export const mockMinimalPatient: PatientRegistrationRequest = {
  firstName: "Jane",
  lastName: "Smith",
  dateOfBirth: "1995-05-20",
  gender: Gender.Female,
  mobileNumber: "9876543211",
  city: "Pune",
  pinCode: "411001",
  insurance: mockNoInsurance,
  medicalHistory: mockMinimalMedicalHistory,
};

export const mockPatientWithPrivateInsurance: PatientRegistrationRequest = {
  ...mockPatient,
  firstName: "Robert",
  lastName: "Johnson",
  emailId: "robert.j@example.com",
  insurance: mockPrivateInsurance,
};