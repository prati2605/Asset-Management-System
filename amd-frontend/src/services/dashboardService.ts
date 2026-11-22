import apiClient from './apiClient';
import type { ApiResponse, DashboardStats } from '../types/api';



export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  return response.data;
};
