const fs = require('fs');
const path = require('path');

const fixImports = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // AuthContext.tsx
  if (filePath.endsWith('AuthContext.tsx')) {
    content = content.replace(
      "import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';",
      "import React, { createContext, useContext, useState, useEffect } from 'react';\nimport type { ReactNode } from 'react';"
    );
    content = content.replace(
      "import { User, AuthResponseData } from '../types/api';",
      "import type { User, AuthResponseData } from '../types/api';"
    );
  }

  // ToastContext.tsx
  if (filePath.endsWith('ToastContext.tsx')) {
    content = content.replace(
      "import React, { createContext, useContext, useState, ReactNode } from 'react';",
      "import React, { createContext, useContext, useState } from 'react';\nimport type { ReactNode } from 'react';"
    );
  }

  // dashboardService.ts
  if (filePath.endsWith('dashboardService.ts')) {
    content = content.replace(
      "import { ApiResponse } from '../types/api';",
      "import type { ApiResponse, DashboardStats } from '../types/api';"
    );
    // remove DashboardStats interface declaration completely
    content = content.replace(/export interface DashboardStats \{[\s\S]*?\}/, '');
  }

  // DashboardPage.tsx
  if (filePath.endsWith('DashboardPage.tsx')) {
    content = content.replace(
      "import { getDashboardStats, DashboardStats } from '../services/dashboardService';",
      "import { getDashboardStats } from '../services/dashboardService';\nimport type { DashboardStats } from '../types/api';"
    );
  }

  // authService.ts
  if (filePath.endsWith('authService.ts')) {
    content = content.replace(
      "import { ApiResponse, AuthResponseData } from '../types/api';",
      "import type { ApiResponse, AuthResponseData } from '../types/api';"
    );
  }

  // assignmentService.ts
  if (filePath.endsWith('assignmentService.ts')) {
    content = content.replace(
      "import { ApiResponse } from '../types/api';",
      "import type { ApiResponse } from '../types/api';"
    );
  }

  // assetService.ts
  if (filePath.endsWith('assetService.ts')) {
    content = content.replace(
      "import { ApiResponse } from '../types/api';",
      "import type { ApiResponse } from '../types/api';"
    );
    content = content.replace(
      "import { Asset, Page, AssetRequest } from '../types/asset';",
      "import type { Page, AssetRequest } from '../types/asset';\nimport type { Asset } from '../types/api';"
    );
  }

  // employeeService.ts
  if (filePath.endsWith('employeeService.ts')) {
    content = content.replace(
      "import { ApiResponse } from '../types/api';",
      "import type { ApiResponse } from '../types/api';"
    );
    content = content.replace(
      "import { Employee, EmployeeRequest } from '../types/employee';",
      "import type { EmployeeRequest } from '../types/employee';\nimport type { Employee } from '../types/api';"
    );
    content = content.replace(
      "import { Page } from '../types/asset';",
      "import type { Page } from '../types/asset';"
    );
  }

  // AssetsPage.tsx
  if (filePath.endsWith('AssetsPage.tsx')) {
    // Remove unused imports
    content = content.replace("  History\n} from 'lucide-react';", "} from 'lucide-react';");
    content = content.replace("  getAssetHistory\n} from '../services/assetService';", "} from '../services/assetService';");
    
    content = content.replace(
      "import { Asset, AssetRequest, AssetStatus, Page } from '../types/asset';",
      "import type { AssetRequest, AssetStatus, Page } from '../types/asset';\nimport type { Asset } from '../types/api';"
    );
    content = content.replace(
      "import { Employee } from '../types/employee';",
      "import type { Employee } from '../types/api';"
    );
    
    // Fix IDs to match the new string ID from backend, since `api.ts` defines Asset id as `string` now.
    // Also change assigningAssetId from number | null to string | null
    content = content.replace("const [assigningAssetId, setAssigningAssetId] = useState<number | null>(null);", "const [assigningAssetId, setAssigningAssetId] = useState<string | null>(null);");
    // Also selectedEmployeeId
    content = content.replace("const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | ''>('');", "const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | ''>('');");
    // In editId
    content = content.replace("const [editingId, setEditingId] = useState<number | null>(null);", "const [editingId, setEditingId] = useState<string | null>(null);");

    // Fix Number(selectedEmployeeId)
    content = content.replace("await assignAsset(assigningAssetId, Number(selectedEmployeeId));", "await assignAsset(assigningAssetId, selectedEmployeeId);");
    content = content.replace("onChange={e => setSelectedEmployeeId(Number(e.target.value))}", "onChange={e => setSelectedEmployeeId(e.target.value)}");

    // Fix handleDelete signature
    content = content.replace("const handleDelete = async (id: number) => {", "const handleDelete = async (id: string) => {");
    // Fix handleReturnAsset signature
    content = content.replace("const handleReturnAsset = async (id: number) => {", "const handleReturnAsset = async (id: string) => {");
    // Fix openAssignModal signature
    content = content.replace("const openAssignModal = async (assetId: number) => {", "const openAssignModal = async (assetId: string) => {");
  }

  // EmployeesPage.tsx
  if (filePath.endsWith('EmployeesPage.tsx')) {
    content = content.replace(
      "import { Employee, EmployeeRequest } from '../types/employee';",
      "import type { EmployeeRequest } from '../types/employee';\nimport type { Employee } from '../types/api';"
    );
    content = content.replace(
      "import { Page } from '../types/asset';",
      "import type { Page } from '../types/asset';"
    );

    // Fix IDs
    content = content.replace("const [editingId, setEditingId] = useState<number | null>(null);", "const [editingId, setEditingId] = useState<string | null>(null);");
    content = content.replace("const handleDelete = async (id: number) => {", "const handleDelete = async (id: string) => {");
  }

  fs.writeFileSync(filePath, content);
};

const files = [
  'src/auth/AuthContext.tsx',
  'src/components/ui/ToastContext.tsx',
  'src/pages/AssetsPage.tsx',
  'src/pages/DashboardPage.tsx',
  'src/pages/EmployeesPage.tsx',
  'src/services/assetService.ts',
  'src/services/assignmentService.ts',
  'src/services/authService.ts',
  'src/services/dashboardService.ts',
  'src/services/employeeService.ts',
].map(f => path.join(__dirname, f));

files.forEach(f => fixImports(f));
console.log('Fixed imports');
