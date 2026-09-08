// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthService } from '../services/auth';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'grower' | 'cooling' | 'comercial';
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
    role: 'admin' | 'grower' | 'cooling' | 'comercial' | null;
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
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
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