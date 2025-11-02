import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import { PatientResponse } from "@/generated";

interface DeletePatientDialogProps {
  patient: PatientResponse;
  open: boolean;
  onClose: () => void;
  onPatientDeleted: () => void;
}

export const DeletePatientDialog: React.FC<DeletePatientDialogProps> = ({
  patient,
  open,
  onClose,
  onPatientDeleted,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const api = useAuthorizedApi();

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      const response = await api.request({
        method: 'DELETE',
        url: `/api/patients/${patient.id}`,
      });

      if (response.status === 200) {
        toast({
          title: "Patient deactivated",
          description: `${patient.firstName} ${patient.lastName} has been deactivated.`,
        });
        onPatientDeleted();
      } else {
        throw new Error(response.error?.message || "Failed to deactivate patient");
      }
    } catch (error: any) {
      toast({
        title: "Deactivation failed",
        description: error.message || "Failed to deactivate patient.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate Patient</DialogTitle>
          <DialogDescription>
            Are you sure you want to deactivate this patient? This will mark the
            patient as inactive in the system. This action can be reversed later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <span className="font-medium">Patient ID:</span> {patient.patientId}
          </div>
          <div>
            <span className="font-medium">Name:</span>{" "}
            {`${patient.firstName} ${patient.lastName}`}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deactivating..." : "Deactivate Patient"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};