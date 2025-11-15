import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import type { FormSectionProps } from "./types";

const defaultMedicalHistory = {
  // API now expects arrays for allergies and medications; keep backward-compatibility
  knownAllergies: [] as string[],
  currentMedications: [] as string[],
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
  const raw = formData.medicalHistory || defaultMedicalHistory;
  const knownAllergiesRaw = (raw as any).knownAllergies;
  const medicalHistory = {
    ...defaultMedicalHistory,
    ...raw,
    knownAllergies: Array.isArray(knownAllergiesRaw)
      ? knownAllergiesRaw
      : (typeof knownAllergiesRaw === 'string' && knownAllergiesRaw.length > 0)
      ? (knownAllergiesRaw as string).split(',').map((s: string) => s.trim()).filter(Boolean)
      : [],
  } as typeof defaultMedicalHistory & { knownAllergies: string[] };
  
  const allergyOptions = ["Penicillin", "Sulfa Drugs", "Aspirin", "Ibuprofen", "Latex"];

  // split knownAllergies into those represented by checkboxes and the 'other' free-text ones
  const selectedFromCheckboxes = medicalHistory.knownAllergies.filter((a) => allergyOptions.includes(a));
  const otherAllergies = medicalHistory.knownAllergies.filter((a) => !allergyOptions.includes(a));
  const otherText = otherAllergies.join(", ");

  // Local input state so typing doesn't immediately overwrite existing extras.
  const [otherInput, setOtherInput] = useState(otherText);

  // Keep local input in sync when medicalHistory changes externally
  useEffect(() => {
    setOtherInput(otherText);
  }, [otherText]);

  return (
    <div>
      <Label>Known Allergies *</Label>
      <div className="space-y-2 mt-2">
        {allergyOptions.map((allergy) => (
          <div key={allergy} className="flex items-center space-x-2">
            <Checkbox
              id={`allergy-${allergy}`}
              checked={selectedFromCheckboxes.includes(allergy)}
              onCheckedChange={(checked) => {
                const current = medicalHistory.knownAllergies || [];
                const newAllergies = checked
                  ? Array.from(new Set([...current, allergy]))
                  : current.filter((a) => a !== allergy);
                onInputChange("medicalHistory", { ...raw, knownAllergies: newAllergies });
              }}
            />
            <Label htmlFor={`allergy-${allergy}`} className="font-normal">
              {allergy}
            </Label>
          </div>
        ))}
      </div>

      <Input
        className="mt-2"
        placeholder="Other allergies... (comma separated)"
        value={otherInput}
        onChange={(e) => {
          setOtherInput(e.target.value);
        }}
        onBlur={() => {
          // Parse entries on blur and append to existing otherAllergies
          const text = otherInput;
          const extras = text
            .split(/,|;|\n/)
            .map((s) => s.trim())
            .filter(Boolean);
          const mergedOther = Array.from(new Set([...otherAllergies, ...extras]));
          const newKnown = [...selectedFromCheckboxes, ...mergedOther];
          onInputChange("medicalHistory", { ...raw, knownAllergies: newKnown });
          // reflect merged value in the input
          setOtherInput(mergedOther.join(", "));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // treat Enter like blur: parse and append
            e.preventDefault();
            const text = otherInput;
            const extras = text
              .split(/,|;|\n/)
              .map((s) => s.trim())
              .filter(Boolean);
            const mergedOther = Array.from(new Set([...otherAllergies, ...extras]));
            const newKnown = [...selectedFromCheckboxes, ...mergedOther];
            onInputChange("medicalHistory", { ...raw, knownAllergies: newKnown });
            setOtherInput(mergedOther.join(", "));
          }
        }}
      />
    </div>
  );
};

const MedicationsSection: React.FC<FormSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const raw = formData.medicalHistory || defaultMedicalHistory;
  const currentMedsRaw = (raw as any).currentMedications;
  const medicalHistory = {
    ...defaultMedicalHistory,
    ...raw,
    currentMedications: Array.isArray(currentMedsRaw)
      ? currentMedsRaw
      : (typeof currentMedsRaw === 'string' && currentMedsRaw.length > 0)
      ? [currentMedsRaw as string]
      : [],
  } as typeof defaultMedicalHistory & { currentMedications: string[] };

  const commonMeds = ["Metformin", "Amlodipine", "Losartan", "Aspirin", "Atorvastatin"];
  // separate out any free-text meds (those not in commonMeds)
  const otherMeds = medicalHistory.currentMedications.filter((m) => !commonMeds.includes(m));
  const otherText = otherMeds.join("; ");

  const toggleMed = (med: string, checked: boolean) => {
    const current = medicalHistory.currentMedications || [];
    const withoutOther = current.filter((m) => !otherMeds.includes(m));
    const newList = checked ? [...withoutOther, med] : withoutOther.filter((m) => m !== med);
    // include any other-text entries that user may have
    const finalList = [...newList, ...otherMeds];
    onInputChange("medicalHistory", { ...raw, currentMedications: finalList });
  };

  return (
    <div>
      <Label>Current Medications</Label>
      <div className="space-y-2 mt-2">
        {commonMeds.map((med) => (
          <div key={med} className="flex items-center space-x-2">
            <Checkbox
              id={`med-${med}`}
              checked={medicalHistory.currentMedications.includes(med)}
              onCheckedChange={(checked) => toggleMed(med, !!checked)}
            />
            <Label htmlFor={`med-${med}`} className="font-normal">{med}</Label>
          </div>
        ))}
      </div>

      <Textarea
        className="mt-2"
        placeholder="Other medications (free text)"
        value={otherText}
        onChange={(e) => {
          const text = e.target.value;
          const otherEntries = text
            .split(/;|\n|,/) // split by semicolon, newline or comma
            .map((s) => s.trim())
            .filter(Boolean);
          const base = medicalHistory.currentMedications.filter((m) => commonMeds.includes(m));
          onInputChange("medicalHistory", { ...raw, currentMedications: [...base, ...otherEntries] });
        }}
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