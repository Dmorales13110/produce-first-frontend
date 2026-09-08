// Maintenance/MaintenanceView.tsx

import React, { useState } from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { useMaintenance } from './hooks/useMaintenance';
import { MaintenanceHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { EventoForm } from './components/EventoForm';
import { ExpedienteTable } from './components/ExpedienteTable';
import { RestriccionGrafico } from './components/RestriccionGrafico';
import { BusinessRulesCallout } from './components/BusinnesRulesCallout';
import { maintenanceService } from './services/maintenanceService';
import { notifications } from '@mantine/notifications';

export function MaintenanceView() {
  const {
    equipos,
    eventos,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    updateEquipo,
    saveEvento,
    refresh,
  } = useMaintenance();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const restriccionData = maintenanceService.getRestriccionData();

  const handleSaveEvento = (data: any) => {
    setIsSubmitting(true);
    try {
      const nuevo = saveEvento(data);
      notifications.show({
        title: 'Evento guardado',
        message: `${nuevo.equipo} - ${nuevo.descripcion}`,
        color: 'blue',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Error al guardar evento',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEquipo = (id: number, rendReal: string) => {
    updateEquipo(id, rendReal);
    notifications.show({
      title: 'Equipo actualizado',
      message: 'Rendimiento actualizado correctamente',
      color: 'blue',
      icon: <IconCheck size={16} />,
      autoClose: 2000,
    });
  };

  if (isLoading && equipos.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando equipos...</Text>
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

  const options = {
    equipos: ['Todos', 'Túnel de vacío', 'Máquinas de hielo', 'Inyector', 'Cuarto frío'],
  };

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">
          <MaintenanceHeader />
          <KpiCards stats={stats} />

          <EventoForm
            onSave={handleSaveEvento}
            isSubmitting={isSubmitting}
          />

          <ExpedienteTable
            data={equipos}
            filters={filters}
            onFilterChange={setFilters}
            onUpdate={handleUpdateEquipo}
            options={options}
          />

          <RestriccionGrafico
            dias={restriccionData.dias}
            capacidad={restriccionData.capacidad}
            demanda={restriccionData.demanda}
          />

          <BusinessRulesCallout />
        </Stack>
      </Container>
    </Box>
  );
}