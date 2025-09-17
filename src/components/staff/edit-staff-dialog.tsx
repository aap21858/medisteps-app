import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiRoleSelect } from "@/components/ui/multi-role-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import { Staff } from "@/model/Staff";

interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStaff: Staff | null;
  onStaffUpdated: (updatedStaff: Staff) => void;
}

export const EditStaffDialog = ({ 
  open, 
  onOpenChange, 
  selectedStaff, 
  onStaffUpdated 
}: EditStaffDialogProps) => {
  const { toast } = useToast();
  const { request } = useAuthorizedApi<any>();
  const [editStaff, setEditStaff] = useState<Staff>({
    fullName: "",
    emailId: "",
    roles: [],
    contactNumber: "",
  });

  useEffect(() => {
    if (selectedStaff) {
      setEditStaff({
        fullName: selectedStaff.fullName,
        emailId: selectedStaff.emailId,
        roles: selectedStaff.roles,
        contactNumber: selectedStaff.contactNumber,
      });
    }
  }, [selectedStaff]);

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

    if (res.data) {
      onStaffUpdated({ ...selectedStaff!, ...editStaff });
      toast({
        title: "Success",
        description: res.data,
        className: "bg-green-50 text-green-900 border-green-200",
      });
      onOpenChange(false);
    } else if (res.error) {
      toast({
        title: "Error",
        description: res.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onRolesChange={(roles) => setEditStaff({ ...editStaff, roles })}
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
  );
};