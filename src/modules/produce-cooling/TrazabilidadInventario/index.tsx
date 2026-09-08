// TrazabilidadInventario/TrazabilidadInventarioView.tsx

import React from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useTrazabilidadInventario } from './hooks/useTrazabilidadInventario';
import { TrazabilidadHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { TrazabilidadTable } from './components/TrazabilidadTable';
import { KardexTable } from './components/KardexTable';
import { OcupacionCuarto } from './components/OcupacionCuarto';
import { trazabilidadInventarioService } from './services/trazabilidadInventarioService';

export function TrazabilidadInventarioView() {
  const {
    trazabilidad,
    kardex,
    ocupacion,
    stats,
    isLoading,
    error,
    filters,
    kardexFilters,
    setFilters,
    setKardexFilters,
    refresh,
  } = useTrazabilidadInventario();

  const options = trazabilidadInventarioService.getOptions();

  if (isLoading && trazabilidad.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando datos de trazabilidad...</Text>
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
          <TrazabilidadHeader />
          <KpiCards stats={stats} />
          
          <TrazabilidadTable
            data={trazabilidad}
            filters={filters}
            onFilterChange={setFilters}
            options={{
              productores: options.productores,
              vegetales: options.vegetales,
              estados: options.estados,
            }}
          />
          
          <KardexTable
            data={kardex}
            filters={kardexFilters}
            onFilterChange={setKardexFilters}
            options={{
              productos: options.productosKardex,
              rangos: options.rangos,
            }}
          />
          
          <OcupacionCuarto ocupacion={ocupacion} stats={stats} />
        </Stack>
      </Container>
    </Box>
  );
}