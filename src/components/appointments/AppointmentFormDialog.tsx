import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Clock, Search, AlertCircle, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

// UI Components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Services
import { appointmentService } from '@/services/appointmentService';
import { patientService } from '@/services/patientService';
import { staffService } from '@/services/staffService';
import { PatientRegistrationDialog } from '@/components/patients/PatientRegistrationDialog';

// Generated Models
import {
  AppointmentRequest,
  AppointmentType,
  UrgencyLevel,
  AppointmentResponse,
  PatientResponse,
  PatientPageResponse,
  StaffResponse,
} from '@/generated/models';
import { RoleEnum } from '@/model/Role';

// Form validation schema
const formSchema = z.object({
  patientId: z.number().min(1, 'Patient is required'),
  appointmentType: z.enum(['OPD', 'IPD']).default('OPD'),
  appointmentDate: z.date({
    required_error: 'Appointment date is required',
  }),
  appointmentTime: z.string().min(1, 'Appointment time is required'),
  duration: z.number().min(15).max(480).default(30),
  departmentId: z.number().optional(),
  physicianId: z.number().min(1, 'Physician is required'),
  consultationRoom: z.string().optional(),
  urgencyLevel: z.enum([UrgencyLevel.Normal, UrgencyLevel.Urgent, UrgencyLevel.Emergency]).default(UrgencyLevel.Normal),
  chiefComplaint: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Time slots
const TIME_SLOTS = [
  '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00',
  '12:00:00', '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00',
  '15:00:00', '15:30:00', '16:00:00', '16:30:00', '17:00:00',
];

// Consultation rooms
const CONSULTATION_ROOMS = [
  'Room 101',
  'Room 102',
  'Room 103',
  'Room 201',
  'Room 202',
  'Room 203',
];

interface AppointmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: AppointmentResponse | null;
}

export const AppointmentFormDialog: React.FC<AppointmentFormDialogProps> = ({
  open,
  onClose,
  onSuccess,
  editData,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [patientSearchInput, setPatientSearchInput] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [debounceMs] = useState(300);
  const [selectedPatient, setSelectedPatient] = useState<PatientResponse | null>(null);
  const [showNewPatientDialog, setShowNewPatientDialog] = useState(false);
  const [patientPopoverOpen, setPatientPopoverOpen] = useState(false);

  // Debounce the search input so we don't hammer the API
  useEffect(() => {
    const t = setTimeout(() => setPatientSearch(patientSearchInput.trim()), debounceMs);
    return () => clearTimeout(t);
  }, [patientSearchInput, debounceMs]);

  // Fetch patients based on debounced search (select -> return only array of patients)
  const {
    data: patients = [],
    isLoading: patientsLoading,
  } = useQuery<PatientPageResponse, unknown, PatientResponse[]>({
    queryKey: ['patients', patientSearch],
    queryFn: () => patientService.searchPatients(patientSearch, 0, 20),
    enabled: patientSearch.length >= 2,
    select: (data) => data?.content || [],
  });

  // Fetch staff/physicians
  const { data: staffData } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffService.getAllStaff(),
  });

  const physicians = (staffData || []).filter(
    (staff) =>
      staff.roles?.includes(RoleEnum.DOCTOR)
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: 0,
      appointmentType: 'OPD',
      appointmentDate: new Date(),
      appointmentTime: '',
      duration: 30,
      physicianId: 0,
      urgencyLevel: UrgencyLevel.Normal,
      chiefComplaint: '',
      notes: '',
    },
  });

  // Load edit data
  useEffect(() => {
    if (editData && open) {
      form.reset({
        patientId: editData.patientId || 0,
        appointmentType: (editData.appointmentType as 'OPD' | 'IPD') || 'OPD',
        appointmentDate: editData.appointmentDate ? new Date(editData.appointmentDate) : new Date(),
        appointmentTime: editData.appointmentTime || '',
        duration: editData.duration || 30,
        departmentId: editData.departmentId,
        physicianId: editData.physicianId || 0,
        consultationRoom: editData.consultationRoom,
        urgencyLevel: (editData.urgencyLevel as UrgencyLevel) || UrgencyLevel.Normal,
        chiefComplaint: editData.chiefComplaint,
        notes: editData.notes,
      });

      // selectedPatient will be loaded via separate query (see below)
    } else if (!editData && open) {
      // Reset form for new appointment
      form.reset({
        patientId: 0,
        appointmentType: 'OPD',
        appointmentDate: new Date(),
        appointmentTime: '',
        duration: 30,
        physicianId: 0,
        urgencyLevel: UrgencyLevel.Normal,
        chiefComplaint: '',
        notes: '',
      });
      setSelectedPatient(null);
    }
  }, [editData, open, form]);

  // If editing, fetch canonical patient details by id instead of synthesizing
  const { data: editPatient } = useQuery({
    queryKey: ['patient', editData?.patientId],
    queryFn: () => (editData?.patientId ? patientService.getPatientById(editData.patientId) : Promise.resolve(null)),
    enabled: Boolean(editData?.patientId && open),
  });

  useEffect(() => {
    if (editPatient) {
      setSelectedPatient(editPatient as PatientResponse);
    }
  }, [editPatient]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const requestData: AppointmentRequest = {
        patientId: values.patientId,
        physicianId: values.physicianId,
        appointmentDate: format(values.appointmentDate, 'yyyy-MM-dd'),
        appointmentTime: values.appointmentTime,
        appointmentType: values.appointmentType as AppointmentType,
        duration: values.duration,
        departmentId: values.departmentId,
        consultationRoom: values.consultationRoom,
        urgencyLevel: values.urgencyLevel as UrgencyLevel,
        chiefComplaint: values.chiefComplaint,
        notes: values.notes,
      };

      if (editData?.id) {
        await appointmentService.updateAppointment(editData.id, requestData);
        toast({
          title: 'Success',
          description: 'Appointment updated successfully',
        });
      } else {
        await appointmentService.createAppointment(requestData);
        toast({
          title: 'Success',
          description: 'Appointment created successfully',
        });
      }

      onSuccess();
      onClose();
      form.reset();
      setSelectedPatient(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save appointment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Appointment' : 'New Appointment'}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? 'Update the appointment details below'
              : 'Fill in the details to schedule a new appointment'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Patient *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewPatientDialog(true)}
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New Patient
                </Button>
              </div>
              <Popover open={patientPopoverOpen} onOpenChange={setPatientPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'w-full justify-between',
                      !selectedPatient && 'text-muted-foreground'
                    )}
                  >
                    {selectedPatient ? (
                      <span>
                        {selectedPatient.firstName} {selectedPatient.lastName} (
                        {selectedPatient.patientId})
                      </span>
                    ) : (
                      'Search and select patient...'
                    )}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search by name, ID, or mobile..."
                      value={patientSearchInput}
                      onValueChange={setPatientSearchInput}
                    />
                    <CommandEmpty>
                      {patientsLoading
                        ? 'Searching…'
                        : patientSearchInput.length < 2
                        ? 'Type at least 2 characters to search...'
                        : 'No patient found.'}
                    </CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {patientsLoading && patientSearchInput.length >= 2 && (
                        <div className="px-2 py-3 text-sm text-muted-foreground">
                          Searching for patients...
                        </div>
                      )}
                      {!patientsLoading && patients.map((patient) => (
                        <CommandItem
                          key={patient.id}
                          value={`${patient.firstName} ${patient.lastName} ${patient.patientId} ${patient.mobileNumber}`}
                          onSelect={() => {
                            setSelectedPatient(patient);
                            form.setValue('patientId', patient.id || 0);
                            // Close the popover after selection
                            setPatientPopoverOpen(false);
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col flex-1">
                                <span className="font-medium">
                                  {patient.firstName} {patient.lastName}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {patient.patientId} • {patient.mobileNumber}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-0.5 text-right ml-4">
                                {patient.age && <div>Age: {patient.age}</div>}
                                {patient.gender && <div>{patient.gender}</div>}
                                {patient.bloodGroup && <div>{patient.bloodGroup}</div>}
                              </div>
                            </div>
                            {patient.city && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {patient.city}{patient.district && `, ${patient.district}`}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {form.formState.errors.patientId && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {form.formState.errors.patientId.message}
                </p>
              )}
            </div>

            {/* Appointment Type and Urgency */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="OPD">OPD (Outpatient)</SelectItem>
                        <SelectItem value="IPD">IPD (Inpatient)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgencyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency Level *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UrgencyLevel.Normal}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Normal
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value={UrgencyLevel.Urgent}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-orange-100 text-orange-800">
                              Urgent
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value={UrgencyLevel.Emergency}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              Emergency
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Physician Selection */}
            <FormField
              control={form.control}
              name="physicianId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physician *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select physician" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {physicians.map((physician) => (
                        <SelectItem
                          key={physician.id}
                          value={physician.id?.toString() || ''}
                        >
                          <div className="flex flex-col">
                            <span>{physician.fullName}</span>
                            {/* <span className="text-xs text-muted-foreground">
                              {physician.roles?.join(', ')}
                            </span> */}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {time.substring(0, 5)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Duration and Room */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes) *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultationRoom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Room</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONSULTATION_ROOMS.map((room) => (
                          <SelectItem key={room} value={room}>
                            {room}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Department ID (Optional) */}
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department ID (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter department ID"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : undefined;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty if not applicable
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chief Complaint */}
            <FormField
              control={form.control}
              name="chiefComplaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Complaint</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Patient's main reason for visit..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description of the patient's primary concern
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Internal notes for staff reference
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? editData
                    ? 'Updating...'
                    : 'Creating...'
                  : editData
                  ? 'Update Appointment'
                  : 'Create Appointment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      {/* New Patient Dialog */}
      <PatientRegistrationDialog
        open={showNewPatientDialog}
        onClose={() => setShowNewPatientDialog(false)}
        onSuccess={(patient) => {
          setSelectedPatient(patient);
          form.setValue('patientId', patient.id || 0);
          setShowNewPatientDialog(false);
        }}
      />
    </Dialog>
  );
};
