import apiClient from './apiClient';
import type { ApiResponse } from '../types/api';
import type { EmployeeRequest } from '../types/employee';
import type { Employee } from '../types/api';
import type { Page } from '../types/asset';

export const getEmployees = async (
  page = 0,
  size = 10,
  keyword = ''
): Promise<ApiResponse<Page<Employee>>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (keyword) params.append('keyword', keyword);

  const response = await apiClient.get<ApiResponse<Page<Employee>>>(`/employees?${params.toString()}`);
  return response.data;
};

export const createEmployee = async (employee: EmployeeRequest): Promise<ApiResponse<Employee>> => {
  const response = await apiClient.post<ApiResponse<Employee>>('/employees', employee);
  return response.data;
};

export const updateEmployee = async (id: string, employee: EmployeeRequest): Promise<ApiResponse<Employee>> => {
  const response = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/employees/${id}`);
  return response.data;
};

export const getEmployeeAssets = async (id: string): Promise<ApiResponse<any[]>> => {
  const response = await apiClient.get<ApiResponse<any[]>>(`/employees/${id}/assets`);
  return response.data;
};
