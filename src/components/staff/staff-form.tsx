import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MultiRoleSelect } from "@/components/ui/multi-role-select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import { Staff } from "@/model/Staff";

interface StaffFormProps {
  onStaffAdded: () => void;
}

export const StaffForm = ({ onStaffAdded }: StaffFormProps) => {
  const { toast } = useToast();
  const { request } = useAuthorizedApi<any>();
  const [newStaff, setNewStaff] = useState<Staff>({
    fullName: "",
    emailId: "",
    roles: [],
    contactNumber: "",
  });

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
      onStaffAdded();
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

    setNewStaff({
      fullName: "",
      emailId: "",
      roles: [],
      contactNumber: "",
    });
  };

  const clearForm = () => {
    setNewStaff({
      fullName: "",
      emailId: "",
      roles: [],
      contactNumber: "",
    });
  };

  return (
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
                <Button type="button" variant="outline" onClick={clearForm}>
                  Clear Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};