import apiClient from './apiClient';
import type { ApiResponse, Vendor, VendorRequest } from '../types/api';

export interface PaginatedVendors {
  content: Vendor[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const vendorService = {
  getVendors: async (page = 0, size = 10, keyword = ''): Promise<PaginatedVendors> => {
    const response = await apiClient.get<ApiResponse<PaginatedVendors>>('/vendors', {
      params: { page, size, keyword }
    });
    return response.data.data;
  },

  getVendorById: async (id: string): Promise<Vendor> => {
    const response = await apiClient.get<ApiResponse<Vendor>>(`/vendors/${id}`);
    return response.data.data;
  },

  getVendorAssets: async (id: string, page = 0, size = 10, keyword = ''): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(`/vendors/${id}/assets`, {
      params: { page, size, keyword }
    });
    return response.data.data;
  },

  createVendor: async (vendorData: VendorRequest): Promise<Vendor> => {
    const response = await apiClient.post<ApiResponse<Vendor>>('/vendors', vendorData);
    return response.data.data;
  },

  updateVendor: async (id: string, vendorData: VendorRequest): Promise<Vendor> => {
    const response = await apiClient.put<ApiResponse<Vendor>>(`/vendors/${id}`, vendorData);
    return response.data.data;
  },

  deleteVendor: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/vendors/${id}`);
  }
};
