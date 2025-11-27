import { format, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  X,
  AlertCircle,
  Stethoscope,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PastAppointmentsTabProps } from "./types";

export default function PastAppointmentsTab({
  pastAppointments,
  isLoading,
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
}: PastAppointmentsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Past Appointments
              </CardTitle>
              <CardDescription>Complete visit history for continuity of care</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-[180px] justify-start"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {dateFrom ? format(dateFrom, "MMM d, yyyy") : "From Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    disabled={(date) =>
                      date > new Date() || (dateTo ? date > dateTo : false)
                    }
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-[180px] justify-start"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {dateTo ? format(dateTo, "MMM d, yyyy") : "To Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    disabled={(date) =>
                      date > new Date() || (dateFrom ? date < dateFrom : false)
                    }
                  />
                </PopoverContent>
              </Popover>
              {(dateFrom || dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateFrom(undefined);
                    setDateTo(undefined);
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : pastAppointments && pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {appointment.appointmentDate
                                ? format(parseISO(appointment.appointmentDate), "MMM d, yyyy")
                                : "N/A"}
                            </span>
                            <span className="text-sm text-muted-foreground">-</span>
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {appointment.physicianName || "Unknown Doctor"}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">-</span>
                            <span className="text-sm text-muted-foreground">
                              {appointment.departmentName || "N/A"}
                            </span>
                          </div>

                          {appointment.chiefComplaint && (
                            <div className="pl-7">
                              <p className="text-sm">
                                <span className="font-medium">Chief Complaint:</span>{" "}
                                {appointment.chiefComplaint}
                              </p>
                            </div>
                          )}

                          <div className="pl-7 space-y-1">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Diagnosis:</span> Information
                              available on full details
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Prescribed:</span> View
                              prescription details
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log("View appointment", appointment.id);
                          }}
                        >
                          View Full Details
                        </Button>
                      </div>

                      <Separator />

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{appointment.appointmentType}</Badge>
                        <Badge variant="secondary">{appointment.status}</Badge>
                        {appointment.appointmentNumber && (
                          <span className="text-xs text-muted-foreground">
                            {appointment.appointmentNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No past appointments found for this patient</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Vitals Trend - Placeholder */}
      {pastAppointments && pastAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vitals Trends
            </CardTitle>
            <CardDescription>Track vitals over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Activity className="h-4 w-4" />
              <AlertDescription>
                Vitals trend visualization coming soon - will show BP, weight, blood sugar
                trends over last 6 months
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
