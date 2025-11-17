import apiClient from '@/lib/apiClient';
import { AppointmentManagementApi } from '@/generated/apis/appointment-management-api';
import { Configuration } from '@/generated/configuration';
import type {
  AppointmentRequest,
  AppointmentResponse,
  AppointmentDetailResponse,
  AppointmentPageResponse,
  AppointmentStatus,
  TriageRequest,
  TriageResponse,
  VitalsRequest,
  VitalsResponse,
  ExaminationRequest,
  ExaminationResponse,
  PrescriptionRequest,
  PrescriptionResponse,
  InvestigationOrderRequest,
  InvestigationOrderResponse,
  InvestigationResultRequest,
  ReferralRequest,
  AdmitRequest,
  DischargeRequest,
  UpdateAppointmentStatusRequest,
  UpdatePrescriptionStatusRequest,
} from '@/generated/models';

export interface AppointmentSearchParams {
  patientName?: string;
  patientId?: number;
  contactNumber?: string;
  appointmentDate?: string;
  physicianId?: number;
  status?: AppointmentStatus;
  page?: number;
  size?: number;
}

export class AppointmentService {
  private api: AppointmentManagementApi;

  constructor() {
    const configuration = new Configuration({
      basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
    });
    this.api = new AppointmentManagementApi(configuration, undefined, apiClient);
  }

  // ==================== Appointment CRUD ====================

  async createAppointment(data: AppointmentRequest): Promise<AppointmentResponse> {
    const response = await this.api.createAppointment(data);
    return response.data;
  }

  async getAllAppointments(params: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<AppointmentPageResponse> {
    const response = await this.api.getAllAppointments(params.page, params.size, params.sort);
    return response.data;
  }

  async getAppointmentById(id: number): Promise<AppointmentDetailResponse> {
    const response = await this.api.getAppointmentById(id);
    return response.data;
  }

  async updateAppointment(id: number, data: AppointmentRequest): Promise<AppointmentResponse> {
    const response = await this.api.updateAppointment(id, data);
    return response.data;
  }

  async cancelAppointment(id: number): Promise<void> {
    await this.api.cancelAppointment(id);
  }

  async searchAppointments(params: AppointmentSearchParams): Promise<AppointmentPageResponse> {
    const response = await this.api.searchAppointments(
      params.patientName,
      params.patientId,
      params.contactNumber,
      params.appointmentDate,
      params.physicianId,
      params.status,
      params.page,
      params.size
    );
    return response.data;
  }

  async updateAppointmentStatus(id: number, status: AppointmentStatus): Promise<AppointmentResponse> {
    const statusRequest: UpdateAppointmentStatusRequest = { status };
    const response = await this.api.updateAppointmentStatus(id, statusRequest);
    return response.data;
  }

  // ==================== Triage Management ====================

  async createOrUpdateTriage(appointmentId: number, data: TriageRequest): Promise<TriageResponse> {
    const response = await this.api.createOrUpdateTriage(appointmentId, data);
    return response.data;
  }

  async getTriageByAppointment(appointmentId: number): Promise<TriageResponse> {
    const response = await this.api.getTriageByAppointment(appointmentId);
    return response.data;
  }

  // ==================== Vitals Management ====================

  async recordVitals(appointmentId: number, data: VitalsRequest): Promise<VitalsResponse> {
    const response = await this.api.recordVitals(appointmentId, data);
    return response.data;
  }

  async getVitalsByAppointment(appointmentId: number): Promise<VitalsResponse[]> {
    const response = await this.api.getVitalsByAppointment(appointmentId);
    return response.data;
  }

  // ==================== Examination Management ====================

  async recordExamination(
    appointmentId: number,
    data: ExaminationRequest
  ): Promise<ExaminationResponse> {
    const response = await this.api.recordExamination(appointmentId, data);
    return response.data;
  }

  async getExaminationByAppointment(appointmentId: number): Promise<ExaminationResponse> {
    const response = await this.api.getExaminationByAppointment(appointmentId);
    return response.data;
  }

  // ==================== Prescription Management ====================

  async createPrescription(
    appointmentId: number,
    data: PrescriptionRequest
  ): Promise<PrescriptionResponse> {
    const response = await this.api.createPrescription(appointmentId, data);
    return response.data;
  }

  async getPrescriptionsByAppointment(appointmentId: number): Promise<PrescriptionResponse[]> {
    const response = await this.api.getPrescriptionsByAppointment(appointmentId);
    return response.data;
  }

  async getPrescriptionById(id: number): Promise<PrescriptionResponse> {
    const response = await this.api.getPrescriptionById(id);
    return response.data;
  }

  async updatePrescriptionStatus(
    id: number,
    status: string
  ): Promise<PrescriptionResponse> {
    const statusRequest: UpdatePrescriptionStatusRequest = { status: status as any };
    const response = await this.api.updatePrescriptionStatus(id, statusRequest);
    return response.data;
  }

  // ==================== Investigation Management ====================

  async createInvestigationOrder(
    appointmentId: number,
    data: InvestigationOrderRequest
  ): Promise<InvestigationOrderResponse> {
    const response = await this.api.createInvestigationOrder(appointmentId, data);
    return response.data;
  }

  async getInvestigationsByAppointment(
    appointmentId: number
  ): Promise<InvestigationOrderResponse[]> {
    const response = await this.api.getInvestigationsByAppointment(appointmentId);
    return response.data;
  }

  async updateInvestigationResult(
    id: number,
    data: InvestigationResultRequest
  ): Promise<InvestigationOrderResponse> {
    const response = await this.api.updateInvestigationResult(id, data);
    return response.data;
  }

  // ==================== Referral Management ====================

  async createReferral(appointmentId: number, data: ReferralRequest): Promise<AppointmentResponse> {
    const response = await this.api.createReferral(appointmentId, data);
    return response.data;
  }

  // ==================== IPD Management ====================

  async admitPatient(appointmentId: number, data: AdmitRequest): Promise<AppointmentResponse> {
    const response = await this.api.admitPatient(appointmentId, data);
    return response.data;
  }

  async dischargePatient(
    appointmentId: number,
    data: DischargeRequest
  ): Promise<AppointmentResponse> {
    const response = await this.api.dischargePatient(appointmentId, data);
    return response.data;
  }

  // ==================== Helper Methods ====================

  /**
   * Get today's appointments for a physician
   */
  async getTodayAppointments(physicianId: number): Promise<AppointmentResponse[]> {
    const today = new Date().toISOString().split('T')[0];
    const result = await this.searchAppointments({
      physicianId,
      appointmentDate: today,
      size: 100,
    });
    return result.content;
  }

  /**
   * Get upcoming appointments for a patient
   */
  async getUpcomingAppointments(patientId: number): Promise<AppointmentResponse[]> {
    const result = await this.searchAppointments({
      patientId,
      size: 10,
    });
    return result.content.filter(apt => {
      const aptDate = new Date(apt.appointmentDate!);
      return aptDate >= new Date();
    });
  }

  /**
   * Get appointments by status
   */
  async getAppointmentsByStatus(
    status: AppointmentStatus,
    page = 0,
    size = 20
  ): Promise<AppointmentPageResponse> {
    return this.searchAppointments({ status, page, size });
  }
}

// Export singleton instance
export const appointmentService = new AppointmentService();
