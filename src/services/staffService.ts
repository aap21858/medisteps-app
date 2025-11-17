import apiClient from '@/lib/apiClient';
import { StaffManagementApi } from '@/generated/apis/staff-management-api';
import { Configuration } from '@/generated/configuration';
import type { StaffResponse } from '@/generated/models';

export class StaffService {
  private api: StaffManagementApi;

  constructor() {
    const configuration = new Configuration({
      basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
    });
    this.api = new StaffManagementApi(configuration, undefined, apiClient);
  }

  async getAllStaff(): Promise<StaffResponse[]> {
    const response = await this.api.getAllStaff();
    return response.data;
  }

  async getStaffById(id: number): Promise<StaffResponse> {
    const response = await this.api.getStaffById(id);
    return response.data;
  }

  // Helper to get only doctors/physicians
  async getPhysicians(): Promise<StaffResponse[]> {
    const allStaff = await this.getAllStaff();
    return allStaff.filter(staff => 
      staff.roles?.includes('ROLE_DOCTOR') || 
      staff.roles?.includes('ROLE_PHYSICIAN')
    );
  }
}

export const staffService = new StaffService();
