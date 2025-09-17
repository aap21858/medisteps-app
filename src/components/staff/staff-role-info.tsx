import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserCheck } from "lucide-react";

export const StaffRoleInfo = () => {
  return (
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
  );
};