// UsersPermissions/UsersPermissionsView.tsx

import React, { useState } from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { useUsersPermissions } from './hooks/useUserPermissions';
import { UsersPermissionsHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { UsuariosTable } from './components/UsuariosTable';
import { AltaUsuarioForm } from './components/AltaUsuarioForm';
import { BusinessRulesCallout } from './components/BusinessRuleCallout';
import { notifications } from '@mantine/notifications';

export function UsersPermissionsView() {
  const {
    usuarios,
    perfiles,
    stats,
    isLoading,
    error,
    createUsuario,
    refresh,
  } = useUsersPermissions();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUsuario = (data: any) => {
    setIsSubmitting(true);
    try {
      const nuevo = createUsuario(data);
      notifications.show({
        title: 'Usuario creado',
        message: `${nuevo.usuario} creado exitosamente`,
        color: 'blue',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Error al crear usuario',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && usuarios.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando usuarios...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Box p="md">
        <Alert
          color="red"
          variant="light"
          title="Error al cargar datos"
          icon={<IconAlertCircle size={16} />}
        >
          {error}
          <Button
            size="xs"
            variant="subtle"
            color="red"
            onClick={refresh}
            mt="sm"
            leftSection={<IconRefresh size={14} />}
          >
            Reintentar
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">
          <UsersPermissionsHeader />
          <KpiCards stats={stats} />

          <UsuariosTable data={usuarios} />

          <AltaUsuarioForm
            perfiles={perfiles}
            onCreate={handleCreateUsuario}
            isSubmitting={isSubmitting}
          />

          <BusinessRulesCallout />
        </Stack>
      </Container>
    </Box>
  );
}