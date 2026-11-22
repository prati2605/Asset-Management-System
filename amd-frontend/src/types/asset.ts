export type AssetStatus = 'AVAILABLE' | 'IN_USE' | 'UNDER_REPAIR' | 'DISPOSED';


export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AssetRequest {
  name: string;
  assetType: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  status: AssetStatus;
  department?: string;
  location?: string;
  warrantyExpiry?: string;
  vendorId?: string;
}
