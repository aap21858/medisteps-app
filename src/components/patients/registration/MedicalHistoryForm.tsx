import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import type { FormSectionProps } from "./types";

const defaultMedicalHistory = {
  knownAllergies: "",
  currentMedications: "",
  chronicConditions: "",
  pastSurgeries: "",
  familyMedicalHistory: "",
  disability: "",
};

export const MedicalHistoryForm: React.FC<FormSectionProps> = ({
  formData,
  onInputChange,
}) => {
  // Ensure medicalHistory exists with default values
  const medicalHistory = formData.medicalHistory || defaultMedicalHistory;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AllergySection formData={{ ...formData, medicalHistory }} onInputChange={onInputChange} />
        <MedicationsSection formData={{ ...formData, medicalHistory }} onInputChange={onInputChange} />
        <ChronicConditionsSection formData={{ ...formData, medicalHistory }} onInputChange={onInputChange} />
        <MedicalDetailsSection formData={{ ...formData, medicalHistory }} onInputChange={onInputChange} />
      </CardContent>
    </Card>
  );
};

const AllergySection: React.FC<FormSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const medicalHistory = formData.medicalHistory || defaultMedicalHistory;
  
  return (
    <div>
      <Label>Known Allergies *</Label>
      <div className="space-y-2 mt-2">
        {["None Known", "Penicillin", "Sulfa Drugs", "Aspirin", "Ibuprofen", "Latex"].map(
          (allergy) => (
            <div key={allergy} className="flex items-center space-x-2">
              <Checkbox
                id={`allergy-${allergy}`}
                checked={(medicalHistory.knownAllergies || "").includes(allergy)}
                onCheckedChange={(checked) => {
                  const current = medicalHistory.knownAllergies || "";
                  const newAllergies = checked
                    ? (current ? `${current}, ${allergy}` : allergy)
                    : current
                        .split(",")
                        .map((s) => s.trim())
                        .filter((a) => a !== allergy)
                        .join(", ");
                  onInputChange("medicalHistory", { ...medicalHistory, knownAllergies: newAllergies });
                }}
              />
              <Label htmlFor={`allergy-${allergy}`} className="font-normal">
                {allergy}
              </Label>
            </div>
          )
        )}
      </div>
      <Input
        className="mt-2"
        placeholder="Other allergies..."
        value={medicalHistory.chronicConditions || ""}
        onChange={(e) => onInputChange("medicalHistory", { ...medicalHistory, chronicConditions: e.target.value })}
      />
    </div>
  );
};

const MedicationsSection: React.FC<FormSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const medicalHistory = formData.medicalHistory || defaultMedicalHistory;
  
  return (
    <div>
      <Label htmlFor="currentMedications">Current Medications</Label>
      <Textarea
        id="currentMedications"
        value={medicalHistory.currentMedications || ""}
        onChange={(e) => onInputChange("medicalHistory", { ...medicalHistory, currentMedications: e.target.value })}
        placeholder="List all current medications if applicable..."
        rows={3}
      />
    </div>
  );
};

const ChronicConditionsSection: React.FC<FormSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const medicalHistory = formData.medicalHistory || defaultMedicalHistory;
  
  return (
    <div>
      <Label>Chronic Conditions</Label>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {["Diabetes", "Hypertension", "Asthma", "Heart Disease", "Kidney Disease", "Thyroid"].map(
          (condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition}`}
                checked={(medicalHistory.chronicConditions || "").includes(condition)}
                onCheckedChange={(checked) => {
                  const currentConditions = medicalHistory.chronicConditions?.split(',').filter(Boolean) || [];
                  const newConditions = checked
                    ? [...currentConditions, condition]
                    : currentConditions.filter((c) => c !== condition);
                  onInputChange("medicalHistory", { ...medicalHistory, chronicConditions: newConditions.join(',') });
                }}
              />
              <Label htmlFor={`condition-${condition}`} className="font-normal">
                {condition}
              </Label>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const MedicalDetailsSection: React.FC<FormSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const medicalHistory = formData.medicalHistory || defaultMedicalHistory;
  
  return (
    <>
      <div>
        <Label htmlFor="pastSurgeries">Past Surgeries</Label>
        <Textarea
          id="pastSurgeries"
          value={medicalHistory.pastSurgeries || ""}
          onChange={(e) => onInputChange("medicalHistory", { ...medicalHistory, pastSurgeries: e.target.value })}
          placeholder="Year and type of surgery..."
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="familyMedicalHistory">Family Medical History</Label>
        <Textarea
          id="familyMedicalHistory"
          value={medicalHistory.familyMedicalHistory || ""}
          onChange={(e) => onInputChange("medicalHistory", { ...medicalHistory, familyMedicalHistory: e.target.value })}
          placeholder="Hereditary conditions in family..."
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="disability">Disability (if any)</Label>
        <Input
          id="disability"
          value={medicalHistory.disability || ""}
          onChange={(e) => onInputChange("medicalHistory", { ...medicalHistory, disability: e.target.value })}
          placeholder="Physical/Mental disability"
        />
      </div>
    </>
  );
};