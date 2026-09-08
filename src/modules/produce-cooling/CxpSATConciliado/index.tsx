// CxpSATConciliado/CxpSATConciliadoView.tsx

import React, { useState } from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { useCxpSATConciliado } from './hooks/useCxpSATConciliado';
import { CxpSATConciliadoHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { ConciliacionSAT } from './components/ConciliacionSat';
import { ListaMaestra } from './components/ListaMaestra';
import { MarcarPagadas } from './components/MarcarPagadas';
import { FlujoVencimiento } from './components/FlujoVencimiento';
import { BusinessRulesCallout } from './components/BusinessRulesCallout';
import { cxpSATConciliadoService } from './services/cxpSATConciliadoService';
import { notifications } from '@mantine/notifications';

export function CxpSATConciliadoView() {
  const {
    facturas,
    cuentas,
    flujo,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    conciliarFactura,
    marcarPagadas,
    refresh,
  } = useCxpSATConciliado();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const options = cxpSATConciliadoService.getOptions();

  const handleConciliar = (id: string, data: { categoria: string; oc: string }) => {
    const result = conciliarFactura(id, data);
    if (result) {
      notifications.show({
        title: 'Factura conciliada',
        message: `${result.factura} conciliada con categoría ${result.categoria}`,
        color: 'blue',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    }
  };

  const handleMarcarPagadas = async (ids: number[], fechaPago: string, banco: string) => {
    setIsSubmitting(true);
    try {
      const result = await marcarPagadas(ids, fechaPago, banco);
      if (result.success) {
        notifications.show({
          title: 'Pagos registrados',
          message: result.message,
          color: 'blue',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
        setSelectedIds([]);
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

  if (isLoading && cuentas.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando cuentas por pagar...</Text>
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
          <CxpSATConciliadoHeader />
          <KpiCards stats={stats} />

          <ConciliacionSAT
            data={facturas}
            onConciliar={handleConciliar}
            options={{
              categorias: options.categorias.filter(c => c !== 'Todas'),
              ocs: ['Sin OC · contrato', 'OC-PC-2026-0038', 'OC-PC-2026-0037'],
            }}
          />

          <ListaMaestra
            data={cuentas}
            filters={filters}
            onFilterChange={setFilters}
            onSelectionChange={setSelectedIds}
            options={{
              proveedores: options.proveedores,
              categorias: options.categorias,
              estatus: options.estatus,
            }}
          />

          <MarcarPagadas
            selectedIds={selectedIds}
            onMarcarPagadas={handleMarcarPagadas}
            isSubmitting={isSubmitting}
            options={{
              bancos: options.bancos,
            }}
          />

          <FlujoVencimiento data={flujo} />

          <BusinessRulesCallout />
        </Stack>
      </Container>
    </Box>
  );
}