import apiClient from './apiClient';
import type { ApiResponse, Maintenance, MaintenanceRequest, MaintenanceStatus, MaintenancePriority } from '../types/api';

export interface PaginatedMaintenance {
  content: Maintenance[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const maintenanceService = {
  getMaintenanceTickets: async (
    page = 0, 
    size = 10, 
    status?: string, 
    priority?: string, 
    assetId?: string, 
    vendorId?: string
  ): Promise<PaginatedMaintenance> => {
    const params: any = { page, size };
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (assetId) params.assetId = assetId;
    if (vendorId) params.vendorId = vendorId;

    const response = await apiClient.get<ApiResponse<PaginatedMaintenance>>('/maintenance', { params });
    return response.data.data;
  },

  getMaintenanceById: async (id: string): Promise<Maintenance> => {
    const response = await apiClient.get<ApiResponse<Maintenance>>(`/maintenance/${id}`);
    return response.data.data;
  },

  createMaintenance: async (data: MaintenanceRequest): Promise<Maintenance> => {
    const response = await apiClient.post<ApiResponse<Maintenance>>('/maintenance', data);
    return response.data.data;
  },

  updateMaintenance: async (id: string, data: MaintenanceRequest): Promise<Maintenance> => {
    const response = await apiClient.put<ApiResponse<Maintenance>>(`/maintenance/${id}`, data);
    return response.data.data;
  },

  deleteMaintenance: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/maintenance/${id}`);
  }
};
