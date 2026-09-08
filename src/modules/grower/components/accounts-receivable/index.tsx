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
  Checkbox,
  Card,
  ThemeIcon,
  Divider,
  Progress,
  RingProgress,
  Tooltip,
  ActionIcon,
  SegmentedControl,
  Modal,
  Textarea,
  Alert,
  Loader,
  Center,
  ScrollArea,
} from '@mantine/core';
import {
  IconReceipt,
  IconCheck,
  IconSend,
  IconCurrencyDollar,
  IconUsers,
  IconFileInvoice,
  IconBuildingBank,
  IconClock,
  IconAlertCircle,
  IconArrowUpRight,
  IconArrowDownRight,
  IconEye,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconPlus,
  IconTrendingUp,
  IconCalendar,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useAccountsReceivable } from './hooks/useAccountsReceivable';
import { notifications } from '@mantine/notifications';

export function GrowerAccountsReceivable() {
  const {
    invoices,
    settlements,
    customers,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    markAsPaid,
    emitInvoiceFromSettlement,
  } = useAccountsReceivable();

  const [viewMode, setViewMode] = useState('todas');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [emitModalOpen, setEmitModalOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'transfer',
    bank_reference: '',
    notes: '',
  });

  const [emitForm, setEmitForm] = useState({
    invoice_number: '',
  });

  // ============================================================
  // HANDLERS
  // ============================================================

  const toggleSelect = (id: string) => {
    setSelectedInvoices(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const payableInvoices = filteredInvoices.filter(i => i.status !== 'paid');
    if (selectedInvoices.length === payableInvoices.length && payableInvoices.length > 0) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(payableInvoices.map(i => i.id));
    }
  };

  const handleOpenPaymentModal = () => {
    if (selectedInvoices.length === 0) {
      notifications.show({
        title: '⚠️ Sin selección',
        message: 'Selecciona al menos una factura para cobrar',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }
    setPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    setIsSubmitting(true);
    try {
      await markAsPaid({
        invoiceIds: selectedInvoices,
        payment_date: paymentForm.payment_date,
        payment_method: paymentForm.payment_method as 'transfer' | 'cash' | 'check',
        bank_reference: paymentForm.bank_reference || undefined,
      });
      notifications.show({
        title: '✅ Cobros registrados',
        message: `${selectedInvoices.length} facturas marcadas como cobradas`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setPaymentModalOpen(false);
      setSelectedInvoices([]);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al registrar cobros',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEmitModal = (settlement: any) => {
    setSelectedSettlement(settlement);
    setEmitForm({ invoice_number: '' });
    setEmitModalOpen(true);
  };

  const handleEmitSubmit = async () => {
    if (!selectedSettlement || !emitForm.invoice_number.trim()) {
      notifications.show({
        title: '⚠️ Campo requerido',
        message: 'El número de factura es obligatorio',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await emitInvoiceFromSettlement(selectedSettlement.id, emitForm.invoice_number);
      notifications.show({
        title: '✅ Factura emitida',
        message: `Factura ${emitForm.invoice_number} emitida exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setEmitModalOpen(false);
      setSelectedSettlement(null);
      setEmitForm({ invoice_number: '' });
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al emitir factura',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setViewMode('todas');
    setSelectedInvoices([]);
  };

  // ============================================================
  // FILTROS
  // ============================================================

  const filteredInvoices = invoices.filter((invoice) => {
    if (viewMode === 'pendientes') return invoice.status !== 'paid';
    if (viewMode === 'cobradas') return invoice.status === 'paid';
    return true;
  });

  const totalPorCobrar = invoices.reduce((acc, item) => acc + item.balance, 0);
  const totalVencidas = invoices.filter(item => item.status === 'overdue').length;
  const totalCobrado = invoices.reduce((acc, item) => acc + item.paid_amount, 0);

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando cuentas por cobrar...</Text>
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
                CXC-1 · Cuentas por Cobrar
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                Invierno 2026-2027
              </Badge>
            </Group>
            <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
              Control de Clientes
            </Text>
            <Text size="sm" style={{ opacity: 0.8 }}>
              A quién le facturaste, qué te deben y cuándo cae
            </Text>
          </Stack>
          <Group gap="xl">
            <Group gap="sm">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                <IconCurrencyDollar size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>${totalPorCobrar.toLocaleString()}</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Por cobrar</Text>
              </Stack>
            </Group>
            <RingProgress
              size={80}
              thickness={8}
              sections={[{ value: invoices.length > 0 ? (invoices.filter(i => i.status === 'paid').length / invoices.length) * 100 : 0, color: '#FFFFFF' }]}
              label={
                <Text size="xs" fw={700} ta="center" style={{ color: '#FFFFFF' }}>
                  {Math.round(invoices.length > 0 ? (invoices.filter(i => i.status === 'paid').length / invoices.length) * 100 : 0)}%
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
                  Por Cobrar
                </Text>
                <Text size="xl" fw={800} c="#1F5C3A">${totalPorCobrar.toLocaleString()}</Text>
                <Group gap={4}>
                  <IconArrowUpRight size={12} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>+2 facturas a PF</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconFileInvoice size={20} stroke={2} />
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
                  Vencidas
                </Text>
                <Text size="xl" fw={800} c="#C0392B">{totalVencidas}</Text>
                <Group gap={4}>
                  <IconAlertCircle size={12} color="#C0392B" />
                  <Text size="xs" c="#C0392B" fw={600}>Requieren atención</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C0392B' }}>
                <IconClock size={20} stroke={2} />
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
                  Por Facturar
                </Text>
                <Text size="xl" fw={800} c="#C08412">${settlements.filter(s => s.status === 'pending').reduce((acc, s) => acc + s.total_amount, 0).toLocaleString()}</Text>
                <Group gap={4}>
                  <IconAlertCircle size={12} color="#C08412" />
                  <Text size="xs" c="#C08412" fw={600}>{settlements.filter(s => s.status === 'pending').length} liquidaciones pendientes</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                <IconReceipt size={20} stroke={2} />
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
                  Cobrado Nov
                </Text>
                <Text size="xl" fw={800} c="#1F5C3A">${totalCobrado.toLocaleString()}</Text>
                <Group gap={4}>
                  <IconTrendingUp size={12} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>3 liquidaciones</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconBuildingBank size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>
      </SimpleGrid>

      {/* Emitir Factura */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconReceipt size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Emitir Factura</Text>
                <Text size="xs" c="dimmed">Liquidaciones → CFDI con un clic</Text>
              </Stack>
            </Group>
            <Badge variant="light" color="green" radius="sm">
              <Group gap={4}>
                <IconCheck size={12} />
                {settlements.filter(s => s.status === 'pending').length} pendientes
              </Group>
            </Badge>
          </Group>

          <Divider mb="lg" />

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                    <Group gap="4">
                      <IconFileInvoice size={14} />
                      Origen
                    </Group>
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                    <Group gap="4">
                      <IconUsers size={14} />
                      Concepto
                    </Group>
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">
                    <Group gap="4" justify="flex-end">
                      <IconCurrencyDollar size={14} />
                      Monto
                    </Group>
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                    <Group gap="4">
                      <IconReceipt size={14} />
                      Factura
                    </Group>
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">
                    Acción
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {settlements.filter(s => s.status === 'pending').length > 0 ? (
                  settlements.filter(s => s.status === 'pending').map((settlement) => {
                    const customer = customers.find(c => c.id === settlement.customer_id);
                    return (
                      <Table.Tr key={settlement.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                        <Table.Td>
                          <Badge variant="light" color="teal" size="sm" radius="sm">
                            {settlement.code}
                          </Badge>
                        </Table.Td>
                        <Table.Td c="dimmed">{settlement.concept}</Table.Td>
                        <Table.Td ta="right" fw={700} c="#1F5C3A">${settlement.total_amount.toLocaleString()}</Table.Td>
                        <Table.Td style={{ width: '150px' }}>
                          <TextInput
                            size="xs"
                            placeholder="DV-F-XXXX"
                            styles={{ input: { backgroundColor: '#FFFDEB', fontWeight: 700, color: '#1F5C3A' } }}
                            onChange={(e) => {
                              // Actualizar el invoice_number en el estado local
                              const updated = { ...settlement, invoice_number: e.currentTarget.value };
                            }}
                          />
                        </Table.Td>
                        <Table.Td ta="center">
                          <Button
                            size="xs"
                            style={{ backgroundColor: '#1F5C3A' }}
                            leftSection={<IconSend size={12} />}
                            onClick={() => {
                              // Obtener el valor del input
                              const input = document.querySelector(`input[placeholder="DV-F-XXXX"]`) as HTMLInputElement;
                              if (input && input.value) {
                                setEmitForm({ invoice_number: input.value });
                                handleOpenEmitModal(settlement);
                              } else {
                                notifications.show({
                                  title: '⚠️ Campo requerido',
                                  message: 'Ingresa el número de factura',
                                  color: 'yellow',
                                  icon: <IconAlertCircle size={16} />,
                                });
                              }
                            }}
                          >
                            Emitir
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={5} ta="center" py="xl">
                      <Stack align="center" gap="sm">
                        <IconCheck size={40} color="#1F5C3A" opacity={0.4} />
                        <Text size="sm" c="dimmed">No hay liquidaciones pendientes</Text>
                        <Text size="xs" c="dimmed">Todas las liquidaciones han sido facturadas</Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          <Text size="xs" c="dimmed" mt="md">
            La liquidación conciliada (G-15) o el cargo intercompañía se convierten en CFDI con un clic — ese es el ingreso fiscal del rancho
          </Text>
        </Card>
      </motion.div>

      {/* Lista Maestra */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconBuildingBank size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Lista Maestra por Cobrar</Text>
                <Text size="xs" c="dimmed">{invoices.length} facturas · ${totalPorCobrar.toLocaleString()} pendiente</Text>
              </Stack>
            </Group>
            <Group>
              <TextInput
                size="xs"
                placeholder="Buscar..."
                leftSection={<IconSearch size={14} />}
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.currentTarget.value })}
                style={{ width: 200 }}
              />
              <SegmentedControl
                size="xs"
                value={viewMode}
                onChange={setViewMode}
                data={[
                  { value: 'todas', label: 'Todas' },
                  { value: 'pendientes', label: 'Pendientes' },
                  { value: 'cobradas', label: 'Cobradas' },
                ]}
                styles={{
                  root: { backgroundColor: '#F5F3EE' },
                  indicator: { backgroundColor: '#1F5C3A' },
                  label: { fontWeight: 600 },
                }}
              />
              {(filters.search || viewMode !== 'todas') && (
                <ActionIcon
                  size="sm"
                  color="gray"
                  variant="subtle"
                  onClick={handleClearFilters}
                >
                  <IconX size={14} />
                </ActionIcon>
              )}
            </Group>
          </Group>

          <Divider mb="lg" />

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ width: '40px' }}>
                    <Checkbox
                      size="xs"
                      checked={selectedInvoices.length === filteredInvoices.filter(i => i.status !== 'paid').length && filteredInvoices.filter(i => i.status !== 'paid').length > 0}
                      onChange={handleSelectAll}
                      styles={{ input: { cursor: 'pointer' } }}
                    />
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>F. Factura</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Cliente</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Factura #</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Concepto</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">Total</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">Saldo</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">Vence</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">Estatus</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((row) => {
                    const customer = customers.find(c => c.id === row.customer_id);
                    const isOverdue = row.status === 'overdue';
                    const isPaid = row.status === 'paid';

                    return (
                      <Table.Tr key={row.id} style={{
                        borderBottom: '1px solid #EFECE3',
                        backgroundColor: isOverdue ? '#FFF5F5' : 'transparent'
                      }}>
                        <Table.Td>
                          <Checkbox
                            size="xs"
                            checked={selectedInvoices.includes(row.id)}
                            onChange={() => toggleSelect(row.id)}
                            disabled={isPaid}
                            styles={{ input: { cursor: isPaid ? 'not-allowed' : 'pointer' } }}
                          />
                        </Table.Td>
                        <Table.Td c="dimmed">{new Date(row.invoice_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</Table.Td>
                        <Table.Td fw={700} c="#3A3A34">{customer?.name || 'N/A'}</Table.Td>
                        <Table.Td fw={600} c="#1F5C3A">{row.invoice_number}</Table.Td>
                        <Table.Td c="dimmed">{row.concept}</Table.Td>
                        <Table.Td ta="right" fw={600}>${row.total_amount.toLocaleString()}</Table.Td>
                        <Table.Td ta="right" fw={700} c={row.balance === 0 ? '#1F5C3A' : '#C08412'}>
                          ${row.balance.toLocaleString()}
                        </Table.Td>
                        <Table.Td ta="center">
                          <Text size="sm" fw={600} c={isOverdue ? '#C0392B' : '#3A3A34'}>
                            {new Date(row.due_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                          </Text>
                        </Table.Td>
                        <Table.Td ta="center">
                          <Badge
                            size="sm"
                            color={row.status === 'pending' ? 'blue' : row.status === 'overdue' ? 'red' : row.status === 'clarification' ? 'orange' : 'green'}
                            variant="light"
                            radius="xl"
                          >
                            {row.status === 'pending' ? 'Sin vencer' :
                             row.status === 'overdue' ? 'Vencida' :
                             row.status === 'clarification' ? 'Aclaración' : 'Cobrada'}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={9} ta="center" py="xl">
                      <Stack align="center" gap="sm">
                        <IconFileInvoice size={40} color="#9A968A" opacity={0.4} />
                        <Text size="sm" c="dimmed">
                          {filters.search ? 'No hay facturas que coincidan con la búsqueda' : 'No hay facturas en esta categoría'}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {filters.search ? 'Prueba con otro término' : 'Las facturas aparecerán aquí cuando se registren'}
                        </Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {selectedInvoices.length > 0 && (
            <Group justify="flex-end" mt="md">
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                onClick={() => setSelectedInvoices([])}
              >
                Cancelar selección
              </Button>
              <Button
                size="xs"
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={<IconCheck size={14} />}
                onClick={handleOpenPaymentModal}
              >
                Marcar como cobradas ({selectedInvoices.length})
              </Button>
            </Group>
          )}

          {filteredInvoices.length > 0 && (
            <Group justify="space-between" mt="md">
              <Text size="xs" c="dimmed">
                Mostrando {filteredInvoices.length} de {invoices.length} facturas
              </Text>
              <Group gap="xs">
                <Badge variant="light" color="blue" size="sm">
                  Seleccionadas: {selectedInvoices.length}
                </Badge>
                <Badge variant="light" color="green" size="sm">
                  Total: ${selectedInvoices.reduce((acc, id) => {
                    const inv = invoices.find(i => i.id === id);
                    return acc + (inv?.balance || 0);
                  }, 0).toLocaleString()}
                </Badge>
              </Group>
            </Group>
          )}
        </Card>
      </motion.div>

      {/* Resumen de Clientes */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group gap="sm" mb="lg">
            <IconUsers size={18} color="#1F5C3A" />
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#3A3A34">Resumen por Cliente</Text>
              <Text size="xs" c="dimmed">Distribución de saldos</Text>
            </Stack>
          </Group>

          <Divider mb="lg" />

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            {summary?.byCustomer?.length > 0 ? (
              summary.byCustomer.map((item, idx) => {
                const colors = ['#1F5C3A', '#2A6A8A', '#C08412'];
                const color = colors[idx % colors.length];
                return (
                  <Card key={idx} p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                    <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {item.customer_name}
                    </Text>
                    <Text size="xl" fw={800} c={color}>
                      ${item.total.toLocaleString()}
                    </Text>
                    <Group gap={4} mt="xs">
                      <Badge size="xs" variant="light" color="gray" radius="sm">
                        {item.count} facturas
                      </Badge>
                      {item.count > 0 && (
                        <Badge size="xs" variant="light" color={color} radius="sm">
                          {Math.round(item.percentage)}% del total
                        </Badge>
                      )}
                    </Group>
                    {item.count > 0 && (
                      <Progress
                        value={item.percentage}
                        color={color}
                        size="sm"
                        radius="xl"
                        mt="xs"
                      />
                    )}
                  </Card>
                );
              })
            ) : (
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text ta="center" c="dimmed" size="sm">No hay datos de clientes</Text>
              </Card>
            )}
          </SimpleGrid>
        </Card>
      </motion.div>

      {/* ============================================================
          MODAL: Confirmar Cobro
      ============================================================ */}
      <Modal
        opened={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconCheck size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Confirmar Cobro</Text>
              <Text size="xs" c="dimmed">
                {selectedInvoices.length} facturas seleccionadas
              </Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        <Stack gap="md">
          <Alert
            color="green"
            variant="light"
            title="Confirmar cobro"
            icon={<IconCurrencyDollar size={16} />}
          >
            <Text size="sm">
              Vas a marcar <strong>{selectedInvoices.length}</strong> facturas como cobradas.
              <br />
              Total: <strong>${selectedInvoices.reduce((acc, id) => {
                const inv = invoices.find(i => i.id === id);
                return acc + (inv?.balance || 0);
              }, 0).toLocaleString()}</strong>
            </Text>
          </Alert>

          <TextInput
            label="Fecha de Cobro"
            type="date"
            value={paymentForm.payment_date}
            onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.currentTarget.value })}
          />

          <Select
            label="Método de Pago"
            value={paymentForm.payment_method}
            onChange={(value) => setPaymentForm({ ...paymentForm, payment_method: value || 'transfer' })}
            data={[
              { value: 'transfer', label: 'Transferencia' },
              { value: 'cash', label: 'Efectivo' },
              { value: 'check', label: 'Cheque' },
            ]}
          />

          <TextInput
            label="Referencia Bancaria"
            placeholder="Ej: BBVA ****2841"
            value={paymentForm.bank_reference}
            onChange={(e) => setPaymentForm({ ...paymentForm, bank_reference: e.currentTarget.value })}
          />

          <Divider />

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setPaymentModalOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconCheck size={16} />}
              onClick={handlePaymentSubmit}
            >
              Confirmar Cobro
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ============================================================
          MODAL: Emitir Factura
      ============================================================ */}
      <Modal
        opened={emitModalOpen}
        onClose={() => {
          setEmitModalOpen(false);
          setSelectedSettlement(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconSend size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Emitir Factura</Text>
              <Text size="xs" c="dimmed">
                {selectedSettlement?.code} - ${selectedSettlement?.total_amount?.toLocaleString()}
              </Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        <Stack gap="md">
          <Alert
            color="blue"
            variant="light"
            title="Emitir CFDI"
            icon={<IconReceipt size={16} />}
          >
            <Text size="sm">
              Vas a emitir una factura para la liquidación <strong>{selectedSettlement?.code}</strong>.
              <br />
              Monto: <strong>${selectedSettlement?.total_amount?.toLocaleString()}</strong>
            </Text>
          </Alert>

          <TextInput
            label="Número de Factura"
            placeholder="Ej: DV-F-0451"
            value={emitForm.invoice_number}
            onChange={(e) => setEmitForm({ invoice_number: e.currentTarget.value })}
            required
            autoFocus
          />

          <Divider />

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setEmitModalOpen(false);
                setSelectedSettlement(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconSend size={16} />}
              onClick={handleEmitSubmit}
            >
              Emitir Factura
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

export default GrowerAccountsReceivable;