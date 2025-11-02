import type { EmergencyContactRequest } from "@/generated/models/emergency-contact-request";
import { Relationship } from "@/generated/models/relationship";

export const mockEmergencyContact: EmergencyContactRequest = {
  contactPersonName: "John Doe",
  relationship: Relationship.Spouse,
  contactNumber: "9876543210",
  isPrimary: true,
};

export const mockEmergencyContacts: EmergencyContactRequest[] = [
  mockEmergencyContact,
  {
    contactPersonName: "Jane Smith",
    relationship: Relationship.Parent,
    contactNumber: "9876543211",
    isPrimary: false,
  },
];