// src/modules/grower/GrowerHarvestTicket.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Table, 
  Paper, 
  Text, 
  Group, 
  Badge, 
  ActionIcon, 
  Stack, 
  SimpleGrid, 
  Card, 
  TextInput, 
  Select, 
  Button, 
  NumberInput,
  Divider,
  ThemeIcon,
  Loader,
  Center,
  Alert,
  Modal,
  Grid,
  ScrollArea,
  Tooltip,
  Drawer,
  Avatar,
  SegmentedControl
} from '@mantine/core';
import { 
  IconDownload, 
  IconCircleCheck, 
  IconClock, 
  IconBarcode, 
  IconCheck, 
  IconPlus, 
  IconTrash,
  IconBox,
  IconUsers,
  IconReceipt,
  IconTarget,
  IconRefresh,
  IconAlertCircle,
  IconEdit,
  IconEye,
  IconFileInvoice,
  IconUser,
  IconCalendar,
  IconBuildingWarehouse,
  IconQrcode,
  IconPackage
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useHarvestTicket } from './hooks/useHarvestTicket';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { notifications } from '@mantine/notifications';

export function GrowerHarvestTicket() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [folio, setFolio] = useState<string>('2725');
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [producto, setProducto] = useState<string | null>('Shanghai Bok Choy');
  const [cuadrilla, setCuadrilla] = useState<string | null>('San Antonio · 30 pers');
  const [filterStatus, setFilterStatus] = useState<string>('todas');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sector1Cajas, setSector1Cajas] = useState<number | string>(405);
  const [sector2Cajas, setSector2Cajas] = useState<number | string>(179);
  const [cosechador1, setCosechador1] = useState<number | string>(64);
  const [cosechador2, setCosechador2] = useState<number | string>(78);
  const [cosechador3, setCosechador3] = useState<number | string>(58);
  const [cosechador4, setCosechador4] = useState<number | string>(384);

  const { tickets, summary, isLoading, error, refresh, createTicket, updateStatus, deleteTicket } = useHarvestTicket();

  // Cálculos dinámicos
  const totalCajasSectores = (Number(sector1Cajas) || 0) + (Number(sector2Cajas) || 0);
  const totalCajasCosechadores = (Number(cosechador1) || 0) + (Number(cosechador2) || 0) + (Number(cosechador3) || 0) + (Number(cosechador4) || 0);
  const totalImporteDestajo = totalCajasCosechadores * 15.00;
  const cuadranCajas = totalCajasSectores === totalCajasCosechadores && totalCajasSectores > 0;

  // Filtrar boletas
  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus === 'todas') return true;
    return ticket.status === filterStatus;
  });

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cuadranCajas) {
      notifications.show({
        title: 'Error',
        message: 'Las cajas por sector no coinciden con las cajas por cosechador',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newTicket = await createTicket({
        fecha,
        producto: producto || '',
        cuadrilla: cuadrilla || '',
        sectores: [
          { sector: '3b-1 SA · v1', cajas: Number(sector1Cajas) || 0 },
          { sector: '5a-2 SA · v1', cajas: Number(sector2Cajas) || 0 },
        ],
        cosechadores: [
          { nombre: 'Teresa Gutiérrez Roque', cajas: Number(cosechador1) || 0 },
          { nombre: 'José Fidel Celio García', cajas: Number(cosechador2) || 0 },
          { nombre: 'Blanca Laguna Luna', cajas: Number(cosechador3) || 0 },
          { nombre: '+ 11 más de la cuadrilla', cajas: Number(cosechador4) || 0 },
        ],
      });

      notifications.show({
        title: '✅ Boleta creada',
        message: `Boleta ${newTicket.folio} emitida exitosamente`,
        color: 'green',
        icon: <IconCircleCheck size={16} />,
        autoClose: 4000,
      });

      setModalOpen(false);
      resetForm();
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al crear la boleta',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus(id, status);
      notifications.show({
        title: '✅ Estado actualizado',
        message: `Boleta actualizada a "${status}"`,
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

  const handleDeleteTicket = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta boleta?')) return;

    try {
      await deleteTicket(id);
      notifications.show({
        title: '✅ Boleta eliminada',
        message: 'La boleta ha sido eliminada correctamente',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al eliminar la boleta',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const resetForm = () => {
    setSector1Cajas(405);
    setSector2Cajas(179);
    setCosechador1(64);
    setCosechador2(78);
    setCosechador3(58);
    setCosechador4(384);
    setFolio(String(Math.floor(Math.random() * 9000) + 1000));
  };

  // ============================================================
  // RENDER
  // ============================================================

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      emitida: 'gray',
      escaneada: 'blue',
      en_transito: 'orange',
      entregada: 'green',
    };
    return colors[status] || 'gray';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      emitida: 'Emitida',
      escaneada: 'Escaneada',
      en_transito: 'En tránsito',
      entregada: 'Entregada',
    };
    return labels[status] || status;
  };

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando boletas...</Text>
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
            G-07 · Cosecha
          </Text>
          <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            Boleta de Cosecha
          </Text>
          <Text size="sm" c="dimmed">
            Captura y seguimiento de boletas de cosecha
          </Text>
        </Stack>
        <Group gap="sm">
          <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
            {summary?.totalBoletas || 0} Boletas
          </Badge>
          <Button
            size="sm"
            style={{ backgroundColor: '#1F5C3A' }}
            leftSection={<IconPlus size={16} />}
            onClick={() => setModalOpen(true)}
          >
            Nueva Boleta
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
          { title: 'Boletas Hoy', value: summary?.boletasHoy?.toString() || '0', icon: IconReceipt, color: '#1F5C3A' },
          { title: 'Precisión Hoy', value: summary?.precisionPromedio ? `${summary.precisionPromedio}%` : '0%', icon: IconTarget, color: '#1F5C3A' },
          { title: 'Precisión Temporada', value: summary?.precisionTemporada ? `${summary.precisionTemporada}%` : '0%', icon: IconTarget, color: '#3A3A34' },
          { title: 'Cajas Totales', value: summary?.totalCajas?.toLocaleString() || '0', icon: IconBox, color: '#1F5C3A' },
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
        <SegmentedControl
          size="xs"
          value={filterStatus}
          onChange={setFilterStatus}
          data={[
            { value: 'todas', label: 'Todas' },
            { value: 'emitida', label: 'Emitidas' },
            { value: 'escaneada', label: 'Escaneadas' },
            { value: 'en_transito', label: 'En tránsito' },
            { value: 'entregada', label: 'Entregadas' },
          ]}
          styles={{
            root: { backgroundColor: '#F5F3EE' },
            indicator: { backgroundColor: '#1F5C3A' },
            label: { fontWeight: 600 }
          }}
        />
        <Badge variant="light" color="teal" radius="sm">
          {filteredTickets.length} boletas
        </Badge>
      </Group>

      {/* Tabla */}
      <Paper withBorder style={{ borderColor: '#E8E5DC', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <ScrollArea>
          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
              <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Folio</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Producto</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cuadrilla</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }} ta="right">Cajas</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }} ta="right">Importe</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estado</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }} ta="center">Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <Table.Tr key={ticket.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                    <Table.Td>
                      <Group gap="sm">
                        <IconFileInvoice size={14} color="#1F5C3A" />
                        <Text fw={700} c="#1F5C3A" size="sm">{ticket.folio}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <IconCalendar size={14} color="#9A968A" />
                        <Text size="sm" c="#3A3A34">{ticket.fecha}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="teal" size="sm" radius="sm">
                        {ticket.producto}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <IconUsers size={14} color="#9A968A" />
                        <Text size="sm" c="#3A3A34">{ticket.cuadrilla}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text fw={700} c="#1F5C3A" size="sm">{ticket.totalCajas}</Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text fw={600} c="#3A3A34" size="sm">${ticket.totalImporte.toLocaleString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        variant="light" 
                        color={getStatusColor(ticket.status)}
                        leftSection={ticket.status === 'entregada' ? <IconCircleCheck size={12} /> : <IconClock size={12} />}
                        radius="xl"
                      >
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} justify="center">
                        <Tooltip label="Ver QR">
                          <ActionIcon 
                            variant="subtle" 
                            color="teal" 
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                          >
                            <IconQrcode size={16} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Ver detalles">
                          <ActionIcon 
                            variant="subtle" 
                            color="blue" 
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                          >
                            <IconEye size={16} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Marcar como entregada">
                          <ActionIcon 
                            variant="subtle" 
                            color="green" 
                            size="sm"
                            onClick={() => handleUpdateStatus(ticket.id, 'entregada')}
                            disabled={ticket.status === 'entregada'}
                          >
                            <IconCheck size={16} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Eliminar">
                          <ActionIcon 
                            variant="subtle" 
                            color="red" 
                            size="sm"
                            onClick={() => handleDeleteTicket(ticket.id)}
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
                  <Table.Td colSpan={8} ta="center" py="xl">
                    <Stack align="center" gap="sm">
                      <IconReceipt size={40} color="#9A968A" opacity={0.4} />
                      <Text size="sm" c="dimmed">No hay boletas registradas</Text>
                      <Text size="xs" c="dimmed">Comienza creando una nueva boleta</Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      {/* Modal de Creación */}
      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconPlus size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Nueva Boleta de Cosecha</Text>
              <Text size="xs" c="dimmed">Folio: DV-{folio}</Text>
            </Stack>
          </Group>
        }
        size="xl"
        centered
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <TextInput 
                  label="Folio"
                  value={`DV-${folio}`} 
                  disabled
                  size="xs"
                  styles={{ input: { fontWeight: 700, color: '#1F5C3A', backgroundColor: '#F5F3EE' } }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput 
                  label="Fecha"
                  type="date"
                  value={fecha} 
                  onChange={(e) => setFecha(e.currentTarget.value)} 
                  size="xs"
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select 
                  label="Producto"
                  data={['Shanghai Bok Choy', 'Baby Napa', 'Chinese Cauliflower']} 
                  value={producto} 
                  onChange={setProducto} 
                  size="xs"
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select 
                  label="Cuadrilla"
                  data={['San Antonio · 30 pers', 'San Felipe · 25 pers']} 
                  value={cuadrilla} 
                  onChange={setCuadrilla} 
                  size="xs"
                  required
                />
              </Grid.Col>
            </Grid>

            <Divider label="Desglose por Sectores" labelPosition="center" />

            <Grid>
              <Grid.Col span={6}>
                <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
                  <Group gap="sm" mb="sm">
                    <IconBuildingWarehouse size={16} color="#1F5C3A" />
                    <Text size="xs" fw={700}>Sector 1</Text>
                  </Group>
                  <NumberInput 
                    label="3b-1 SA · v1"
                    size="xs"
                    value={sector1Cajas} 
                    onChange={setSector1Cajas}
                    min={0}
                    required
                  />
                </Card>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
                  <Group gap="sm" mb="sm">
                    <IconBuildingWarehouse size={16} color="#1F5C3A" />
                    <Text size="xs" fw={700}>Sector 2</Text>
                  </Group>
                  <NumberInput 
                    label="5a-2 SA · v1"
                    size="xs"
                    value={sector2Cajas} 
                    onChange={setSector2Cajas}
                    min={0}
                    required
                  />
                </Card>
              </Grid.Col>
            </Grid>

            <Divider label="Destajo por Cosechador" labelPosition="center" />

            <Grid>
              {[
                { id: 1, name: 'Teresa Gutiérrez Roque', state: cosechador1, setter: setCosechador1 },
                { id: 2, name: 'José Fidel Celio García', state: cosechador2, setter: setCosechador2 },
                { id: 3, name: 'Blanca Laguna Luna', state: cosechador3, setter: setCosechador3 },
                { id: 4, name: '+ 11 más de la cuadrilla', state: cosechador4, setter: setCosechador4 },
              ].map((cos) => (
                <Grid.Col key={cos.id} span={6}>
                  <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
                    <Group gap="sm" mb="sm">
                      <IconUser size={16} color="#1F5C3A" />
                      <Text size="xs" fw={700}>{cos.name}</Text>
                    </Group>
                    <NumberInput 
                      size="xs"
                      value={cos.state} 
                      onChange={cos.setter}
                      min={0}
                      required
                    />
                  </Card>
                </Grid.Col>
              ))}
            </Grid>

            <Divider />

            <Group justify="space-between">
              <Stack gap={2}>
                <Text size="xs" c="dimmed">Total Cajas: <strong>{totalCajasSectores}</strong></Text>
                <Text size="xs" c={cuadranCajas ? 'green' : 'red'}>
                  {cuadranCajas ? '✓ Las cajas coinciden' : '⚠ Las cajas no coinciden'}
                </Text>
              </Stack>
              <Group gap="sm">
                <Button variant="subtle" color="gray" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  loading={isSubmitting}
                  style={{ backgroundColor: '#1F5C3A' }}
                  leftSection={<IconCheck size={16} />}
                  disabled={!cuadranCajas}
                >
                  Emitir Boleta
                </Button>
              </Group>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Drawer de Detalles con QR */}
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          <Group gap="sm">
            <IconFileInvoice size={20} color="#1F5C3A" />
            <Stack gap={0}>
              <Text size="sm" fw={700}>Detalle de Boleta</Text>
              <Text size="xs" c="dimmed">{selectedTicket?.folio}</Text>
            </Stack>
          </Group>
        }
        size="lg"
        position="right"
        padding="xl"
      >
        {selectedTicket && (
          <Stack gap="md">
            {/* QR Code */}
            <QRCodeGenerator
              folio={selectedTicket.folio}
              producto={selectedTicket.producto}
              cuadrilla={selectedTicket.cuadrilla}
              totalCajas={selectedTicket.totalCajas}
              fecha={selectedTicket.fecha}
              status={selectedTicket.status}
              size={180}
            />

            <Divider />

            {/* Header */}
            <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FAF9F5' }}>
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">Fecha</Text>
                  <Text fw={700}>{selectedTicket.fecha}</Text>
                </Stack>
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">Estado</Text>
                  <Badge 
                    color={getStatusColor(selectedTicket.status)}
                    variant="light"
                    size="lg"
                    radius="xl"
                  >
                    {getStatusLabel(selectedTicket.status)}
                  </Badge>
                </Stack>
              </Group>
            </Card>

            {/* Producto y Cuadrilla */}
            <SimpleGrid cols={2} spacing="md">
              <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
                <Group gap="sm">
                  <IconPackage size={16} color="#1F5C3A" />
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">Producto</Text>
                    <Text fw={700}>{selectedTicket.producto}</Text>
                  </Stack>
                </Group>
              </Card>
              <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
                <Group gap="sm">
                  <IconUsers size={16} color="#1F5C3A" />
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">Cuadrilla</Text>
                    <Text fw={700}>{selectedTicket.cuadrilla}</Text>
                  </Stack>
                </Group>
              </Card>
            </SimpleGrid>

            {/* Sectores */}
            <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
              <Text size="xs" fw={700} c="#1F5C3A" mb="sm">Sectores</Text>
              <Table verticalSpacing="xs">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Sector</Table.Th>
                    <Table.Th ta="right">Cajas</Table.Th>
                    <Table.Th ta="center">Liberado</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedTicket.sectores?.map((s: any, idx: number) => (
                    <Table.Tr key={idx}>
                      <Table.Td>{s.sector}</Table.Td>
                      <Table.Td ta="right" fw={700}>{s.cajas}</Table.Td>
                      <Table.Td ta="center">
                        {s.liberado ? <IconCheck size={16} color="#1F5C3A" /> : <IconClock size={16} color="#C08412" />}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>

            {/* Cosechadores */}
            <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC' }}>
              <Text size="xs" fw={700} c="#1F5C3A" mb="sm">Cosechadores</Text>
              <Table verticalSpacing="xs">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th ta="right">Cajas</Table.Th>
                    <Table.Th ta="right">Importe</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedTicket.cosechadores?.map((c: any, idx: number) => (
                    <Table.Tr key={idx}>
                      <Table.Td>{c.nombre}</Table.Td>
                      <Table.Td ta="right" fw={700}>{c.cajas}</Table.Td>
                      <Table.Td ta="right">${c.importe.toLocaleString()}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>

            {/* Totales */}
            <Card p="md" radius="md" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#E8F5E9' }}>
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">Total Cajas</Text>
                  <Text size="xl" fw={800} c="#1F5C3A">{selectedTicket.totalCajas}</Text>
                </Stack>
                <Stack gap={0} align="flex-end">
                  <Text size="xs" c="dimmed">Total Importe</Text>
                  <Text size="xl" fw={800} c="#1F5C3A">${selectedTicket.totalImporte.toLocaleString()}</Text>
                </Stack>
              </Group>
            </Card>

            {/* Acciones */}
            <Group gap="sm" justify="center" mt="md">
              {selectedTicket.status !== 'entregada' && (
                <Button
                  size="sm"
                  color="green"
                  leftSection={<IconCheck size={16} />}
                  onClick={() => {
                    handleUpdateStatus(selectedTicket.id, 'entregada');
                    setDrawerOpen(false);
                  }}
                >
                  Marcar como Entregada
                </Button>
              )}
              <Button
                size="sm"
                variant="subtle"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={() => {
                  handleDeleteTicket(selectedTicket.id);
                  setDrawerOpen(false);
                }}
              >
                Eliminar
              </Button>
            </Group>
          </Stack>
        )}
      </Drawer>
    </Box>
  );
}

export default GrowerHarvestTicket;