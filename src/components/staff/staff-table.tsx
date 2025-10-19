import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Edit, Trash2, Users, Filter } from "lucide-react";
import { Staff } from "@/model/Staff";
import { getCurrentUser } from "@/lib/authContext";
import { useState, useMemo } from "react";

interface StaffTableProps {
  staffMembers: Staff[] | undefined;
  onEditStaff: (staff: Staff) => void;
  onDeleteStaff: (staff: Staff) => void;
}

export const StaffTable = ({ staffMembers, onEditStaff, onDeleteStaff }: StaffTableProps) => {
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    status: "",
  });
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const filteredStaff = useMemo(() => {
    if (!staffMembers) return [];
    
    return staffMembers.filter((staff) => {
      const matchesName = staff.fullName.toLowerCase().includes(filters.name.toLowerCase());
      const matchesEmail = staff.emailId.toLowerCase().includes(filters.email.toLowerCase());
      const matchesRole = staff.roles.some(role => 
        role.toLowerCase().includes(filters.role.toLowerCase())
      );
      const matchesPhone = staff.contactNumber.includes(filters.phone);
      const matchesStatus = staff.status?.toLowerCase().includes(filters.status.toLowerCase());
      const matchesActiveFilter = showActiveOnly ? staff.status === "ACTIVE" : true;

      return matchesName && matchesEmail && matchesRole && matchesPhone && matchesStatus && matchesActiveFilter;
    });
  }, [staffMembers, filters, showActiveOnly]);

  const paginatedStaff = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStaff.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStaff, currentPage]);

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      email: "",
      role: "",
      phone: "",
      status: "",
    });
    setCurrentPage(1);
  };

  return (
    <AccordionItem value="current-staff">
      <AccordionTrigger className="text-lg font-semibold">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Current Staff Members ({filteredStaff.length} of {staffMembers ? staffMembers.length : 0})
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Card>
          <CardContent className="pt-6">
            {/* Filters and Controls */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active-only"
                      checked={showActiveOnly}
                      onCheckedChange={setShowActiveOnly}
                    />
                    <Label htmlFor="active-only">Show Active Only</Label>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>
              
              {/* Filter Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input
                  placeholder="Filter by name..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                />
                <Input
                  placeholder="Filter by email..."
                  value={filters.email}
                  onChange={(e) => handleFilterChange("email", e.target.value)}
                />
                <Input
                  placeholder="Filter by role..."
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                />
                <Input
                  placeholder="Filter by phone..."
                  value={filters.phone}
                  onChange={(e) => handleFilterChange("phone", e.target.value)}
                />
                <Input
                  placeholder="Filter by status..."
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                />
              </div>
            </div>

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
                {paginatedStaff.length > 0 ? (
                  paginatedStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">
                        {staff.fullName}
                      </TableCell>
                      <TableCell>{staff.emailId}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {staff.roles.map((role) => (
                            <Badge
                              key={role}
                              className={getRoleBadgeColor(role)}
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No staff members found matching the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};