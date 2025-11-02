import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import useAuthorizedApi from "@/hooks/useAuthorizedApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search } from "lucide-react";
import { PatientResponse } from "@/generated";
import { ViewPatientDialog } from "./dialogs/view-patient-dialog";
import { EditPatientDialog } from "./dialogs/edit-patient-dialog";
import { DeletePatientDialog } from "./dialogs/delete-patient-dialog";

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState<PatientResponse | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();
  const api = useAuthorizedApi();

  interface PaginatedResponse {
    content: PatientResponse[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  }

  const fetchPatients = async (page: number = 0) => {
    try {
      setLoading(true);
      const response = await api.request({
        method: 'GET',
        url: '/api/patients',
        params: {
          page,
          size: 10,
          sort: 'createdAt,desc'
        }
      }) as { data: PaginatedResponse; status: number };

      if (response.status === 200 && response.data) {
        setPatients(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast({
        title: "Error fetching patients",
        description: "Failed to load patient list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.request({
        method: 'GET',
        url: '/api/patients/search',
        params: {
          query: searchQuery,
          page: 0,
          size: 10
        }
      }) as { data: PaginatedResponse; status: number };

      if (response.status === 200 && response.data) {
        setPatients(response.data.content);
        setTotalPages(response.data.totalPages);
        setCurrentPage(0);
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search patients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePatientUpdated = () => {
    fetchPatients(currentPage);
    setIsEditDialogOpen(false);
  };

  const handlePatientDeleted = () => {
    fetchPatients(currentPage);
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient List</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.patientId}</TableCell>
                <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.mobileNumber}</TableCell>
                <TableCell>{patient.city}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    patient.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600"
                      >
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => fetchPatients(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => fetchPatients(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </Button>
      </div>

      {selectedPatient && (
        <>
          <ViewPatientDialog
            patient={selectedPatient}
            open={isViewDialogOpen}
            onClose={() => {
              setIsViewDialogOpen(false);
              setSelectedPatient(null);
            }}
          />
          <EditPatientDialog
            patient={selectedPatient}
            open={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedPatient(null);
            }}
            onPatientUpdated={handlePatientUpdated}
          />
          <DeletePatientDialog
            patient={selectedPatient}
            open={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedPatient(null);
            }}
            onPatientDeleted={handlePatientDeleted}
          />
        </>
      )}
    </div>
  );
};

export default PatientList;