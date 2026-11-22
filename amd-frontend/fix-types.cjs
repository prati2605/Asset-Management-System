const fs = require('fs');
const path = require('path');

const fixTypes = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');

  // assetService.ts
  if (filePath.endsWith('assetService.ts')) {
    content = content.replace(/id: number/g, 'id: string');
  }

  // employeeService.ts
  if (filePath.endsWith('employeeService.ts')) {
    content = content.replace(/id: number/g, 'id: string');
  }

  // assignmentService.ts
  if (filePath.endsWith('assignmentService.ts')) {
    content = content.replace(/assetId: number, employeeId: number/g, 'assetId: string, employeeId: string');
    content = content.replace(/assetId: number/g, 'assetId: string');
  }

  // AssetsPage.tsx
  if (filePath.endsWith('AssetsPage.tsx')) {
    content = content.replace(/brand: asset\.brand,/g, "brand: asset.brand || '',");
    content = content.replace(/model: asset\.model,/g, "model: asset.model || '',");
  }

  // EmployeesPage.tsx
  if (filePath.endsWith('EmployeesPage.tsx')) {
    content = content.replace(/designation: employee\.designation,/g, "designation: employee.designation || '',");
    content = content.replace(/department: employee\.department,/g, "department: employee.department || '',");
    content = content.replace(/phoneNumber: employee\.phoneNumber,/g, "phoneNumber: employee.phoneNumber || '',");
  }

  fs.writeFileSync(filePath, content);
};

const files = [
  'src/services/assetService.ts',
  'src/services/employeeService.ts',
  'src/services/assignmentService.ts',
  'src/pages/AssetsPage.tsx',
  'src/pages/EmployeesPage.tsx',
].map(f => path.join(__dirname, f));

files.forEach(f => fixTypes(f));
console.log('Fixed types');
