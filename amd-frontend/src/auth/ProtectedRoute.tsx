import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { User } from '../types/api';

interface ProtectedRouteProps {
  allowedRoles?: User['role'][];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard or forbidden page if not allowed
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
