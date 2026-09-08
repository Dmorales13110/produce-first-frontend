// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthService } from '../services/auth';

export type UserRole = 'admin' | 'grower' | 'cooling' | 'comercial' | 'customer';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    empresa_id?: string;
    rancho_id?: string;
    token: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
    isAuthenticated: boolean;
    checkAuth: () => void;
    role: UserRole | null;
    empresa_id: string | null;
    rancho_id: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = () => {
        try {
            const token = localStorage.getItem('produce_first_token');
            const userData = localStorage.getItem('produce_first_user');

            if (token && userData) {
                if (AuthService.isTokenExpired(token)) {
                    console.warn('🔒 [AuthContext] Token expirado detectado en checkAuth. Limpiando sesión...');
                    AuthService.clearSession();
                    setUser(null);
                    return;
                }
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            AuthService.clearSession();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();

        const handleUnauthorized = () => {
            console.warn('🔒 [AuthContext] Evento de sesión no autorizada. Actualizando estado a deslogueado...');
            setUser(null);
        };

        // Escuchar eventos de sesión revocada/expirada emitidos por apiClient o AuthService
        window.addEventListener('auth:unauthorized', handleUnauthorized);

        // Verificación periódica cada 30 segundos y al retomar foco de ventana
        const verifySessionStatus = () => {
            const currentToken = localStorage.getItem('produce_first_token');
            if (currentToken && AuthService.isTokenExpired(currentToken)) {
                console.warn('🔒 [AuthContext] Token expirado detectado en verificación periódica.');
                AuthService.clearSession();
                setUser(null);
                if (window.location.pathname !== '/login') {
                    window.location.replace('/login');
                }
            }
        };

        const intervalId = setInterval(verifySessionStatus, 30000);
        window.addEventListener('focus', verifySessionStatus);

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
            window.removeEventListener('focus', verifySessionStatus);
            clearInterval(intervalId);
        };
    }, []);

    const login = (userData: AuthUser) => {
        localStorage.setItem('produce_first_token', userData.token);
        localStorage.setItem('produce_first_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    const role = user?.role || null;
    const empresa_id = user?.empresa_id || null;
    const rancho_id = user?.rancho_id || null;

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                isAuthenticated: !!user,
                checkAuth,
                role,
                empresa_id,
                rancho_id,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};