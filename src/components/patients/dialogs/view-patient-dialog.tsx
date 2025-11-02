import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatientResponse } from "@/generated";
import { format } from "date-fns";

interface ViewPatientDialogProps {
  patient: PatientResponse;
  open: boolean;
  onClose: () => void;
}

export const ViewPatientDialog: React.FC<ViewPatientDialogProps> = ({
  patient,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Patient Details</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Patient ID:</span> {patient.patientId}
              </div>
              <div>
                <span className="font-medium">Name:</span>{" "}
                {`${patient.firstName} ${patient.lastName}`}
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span>{" "}
                {patient.dateOfBirth && format(new Date(patient.dateOfBirth), "PPP")}
              </div>
              <div>
                <span className="font-medium">Age:</span> {patient.age}
              </div>
              <div>
                <span className="font-medium">Gender:</span> {patient.gender}
              </div>
              <div>
                <span className="font-medium">Blood Group:</span>{" "}
                {patient.bloodGroup}
              </div>
              <div>
                <span className="font-medium">Mobile:</span> {patient.mobileNumber}
              </div>
              <div>
                <span className="font-medium">Email:</span> {patient.emailId}
              </div>
              <div>
                <span className="font-medium">Address:</span>{" "}
                {`${patient.addressLine1}, ${patient.city}, ${patient.district}, ${patient.state} - ${patient.pinCode}`}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <div className="space-y-4">
              {patient.emergencyContacts?.map((contact, index) => (
                <div key={index} className="space-y-2">
                  <div>
                    <span className="font-medium text-muted-foreground">Name:</span>{" "}
                    {contact.contactPersonName}
                  </div>
                  <div>
                    <span className="font-medium">Relationship:</span>{" "}
                    {contact.relationship}
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Mobile:</span>{" "}
                    {contact.contactNumber}
                  </div>
                </div>
              ))}
            </div>

            {patient.insurance?.hasInsurance && (
              <>
                <h3 className="text-lg font-semibold mb-4 mt-6">
                  Insurance Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {patient.insurance.insuranceType}
                  </div>
                  <div>
                    <span className="font-medium">Policy Holder:</span>{" "}
                    {patient.insurance.policyHolderName}
                  </div>
                  <div>
                    <span className="font-medium">Scheme ID:</span>{" "}
                    {patient.insurance.schemeId}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {patient.medicalHistory && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Medical History</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Known Allergies:</span>{" "}
                  {patient.medicalHistory.knownAllergies || "None"}
                </div>
                <div>
                  <span className="font-medium">Current Medications:</span>{" "}
                  {patient.medicalHistory.currentMedications || "None"}
                </div>
                <div>
                  <span className="font-medium">Chronic Conditions:</span>{" "}
                  {patient.medicalHistory.chronicConditions || "None"}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Past Surgeries:</span>{" "}
                  {patient.medicalHistory.pastSurgeries || "None"}
                </div>
                <div>
                  <span className="font-medium">Family Medical History:</span>{" "}
                  {patient.medicalHistory.familyMedicalHistory || "None"}
                </div>
                <div>
                  <span className="font-medium">Disability:</span>{" "}
                  {patient.medicalHistory.disability || "None"}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
};