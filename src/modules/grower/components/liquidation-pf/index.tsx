import React, { useState } from 'react';
import {
  Box,
  Paper,
  Text,
  Group,
  Stack,
  Badge,
  Table,
  SimpleGrid,
  Card,
  Button,
  TextInput,
  Select,
  Grid,
  ThemeIcon,
  Divider,
  Progress,
  RingProgress,
  Tooltip,
  ActionIcon,
  SegmentedControl,
  Modal,
  Textarea,
  NumberInput,
  Avatar,
  Alert,
  Loader,
  Center,
  ScrollArea,
  Menu,
} from '@mantine/core';
import {
  IconCheck,
  IconReceipt,
  IconRefresh,
  IconTruck,
  IconFileInvoice,
  IconCurrencyDollar,
  IconBuildingBank,
  IconArrowUpRight,
  IconArrowDownRight,
  IconAlertCircle,
  IconClock,
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconSend,
  IconZoom,
  IconChartBar,
  IconCalendar,
  IconUsers,
  IconBuilding,
  IconTarget,
  IconBox,
  IconReport,
  IconAnalyze,
  IconBrandSpeedtest,
  IconList,
  IconGridDots,
  IconDotsVertical,
  IconFileExport,
  IconPrinter,
  IconDownload,
  IconX,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useLiquidationPF } from './hooks/useLiquidationPF';
import { notifications } from '@mantine/notifications';

// ID de liquidación por defecto (deberías obtenerlo de la URL o selector)
const DEFAULT_LIQUIDATION_ID = '11111111-1111-1111-1111-111111111111';

export function GrowerPFLiquidation() {
  const {
    liquidation,
    trucks,
    reconciliation,
    summary,
    isLoading,
    error,
    refresh,
    updateLiquidation,
    addTruck,
    updateTruck,
    deleteTruck,
    reconcile,
    sendToCXC,
  } = useLiquidationPF(DEFAULT_LIQUIDATION_ID);

  const [viewMode, setViewMode] = useState('captura');
  const [truckModalOpen, setTruckModalOpen] = useState(false);
  const [editTruckModalOpen, setEditTruckModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editLiquidationModalOpen, setEditLiquidationModalOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para formulario de camión
  const [truckForm, setTruckForm] = useState({
    truck_number: '',
    invoice_number: '',
    customer: '',
    product: '',
    boxes: 0,
    price_usd: 0,
    sale_usd: 0,
    commission_usd: 0,
    status: 'pending',
    notes: '',
  });

  // Estado para editar liquidación
  const [editLiquidationForm, setEditLiquidationForm] = useState({
    exchange_rate: 17.50,
    commission_percent: 10,
    notes: '',
  });

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleRefresh = async () => {
    await refresh();
    notifications.show({
      title: 'Datos actualizados',
      message: 'La liquidación ha sido actualizada',
      color: 'green',
      icon: <IconCheck size={16} />,
      autoClose: 2000,
    });
  };

  const handleExport = () => {
    notifications.show({
      title: 'Exportando reporte',
      message: 'El reporte se está generando...',
      color: 'blue',
      icon: <IconDownload size={16} />,
      autoClose: 2000,
    });
  };

  const handleOpenTruckModal = () => {
    setTruckForm({
      truck_number: '',
      invoice_number: '',
      customer: '',
      product: '',
      boxes: 0,
      price_usd: 0,
      sale_usd: 0,
      commission_usd: 0,
      status: 'pending',
      notes: '',
    });
    setTruckModalOpen(true);
  };

  const handleEditTruck = (truck: any) => {
    setSelectedTruck(truck);
    setTruckForm({
      truck_number: truck.truck_number,
      invoice_number: truck.invoice_number,
      customer: truck.customer,
      product: truck.product,
      boxes: truck.boxes,
      price_usd: truck.price_usd,
      sale_usd: truck.sale_usd,
      commission_usd: truck.commission_usd,
      status: truck.status,
      notes: truck.notes || '',
    });
    setEditTruckModalOpen(true);
  };

  const handleDeleteTruck = (truck: any) => {
    setSelectedTruck(truck);
    setDeleteModalOpen(true);
  };

  const handleAddTruck = async () => {
    setIsSubmitting(true);
    try {
      await addTruck(truckForm);
      notifications.show({
        title: '✅ Camión agregado',
        message: `Camión ${truckForm.truck_number} agregado exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setTruckModalOpen(false);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al agregar camión',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTruck = async () => {
    if (!selectedTruck) return;
    setIsSubmitting(true);
    try {
      await updateTruck(selectedTruck.id, truckForm);
      notifications.show({
        title: '✅ Camión actualizado',
        message: `Camión ${truckForm.truck_number} actualizado exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setEditTruckModalOpen(false);
      setSelectedTruck(null);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al actualizar camión',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTruck) return;
    setIsSubmitting(true);
    try {
      await deleteTruck(selectedTruck.id);
      notifications.show({
        title: '✅ Camión eliminado',
        message: `Camión ${selectedTruck.truck_number} eliminado exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setDeleteModalOpen(false);
      setSelectedTruck(null);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al eliminar camión',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReconcile = async () => {
    setIsSubmitting(true);
    try {
      await reconcile();
      notifications.show({
        title: '✅ Liquidación conciliada',
        message: 'La liquidación ha sido conciliada exitosamente',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al conciliar liquidación',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendToCXC = async () => {
    setIsSubmitting(true);
    try {
      await sendToCXC();
      notifications.show({
        title: '✅ Liquidación enviada a CXC',
        message: 'La liquidación ha sido enviada a Cuentas por Cobrar',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al enviar a CXC',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // HANDLERS PARA EDITAR LIQUIDACIÓN - CORREGIDOS
  // ============================================================

  const handleOpenEditLiquidation = () => {
    setEditLiquidationForm({
      exchange_rate: liquidation?.exchange_rate || 17.50,
      commission_percent: liquidation?.commission_percent || 10,
      notes: liquidation?.notes || '',
    });
    setEditLiquidationModalOpen(true);
  };

  const handleUpdateLiquidation = async () => {
    setIsSubmitting(true);
    try {
      await updateLiquidation(editLiquidationForm);
      notifications.show({
        title: '✅ Liquidación actualizada',
        message: 'Los datos de la liquidación han sido actualizados',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setEditLiquidationModalOpen(false);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al actualizar liquidación',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // CÁLCULOS
  // ============================================================

  const totalCajas = trucks.reduce((acc, row) => acc + row.boxes, 0);
  const totalVenta = trucks.reduce((acc, row) => acc + row.sale_usd, 0);
  const totalComision = trucks.reduce((acc, row) => acc + row.commission_usd, 0);
  const netoUSD = totalVenta - totalComision;
  const netoMXN = netoUSD * (liquidation?.exchange_rate || 17.50);

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando liquidación...</Text>
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

  const mockData = {
    temporada: 'Invierno 2026-2027',
    semanaActual: 47,
    fechaCorte: '19-nov-2026',
    productor: 'Agrícola JAV',
    tc: liquidation?.exchange_rate || 17.50,
    comision: liquidation?.commission_percent || 10,
  };

  const getStatusColor = (status: string) => {
    if (status === 'reconciled') return 'green';
    if (status === 'pending') return 'yellow';
    return 'gray';
  };

  return (
    <Box style={{ backgroundColor: '#F4F1EA', minHeight: '100vh', padding: '16px' }}>

      {/* ===== ENCABEZADO ===== */}
      <Paper 
        p="xl" 
        radius="lg" 
        mb="xl"
        style={{ 
          background: 'linear-gradient(135deg, #1F5C3A 0%, #2A6A8A 100%)',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Group justify="space-between" align="center" style={{ position: 'relative', zIndex: 1 }}>
          <Stack gap={4}>
            <Group gap="xs">
              <Badge size="xs" variant="white" color="teal" radius="sm">
                G-15 · Liquidación PF
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                {mockData.temporada}
              </Badge>
            </Group>
            <Group gap="sm" align="center">
              <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                Liquidación PF
              </Text>
              <Badge size="lg" variant="light" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}>
                {liquidation?.code || 'LIQ-191225'}
              </Badge>
            </Group>
            <Group gap="xl" mt={2}>
              <Group gap={4}>
                <IconCalendar size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>Corte: {mockData.fechaCorte}</Text>
              </Group>
              <Group gap={4}>
                <IconUsers size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>Productor: {mockData.productor}</Text>
              </Group>
              <Group gap={4}>
                <IconBuilding size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>Semana {mockData.semanaActual}</Text>
              </Group>
            </Group>
          </Stack>

          <Group gap="xl">
            <Group gap="sm">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                <IconCurrencyDollar size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>${netoUSD.toLocaleString()}</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Neto USD</Text>
              </Stack>
            </Group>
            <RingProgress
              size={90}
              thickness={10}
              sections={[{ value: liquidation?.status === 'reconciled' ? 100 : 94, color: '#FFFFFF' }]}
              label={
                <Stack align="center" gap={0}>
                  <Text size="lg" fw={800} style={{ color: '#FFFFFF' }}>
                    {liquidation?.status === 'reconciled' ? 100 : 94}%
                  </Text>
                  <Text size="8px" style={{ opacity: 0.7 }}>
                    {liquidation?.status === 'reconciled' ? 'conciliado' : 'en captura'}
                  </Text>
                </Stack>
              }
            />
          </Group>
        </Group>
      </Paper>

      {/* ===== KPIs ===== */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Liquidación</Text>
                <Text size="28px" fw={800} c="#1F5C3A">{liquidation?.code || 'N/A'}</Text>
                <Group gap={4}>
                  <IconClock size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>Semana {liquidation?.week_number || 47}</Text>
                </Group>
                <Badge 
                  size="xs" 
                  color={liquidation?.status === 'reconciled' ? 'green' : liquidation?.status === 'sent' ? 'blue' : 'yellow'} 
                  variant="light" 
                  radius="sm"
                >
                  {liquidation?.status === 'draft' ? 'Borrador' : 
                   liquidation?.status === 'captured' ? 'En captura' : 
                   liquidation?.status === 'reconciled' ? 'Conciliado' : 'Enviado a CXC'}
                </Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconFileInvoice size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Camiones</Text>
                <Text size="28px" fw={800} c="#2A6A8A">{trucks.length}</Text>
                <Group gap={4}>
                  <IconTruck size={14} color="#2A6A8A" />
                  <Text size="xs" c="#2A6A8A" fw={600}>{totalCajas} cajas totales</Text>
                </Group>
                <Badge size="xs" color="green" variant="light" radius="sm">
                  {trucks.filter(t => t.status === 'reconciled').length} conciliados
                </Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconTruck size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Neto USD</Text>
                <Text size="28px" fw={800} c="#1F5C3A">${netoUSD.toLocaleString()}</Text>
                <Group gap={4}>
                  <IconArrowUpRight size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>TC {mockData.tc}</Text>
                </Group>
                <Badge size="xs" color="blue" variant="light" radius="sm">${netoMXN.toLocaleString()} MXN</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconCurrencyDollar size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Comisión PF</Text>
                <Text size="28px" fw={800} c="#C08412">{mockData.comision}%</Text>
                <Group gap={4}>
                  <IconCheck size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>${totalComision.toLocaleString()} USD</Text>
                </Group>
                <Badge size="xs" color="teal" variant="light" radius="sm">${(totalComision * mockData.tc).toLocaleString()} MXN</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                <IconReceipt size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>
      </SimpleGrid>

      {/* ===== FILTROS Y CONTROLES ===== */}
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <SegmentedControl
            size="sm"
            value={viewMode}
            onChange={setViewMode}
            data={[
              { value: 'captura', label: 'Captura' },
              { value: 'conciliacion', label: 'Conciliación' },
              { value: 'resultado', label: 'Resultado' },
            ]}
            styles={{
              root: { backgroundColor: '#F5F3EE' },
              indicator: { backgroundColor: '#1F5C3A' },
              label: { fontWeight: 600 }
            }}
          />
          <Badge variant="light" color="teal" radius="sm">
            <Group gap={4}>
              <IconClock size={12} />
              Última actualización: {liquidation?.updated_at ? new Date(liquidation.updated_at).toLocaleString() : 'Nunca'}
            </Group>
          </Badge>
        </Group>
        <Group gap="xs">
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="light" color="teal" size="sm" radius="md">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Acciones</Menu.Label>
              <Menu.Item leftSection={<IconRefresh size={14} />} onClick={handleRefresh}>
                Actualizar datos
              </Menu.Item>
              <Menu.Item leftSection={<IconFileExport size={14} />} onClick={handleExport}>
                Exportar Excel
              </Menu.Item>
              <Menu.Item leftSection={<IconPrinter size={14} />} onClick={() => window.print()}>
                Imprimir reporte
              </Menu.Item>
              {liquidation?.status !== 'reconciled' && liquidation?.status !== 'sent' && (
                <Menu.Divider />
              )}
              {liquidation?.status === 'captured' && (
                <Menu.Item leftSection={<IconCheck size={14} />} onClick={handleReconcile}>
                  Conciliar
                </Menu.Item>
              )}
              {liquidation?.status === 'reconciled' && (
                <Menu.Item leftSection={<IconSend size={14} />} onClick={handleSendToCXC}>
                  Enviar a CXC
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
          <ActionIcon variant="light" color="teal" size="sm" radius="md" onClick={handleRefresh}>
            <IconRefresh size={16} />
          </ActionIcon>
          <ActionIcon variant="light" color="teal" size="sm" radius="md" onClick={handleExport}>
            <IconDownload size={16} />
          </ActionIcon>
          {liquidation?.status !== 'reconciled' && liquidation?.status !== 'sent' && (
            <Button
              size="xs"
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconPlus size={14} />}
              onClick={handleOpenTruckModal}
            >
              Agregar Camión
            </Button>
          )}
        </Group>
      </Group>

      {/* ===== VISTA CAPTURA ===== */}
      {viewMode === 'captura' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" mb="lg">
              <Group gap="sm">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                  <IconReceipt size={18} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="sm" fw={700} c="#3A3A34">Captura de Liquidación</Text>
                  <Text size="xs" c="dimmed">La liquidación como llega de PF · Renglón por renglón</Text>
                </Stack>
              </Group>
              <Button
                size="xs"
                variant="subtle"
                color="teal"
                leftSection={<IconEdit size={14} />}
                onClick={handleOpenEditLiquidation}
              >
                Editar Liquidación
              </Button>
            </Group>

            <Divider mb="lg" />

            <Grid mb="lg">
              <Grid.Col span={{ base: 12, md: 3 }}>
                <TextInput 
                  label="Folio Liquidación"
                  size="xs"
                  value={liquidation?.code || ''}
                  readOnly
                  styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <TextInput 
                  label="Fecha"
                  size="xs"
                  value={liquidation?.liquidation_date ? new Date(liquidation.liquidation_date).toLocaleDateString('es-MX') : ''}
                  readOnly
                  styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <TextInput 
                  label="Semana"
                  size="xs"
                  value={`S${liquidation?.week_number || ''}`}
                  readOnly
                  styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Select 
                  label="Productor"
                  size="xs"
                  value={mockData.productor}
                  data={['Agrícola JAV', 'La Escondida']}
                  styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
                />
              </Grid.Col>
            </Grid>

            <ScrollArea>
              <Table 
                verticalSpacing="md" 
                horizontalSpacing="md" 
                highlightOnHover
                style={{ 
                  tableLayout: 'fixed',
                  width: '100%'
                }}
              >
                <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                  <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                      <Group gap="4">
                        <IconTruck size={14} />
                        # Camión
                      </Group>
                    </Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                      <Group gap="4">
                        <IconFileInvoice size={14} />
                        Factura
                      </Group>
                    </Table.Th>
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Cliente</Table.Th>
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Vegetal</Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Cajas</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Precio/cj</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Venta USD</Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Comisión</Table.Th>
                    <Table.Th style={{ width: '8%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Estado</Table.Th>
                    {liquidation?.status !== 'reconciled' && liquidation?.status !== 'sent' && (
                      <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Acciones</Table.Th>
                    )}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {trucks.length > 0 ? (
                    trucks.map((row, idx) => (
                      <Table.Tr 
                        key={idx} 
                        style={{ 
                          borderBottom: '1px solid #EFECE3',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF9F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Table.Td>
                          <Badge variant="light" color="teal" size="sm" radius="sm">
                            {row.truck_number}
                          </Badge>
                        </Table.Td>
                        <Table.Td>{row.invoice_number}</Table.Td>
                        <Table.Td fw={600} c="#3A3A34">{row.customer}</Table.Td>
                        <Table.Td c="dimmed">{row.product}</Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" fw={600}>{row.boxes}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs">${row.price_usd.toFixed(2)}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" fw={700} c="#1F5C3A">${row.sale_usd.toFixed(2)}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" c="dimmed">${row.commission_usd.toFixed(2)}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge 
                            size="sm"
                            color={getStatusColor(row.status)}
                            variant="light"
                            radius="xl"
                          >
                            {row.status === 'reconciled' ? 'Conciliado' : 
                             row.status === 'pending' ? 'Pendiente' : 'Discrepancia'}
                          </Badge>
                        </Table.Td>
                        {liquidation?.status !== 'reconciled' && liquidation?.status !== 'sent' && (
                          <Table.Td style={{ textAlign: 'center' }}>
                            <Group gap="xs" justify="center">
                              <Tooltip label="Editar camión">
                                <ActionIcon
                                  size="sm"
                                  variant="subtle"
                                  color="teal"
                                  onClick={() => handleEditTruck(row)}
                                >
                                  <IconEdit size={14} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Eliminar camión">
                                <ActionIcon
                                  size="sm"
                                  variant="subtle"
                                  color="red"
                                  onClick={() => handleDeleteTruck(row)}
                                >
                                  <IconTrash size={14} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </Table.Td>
                        )}
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={liquidation?.status !== 'reconciled' && liquidation?.status !== 'sent' ? 10 : 9} ta="center" py="xl">
                        <Stack align="center" gap="sm">
                          <IconTruck size={40} color="#9A968A" opacity={0.4} />
                          <Text size="sm" c="dimmed">No hay camiones registrados</Text>
                          <Text size="xs" c="dimmed">Agrega un camión para comenzar</Text>
                          {liquidation?.status !== 'reconciled' && liquidation?.status !== 'sent' && (
                            <Button
                              size="xs"
                              color="teal"
                              style={{ backgroundColor: '#1F5C3A' }}
                              leftSection={<IconPlus size={14} />}
                              onClick={handleOpenTruckModal}
                            >
                              Agregar Camión
                            </Button>
                          )}
                        </Stack>
                      </Table.Td>
                    </Table.Tr>
                  )}
                  {trucks.length > 0 && (
                    <Table.Tr style={{ backgroundColor: '#FAF9F5', borderTop: '2px solid #E5E2D9' }}>
                      <Table.Td colSpan={4} fw={800} c="#1F5C3A">TOTALES</Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>
                        <Text size="sm" fw={800}>{totalCajas}</Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>—</Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>
                        <Text size="sm" fw={800} c="#1F5C3A">${totalVenta.toFixed(2)}</Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>
                        <Text size="sm" fw={800} c="#2A6A8A">${totalComision.toFixed(2)}</Text>
                      </Table.Td>
                      <Table.Td />
                      {liquidation?.status !== 'reconciled' && liquidation?.status !== 'sent' && <Table.Td />}
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            <Divider my="lg" />

            <Group justify="space-between">
              <Group gap="sm">
                <Badge variant="light" color="teal" radius="sm">
                  <Group gap={4}>
                    <IconBox size={12} />
                    {totalCajas} cajas
                  </Group>
                </Badge>
                <Badge variant="light" color="green" radius="sm">
                  <Group gap={4}>
                    <IconCheck size={12} />
                    {trucks.filter(t => t.status === 'reconciled').length} camiones conciliados
                  </Group>
                </Badge>
              </Group>
              <Group gap="sm">
                {liquidation?.status !== 'reconciled' && liquidation?.status !== 'sent' && (
                  <>
                    <Button 
                      size="sm"
                      variant="outline"
                      color="teal"
                      leftSection={<IconCheck size={16} />}
                      onClick={handleReconcile}
                      disabled={trucks.length === 0}
                    >
                      Conciliar
                    </Button>
                    <Button 
                      size="sm"
                      style={{ backgroundColor: '#1F5C3A' }}
                      leftSection={<IconCheck size={16} />}
                      onClick={handleUpdateLiquidation}
                    >
                      Guardar Liquidación
                    </Button>
                  </>
                )}
              </Group>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ===== VISTA CONCILIACIÓN ===== */}
      {viewMode === 'conciliacion' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group gap="sm" mb="lg">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconZoom size={18} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Conciliación</Text>
                <Text size="xs" c="dimmed">Contra tus propios folios y descuentos</Text>
              </Stack>
            </Group>

            <Divider mb="lg" />

            {reconciliation.length > 0 ? (
              <Table 
                verticalSpacing="md" 
                horizontalSpacing="md" 
                highlightOnHover
                style={{ 
                  tableLayout: 'fixed',
                  width: '100%'
                }}
              >
                <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                  <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                    <Table.Th style={{ width: '25%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Concepto</Table.Th>
                    <Table.Th style={{ width: '25%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Lo que dice PF</Table.Th>
                    <Table.Th style={{ width: '30%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Lo tuyo</Table.Th>
                    <Table.Th style={{ width: '20%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Estado</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {reconciliation.map((row, idx) => (
                    <Table.Tr 
                      key={idx} 
                      style={{ 
                        borderBottom: '1px solid #EFECE3',
                        backgroundColor: idx === 3 ? '#FFF8E1' : 'transparent'
                      }}
                    >
                      <Table.Td>
                        <Text size="xs" fw={600} c={idx === 3 ? '#C08412' : '#3A3A34'}>
                          {row.concept}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs">{row.pf_value}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" c="dimmed">{row.your_value}</Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Badge 
                          color={row.status === 'ok' ? 'green' : 'red'} 
                          variant="light" 
                          size="sm" 
                          radius="xl"
                          leftSection={row.status === 'ok' ? <IconCheck size={12} /> : <IconAlertCircle size={12} />}
                        >
                          {row.status === 'ok' ? 'Conciliado' : 'Discrepancia'}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Box ta="center" py="xl">
                <IconCheck size={40} color="#1F5C3A" opacity={0.4} />
                <Text size="sm" c="dimmed" mt="sm">No hay datos de conciliación</Text>
              </Box>
            )}

            <Divider my="lg" />

            <Group justify="space-between">
              <Group gap="md">
                <Group gap={4}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#1F5C3A', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Conciliado</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#C08412', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Con diferencia</Text>
                </Group>
              </Group>
              {liquidation?.status !== 'reconciled' && liquidation?.status !== 'sent' && (
                <Button 
                  size="sm"
                  style={{ backgroundColor: '#1F5C3A' }}
                  leftSection={<IconCheck size={16} />}
                  onClick={handleReconcile}
                  disabled={trucks.length === 0}
                >
                  Conciliar Liquidación
                </Button>
              )}
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ===== VISTA RESULTADO ===== */}
      {viewMode === 'resultado' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group gap="sm" mb="lg">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconChartBar size={18} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Resultado de Liquidación</Text>
                <Text size="xs" c="dimmed">El neto y a dónde va</Text>
              </Stack>
            </Group>

            <Divider mb="lg" />

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md" mb="lg">
              <Card p="xl" radius="md" style={{ backgroundColor: '#E8F5E9', border: '2px solid #1F5C3A', textAlign: 'center' }}>
                <ThemeIcon size="xl" radius="xl" style={{ backgroundColor: '#1F5C3A20', color: '#1F5C3A' }}>
                  <IconBox size={28} />
                </ThemeIcon>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px" mt="md">Total Cajas</Text>
                <Text size="36px" fw={800} c="#1F5C3A">{totalCajas}</Text>
                <Text size="xs" c="dimmed">{trucks.length} camiones</Text>
              </Card>

              <Card p="xl" radius="md" style={{ backgroundColor: '#EBF3F7', border: '2px solid #2A6A8A', textAlign: 'center' }}>
                <ThemeIcon size="xl" radius="xl" style={{ backgroundColor: '#2A6A8A20', color: '#2A6A8A' }}>
                  <IconCurrencyDollar size={28} />
                </ThemeIcon>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px" mt="md">Neto en USD</Text>
                <Text size="36px" fw={800} c="#2A6A8A">${netoUSD.toFixed(2)}</Text>
                <Text size="xs" c="dimmed">TC: {mockData.tc} MXN/USD</Text>
              </Card>

              <Card p="xl" radius="md" style={{ backgroundColor: '#FFF8E1', border: '2px solid #C08412', textAlign: 'center' }}>
                <ThemeIcon size="xl" radius="xl" style={{ backgroundColor: '#C0841220', color: '#C08412' }}>
                  <IconBuildingBank size={28} />
                </ThemeIcon>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px" mt="md">Neto en MXN</Text>
                <Text size="36px" fw={800} c="#C08412">${netoMXN.toFixed(2)}</Text>
                <Text size="xs" c="dimmed">${(netoMXN / (totalCajas || 1)).toFixed(2)}/cj promedio</Text>
              </Card>
            </SimpleGrid>

            <Divider mb="lg" />

            <Group justify="space-between">
              <Group gap="sm">
                <ThemeIcon size="md" radius="xl" color="teal" variant="light">
                  <IconBuildingBank size={16} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">Destino del cobro</Text>
                  <Text size="sm" fw={700} c="#1F5C3A">Cuenta BBVA · DV</Text>
                </Stack>
              </Group>
              <Group gap="sm">
                <Badge size="lg" color="blue" variant="light" radius="sm">
                  <Group gap={4}>
                    <IconFileInvoice size={14} />
                    Emite Factura en CXC-1
                  </Group>
                </Badge>
                {liquidation?.status === 'reconciled' && (
                  <Button 
                    size="sm"
                    style={{ backgroundColor: '#1F5C3A' }}
                    leftSection={<IconSend size={16} />}
                    onClick={handleSendToCXC}
                    loading={isSubmitting}
                  >
                    Enviar a CXC-1
                  </Button>
                )}
                {liquidation?.status === 'sent' && (
                  <Badge size="lg" color="green" variant="light" radius="sm">
                    <Group gap={4}>
                      <IconCheck size={14} />
                      Enviado a CXC
                    </Group>
                  </Badge>
                )}
              </Group>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ============================================================
          MODAL: Agregar Camión
      ============================================================ */}
      <Modal
        opened={truckModalOpen}
        onClose={() => {
          setTruckModalOpen(false);
          setTruckForm({
            truck_number: '',
            invoice_number: '',
            customer: '',
            product: '',
            boxes: 0,
            price_usd: 0,
            sale_usd: 0,
            commission_usd: 0,
            status: 'pending',
            notes: '',
          });
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
              <IconTruck size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Agregar Camión</Text>
              <Text size="xs" c="dimmed">Registrar un nuevo camión en la liquidación</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAddTruck(); }}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Número de Camión"
                  placeholder="Ej: 25"
                  value={truckForm.truck_number}
                  onChange={(e) => setTruckForm({ ...truckForm, truck_number: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Factura"
                  placeholder="Ej: 1660"
                  value={truckForm.invoice_number}
                  onChange={(e) => setTruckForm({ ...truckForm, invoice_number: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Cliente"
                  placeholder="Ej: Fresh Direct"
                  value={truckForm.customer}
                  onChange={(e) => setTruckForm({ ...truckForm, customer: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Vegetal / Producto"
                  placeholder="Ej: Bok Choy Mieu"
                  value={truckForm.product}
                  onChange={(e) => setTruckForm({ ...truckForm, product: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={4}>
                <NumberInput
                  label="Cajas"
                  placeholder="0"
                  value={truckForm.boxes}
                  onChange={(value) => setTruckForm({ ...truckForm, boxes: Number(value) || 0 })}
                  min={0}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Precio USD / caja"
                  placeholder="0.00"
                  value={truckForm.price_usd}
                  onChange={(value) => {
                    const price = Number(value) || 0;
                    setTruckForm({ 
                      ...truckForm, 
                      price_usd: price,
                      sale_usd: truckForm.boxes * price,
                      commission_usd: truckForm.boxes * price * (liquidation?.commission_percent || 10) / 100,
                    });
                  }}
                  min={0}
                  step={0.01}
                  precision={2}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Comisión (%)"
                  value={liquidation?.commission_percent || 10}
                  readOnly
                  styles={{ input: { backgroundColor: '#F5F3EE' } }}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="Venta USD (calculado)"
                  value={truckForm.sale_usd}
                  readOnly
                  styles={{ input: { backgroundColor: '#F5F3EE', fontWeight: 700, color: '#1F5C3A' } }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Comisión USD (calculado)"
                  value={truckForm.commission_usd}
                  readOnly
                  styles={{ input: { backgroundColor: '#F5F3EE', fontWeight: 700, color: '#2A6A8A' } }}
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Notas"
              placeholder="Notas adicionales sobre este camión"
              value={truckForm.notes}
              onChange={(e) => setTruckForm({ ...truckForm, notes: e.currentTarget.value })}
              rows={2}
            />

            <Divider />

            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setTruckModalOpen(false);
                  setTruckForm({
                    truck_number: '',
                    invoice_number: '',
                    customer: '',
                    product: '',
                    boxes: 0,
                    price_usd: 0,
                    sale_usd: 0,
                    commission_usd: 0,
                    status: 'pending',
                    notes: '',
                  });
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={<IconCheck size={16} />}
              >
                Agregar Camión
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* ============================================================
          MODAL: Editar Camión
      ============================================================ */}
      <Modal
        opened={editTruckModalOpen}
        onClose={() => {
          setEditTruckModalOpen(false);
          setSelectedTruck(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
              <IconEdit size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Editar Camión</Text>
              <Text size="xs" c="dimmed">{selectedTruck?.truck_number}</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateTruck(); }}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Número de Camión"
                  value={truckForm.truck_number}
                  onChange={(e) => setTruckForm({ ...truckForm, truck_number: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Factura"
                  value={truckForm.invoice_number}
                  onChange={(e) => setTruckForm({ ...truckForm, invoice_number: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Cliente"
                  value={truckForm.customer}
                  onChange={(e) => setTruckForm({ ...truckForm, customer: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Vegetal / Producto"
                  value={truckForm.product}
                  onChange={(e) => setTruckForm({ ...truckForm, product: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={4}>
                <NumberInput
                  label="Cajas"
                  value={truckForm.boxes}
                  onChange={(value) => {
                    const boxes = Number(value) || 0;
                    setTruckForm({ 
                      ...truckForm, 
                      boxes: boxes,
                      sale_usd: boxes * truckForm.price_usd,
                      commission_usd: boxes * truckForm.price_usd * (liquidation?.commission_percent || 10) / 100,
                    });
                  }}
                  min={0}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Precio USD / caja"
                  value={truckForm.price_usd}
                  onChange={(value) => {
                    const price = Number(value) || 0;
                    setTruckForm({ 
                      ...truckForm, 
                      price_usd: price,
                      sale_usd: truckForm.boxes * price,
                      commission_usd: truckForm.boxes * price * (liquidation?.commission_percent || 10) / 100,
                    });
                  }}
                  min={0}
                  step={0.01}
                  precision={2}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Comisión (%)"
                  value={liquidation?.commission_percent || 10}
                  readOnly
                  styles={{ input: { backgroundColor: '#F5F3EE' } }}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="Venta USD (calculado)"
                  value={truckForm.sale_usd}
                  readOnly
                  styles={{ input: { backgroundColor: '#F5F3EE', fontWeight: 700, color: '#1F5C3A' } }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Comisión USD (calculado)"
                  value={truckForm.commission_usd}
                  readOnly
                  styles={{ input: { backgroundColor: '#F5F3EE', fontWeight: 700, color: '#2A6A8A' } }}
                />
              </Grid.Col>
            </Grid>

            <Select
              label="Estado"
              value={truckForm.status}
              onChange={(value) => setTruckForm({ ...truckForm, status: value || 'pending' })}
              data={[
                { value: 'pending', label: 'Pendiente' },
                { value: 'reconciled', label: 'Conciliado' },
                { value: 'discrepancy', label: 'Discrepancia' },
              ]}
            />

            <Textarea
              label="Notas"
              value={truckForm.notes}
              onChange={(e) => setTruckForm({ ...truckForm, notes: e.currentTarget.value })}
              rows={2}
            />

            <Divider />

            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setEditTruckModalOpen(false);
                  setSelectedTruck(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={<IconCheck size={16} />}
              >
                Actualizar Camión
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
          setSelectedTruck(null);
        }}
        title="Eliminar Camión"
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
              Vas a eliminar el camión <strong>{selectedTruck?.truck_number}</strong>.
              Esta acción no se puede deshacer.
            </Text>
          </Alert>

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedTruck(null);
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
              Eliminar Camión
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ============================================================
          MODAL: Editar Liquidación - CORREGIDO
      ============================================================ */}
      <Modal
        opened={editLiquidationModalOpen}
        onClose={() => {
          setEditLiquidationModalOpen(false);
          setEditLiquidationForm({
            exchange_rate: liquidation?.exchange_rate || 17.50,
            commission_percent: liquidation?.commission_percent || 10,
            notes: liquidation?.notes || '',
          });
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconEdit size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Editar Liquidación</Text>
              <Text size="xs" c="dimmed">{liquidation?.code}</Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        <Stack gap="md">
          <NumberInput
            label="Tipo de Cambio MXN/USD"
            value={editLiquidationForm.exchange_rate}
            onChange={(value) => setEditLiquidationForm({ ...editLiquidationForm, exchange_rate: Number(value) || 0 })}
            min={0}
            step={0.01}
            precision={2}
            required
          />
          <NumberInput
            label="Comisión PF (%)"
            value={editLiquidationForm.commission_percent}
            onChange={(value) => setEditLiquidationForm({ ...editLiquidationForm, commission_percent: Number(value) || 0 })}
            min={0}
            max={100}
            step={0.5}
            required
          />
          <Textarea
            label="Notas"
            placeholder="Notas sobre la liquidación"
            value={editLiquidationForm.notes}
            onChange={(e) => setEditLiquidationForm({ ...editLiquidationForm, notes: e.currentTarget.value })}
            rows={3}
          />

          <Divider />

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setEditLiquidationModalOpen(false);
                setEditLiquidationForm({
                  exchange_rate: liquidation?.exchange_rate || 17.50,
                  commission_percent: liquidation?.commission_percent || 10,
                  notes: liquidation?.notes || '',
                });
              }}
            >
              Cancelar
            </Button>
            <Button
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconCheck size={16} />}
              onClick={handleUpdateLiquidation}
              loading={isSubmitting}
            >
              Guardar Cambios
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

export default GrowerPFLiquidation;