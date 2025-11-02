import type { InsuranceRequest } from "@/generated/models/insurance-request";
import { InsuranceType } from "@/generated/models/insurance-type";
import { Relationship } from "@/generated/models/relationship";

export const mockInsurance: InsuranceRequest = {
  hasInsurance: true,
  insuranceType: InsuranceType.Government,
  schemeId: 1, // Assuming 1 is for PMJAY
  policyCardNumber: "PMJAY123456789",
  policyHolderName: "John Doe",
  relationshipToHolder: Relationship.Self,
  policyExpiryDate: "2026-12-31",
  insuranceCardFrontUrl: "https://example.com/card-front.jpg",
  insuranceCardBackUrl: "https://example.com/card-back.jpg",
  pmjayCardUrl: "https://example.com/pmjay-card.jpg",
  claimAmountLimit: 500000,
};

export const mockPrivateInsurance: InsuranceRequest = {
  hasInsurance: true,
  insuranceType: InsuranceType.Private,
  schemeId: 10, // Assuming 10 is for Star Health
  policyCardNumber: "STAR987654321",
  policyHolderName: "Jane Doe",
  relationshipToHolder: Relationship.Spouse,
  policyExpiryDate: "2026-03-31",
  insuranceCardFrontUrl: "https://example.com/private-front.jpg",
  insuranceCardBackUrl: "https://example.com/private-back.jpg",
  claimAmountLimit: 1000000,
};

export const mockNoInsurance: InsuranceRequest = {
  hasInsurance: false,
  insuranceType: InsuranceType.None,
};