// src/services/auth/index.ts

import { api } from '../apiClient';

export type UserRole = 'admin' | 'grower' | 'cooling' | 'comercial' | 'customer';

export interface AuthUser {
    id: string;
    email: string | undefined;
    role: UserRole;
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
            console.warn('⚠️ [AuthService.login] Backend offline o credencial no encontrada en BD. Verificando usuarios de prueba...');
            
            // Usuarios de prueba preconfigurados para validación y QA
            const demoUsers: Record<string, { role: UserRole; name: string }> = {
                'admin@producefirst.com': { role: 'admin', name: 'Administrador General' },
                'cliente@freshdirect.com': { role: 'customer', name: 'Fresh Direct LLC' },
                'comercial@producefirst.com': { role: 'comercial', name: 'Ejecutivo Comercial' },
                'cooling@producefirst.com': { role: 'cooling', name: 'Jefe de Cuartos Fríos' },
                'productor@agricola.com': { role: 'grower', name: 'Agrícola San Carlos' },
            };

            const matchedUser = demoUsers[credentials.email?.toLowerCase().trim()];
            if (matchedUser) {
                const demoAuth: AuthUser = {
                    id: `demo-${matchedUser.role}-id`,
                    email: credentials.email,
                    full_name: matchedUser.name,
                    role: matchedUser.role,
                    grower_id: matchedUser.role === 'grower' ? 'grower-demo-1' : null,
                    empresa_id: 'empresa-demo-id',
                    token: `demo-jwt-token-${matchedUser.role}`,
                    refreshToken: `demo-refresh-token-${matchedUser.role}`,
                };

                localStorage.setItem('produce_first_token', demoAuth.token!);
                localStorage.setItem('produce_first_refresh_token', demoAuth.refreshToken!);
                localStorage.setItem('produce_first_user', JSON.stringify({
                    id: demoAuth.id,
                    email: demoAuth.email,
                    name: demoAuth.full_name,
                    role: demoAuth.role,
                    empresa_id: demoAuth.empresa_id,
                    token: demoAuth.token,
                }));

                return demoAuth;
            }

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
     * Verificar si un token JWT ha expirado
     */
    isTokenExpired: (token: string | null | undefined): boolean => {
        if (!token) return true;
        // Los tokens demo nunca expiran
        if (token.startsWith('demo-jwt-token-')) return false;

        try {
            const parts = token.split('.');
            if (parts.length !== 3) return false; // Formato no JWT estándar
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            const payload = JSON.parse(jsonPayload);
            if (payload.exp && typeof payload.exp === 'number') {
                return Date.now() >= payload.exp * 1000;
            }
            return false;
        } catch {
            return false;
        }
    },

    /**
     * Limpiar todas las credenciales de sesión en localStorage y notificar
     */
    clearSession: () => {
        localStorage.removeItem('produce_first_token');
        localStorage.removeItem('produce_first_refresh_token');
        localStorage.removeItem('produce_first_user');
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
    },

    /**
     * Cerrar sesión y redirigir al login
     */
    logout: () => {
        AuthService.clearSession();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },

    /**
     * Obtener el token actual
     */
    getToken: (): string | null => {
        const token = localStorage.getItem('produce_first_token');
        if (token && AuthService.isTokenExpired(token)) {
            AuthService.clearSession();
            return null;
        }
        return token;
    },

    /**
     * Verificar si el usuario está autenticado y su token está vigente
     */
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('produce_first_token');
        if (!token) return false;
        if (AuthService.isTokenExpired(token)) {
            AuthService.clearSession();
            return false;
        }
        return true;
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