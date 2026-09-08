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
  SegmentedControl,
  Grid,
  Card,
  ThemeIcon,
  Divider,
  Progress,
  RingProgress,
  Tooltip,
  ActionIcon,
  Modal,
  Textarea,
  Alert,
  Loader,
  Center,
  NumberInput,
  ScrollArea,
} from '@mantine/core';
import {
  IconReceiptTax,
  IconCheck,
  IconDownload,
  IconSend,
  IconCurrencyDollar,
  IconCalendarDue,
  IconBuildingBank,
  IconFileInvoice,
  IconAlertCircle,
  IconTrendingUp,
  IconTrendingDown,
  IconEye,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconPlus,
  IconArrowUpRight,
  IconArrowDownRight,
  IconX,
  IconSearch,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useAccountsPayable } from './hooks/useAccountsPayable';
import { notifications } from '@mantine/notifications';

export function GrowerAccountsPayable() {
  const {
    invoices,
    suppliers,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    registerPayment,
    conciliateSAT,
    markAsPaid,
  } = useAccountsPayable();

  const [tabState, setTabState] = useState('Por pagar');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [conciliateModalOpen, setConciliateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para pago
  const [paymentForm, setPaymentForm] = useState({
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'transfer',
    bank_reference: '',
    notes: '',
  });

  // Estado para conciliación SAT
  const [conciliateForm, setConciliateForm] = useState({
    category: '',
    purchaseOrder: '',
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
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(i => i.id));
    }
  };

  const handleOpenPaymentModal = () => {
    if (selectedInvoices.length === 0) {
      notifications.show({
        title: '⚠️ Sin selección',
        message: 'Selecciona al menos una factura para pagar',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }
    setPaymentForm({
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'transfer',
      bank_reference: '',
      notes: '',
    });
    setPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    setIsSubmitting(true);
    try {
      await markAsPaid(selectedInvoices, {
        payment_date: paymentForm.payment_date,
        payment_method: paymentForm.payment_method,
        bank_reference: paymentForm.bank_reference || undefined,
      });
      notifications.show({
        title: '✅ Pagos registrados',
        message: `${selectedInvoices.length} facturas marcadas como pagadas`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setPaymentModalOpen(false);
      setSelectedInvoices([]);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al registrar pagos',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenConciliateModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setConciliateForm({
      category: invoice.category || '',
      purchaseOrder: '',
    });
    setConciliateModalOpen(true);
  };

  const handleConciliateSubmit = async () => {
    if (!selectedInvoice) return;
    setIsSubmitting(true);
    try {
      await conciliateSAT(selectedInvoice.id, conciliateForm);
      notifications.show({
        title: '✅ Factura conciliada',
        message: `Factura ${selectedInvoice.invoice_number} conciliada con SAT`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setConciliateModalOpen(false);
      setSelectedInvoice(null);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al conciliar factura',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setTabState('Por pagar');
    setSelectedInvoices([]);
  };

  // ============================================================
  // FILTROS
  // ============================================================

  const filteredInvoices = invoices.filter((invoice) => {
    if (tabState === 'Por pagar') return invoice.status === 'pending';
    if (tabState === 'Vencidas') return invoice.status === 'overdue';
    if (tabState === 'Pagadas') return invoice.status === 'paid';
    if (tabState === 'Por vencer 7d') {
      const today = new Date();
      const dueDate = new Date(invoice.due_date);
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    }
    return true;
  });

  const totalPorPagar = invoices.reduce((acc, item) => acc + item.balance, 0);
  const totalVencidas = invoices.filter(item => item.status === 'overdue').length;
  const totalPagadas = invoices.filter(item => item.status === 'paid').length;

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando cuentas por pagar...</Text>
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
                CXP-1 · Cuentas por Pagar
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                SAT Conciliado
              </Badge>
            </Group>
            <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
              Control de Proveedores
            </Text>
            <Text size="sm" style={{ opacity: 0.8 }}>
              Tu archivo de flujo, hecho pantalla · Invierno 2026-2027
            </Text>
          </Stack>
          <Group gap="xl">
            <Group gap="sm">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                <IconCurrencyDollar size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>${totalPorPagar.toLocaleString()}</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Saldo por pagar</Text>
              </Stack>
            </Group>
            <RingProgress
              size={80}
              thickness={8}
              sections={[{ value: invoices.length > 0 ? (totalPagadas / invoices.length) * 100 : 0, color: '#FFFFFF' }]}
              label={
                <Text size="xs" fw={700} ta="center" style={{ color: '#FFFFFF' }}>
                  {Math.round(invoices.length > 0 ? (totalPagadas / invoices.length) * 100 : 0)}%
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
                  Saldo por Pagar
                </Text>
                <Text size="xl" fw={800} c="#C08412">${totalPorPagar.toLocaleString()}</Text>
                <Group gap={4}>
                  <IconTrendingDown size={12} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>-8.2% vs mes pasado</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
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
                <IconAlertCircle size={20} stroke={2} />
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
                  Pagadas
                </Text>
                <Text size="xl" fw={800} c="#1F5C3A">{totalPagadas}</Text>
                <Group gap={4}>
                  <IconCheck size={12} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>
                    {totalPagadas} de {invoices.length} facturas
                  </Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconCheck size={20} stroke={2} />
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
                  Días Promedio
                </Text>
                <Text size="xl" fw={800} c="#2A6A8A">{summary?.avgDays || 32}</Text>
                <Group gap={4}>
                  <IconTrendingUp size={12} color="#2A6A8A" />
                  <Text size="xs" c="#2A6A8A" fw={600}>-2 días vs meta</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconCalendarDue size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>
      </SimpleGrid>

      {/* SAT - Conciliación */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconDownload size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Conciliación SAT</Text>
                <Text size="xs" c="dimmed">Descarga y concilia en la misma fila</Text>
              </Stack>
            </Group>
            <Badge variant="light" color="green" radius="sm">
              <Group gap={4}>
                <IconCheck size={12} />
                {invoices.filter(i => i.is_sat_conciliated).length} conciliadas
              </Group>
            </Badge>
          </Group>

          <Divider mb="lg" />

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Factura</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Proveedor</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Concepto</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">Monto</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Categoría</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>OC</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">Estado SAT</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">Acción</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {invoices.filter(i => !i.is_sat_conciliated && i.status !== 'paid').slice(0, 5).map((row) => {
                  const supplier = suppliers.find(s => s.id === row.supplier_id);
                  return (
                    <Table.Tr key={row.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                      <Table.Td fw={700} c="#1F5C3A">{row.invoice_number}</Table.Td>
                      <Table.Td fw={600} c="#3A3A34">{supplier?.name || 'N/A'}</Table.Td>
                      <Table.Td c="dimmed">{row.concept}</Table.Td>
                      <Table.Td ta="right" fw={700}>${row.total_amount.toLocaleString()}</Table.Td>
                      <Table.Td style={{ width: '150px' }}>
                        <Select
                          size="xs"
                          placeholder="Seleccionar"
                          value={row.category || ''}
                          data={[
                            'FERTILIZANTES',
                            'COSTO FIJO',
                            'AGROQUÍMICOS',
                            'COMBUSTIBLE',
                            'SERVICIOS',
                            'REFRACCIONES',
                            'OTROS',
                          ]}
                          onChange={(value) => {
                            const invoice = invoices.find(i => i.id === row.id);
                            if (invoice) {
                              conciliateSAT(row.id, { category: value || '', purchaseOrder: row.purchase_order_id || '' });
                            }
                          }}
                          styles={{ input: { backgroundColor: '#FFFDEB', fontWeight: 600 } }}
                        />
                      </Table.Td>
                      <Table.Td style={{ width: '180px' }}>
                        <Select
                          size="xs"
                          placeholder="Seleccionar OC"
                          data={[
                            'OC-0148 - $78,000',
                            'OC-0150 - $45,000',
                            'Sin OC · directo',
                          ]}
                          styles={{ input: { backgroundColor: '#FFFDEB' } }}
                        />
                      </Table.Td>
                      <Table.Td ta="center">
                        <Badge color="orange" variant="light" size="sm">
                          Pendiente
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Button
                          size="xs"
                          style={{ backgroundColor: '#1F5C3A' }}
                          leftSection={<IconCheck size={12} />}
                          onClick={() => handleOpenConciliateModal(row)}
                        >
                          Conciliar
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
                {invoices.filter(i => !i.is_sat_conciliated && i.status !== 'paid').length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={8} ta="center" py="xl">
                      <Stack align="center" gap="sm">
                        <IconCheck size={40} color="#1F5C3A" opacity={0.4} />
                        <Text size="sm" c="dimmed">Todas las facturas están conciliadas</Text>
                        <Text size="xs" c="dimmed">¡Excelente trabajo!</Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          <Text size="xs" c="dimmed" mt="md">
            Los XML llegan solos · si hay OC se preselecciona por proveedor+monto, si no, solo eliges categoría — un clic por factura
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
                <Text size="sm" fw={700} c="#3A3A34">Lista Maestra</Text>
                <Text size="xs" c="dimmed">Tu archivo hecho pantalla · {invoices.length} facturas</Text>
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
                value={tabState}
                onChange={setTabState}
                data={['Por pagar', 'Vencidas', 'Por vencer 7d', 'Pagadas', 'Todas']}
                styles={{
                  root: { backgroundColor: '#F5F3EE' },
                  indicator: { backgroundColor: '#1F5C3A' },
                  label: { fontWeight: 600 },
                }}
              />
              {(filters.search || tabState !== 'Por pagar') && (
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
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Proveedor</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Factura #</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Concepto</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">Total</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">Saldo</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">Crédito</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Vence</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">Estatus</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((row) => {
                    const supplier = suppliers.find(s => s.id === row.supplier_id);
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
                        <Table.Td fw={600} c="#3A3A34">{supplier?.name || 'N/A'}</Table.Td>
                        <Table.Td fw={700} c="#1F5C3A">{row.invoice_number}</Table.Td>
                        <Table.Td c="dimmed">{row.concept}</Table.Td>
                        <Table.Td ta="right" fw={600}>${row.total_amount.toLocaleString()}</Table.Td>
                        <Table.Td ta="right" fw={700} c={row.balance === 0 ? '#1F5C3A' : '#C08412'}>
                          ${row.balance.toLocaleString()}
                        </Table.Td>
                        <Table.Td ta="center">
                          <Badge variant="outline" color="gray" size="sm" radius="sm">
                            {row.credit_terms || 'N/A'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={600} c={isOverdue ? '#C0392B' : '#3A3A34'}>
                            {new Date(row.due_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </Text>
                        </Table.Td>
                        <Table.Td ta="center">
                          <Badge
                            size="sm"
                            color={row.status === 'pending' ? 'blue' : row.status === 'overdue' ? 'red' : row.status === 'paid' ? 'green' : 'yellow'}
                            variant="light"
                            radius="xl"
                          >
                            {row.status === 'pending' ? 'Sin vencer' :
                             row.status === 'overdue' ? 'Vencida' :
                             row.status === 'paid' ? 'Pagada' : 'Parcial'}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={10} ta="center" py="xl">
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

      {/* Marcar Pagadas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group gap="sm" mb="lg">
            <IconCheck size={18} color="#1F5C3A" />
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#3A3A34">Marcar como Pagadas</Text>
              <Text size="xs" c="dimmed">Selecciona facturas y regístralas como pagadas</Text>
            </Stack>
          </Group>

          <Divider mb="lg" />

          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Seleccionadas"
                size="xs"
                value={`${selectedInvoices.length} facturas · $${selectedInvoices.length > 0 ? 
                  filteredInvoices.filter(i => selectedInvoices.includes(i.id))
                    .reduce((acc, i) => acc + i.balance, 0)
                    .toLocaleString() : '0'
                }`}
                readOnly
                styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Fecha de Pago"
                size="xs"
                type="date"
                value={paymentForm.payment_date}
                onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.currentTarget.value })}
                styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Método de Pago"
                size="xs"
                value={paymentForm.payment_method}
                onChange={(value) => setPaymentForm({ ...paymentForm, payment_method: value || 'transfer' })}
                data={[
                  { value: 'transfer', label: 'Transferencia' },
                  { value: 'cash', label: 'Efectivo' },
                  { value: 'check', label: 'Cheque' },
                ]}
                styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
              />
            </Grid.Col>
          </Grid>

          <Button
            fullWidth
            mt="md"
            style={{ backgroundColor: '#1F5C3A' }}
            leftSection={<IconCheck size={16} />}
            disabled={selectedInvoices.length === 0}
            onClick={handleOpenPaymentModal}
          >
            Marcar como Pagadas ({selectedInvoices.length} facturas)
          </Button>

          <Text size="xs" c="dimmed" mt="md">
            Seleccionas, pones la fecha, listo — el ERP no dispersa: controla
          </Text>
        </Card>
      </motion.div>

      {/* ============================================================
          MODAL: Confirmar Pago
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
              <Text size="sm" fw={700}>Confirmar Pago</Text>
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
            title="Confirmar pago"
            icon={<IconCurrencyDollar size={16} />}
          >
            <Text size="sm">
              Vas a marcar <strong>{selectedInvoices.length}</strong> facturas como pagadas.
              <br />
              Total: <strong>${selectedInvoices.reduce((acc, id) => {
                const inv = invoices.find(i => i.id === id);
                return acc + (inv?.balance || 0);
              }, 0).toLocaleString()}</strong>
            </Text>
          </Alert>

          <TextInput
            label="Referencia Bancaria"
            placeholder="Ej: BBVA ****2841"
            value={paymentForm.bank_reference}
            onChange={(e) => setPaymentForm({ ...paymentForm, bank_reference: e.currentTarget.value })}
          />

          <Textarea
            label="Notas"
            placeholder="Notas adicionales sobre el pago"
            value={paymentForm.notes}
            onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.currentTarget.value })}
            rows={2}
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
              Confirmar Pago
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ============================================================
          MODAL: Conciliar SAT
      ============================================================ */}
      <Modal
        opened={conciliateModalOpen}
        onClose={() => {
          setConciliateModalOpen(false);
          setSelectedInvoice(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconDownload size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Conciliar con SAT</Text>
              <Text size="xs" c="dimmed">
                {selectedInvoice?.invoice_number} - {selectedInvoice?.concept}
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
            title="Conciliación SAT"
            icon={<IconReceiptTax size={16} />}
          >
            <Text size="sm">
              Asigna categoría y OC para conciliar esta factura con el SAT.
            </Text>
          </Alert>

          <Select
            label="Categoría"
            placeholder="Seleccionar categoría"
            value={conciliateForm.category}
            onChange={(value) => setConciliateForm({ ...conciliateForm, category: value || '' })}
            data={[
              { value: 'FERTILIZANTES', label: 'Fertilizantes' },
              { value: 'COSTO FIJO', label: 'Costo Fijo' },
              { value: 'AGROQUÍMICOS', label: 'Agroquímicos' },
              { value: 'COMBUSTIBLE', label: 'Combustible' },
              { value: 'SERVICIOS', label: 'Servicios' },
              { value: 'REFRACCIONES', label: 'Refacciones' },
              { value: 'OTROS', label: 'Otros' },
            ]}
            required
          />

          <Select
            label="Orden de Compra"
            placeholder="Seleccionar OC"
            value={conciliateForm.purchaseOrder}
            onChange={(value) => setConciliateForm({ ...conciliateForm, purchaseOrder: value || '' })}
            data={[
              { value: 'OC-0148 - $78,000', label: 'OC-0148 - $78,000' },
              { value: 'OC-0150 - $45,000', label: 'OC-0150 - $45,000' },
              { value: 'Sin OC · directo', label: 'Sin OC · directo' },
            ]}
          />

          <Divider />

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setConciliateModalOpen(false);
                setSelectedInvoice(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconCheck size={16} />}
              onClick={handleConciliateSubmit}
            >
              Conciliar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

export default GrowerAccountsPayable;