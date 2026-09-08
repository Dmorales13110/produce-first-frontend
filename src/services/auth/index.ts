// src/services/auth/index.ts

import { api } from '../apiClient';

export interface AuthUser {
    id: string;
    email: string | undefined;
    role: 'admin' | 'grower' | 'cooling' | 'comercial';
    full_name: string | null;
    grower_id: string | null;
    empresa_id?: string | null;
    rancho_id?: string | null;
    token: string | undefined;
    refreshToken?: string | undefined;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: AuthUser;
}

export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}

export interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
        };
    };
}

export interface LoginInput {
    email: string;
    password: string;
}

export const AuthService = {
    /**
     * Iniciar sesión
     * POST /auth/login
     */
    login: async (credentials: LoginInput): Promise<AuthUser> => {
        try {
            const response = await api.post<LoginResponse>('/auth/login', credentials, { skipAuth: true });
            
            // Guardar tokens en localStorage
            if (response.data.token) {
                localStorage.setItem('produce_first_token', response.data.token);
            }
            if (response.data.refreshToken) {
                localStorage.setItem('produce_first_refresh_token', response.data.refreshToken);
            }
            
            // Guardar usuario completo con rol
            if (response.data) {
                localStorage.setItem('produce_first_user', JSON.stringify({
                    id: response.data.id,
                    email: response.data.email,
                    name: response.data.full_name,
                    role: response.data.role,
                    empresa_id: response.data.empresa_id || null,
                    rancho_id: response.data.rancho_id || null,
                    token: response.data.token,
                }));
            }
            
            return response.data;
        } catch (error) {
            console.error('❌ [AuthService.login] Error:', error);
            throw error;
        }
    },

    /**
     * Recuperar contraseña
     * POST /auth/forgot-password
     */
    forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
        try {
            const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email }, { skipAuth: true });
            return response;
        } catch (error) {
            console.error('❌ [AuthService.forgotPassword] Error:', error);
            throw error;
        }
    },

    /**
     * Refrescar token
     * POST /auth/refresh
     */
    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        try {
            const response = await api.post<RefreshTokenResponse>('/auth/refresh', { refreshToken }, { skipAuth: true });
            
            if (response.data?.accessToken) {
                localStorage.setItem('produce_first_token', response.data.accessToken);
            }
            if (response.data?.refreshToken) {
                localStorage.setItem('produce_first_refresh_token', response.data.refreshToken);
            }
            
            return response;
        } catch (error) {
            console.error('❌ [AuthService.refreshToken] Error:', error);
            throw error;
        }
    },

    /**
     * Cerrar sesión
     */
    logout: () => {
        localStorage.removeItem('produce_first_token');
        localStorage.removeItem('produce_first_refresh_token');
        localStorage.removeItem('produce_first_user');
        window.location.href = '/login';
    },

    /**
     * Obtener el token actual
     */
    getToken: (): string | null => {
        return localStorage.getItem('produce_first_token');
    },

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('produce_first_token');
    },

    /**
     * Obtener el rol del usuario
     */
    getUserRole: (): string | null => {
        try {
            const userData = localStorage.getItem('produce_first_user');
            if (userData) {
                const user = JSON.parse(userData);
                return user.role || null;
            }
            return null;
        } catch {
            return null;
        }
    },

    /**
     * Obtener el usuario completo
     */
    getUser: (): AuthUser | null => {
        try {
            const userData = localStorage.getItem('produce_first_user');
            if (userData) {
                return JSON.parse(userData);
            }
            return null;
        } catch {
            return null;
        }
    },
};