// src/pages/components/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import { 
  Stack, 
  Title, 
  Text, 
  Group, 
  ThemeIcon, 
  Alert, 
  TextInput, 
  Button,
  Box
} from '@mantine/core';
import { IconMail, IconArrowLeft, IconCheck, IconSend } from '@tabler/icons-react';
import { usePasswordReset } from '../hooks/usePasswordReset';
import { authInputStyles, gradientButtonStyles } from '../styles/auth.styles';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { sendResetEmail, isLoading, error: apiError, isSuccess } = usePasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Por favor, ingrese un correo electrónico válido');
      return;
    }
    setError(null);
    await sendResetEmail(email);
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
          <Title order={3} c="#3A3A34">¡Correo Enviado!</Title>
          <Text c="dimmed" size="sm" maw={320}>
            Hemos enviado las instrucciones de recuperación a <strong>{email}</strong>
          </Text>
        </Stack>
        <Button 
          variant="outline" 
          color="teal" 
          onClick={onBack} 
          fullWidth 
          mt="md"
          style={{ borderColor: '#1F5C3A', color: '#1F5C3A' }}
        >
          Volver al Login
        </Button>
      </Stack>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Group gap="sm">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
            <IconMail size={18} stroke={1.5} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={2} fw={800} c="#3A3A34" style={{ fontSize: '22px' }}>
              Recuperar Contraseña
            </Title>
            <Text c="dimmed" size="sm">Te enviaremos un enlace para restablecer tu contraseña</Text>
          </Stack>
        </Group>

        {(error || apiError) && (
          <Alert color="red" variant="light" withCloseButton>
            {error || apiError}
          </Alert>
        )}

        <Stack gap="md">
          <TextInput
            label="Correo Electrónico"
            placeholder="correo@producefirst.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
            type="email"
            leftSection={<IconMail size={18} stroke={1.5} />}
            styles={authInputStyles}
          />

          <Button
            type="submit"
            size="md"
            fullWidth
            leftSection={<IconSend size={16} stroke={1.5} />}
            style={gradientButtonStyles}
            disabled={isLoading || !email}
          >
            {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
          </Button>

          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} stroke={1.5} />}
            color="gray"
            onClick={onBack}
            fullWidth
            size="sm"
          >
            Volver al inicio de sesión
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};