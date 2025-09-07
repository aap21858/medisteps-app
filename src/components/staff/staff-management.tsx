import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Edit, Trash2, UserPlus, Users, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import { Staff } from "@/model/Staff";

const StaffManagement = () => {
  const { toast } = useToast();
  const { request } = useAuthorizedApi<any>();
  const [staffMembers, setStaffMembers] = useState<Staff[]>([
    {
      id: "1",
      fullName: "Dr. Sarah Wilson",
      emailId: "sarah.wilson@medclinic.com",
      role: "ADMIN",
      contactNumber: "+1 (555) 123-4567",
      status: "ACTIVE",
    },
    {
      id: "2",
      fullName: "Emily Johnson",
      emailId: "emily.johnson@medclinic.com",
      role: "RECEPTIONIST",
      contactNumber: "+1 (555) 234-5678",
      status: "ACTIVE",
    },
    {
      id: "3",
      fullName: "Dr. Michael Chen",
      emailId: "michael.chen@medclinic.com",
      role: "DOCTOR",
      contactNumber: "+1 (555) 345-6789",
      status: "ACTIVE",
    },
    {
      id: "4",
      fullName: "Robert Martinez",
      emailId: "robert.martinez@medclinic.com",
      role: "RECEPTIONIST",
      contactNumber: "+1 (555) 456-7890",
      status: "ACTIVE",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState<Staff>({
    fullName: "",
    emailId: "",
    role: "",
    contactNumber: "",
  });

  useEffect(() => {
    const fetchStaffList = async () => {
      const staffList = await request({
        method: "get",
        url: "/api/staff/get-all-details",
      });
      console.log("Fetched staff list:", staffList);
      if (staffList) {
        setStaffMembers(staffList.data);
      }
    };
    fetchStaffList();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newStaff.fullName ||
      !newStaff.emailId ||
      !newStaff.role ||
      !newStaff.contactNumber
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const res = await request({
      method: "post",
      url: "/api/admin/register",
      data: newStaff,
    });
    if (res.data) {
      setTimeout(() => {
        toast({
          title: "Success",
          description: res.data,
          variant: "default",
        });
      }, 1500);
    } else if (res.error) {
      toast({
        title: "Error",
        description: res.error,
        variant: "destructive",
      });
    }

    setShowAddForm(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "DOCTOR":
        return "bg-blue-100 text-blue-800";
      case "RECEPTIONIST":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage clinic staff members and their roles
          </p>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="add-staff">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Staff Member
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newStaff.fullName}
                        onChange={(e) =>
                          setNewStaff({ ...newStaff, fullName: e.target.value })
                        }
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStaff.emailId}
                        onChange={(e) =>
                          setNewStaff({ ...newStaff, emailId: e.target.value })
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        onValueChange={(value) =>
                          setNewStaff({ ...newStaff, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Administrator</SelectItem>
                          <SelectItem value="Doctor">Doctor</SelectItem>
                          <SelectItem value="Receptionist">
                            Receptionist
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input
                        id="contact"
                        value={newStaff.contactNumber}
                        onChange={(e) =>
                          setNewStaff({
                            ...newStaff,
                            contactNumber: e.target.value,
                          })
                        }
                        placeholder="Enter contact number"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Add Staff Member</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setNewStaff({
                          fullName: "",
                          emailId: "",
                          role: "",
                          contactNumber: "",
                        })
                      }
                    >
                      Clear Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="current-staff">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Staff Members ({staffMembers.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffMembers.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">
                          {staff.fullName}
                        </TableCell>
                        <TableCell>{staff.emailId}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(staff.role)}>
                            {staff.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{staff.contactNumber}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              staff.status === "ACTIVE"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {staff.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="staff-roles">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Staff Roles & Permissions
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">
                      Administrator
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Full system access</li>
                      <li>• Manage all staff members</li>
                      <li>• View all reports</li>
                      <li>• System configuration</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-600">Doctor</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Patient management</li>
                      <li>• Medical records access</li>
                      <li>• Prescription management</li>
                      <li>• Appointment scheduling</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600">
                      Receptionist
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Appointment scheduling</li>
                      <li>• Patient registration</li>
                      <li>• Basic patient info</li>
                      <li>• Check-in/out</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-600">
                      Billing Specialist
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Invoice management</li>
                      <li>• Payment processing</li>
                      <li>• Financial reports</li>
                      <li>• Insurance claims</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default StaffManagement;
