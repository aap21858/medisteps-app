import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Edit, Trash2, Users } from "lucide-react";
import { Staff } from "@/model/Staff";
import { getCurrentUser } from "@/lib/authContext";

interface StaffTableProps {
  staffMembers: Staff[] | undefined;
  onEditStaff: (staff: Staff) => void;
  onDeleteStaff: (staff: Staff) => void;
}

export const StaffTable = ({ staffMembers, onEditStaff, onDeleteStaff }: StaffTableProps) => {
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
                            onClick={() => onEditStaff(staff)}
                            disabled={staff.emailId === getCurrentUser().emailId}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteStaff(staff)}
                            disabled={staff.emailId === getCurrentUser().emailId}
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
  );
};