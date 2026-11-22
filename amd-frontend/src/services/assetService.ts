import apiClient from './apiClient';
import type { ApiResponse } from '../types/api';
import type { Page, AssetRequest } from '../types/asset';
import type { Asset } from '../types/api';

export const getAssets = async (
  page = 0,
  size = 10,
  keyword = '',
  status = '',
  assetType = '',
  vendorId = ''
): Promise<ApiResponse<Page<Asset>>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (keyword) params.append('keyword', keyword);
  if (status) params.append('status', status);
  if (assetType) params.append('assetType', assetType);
  if (vendorId) params.append('vendorId', vendorId);

  const response = await apiClient.get<ApiResponse<Page<Asset>>>(`/assets?${params.toString()}`);
  return response.data;
};

export const createAsset = async (asset: AssetRequest): Promise<ApiResponse<Asset>> => {
  const response = await apiClient.post<ApiResponse<Asset>>('/assets', asset);
  return response.data;
};

export const updateAsset = async (id: string, asset: AssetRequest): Promise<ApiResponse<Asset>> => {
  const response = await apiClient.put<ApiResponse<Asset>>(`/assets/${id}`, asset);
  return response.data;
};

export const deleteAsset = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/assets/${id}`);
  return response.data;
};

export const getAssetHistory = async (id: string): Promise<ApiResponse<any[]>> => {
  const response = await apiClient.get<ApiResponse<any[]>>(`/assets/${id}/history`);
  return response.data;
};

export const getWarrantyAlerts = async (daysAhead = 30): Promise<ApiResponse<Asset[]>> => {
  const response = await apiClient.get<ApiResponse<Asset[]>>(`/assets/warranty-alerts?daysAhead=${daysAhead}`);
  return response.data;
};
