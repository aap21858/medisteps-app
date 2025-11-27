import React, { useMemo, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  Thermometer,
  Heart,
  Droplet,
  Scale,
  TrendingUp,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useToast } from "@/hooks/use-toast";
import { appointmentService } from "@/services/appointmentService";
import { VitalsRequest, VitalsRequestTemperatureUnitEnum } from "@/generated/models";
import { vitalsSchema, VitalsFormData, VitalsTabProps, getBmiStatus, getBmiStatusColor } from "./types";

export default function RecordVitalsTab({
  patient,
  currentAppointment,
  vitals,
  isEditingVitals,
  setIsEditingVitals,
  setActiveTab,
}: VitalsTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const hasExistingVitals = vitals && vitals.length > 0;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VitalsFormData>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      temperatureUnit: VitalsRequestTemperatureUnitEnum.F,
    },
  });

  // Prefill vitals form when existing vitals are loaded
  useEffect(() => {
    if (vitals && vitals.length > 0) {
      const latestVitals = vitals[0];
      reset({
        weight: latestVitals.weight || "",
        height: latestVitals.height || "",
        headCircumference: latestVitals.headCircumference || "",
        temperature: latestVitals.temperature || "",
        temperatureUnit:
          (latestVitals.temperatureUnit as VitalsRequestTemperatureUnitEnum) ||
          VitalsRequestTemperatureUnitEnum.F,
        heartRate: latestVitals.heartRate || "",
        respiratoryRate: latestVitals.respiratoryRate || "",
        systolicBp: latestVitals.systolicBp || "",
        diastolicBp: latestVitals.diastolicBp || "",
        spo2: latestVitals.spo2 || "",
        randomBloodSugar: latestVitals.randomBloodSugar || "",
        painLevel: latestVitals.painLevel || "",
        symptoms: latestVitals.symptoms?.join(", ") || "",
      });
    }
  }, [vitals, reset]);

  const weight = watch("weight");
  const height = watch("height");

  // Auto-calculate BMI
  const bmi = useMemo(() => {
    const w = typeof weight === "number" ? weight : parseFloat(weight as string);
    const h = typeof height === "number" ? height : parseFloat(height as string);
    if (w && h && h > 0) {
      const heightInMeters = h / 100;
      return (w / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  }, [weight, height]);

  const bmiStatus = getBmiStatus(bmi);

  // Record vitals mutation
  const recordVitalsMutation = useMutation({
    mutationFn: (data: VitalsRequest) =>
      appointmentService.recordVitals(currentAppointment!.id!, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: isEditingVitals ? "Vitals updated successfully" : "Vitals recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["appointment-vitals"] });
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      setIsEditingVitals(false);
      setActiveTab("current-visit");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to record vitals",
        variant: "destructive",
      });
    },
  });

  const onSubmitVitals = (data: VitalsFormData) => {
    const vitalsRequest: VitalsRequest = {
      weight: data.weight ? Number(data.weight) : undefined,
      height: data.height ? Number(data.height) : undefined,
      headCircumference: data.headCircumference ? Number(data.headCircumference) : undefined,
      temperature: data.temperature ? Number(data.temperature) : undefined,
      temperatureUnit: data.temperatureUnit as VitalsRequestTemperatureUnitEnum,
      heartRate: data.heartRate ? Number(data.heartRate) : undefined,
      respiratoryRate: data.respiratoryRate ? Number(data.respiratoryRate) : undefined,
      systolicBp: data.systolicBp ? Number(data.systolicBp) : undefined,
      diastolicBp: data.diastolicBp ? Number(data.diastolicBp) : undefined,
      spo2: data.spo2 ? Number(data.spo2) : undefined,
      randomBloodSugar: data.randomBloodSugar ? Number(data.randomBloodSugar) : undefined,
      bmi: bmi ? Number(bmi) : undefined,
      bmiStatus: bmiStatus || undefined,
      painLevel: data.painLevel ? Number(data.painLevel) : undefined,
      symptoms: data.symptoms ? data.symptoms.split(",").map((s) => s.trim()) : undefined,
    };

    recordVitalsMutation.mutate(vitalsRequest);
  };

  const handleCancel = () => {
    if (isEditingVitals) {
      setIsEditingVitals(false);
      // Reset form to existing vitals
      if (vitals && vitals.length > 0) {
        const latestVitals = vitals[0];
        reset({
          weight: latestVitals.weight || "",
          height: latestVitals.height || "",
          headCircumference: latestVitals.headCircumference || "",
          temperature: latestVitals.temperature || "",
          temperatureUnit:
            (latestVitals.temperatureUnit as VitalsRequestTemperatureUnitEnum) ||
            VitalsRequestTemperatureUnitEnum.F,
          heartRate: latestVitals.heartRate || "",
          respiratoryRate: latestVitals.respiratoryRate || "",
          systolicBp: latestVitals.systolicBp || "",
          diastolicBp: latestVitals.diastolicBp || "",
          spo2: latestVitals.spo2 || "",
          randomBloodSugar: latestVitals.randomBloodSugar || "",
          painLevel: latestVitals.painLevel || "",
          symptoms: latestVitals.symptoms?.join(", ") || "",
        });
      }
    } else {
      reset();
      setActiveTab("current-visit");
    }
  };

  const isReadOnly = hasExistingVitals && !isEditingVitals;

  if (!currentAppointment) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No active appointment found. Please create an appointment first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmitVitals)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {hasExistingVitals && !isEditingVitals ? "Patient Vitals" : "Record Vitals"} for{" "}
                {patient?.firstName} {patient?.lastName}
              </CardTitle>
              <CardDescription>
                Appointment: {currentAppointment.appointmentNumber} -{" "}
                {currentAppointment.appointmentDate &&
                  format(parseISO(currentAppointment.appointmentDate), "MMM d, yyyy")}
              </CardDescription>
            </div>
            {hasExistingVitals && !isEditingVitals && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsEditingVitals(true)}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Measurements */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Basic Measurements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("weight")}
                />
                {errors.weight && (
                  <p className="text-xs text-destructive">{errors.weight.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  placeholder="170"
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("height")}
                />
                {errors.height && (
                  <p className="text-xs text-destructive">{errors.height.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="headCircumference">Head Circumference (cm)</Label>
                <Input
                  id="headCircumference"
                  type="number"
                  step="0.1"
                  placeholder="Optional (Pediatric)"
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("headCircumference")}
                />
              </div>
            </div>

            {/* BMI Display */}
            {bmi && (
              <div className="mt-3 p-3 bg-muted rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">BMI: {bmi}</span>
                </div>
                {bmiStatus && (
                  <Badge variant="outline" className={getBmiStatusColor(bmiStatus)}>
                    {bmiStatus}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Temperature */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Temperature
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("temperature")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperatureUnit">Unit</Label>
                <Select
                  defaultValue={VitalsRequestTemperatureUnitEnum.F}
                  onValueChange={(value) => setValue("temperatureUnit", value as any)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className={isReadOnly ? "bg-muted" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={VitalsRequestTemperatureUnitEnum.F}>
                      Fahrenheit (°F)
                    </SelectItem>
                    <SelectItem value={VitalsRequestTemperatureUnitEnum.C}>Celsius (°C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Cardiovascular & Respiratory */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Cardiovascular & Respiratory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="72"
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("heartRate")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate (/min)</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  placeholder="16"
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("respiratoryRate")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systolicBp">Systolic BP (mmHg)</Label>
                <Input
                  id="systolicBp"
                  type="number"
                  placeholder="120"
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("systolicBp")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diastolicBp">Diastolic BP (mmHg)</Label>
                <Input
                  id="diastolicBp"
                  type="number"
                  placeholder="80"
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("diastolicBp")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spo2" className="flex items-center gap-1">
                  <Droplet className="h-3 w-3" />
                  SpO2 (%)
                </Label>
                <Input
                  id="spo2"
                  type="number"
                  placeholder="98"
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("spo2")}
                />
                {errors.spo2 && <p className="text-xs text-destructive">{errors.spo2.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="randomBloodSugar">Random Blood Sugar (mg/dL)</Label>
                <Input
                  id="randomBloodSugar"
                  type="number"
                  placeholder="110"
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("randomBloodSugar")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Pain & Symptoms */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pain & Symptoms
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="painLevel">Pain Level (0-10 scale)</Label>
                <Input
                  id="painLevel"
                  type="number"
                  min="0"
                  max="10"
                  placeholder="0 (No pain) to 10 (Worst pain)"
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("painLevel")}
                />
                {errors.painLevel && (
                  <p className="text-xs text-destructive">{errors.painLevel.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
                <Textarea
                  id="symptoms"
                  placeholder="e.g., Fever, Headache, Cough"
                  rows={3}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                  {...register("symptoms")}
                />
                <p className="text-xs text-muted-foreground">
                  Enter multiple symptoms separated by commas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show buttons only when editing or no vitals exist */}
      {(!hasExistingVitals || isEditingVitals) && (
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || recordVitalsMutation.isPending}>
            {recordVitalsMutation.isPending
              ? "Saving..."
              : isEditingVitals
              ? "Update Vitals"
              : "Record Vitals"}
          </Button>
        </div>
      )}
    </form>
  );
}
