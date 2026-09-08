// src/modules/grower/GrowerOrders.tsx
import React, { useState } from 'react';
import { 
  Card, 
  Text, 
  Group, 
  SimpleGrid, 
  TextInput, 
  Select, 
  Table, 
  NumberInput, 
  Button, 
  Badge, 
  Stack, 
  Box,
  ThemeIcon,
  Divider,
  Loader,
  Center,
  Alert,
  Modal,
  Grid,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Paper,
  SegmentedControl,
  Drawer,
  Avatar
} from '@mantine/core';
import { 
  IconClipboardCheck, 
  IconReceipt, 
  IconCoin, 
  IconClock, 
  IconCheck,
  IconTruck,
  IconPackage,
  IconCash,
  IconRefresh,
  IconAlertCircle,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconBuildingWarehouse,
  IconUser,
  IconFileInvoice,
  IconCalendar,
  IconBox,
  IconCurrencyDollar,
  IconArrowRight,
  IconBuilding,
  IconList
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { usePurchaseOrders } from './hooks/usePurchaseOrders';
import { notifications } from '@mantine/notifications';

export function GrowerOrders() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('todas');

  const { orders, summary, isLoading, error, refresh, createOrder, updateStatus, deleteOrder } = usePurchaseOrders();

  // Estados del formulario
  const [formData, setFormData] = useState({
    empresa: 'Daily Veggies (San Aparicio)',
    proveedor: 'Fertilizantes y Servicios',
    categoria: 'FERTILIZANTES',
    destino: 'Almacén (inventario)',
    entrega_requerida: '30-nov-2026',
    items: [
      { concept: 'Urea 46-0-0', quantity: 80, unit: 'bulto 50kg', unit_price: 620 },
      { concept: 'Fosfonitrato', quantity: 40, unit: 'bulto 50kg', unit_price: 710 },
    ]
  });

  // Calcular totales
  const totalItems = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newOrder = await createOrder({
        empresa: formData.empresa,
        proveedor: formData.proveedor,
        categoria: formData.categoria,
        destino: formData.destino,
        entrega_requerida: formData.entrega_requerida,
        items: formData.items.map(item => ({
          concept: item.concept,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
        })),
      });

      notifications.show({
        title: '✅ OC creada',
        message: `Orden ${newOrder.code} creada exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 4000,
      });

      setModalOpen(false);
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al crear la orden',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus(id, status);
      notifications.show({
        title: '✅ Estado actualizado',
        message: `Orden actualizada a "${status}"`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al actualizar estado',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta orden?')) return;

    try {
      await deleteOrder(id);
      notifications.show({
        title: '✅ Orden eliminada',
        message: 'La orden ha sido eliminada correctamente',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al eliminar la orden',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { concept: '', quantity: 0, unit: 'bulto 50kg', unit_price: 0 }]
    });
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'todas') return true;
    return order.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'gray',
      authorized: 'blue',
      received: 'green',
      invoiced: 'teal',
      cancelled: 'red',
    };
    return colors[status] || 'gray';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      authorized: 'Autorizada',
      received: 'Recibida',
      invoiced: 'Facturada',
      cancelled: 'Cancelada',
    };
    return labels[status] || status;
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando órdenes de compra...</Text>
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
            G-08 · Órdenes de Compra
          </Text>
          <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            Compras & Seguimiento
          </Text>
          <Text size="sm" c="dimmed">
            Gestión de órdenes de compra y seguimiento de proveedores
          </Text>
        </Stack>
        <Group gap="sm">
          <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
            {summary?.totalOrders || 0} OC
          </Badge>
          <Button
            size="sm"
            style={{ backgroundColor: '#1F5C3A' }}
            leftSection={<IconPlus size={16} />}
            onClick={() => setModalOpen(true)}
          >
            Nueva OC
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

      {/* KPIs */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
        {[
          { title: 'OC del Mes', value: summary?.totalOrders?.toString() || '0', icon: IconReceipt, color: '#1F5C3A', desc: `${summary?.received || 0} recibidas · ${summary?.authorized || 0} autorizadas` },
          { title: 'Monto Comprometido', value: `$${summary?.totalAmount?.toLocaleString() || '0'}`, icon: IconCoin, color: '#1F5C3A', desc: 'MXN · nov-26' },
          { title: 'Por Recibir', value: `${summary?.pending || 0} OCs`, icon: IconClock, color: '#C08412', desc: `$${summary?.totalAmount ? (summary.totalAmount * 0.25).toLocaleString() : '0'} pendiente` },
          { title: 'Conciliadas', value: `${summary?.conciliated || 0}/${summary?.totalOrders || 0}`, icon: IconCheck, color: '#1F5C3A', desc: 'cero diferencias' },
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
                    <Text size="xl" fw={800} c="#3A3A34">{kpi.value}</Text>
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

      {/* Filtros */}
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <Badge variant="light" color="teal" radius="sm">
            {filteredOrders.length} órdenes
          </Badge>
        </Group>
        <SegmentedControl
          size="xs"
          value={filterStatus}
          onChange={setFilterStatus}
          data={[
            { value: 'todas', label: 'Todas' },
            { value: 'draft', label: 'Borradores' },
            { value: 'authorized', label: 'Autorizadas' },
            { value: 'received', label: 'Recibidas' },
            { value: 'invoiced', label: 'Facturadas' },
            { value: 'cancelled', label: 'Canceladas' },
          ]}
          styles={{
            root: { backgroundColor: '#F5F3EE' },
            indicator: { backgroundColor: '#1F5C3A' },
            label: { fontWeight: 600 }
          }}
        />
      </Group>

      {/* Tabla de Órdenes */}
      <Paper withBorder style={{ borderColor: '#E8E5DC', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <ScrollArea>
          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
              <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>OC</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Empresa</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Proveedor</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Categoría</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Total</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Estatus</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>→ CxP</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>→ Inventario</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>→ P&L</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="center">Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Table.Tr key={order.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                    <Table.Td fw={700} c="#1F5C3A" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                      {order.code}
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="teal" size="sm" radius="sm">
                        {order.empresa}
                      </Badge>
                    </Table.Td>
                    <Table.Td fw={600} c="#3A3A34">{order.proveedor}</Table.Td>
                    <Table.Td>
                      <Badge size="xs" variant="light" color="gray" radius="sm">
                        {order.categoria}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta="right" fw={700} c="#1F5C3A">${order.total.toLocaleString()}</Table.Td>
                    <Table.Td>
                      <Badge 
                        size="xs" 
                        color={getStatusColor(order.status)} 
                        variant="light"
                        radius="sm"
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        {order.status === 'received' || order.status === 'invoiced' ? (
                          <IconCheck size={12} color="#1F5C3A" />
                        ) : (
                          <IconClock size={12} color="#9A968A" />
                        )}
                        <Text size="xs" c={order.status === 'received' || order.status === 'invoiced' ? '#1F5C3A' : 'dimmed'}>
                          {order.status === 'received' || order.status === 'invoiced' ? 'Conciliada' : 'Pendiente'}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        {order.status === 'received' || order.status === 'invoiced' ? (
                          <IconPackage size={12} color="#1F5C3A" />
                        ) : (
                          <IconClock size={12} color="#9A968A" />
                        )}
                        <Text size="xs" c={order.status === 'received' || order.status === 'invoiced' ? '#1F5C3A' : 'dimmed'}>
                          {order.status === 'received' || order.status === 'invoiced' ? 'Entregado' : 'Pendiente'}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        {order.status === 'invoiced' ? (
                          <IconCash size={12} color="#1F5C3A" />
                        ) : (
                          <IconClock size={12} color="#9A968A" />
                        )}
                        <Text size="xs" fw={700} c={order.status === 'invoiced' ? '#1F5C3A' : 'dimmed'}>
                          {order.status === 'invoiced' ? '✓' : 'Pendiente'}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} justify="center">
                        <Tooltip label="Ver detalles">
                          <ActionIcon 
                            variant="subtle" 
                            color="blue" 
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <IconEye size={16} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Cambiar estado">
                          <ActionIcon 
                            variant="subtle" 
                            color="teal" 
                            size="sm"
                            onClick={() => {
                              const statuses = ['draft', 'authorized', 'received', 'invoiced', 'cancelled'];
                              const currentIndex = statuses.indexOf(order.status);
                              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                              handleUpdateStatus(order.id, nextStatus);
                            }}
                          >
                            <IconEdit size={16} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Eliminar">
                          <ActionIcon 
                            variant="subtle" 
                            color="red" 
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <IconTrash size={16} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={10} ta="center" py="xl">
                    <Stack align="center" gap="sm">
                      <IconReceipt size={40} color="#9A968A" opacity={0.4} />
                      <Text size="sm" c="dimmed">No hay órdenes de compra</Text>
                      <Text size="xs" c="dimmed">Comienza creando una nueva orden</Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      {/* Drawer de Detalles */}
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          <Group gap="sm">
            <IconFileInvoice size={20} color="#1F5C3A" />
            <Stack gap={0}>
              <Text size="sm" fw={700}>Detalle de Orden de Compra</Text>
              <Text size="xs" c="dimmed">{selectedOrder?.code}</Text>
            </Stack>
          </Group>
        }
        size="lg"
        position="right"
        padding="xl"
      >
        {selectedOrder && (
          <Stack gap="md">
            {/* Header con estado */}
            <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FAF9F5' }}>
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">Fecha de creación</Text>
                  <Text fw={700}>{new Date(selectedOrder.created_at).toLocaleDateString()}</Text>
                </Stack>
                <Stack gap={0} align="flex-end">
                  <Text size="xs" c="dimmed">Estado</Text>
                  <Badge 
                    color={getStatusColor(selectedOrder.status)}
                    variant="light"
                    size="lg"
                    radius="xl"
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </Badge>
                </Stack>
              </Group>
            </Card>

            {/* Información General */}
            <SimpleGrid cols={2} spacing="md">
              <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
                <Group gap="sm">
                  <IconBuilding size={16} color="#1F5C3A" />
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">Empresa</Text>
                    <Text fw={700}>{selectedOrder.empresa}</Text>
                  </Stack>
                </Group>
              </Card>
              <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
                <Group gap="sm">
                  <IconBuildingWarehouse size={16} color="#1F5C3A" />
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">Destino</Text>
                    <Text fw={700}>{selectedOrder.destino}</Text>
                  </Stack>
                </Group>
              </Card>
            </SimpleGrid>

            <SimpleGrid cols={2} spacing="md">
              <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
                <Group gap="sm">
                  <IconUser size={16} color="#1F5C3A" />
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">Proveedor</Text>
                    <Text fw={700}>{selectedOrder.proveedor}</Text>
                  </Stack>
                </Group>
              </Card>
              <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
                <Group gap="sm">
                  <IconBox size={16} color="#1F5C3A" />
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">Categoría</Text>
                    <Text fw={700}>
                      <Badge variant="light" color="gray" size="sm" radius="sm">
                        {selectedOrder.categoria}
                      </Badge>
                    </Text>
                  </Stack>
                </Group>
              </Card>
            </SimpleGrid>

            <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
              <Group gap="sm">
                <IconCalendar size={16} color="#1F5C3A" />
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">Entrega Requerida</Text>
                  <Text fw={700}>{selectedOrder.entrega_requerida}</Text>
                </Stack>
              </Group>
            </Card>

            <Divider label="Partidas" labelPosition="center" />

            {/* Tabla de Partidas */}
            <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
              <Table verticalSpacing="sm" style={{ fontSize: '13px' }}>
                <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                  <Table.Tr>
                    <Table.Th>#</Table.Th>
                    <Table.Th>Concepto</Table.Th>
                    <Table.Th ta="right">Cantidad</Table.Th>
                    <Table.Th>Unidad</Table.Th>
                    <Table.Th ta="right">Precio</Table.Th>
                    <Table.Th ta="right">Importe</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <Table.Tr key={idx}>
                      <Table.Td>{idx + 1}</Table.Td>
                      <Table.Td fw={600}>{item.concept}</Table.Td>
                      <Table.Td ta="right">{item.quantity}</Table.Td>
                      <Table.Td c="dimmed">{item.unit}</Table.Td>
                      <Table.Td ta="right">${item.unit_price.toFixed(2)}</Table.Td>
                      <Table.Td ta="right" fw={700} c="#1F5C3A">${(item.quantity * item.unit_price).toFixed(2)}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>

            {/* Total */}
            <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#E8F5E9' }}>
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">Total de la Orden</Text>
                  <Text size="xl" fw={800} c="#1F5C3A">${selectedOrder.total.toLocaleString()}</Text>
                </Stack>
                <Stack gap={0} align="flex-end">
                  <Text size="xs" c="dimmed">Cantidad de Partidas</Text>
                  <Text size="xl" fw={800} c="#2A6A8A">{selectedOrder.items?.length || 0}</Text>
                </Stack>
              </Group>
            </Card>

            {/* Flujo de la orden */}
            <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FAF9F5' }}>
              <Text size="xs" fw={700} c="#1F5C3A" mb="sm">Flujo de la Orden</Text>
              <Stack gap="xs">
                <Group gap="sm">
                  <ThemeIcon size="sm" radius="xl" color={selectedOrder.status === 'draft' ? 'blue' : 'gray'} variant="light">
                    <IconClipboardCheck size={14} />
                  </ThemeIcon>
                  <Text size="sm" c={selectedOrder.status === 'draft' ? '#1F5C3A' : 'dimmed'}>
                    Borrador {selectedOrder.status === 'draft' && '← Actual'}
                  </Text>
                  {selectedOrder.status !== 'draft' && <IconArrowRight size={14} color="#9A968A" />}
                </Group>
                <Group gap="sm">
                  <ThemeIcon size="sm" radius="xl" color={selectedOrder.status === 'authorized' ? 'blue' : 'gray'} variant="light">
                    <IconCheck size={14} />
                  </ThemeIcon>
                  <Text size="sm" c={selectedOrder.status === 'authorized' ? '#1F5C3A' : 'dimmed'}>
                    Autorizada {selectedOrder.status === 'authorized' && '← Actual'}
                  </Text>
                  {selectedOrder.status !== 'authorized' && selectedOrder.status !== 'draft' && <IconArrowRight size={14} color="#9A968A" />}
                </Group>
                <Group gap="sm">
                  <ThemeIcon size="sm" radius="xl" color={selectedOrder.status === 'received' ? 'blue' : 'gray'} variant="light">
                    <IconTruck size={14} />
                  </ThemeIcon>
                  <Text size="sm" c={selectedOrder.status === 'received' ? '#1F5C3A' : 'dimmed'}>
                    Recibida {selectedOrder.status === 'received' && '← Actual'}
                  </Text>
                  {selectedOrder.status !== 'received' && selectedOrder.status !== 'authorized' && selectedOrder.status !== 'draft' && <IconArrowRight size={14} color="#9A968A" />}
                </Group>
                <Group gap="sm">
                  <ThemeIcon size="sm" radius="xl" color={selectedOrder.status === 'invoiced' ? 'blue' : 'gray'} variant="light">
                    <IconCash size={14} />
                  </ThemeIcon>
                  <Text size="sm" c={selectedOrder.status === 'invoiced' ? '#1F5C3A' : 'dimmed'}>
                    Facturada {selectedOrder.status === 'invoiced' && '← Actual'}
                  </Text>
                </Group>
              </Stack>
            </Card>

            {/* Acciones */}
            <Group gap="sm" justify="center" mt="md">
              {selectedOrder.status !== 'invoiced' && selectedOrder.status !== 'cancelled' && (
                <Button
                  size="sm"
                  color="teal"
                  leftSection={<IconEdit size={16} />}
                  onClick={() => {
                    const statuses = ['draft', 'authorized', 'received', 'invoiced', 'cancelled'];
                    const currentIndex = statuses.indexOf(selectedOrder.status);
                    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                    handleUpdateStatus(selectedOrder.id, nextStatus);
                    setDrawerOpen(false);
                  }}
                >
                  Avanzar Estado
                </Button>
              )}
              <Button
                size="sm"
                variant="subtle"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={() => {
                  handleDeleteOrder(selectedOrder.id);
                  setDrawerOpen(false);
                }}
              >
                Eliminar
              </Button>
            </Group>
          </Stack>
        )}
      </Drawer>

      {/* Modal de Creación de OC */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconClipboardCheck size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Nueva Orden de Compra</Text>
              <Text size="xs" c="dimmed">Captura y seguimiento en una sola pantalla</Text>
            </Stack>
          </Group>
        }
        size="xl"
        centered
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
              <TextInput 
                label="No. de OC" 
                value={`OC-${String(new Date().getFullYear())}-${String(Math.floor(Math.random() * 9000) + 1000)}`} 
                size="xs" 
                disabled 
                styles={{ input: { fontWeight: 700, color: '#1F5C3A' } }}
              />
              <Select 
                label="Empresa" 
                data={['Daily Veggies (San Aparicio)', 'Rancho JAV']} 
                value={formData.empresa}
                onChange={(value) => setFormData({ ...formData, empresa: value || 'Daily Veggies (San Aparicio)' })}
                size="xs" 
              />
              <Select 
                label="Proveedor" 
                data={['Fertilizantes y Servicios', 'El Morón', 'Tainong (USD)']} 
                value={formData.proveedor}
                onChange={(value) => setFormData({ ...formData, proveedor: value || 'Fertilizantes y Servicios' })}
                size="xs" 
              />
              <Select 
                label="Categoría" 
                data={['FERTILIZANTES', 'AGROQUÍMICOS', 'SEMILLA', 'DIESEL']} 
                value={formData.categoria}
                onChange={(value) => setFormData({ ...formData, categoria: value || 'FERTILIZANTES' })}
                size="xs" 
              />
            </SimpleGrid>

            <Select 
              label="Destino" 
              data={['Almacén (inventario)', 'Campo directo']} 
              value={formData.destino}
              onChange={(value) => setFormData({ ...formData, destino: value || 'Almacén (inventario)' })}
              size="xs" 
              style={{ maxWidth: 250 }} 
            />

            <Divider label="Partidas" labelPosition="center" />

            <Table verticalSpacing="sm" horizontalSpacing="md" style={{ fontSize: '12px' }}>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', width: '40px' }}>#</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Concepto / SKU</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', width: '100px' }}>Cantidad</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', width: '110px' }}>Unidad</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', width: '120px' }}>Precio Unit.</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', width: '120px' }} ta="right">Importe</Table.Th>
                  <Table.Th style={{ width: '40px' }} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {formData.items.map((item, index) => (
                  <Table.Tr key={index} style={{ borderBottom: '1px solid #EFECE3' }}>
                    <Table.Td>{index + 1}</Table.Td>
                    <Table.Td>
                      <TextInput 
                        size="xs" 
                        value={item.concept} 
                        onChange={(e) => handleItemChange(index, 'concept', e.currentTarget.value)}
                        placeholder="Concepto"
                        styles={{ input: { fontWeight: 600 } }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput 
                        size="xs" 
                        value={item.quantity} 
                        onChange={(value) => handleItemChange(index, 'quantity', value)}
                        min={0}
                        styles={{ input: { textAlign: 'center', fontWeight: 600 } }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Select 
                        size="xs" 
                        value={item.unit} 
                        onChange={(value) => handleItemChange(index, 'unit', value)}
                        data={['bulto 50kg', 'L', 'kg', 'unidad', 'caja']}
                        styles={{ input: { fontWeight: 600 } }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput 
                        size="xs" 
                        value={item.unit_price} 
                        onChange={(value) => handleItemChange(index, 'unit_price', value)}
                        min={0}
                        prefix="$"
                        styles={{ input: { textAlign: 'right', fontWeight: 600 } }}
                      />
                    </Table.Td>
                    <Table.Td ta="right" fw={700} c="#1F5C3A">
                      ${(item.quantity * item.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon 
                        size="sm" 
                        color="red" 
                        variant="subtle"
                        onClick={() => handleRemoveItem(index)}
                        disabled={formData.items.length <= 1}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
                <Table.Tr style={{ backgroundColor: '#FAF9F5', borderTop: '2px solid #E5E2D9' }}>
                  <Table.Td colSpan={5} ta="right" fw={700} c="#3A3A34">TOTAL</Table.Td>
                  <Table.Td ta="right" fw={800} c="#1F5C3A">
                    ${totalItems.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                  </Table.Td>
                  <Table.Td />
                </Table.Tr>
              </Table.Tbody>
            </Table>

            <Group justify="space-between" mt="md">
              <Button 
                size="xs" 
                variant="subtle" 
                color="teal"
                onClick={handleAddItem}
                leftSection={<IconPlus size={14} />}
              >
                Agregar Partida
              </Button>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Box p="sm" style={{ backgroundColor: 'rgba(31, 92, 58, 0.04)', borderRadius: '6px', borderLeft: '3px solid #1F5C3A' }}>
                <Text size="11px" c="#1F5C3A" style={{ lineHeight: 1.5 }}>
                  <strong>Flujo automático:</strong> al llegar el XML del SAT, se concilia contra esta OC. 
                  La cuenta nace con categoría y crédito. Al recibir, entra a inventario y el gasto cae al P&L del rancho.
                </Text>
              </Box>
              <Group gap="sm">
                <Button variant="subtle" color="gray" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  loading={isSubmitting}
                  style={{ backgroundColor: '#1F5C3A' }}
                  leftSection={<IconClipboardCheck size={16} />}
                >
                  Guardar y Autorizar OC
                </Button>
              </Group>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}

export default GrowerOrders;