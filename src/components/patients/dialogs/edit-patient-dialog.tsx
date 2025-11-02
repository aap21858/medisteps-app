import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import { PatientRegistrationRequest, PatientResponse, PatientManagementApi } from "@/generated";
import { Relationship } from "@/generated/models/relationship";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "../registration/PersonalInfoForm";
import { EmergencyContactForm } from "../registration/EmergencyContactForm";
import { InsuranceDetailsForm } from "../registration/InsuranceDetailsForm";
import { MedicalHistoryForm } from "../registration/MedicalHistoryForm";
import { ApiResponse, isApiErrorResponse } from "@/lib/api-types";

interface EditPatientDialogProps {
  patient: PatientResponse;
  open: boolean;
  onClose: () => void;
  onPatientUpdated: () => void;
}

export const EditPatientDialog: React.FC<EditPatientDialogProps> = ({
  patient,
  open,
  onClose,
  onPatientUpdated,
}) => {
  // Convert PatientResponse to PatientRegistrationRequest format
  const convertToRegistrationRequest = (patient: PatientResponse) => {
    return {
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      dateOfBirth: patient.dateOfBirth || "",
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      aadharNumber: patient.aadharNumber,
      photoUrl: patient.photoUrl || "",
      mobileNumber: patient.mobileNumber || "",
      emailId: patient.emailId || "",
      preferredContactMethod: patient.preferredContactMethod,
      addressLine1: patient.addressLine1 || "",
      city: patient.city || "",
      district: patient.district || "",
      state: patient.state || "",
      pinCode: patient.pinCode || "",
      emergencyContacts: patient.emergencyContacts?.map(contact => ({
        contactPersonName: contact.contactNumber || "",
        relationship: contact.relationship as Relationship,
        contactNumber: contact.contactNumber || ""
      })) || [],
      insurance: {
        hasInsurance: patient.insurance?.hasInsurance || false,
        insuranceType: patient.insurance?.insuranceType,
        policyHolderName: patient.insurance?.policyHolderName || "",
        schemeId: Number(patient.insurance?.schemeId) || 0,
        insuranceCardFrontUrl: patient.insurance?.insuranceCardFrontUrl || "",
        insuranceCardBackUrl: patient.insurance?.insuranceCardBackUrl || "",
        pmjayCardUrl: patient.insurance?.pmjayCardUrl || "",
      },
      medicalHistory: {
        knownAllergies: patient.medicalHistory?.knownAllergies || "",
        currentMedications: patient.medicalHistory?.currentMedications || "",
        chronicConditions: patient.medicalHistory?.chronicConditions || "",
        pastSurgeries: patient.medicalHistory?.pastSurgeries || "",
        familyMedicalHistory: patient.medicalHistory?.familyMedicalHistory || "",
        disability: patient.medicalHistory?.disability || ""
      }
    };
  };

  const [formData, setFormData] = useState(convertToRegistrationRequest(patient));
  const [calculatedAge, setCalculatedAge] = useState(patient.age?.toString() || "");
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [insuranceCardBlob, setInsuranceCardBlob] = useState<Blob | null>(null);
  const [pmjayCardBlob, setPmjayCardBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const api = useAuthorizedApi();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const response = await api.request({
        method: 'PUT',
        url: `/api/patients/${patient.id}`,
        data: formData
      }) as ApiResponse<PatientResponse>;

      if (response.status === 200) {
        toast({
          title: "Patient updated successfully",
          description: `${formData.firstName} ${formData.lastName}'s information has been updated.`,
        });
        onPatientUpdated();
      } else if (isApiErrorResponse(response)) {
        throw new Error(response.error.message);
      }
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update patient information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalInfoForm
                formData={formData}
                onInputChange={handleInputChange}
                age={calculatedAge}
                onPhotoUpload={setPhotoBlob}
              />
            </TabsContent>

            <TabsContent value="emergency">
              <EmergencyContactForm
                formData={formData}
                onInputChange={handleInputChange}
              />
            </TabsContent>

            <TabsContent value="insurance">
              <InsuranceDetailsForm
                formData={formData}
                onInputChange={handleInputChange}
                onInsuranceCardUpload={setInsuranceCardBlob}
                onPmjayCardUpload={setPmjayCardBlob}
              />
            </TabsContent>

            <TabsContent value="medical">
              <MedicalHistoryForm
                formData={formData}
                onInputChange={handleInputChange}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};