import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MultiRoleSelect } from "@/components/ui/multi-role-select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, UserPlus, Users, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import { Staff } from "@/model/Staff";
import { ALL_ROLES, Role, RoleEnum } from "@/model/Role";

const StaffManagement = () => {
  const { toast } = useToast();
  const { request } = useAuthorizedApi<any>();
  const [staffMembers, setStaffMembers] = useState<Staff[]>();
  const [fetchStaff, setFetchStaff] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [newStaff, setNewStaff] = useState<Staff>({
    fullName: "",
    emailId: "",
    roles: [],
    contactNumber: "",
  });
  const [editStaff, setEditStaff] = useState<Staff>({
    fullName: "",
    emailId: "",
    roles: [],
    contactNumber: "",
  });

  const fetchStaffList = async () => {
    const staffList = await request({
      method: "get",
      url: "/api/staff/",
    });
    if (staffList) {
      setStaffMembers(staffList.data);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, [fetchStaff]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newStaff.fullName ||
      !newStaff.emailId ||
      !newStaff.roles ||
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
      setFetchStaff(!fetchStaff);
      setTimeout(() => {
        toast({
          title: "Success",
          description: res.data,
          className: "bg-green-50 text-green-900 border-green-200",
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

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setEditStaff({
      fullName: staff.fullName,
      emailId: staff.emailId,
      roles: staff.roles,
      contactNumber: staff.contactNumber,
    });
    setShowEditDialog(true);
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !editStaff.fullName ||
      !editStaff.emailId ||
      !editStaff.roles ||
      !editStaff.contactNumber
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const res = await request({
      method: "put",
      url: `/api/staff/${selectedStaff?.id}`,
      data: editStaff,
    });
    console.log("res", res);
    if (res.data) {
      setStaffMembers((prev) =>
        prev.map((staff) =>
          staff.id === selectedStaff?.id ? { ...staff, ...editStaff } : staff
        )
      );
      toast({
        title: "Success",
        description: res.data,
        className: "bg-green-50 text-green-900 border-green-200",
      });
      setShowEditDialog(false);
    } else if (res.error) {
      toast({
        title: "Error",
        description: res.error,
        variant: "destructive",
      });
    }
  };

  const handleDeleteStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setShowDeleteDialog(true);
  };

  const confirmDeleteStaff = async () => {
    if (!selectedStaff?.id) return;

    const res = await request({
      method: "delete",
      url: `/api/staff/${selectedStaff.id}`,
    });

    if (res.data) {
      setStaffMembers((prev) =>
        prev.filter((staff) => staff.id !== selectedStaff.id)
      );
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
        className: "bg-green-50 text-green-900 border-green-200",
      });
      setShowDeleteDialog(false);
      setFetchStaff(!fetchStaff);
    } else if (res.error) {
      toast({
        title: "Error",
        description: res.error,
        variant: "destructive",
      });
    }
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

  const toggleRoleInArray = (arr: Role[], value: Role) =>
    arr.includes(value) ? arr.filter((r) => r !== value) : [...arr, value];

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
                      <Label htmlFor="role">Roles</Label>
                      <MultiRoleSelect
                        selectedRoles={newStaff.roles}
                        onRolesChange={(roles) =>
                          setNewStaff({ ...newStaff, roles })
                        }
                        placeholder="Select roles"
                      />
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
                          roles: [],
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
              Current Staff Members ({staffMembers ? staffMembers.length : 0})
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
                    {staffMembers &&
                      staffMembers.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">
                            {staff.fullName}
                          </TableCell>
                          <TableCell>{staff.emailId}</TableCell>
                          <TableCell>
                            {staff.roles.map((role) => (
                              <Badge
                                key={role}
                                className={getRoleBadgeColor(role)}
                              >
                                {role}
                              </Badge>
                            ))}
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
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditStaff(staff)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteStaff(staff)}
                              >
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

      {/* Edit Staff Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Make changes to the staff member's information here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateStaff} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editStaff.fullName}
                onChange={(e) =>
                  setEditStaff({ ...editStaff, fullName: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editStaff.emailId}
                onChange={(e) =>
                  setEditStaff({ ...editStaff, emailId: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Roles</Label>
              <MultiRoleSelect
                selectedRoles={editStaff.roles}
                onRolesChange={(roles) =>
                  setEditStaff({ ...editStaff, roles })
                }
                placeholder="Select roles"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact Number</Label>
              <Input
                id="edit-contact"
                value={editStaff.contactNumber}
                onChange={(e) =>
                  setEditStaff({
                    ...editStaff,
                    contactNumber: e.target.value,
                  })
                }
                placeholder="Enter contact number"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Update Staff Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Staff Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <strong>{selectedStaff?.fullName}</strong> from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStaff}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffManagement;
