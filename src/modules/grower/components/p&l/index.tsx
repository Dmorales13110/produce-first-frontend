// src/modules/grower/pl/index.tsx
import React, { useState } from 'react';
import { Box, Loader, Center, Stack, Text, Alert, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { usePL } from './hooks/usePL';
import { PLHeader } from './components/PLHeader';
import { PLKPIs } from './components/PLKPIs';
import { PLFilters } from './components/PLFilters';
import { PLTable } from './components/PLTable';
import { PLGrowersTable } from './components/PLGrowersTable';
import { plContainerStyles } from './styles/pl.styles';

export function GrowerPL() {
  const [viewMode, setViewMode] = useState<'detallado' | 'resumido'>('detallado');
  const { summary, stats, isLoading, error, selectedGrower, setSelectedGrower, refresh, getGrowerOptions } = usePL();

  // ============================================================
  // ESTADOS DE CARGA Y ERROR
  // ============================================================
  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando datos financieros...</Text>
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

  // ============================================================
  // DATOS PARA COMPONENTES
  // ============================================================
  const totalRevenue = summary?.totalRevenue || 0;
  const totalCosts = summary?.totalCosts || 0;
  const netProfit = summary?.netProfit || 0;
  const totalHarvests = summary?.totalHarvests || 0;

  return (
    <Box style={plContainerStyles}>
      {/* Header */}
      <PLHeader
        totalRevenue={totalRevenue}
        netProfit={netProfit}
        totalHarvests={totalHarvests}
      />

      {/* KPIs */}
      <PLKPIs
        totalRevenue={totalRevenue}
        totalCosts={totalCosts}
        netProfit={netProfit}
        totalHarvests={totalHarvests}
      />

      {/* Filtros */}
      <PLFilters
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedGrower={selectedGrower}
        setSelectedGrower={setSelectedGrower}
        growerOptions={getGrowerOptions()}
        onRefresh={refresh}
      />

      {/* Tabla de P&L */}
      <PLTable summary={summary} viewMode={viewMode} />

      {/* Tabla de Productores */}
      {summary?.revenueByGrower && summary.revenueByGrower.length > 0 && (
        <PLGrowersTable
          revenueByGrower={summary.revenueByGrower}
          totalRevenue={totalRevenue}
        />
      )}
    </Box>
  );
}

export default GrowerPL;