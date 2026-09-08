// PresupuestoPC/PresupuestoPCView.tsx

import React from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { usePresupuestoPC } from './hooks/usePresupuestoPC';
import { PresupuestoPCHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { TarifasForm } from './components/TarifasForm';
import { VolumenTable } from './components/VolumenTable';
import { CostosTable } from './components/CostosTable';
import { ResultadoPlan } from './components/ResultadoPlan';
import { CapitalArranque } from './components/CapitalArranque';
import { BusinessRulesCallout } from './components/BusinessRuleCallout';
import { notifications } from '@mantine/notifications';

export function PresupuestoPCView() {
  const {
    tarifas,
    volumen,
    costos,
    resultado,
    capital,
    stats,
    isLoading,
    error,
    updateTarifas,
    updateCosto,
    refresh,
  } = usePresupuestoPC();

  const handleSave = () => {
    notifications.show({
      title: 'Presupuesto guardado',
      message: 'El presupuesto de PC ha sido guardado exitosamente',
      color: 'blue',
      icon: <IconCheck size={16} />,
      autoClose: 3000,
    });
  };

  if (isLoading && Object.keys(tarifas).length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando presupuesto...</Text>
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
          <PresupuestoPCHeader />
          <KpiCards stats={stats} />

          <TarifasForm
            data={tarifas}
            onUpdate={updateTarifas}
          />

          <VolumenTable data={volumen} />

          <CostosTable
            data={costos}
            onUpdate={updateCosto}
            tcMxnUsd={tarifas.tcMxnUsd || 17.5}
          />

          <ResultadoPlan
            data={resultado}
            margin={stats.margen}
          />

          <CapitalArranque data={capital} />

          <BusinessRulesCallout />
        </Stack>
      </Container>
    </Box>
  );
}