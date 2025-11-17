import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { patientService } from "@/services/patientService";
import {
  PatientResponse,
  PatientPageResponse,
} from "@/generated/models";

interface PatientSearchPopoverProps {
  selectedPatient: PatientResponse | null;
  onPatientSelect: (patient: PatientResponse) => void;
  onNewPatient: () => void;
  error?: string;
}

export const PatientSearchPopover: React.FC<PatientSearchPopoverProps> = ({
  selectedPatient,
  onPatientSelect,
  onNewPatient,
  error,
}) => {
  const [patientSearchInput, setPatientSearchInput] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [debounceMs] = useState(300);
  const [patientPopoverOpen, setPatientPopoverOpen] = useState(false);

  // Debounce the search input
  useEffect(() => {
    const t = setTimeout(() => setPatientSearch(patientSearchInput.trim()), debounceMs);
    return () => clearTimeout(t);
  }, [patientSearchInput, debounceMs]);

  // Fetch patients based on debounced search
  const {
    data: patients = [],
    isLoading: patientsLoading,
  } = useQuery<PatientPageResponse, unknown, PatientResponse[]>({
    queryKey: ["patients", patientSearch],
    queryFn: () => patientService.searchPatients(patientSearch, 0, 20),
    enabled: patientSearch.length >= 2,
    select: (data) => data?.content || [],
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Patient *</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNewPatient}
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          New Patient
        </Button>
      </div>
      <Popover open={patientPopoverOpen} onOpenChange={setPatientPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !selectedPatient && "text-muted-foreground"
            )}
          >
            {selectedPatient ? (
              <span>
                {selectedPatient.firstName} {selectedPatient.lastName} (
                {selectedPatient.patientId})
              </span>
            ) : (
              "Search and select patient..."
            )}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0">
          <Command>
            <CommandInput
              placeholder="Search by name, ID, or mobile..."
              value={patientSearchInput}
              onValueChange={setPatientSearchInput}
            />
            <CommandEmpty>
              {patientsLoading
                ? "Searching…"
                : patientSearchInput.length < 2
                ? "Type at least 2 characters to search..."
                : "No patient found."}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {patientsLoading && patientSearchInput.length >= 2 && (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  Searching for patients...
                </div>
              )}
              {!patientsLoading &&
                patients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={`${patient.firstName} ${patient.lastName} ${patient.patientId} ${patient.mobileNumber}`}
                    onSelect={() => {
                      onPatientSelect(patient);
                      setPatientPopoverOpen(false);
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col flex-1">
                          <span className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {patient.patientId} • {patient.mobileNumber}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-0.5 text-right ml-4">
                          {patient.age && <div>Age: {patient.age}</div>}
                          {patient.gender && <div>{patient.gender}</div>}
                          {patient.bloodGroup && <div>{patient.bloodGroup}</div>}
                        </div>
                      </div>
                      {patient.city && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {patient.city}
                          {patient.district && `, ${patient.district}`}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
};
