export interface Staff {
  id?: string;
  fullName: string;
  emailId: string;
  role: string[];
  contactNumber: string;
  status?: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}