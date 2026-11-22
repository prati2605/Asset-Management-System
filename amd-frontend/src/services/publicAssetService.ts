import axios from 'axios';
import type { ApiResponse } from '../types/api';

export interface PublicAssetResponse {
  id: string;
  name: string;
  assetType: string;
  brand?: string;
  model?: string;
  serialNumber: string;
  status: string;
  department?: string;
  location?: string;
}

export const publicAssetService = {
  getAssetById: async (assetId: string): Promise<PublicAssetResponse> => {
    // Note: Use the relative URL so it routes through Vite proxy,
    // avoiding apiClient so we don't attach Authorization header
    const response = await axios.get<ApiResponse<PublicAssetResponse>>(`/api/v1/assets/public/${assetId}`);
    return response.data.data;
  }
};
