import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { patientService } from "@/services/patientService";
import { appointmentService } from "@/services/appointmentService";
import { AppointmentStatus } from "@/generated/models";
import Navigation from "@/components/layout/navigation";
import { getCurrentUser } from "@/lib/authContext";
import { Role } from "@/model/Role";
import {
  PatientHeader,
  CurrentVisitTab,
  RecordVitalsTab,
  MedicalHistoryTab,
  PastAppointmentsTab,
  ExaminationTab,
  OrdersTab,
  MedicalHistoryFormData,
} from "@/components/patient-details";

export default function PatientDetails() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("current-visit");
  const [navTab, setNavTab] = useState("appointments");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isEditingMedicalHistory, setIsEditingMedicalHistory] = useState(false);
  const [isEditingVitals, setIsEditingVitals] = useState(false);
  const [medicalHistoryForm, setMedicalHistoryForm] = useState<MedicalHistoryFormData>({
    knownAllergies: "",
    currentMedications: "",
    chronicConditions: "",
    pastSurgeries: "",
    familyMedicalHistory: "",
    disability: "",
  });
  const userRole = (getCurrentUser()?.roles as Role[]) || [];

  // Fetch patient details
  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientService.getPatientById(Number(patientId)),
    enabled: !!patientId,
  });

  // Fetch all appointments for the patient
  const { data: allAppointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["patient-all-appointments", patientId],
    queryFn: async () => {
      const result = await appointmentService.searchAppointments({
        patientId: Number(patientId),
        size: 50,
      });
      return result.content;
    },
    enabled: !!patientId,
  });

  // Active appointment statuses
  const activeStatuses: AppointmentStatus[] = [
    AppointmentStatus.Confirmed,
    AppointmentStatus.Waiting,
    AppointmentStatus.InConsultation,
    AppointmentStatus.InTreatment,
    AppointmentStatus.Admitted,
  ];

  // Get current/active appointment
  const currentAppointment = useMemo(() => {
    if (!allAppointments) return null;
    return allAppointments.find(
      (apt) => apt.status && activeStatuses.includes(apt.status as AppointmentStatus)
    );
  }, [allAppointments]);

  // Get past appointments - all appointments except the current one
  const pastAppointments = useMemo(() => {
    if (!allAppointments) return [];

    let filtered = allAppointments.filter((apt) => apt.id !== currentAppointment?.id);

    // Apply date filters if set
    if (dateFrom) {
      filtered = filtered.filter((apt) => {
        if (!apt.appointmentDate) return false;
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= dateFrom;
      });
    }
    if (dateTo) {
      filtered = filtered.filter((apt) => {
        if (!apt.appointmentDate) return false;
        const aptDate = new Date(apt.appointmentDate);
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        return aptDate <= endOfDay;
      });
    }

    return filtered;
  }, [allAppointments, currentAppointment, dateFrom, dateTo]);

  // Fetch vitals for current appointment
  const { data: vitals } = useQuery({
    queryKey: ["appointment-vitals", currentAppointment?.id],
    queryFn: () => appointmentService.getVitalsByAppointment(currentAppointment!.id!),
    enabled: !!currentAppointment?.id,
  });

  // Initialize medical history form when patient data loads
  useEffect(() => {
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
  }, [patient]);

  // Loading state
  if (isLoadingPatient) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-64 flex-shrink-0">
          <Navigation
            activeTab={navTab}
            onTabChange={(tab) => {
              setNavTab(tab);
              navigate("/");
            }}
            userRole={userRole}
          />
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Patient not found
  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-64 flex-shrink-0">
          <Navigation
            activeTab={navTab}
            onTabChange={(tab) => {
              setNavTab(tab);
              navigate("/");
            }}
            userRole={userRole}
          />
        </div>
        <div className="flex-1 overflow-auto p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Patient not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-64 flex-shrink-0">
        <Navigation
          activeTab={navTab}
          onTabChange={(tab) => {
            setNavTab(tab);
            navigate("/");
          }}
          userRole={userRole}
        />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Patient Header */}
          <PatientHeader patient={patient} currentAppointment={currentAppointment} />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="current-visit">Current Visit</TabsTrigger>
              <TabsTrigger value="record-vitals">Record Vitals</TabsTrigger>
              <TabsTrigger value="medical-history">Medical History</TabsTrigger>
              <TabsTrigger value="past-appointments">Past Appointments</TabsTrigger>
              <TabsTrigger value="examination">Examination</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            {/* Current Visit Tab */}
            <TabsContent value="current-visit" className="space-y-4">
              <CurrentVisitTab
                patient={patient}
                patientId={patientId!}
                currentAppointment={currentAppointment}
                vitals={vitals}
              />
            </TabsContent>

            {/* Record Vitals Tab */}
            <TabsContent value="record-vitals" className="space-y-4">
              <RecordVitalsTab
                patient={patient}
                patientId={patientId!}
                currentAppointment={currentAppointment}
                vitals={vitals}
                isEditingVitals={isEditingVitals}
                setIsEditingVitals={setIsEditingVitals}
                setActiveTab={setActiveTab}
              />
            </TabsContent>

            {/* Medical History Tab */}
            <TabsContent value="medical-history" className="space-y-4">
              <MedicalHistoryTab
                patient={patient}
                patientId={patientId!}
                isEditingMedicalHistory={isEditingMedicalHistory}
                setIsEditingMedicalHistory={setIsEditingMedicalHistory}
                medicalHistoryForm={medicalHistoryForm}
                setMedicalHistoryForm={setMedicalHistoryForm}
              />
            </TabsContent>

            {/* Past Appointments Tab */}
            <TabsContent value="past-appointments" className="space-y-4">
              <PastAppointmentsTab
                patient={patient}
                patientId={patientId!}
                pastAppointments={pastAppointments}
                isLoading={isLoadingAppointments}
                dateFrom={dateFrom}
                dateTo={dateTo}
                setDateFrom={setDateFrom}
                setDateTo={setDateTo}
              />
            </TabsContent>

            {/* Examination Tab */}
            <TabsContent value="examination" className="space-y-4">
              <ExaminationTab />
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <OrdersTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
