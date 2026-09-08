// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { isModuleAllowed } from '../config/modules.config';

interface ProtectedRouteProps {
  redirectTo?: string;
  moduleId?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  redirectTo = '/login',
  moduleId 
}) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center style={{ width: '100%', height: '100vh' }}>
        <Loader color="growerGreen" size="md" type="dots" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (moduleId && !isModuleAllowed(moduleId, role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};