import { Role } from "./Role";

export interface Staff {
  id?: string;
  fullName: string;
  emailId: string;
  roles: string[];
  contactNumber: string;
  status?: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}