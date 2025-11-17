import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
} from "lucide-react";
import {
  format,
  addDays,
  subDays,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  parseISO,
  isToday,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Services
import { appointmentService } from "@/services/appointmentService";
import { staffService } from "@/services/staffService";

// Generated Models
import {
  AppointmentStatus,
  AppointmentType,
  UrgencyLevel,
  AppointmentResponse,
} from "@/generated/models";

// Components
import { AppointmentFormDialog } from "./AppointmentFormDialog";
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentSlotCard } from "./AppointmentSlotCard";
import { AppointmentWeekCard } from "./AppointmentWeekCard";
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog";
import { AppointmentStats } from "./AppointmentStats";
import { AppointmentFilters } from "./AppointmentFilters";
import { RoleEnum } from "@/model/Role";

// Time slots for calendar view (9 AM to 5 PM)
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

// View types
type ViewMode = "day" | "week" | "list";

const AppointmentScheduler: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date()));

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPhysician, setFilterPhysician] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");

  // Dialog state
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentResponse | null>(null);

  // Fetch appointments
  const {
    data: appointmentsData,
    isLoading: isLoadingAppointments,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: ["appointments", searchTerm, filterStatus, filterPhysician, filterType, filterUrgency, selectedDate, viewMode],
    queryFn: async () => {
      const params: any = {
        page: 0,
        size: 100,
      };

      // Apply filters
      if (searchTerm) params.patientName = searchTerm;
      if (filterStatus !== "all") params.status = filterStatus;
      if (filterPhysician !== "all") params.physicianId = Number(filterPhysician);

      // Date filter based on view
      if (viewMode === "day") {
        params.appointmentDate = format(selectedDate, "yyyy-MM-dd");
      } else if (viewMode === "week") {
        // For week view, we'll filter client-side after fetching
        // Could optimize by fetching date range in backend
      }

      return appointmentService.searchAppointments(params);
    },
  });

  // Fetch staff/physicians
  const { data: staffData } = useQuery({
    queryKey: ["staff"],
    queryFn: () => staffService.getAllStaff(),
  });

  // Get physicians from staff
  const physicians = useMemo(() => {
    return (staffData || []).filter(
      (staff) =>
        staff.roles?.includes(RoleEnum.DOCTOR)
    );
  }, [staffData]);

  // Filter and process appointments
  const appointments = useMemo(() => {
    let filtered = appointmentsData?.content || [];

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((apt) => apt.appointmentType === filterType);
    }

    // Filter by urgency
    if (filterUrgency !== "all") {
      filtered = filtered.filter((apt) => apt.urgencyLevel === filterUrgency);
    }

    // Filter by week for week view
    if (viewMode === "week") {
      const weekStart = startOfWeek(currentWeek);
      const weekEnd = endOfWeek(currentWeek);
      filtered = filtered.filter((apt) => {
        const aptDate = parseISO(apt.appointmentDate!);
        return aptDate >= weekStart && aptDate <= weekEnd;
      });
    }

    return filtered;
  }, [appointmentsData, filterType, filterUrgency, viewMode, currentWeek]);

  // Update appointment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) =>
      appointmentService.updateAppointmentStatus(id, status),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: (id: number) => appointmentService.cancelAppointment(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
      setAppointmentToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to cancel appointment",
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const getAppointmentsForSlot = (date: Date, time: string) => {
    return appointments.filter((apt) => {
      const aptDate = parseISO(apt.appointmentDate!);
      const aptTime = apt.appointmentTime?.substring(0, 5);
      return isSameDay(aptDate, date) && aptTime === time;
    });
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = parseISO(apt.appointmentDate!);
      return isSameDay(aptDate, date);
    });
  };

  const getPhysicianName = (physicianId?: number) => {
    const physician = physicians.find((p) => p.id === physicianId);
    return physician?.fullName || "Unknown";
  };

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setShowAppointmentForm(true);
  };

  const handleEditAppointment = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleViewDetails = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setShowDetailsDialog(true);
  };

  const handleStatusChange = (appointment: AppointmentResponse, newStatus: AppointmentStatus) => {
    updateStatusMutation.mutate({ id: appointment.id!, status: newStatus });
  };

  const handleCancelAppointment = (appointment: AppointmentResponse) => {
    setAppointmentToDelete(appointment);
  };

  const confirmCancelAppointment = () => {
    if (appointmentToDelete?.id) {
      cancelAppointmentMutation.mutate(appointmentToDelete.id);
    }
  };

  // Date navigation
  const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(new Date());

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

  // Date picker handlers
  const handlePickDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const picked = parseISO(e.target.value);
    if (viewMode === "week") {
      setCurrentWeek(startOfWeek(picked));
    } else {
      setSelectedDate(picked);
    }
  };

  // Week days calculation
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentWeek), i));
  }, [currentWeek]);

  // Statistics
  const stats = useMemo(() => {
    const today = appointments.filter((apt) => {
      const aptDate = parseISO(apt.appointmentDate!);
      return isToday(aptDate);
    });

    return {
      total: appointments.length,
      today: today.length,
      waiting: appointments.filter((apt) => apt.status === AppointmentStatus.Waiting).length,
      inProgress: appointments.filter(
        (apt) =>
          apt.status === AppointmentStatus.InConsultation ||
          apt.status === AppointmentStatus.InTriage
      ).length,
      completed: appointments.filter((apt) => apt.status === AppointmentStatus.Completed).length,
    };
  }, [appointments]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointment Scheduling</h1>
          <p className="text-muted-foreground mt-1">
            Manage patient appointments and doctor schedules
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetchAppointments()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleNewAppointment} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <AppointmentStats
        total={stats.total}
        today={stats.today}
        waiting={stats.waiting}
        inProgress={stats.inProgress}
        completed={stats.completed}
      />

      {/* Filters and View Toggle */}
      <AppointmentFilters
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        filterPhysician={filterPhysician}
        filterType={filterType}
        filterUrgency={filterUrgency}
        physicians={physicians}
        onSearchChange={setSearchTerm}
        onStatusChange={setFilterStatus}
        onPhysicianChange={setFilterPhysician}
        onTypeChange={setFilterType}
        onUrgencyChange={setFilterUrgency}
      />

      {/* View Toggle and Content */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="day">
              <Calendar className="h-4 w-4 mr-2" />
              Day View
            </TabsTrigger>
            <TabsTrigger value="week">
              <Grid className="h-4 w-4 mr-2" />
              Week View
            </TabsTrigger>
          </TabsList>

          {/* Date Navigation */}
          {viewMode === "day" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  aria-label="Pick date"
                  value={format(selectedDate, "yyyy-MM-dd")}
                  onChange={handlePickDate}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <span className="text-sm font-medium min-w-[150px] text-center">
                {format(selectedDate, "MMMM d, yyyy")}
              </span>
              <Button variant="outline" size="sm" onClick={goToNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {viewMode === "week" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  aria-label="Pick week date"
                  value={format(currentWeek, "yyyy-MM-dd")}
                  onChange={handlePickDate}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <span className="text-sm font-medium min-w-[200px] text-center">
                Week of {format(startOfWeek(currentWeek), "MMM d")} -{" "}
                {format(endOfWeek(currentWeek), "MMM d, yyyy")}
              </span>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* List View */}
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointments List</CardTitle>
              <CardDescription>
                Showing {appointments.length} appointment(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No appointments found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your filters or create a new appointment
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {appointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        physicianName={getPhysicianName(appointment.physicianId)}
                        onEdit={handleEditAppointment}
                        onViewDetails={handleViewDetails}
                        onStatusChange={handleStatusChange}
                        onCancel={handleCancelAppointment}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Day View */}
        <TabsContent value="day" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Day Schedule - {format(selectedDate, "EEEE, MMMM d, yyyy")}</CardTitle>
              <CardDescription>
                {getAppointmentsForDay(selectedDate).length} appointment(s) scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <Skeleton className="h-[600px] w-full" />
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {TIME_SLOTS.map((time) => {
                      const slotAppointments = getAppointmentsForSlot(selectedDate, time);
                      return (
                        <div
                          key={time}
                          className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-20 text-sm font-medium text-muted-foreground pt-1">
                            {time}
                          </div>
                          <div className="flex-1 min-h-[60px]">
                            {slotAppointments.length > 0 ? (
                              <div className="space-y-2">
                                {slotAppointments.map((appointment) => (
                                  <AppointmentSlotCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    physicianName={getPhysicianName(appointment.physicianId)}
                                    onEdit={handleEditAppointment}
                                    onViewDetails={handleViewDetails}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground italic">
                                No appointments
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Week View */}
        <TabsContent value="week" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {isLoadingAppointments ? (
                <Skeleton className="h-[600px] w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-[900px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-8 border-b bg-muted/50">
                      <div className="p-4 font-semibold text-sm">Time</div>
                      {weekDays.map((day) => (
                        <div
                          key={day.toISOString()}
                          className={cn(
                            "p-4 text-center border-l",
                            isToday(day) && "bg-primary/10"
                          )}
                        >
                          <div className="font-semibold text-sm">{format(day, "EEE")}</div>
                          <div
                            className={cn(
                              "text-lg mt-1",
                              isToday(day) && "text-primary font-bold"
                            )}
                          >
                            {format(day, "d")}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {getAppointmentsForDay(day).length} apt
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Time Slots */}
                    <ScrollArea className="h-[550px]">
                      {TIME_SLOTS.map((time) => (
                        <div
                          key={time}
                          className="grid grid-cols-8 border-b hover:bg-muted/30"
                        >
                          <div className="p-3 text-sm font-medium text-muted-foreground bg-muted/30">
                            {time}
                          </div>
                          {weekDays.map((day) => {
                            const slotAppointments = getAppointmentsForSlot(day, time);
                            return (
                              <div
                                key={`${day.toISOString()}-${time}`}
                                className="p-2 border-l min-h-[80px]"
                              >
                                <div className="space-y-1">
                                  {slotAppointments.map((appointment) => (
                                    <AppointmentWeekCard
                                      key={appointment.id}
                                      appointment={appointment}
                                      physicianName={getPhysicianName(appointment.physicianId)}
                                      onClick={() => handleViewDetails(appointment)}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Form Dialog */}
      {showAppointmentForm && (
        <AppointmentFormDialog
          open={showAppointmentForm}
          onClose={() => {
            setShowAppointmentForm(false);
            setSelectedAppointment(null);
          }}
          onSuccess={() => {
            refetchAppointments();
          }}
          editData={selectedAppointment}
        />
      )}

      {/* Details Dialog */}
      {showDetailsDialog && selectedAppointment && (
        <AppointmentDetailsDialog
          appointment={selectedAppointment}
          physicianName={getPhysicianName(selectedAppointment.physicianId)}
          open={showDetailsDialog}
          onClose={() => {
            setShowDetailsDialog(false);
            setSelectedAppointment(null);
          }}
          onEdit={() => {
            setShowDetailsDialog(false);
            setShowAppointmentForm(true);
          }}
          onStatusChange={(status) => handleStatusChange(selectedAppointment, status)}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={!!appointmentToDelete}
        onOpenChange={(open) => !open && setAppointmentToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppointmentToDelete(null)}>
              No, Keep It
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelAppointment}
              disabled={cancelAppointmentMutation.isPending}
            >
              {cancelAppointmentMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentScheduler;
