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
import { useToast } from "@/hooks/use-toast";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import { Staff } from "@/model/Staff";

interface DeleteStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStaff: Staff | null;
  onStaffDeleted: (staffId: string) => void;
}

export const DeleteStaffDialog = ({ 
  open, 
  onOpenChange, 
  selectedStaff, 
  onStaffDeleted 
}: DeleteStaffDialogProps) => {
  const { toast } = useToast();
  const { request } = useAuthorizedApi<any>();

  const confirmDeleteStaff = async () => {
    if (!selectedStaff?.id) return;

    const res = await request({
      method: "delete",
      url: `/api/staff/${selectedStaff.id}`,
    });

    if (res.data) {
      onStaffDeleted(selectedStaff.id);
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
  );
};