import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import PhotoUpload from "@/components/ui/photo-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { FormSectionProps } from "./types";
import { BloodGroup, Gender, PreferredContactMethod } from "@/generated";

interface PersonalInfoFormProps extends FormSectionProps {
  age: string;
  onPhotoUpload: (file: Blob) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  onInputChange,
  age,
  onPhotoUpload,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => onInputChange("firstName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => onInputChange("lastName", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => onInputChange("dateOfBirth", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" value={age} disabled className="bg-muted" />
          </div>
          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => onInputChange("gender", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Gender.Male}>Male</SelectItem>
                <SelectItem value={Gender.Female}>Female</SelectItem>
                <SelectItem value={Gender.Other}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Select
              value={formData.bloodGroup}
              onValueChange={(value) => onInputChange("bloodGroup", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BloodGroup.A}>A+</SelectItem>
                <SelectItem value={BloodGroup.A2}>A-</SelectItem>
                <SelectItem value={BloodGroup.B}>B+</SelectItem>
                <SelectItem value={BloodGroup.B2}>B-</SelectItem>
                <SelectItem value={BloodGroup.Ab}>AB+</SelectItem>
                <SelectItem value={BloodGroup.Ab2}>AB-</SelectItem>
                <SelectItem value={BloodGroup.O}>O+</SelectItem>
                <SelectItem value={BloodGroup.O2}>O-</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ContactInformation formData={formData} onInputChange={onInputChange} />
        <AddressSection formData={formData} onInputChange={onInputChange} />

        <Separator />

        <div>
          <Label>Photo Upload</Label>
          <div className="mt-2">
            <PhotoUpload onUpload={onPhotoUpload} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ContactInformation: React.FC<FormSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="aadharNumber">Aadhar Number</Label>
          <Input
            id="aadharNumber"
            value={formData.aadharNumber}
            onChange={(e) => onInputChange("aadharNumber", e.target.value)}
            maxLength={12}
            placeholder="Enter 12-digit Aadhar number"
          />
        </div>
        <div>
          <Label htmlFor="phone">Mobile Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => onInputChange("mobileNumber", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email ID</Label>
          <Input
            id="email"
            type="email"
            value={formData.emailId}
            onChange={(e) => onInputChange("emailId", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="Preferred Contact Method">
            Preferred Contact Method *
          </Label>
          <Select
            value={formData.preferredContactMethod}
            onValueChange={(value) =>
              onInputChange("preferredContactMethod", value)
            }
            required
          >
            <SelectTrigger>
              <SelectValue defaultValue={"phone"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PreferredContactMethod.Sms}>SMS</SelectItem>
              <SelectItem value={PreferredContactMethod.Email}>Email</SelectItem>
              <SelectItem value={PreferredContactMethod.PhoneCall}>Phone</SelectItem>
              <SelectItem value={PreferredContactMethod.Whatsapp}>WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

const AddressSection: React.FC<FormSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <>
      <Separator />
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.addressLine1}
          onChange={(e) => onInputChange("addressLine1", e.target.value)}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => onInputChange("city", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="pinCode">Pin Code *</Label>
          <Input
            id="pinCode"
            value={formData.pinCode}
            onChange={(e) => onInputChange("pinCode", e.target.value)}
            maxLength={6}
            required
          />
        </div>
      </div>
    </>
  );
};