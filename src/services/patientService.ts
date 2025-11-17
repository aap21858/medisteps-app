import apiClient from '@/lib/apiClient';
import { PatientManagementApi } from '@/generated/apis/patient-management-api';
import { Configuration } from '@/generated/configuration';
import type { PatientPageResponse, PatientResponse } from '@/generated/models';

export class PatientService {
  private api: PatientManagementApi;

  constructor() {
    const configuration = new Configuration({
      basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
    });
    this.api = new PatientManagementApi(configuration, undefined, apiClient);
  }

  async searchPatients(query: string, page = 0, size = 20): Promise<PatientPageResponse> {
    const response = await this.api.searchPatients(query, page, size);
    return response.data;
  }

  async getPatientById(id: number): Promise<PatientResponse> {
    const response = await this.api.getPatientById(id);
    return response.data;
  }
}

export const patientService = new PatientService();
