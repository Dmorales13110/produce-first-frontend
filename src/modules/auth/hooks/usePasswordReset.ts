// src/pages/hooks/usePasswordReset.ts
import { useState } from 'react';
import { AuthService } from '../../../services/auth';

export const usePasswordReset = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const sendResetEmail = async (email: string) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);
        try {
            await AuthService.forgotPassword(email);
            setIsSuccess(true);
        } catch (err: any) {
            const errorMessage = err?.details?.responseBody?.error || 
                               err?.details?.responseBody?.message || 
                               err?.message || 
                               'Error al enviar el correo de recuperación';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const executeReset = async (token: string, password: string) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);
        try {
            // Si tu backend tiene un endpoint de reset, usa AuthService.resetPassword
            // Por ahora simulamos
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsSuccess(true);
        } catch (err: any) {
            const errorMessage = err?.message || 'Error al restablecer la contraseña';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return { sendResetEmail, executeReset, isLoading, error, isSuccess };
};