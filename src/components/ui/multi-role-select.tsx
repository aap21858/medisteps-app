import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X } from "lucide-react";
import { ALL_ROLES, Role } from "@/model/Role";

interface MultiRoleSelectProps {
  selectedRoles: string[];
  onRolesChange: (roles: string[]) => void;
  placeholder?: string;
}

export const MultiRoleSelect = ({
  selectedRoles,
  onRolesChange,
  placeholder = "Select roles",
}: MultiRoleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const roleLabels: Record<Role, string> = {
    ADMIN: "Administrator",
    DOCTOR: "Doctor", 
    RECEPTIONIST: "Receptionist",
    BILLING: "Billing Specialist",
  };

  const toggleRole = (role: string) => {
    const updatedRoles = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    onRolesChange(updatedRoles);
  };

  const removeRole = (roleToRemove: string) => {
    onRolesChange(selectedRoles.filter((role) => role !== roleToRemove));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between min-h-10 h-auto"
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedRoles.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedRoles.map((role) => (
                <Badge
                  key={role}
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  {roleLabels[role as Role]}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeRole(role);
                    }}
                  />
                </Badge>
              ))
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-3" align="start">
        <div className="space-y-3">
          <div className="text-sm font-medium">Select Roles</div>
          <div className="space-y-2">
            {ALL_ROLES.map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={() => toggleRole(role)}
                />
                <Label
                  htmlFor={`role-${role}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {roleLabels[role]}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};