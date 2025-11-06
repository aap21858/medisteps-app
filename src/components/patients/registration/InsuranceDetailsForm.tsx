import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import type { DropdownLookupResponse } from "@/generated/models/dropdown-lookup-response";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PhotoUpload from "@/components/ui/photo-upload";
import type { FormSectionProps } from "./types";
import { InsuranceType } from "@/generated/models/insurance-type";
import { Relationship } from "@/generated/models/relationship";
import type { InsuranceRequest } from "@/generated/models/insurance-request";

interface InsuranceDetailsFormProps extends FormSectionProps {
  onInsuranceCardUpload: (file: Blob) => void;
  onPmjayCardUpload: (file: Blob) => void;
  // Optional bulk updater for insurance object to allow atomic updates
  onBulkChange?: (updates: Partial<InsuranceRequest>) => void;
}

const defaultInsurance: InsuranceRequest = {
  hasInsurance: false,
  insuranceType: InsuranceType.None,
  schemeId: 0,
  policyCardNumber: "",
  policyHolderName: "",
  relationshipToHolder: Relationship.Self,
  policyExpiryDate: "",
  claimAmountLimit: undefined,
  insuranceCardFrontUrl: "",
  insuranceCardBackUrl: "",
  pmjayCardUrl: "",
};

export const InsuranceDetailsForm: React.FC<InsuranceDetailsFormProps> = ({
  formData,
  onInputChange,
  onInsuranceCardUpload,
  onPmjayCardUpload,
}) => {
  // Initialize insurance object if it doesn't exist
  const insurance = formData.insurance || defaultInsurance;

  const handleInsuranceChange = (field: string, value: any) => {
    onInputChange("insurance", {
      ...insurance,
      [field]: value,
    });
  };

  // Allows applying multiple insurance updates in one call to avoid
  // sequential updates that can overwrite each other due to stale snapshots.
  const handleInsuranceBulkChange = (updates: Partial<InsuranceRequest>) => {
    onInputChange("insurance", {
      ...insurance,
      ...updates,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Insurance Coverage *</Label>
          <RadioGroup
            value={insurance.hasInsurance ? "yes" : "no"}
            onValueChange={(value) => handleInsuranceChange("hasInsurance", value === "yes")}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="insurance-yes" />
              <Label htmlFor="insurance-yes" className="font-normal">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="insurance-no" />
              <Label htmlFor="insurance-no" className="font-normal">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {insurance.hasInsurance && (
          <InsuranceForm
            formData={{ ...formData, insurance }}
            onInputChange={handleInsuranceChange}
            onBulkChange={handleInsuranceBulkChange}
            onInsuranceCardUpload={onInsuranceCardUpload}
            onPmjayCardUpload={onPmjayCardUpload}
          />
        )}
      </CardContent>
    </Card>
  );
};

const InsuranceForm: React.FC<InsuranceDetailsFormProps> = ({
  formData,
  onInputChange,
  onBulkChange,
  onInsuranceCardUpload,
  onPmjayCardUpload,
}) => {
  const [dropdownOptions, setDropdownOptions] = useState<DropdownLookupResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const api = useAuthorizedApi();
  const insurance = formData.insurance || defaultInsurance;

  const fetchDropdownOptions = async (type: string) => {
    try {
      setLoading(true);
      const response = await api.request({
        method: 'GET',
        url: `/api/dropdowns/type/${type}`,
        params: { active: true }
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        setDropdownOptions(response.data as DropdownLookupResponse[]);
      } else {
        setDropdownOptions([]);
      }
    } catch (error) {
      setDropdownOptions([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!insurance || !insurance.insuranceType) {
      setDropdownOptions([]);
      return;
    }

    if (insurance.insuranceType === InsuranceType.Government) {
      fetchDropdownOptions('INSURANCE_SCHEME');
    } else if (insurance.insuranceType === InsuranceType.Private) {
      fetchDropdownOptions('INSURANCE_PROVIDER');
    } else {
      setDropdownOptions([]);
    }
  }, [insurance.insuranceType]);

  const handleInsuranceTypeChange = (value: string) => {

    if (onBulkChange) {
      onBulkChange({ insuranceType: value as any, schemeId: 0 });
    } else {
      onInputChange("insuranceType", value);
      onInputChange("schemeId", 0);
    }

    if (value === InsuranceType.Government) {
      fetchDropdownOptions('INSURANCE_SCHEME');
    } else if (value === InsuranceType.Private) {
      fetchDropdownOptions('INSURANCE_PROVIDER');
    } else {
      setDropdownOptions([]);
    }
  };

  return (
    <>
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="insuranceType">Insurance Type *</Label>
          <Select
            value={insurance.insuranceType || InsuranceType.Government}
            onValueChange={handleInsuranceTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={InsuranceType.Government}>Government</SelectItem>
              <SelectItem value={InsuranceType.Private}>Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {insurance.insuranceType !== InsuranceType.None && (
          <div>
            <Label htmlFor="schemeProvider">
              {insurance.insuranceType === InsuranceType.Government ? 'Scheme Name *' : 'Insurance Provider *'}
            </Label>
            <Select
              value={insurance.schemeId?.toString() ?? ""}
              onValueChange={(value) => onInputChange("schemeId", parseInt(value, 10))}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  insurance.insuranceType === InsuranceType.Government
                    ? "Select scheme"
                    : "Select provider"
                } />
              </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="__loading" disabled>
                      Loading options...
                    </SelectItem>
                  ) : (
                    dropdownOptions.map((option, idx) => (
                      <SelectItem key={option.id ?? idx} value={option.id != null ? option.id.toString() : `__opt_${idx}`}>
                        {option.description}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="policyNumber">Policy/Card Number *</Label>
          <Input
            id="policyNumber"
            value={insurance.policyCardNumber || ""}
            onChange={(e) => onInputChange("policyCardNumber", e.target.value)}
            placeholder="Unique identifier"
          />
        </div>
      </div> */}

      <PolicyDetails formData={{ ...formData, insurance }} onInputChange={onInputChange} />

      <Separator />

      <div>
        <Label>Insurance Card Upload</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Upload front & back (PDF/Image)
        </p>
        <PhotoUpload onUpload={onInsuranceCardUpload} accept="image/*,application/pdf" />
      </div>

      <div>
        <Label>PMJAY/Ayushman Card Upload</Label>
        <p className="text-sm text-muted-foreground mb-2">If applicable</p>
        <PhotoUpload onUpload={onPmjayCardUpload} accept="image/*,application/pdf" />
      </div>
    </>
  );
};

const PolicyDetails: React.FC<FormSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const insurance = formData.insurance || defaultInsurance;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="policyNumber">Policy/Card Number *</Label>
          <Input
            id="policyNumber"
            value={insurance.policyCardNumber || ""}
            onChange={(e) => onInputChange("policyCardNumber", e.target.value)}
            placeholder="Unique identifier"
          />
        </div>
        <div>
          <Label htmlFor="policyHolderName">Policy Holder Name</Label>
          <Input
            id="policyHolderName"
            value={insurance.policyHolderName || ""}
            onChange={(e) => onInputChange("policyHolderName", e.target.value)}
            placeholder="If different from patient"
          />
        </div>

        <div>
          <Label htmlFor="relationshipToHolder">Relationship to Holder</Label>
          <Select
            value={insurance.relationshipToHolder || Relationship.Self}
            onValueChange={(value) => onInputChange("relationshipToHolder", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Relationship.Self}>Self</SelectItem>
              <SelectItem value={Relationship.Spouse}>Spouse</SelectItem>
              <SelectItem value={Relationship.Child}>Child</SelectItem>
              <SelectItem value={Relationship.Parent}>Parent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="policyExpiryDate">Policy Expiry Date</Label>
          <Input
            id="policyExpiryDate"
            type="date"
            value={insurance.policyExpiryDate || ""}
            onChange={(e) => onInputChange("policyExpiryDate", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="claimAmountLimit">Claim Amount Limit (Annual)</Label>
          <Input
            id="claimAmountLimit"
            type="number"
            value={insurance.claimAmountLimit?.toString() || ""}
            onChange={(e) => onInputChange("claimAmountLimit", parseInt(e.target.value, 10))}
            placeholder="Enter amount"
          />
        </div>
      </div>
    </>
  );
};