import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Heart, Shield, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import { PersonalInfoForm } from "./registration/PersonalInfoForm";
import { EmergencyContactForm } from "./registration/EmergencyContactForm";
import { InsuranceDetailsForm } from "./registration/InsuranceDetailsForm";
import { MedicalHistoryForm } from "./registration/MedicalHistoryForm";
import {
  PatientRegistrationRequest,
  BatchPatientResponse,
  PatientResponse,
} from "@/generated";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockMinimalPatient } from "@/mocks/mockPatient";

interface ApiResponse {
  data?: BatchPatientResponse;
  error?: {
    message: string;
    validationErrors?: string[];
  };
  status?: number;
}

interface PatientRegistrationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (patient: PatientResponse) => void;
}

export const PatientRegistrationDialog: React.FC<PatientRegistrationDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<PatientRegistrationRequest>(mockMinimalPatient);
  const [photoId, setPhotoId] = useState<Blob | null>(null);
  const [insuranceCard, setInsuranceCard] = useState<Blob | null>(null);
  const [pmjayCard, setPmjayCard] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const api = useAuthorizedApi();

  // Calculate age from date of birth
  const age = useMemo(() => {
    if (!formData.dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  }, [formData.dateOfBirth]);

  const handleInputChange = (field: string, value: any) => {
    if (field === "emergencyContacts" && Array.isArray(value)) {
      setFormData((prev) => ({ ...prev, [field]: value }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (file: Blob) => {
    setPhotoId(file);
    toast({
      title: "Photo uploaded successfully",
      description: "ID photo has been processed and optimized.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.mobileNumber ||
      !formData.city ||
      !formData.pinCode
    ) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      });
      return;
    }

    // Emergency contacts validation
    if (formData.emergencyContacts && formData.emergencyContacts.length > 0) {
      const invalidContacts = formData.emergencyContacts.filter(
        (contact) => contact.contactPersonName && !contact.contactNumber
      );
      if (invalidContacts.length > 0) {
        toast({
          title: "Incomplete emergency contacts",
          description:
            "Please fill in all required fields for emergency contacts or remove incomplete entries.",
          variant: "destructive",
        });
        return;
      }
    }

    // Insurance validation
    if (formData.insurance?.hasInsurance) {
      if (
        !formData.insurance.insuranceType ||
        !formData.insurance.schemeId ||
        !formData.insurance.policyHolderName
      ) {
        toast({
          title: "Missing insurance information",
          description: "Please fill in all required insurance fields.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const response = (await api.request({
        method: "POST",
        url: "/api/patients",
        data: [formData],
      })) as ApiResponse;

      if ((response.status === 200 || response.status === 201) && response.data) {
        if (response.data.successCount === 1) {
          const patientResponse = response.data.successfulRegistrations?.[0];
          if (patientResponse) {
            toast({
              title: "Patient registered successfully",
              description: `Patient ID: ${patientResponse.patientId || ""} - ${formData.firstName} ${
                formData.lastName
              } has been saved successfully.`,
            });

            // Call onSuccess with the patient data
            onSuccess(patientResponse as PatientResponse);

            // Reset form
            setFormData(mockMinimalPatient);
            setPhotoId(null);
            setInsuranceCard(null);
            setPmjayCard(null);
          }
        } else if (response.data.failedRegistrations?.length) {
          const errors = response.data.failedRegistrations.map(
            (failure) => `${failure.errorMessage || "Unknown error"}`
          );
          toast({
            title: "Registration failed",
            description: errors.join("\n"),
            variant: "destructive",
          });
        }
      } else {
        const validationErrors = response.error?.validationErrors;
        if (validationErrors && validationErrors.length > 0) {
          toast({
            title: "Validation Error",
            description: validationErrors.join("\n"),
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration failed",
            description: response.error?.message || "Failed to register patient. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to register patient. Please try again.";
      const validationErrors = error.response?.data?.validationErrors;

      if (validationErrors && validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors.join("\n"),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(mockMinimalPatient);
    setPhotoId(null);
    setInsuranceCard(null);
    setPmjayCard(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Patient Registration</h2>
              <DialogDescription>Add new patient to the system</DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Emergency
              </TabsTrigger>
              <TabsTrigger value="insurance" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Insurance
              </TabsTrigger>
              <TabsTrigger value="medical" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Medical
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalInfoForm
                formData={formData}
                onInputChange={handleInputChange}
                age={age}
                onPhotoUpload={handlePhotoUpload}
              />
            </TabsContent>

            <TabsContent value="emergency">
              <EmergencyContactForm formData={formData} onInputChange={handleInputChange} />
            </TabsContent>

            <TabsContent value="insurance">
              <InsuranceDetailsForm
                formData={formData}
                onInputChange={handleInputChange}
                onInsuranceCardUpload={setInsuranceCard}
                onPmjayCardUpload={setPmjayCard}
              />
            </TabsContent>

            <TabsContent value="medical">
              <MedicalHistoryForm formData={formData} onInputChange={handleInputChange} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
