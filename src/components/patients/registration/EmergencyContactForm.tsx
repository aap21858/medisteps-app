import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, CheckCircle2 } from "lucide-react";
import type { FormSectionProps } from "./types";
import { Relationship } from "@/generated/models/relationship";
import type { EmergencyContactRequest } from "@/generated/models/emergency-contact-request";

export const EmergencyContactForm: React.FC<FormSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const handleAddContact = () => {
    const newContact: EmergencyContactRequest = {
      contactPersonName: "",
      relationship: Relationship.Other,
      contactNumber: "",
      isPrimary: formData.emergencyContacts?.length === 0 || false,
    };
    
    onInputChange("emergencyContacts", [
      ...(formData.emergencyContacts || []),
      newContact,
    ]);
  };

  const handleUpdateContact = (index: number, field: keyof EmergencyContactRequest, value: any) => {
    const updatedContacts = [...(formData.emergencyContacts || [])];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value,
    };
    onInputChange("emergencyContacts", updatedContacts);
  };

  const handleRemoveContact = (index: number) => {
    const updatedContacts = formData.emergencyContacts?.filter((_, i) => i !== index);
    onInputChange("emergencyContacts", updatedContacts);
  };

  const handleSetPrimary = (index: number) => {
    const updatedContacts = formData.emergencyContacts?.map((contact, i) => ({
      ...contact,
      isPrimary: i === index,
    }));
    onInputChange("emergencyContacts", updatedContacts);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Emergency Contacts</CardTitle>
        <Button
          onClick={handleAddContact}
          variant="outline"
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Contact
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.emergencyContacts?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No emergency contacts added. Click the button above to add one.
          </p>
        )}
        
        {formData.emergencyContacts?.map((contact, index) => (
          <div key={index}>
            {index > 0 && <Separator className="my-6" />}
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Contact {index + 1}</h4>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={contact.isPrimary ? "text-primary" : "text-muted-foreground"}
                  onClick={() => handleSetPrimary(index)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {contact.isPrimary ? "Primary" : "Set as Primary"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleRemoveContact(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Contact Person Name</Label>
                <Input
                  value={contact.contactPersonName}
                  onChange={(e) => handleUpdateContact(index, "contactPersonName", e.target.value)}
                  placeholder="Full name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Relationship</Label>
                  <Select
                    value={contact.relationship}
                    onValueChange={(value) => handleUpdateContact(index, "relationship", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(Relationship).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Contact Number</Label>
                  <Input
                    type="tel"
                    value={contact.contactNumber}
                    onChange={(e) => handleUpdateContact(index, "contactNumber", e.target.value)}
                    placeholder="Mobile number"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};