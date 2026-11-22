import apiClient from './apiClient';

export const reportService = {
  downloadAssetsReport: async () => {
    const response = await apiClient.get('/reports/assets', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Assets_Report.xlsx');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  },

  downloadEmployeesReport: async () => {
    const response = await apiClient.get('/reports/employees', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Employees_Report.xlsx');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  },

  downloadMaintenanceReport: async () => {
    const response = await apiClient.get('/reports/maintenance', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Maintenance_Report.xlsx');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }
};
