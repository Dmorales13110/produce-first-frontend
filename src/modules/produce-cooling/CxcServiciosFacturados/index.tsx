// CxcServiciosFacturados/CxcServiciosFacturadosView.tsx

import React, { useState } from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { useCxcServiciosFacturados } from './hooks/useCxcServiciosFacturados';
import { CxcServiciosFacturadosHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { EmitirFactura } from './components/EmitirFactura';
import { ListaMaestraCxc } from './components/ListaMaestraCxc';
import { MarcarCobradas } from './components/MarcarCobradas';
import { BusinessRulesCallout } from './components/BusinessRulesCallout';
import { cxcServiciosFacturadosService } from './services/cxcServiciosFacturadosService';
import { notifications } from '@mantine/notifications';

export function CxcServiciosFacturadosView() {
  const {
    facturas,
    cuentasCxc,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    emitirFactura,
    marcarCobradas,
    refresh,
  } = useCxcServiciosFacturados();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const options = cxcServiciosFacturadosService.getOptions();

  const handleEmitirFactura = (id: string, folio: string) => {
    const result = emitirFactura(id, folio);
    if (result) {
      notifications.show({
        title: 'Factura emitida',
        message: `${result.factura} emitida para ${result.cliente}`,
        color: 'blue',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    }
  };

  const handleMarcarCobradas = async (ids: number[], fechaCobro: string) => {
    setIsSubmitting(true);
    try {
      const result = await marcarCobradas(ids, fechaCobro);
      if (result.success) {
        notifications.show({
          title: 'Cobros registrados',
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

  if (isLoading && cuentasCxc.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando cuentas por cobrar...</Text>
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
          <CxcServiciosFacturadosHeader />
          <KpiCards stats={stats} />

          <EmitirFactura
            data={facturas}
            onEmitir={handleEmitirFactura}
          />

          <ListaMaestraCxc
            data={cuentasCxc}
            filters={filters}
            onFilterChange={setFilters}
            onSelectionChange={setSelectedIds}
            options={{
              clientes: options.clientes,
              servicios: options.servicios,
              estatus: options.estatus,
            }}
          />

          <MarcarCobradas
            selectedIds={selectedIds}
            onMarcarCobradas={handleMarcarCobradas}
            isSubmitting={isSubmitting}
          />

          <BusinessRulesCallout />
        </Stack>
      </Container>
    </Box>
  );
}