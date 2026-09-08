import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/auth';
import { isModuleAllowed } from '../config/modules.config';

export type AllowedRole = 'admin' | 'grower' | 'cooling' | 'comercial' | 'customer';

interface ProtectedRouteProps {
  redirectTo?: string;
  moduleId?: string;
  allowedRoles?: AllowedRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  redirectTo = '/login',
  moduleId,
  allowedRoles,
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

  const token = localStorage.getItem('produce_first_token');
  const isExpired = token ? AuthService.isTokenExpired(token) : true;

  if (!isAuthenticated || !token || isExpired) {
    if (isExpired && token) {
      AuthService.clearSession();
    }
    return <Navigate to={redirectTo} replace />;
  }

  // Si el usuario es un cliente y no está en la ruta del portal de clientes, redirigir a su portal
  if (role === 'customer' && !location.pathname.startsWith('/portal-clientes') && !location.pathname.startsWith('/produce-first/pfw1')) {
    return <Navigate to="/portal-clientes" replace />;
  }

  // Si no es cliente pero no tiene el rol permitido, redirigir a dashboard
  if (allowedRoles && role && !allowedRoles.includes(role as any)) {
    const fallbackPath = role === 'customer' ? '/portal-clientes' : '/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  if (moduleId && !isModuleAllowed(moduleId, role)) {
    const fallbackPath = role === 'customer' ? '/portal-clientes' : '/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};