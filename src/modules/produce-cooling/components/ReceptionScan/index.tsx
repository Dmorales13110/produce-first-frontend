// components/ReceptionScan/ReceptionScanView.tsx

import React, { useState } from 'react';
import { Box, Container, Stack, Paper, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { useReceptionScan } from './hooks/useReceptionScan';
import { ReceptionHeader } from './components/ReceptionHeader';
import { KpiCards } from './components/KpiCards';
import { ScanFolioForm } from './components/ScanFolioForm';
import { ManualCaptureForm } from './components/ManualCaptureForm';
import { BusinessRulesCallout } from './components/BusinessRulesCallout';
import { ReceptionTable } from './components/ReceptionTable';
import { notifications } from '@mantine/notifications';

export function ReceptionScanView() {
  const {
    receptions,
    folioDetail,
    isLoading,
    error,
    filters,
    setFilters,
    scanFolio,
    confirmReception,
    confirmManualReception,
    refresh,
    stats,
  } = useReceptionScan();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmReception = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await confirmReception(data);
      if (result.success) {
        notifications.show({
          title: '✅ Recepción confirmada',
          message: result.message,
          color: 'blue',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      } else {
        notifications.show({
          title: '❌ Error',
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

  const handleConfirmManual = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await confirmManualReception(data);
      if (result.success) {
        notifications.show({
          title: '✅ Recepción manual confirmada',
          message: result.message,
          color: 'blue',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      } else {
        notifications.show({
          title: '❌ Error',
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

  if (isLoading && receptions.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando recepciones...</Text>
        </Stack>
      </Center>
    );
  }

  if (error && receptions.length === 0) {
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
          {/* Header */}
          <ReceptionHeader />

          {/* Tarjetas de KPIs */}
          <KpiCards stats={stats} />

          {/* Sección de escaneo de folio */}
          <ScanFolioForm
            folioDetail={folioDetail}
            onScan={scanFolio}
            onConfirm={handleConfirmReception}
            isSubmitting={isSubmitting}
          />

          {/* Sección de captura manual */}
          <ManualCaptureForm
            onConfirm={handleConfirmManual}
            isSubmitting={isSubmitting}
          />

          {/* Reglas de negocio */}
          <BusinessRulesCallout />

          {/* Tabla de recepciones */}
          <ReceptionTable
            data={receptions}
            filters={filters}
            onFilterChange={setFilters}
            onRefresh={refresh}
          />
        </Stack>
      </Container>
    </Box>
  );
}