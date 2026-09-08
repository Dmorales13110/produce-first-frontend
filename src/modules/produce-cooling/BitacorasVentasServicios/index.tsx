// BitacorasVentasServicios/BitacorasVentasServiciosView.tsx

import React from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useBitacorasVentasServicios } from './hooks/useBitacorasVentasServicios';
import { BitacorasHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { VacioForm } from './components/VacioForm';
import { HieloForm } from './components/HieloForm';
import { EnhieladoForm } from './components/EnHieladoForm';
import { RepackForm } from './components/RepackForm';
import { VentasServiciosTable } from './components/VentasServiciosTable';
import { TemperaturasChart } from './components/TemperaturasChart';
import { bitacorasVentasServiciosService } from './services/bitacorasVentasServiciosService';

export function BitacorasVentasServiciosView() {
  const {
    vacio,
    hielo,
    enhielado,
    repack,
    ventasServicios,
    temperaturas,
    stats,
    isLoading,
    error,
    saveVacio,
    saveHielo,
    saveEnhielado,
    saveRepack,
    setVentasFilters,
    refresh,
  } = useBitacorasVentasServicios();

  const [ventasFilters, setVentasFiltersLocal] = React.useState({
    rango: 'Hoy',
    cliente: 'Todos',
    servicio: 'Todos',
  });

  const options = bitacorasVentasServiciosService.getOptions();

  const handleVentasFilterChange = (newFilters: any) => {
    setVentasFiltersLocal(newFilters);
    setVentasFilters(newFilters);
  };

  if (isLoading && vacio.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando bitácoras...</Text>
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
          <BitacorasHeader />
          <KpiCards stats={stats} />

          <VacioForm
            data={vacio}
            onSave={saveVacio}
            operadores={options.operadores}
          />

          <HieloForm
            data={hielo}
            onSave={saveHielo}
          />

          <EnhieladoForm
            data={enhielado}
            onSave={saveEnhielado}
            folios={['DV-2725', 'ZER-11B', 'JAV-0512', 'TER-BR-04']}
            productos={['Shanghai Bok', 'Coliflor', 'Choy Mieu', 'Brócoli (tercero)']}
          />

          <RepackForm
            data={repack}
            onSave={saveRepack}
            lineas={options.lineas}
            turnos={options.turnos}
            folios={['TER-BR-04 Brócoli', 'ZER-11B Coliflor', 'DV-2725 Shanghai']}
          />

          <VentasServiciosTable
            data={ventasServicios}
            filters={ventasFilters}
            onFilterChange={handleVentasFilterChange}
            options={{
              clientes: options.clientes,
              servicios: options.servicios,
              rangos: options.rangos,
            }}
          />

          <TemperaturasChart data={temperaturas} />
        </Stack>
      </Container>
    </Box>
  );
}