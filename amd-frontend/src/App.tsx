import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import EmployeesPage from './pages/EmployeesPage';
import VendorsPage from './pages/VendorsPage';
import VendorDetailPage from './pages/VendorDetailPage';
import MaintenancePage from './pages/MaintenancePage';
import PublicAssetView from './pages/PublicAssetView';
import ReportsPage from './pages/ReportsPage';
import NotFoundPage from './pages/NotFoundPage';

import MainLayout from './components/layout/MainLayout';
import { ToastProvider } from './components/ui/ToastContext';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/assets/public/:assetId" element={<PublicAssetView />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/vendors/:id" element={<VendorDetailPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']} />}>
                <Route path="/reports" element={<ReportsPage />} />
              </Route>
            </Route>
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ToastProvider>
  );
};

export default App;
