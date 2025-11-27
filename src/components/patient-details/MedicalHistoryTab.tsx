import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, AlertCircle, Pill, Heart, FileText, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { patientService } from "@/services/patientService";
import { MedicalHistoryRequest } from "@/generated/models";
import type { MedicalHistoryTabProps } from "./types";

export default function MedicalHistoryTab({
  patient,
  patientId,
  isEditingMedicalHistory,
  setIsEditingMedicalHistory,
  medicalHistoryForm,
  setMedicalHistoryForm,
}: MedicalHistoryTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update medical history mutation
  const updateMedicalHistoryMutation = useMutation({
    mutationFn: (data: MedicalHistoryRequest) =>
      patientService.updatePatientMedicalHistory(Number(patientId), data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Medical history updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      setIsEditingMedicalHistory(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update medical history",
        variant: "destructive",
      });
    },
  });

  const onSaveMedicalHistory = () => {
    const medicalHistoryRequest: MedicalHistoryRequest = {
      knownAllergies: medicalHistoryForm.knownAllergies
        ? medicalHistoryForm.knownAllergies
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      currentMedications: medicalHistoryForm.currentMedications
        ? medicalHistoryForm.currentMedications
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      chronicConditions: medicalHistoryForm.chronicConditions || undefined,
      pastSurgeries: medicalHistoryForm.pastSurgeries || undefined,
      familyMedicalHistory: medicalHistoryForm.familyMedicalHistory || undefined,
      disability: medicalHistoryForm.disability || undefined,
    };

    updateMedicalHistoryMutation.mutate(medicalHistoryRequest);
  };

  const handleCancel = () => {
    setIsEditingMedicalHistory(false);
    // Reset form to original values
    if (patient?.medicalHistory) {
      setMedicalHistoryForm({
        knownAllergies: patient.medicalHistory.knownAllergies?.join(", ") || "",
        currentMedications: patient.medicalHistory.currentMedications?.join(", ") || "",
        chronicConditions: patient.medicalHistory.chronicConditions || "",
        pastSurgeries: patient.medicalHistory.pastSurgeries || "",
        familyMedicalHistory: patient.medicalHistory.familyMedicalHistory || "",
        disability: patient.medicalHistory.disability || "",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Patient Medical History</CardTitle>
            <CardDescription>Single source of truth - Updated by doctors only</CardDescription>
          </div>
          {!isEditingMedicalHistory && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsEditingMedicalHistory(true)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {patient.medicalHistory ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Known Allergies
                </h3>
                {isEditingMedicalHistory ? (
                  <Textarea
                    value={medicalHistoryForm.knownAllergies}
                    onChange={(e) =>
                      setMedicalHistoryForm({
                        ...medicalHistoryForm,
                        knownAllergies: e.target.value,
                      })
                    }
                    placeholder="Enter allergies, comma-separated"
                    rows={2}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      {patient.medicalHistory.knownAllergies &&
                      patient.medicalHistory.knownAllergies.length > 0
                        ? patient.medicalHistory.knownAllergies.join(", ")
                        : "None recorded"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  Current Medications
                </h3>
                {isEditingMedicalHistory ? (
                  <Textarea
                    value={medicalHistoryForm.currentMedications}
                    onChange={(e) =>
                      setMedicalHistoryForm({
                        ...medicalHistoryForm,
                        currentMedications: e.target.value,
                      })
                    }
                    placeholder="Enter medications, comma-separated"
                    rows={2}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      {patient.medicalHistory.currentMedications &&
                      patient.medicalHistory.currentMedications.length > 0
                        ? patient.medicalHistory.currentMedications.join(", ")
                        : "None recorded"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Chronic Conditions
                </h3>
                {isEditingMedicalHistory ? (
                  <Textarea
                    value={medicalHistoryForm.chronicConditions}
                    onChange={(e) =>
                      setMedicalHistoryForm({
                        ...medicalHistoryForm,
                        chronicConditions: e.target.value,
                      })
                    }
                    placeholder="Enter chronic conditions"
                    rows={2}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      {patient.medicalHistory.chronicConditions || "None recorded"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Past Surgeries
                </h3>
                {isEditingMedicalHistory ? (
                  <Textarea
                    value={medicalHistoryForm.pastSurgeries}
                    onChange={(e) =>
                      setMedicalHistoryForm({
                        ...medicalHistoryForm,
                        pastSurgeries: e.target.value,
                      })
                    }
                    placeholder="Enter past surgeries"
                    rows={2}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      {patient.medicalHistory.pastSurgeries || "None recorded"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Family History
              </h3>
              {isEditingMedicalHistory ? (
                <Textarea
                  value={medicalHistoryForm.familyMedicalHistory}
                  onChange={(e) =>
                    setMedicalHistoryForm({
                      ...medicalHistoryForm,
                      familyMedicalHistory: e.target.value,
                    })
                  }
                  placeholder="Enter family medical history"
                  rows={2}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    {patient.medicalHistory.familyMedicalHistory || "None recorded"}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Disability</h3>
              {isEditingMedicalHistory ? (
                <Textarea
                  value={medicalHistoryForm.disability}
                  onChange={(e) =>
                    setMedicalHistoryForm({
                      ...medicalHistoryForm,
                      disability: e.target.value,
                    })
                  }
                  placeholder="Enter disability information"
                  rows={2}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">{patient.medicalHistory.disability || "None"}</p>
                </div>
              )}
            </div>

            <Separator />

            {isEditingMedicalHistory && (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  className="gap-2"
                  onClick={onSaveMedicalHistory}
                  disabled={updateMedicalHistoryMutation.isPending}
                >
                  <Edit className="h-4 w-4" />
                  {updateMedicalHistoryMutation.isPending
                    ? "Saving..."
                    : "Save Medical History Changes"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No medical history available</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
