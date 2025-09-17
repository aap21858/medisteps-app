import { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import { Staff } from "@/model/Staff";
import { StaffForm } from "./staff-form";
import { StaffTable } from "./staff-table";
import { EditStaffDialog } from "./edit-staff-dialog";
import { DeleteStaffDialog } from "./delete-staff-dialog";
import { StaffRoleInfo } from "./staff-role-info";

const StaffManagement = () => {
  const { request } = useAuthorizedApi<any>();
  const [staffMembers, setStaffMembers] = useState<Staff[]>();
  const [fetchStaff, setFetchStaff] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

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

  const handleStaffAdded = () => {
    setFetchStaff(!fetchStaff);
  };

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setShowEditDialog(true);
  };

  const handleStaffUpdated = (updatedStaff: Staff) => {
    setStaffMembers((prev) =>
      prev?.map((staff) =>
        staff.id === selectedStaff?.id ? updatedStaff : staff
      )
    );
  };

  const handleDeleteStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setShowDeleteDialog(true);
  };

  const handleStaffDeleted = (staffId: string) => {
    setStaffMembers((prev) =>
      prev?.filter((staff) => staff.id !== staffId)
    );
    setFetchStaff(!fetchStaff);
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
        <StaffForm onStaffAdded={handleStaffAdded} />
        <StaffTable 
          staffMembers={staffMembers}
          onEditStaff={handleEditStaff}
          onDeleteStaff={handleDeleteStaff}
        />
        <StaffRoleInfo />
      </Accordion>

      <EditStaffDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        selectedStaff={selectedStaff}
        onStaffUpdated={handleStaffUpdated}
      />

      <DeleteStaffDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        selectedStaff={selectedStaff}
        onStaffDeleted={handleStaffDeleted}
      />
    </div>
  );
};

export default StaffManagement;
