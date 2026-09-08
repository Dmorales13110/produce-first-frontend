// src/pages/components/LoginForm.tsx

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
  TextInput,
  Checkbox,
  Box
} from '@mantine/core';
import { 
  IconLock, 
  IconEyeOff, 
  IconEye, 
  IconArrowRight,
  IconMail
} from '@tabler/icons-react';
import { useLogin } from '../hooks/useLogin';
import { authInputStyles, passwordInputStyles, gradientButtonStyles } from '../styles/auth.styles';

interface LoginFormProps {
  onNavigate: (page: 'forgot') => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [rememberMe, setRememberMe] = useState(false);

  const { login, error: loginError, isLoading } = useLogin();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Ingrese un correo válido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(email, password, rememberMe);
    } catch (err) {
      // El error ya está manejado en useLogin
      console.error(err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Group gap="sm">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
            <IconLock size={18} stroke={1.5} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={2} fw={800} c="#3A3A34" style={{ fontSize: '22px' }}>
              Iniciar Sesión
            </Title>
            <Text c="dimmed" size="sm">Ingresa tus credenciales para acceder al sistema</Text>
          </Stack>
        </Group>

        {loginError && (
          <Alert 
            color="red" 
            variant="light" 
            withCloseButton
            icon={<IconLock size={14} />}
            style={{ borderRadius: '8px' }}
          >
            {loginError}
          </Alert>
        )}

        <Stack gap="md">
          <TextInput
            label="Correo Electrónico"
            placeholder="correo@producefirst.com"
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            required
            type="email"
            error={errors.email}
            leftSection={<IconMail size={18} stroke={1.5} />}
            styles={authInputStyles}
          />

          <PasswordInput
            label="Contraseña"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            error={errors.password}
            leftSection={<IconLock size={18} stroke={1.5} />}
            visibilityToggleIcon={({ reveal }) =>
              reveal ? <IconEyeOff size={18} stroke={1.5} /> : <IconEye size={18} stroke={1.5} />
            }
            styles={passwordInputStyles}
          />

          <Group justify="space-between">
            <Checkbox
              label="Recordarme"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.currentTarget.checked)}
              size="sm"
              styles={{
                label: { fontSize: '13px', color: '#3A3A34' },
              }}
            />
            <Button
              variant="subtle"
              size="xs"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('forgot');
              }}
              style={{ color: '#1F5C3A', fontWeight: 600 }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </Group>

          <Button
            type="submit"
            size="md"
            fullWidth
            rightSection={<IconArrowRight size={16} stroke={1.5} />}
            style={gradientButtonStyles}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>

          <Box ta="center" pt="sm">
            <Text size="xs" c="dimmed">
              ¿No tienes cuenta? Contacta con el administrador del sistema
            </Text>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};