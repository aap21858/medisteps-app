import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AppointmentFormProps {
  appointment?: any;
  onClose: () => void;
  onSave: (appointmentData: any) => void;
}

// Mock data
const mockDoctors = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Neurology' },
  { id: '3', name: 'Dr. Emily Davis', specialty: 'Pediatrics' },
  { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics' },
];

const mockPatients = [
  { id: '1', name: 'John Smith', phone: '(555) 123-4567' },
  { id: '2', name: 'Mary Johnson', phone: '(555) 234-5678' },
  { id: '3', name: 'Robert Davis', phone: '(555) 345-6789' },
  { id: '4', name: 'Sarah Williams', phone: '(555) 456-7890' },
];

const appointmentTypes = [
  'Consultation',
  'Follow-up',
  'Treatment',
  'Checkup',
  'Emergency',
  'Surgery',
];

const durations = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
];

const statuses = [
  'scheduled',
  'confirmed',
  'checked-in',
  'in-progress',
  'completed',
  'cancelled',
  'no-show'
];

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    doctorId: '',
    date: new Date(),
    time: '',
    duration: 30,
    type: '',
    status: 'scheduled',
    notes: '',
    phone: '',
  });

  const [isNewPatient, setIsNewPatient] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || '',
        patientName: appointment.patientName || '',
        doctorId: appointment.doctorId || '',
        date: appointment.date || new Date(),
        time: appointment.time || '',
        duration: appointment.duration || 30,
        type: appointment.type || '',
        status: appointment.status || 'scheduled',
        notes: appointment.notes || '',
        phone: appointment.phone || '',
      });
    }
  }, [appointment]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'Doctor selection is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time slot is required';
    }

    if (!formData.type) {
      newErrors.type = 'Appointment type is required';
    }

    if (isNewPatient && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for new patients';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handlePatientSelect = (patientId: string) => {
    if (patientId === 'new') {
      setIsNewPatient(true);
      setFormData(prev => ({
        ...prev,
        patientId: '',
        patientName: '',
        phone: ''
      }));
    } else {
      setIsNewPatient(false);
      const patient = mockPatients.find(p => p.id === patientId);
      if (patient) {
        setFormData(prev => ({
          ...prev,
          patientId: patient.id,
          patientName: patient.name,
          phone: patient.phone
        }));
      }
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="patient">Patient</Label>
              <Select 
                value={isNewPatient ? 'new' : formData.patientId} 
                onValueChange={handlePatientSelect}
              >
                <SelectTrigger className={cn(errors.patientName && "border-destructive")}>
                  <SelectValue placeholder="Select or add patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">+ Add New Patient</SelectItem>
                  {mockPatients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.patientName && (
                <p className="text-sm text-destructive mt-1">{errors.patientName}</p>
              )}
            </div>

            {/* New Patient Fields */}
            {isNewPatient && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label htmlFor="patientName">Full Name *</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    className={cn(errors.patientName && "border-destructive")}
                    placeholder="Enter patient name"
                  />
                  {errors.patientName && (
                    <p className="text-sm text-destructive mt-1">{errors.patientName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={cn(errors.phone && "border-destructive")}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Doctor Selection */}
          <div>
            <Label htmlFor="doctor">Doctor *</Label>
            <Select value={formData.doctorId} onValueChange={(value) => setFormData(prev => ({ ...prev, doctorId: value }))}>
              <SelectTrigger className={cn(errors.doctorId && "border-destructive")}>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {mockDoctors.map(doctor => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div>{doctor.name}</div>
                        <div className="text-xs text-muted-foreground">{doctor.specialty}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.doctorId && (
              <p className="text-sm text-destructive mt-1">{errors.doctorId}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(formData.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="time">Time *</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}>
                <SelectTrigger className={cn(errors.time && "border-destructive")}>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && (
                <p className="text-sm text-destructive mt-1">{errors.time}</p>
              )}
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Select 
                value={formData.duration.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durations.map(duration => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Appointment Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Appointment Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className={cn(errors.type && "border-destructive")}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive mt-1">{errors.type}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or special instructions..."
              className="min-h-[80px]"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-medical-primary hover:bg-medical-primary/90">
              {appointment ? 'Update' : 'Create'} Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;