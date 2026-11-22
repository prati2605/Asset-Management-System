import apiClient from './apiClient';
import type { ApiResponse, AuthResponseData } from '../types/api';

export const login = async (email: string, password: string): Promise<ApiResponse<AuthResponseData>> => {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('ams_token');
  // Add backend call if backend requires logout invalidation
};
