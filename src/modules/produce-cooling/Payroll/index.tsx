// Payroll/PayrollView.tsx

import React, { useState } from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { usePayroll } from './hooks/usePayroll';
import { PayrollHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { PlantillaTable } from './components/PlantillaTable';
import { AsistenciaForm } from './components/AsistenciaForm';
import { BoletaDestajo } from './components/BoletaDestajo';
import { NominaSemanal } from './components/NominaSemanal';
import { BusinessRulesCallout } from './components/BusinessRuleCallout';
import { notifications } from '@mantine/notifications';

export function PayrollView() {
  const {
    empleados,
    asistencia,
    boletaDestajo,
    nominaSemanal,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    addEmpleado,
    saveAsistencia,
    updateBoletaDestajo,
    refresh,
  } = usePayroll();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddEmpleado = () => {
    const nuevo = addEmpleado({
      nombre: 'Nuevo empleado',
      puesto: 'Operador',
      tipo: 'Fijo',
      sueldo: '$2,000',
      turno: '08:00–16:00',
    });
    notifications.show({
      title: 'Empleado agregado',
      message: `${nuevo.nombre} agregado a la plantilla`,
      color: 'blue',
      icon: <IconCheck size={16} />,
      autoClose: 3000,
    });
  };

  const handleSaveAsistencia = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await saveAsistencia(data);
      if (result.success) {
        notifications.show({
          title: 'Asistencia guardada',
          message: result.message,
          color: 'blue',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBoleta = async (trabajadores: any) => {
    setIsSubmitting(true);
    try {
      const result = await updateBoletaDestajo(trabajadores);
      if (result.success) {
        notifications.show({
          title: 'Boleta actualizada',
          message: result.message,
          color: 'blue',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && empleados.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando datos de personal...</Text>
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
    puestos: ['Todos', 'Supervisor', 'Técnico', 'Operador', 'Captura'],
  };

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">
          <PayrollHeader />
          <KpiCards stats={stats} />

          <PlantillaTable
            data={empleados}
            filters={filters}
            onFilterChange={setFilters}
            onAdd={handleAddEmpleado}
            options={options}
          />

          <AsistenciaForm
            empleados={empleados}
            asistencia={asistencia}
            onSave={handleSaveAsistencia}
            isSubmitting={isSubmitting}
          />

          <BoletaDestajo
            data={boletaDestajo}
            onUpdate={handleUpdateBoleta}
            isSubmitting={isSubmitting}
          />

          <NominaSemanal data={nominaSemanal} />

          <BusinessRulesCallout />
        </Stack>
      </Container>
    </Box>
  );
}