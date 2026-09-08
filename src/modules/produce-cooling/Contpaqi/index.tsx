// Contpaqi/ContpaqiView.tsx

import React, { useState } from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { useContpaqi } from './hooks/useContpaqi';
import { ContpaqiHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { EquivalenciasTable } from './components/EquivalenciasTable';
import { ExportacionPaquetes } from './components/ExportacionPaquetes';
import { BusinessRulesCallout } from './components/BusinessRulesCallout';
import { notifications } from '@mantine/notifications';

export function ContpaqiView() {
  const {
    equivalencias,
    paquetes,
    stats,
    isLoading,
    error,
    updateEquivalencia,
    exportarPaquete,
    refresh,
  } = useContpaqi();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveEquivalencias = () => {
    setIsSubmitting(true);
    try {
      notifications.show({
        title: 'Equivalencias guardadas',
        message: 'Las equivalencias se han guardado correctamente',
        color: 'blue',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Error al guardar equivalencias',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportarPaquete = async (paquete: string) => {
    setIsSubmitting(true);
    try {
      const result = await exportarPaquete(paquete);
      if (result.success) {
        notifications.show({
          title: 'Paquete exportado',
          message: result.message,
          color: 'blue',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      } else {
        notifications.show({
          title: 'Error',
          message: result.message,
          color: 'red',
          icon: <IconAlertCircle size={16} />,
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && equivalencias.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando equivalencias...</Text>
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
          <ContpaqiHeader />
          <KpiCards stats={stats} />

          <EquivalenciasTable
            data={equivalencias}
            onUpdate={updateEquivalencia}
            onSave={handleSaveEquivalencias}
            isSubmitting={isSubmitting}
          />

          <ExportacionPaquetes
            data={paquetes}
            onExportar={handleExportarPaquete}
            isSubmitting={isSubmitting}
          />

          <BusinessRulesCallout />
        </Stack>
      </Container>
    </Box>
  );
}