import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, addDays, isSameDay, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { cn } from '@/lib/utils';
import AppointmentForm from './appointment-form';

// Mock data for doctors and appointments
const mockDoctors = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', color: 'bg-primary' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Neurology', color: 'bg-secondary' },
  { id: '3', name: 'Dr. Emily Davis', specialty: 'Pediatrics', color: 'bg-accent' },
  { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics', color: 'bg-medical-blue' },
];

const mockAppointments = [
  {
    id: '1',
    patientName: 'John Smith',
    doctorId: '1',
    date: new Date(),
    time: '09:00',
    duration: 30,
    status: 'scheduled',
    type: 'Consultation'
  },
  {
    id: '2',
    patientName: 'Mary Johnson',
    doctorId: '2',
    date: new Date(),
    time: '10:30',
    duration: 60,
    status: 'checked-in',
    type: 'Follow-up'
  },
  {
    id: '3',
    patientName: 'Robert Davis',
    doctorId: '1',
    date: addDays(new Date(), 1),
    time: '14:00',
    duration: 45,
    status: 'scheduled',
    type: 'Treatment'
  },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
];

const AppointmentScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date()));
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const getAppointmentsForDate = (date: Date) => {
    return mockAppointments.filter(apt => isSameDay(apt.date, date));
  };

  const getAppointmentsForSlot = (date: Date, time: string, doctorId?: string) => {
    return mockAppointments.filter(apt => 
      isSameDay(apt.date, date) && 
      apt.time === time && 
      (!doctorId || apt.doctorId === doctorId)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-medical-blue text-white';
      case 'checked-in': return 'bg-medical-green text-white';
      case 'in-progress': return 'bg-medical-orange text-white';
      case 'completed': return 'bg-medical-success text-white';
      case 'cancelled': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredAppointments = mockAppointments.filter(apt => {
    const matchesDoctor = selectedDoctor === 'all' || apt.doctorId === selectedDoctor;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mockDoctors.find(d => d.id === apt.doctorId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDoctor && matchesSearch;
  });

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setShowAppointmentForm(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowAppointmentForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Appointment Scheduling</h2>
          <p className="text-muted-foreground">Manage patient appointments and doctor schedules</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('calendar')}
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              <Filter className="h-4 w-4" />
              List
            </Button>
          </div>
          
          <Button onClick={handleNewAppointment} className="bg-medical-primary hover:bg-medical-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients or doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {mockDoctors.map(doctor => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {view === 'calendar' ? (
        /* Calendar View */
        <div className="space-y-4">
          {/* Week Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                >
                  Previous Week
                </Button>
                
                <h3 className="text-lg font-semibold">
                  {format(currentWeek, 'MMMM yyyy')} - Week of {format(currentWeek, 'MMM d')}
                </h3>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                >
                  Next Week
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header Row */}
                <div className="grid grid-cols-8 border-b">
                  <div className="p-4 font-medium bg-muted">Time</div>
                  {weekDays.map(day => (
                    <div key={day.toISOString()} className="p-4 text-center border-l">
                      <div className="font-medium">{format(day, 'EEE')}</div>
                      <div className={cn(
                        "text-sm mt-1 w-8 h-8 mx-auto rounded-full flex items-center justify-center",
                        isSameDay(day, new Date()) && "bg-primary text-primary-foreground"
                      )}>
                        {format(day, 'd')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {timeSlots.map(time => (
                  <div key={time} className="grid grid-cols-8 border-b hover:bg-muted/50">
                    <div className="p-3 text-sm text-muted-foreground bg-muted/50 border-r">
                      {time}
                    </div>
                    {weekDays.map(day => {
                      const appointments = getAppointmentsForSlot(day, time);
                      return (
                        <div key={`${day.toISOString()}-${time}`} className="p-1 border-l min-h-[60px]">
                          {appointments.map(apt => {
                            const doctor = mockDoctors.find(d => d.id === apt.doctorId);
                            return (
                              <div
                                key={apt.id}
                                className={cn(
                                  "p-2 rounded text-xs cursor-pointer mb-1 transition-colors",
                                  getStatusColor(apt.status)
                                )}
                                onClick={() => handleEditAppointment(apt)}
                              >
                                <div className="font-medium truncate">{apt.patientName}</div>
                                <div className="truncate opacity-90">{doctor?.name}</div>
                                <div className="flex items-center gap-1 opacity-90">
                                  <Clock className="h-3 w-3" />
                                  {apt.duration}m
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <CardTitle>Appointment List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No appointments found matching your criteria.
                </div>
              ) : (
                filteredAppointments.map(apt => {
                  const doctor = mockDoctors.find(d => d.id === apt.doctorId);
                  return (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleEditAppointment(apt)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <div className="font-medium">{apt.patientName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <User className="h-3 w-3" />
                            {doctor?.name}
                          </div>
                        </div>
                        
                        <div className="flex flex-col">
                          <div className="text-sm">{format(apt.date, 'MMM d, yyyy')}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {apt.time} ({apt.duration}m)
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(apt.status)}>
                          {apt.status}
                        </Badge>
                        <Badge variant="outline">
                          {apt.type}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointment Form Dialog */}
      {showAppointmentForm && (
        <AppointmentForm
          appointment={selectedAppointment}
          onClose={() => setShowAppointmentForm(false)}
          onSave={(appointmentData) => {
            // Handle save logic here
            console.log('Saving appointment:', appointmentData);
            setShowAppointmentForm(false);
          }}
        />
      )}
    </div>
  );
};

export default AppointmentScheduler;