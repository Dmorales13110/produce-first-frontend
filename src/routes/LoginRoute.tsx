// src/routes/LoginRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../modules/auth/index';

export const LoginRoute: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    if (role === 'customer') {
      return <Navigate to="/portal-clientes" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginPage />;
};