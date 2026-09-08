import React, { useState } from 'react';
import { 
  Card, 
  Text, 
  SimpleGrid, 
  Table, 
  Button, 
  Badge, 
  Stack, 
  Box,
  Group,
  ThemeIcon,
  Divider,
  Loader,
  Center,
  Alert,
  Modal,
  TextInput,
  NumberInput,
  Select,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Paper,
  Grid,
  Menu,
  rem
} from '@mantine/core';
import { 
  IconPackageImport, 
  IconSeedling, 
  IconCalculator, 
  IconTruck,
  IconShoppingCart,
  IconAlertCircle,
  IconCheck,
  IconRefresh,
  IconEdit,
  IconPlus,
  IconEye,
  IconCalendar,
  IconPackage,
  IconArrowRight,
  IconTrash,
  IconDotsVertical,
  IconFileImport,
  IconClipboardList,
  IconBuildingStore,
  IconBox,
  IconPlant2
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useSeeds } from './hooks/useSeeds';
import { notifications } from '@mantine/notifications';

export function GrowerSeedsFlow() {
  // Estados para modales
  const [dosageModalOpen, setDosageModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editingDosage, setEditingDosage] = useState<any>(null);
  const [selectedDosage, setSelectedDosage] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    dosages, 
    needs, 
    orders, 
    summary, 
    isLoading, 
    error, 
    refresh, 
    createDosage,
    updateDosage, 
    deleteDosage,
    generateOrder 
  } = useSeeds();

  // Estado para el formulario de dosis (crear/editar)
  const [dosageForm, setDosageForm] = useState({
    crop: '',
    variety: '',
    supplier: '',
    seedsPerHa: 0,
    lbPerHa: 0,
  });

  // Estado para el filtro
  const [filterCrop, setFilterCrop] = useState('');

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleOpenCreateModal = () => {
    setEditingDosage(null);
    setDosageForm({
      crop: '',
      variety: '',
      supplier: '',
      seedsPerHa: 0,
      lbPerHa: 0,
    });
    setDosageModalOpen(true);
  };

  const handleEditDosage = (dosage: any) => {
    setEditingDosage(dosage);
    setDosageForm({
      crop: dosage.crop || '',
      variety: dosage.variety || '',
      supplier: dosage.supplier || '',
      seedsPerHa: dosage.seedsPerHa || 0,
      lbPerHa: dosage.lbPerHa || 0,
    });
    setDosageModalOpen(true);
  };

  const handleViewDetails = (dosage: any) => {
    setSelectedDosage(dosage);
    setViewDetailsOpen(true);
  };

  const handleDeleteDosage = (dosage: any) => {
    setSelectedDosage(dosage);
    setDeleteModalOpen(true);
  };

  const handleDosageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingDosage) {
        // Actualizar dosis existente
        await updateDosage(editingDosage.id, {
          seeds_per_ha: dosageForm.seedsPerHa,
          lb_per_ha: dosageForm.lbPerHa,
        });
        notifications.show({
          title: '✅ Dosis actualizada',
          message: `Dosis de ${dosageForm.crop} actualizada correctamente`,
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      } else {
        // Crear nueva dosis
        await createDosage({
          crop: dosageForm.crop,
          variety: dosageForm.variety,
          supplier: dosageForm.supplier,
          seeds_per_ha: dosageForm.seedsPerHa,
          lb_per_ha: dosageForm.lbPerHa,
        });
        notifications.show({
          title: '✅ Dosis creada',
          message: `Dosis de ${dosageForm.crop} creada correctamente`,
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      }
      setDosageModalOpen(false);
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al procesar la dosis',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDosage) return;
    setIsSubmitting(true);

    try {
      await deleteDosage(selectedDosage.id);
      notifications.show({
        title: '✅ Dosis eliminada',
        message: `Dosis de ${selectedDosage.crop} eliminada correctamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setDeleteModalOpen(false);
      setSelectedDosage(null);
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al eliminar la dosis',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateOrder = async (supplier: string) => {
    try {
      await generateOrder(supplier);
      notifications.show({
        title: '✅ OC Generada',
        message: `Orden de compra generada para ${supplier}`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 4000,
      });
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al generar OC',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  // Obtener cultivos únicos para el filtro
  const uniqueCrops = Array.from(new Set(dosages.map(d => d.crop)));

  // Filtrar dosis
  const filteredDosages = filterCrop 
    ? dosages.filter(d => d.crop === filterCrop)
    : dosages;

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando datos de semilla...</Text>
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
    <Box>
      {/* Encabezado */}
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={0}>
          <Text size="xs" fw={700} c="#1F5C3A" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
            G-2 · Semilla
          </Text>
          <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            Flujo de Semilla
          </Text>
          <Text size="sm" c="dimmed">
            Dosis → Necesidad → Pedido · Invierno 2026-2027
          </Text>
        </Stack>
        <Group gap="sm">
          <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
            {dosages.length} Cultivos
          </Badge>
          <Button
            size="xs"
            variant="subtle"
            color="teal"
            onClick={refresh}
            leftSection={<IconRefresh size={14} />}
          >
            Actualizar
          </Button>
          <Button
            size="xs"
            color="teal"
            style={{ backgroundColor: '#1F5C3A' }}
            leftSection={<IconPlus size={14} />}
            onClick={handleOpenCreateModal}
          >
            Agregar Dosis
          </Button>
        </Group>
      </Group>

      {/* KPIs */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
        {[
          { 
            title: 'La Cadena', 
            value: 'Dosis → Necesidad → Pedido', 
            icon: IconSeedling, 
            color: '#1F5C3A', 
            desc: 'Cambia una celda y todo se recalcula' 
          },
          { 
            title: 'Ha del Plan', 
            value: summary?.totalHa?.toString() || '0', 
            icon: IconCalculator, 
            color: '#3A3A34', 
            desc: 'Vienen del calendario de posturas' 
          },
          { 
            title: 'Neto a Pedir', 
            value: `${summary?.totalNetToOrder?.toFixed(1) || '0'} lb`, 
            icon: IconShoppingCart, 
            color: '#1F5C3A', 
            desc: 'Con dosis e inventario capturados' 
          },
          { 
            title: 'Próximo Vencimiento', 
            value: summary?.nextDeadline || '06-dic', 
            icon: IconAlertCircle, 
            color: '#C08412', 
            desc: summary?.nextDeadlineDetail || 'Pedido 3 · Tainong' 
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                <Group justify="space-between" align="flex-start">
                  <Stack gap={2}>
                    <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {kpi.title}
                    </Text>
                    <Text size="md" fw={800} c={kpi.color}>{kpi.value}</Text>
                    <Text size="10px" c="dimmed">{kpi.desc}</Text>
                  </Stack>
                  <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: kpi.color }}>
                    <Icon size={20} stroke={2} />
                  </ThemeIcon>
                </Group>
              </Card>
            </motion.div>
          );
        })}
      </SimpleGrid>

      {/* Paso 1: Captura de Dosis */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconSeedling size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">1. Captura de Dosis</Text>
                <Text size="xs" c="dimmed">Pronóstico de uso de semilla por cultivo</Text>
              </Stack>
            </Group>
            <Group gap="sm">
              {uniqueCrops.length > 0 && (
                <Select
                  size="xs"
                  placeholder="Filtrar por cultivo"
                  value={filterCrop}
                  onChange={(value) => setFilterCrop(value || '')}
                  data={[
                    { value: '', label: 'Todos los cultivos' },
                    ...uniqueCrops.map(crop => ({ value: crop, label: crop }))
                  ]}
                  style={{ width: 200 }}
                  clearable
                />
              )}
              <Badge variant="light" color="teal" radius="sm">Editable</Badge>
              <Button
                size="xs"
                color="teal"
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={<IconPlus size={14} />}
                onClick={handleOpenCreateModal}
              >
                Nueva Dosis
              </Button>
            </Group>
          </Group>

          <Divider mb="lg" />

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Cultivo</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Variedad</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Proveedor</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Semillas/ha</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Lb/ha</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Estatus</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="center">Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredDosages.length > 0 ? (
                  filteredDosages.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      style={{ borderBottom: '1px solid #EFECE3' }}
                    >
                      <Table.Td>
                        <Group gap="xs">
                          <ThemeIcon size="sm" radius="xl" color="teal" variant="light">
                            <IconPlant2 size={12} />
                          </ThemeIcon>
                          <Text fw={700} c="#3A3A34">{row.crop}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>{row.variety}</Table.Td>
                      <Table.Td c="dimmed">{row.supplier}</Table.Td>
                      <Table.Td ta="right">
                        <Badge color="blue" variant="light" size="sm" radius="sm">
                          {row.seedsPerHa.toLocaleString()}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Badge color="blue" variant="light" size="sm" radius="sm">
                          {row.lbPerHa}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Badge 
                          color={row.is_active ? 'green' : 'gray'} 
                          variant="light" 
                          size="sm" 
                          radius="xl"
                        >
                          {row.is_active ? 'Activa' : 'Inactiva'}
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
                              onClick={() => handleViewDetails(row)}
                            >
                              Ver detalles
                            </Menu.Item>
                            <Menu.Item 
                              leftSection={<IconEdit size={14} />}
                              onClick={() => handleEditDosage(row)}
                            >
                              Editar dosis
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item 
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              onClick={() => handleDeleteDosage(row)}
                            >
                              Eliminar
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </motion.tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={7} ta="center" py="xl">
                      <Stack align="center" gap="sm">
                        <IconSeedling size={40} color="#9A968A" opacity={0.4} />
                        <Text size="sm" c="dimmed">
                          {filterCrop ? `No hay dosis para "${filterCrop}"` : 'No hay dosis registradas'}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {filterCrop ? 'Selecciona otro filtro o ' : ''}Agrega una nueva dosis para comenzar
                        </Text>
                        {filterCrop && (
                          <Button
                            size="xs"
                            variant="subtle"
                            color="teal"
                            onClick={() => setFilterCrop('')}
                          >
                            Limpiar filtro
                          </Button>
                        )}
                        {!filterCrop && (
                          <Button
                            size="xs"
                            color="teal"
                            style={{ backgroundColor: '#1F5C3A' }}
                            leftSection={<IconPlus size={14} />}
                            onClick={handleOpenCreateModal}
                          >
                            Agregar Dosis
                          </Button>
                        )}
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {filteredDosages.length > 0 && (
            <Group justify="flex-end" mt="md">
              <Text size="xs" c="dimmed">
                Mostrando {filteredDosages.length} de {dosages.length} dosis
              </Text>
            </Group>
          )}
        </Card>
      </motion.div>

      {/* Paso 2: Necesidad Calculada */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
          <Group gap="sm" mb="lg">
            <IconCalculator size={18} color="#1F5C3A" />
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#3A3A34">2. Necesidad Calculada</Text>
              <Text size="xs" c="dimmed">Bruta vs Inventario disponible</Text>
            </Stack>
          </Group>

          <Divider mb="lg" />

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Cultivo</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Variedad</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Ha Plan</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Bruta (lb)</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Inventario</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Neto a Pedir</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {needs.length > 0 ? (
                  needs.map((row, i) => (
                    <Table.Tr key={i} style={{ borderBottom: '1px solid #EFECE3' }}>
                      <Table.Td>
                        <Group gap="xs">
                          <ThemeIcon size="sm" radius="xl" color="teal" variant="light">
                            <IconPlant2 size={12} />
                          </ThemeIcon>
                          <Text fw={700} c="#3A3A34">{row.crop}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>{row.variety}</Table.Td>
                      <Table.Td ta="right">
                        <Badge color="gray" variant="light" size="sm" radius="sm">
                          {row.haPlan}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="right">{row.bruteLb.toFixed(1)}</Table.Td>
                      <Table.Td ta="right">
                        <Badge 
                          color={row.inventoryLb === 0 ? 'orange' : row.inventoryLb < row.bruteLb * 0.5 ? 'yellow' : 'green'} 
                          variant="light" 
                          size="sm" 
                          radius="sm"
                        >
                          {row.inventoryLb.toFixed(1)}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text fw={700} c={row.netColor} size="md">
                          {row.netToOrder.toFixed(1)}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={6} ta="center" py="xl">
                      <Stack align="center" gap="sm">
                        <IconCalculator size={40} color="#9A968A" opacity={0.4} />
                        <Text size="sm" c="dimmed">No hay necesidades calculadas</Text>
                        <Text size="xs" c="dimmed">Los datos se calcularán automáticamente</Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>
      </motion.div>

      {/* Paso 3: Pedidos por Proveedor */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconTruck size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">3. Pedidos por Proveedor</Text>
                <Text size="xs" c="dimmed">Resultado del cálculo</Text>
              </Stack>
            </Group>
            <Badge variant="light" color="teal" radius="sm">Listo para OC</Badge>
          </Group>

          <Divider mb="lg" />

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Proveedor</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Lb Netas</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Lead Time</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Primera Siembra</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Pedir Antes de</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="center">Estado</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="center">Acción</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {orders.length > 0 ? (
                  orders.map((row, i) => (
                    <Table.Tr key={i} style={{ borderBottom: '1px solid #EFECE3' }}>
                      <Table.Td>
                        <Group gap="xs">
                          <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
                            <IconBuildingStore size={12} />
                          </ThemeIcon>
                          <Text fw={700} c="#3A3A34">{row.supplier}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td ta="right" fw={700} c="#1F5C3A">{row.netLb.toFixed(1)}</Table.Td>
                      <Table.Td c="dimmed">{row.leadTime}</Table.Td>
                      <Table.Td>{row.firstPlanting}</Table.Td>
                      <Table.Td>
                        <Badge color="orange" variant="light" size="sm" radius="sm">
                          {row.orderBefore}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Badge 
                          color={row.status === 'completed' ? 'green' : row.status === 'current' ? 'blue' : 'orange'} 
                          variant="light" 
                          size="sm" 
                          radius="xl"
                        >
                          {row.statusLabel}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Button 
                          size="xs" 
                          color="teal"
                          style={{ backgroundColor: '#1F5C3A' }}
                          leftSection={<IconPackageImport size={12} />}
                          onClick={() => handleGenerateOrder(row.supplier)}
                          disabled={row.status === 'completed' || row.netLb === 0}
                        >
                          {row.status === 'completed' ? 'Completado' : 'Generar OC'}
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={7} ta="center" py="xl">
                      <Stack align="center" gap="sm">
                        <IconTruck size={40} color="#9A968A" opacity={0.4} />
                        <Text size="sm" c="dimmed">No hay pedidos generados</Text>
                        <Text size="xs" c="dimmed">Los pedidos se generarán automáticamente</Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>
      </motion.div>

      {/* ============================================================
          MODAL: Crear/Editar Dosis
      ============================================================ */}
      <Modal
        opened={dosageModalOpen}
        onClose={() => {
          setDosageModalOpen(false);
          setEditingDosage(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              {editingDosage ? <IconEdit size={18} /> : <IconPlus size={18} />}
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>
                {editingDosage ? 'Editar Dosis' : 'Nueva Dosis'}
              </Text>
              <Text size="xs" c="dimmed">
                {editingDosage 
                  ? `${editingDosage.crop} - ${editingDosage.variety}`
                  : 'Registra una nueva dosis de semilla'
                }
              </Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        <form onSubmit={handleDosageSubmit}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Cultivo"
                  placeholder="Ej: Shanghai Bok Choy"
                  value={dosageForm.crop}
                  onChange={(e) => setDosageForm({ ...dosageForm, crop: e.target.value })}
                  required
                  disabled={!!editingDosage}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Variedad"
                  placeholder="Ej: F1 Hybrid"
                  value={dosageForm.variety}
                  onChange={(e) => setDosageForm({ ...dosageForm, variety: e.target.value })}
                  required
                  disabled={!!editingDosage}
                />
              </Grid.Col>
            </Grid>

            <TextInput
              label="Proveedor"
              placeholder="Ej: Tainong, Sakata, Agrohaitai"
              value={dosageForm.supplier}
              onChange={(e) => setDosageForm({ ...dosageForm, supplier: e.target.value })}
              required
              disabled={!!editingDosage}
            />

            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="Semillas por Hectárea"
                  placeholder="Ej: 120000"
                  value={dosageForm.seedsPerHa}
                  onChange={(value) => setDosageForm({ ...dosageForm, seedsPerHa: Number(value) || 0 })}
                  min={0}
                  step={1000}
                  required
                  thousandSeparator
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Libras por Hectárea"
                  placeholder="Ej: 2.5"
                  value={dosageForm.lbPerHa}
                  onChange={(value) => setDosageForm({ ...dosageForm, lbPerHa: Number(value) || 0 })}
                  min={0}
                  step={0.01}
                  precision={2}
                  required
                />
              </Grid.Col>
            </Grid>

            <Divider />

            <Group justify="space-between">
              <Button 
                variant="subtle" 
                color="gray" 
                onClick={() => {
                  setDosageModalOpen(false);
                  setEditingDosage(null);
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                loading={isSubmitting}
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={editingDosage ? <IconEdit size={16} /> : <IconCheck size={16} />}
              >
                {editingDosage ? 'Actualizar Dosis' : 'Crear Dosis'}
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
          setSelectedDosage(null);
        }}
        title="Eliminar Dosis"
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
              Vas a eliminar la dosis de <strong>{selectedDosage?.crop}</strong> - {selectedDosage?.variety}.
              Esta acción no se puede deshacer.
            </Text>
          </Alert>

          <Group justify="space-between">
            <Button 
              variant="subtle" 
              color="gray" 
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedDosage(null);
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
              Eliminar Dosis
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ============================================================
          MODAL: Ver Detalles
      ============================================================ */}
      <Modal
        opened={viewDetailsOpen}
        onClose={() => {
          setViewDetailsOpen(false);
          setSelectedDosage(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconEye size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Detalles de Dosis</Text>
              <Text size="xs" c="dimmed">{selectedDosage?.crop} - {selectedDosage?.variety}</Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        {selectedDosage && (
          <Stack gap="md">
            <Paper p="md" radius="md" withBorder style={{ backgroundColor: '#FAF9F5' }}>
              <SimpleGrid cols={2} spacing="md">
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Cultivo</Text>
                  <Text fw={700} size="md">{selectedDosage.crop}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Variedad</Text>
                  <Text fw={700} size="md">{selectedDosage.variety}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Proveedor</Text>
                  <Text fw={700} size="md">{selectedDosage.supplier}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Estatus</Text>
                  <Badge 
                    color={selectedDosage.is_active ? 'green' : 'gray'} 
                    variant="light" 
                    size="sm" 
                    radius="xl"
                  >
                    {selectedDosage.is_active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </SimpleGrid>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <SimpleGrid cols={2} spacing="md">
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Semillas por Hectárea</Text>
                  <Badge color="blue" variant="light" size="md" radius="sm">
                    {selectedDosage.seedsPerHa.toLocaleString()}
                  </Badge>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Libras por Hectárea</Text>
                  <Badge color="blue" variant="light" size="md" radius="sm">
                    {selectedDosage.lbPerHa}
                  </Badge>
                </div>
              </SimpleGrid>
            </Paper>

            <Paper p="md" radius="md" withBorder style={{ backgroundColor: '#FAF9F5' }}>
              <SimpleGrid cols={2} spacing="md">
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Creado</Text>
                  <Text size="sm">{new Date(selectedDosage.created_at).toLocaleDateString()}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" fw={600}>Última actualización</Text>
                  <Text size="sm">{new Date(selectedDosage.updated_at).toLocaleDateString()}</Text>
                </div>
              </SimpleGrid>
            </Paper>

            <Divider />

            <Group justify="space-between">
              <Button 
                variant="subtle" 
                color="gray" 
                onClick={() => {
                  setViewDetailsOpen(false);
                  setSelectedDosage(null);
                }}
              >
                Cerrar
              </Button>
              <Group gap="sm">
                <Button
                  color="teal"
                  style={{ backgroundColor: '#1F5C3A' }}
                  leftSection={<IconEdit size={16} />}
                  onClick={() => {
                    setViewDetailsOpen(false);
                    handleEditDosage(selectedDosage);
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

export default GrowerSeedsFlow;