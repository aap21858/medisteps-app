import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Edit, Trash2, UserPlus, Users, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'receptionist' | 'doctor' | 'billing';
  department: string;
  phone: string;
  status: 'active' | 'inactive';
}

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@medclinic.com',
      role: 'admin',
      department: 'Administration',
      phone: '+1 (555) 123-4567',
      status: 'active'
    },
    {
      id: '2',
      name: 'Emily Johnson',
      email: 'emily.johnson@medclinic.com',
      role: 'receptionist',
      department: 'Front Desk',
      phone: '+1 (555) 234-5678',
      status: 'active'
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@medclinic.com',
      role: 'doctor',
      department: 'Cardiology',
      phone: '+1 (555) 345-6789',
      status: 'active'
    },
    {
      id: '4',
      name: 'Robert Martinez',
      email: 'robert.martinez@medclinic.com',
      role: 'billing',
      department: 'Finance',
      phone: '+1 (555) 456-7890',
      status: 'active'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: ''
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStaff.name || !newStaff.email || !newStaff.role || !newStaff.department || !newStaff.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    const staffMember: StaffMember = {
      id: Date.now().toString(),
      ...newStaff,
      role: newStaff.role as 'admin' | 'receptionist' | 'doctor' | 'billing',
      status: 'active'
    };

    setStaffMembers([...staffMembers, staffMember]);
    setNewStaff({ name: '', email: '', role: '', department: '', phone: '' });
    setShowAddForm(false);
    toast.success('Staff member added successfully');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'receptionist': return 'bg-green-100 text-green-800';
      case 'billing': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage clinic staff members and their roles</p>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="add-staff">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Staff Member
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newStaff.name}
                        onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select onValueChange={(value) => setNewStaff({...newStaff, role: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="receptionist">Receptionist</SelectItem>
                          <SelectItem value="billing">Billing Specialist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={newStaff.department}
                        onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                        placeholder="Enter department"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newStaff.phone}
                        onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Add Staff Member</Button>
                    <Button type="button" variant="outline" onClick={() => setNewStaff({ name: '', email: '', role: '', department: '', phone: '' })}>
                      Clear Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="current-staff">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Staff Members ({staffMembers.length})
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
                      <TableHead>Department</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffMembers.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(staff.role)}>
                            {staff.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>{staff.phone}</TableCell>
                        <TableCell>
                          <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
                            {staff.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
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
                    <h4 className="font-semibold text-primary">Administrator</h4>
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
                    <h4 className="font-semibold text-green-600">Receptionist</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Appointment scheduling</li>
                      <li>• Patient registration</li>
                      <li>• Basic patient info</li>
                      <li>• Check-in/out</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-600">Billing Specialist</h4>
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
      </Accordion>
    </div>
  );
};

export default StaffManagement;