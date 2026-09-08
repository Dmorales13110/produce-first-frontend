// src/pages/hooks/useLogin.ts

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { AuthService, type AuthUser } from '../../../services/auth';

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const login = async (email: string, password: string, rememberMe: boolean = false): Promise<AuthUser | void> => {
        setIsLoading(true);
        setError(null);

        try {
            // Llamada real al backend
            const userData = await AuthService.login({ email, password });

            if (userData) {
                // Guardar usuario en localStorage con todas las propiedades
                localStorage.setItem('produce_first_user', JSON.stringify({
                    id: userData.id,
                    email: userData.email,
                    name: userData.full_name,
                    role: userData.role,
                    empresa_id: userData.empresa_id || null,
                    rancho_id: userData.rancho_id || null,
                    token: userData.token,
                }));
                
                // Actualizar el contexto con los datos del usuario
                authLogin({
                    id: userData.id,
                    email: userData.email || '',
                    name: userData.full_name || 'Usuario',
                    role: userData.role,
                    empresa_id: userData.empresa_id || undefined,
                    rancho_id: userData.rancho_id || undefined,
                    token: userData.token || '',
                });

                // Redirigir al dashboard o al portal de clientes según el rol
                if (userData.role === 'customer') {
                    navigate('/portal-clientes', { replace: true });
                } else {
                    navigate('/dashboard', { replace: true });
                }
            }

            return userData;

        } catch (err: any) {
            const errorMessage = err?.details?.responseBody?.error || 
                               err?.details?.responseBody?.message || 
                               err?.message || 
                               'Ocurrió un error inesperado al iniciar sesión';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        isLoading,
        error,
    };
};