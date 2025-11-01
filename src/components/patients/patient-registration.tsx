import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import PhotoUpload from "@/components/ui/photo-upload";
import { User, Heart, Shield, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PatientRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    aadharNumber: "",
    phone: "",
    email: "",
    preferredContactMethod: "",
    address: "",
    city: "",
    pinCode: "",

    // Emergency Contact
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",

    // Insurance Information
    insuranceCoverage: "no",
    insuranceType: "",
    schemeName: "",
    policyNumber: "",
    insuranceProvider: "",
    policyHolderName: "",
    relationshipToHolder: "",
    policyExpiryDate: "",
    claimAmountLimit: "",

    // Medical History
    knownAllergies: [] as string[],
    otherAllergy: "",
    drugAllergies: "",
    foodAllergies: "",
    currentMedications: "",
    chronicConditions: [] as string[],
    pastSurgeries: "",
    familyMedicalHistory: "",
    disability: "",

    // Communication Preferences
    contactMethods: [] as string[],
  });

  const [photoId, setPhotoId] = useState<Blob | null>(null);
  const [insuranceCard, setInsuranceCard] = useState<Blob | null>(null);
  const [pmjayCard, setPmjayCard] = useState<Blob | null>(null);
  const { toast } = useToast();

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (file: Blob) => {
    setPhotoId(file);
    toast({
      title: "Photo uploaded successfully",
      description: "ID photo has been processed and optimized.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.phone ||
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

    // Insurance validation
    if (formData.insuranceCoverage === "yes") {
      if (!formData.insuranceType || !formData.schemeName || !formData.policyNumber) {
        toast({
          title: "Missing insurance information",
          description: "Please fill in all required insurance fields.",
          variant: "destructive",
        });
        return;
      }
    }

    // In a real app, this would submit to the backend
    toast({
      title: "Patient registered successfully",
      description: `${formData.firstName} ${formData.lastName} has been added to the system.`,
    });

    // Reset form would go here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Patient Registration</h1>
          <p className="text-muted-foreground">Add new patient to the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
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
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      value={age}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) =>
                        handleInputChange("bloodGroup", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aadharNumber">Aadhar Number</Label>
                    <Input
                      id="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={(e) =>
                        handleInputChange("aadharNumber", e.target.value)
                      }
                      maxLength={12}
                      placeholder="Enter 12-digit Aadhar number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Mobile Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
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
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div>
                    <Label htmlFor="Preferred Contact Method">Preferred Contact Method *</Label>
                    <Select
                      value={formData.preferredContactMethod}
                      onValueChange={(value) =>
                        handleInputChange("preferredContactMethod", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue defaultValue={'phone'}/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pinCode">Pin Code *</Label>
                    <Input
                      id="pinCode"
                      value={formData.pinCode}
                      onChange={(e) =>
                        handleInputChange("pinCode", e.target.value)
                      }
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Photo Upload</Label>
                  <div className="mt-2">
                    <PhotoUpload onUpload={handlePhotoUpload} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Person Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyName}
                    onChange={(e) =>
                      handleInputChange("emergencyName", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyRelation">Relationship</Label>
                    <Select
                      value={formData.emergencyRelation}
                      onValueChange={(value) =>
                        handleInputChange("emergencyRelation", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Contact Number</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) =>
                        handleInputChange("emergencyPhone", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Insurance Coverage *</Label>
                  <RadioGroup
                    value={formData.insuranceCoverage}
                    onValueChange={(value) =>
                      handleInputChange("insuranceCoverage", value)
                    }
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="insurance-yes" />
                      <Label htmlFor="insurance-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="insurance-no" />
                      <Label htmlFor="insurance-no" className="font-normal">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.insuranceCoverage === "yes" && (
                  <>
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="insuranceType">Insurance Type *</Label>
                        <Select
                          value={formData.insuranceType}
                          onValueChange={(value) =>
                            handleInputChange("insuranceType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="schemeName">Scheme Name *</Label>
                        <Select
                          value={formData.schemeName}
                          onValueChange={(value) =>
                            handleInputChange("schemeName", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select scheme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mjpjay">Mahatma Jyotiba Phule Jan Arogya Yojana (MJPJAY)</SelectItem>
                            <SelectItem value="pmjay">Pradhan Mantri Jan Arogya Yojana (PM-JAY/Ayushman Bharat)</SelectItem>
                            <SelectItem value="esi">Employee State Insurance (ESI)</SelectItem>
                            <SelectItem value="cghs">Central Government Health Scheme (CGHS)</SelectItem>
                            <SelectItem value="rgjay">Rajiv Gandhi Jeevandayee Arogya Yojana (RGJAY)</SelectItem>
                            <SelectItem value="star-health">Star Health</SelectItem>
                            <SelectItem value="icici-lombard">ICICI Lombard</SelectItem>
                            <SelectItem value="hdfc-ergo">HDFC Ergo</SelectItem>
                            <SelectItem value="max-bupa">Max Bupa</SelectItem>
                            <SelectItem value="care-health">Care Health</SelectItem>
                            <SelectItem value="other">Other (specify)</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="policyNumber">Policy/Card Number *</Label>
                        <Input
                          id="policyNumber"
                          value={formData.policyNumber}
                          onChange={(e) =>
                            handleInputChange("policyNumber", e.target.value)
                          }
                          placeholder="Unique identifier"
                        />
                      </div>
                      
                      {formData.insuranceType === "private" && (
                        <div>
                          <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                          <Input
                            id="insuranceProvider"
                            value={formData.insuranceProvider}
                            onChange={(e) =>
                              handleInputChange("insuranceProvider", e.target.value)
                            }
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="policyHolderName">Policy Holder Name</Label>
                        <Input
                          id="policyHolderName"
                          value={formData.policyHolderName}
                          onChange={(e) =>
                            handleInputChange("policyHolderName", e.target.value)
                          }
                          placeholder="If different from patient"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="relationshipToHolder">Relationship to Holder</Label>
                        <Select
                          value={formData.relationshipToHolder}
                          onValueChange={(value) =>
                            handleInputChange("relationshipToHolder", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="self">Self</SelectItem>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
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
                          value={formData.policyExpiryDate}
                          onChange={(e) =>
                            handleInputChange("policyExpiryDate", e.target.value)
                          }
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="claimAmountLimit">Claim Amount Limit (Annual)</Label>
                        <Input
                          id="claimAmountLimit"
                          type="number"
                          value={formData.claimAmountLimit}
                          onChange={(e) =>
                            handleInputChange("claimAmountLimit", e.target.value)
                          }
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label>Insurance Card Upload</Label>
                      <p className="text-sm text-muted-foreground mb-2">Upload front & back (PDF/Image)</p>
                      <PhotoUpload 
                        onUpload={setInsuranceCard}
                        accept="image/*,application/pdf"
                      />
                    </div>

                    <div>
                      <Label>PMJAY/Ayushman Card Upload</Label>
                      <p className="text-sm text-muted-foreground mb-2">If applicable</p>
                      <PhotoUpload 
                        onUpload={setPmjayCard}
                        accept="image/*,application/pdf"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Known Allergies *</Label>
                  <div className="space-y-2 mt-2">
                    {["None Known", "Penicillin", "Sulfa Drugs", "Aspirin", "Ibuprofen", "Latex"].map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={`allergy-${allergy}`}
                          checked={formData.knownAllergies.includes(allergy)}
                          onCheckedChange={(checked) => {
                            const newAllergies = checked
                              ? [...formData.knownAllergies, allergy]
                              : formData.knownAllergies.filter((a) => a !== allergy);
                            setFormData((prev) => ({
                              ...prev,
                              knownAllergies: newAllergies,
                            }));
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
                    placeholder="Other allergies..."
                    value={formData.otherAllergy}
                    onChange={(e) =>
                      handleInputChange("otherAllergy", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications}
                    onChange={(e) =>
                      handleInputChange("currentMedications", e.target.value)
                    }
                    placeholder="List all current medications if applicable..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Chronic Conditions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Diabetes", "Hypertension", "Asthma", "Heart Disease", "Kidney Disease", "Thyroid"].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={`condition-${condition}`}
                          checked={formData.chronicConditions.includes(condition)}
                          onCheckedChange={(checked) => {
                            const newConditions = checked
                              ? [...formData.chronicConditions, condition]
                              : formData.chronicConditions.filter((c) => c !== condition);
                            setFormData((prev) => ({
                              ...prev,
                              chronicConditions: newConditions,
                            }));
                          }}
                        />
                        <Label htmlFor={`condition-${condition}`} className="font-normal">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="pastSurgeries">Past Surgeries</Label>
                  <Textarea
                    id="pastSurgeries"
                    value={formData.pastSurgeries}
                    onChange={(e) =>
                      handleInputChange("pastSurgeries", e.target.value)
                    }
                    placeholder="Year and type of surgery..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="familyMedicalHistory">Family Medical History</Label>
                  <Textarea
                    id="familyMedicalHistory"
                    value={formData.familyMedicalHistory}
                    onChange={(e) =>
                      handleInputChange("familyMedicalHistory", e.target.value)
                    }
                    placeholder="Hereditary conditions in family..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="disability">Disability (if any)</Label>
                  <Input
                    id="disability"
                    value={formData.disability}
                    onChange={(e) =>
                      handleInputChange("disability", e.target.value)
                    }
                    placeholder="Physical/Mental disability"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Register Patient</Button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;
