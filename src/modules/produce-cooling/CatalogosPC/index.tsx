// CatalogosPC/CatalogosPCView.tsx

import React from 'react';
import { Box, Container, Stack, Alert, Loader, Center, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconCheck } from '@tabler/icons-react';
import { useCatalogosPC } from './hooks/useCatalogsPC';
import { CatalogosPCHeader } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { ProveedoresTable } from './components/ProveedoresTable';
import { ProductosTable } from './components/ProductosTable';
import { BusinessRulesCallout } from './components/BusinessRulesCallout';
import { catalogosPCService } from './services/catalogosPCService';
import { notifications } from '@mantine/notifications';

export function CatalogosPCView() {
  const {
    proveedores,
    productos,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    updateProveedor,
    updateProducto,
    refresh,
  } = useCatalogosPC();

  const options = catalogosPCService.getOptions();

  const handleUpdateProveedor = (id: number, data: any) => {
    const updated = updateProveedor(id, data);
    if (updated) {
      notifications.show({
        title: 'Proveedor actualizado',
        message: `${updated.proveedor} actualizado exitosamente`,
        color: 'blue',
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
    }
  };

  const handleUpdateProducto = (id: number, data: any) => {
    const updated = updateProducto(id, data);
    if (updated) {
      notifications.show({
        title: 'Producto actualizado',
        message: `${updated.producto} actualizado exitosamente`,
        color: 'blue',
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
    }
  };

  const handleAddProducto = () => {
    notifications.show({
      title: 'Nuevo producto',
      message: 'Formulario de alta de producto (en construcción)',
      color: 'blue',
      icon: <IconCheck size={16} />,
      autoClose: 3000,
    });
  };

  if (isLoading && proveedores.length === 0) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="blue" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando catálogos...</Text>
        </Stack>
      </Center>
    );
  }

  if (error && proveedores.length === 0) {
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
          <CatalogosPCHeader />
          <KpiCards stats={stats} />

          <ProveedoresTable
            data={proveedores}
            filters={filters}
            onFilterChange={setFilters}
            onUpdate={handleUpdateProveedor}
            options={{
              tipos: options.tiposProveedor,
              estatus: options.estatusProveedor,
            }}
          />

          <ProductosTable
            data={productos}
            onUpdate={handleUpdateProducto}
            onAdd={handleAddProducto}
          />

          <BusinessRulesCallout />
        </Stack>
      </Container>
    </Box>
  );
}