import React from "react";
import { Control } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UrgencyLevel } from "@/generated/models";

interface AppointmentTypeFieldsProps {
  control: Control<any>;
}

export const AppointmentTypeFields: React.FC<AppointmentTypeFieldsProps> = ({
  control,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="appointmentType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Appointment Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="OPD">OPD (Outpatient)</SelectItem>
                <SelectItem value="IPD">IPD (Inpatient)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="urgencyLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Urgency Level *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={UrgencyLevel.Normal}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Normal
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value={UrgencyLevel.Urgent}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      Urgent
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value={UrgencyLevel.Emergency}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      Emergency
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
