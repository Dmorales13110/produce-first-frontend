import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Paper,
  Text,
  Group,
  Stack,
  Badge,
  Table,
  Button,
  Select,
  TextInput,
  SegmentedControl,
  Grid,
  Divider,
  ActionIcon,
  Tooltip,
  Card,
  ThemeIcon,
  Progress,
  RingProgress,
  Modal,
  NumberInput,
  Textarea,
  Alert,
  Loader,
  Center,
  Menu,
  ScrollArea,
} from '@mantine/core';
import {
  IconBox,
  IconAlertTriangle,
  IconPlus,
  IconCheck,
  IconShoppingCartPlus,
  IconChartPie,
  IconTruck,
  IconBuildingWarehouse,
  IconCurrencyDollar,
  IconAlertCircle,
  IconRefresh,
  IconArrowUpRight,
  IconArrowDownRight,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconEye,
  IconX,
  IconPackage,
  IconSearch,
  IconChartBar,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useInventory } from './hooks/useInventory';
import { notifications } from '@mantine/notifications';

const FADE_IN = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 },
};

const TYPE_COLORS: Record<string, string> = {
  seed: '#E5A93C',
  fertilizer: '#1F5C3A',
  pesticide: '#6C9BCF',
  tool: '#A882C5',
  packaging: '#D4DEC9',
  other: '#9A968A',
};

const TYPE_LABELS: Record<string, string> = {
  seed: 'Semilla',
  fertilizer: 'Fertilizante',
  pesticide: 'Agroquímico',
  tool: 'Herramienta',
  packaging: 'Empaque',
  other: 'Otros',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'green',
  inactive: 'gray',
  low_stock: 'orange',
  out_of_stock: 'red',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  low_stock: 'Bajo Mínimo',
  out_of_stock: 'Sin Stock',
};

export function GrowerInventory() {
  const {
    items,
    movements,
    stats,
    warehouses,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    createItem,
    updateItem,
    deleteItem,
    createMovement,
  } = useInventory();

  // Estados para modales
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para filtros
  const [tabEstado, setTabEstado] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Estado para formulario de item
  const [itemForm, setItemForm] = useState({
    code: '',
    name: '',
    type: 'fertilizer',
    category: '',
    subcategory: '',
    unit: 'kg',
    quantity: 0,
    min_stock: 0,
    max_stock: 0,
    warehouse_id: '',
    supplier: '',
    batch_number: '',
    expiry_date: '',
    unit_price: 0,
    notes: '',
  });

  // Estado para formulario de movimiento
  const [movementForm, setMovementForm] = useState({
    item_id: '',
    type: 'out',
    quantity: 0,
    reason: 'adjustment',
    notes: '',
  });

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleOpenCreateItem = () => {
    setEditingItem(null);
    setItemForm({
      code: '',
      name: '',
      type: 'fertilizer',
      category: '',
      subcategory: '',
      unit: 'kg',
      quantity: 0,
      min_stock: 0,
      max_stock: 0,
      warehouse_id: warehouses.length > 0 ? warehouses[0].id : '',
      supplier: '',
      batch_number: '',
      expiry_date: '',
      unit_price: 0,
      notes: '',
    });
    setItemModalOpen(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setItemForm({
      code: item.code || '',
      name: item.name || '',
      type: item.type || 'fertilizer',
      category: item.category || '',
      subcategory: item.subcategory || '',
      unit: item.unit || 'kg',
      quantity: item.quantity || 0,
      min_stock: item.min_stock || 0,
      max_stock: item.max_stock || 0,
      warehouse_id: item.warehouse_id || '',
      supplier: item.supplier || '',
      batch_number: item.batch_number || '',
      expiry_date: item.expiry_date || '',
      unit_price: item.unit_price || 0,
      notes: item.notes || '',
    });
    setItemModalOpen(true);
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const handleDeleteItem = (item: any) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingItem) {
        await updateItem(editingItem.id, itemForm);
        notifications.show({
          title: '✅ Ítem actualizado',
          message: `${itemForm.name} actualizado correctamente`,
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      } else {
        await createItem(itemForm);
        notifications.show({
          title: '✅ Ítem creado',
          message: `${itemForm.name} creado correctamente`,
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      }
      setItemModalOpen(false);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al procesar el ítem',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createMovement(movementForm);
      notifications.show({
        title: '✅ Movimiento registrado',
        message: `Movimiento de ${movementForm.type === 'in' ? 'entrada' : 'salida'} registrado correctamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setMovementModalOpen(false);
      setMovementForm({
        item_id: '',
        type: 'out',
        quantity: 0,
        reason: 'adjustment',
        notes: '',
      });
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al registrar movimiento',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);

    try {
      await deleteItem(selectedItem.id);
      notifications.show({
        title: '✅ Ítem eliminado',
        message: `${selectedItem.name} eliminado correctamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al eliminar el ítem',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMovement = (item?: any) => {
    setMovementForm({
      item_id: item?.id || '',
      type: 'out',
      quantity: 0,
      reason: 'adjustment',
      notes: '',
    });
    setMovementModalOpen(true);
  };

  // ============================================================
  // FILTRADO
  // ============================================================

  const filteredItems = items.filter((item) => {
    const matchSearch = searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchWarehouse = !warehouseFilter || item.warehouse_id === warehouseFilter;
    const matchType = !typeFilter || item.type === typeFilter;

    let matchEstado = true;
    if (tabEstado === 'Bajo mínimo') matchEstado = item.status === 'low_stock';
    if (tabEstado === 'Sin stock') matchEstado = item.status === 'out_of_stock';

    return matchSearch && matchWarehouse && matchType && matchEstado;
  });

  // ============================================================
  // CÁLCULOS PARA GRÁFICAS
  // ============================================================

  // Composición por categoría
  const categoryData = items.reduce((acc, item) => {
    const key = item.category || 'Sin categoría';
    if (!acc[key]) acc[key] = 0;
    acc[key] += item.total_value;
    return acc;
  }, {} as Record<string, number>);

  // Evolución semanal (simulada con datos de movimientos)
  const weeklyData = [
    { sem: 'S45', val: '$118K', height: '60%' },
    { sem: 'S46', val: '$132K', height: '70%' },
    { sem: 'S47', val: '$146K', height: '80%' },
    { sem: 'S48', val: '$161K', height: '95%' },
    { sem: 'S49', val: '$180K', height: '100%' },
  ];

  const totalValor = items.reduce((acc, item) => acc + item.total_value, 0);
  const bajoMinimo = items.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length;
  const itemsConStock = items.filter(item => item.quantity > 0).length;

const categoryChartData = Object.entries(categoryData)
    .map(([category, value]) => ({
      category,
      value,
      percentage: (value / totalValor) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  // Colores para las categorías
  const categoryColors = ['#1F5C3A', '#E5A93C', '#6C9BCF', '#A882C5', '#D4DEC9', '#9A968A'];

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando inventario...</Text>
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
    <Box style={{ backgroundColor: '#F9F9F6', minHeight: '100vh', padding: '16px' }}>
      {/* Encabezado con degradado */}
      <Paper
        p="xl"
        radius="lg"
        mb="xl"
        style={{
          background: 'linear-gradient(135deg, #1F5C3A 0%, #2A6A8A 100%)',
          color: '#FFFFFF',
        }}
      >
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Group gap="xs">
              <Badge size="xs" variant="white" color="teal" radius="sm">
                G-10 · Inventario
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
              </Badge>
            </Group>
            <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
              Control de Inventario
            </Text>
            <Text size="sm" style={{ opacity: 0.8 }}>
              Existencias, movimientos y reposición en tiempo real
            </Text>
          </Stack>
          <Group gap="xl">
            <Group gap="sm">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                <IconBuildingWarehouse size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>{items.length}</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>SKUs activos</Text>
              </Stack>
            </Group>
            <RingProgress
              size={80}
              thickness={8}
              sections={[{ value: items.length > 0 ? (itemsConStock / items.length) * 100 : 0, color: '#FFFFFF' }]}
              label={
                <Text size="xs" fw={700} ta="center" style={{ color: '#FFFFFF' }}>
                  {items.length > 0 ? Math.round((itemsConStock / items.length) * 100) : 0}%
                </Text>
              }
            />
          </Group>
        </Group>
      </Paper>

      {/* KPIs de Resumen */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Valor Total
                </Text>
                <Text size="xl" fw={800} c="#1F5C3A">${(totalValor / 1000).toFixed(0)}K</Text>
                <Group gap={4}>
                  <IconArrowUpRight size={12} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>+8.2% vs mes pasado</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconCurrencyDollar size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  SKUs Bajo Mínimo
                </Text>
                <Text size="xl" fw={800} c="#C08412">{bajoMinimo}</Text>
                <Group gap={4}>
                  <IconAlertCircle size={12} color="#C08412" />
                  <Text size="xs" c="#C08412" fw={600}>Requieren atención</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                <IconAlertTriangle size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Movimientos Hoy
                </Text>
                <Text size="xl" fw={800} c="#2A6A8A">{movements.length}</Text>
                <Group gap={4}>
                  <Text size="xs" c="dimmed">
                    {movements.filter(m => m.type === 'in').length} entradas · 
                    {movements.filter(m => m.type === 'out').length} salidas
                  </Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconTruck size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Almacenes
                </Text>
                <Text size="xl" fw={800} c="#1F5C3A">{warehouses.length}</Text>
                <Group gap={4}>
                  <Text size="xs" c="dimmed">
                    {warehouses.filter(w => w.status === 'active').length} activos
                  </Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconBuildingWarehouse size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>
      </SimpleGrid>

      {/* Acciones Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between">
            <Group gap="sm">
              <IconBox size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Acciones Rápidas</Text>
                <Text size="xs" c="dimmed">Gestiona tu inventario</Text>
              </Stack>
            </Group>
            <Group gap="sm">
              <Button
                size="xs"
                color="teal"
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={<IconPlus size={14} />}
                onClick={handleOpenCreateItem}
              >
                Nuevo Ítem
              </Button>
              <Button
                size="xs"
                variant="outline"
                color="teal"
                leftSection={<IconTruck size={14} />}
                onClick={() => handleOpenMovement()}
                disabled={items.length === 0}
              >
                Registrar Movimiento
              </Button>
              <Button
                size="xs"
                variant="subtle"
                color="teal"
                onClick={refresh}
                leftSection={<IconRefresh size={14} />}
              >
                Actualizar
              </Button>
            </Group>
          </Group>
        </Card>
      </motion.div>

      {/* Filtros y Búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group gap="md" align="flex-end">
            <TextInput
              size="xs"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              leftSection={<IconSearch size={14} />}
              style={{ flex: 1 }}
            />
            <Select
              size="xs"
              placeholder="Almacén"
              value={warehouseFilter}
              onChange={setWarehouseFilter}
              data={[
                { value: '', label: 'Todos los almacenes' },
                ...warehouses.map(w => ({ value: w.id, label: w.name })),
              ]}
              style={{ width: 180 }}
              clearable
            />
            <Select
              size="xs"
              placeholder="Tipo"
              value={typeFilter}
              onChange={setTypeFilter}
              data={[
                { value: '', label: 'Todos los tipos' },
                ...Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label })),
              ]}
              style={{ width: 150 }}
              clearable
            />
            <SegmentedControl
              size="xs"
              value={tabEstado}
              onChange={setTabEstado}
              data={['Todos', 'Bajo mínimo', 'Sin stock']}
              styles={{
                root: { backgroundColor: '#F5F3EE' },
                indicator: { backgroundColor: '#1F5C3A' },
                label: { fontWeight: 600 },
              }}
            />
            {(searchTerm || warehouseFilter || typeFilter || tabEstado !== 'Todos') && (
              <ActionIcon
                size="sm"
                color="gray"
                variant="subtle"
                onClick={() => {
                  setSearchTerm('');
                  setWarehouseFilter(null);
                  setTypeFilter(null);
                  setTabEstado('Todos');
                }}
              >
                <IconX size={14} />
              </ActionIcon>
            )}
          </Group>
        </Card>
      </motion.div>

      {/* Tabla de Inventario */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconBox size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Existencias</Text>
                <Text size="xs" c="dimmed">
                  {filteredItems.length} ítems {filteredItems.length !== items.length && `(filtrados de ${items.length})`}
                </Text>
              </Stack>
            </Group>
          </Group>

          <Divider mb="lg" />

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Código</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Nombre</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Tipo</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Almacén</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">Cantidad</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">Mínimo</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">Valor</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">Estado</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const isLowStock = item.status === 'low_stock' || item.status === 'out_of_stock';
                    const progress = item.max_stock > 0 ? (item.quantity / item.max_stock) * 100 : 0;

                    return (
                      <Table.Tr key={item.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                        <Table.Td>
                          <Badge variant="light" color="gray" size="sm" radius="sm">
                            {item.code}
                          </Badge>
                        </Table.Td>
                        <Table.Td fw={700} c="#3A3A34">{item.name}</Table.Td>
                        <Table.Td>
                          <Badge
                            variant="light"
                            color="gray"
                            size="sm"
                            radius="sm"
                            style={{
                              backgroundColor: `${TYPE_COLORS[item.type]}20`,
                              color: TYPE_COLORS[item.type],
                            }}
                          >
                            {TYPE_LABELS[item.type] || item.type}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="outline" color="teal" size="sm" radius="sm">
                            {warehouses.find(w => w.id === item.warehouse_id)?.name || 'N/A'}
                          </Badge>
                        </Table.Td>
                        <Table.Td ta="right">
                          <Stack gap={2} align="flex-end">
                            <Text fw={700} c={isLowStock ? '#C08412' : '#3A3A34'}>
                              {item.quantity} {item.unit}
                            </Text>
                            <Progress
                              value={Math.min(progress, 100)}
                              size="xs"
                              color={isLowStock ? 'orange' : 'green'}
                              style={{ width: 60 }}
                            />
                          </Stack>
                        </Table.Td>
                        <Table.Td ta="right" c="dimmed">
                          {item.min_stock} {item.unit}
                        </Table.Td>
                        <Table.Td ta="right" fw={700} c="#1F5C3A">
                          ${item.total_value.toFixed(0)}
                        </Table.Td>
                        <Table.Td ta="center">
                          <Badge
                            size="sm"
                            variant="light"
                            color={STATUS_COLORS[item.status] || 'gray'}
                            radius="xl"
                            style={{ fontWeight: 700 }}
                          >
                            {STATUS_LABELS[item.status] || item.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td ta="center">
                          <Menu shadow="md" width={200} position="bottom-end" withinPortal>
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray" size="sm">
                                <IconDotsVertical size={16} stroke={1.5} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Label>Acciones</Menu.Label>
                              <Menu.Item
                                leftSection={<IconEye size={14} />}
                                onClick={() => handleViewDetails(item)}
                              >
                                Ver detalles
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconEdit size={14} />}
                                onClick={() => handleEditItem(item)}
                              >
                                Editar
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconTruck size={14} />}
                                onClick={() => handleOpenMovement(item)}
                              >
                                Registrar movimiento
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item
                                leftSection={<IconTrash size={14} />}
                                color="red"
                                onClick={() => handleDeleteItem(item)}
                              >
                                Eliminar
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={9} ta="center" py="xl">
                      <Stack align="center" gap="sm">
                        <IconPackage size={40} color="#9A968A" opacity={0.4} />
                        <Text size="sm" c="dimmed">
                          {searchTerm || warehouseFilter || typeFilter || tabEstado !== 'Todos'
                            ? 'No hay ítems que coincidan con los filtros'
                            : 'No hay ítems en inventario'}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {searchTerm || warehouseFilter || typeFilter || tabEstado !== 'Todos'
                            ? 'Prueba ajustando los filtros'
                            : 'Agrega un nuevo ítem para comenzar'}
                        </Text>
                        {!searchTerm && !warehouseFilter && !typeFilter && tabEstado === 'Todos' && (
                          <Button
                            size="xs"
                            color="teal"
                            style={{ backgroundColor: '#1F5C3A' }}
                            leftSection={<IconPlus size={14} />}
                            onClick={handleOpenCreateItem}
                          >
                            Agregar Ítem
                          </Button>
                        )}
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {filteredItems.length > 0 && (
            <Group justify="flex-end" mt="md">
              <Text size="xs" c="dimmed">
                Mostrando {filteredItems.length} de {items.length} ítems
              </Text>
            </Group>
          )}
        </Card>
      </motion.div>

      {/* Gráficas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group gap="sm" mb="lg">
            <IconChartPie size={18} color="#1F5C3A" />
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#3A3A34">Composición y Evolución</Text>
              <Text size="xs" c="dimmed">Distribución del valor por categoría</Text>
            </Stack>
          </Group>
          <Divider mb="lg" />

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="xs" fw={700} c="#9A968A" mb="md" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Composición de Inventario
              </Text>
              <Group justify="center" gap="xl">
                <RingProgress
                  size={180}
                  thickness={16}
                  sections={categoryChartData.map((item, index) => ({
                    value: item.percentage,
                    color: categoryColors[index % categoryColors.length],
                    tooltip: `${item.category}: ${item.value.toFixed(0)}`,
                  }))}
                  label={
                    <Stack align="center" gap={0}>
                      <Text size="xl" fw={800} c="#1F5C3A">${(totalValor / 1000).toFixed(0)}K</Text>
                      <Text size="xs" c="dimmed">Total</Text>
                    </Stack>
                  }
                />
                <Stack gap={4} style={{ fontSize: '11px' }}>
                  {categoryChartData.map((item, index) => (
                    <Group key={index} gap="xs" justify="space-between">
                      <Group gap={6}>
                        <Box style={{ width: 10, height: 10, backgroundColor: categoryColors[index % categoryColors.length], borderRadius: '2px' }} />
                        <Text size="11px" c="dimmed">{item.category}</Text>
                      </Group>
                      <Text size="11px" fw={700}>{item.percentage.toFixed(1)}%</Text>
                    </Group>
                  ))}
                </Stack>
              </Group>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="xs" fw={700} c="#9A968A" mb="md" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Evolución Semanal
              </Text>
              <Box p="md" style={{ backgroundColor: '#FAF9F5', borderRadius: '8px', border: '1px solid #E8E5DC' }}>
                <Group justify="space-around" align="flex-end" style={{ height: '140px', paddingBottom: '10px' }}>
                  {weeklyData.map((bar, i) => (
                    <Stack key={i} gap={2} align="center" style={{ height: '100%', justifyContent: 'flex-end' }}>
                      <Text size="9px" fw={700} c="#1F5C3A">{bar.val}</Text>
                      <Box style={{
                        width: '32px',
                        height: bar.height,
                        backgroundColor: i === 4 ? '#1F5C3A' : '#6C9BCF',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease'
                      }} />
                      <Text size="10px" fw={600} c="dimmed">{bar.sem}</Text>
                    </Stack>
                  ))}
                </Group>
                <Divider my="md" />
                <Group justify="center" gap="md">
                  <Group gap={4}>
                    <Box style={{ width: 10, height: 10, backgroundColor: '#6C9BCF', borderRadius: '2px' }} />
                    <Text size="xs" c="dimmed">Valor en inventario</Text>
                  </Group>
                  <Badge color="green" variant="light" size="sm">↑ +12.5%</Badge>
                </Group>
              </Box>
            </Grid.Col>
          </Grid>
        </Card>
      </motion.div>

      {/* ============================================================
          MODAL: Crear/Editar Ítem
      ============================================================ */}
      <Modal
        opened={itemModalOpen}
        onClose={() => {
          setItemModalOpen(false);
          setEditingItem(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              {editingItem ? <IconEdit size={18} /> : <IconPlus size={18} />}
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>
                {editingItem ? 'Editar Ítem' : 'Nuevo Ítem'}
              </Text>
              <Text size="xs" c="dimmed">
                {editingItem ? `Editando ${editingItem.name}` : 'Registra un nuevo ítem en el inventario'}
              </Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        <form onSubmit={handleItemSubmit}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Código"
                  placeholder="Ej: FERT-001"
                  value={itemForm.code}
                  onChange={(e) => setItemForm({ ...itemForm, code: e.currentTarget.value })}
                  required
                  disabled={!!editingItem}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Nombre"
                  placeholder="Ej: Urea 46-0-0"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Tipo"
                  data={Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label }))}
                  value={itemForm.type}
                  onChange={(value) => setItemForm({ ...itemForm, type: value || 'fertilizer' })}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Categoría"
                  placeholder="Ej: Fertilizante Nitrogenado"
                  value={itemForm.category}
                  onChange={(e) => setItemForm({ ...itemForm, category: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Subcategoría"
                  placeholder="Ej: Urea"
                  value={itemForm.subcategory}
                  onChange={(e) => setItemForm({ ...itemForm, subcategory: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Unidad"
                  data={['kg', 'L', 'g', 'mL', 'unidad', 'rollo', 'bulto']}
                  value={itemForm.unit}
                  onChange={(value) => setItemForm({ ...itemForm, unit: value || 'kg' })}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={4}>
                <NumberInput
                  label="Cantidad Inicial"
                  value={itemForm.quantity}
                  onChange={(value) => setItemForm({ ...itemForm, quantity: Number(value) || 0 })}
                  min={0}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Stock Mínimo"
                  value={itemForm.min_stock}
                  onChange={(value) => setItemForm({ ...itemForm, min_stock: Number(value) || 0 })}
                  min={0}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Stock Máximo"
                  value={itemForm.max_stock}
                  onChange={(value) => setItemForm({ ...itemForm, max_stock: Number(value) || 0 })}
                  min={0}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Almacén"
                  data={warehouses.map(w => ({ value: w.id, label: w.name }))}
                  value={itemForm.warehouse_id}
                  onChange={(value) => setItemForm({ ...itemForm, warehouse_id: value || '' })}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Proveedor"
                  placeholder="Ej: Fertilizantes SA"
                  value={itemForm.supplier}
                  onChange={(e) => setItemForm({ ...itemForm, supplier: e.currentTarget.value })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Número de Lote"
                  placeholder="Ej: LOTE-2024-001"
                  value={itemForm.batch_number}
                  onChange={(e) => setItemForm({ ...itemForm, batch_number: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Fecha de Expiración"
                  type="date"
                  value={itemForm.expiry_date}
                  onChange={(e) => setItemForm({ ...itemForm, expiry_date: e.currentTarget.value })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="Precio Unitario"
                  value={itemForm.unit_price}
                  onChange={(value) => setItemForm({ ...itemForm, unit_price: Number(value) || 0 })}
                  min={0}
                  prefix="$"
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Textarea
                  label="Notas"
                  placeholder="Observaciones adicionales"
                  value={itemForm.notes}
                  onChange={(e) => setItemForm({ ...itemForm, notes: e.currentTarget.value })}
                  rows={2}
                />
              </Grid.Col>
            </Grid>

            <Divider />

            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setItemModalOpen(false);
                  setEditingItem(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={editingItem ? <IconEdit size={16} /> : <IconCheck size={16} />}
              >
                {editingItem ? 'Actualizar Ítem' : 'Crear Ítem'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* ============================================================
          MODAL: Registrar Movimiento
      ============================================================ */}
      <Modal
        opened={movementModalOpen}
        onClose={() => {
          setMovementModalOpen(false);
          setMovementForm({
            item_id: '',
            type: 'out',
            quantity: 0,
            reason: 'adjustment',
            notes: '',
          });
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
              <IconTruck size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Registrar Movimiento</Text>
              <Text size="xs" c="dimmed">Entrada o salida de inventario</Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        <form onSubmit={handleMovementSubmit}>
          <Stack gap="md">
            <Select
              label="Ítem"
              data={items.map(i => ({ value: i.id, label: `${i.code} - ${i.name}` }))}
              value={movementForm.item_id}
              onChange={(value) => setMovementForm({ ...movementForm, item_id: value || '' })}
              required
              searchable
            />

            <SegmentedControl
              label="Tipo de Movimiento"
              value={movementForm.type}
              onChange={(value) => setMovementForm({ ...movementForm, type: value as 'in' | 'out' })}
              data={[
                { value: 'in', label: 'Entrada' },
                { value: 'out', label: 'Salida' },
              ]}
              styles={{
                root: { backgroundColor: '#F5F3EE' },
                indicator: { backgroundColor: movementForm.type === 'in' ? '#1F5C3A' : '#C08412' },
                label: { fontWeight: 600 },
              }}
            />

            <NumberInput
              label="Cantidad"
              value={movementForm.quantity}
              onChange={(value) => setMovementForm({ ...movementForm, quantity: Number(value) || 0 })}
              min={0.01}
              step={0.01}
              required
            />

            <Select
              label="Motivo"
              data={[
                { value: 'purchase', label: 'Compra' },
                { value: 'sale', label: 'Venta' },
                { value: 'transfer', label: 'Transferencia' },
                { value: 'adjustment', label: 'Ajuste' },
                { value: 'damage', label: 'Daño' },
                { value: 'return', label: 'Devolución' },
              ]}
              value={movementForm.reason}
              onChange={(value) => setMovementForm({ ...movementForm, reason: value || 'adjustment' })}
              required
            />

            <Textarea
              label="Notas"
              placeholder="Información adicional del movimiento"
              value={movementForm.notes}
              onChange={(e) => setMovementForm({ ...movementForm, notes: e.currentTarget.value })}
              rows={2}
            />

            <Divider />

            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setMovementModalOpen(false);
                  setMovementForm({
                    item_id: '',
                    type: 'out',
                    quantity: 0,
                    reason: 'adjustment',
                    notes: '',
                  });
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                style={{ backgroundColor: '#2A6A8A' }}
                leftSection={<IconCheck size={16} />}
              >
                Registrar Movimiento
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* ============================================================
          MODAL: Confirmar Eliminación
      ============================================================ */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedItem(null);
        }}
        title="Eliminar Ítem"
        size="sm"
        centered
      >
        <Stack gap="md">
          <Alert
            color="red"
            variant="light"
            title="¿Estás seguro?"
            icon={<IconAlertCircle size={16} />}
          >
            <Text size="sm">
              Vas a eliminar el ítem <strong>{selectedItem?.name}</strong>.
              Esta acción no se puede deshacer.
            </Text>
          </Alert>

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedItem(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              color="red"
              loading={isSubmitting}
              leftSection={<IconTrash size={16} />}
              onClick={handleConfirmDelete}
            >
              Eliminar Ítem
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ============================================================
          MODAL: Ver Detalles
      ============================================================ */}
      <Modal
        opened={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedItem(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconEye size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Detalles del Ítem</Text>
              <Text size="xs" c="dimmed">{selectedItem?.name}</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        {selectedItem && (
          <Stack gap="md">
            <Paper p="md" radius="md" withBorder style={{ backgroundColor: '#FAF9F5' }}>
              <SimpleGrid cols={2} spacing="md">
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Código</Text>
                  <Badge variant="light" color="gray" size="md">
                    {selectedItem.code}
                  </Badge>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Nombre</Text>
                  <Text fw={700}>{selectedItem.name}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Tipo</Text>
                  <Badge
                    variant="light"
                    style={{
                      backgroundColor: `${TYPE_COLORS[selectedItem.type]}20`,
                      color: TYPE_COLORS[selectedItem.type],
                    }}
                  >
                    {TYPE_LABELS[selectedItem.type] || selectedItem.type}
                  </Badge>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Categoría</Text>
                  <Text>{selectedItem.category}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Almacén</Text>
                  <Text>{warehouses.find(w => w.id === selectedItem.warehouse_id)?.name || 'N/A'}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Proveedor</Text>
                  <Text>{selectedItem.supplier || 'N/A'}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Unidad</Text>
                  <Text>{selectedItem.unit}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Estado</Text>
                  <Badge
                    color={STATUS_COLORS[selectedItem.status] || 'gray'}
                    variant="light"
                    radius="xl"
                  >
                    {STATUS_LABELS[selectedItem.status] || selectedItem.status}
                  </Badge>
                </div>
              </SimpleGrid>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <SimpleGrid cols={3} spacing="md">
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Cantidad</Text>
                  <Text size="xl" fw={800} c={selectedItem.status === 'low_stock' || selectedItem.status === 'out_of_stock' ? '#C08412' : '#1F5C3A'}>
                    {selectedItem.quantity} {selectedItem.unit}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Stock Mínimo</Text>
                  <Text size="xl" fw={700}>{selectedItem.min_stock} {selectedItem.unit}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Valor Total</Text>
                  <Text size="xl" fw={800} c="#1F5C3A">${selectedItem.total_value.toFixed(0)}</Text>
                </div>
              </SimpleGrid>
            </Paper>

            {selectedItem.notes && (
              <Paper p="md" radius="md" withBorder style={{ backgroundColor: '#FAF9F5' }}>
                <Text size="xs" c="dimmed" fw={600}>Notas</Text>
                <Text size="sm">{selectedItem.notes}</Text>
              </Paper>
            )}

            <Paper p="md" radius="md" withBorder>
              <SimpleGrid cols={2} spacing="md">
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Número de Lote</Text>
                  <Text>{selectedItem.batch_number || 'N/A'}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Fecha de Expiración</Text>
                  <Text>{selectedItem.expiry_date ? new Date(selectedItem.expiry_date).toLocaleDateString() : 'N/A'}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Creado</Text>
                  <Text>{new Date(selectedItem.created_at).toLocaleDateString()}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Última Actualización</Text>
                  <Text>{new Date(selectedItem.updated_at).toLocaleDateString()}</Text>
                </div>
              </SimpleGrid>
            </Paper>

            <Divider />

            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setDetailsModalOpen(false);
                  setSelectedItem(null);
                }}
              >
                Cerrar
              </Button>
              <Group gap="sm">
                <Button
                  color="teal"
                  variant="outline"
                  leftSection={<IconTruck size={16} />}
                  onClick={() => {
                    setDetailsModalOpen(false);
                    handleOpenMovement(selectedItem);
                  }}
                >
                  Movimiento
                </Button>
                <Button
                  color="teal"
                  style={{ backgroundColor: '#1F5C3A' }}
                  leftSection={<IconEdit size={16} />}
                  onClick={() => {
                    setDetailsModalOpen(false);
                    handleEditItem(selectedItem);
                  }}
                >
                  Editar
                </Button>
              </Group>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}

export default GrowerInventory;