// OrdenesEmbarque/OrdenesEmbarqueView.tsx

import React from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { useOrdenesEmbarque } from './hooks/useOrdenesEmbarque';
import { OrdenesEmbarqueHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { AceptarProforma } from './components/AceptarProForma';
import { ConfirmarCarga } from './components/ConfirmarCarga';
import { OrdenesTable } from './components/OrdenesTable';
import { BusinessRulesCallout } from './components/BusinessRulesCallout';
import { ordenesEmbarqueService } from './services/ordenesEmbarqueService';
import { notifications } from '@mantine/notifications';

export function OrdenesEmbarqueView() {
  const {
    cargas,
    proformas,
    ordenes,
    stats,
    isLoading,
    error,
    filters,
    toggleCarga,
    updateCarga,
    aceptarProforma,
    confirmarCarga,
    setFilters,
    refresh,
  } = useOrdenesEmbarque();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const options = ordenesEmbarqueService.getOptions();

  const handleAceptarProforma = async () => {
    setIsSubmitting(true);
    try {
      const result = await aceptarProforma();
      if (result.success) {
        notifications.show({
          title: 'Proforma aceptada',
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

  const handleConfirmarCarga = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await confirmarCarga(data);
      if (result.success) {
        notifications.show({
          title: 'Carga confirmada',
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

  if (isLoading && cargas.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando órdenes de embarque...</Text>
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
          <OrdenesEmbarqueHeader />
          <KpiCards stats={stats} />

          <AceptarProforma
            data={proformas}
            onAceptar={handleAceptarProforma}
            isSubmitting={isSubmitting}
            proformaId="PRF-0146"
          />

          <ConfirmarCarga
            data={cargas}
            onToggle={toggleCarga}
            onUpdate={updateCarga}
            onConfirm={handleConfirmarCarga}
            isSubmitting={isSubmitting}
          />

          <BusinessRulesCallout />

          <OrdenesTable
            data={ordenes}
            filters={filters}
            onFilterChange={setFilters}
            options={{
              clientes: options.clientes,
              estatus: options.estatus,
              rangos: options.rangos,
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}