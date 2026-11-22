export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponseData {
  token: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'VIEWER';
  fullName?: string;
}

export interface DashboardStats {
  totalAssets: number;
  totalEmployees: number;
  totalAssetValue: number;
  availableAssets: number;
  assignedAssets: number;
  maintenanceAssets: number;
  retiredAssets: number;
  assetsByType: Record<string, number>;
  assetsByDepartment: Record<string, number>;
}

export interface Asset {
  id: string;
  name: string;
  assetType: string;
  brand?: string;
  model?: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  status: 'AVAILABLE' | 'IN_USE' | 'UNDER_REPAIR' | 'DISPOSED';
  department?: string;
  location?: string;
  warrantyExpiry?: string;
  qrCode: string;
  createdAt: string;
  vendorId?: string;
  vendorName?: string;
}

export interface Vendor {
  id: string;
  vendorCode: string;
  name: string;
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface VendorRequest {
  vendorCode: string;
  name: string;
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
}

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type MaintenanceStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Maintenance {
  id: string;
  assetId: string;
  assetName: string;
  issueDescription: string;
  reportedDate: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  technician?: string;
  vendorId?: string;
  vendorName?: string;
  repairCost?: number;
  completedDate?: string;
  remarks?: string;
  createdAt: string;
}

export interface MaintenanceRequest {
  assetId: string;
  issueDescription: string;
  reportedDate: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  technician?: string;
  vendorId?: string;
  repairCost?: number;
  completedDate?: string;
  remarks?: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  designation?: string;
  department?: string;
  phoneNumber?: string;
  status?: string;
}

export interface User {
  email: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'VIEWER';
  fullName?: string;
}
