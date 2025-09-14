import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Role } from "@/model/Role";

interface DashboardOverviewProps {
  userRole: Role[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ userRole }) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const todayAppointments = [
    {
      id: 1,
      time: "09:00",
      patient: "John Smith",
      type: "Consultation",
      doctor: "Dr. Johnson",
      status: "scheduled",
    },
    {
      id: 2,
      time: "09:30",
      patient: "Sarah Wilson",
      type: "Follow-up",
      doctor: "Dr. Davis",
      status: "in-progress",
    },
    {
      id: 3,
      time: "10:00",
      patient: "Mike Brown",
      type: "Check-up",
      doctor: "Dr. Johnson",
      status: "completed",
    },
    {
      id: 4,
      time: "10:30",
      patient: "Lisa Garcia",
      type: "Consultation",
      doctor: "Dr. Lee",
      status: "scheduled",
    },
  ];

  const stats = [
    {
      title: "Total Patients",
      value: "1,247",
      icon: Users,
      change: "+12%",
      color: "text-primary",
    },
    {
      title: "Today's Appointments",
      value: "24",
      icon: Calendar,
      change: "+8%",
      color: "text-success",
    },
    {
      title: "Monthly Revenue",
      value: "$45,230",
      icon: CreditCard,
      change: "+15%",
      color: "text-warning",
    },
    {
      title: "Avg. Wait Time",
      value: "12 min",
      icon: Clock,
      change: "-5%",
      color: "text-muted-foreground",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "text-primary";
      case "in-progress":
        return "text-warning";
      case "completed":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return Clock;
      case "in-progress":
        return TrendingUp;
      case "completed":
        return CheckCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-hover rounded-lg p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="opacity-90">{today}</p>
        <p className="text-sm opacity-80 mt-1">
          {userRole.includes("ADMIN")
            ? "System Administrator"
            : userRole.includes("DOCTOR")
            ? "Medical Professional"
            : userRole.includes("RECEPTIONIST")
            ? "Front Desk Staff"
            : "Billing Specialist"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.color}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => {
                const StatusIcon = getStatusIcon(appointment.status);
                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {appointment.time}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.type} • {appointment.doctor}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-sm capitalize">
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All Appointments
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(userRole.includes("ADMIN") || userRole.includes("RECEPTIONIST")) && (
              <>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Register New Patient
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </>
            )}
            {(userRole.includes("ADMIN") || userRole.includes("BILLING")) && (
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            )}
            {userRole.includes("DOCTOR") && (
              <>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View Patient Records
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  My Schedule
                </Button>
              </>
            )}
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
