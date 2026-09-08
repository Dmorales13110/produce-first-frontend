// src/pages/components/ResetPasswordForm.tsx
import React, { useState } from 'react';
import { 
  Stack, 
  Title, 
  Text, 
  Group, 
  ThemeIcon, 
  Alert, 
  PasswordInput, 
  Button,
  Box,
  Progress
} from '@mantine/core';
import { IconLock, IconCheck, IconKey } from '@tabler/icons-react';
import { usePasswordReset } from '../hooks/usePasswordReset';
import { passwordInputStyles, gradientButtonStyles } from '../styles/auth.styles';

interface ResetPasswordFormProps {
  token: string;
  onBack: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token, onBack }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { executeReset, isLoading, error: apiError, isSuccess } = usePasswordReset();

  const getPasswordStrength = (pass: string): number => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError(null);
    await executeReset(token, password);
  };

  if (isSuccess) {
    return (
      <Stack gap="lg" align="center" ta="center">
        <ThemeIcon 
          size={60} 
          radius="xl" 
          variant="light" 
          color="green"
          style={{ backgroundColor: '#E8F5E9', color: '#1F5C3A' }}
        >
          <IconCheck size={30} stroke={1.5} />
        </ThemeIcon>
        <Stack gap={4}>
          <Title order={3} c="#3A3A34">¡Contraseña Actualizada!</Title>
          <Text c="dimmed" size="sm" maw={320}>
            Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión.
          </Text>
        </Stack>
        <Button 
          style={gradientButtonStyles} 
          onClick={onBack} 
          fullWidth 
          mt="md"
        >
          Iniciar Sesión
        </Button>
      </Stack>
    );
  }

  const strength = getPasswordStrength(password);
  const strengthColor = ['red', 'orange', 'yellow', 'teal', 'green'][strength];
  const strengthLabel = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'][strength];

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Group gap="sm">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
            <IconKey size={18} stroke={1.5} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={2} fw={800} c="#3A3A34" style={{ fontSize: '22px' }}>
              Nueva Contraseña
            </Title>
            <Text c="dimmed" size="sm">Ingresa tu nueva contraseña de acceso</Text>
          </Stack>
        </Group>

        {(error || apiError) && (
          <Alert color="red" variant="light" withCloseButton>
            {error || apiError}
          </Alert>
        )}

        <Stack gap="md">
          <Stack gap={4}>
            <PasswordInput
              label="Nueva Contraseña"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              leftSection={<IconLock size={18} stroke={1.5} />}
              styles={passwordInputStyles}
            />
            {password.length > 0 && (
              <Stack gap={4}>
                <Progress value={(strength / 4) * 100} color={strengthColor} size="xs" radius="xl" />
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">Fortaleza: {strengthLabel}</Text>
                  <Text size="xs" c="dimmed">{password.length}/6+ caracteres</Text>
                </Group>
              </Stack>
            )}
          </Stack>

          <PasswordInput
            label="Confirmar Contraseña"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            leftSection={<IconLock size={18} stroke={1.5} />}
            styles={passwordInputStyles}
            error={confirmPassword && password !== confirmPassword ? 'Las contraseñas no coinciden' : undefined}
          />

          <Button
            type="submit"
            size="md"
            fullWidth
            leftSection={<IconCheck size={16} stroke={1.5} />}
            style={gradientButtonStyles}
            disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
          >
            {isLoading ? 'Guardando...' : 'Restablecer Contraseña'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};