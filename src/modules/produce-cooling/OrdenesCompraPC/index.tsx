// OrdenesCompraPC/OrdenesCompraPCView.tsx

import React from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { useOrdenesCompraPC } from './hooks/useOrdenesCompraPC';
import { OrdenesCompraPCHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { NuevaOrdenCompra } from './components/NuevaOrdenCompra';
import { SeguimientoOCs } from './components/SeguimientoOCs';
import { BusinessRulesCallout } from './components/BusinessRulesCallout';
import { ordenesCompraPCService } from './services/OrdenesCompraPCService';
import { notifications } from '@mantine/notifications';

export function OrdenesCompraPCView() {
  const {
    ordenes,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    createOrden,
    refresh,
  } = useOrdenesCompraPC();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const options = ordenesCompraPCService.getOptions();

  const handleCreateOrden = (data: any) => {
    setIsSubmitting(true);
    try {
      const nueva = createOrden(data);
      notifications.show({
        title: 'Orden de compra creada',
        message: `${nueva.noOC} creada exitosamente`,
        color: 'blue',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Error al crear orden',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && ordenes.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando órdenes de compra...</Text>
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
          <OrdenesCompraPCHeader />
          <KpiCards stats={stats} />

          <NuevaOrdenCompra
            onSave={handleCreateOrden}
            isSubmitting={isSubmitting}
            options={{
              proveedores: options.proveedores,
              categorias: options.categorias,
              unidades: options.unidades,
              destinos: options.destinos,
            }}
          />

          <BusinessRulesCallout />

          <SeguimientoOCs
            data={ordenes}
            filters={filters}
            onFilterChange={setFilters}
            options={{
              proveedores: options.proveedores,
              categorias: options.categorias,
              estatus: options.estatus,
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}