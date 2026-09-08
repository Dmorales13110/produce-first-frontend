// CashFlow/CashFlowView.tsx

import React, { useState } from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { useCashFlow } from './hooks/useCashFlow';
import { CashFlowHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { SaldoForm } from './components/SaldoForm';
import { FlujoChart } from './components/FlujoChart';
import { FlujoTable } from './components/FlujoTable';
import { BusinessRulesCallout } from './components/BusinessRulesCallout';
import { cashFlowService } from './services/cashFlowService';
import { notifications } from '@mantine/notifications';

export function CashFlowView() {
  const {
    flujo,
    stats,
    saldoCorte,
    isLoading,
    error,
    updateSaldo,
    refresh,
  } = useCashFlow();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveSaldo = () => {
    setIsSubmitting(true);
    try {
      updateSaldo(saldoCorte);
      notifications.show({
        title: 'Saldo actualizado',
        message: `Saldo cuenta PC: $${saldoCorte.toLocaleString()} MXN`,
        color: 'blue',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Error al actualizar saldo',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Datos para el gráfico
  const chartData = cashFlowService.getChartData();

  if (isLoading && flujo.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando datos de flujo...</Text>
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
          <CashFlowHeader />
          <KpiCards stats={stats} />

          <SaldoForm
            value={saldoCorte}
            onChange={updateSaldo}
            onSave={handleSaveSaldo}
            isSubmitting={isSubmitting}
          />

          <FlujoChart
            semanas={chartData.semanas}
            entradas={chartData.entradas}
            salidas={chartData.salidas}
          />

          <FlujoTable data={flujo} />

          <BusinessRulesCallout />
        </Stack>
      </Container>
    </Box>
  );
}