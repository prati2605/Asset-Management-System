import apiClient from './apiClient';
import type { ApiResponse } from '../types/api';

export const assignAsset = async (assetId: string, employeeId: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>(`/assets/${assetId}/assign/${employeeId}`);
  return response.data;
};

export const returnAsset = async (assetId: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>(`/assets/${assetId}/return`);
  return response.data;
};
