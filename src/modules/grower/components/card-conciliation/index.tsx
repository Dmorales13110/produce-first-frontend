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
  Select,
  TextInput,
  ThemeIcon,
  Divider,
  RingProgress,
  Tooltip,
  ActionIcon,
  SegmentedControl,
  Grid,
  Progress,
  Alert,
  Loader,
  Center,
  ScrollArea,
  Menu,
  Modal,
  Textarea,
  NumberInput,
  Tabs,
  Drawer,
} from '@mantine/core';
import {
  IconCreditCard,
  IconCheck,
  IconAlertCircle,
  IconCalendar,
  IconBuilding,
  IconCurrencyDollar,
  IconFileInvoice,
  IconRefresh,
  IconDownload,
  IconEye,
  IconEdit,
  IconSearch,
  IconFilter,
  IconClock,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowDownRight,
  IconUsers,
  IconReceipt,
  IconDotsVertical,
  IconFileExport,
  IconPrinter,
  IconPlus,
  IconX,
  IconReceipt2,
  IconBuildingBank,
  IconUser,
  IconTag,
  IconList,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useCardConciliation } from './hooks/useCardConciliation';
import { notifications } from '@mantine/notifications';

export function GrowerCardConciliation() {
  const {
    movements,
    imports,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    updateMovement,
    updateMovementsBatch,
    importMovements,
    registerExpense,
    registerManualExpense,
  } = useCardConciliation();

  const [viewMode, setViewMode] = useState('todos');
  const [filterEmpresa, setFilterEmpresa] = useState('Todos');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [manualExpenseModalOpen, setManualExpenseModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<any>(null);
  const [selectedMovementForExpense, setSelectedMovementForExpense] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [movementsState, setMovementsState] = useState<any[]>([]);

  // Estado para formulario de importación
  const [importForm, setImportForm] = useState({
    movements: [] as any[],
    file_name: '',
  });

  // Estado para editar movimiento
  const [editForm, setEditForm] = useState({
    empresa: '',
    category: '',
    invoice_number: '',
    status: 'por_clasificar',
    notes: '',
  });

  // Estado para formulario de gasto
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: 0,
    category: '',
    subcategory: '',
    supplier: '',
    supplier_rfc: '',
    invoice_number: '',
    payment_method: 'transfer',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
    expense_type: 'operating',
  });

  // Estado para gasto manual
  const [manualExpenseForm, setManualExpenseForm] = useState({
    description: '',
    amount: 0,
    category: '',
    subcategory: '',
    supplier: '',
    supplier_rfc: '',
    invoice_number: '',
    payment_method: 'cash',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
    expense_type: 'operating',
  });

  // Sincronizar movements con state local
  React.useEffect(() => {
    setMovementsState(movements);
  }, [movements]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleRefresh = async () => {
    await refresh();
    notifications.show({
      title: 'Datos actualizados',
      message: 'La conciliación ha sido actualizada',
      color: 'green',
      icon: <IconCheck size={16} />,
      autoClose: 2000,
    });
  };

  const handleEditMovement = (movement: any) => {
    setSelectedMovement(movement);
    setEditForm({
      empresa: movement.empresa || '',
      category: movement.category || '',
      invoice_number: movement.invoice_number || '',
      status: movement.status || 'por_clasificar',
      notes: movement.notes || '',
    });
    setEditModalOpen(true);
  };

  const handleUpdateMovement = async () => {
    if (!selectedMovement) return;
    setIsSubmitting(true);
    try {
      await updateMovement(selectedMovement.id, editForm);
      notifications.show({
        title: '✅ Movimiento actualizado',
        message: 'El movimiento ha sido actualizado exitosamente',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setEditModalOpen(false);
      setSelectedMovement(null);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al actualizar movimiento',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMovementChange = (id: string, field: string, value: string) => {
    const index = movementsState.findIndex(m => m.id === id);
    if (index !== -1) {
      const updated = [...movementsState];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'category' && value && value !== 'Pendiente') {
        updated[index].status = 'clasificado';
      }
      setMovementsState(updated);
    }
  };

  const handleSaveClassification = async () => {
    const toUpdate = movementsState.filter(m => m.status === 'clasificado' || m.status === 'por_clasificar');
    if (toUpdate.length === 0) {
      notifications.show({
        title: '⚠️ Sin cambios',
        message: 'No hay movimientos para clasificar',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />,
        autoClose: 2000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMovementsBatch(toUpdate);
      notifications.show({
        title: '✅ Clasificación guardada',
        message: `${toUpdate.length} movimientos clasificados exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al guardar clasificación',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportMovements = async () => {
    if (importForm.movements.length === 0) {
      notifications.show({
        title: '⚠️ Sin datos',
        message: 'No hay movimientos para importar',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await importMovements(importForm);
      notifications.show({
        title: '✅ Movimientos importados',
        message: `${importForm.movements.length} movimientos importados exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setImportModalOpen(false);
      setImportForm({ movements: [], file_name: '' });
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al importar movimientos',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenExpenseModal = (movement: any) => {
    setSelectedMovementForExpense(movement);
    setExpenseForm({
      description: movement.merchant || '',
      amount: movement.amount || 0,
      category: movement.category || '',
      subcategory: '',
      supplier: '',
      supplier_rfc: '',
      invoice_number: movement.invoice_number || '',
      payment_method: 'transfer',
      payment_date: new Date().toISOString().split('T')[0],
      notes: `Gasto desde movimiento: ${movement.merchant}`,
      expense_type: 'operating',
    });
    setExpenseModalOpen(true);
  };

  const handleOpenManualExpenseModal = () => {
    setManualExpenseForm({
      description: '',
      amount: 0,
      category: '',
      subcategory: '',
      supplier: '',
      supplier_rfc: '',
      invoice_number: '',
      payment_method: 'cash',
      payment_date: new Date().toISOString().split('T')[0],
      notes: '',
      expense_type: 'operating',
    });
    setManualExpenseModalOpen(true);
  };

  const handleRegisterExpense = async () => {
    if (!selectedMovementForExpense) return;
    setIsSubmitting(true);
    try {
      await registerExpense(selectedMovementForExpense.id, expenseForm);
      notifications.show({
        title: '✅ Gasto registrado',
        message: `Gasto de $${expenseForm.amount.toLocaleString()} registrado exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setExpenseModalOpen(false);
      setSelectedMovementForExpense(null);
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al registrar gasto',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterManualExpense = async () => {
    setIsSubmitting(true);
    try {
      await registerManualExpense(manualExpenseForm);
      notifications.show({
        title: '✅ Gasto manual registrado',
        message: `Gasto de $${manualExpenseForm.amount.toLocaleString()} registrado exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setManualExpenseModalOpen(false);
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al registrar gasto manual',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // FILTROS
  // ============================================================

  const filteredMovements = movementsState.filter(m => {
    if (viewMode === 'pendientes') return m.status !== 'clasificado';
    if (viewMode === 'clasificados') return m.status === 'clasificado';
    if (filterEmpresa !== 'Todos' && m.empresa !== filterEmpresa) return false;
    return true;
  });

  // ============================================================
  // CÁLCULOS CON DATOS REALES
  // ============================================================

  const totalMovements = movementsState.length || 0;
  const clasificados = movementsState.filter(m => m.status === 'clasificado').length || 0;
  const porClasificar = movementsState.filter(m => m.status === 'por_clasificar').length || 0;
  const sinComprobante = movementsState.filter(m => m.status === 'sin_comprobante').length || 0;
  const montoPorClasificar = movementsState
    .filter(m => m.status === 'por_clasificar' || m.status === 'sin_comprobante')
    .reduce((sum, m) => sum + (m.amount || 0), 0);
  const totalAmount = movementsState.reduce((sum, m) => sum + (m.amount || 0), 0);
  const clasificadosPercent = totalMovements > 0 ? (clasificados / totalMovements) * 100 : 0;

  const getEmpresasUnicas = () => {
    const empresas = new Set(movementsState.map(m => m.empresa).filter(Boolean));
    return ['Todos', ...Array.from(empresas)];
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando conciliación...</Text>
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

  const getStatusBadge = (status: string) => {
    if (status === 'clasificado') return { color: 'green', label: 'Clasificado', icon: <IconCheck size={12} /> };
    if (status === 'por_clasificar') return { color: 'yellow', label: 'Por clasificar', icon: <IconAlertCircle size={12} /> };
    return { color: 'red', label: 'Sin comprobante', icon: <IconAlertCircle size={12} /> };
  };

  const empresas = getEmpresasUnicas();

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
                G-23 · Conciliación
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                {new Date().getFullYear()}
              </Badge>
            </Group>
            <Group gap="sm" align="center">
              <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                Conciliación de Tarjeta
              </Text>
              <Badge size="lg" variant="light" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}>
                {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
              </Badge>
            </Group>
            <Group gap="xl" mt={2}>
              <Group gap={4}>
                <IconCalendar size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>
                  {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                </Text>
              </Group>
              <Group gap={4}>
                <IconCreditCard size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>{totalMovements} Movimientos</Text>
              </Group>
              <Group gap={4}>
                <IconBuilding size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>{empresas.length - 1 || 0} Empresas</Text>
              </Group>
            </Group>
          </Stack>

          <Group gap="xl">
            <Group gap="sm">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                <IconCreditCard size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>{clasificados}</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Clasificados</Text>
              </Stack>
            </Group>
            <RingProgress
              size={90}
              thickness={10}
              sections={[{ value: clasificadosPercent, color: '#FFFFFF' }]}
              label={
                <Stack align="center" gap={0}>
                  <Text size="lg" fw={800} style={{ color: '#FFFFFF' }}>{Math.round(clasificadosPercent)}%</Text>
                  <Text size="8px" style={{ opacity: 0.7 }}>completado</Text>
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Movimientos del Mes</Text>
                <Text size="28px" fw={800} c="#1F5C3A">{totalMovements}</Text>
                <Group gap={4}>
                  <IconCreditCard size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>Total de movimientos</Text>
                </Group>
                <Badge size="xs" color="teal" variant="light" radius="sm">Actualizado</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconCreditCard size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Clasificados</Text>
                <Text size="28px" fw={800} c="#2A6A8A">{clasificados} / {totalMovements}</Text>
                <Group gap={4}>
                  <IconCheck size={14} color="#2A6A8A" />
                  <Text size="xs" c="#2A6A8A" fw={600}>A su categoría</Text>
                </Group>
                <Progress value={clasificadosPercent} color="#2A6A8A" size="xs" radius="xl" mt={4} />
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconCheck size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Por Clasificar</Text>
                <Text size="28px" fw={800} c="#C08412">{porClasificar}</Text>
                <Group gap={4}>
                  <IconAlertCircle size={14} color="#C08412" />
                  <Text size="xs" c="#C08412" fw={600}>${montoPorClasificar.toLocaleString()}</Text>
                </Group>
                <Badge size="xs" color="yellow" variant="light" radius="sm">Pendiente</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                <IconAlertCircle size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Sin Comprobante</Text>
                <Text size="28px" fw={800} c="#C0392B">{sinComprobante}</Text>
                <Group gap={4}>
                  <IconFileInvoice size={14} color="#C0392B" />
                  <Text size="xs" c="#C0392B" fw={600}>Pedir ticket/factura</Text>
                </Group>
                <Badge size="xs" color="red" variant="light" radius="sm">Urgente</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C0392B' }}>
                <IconFileInvoice size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>
      </SimpleGrid>

      {/* ===== FILTROS ===== */}
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <SegmentedControl
            size="sm"
            value={viewMode}
            onChange={setViewMode}
            data={[
              { value: 'todos', label: 'Todos' },
              { value: 'pendientes', label: 'Pendientes' },
              { value: 'clasificados', label: 'Clasificados' },
            ]}
            styles={{
              root: { backgroundColor: '#F5F3EE' },
              indicator: { backgroundColor: '#1F5C3A' },
              label: { fontWeight: 600 }
            }}
          />
          <Select
            size="xs"
            value={filterEmpresa}
            onChange={(value) => setFilterEmpresa(value || 'Todos')}
            data={empresas}
            placeholder="Empresa"
            style={{ width: 140 }}
          />
          <Badge variant="light" color="teal" radius="sm">
            <Group gap={4}>
              <IconClock size={12} />
              {imports.length > 0 ? `Última importación: ${new Date(imports[0]?.import_date).toLocaleDateString('es-MX')}` : 'Sin importaciones'}
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
              <Menu.Item leftSection={<IconPrinter size={14} />} onClick={() => window.print()}>
                Imprimir reporte
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconPlus size={14} />} onClick={() => setImportModalOpen(true)}>
                Importar Estado de Cuenta
              </Menu.Item>
              <Menu.Item leftSection={<IconReceipt2 size={14} />} onClick={handleOpenManualExpenseModal}>
                Registrar Gasto Manual
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <ActionIcon variant="light" color="teal" size="sm" radius="md" onClick={handleRefresh}>
            <IconRefresh size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {/* ===== TABLA DE CLASIFICACIÓN ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconReceipt size={18} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Clasificación de Movimientos</Text>
                <Text size="xs" c="dimmed">Cada cargo a su categoría y empresa</Text>
              </Stack>
            </Group>
            <Group gap="xs">
              <Badge variant="light" color="green" radius="sm">
                <Group gap={4}>
                  <IconCheck size={12} />
                  {clasificados} clasificados
                </Group>
              </Badge>
              <Badge variant="light" color="yellow" radius="sm">
                <Group gap={4}>
                  <IconAlertCircle size={12} />
                  {porClasificar} pendientes
                </Group>
              </Badge>
            </Group>
          </Group>

          <Divider mb="lg" />

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
                  <Table.Th style={{ width: '9%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Fecha</Table.Th>
                  <Table.Th style={{ width: '16%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Comercio</Table.Th>
                  <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Monto</Table.Th>
                  <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Empresa</Table.Th>
                  <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Categoría</Table.Th>
                  <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Comprobante</Table.Th>
                  <Table.Th style={{ width: '13%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Estado</Table.Th>
                  <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Acción</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredMovements.length > 0 ? (
                  filteredMovements.map((row, idx) => {
                    const status = getStatusBadge(row.status);
                    return (
                      <Table.Tr 
                        key={idx} 
                        style={{ 
                          borderBottom: '1px solid #EFECE3',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAF9F5'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <Table.Td>
                          <Text fw={600} c="#3A3A34" size="xs">
                            {new Date(row.movement_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs">{row.merchant}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" fw={700} c="#1F5C3A">${row.amount?.toLocaleString() || '0'}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Select 
                            size="xs" 
                            value={row.empresa || ''}
                            onChange={(value) => handleMovementChange(row.id, 'empresa', value || '')}
                            data={['Daily Veggies', 'Agrícola JAV']}
                            placeholder="Empresa"
                            styles={{ 
                              input: { 
                                backgroundColor: row.status === 'por_clasificar' ? '#FFFDE7' : 'transparent',
                                fontWeight: row.empresa ? 600 : 400
                              } 
                            }}
                          />
                        </Table.Td>
                        <Table.Td>
                          <Select 
                            size="xs" 
                            value={row.category || ''}
                            onChange={(value) => handleMovementChange(row.id, 'category', value || '')}
                            data={['Mantenimiento', 'Diésel', 'Cinta / otros', 'Admin', 'FERTILIZANTES', 'AGROQUÍMICOS']}
                            placeholder="Categoría"
                            styles={{ 
                              input: { 
                                backgroundColor: row.status === 'por_clasificar' ? '#FFFDE7' : 'transparent',
                                fontWeight: row.category ? 600 : 400
                              } 
                            }}
                          />
                        </Table.Td>
                        <Table.Td>
                          <TextInput 
                            size="xs" 
                            value={row.invoice_number || ''}
                            onChange={(e) => handleMovementChange(row.id, 'invoice_number', e.currentTarget.value)}
                            placeholder="Folio SAT/Ticket"
                            styles={{ 
                              input: { 
                                backgroundColor: row.status === 'sin_comprobante' ? '#FFFDE7' : 'transparent',
                                fontWeight: row.invoice_number ? 700 : 400,
                                color: row.invoice_number ? '#1F5C3A' : '#9A968A'
                              } 
                            }}
                          />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge 
                            size="sm"
                            color={status.color}
                            variant="light"
                            radius="xl"
                            leftSection={status.icon}
                            style={{ minWidth: 100, justifyContent: 'center', cursor: 'pointer' }}
                            onClick={() => handleEditMovement(row)}
                          >
                            {status.label}
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Tooltip label="Registrar Gasto">
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              color="teal"
                              onClick={() => handleOpenExpenseModal(row)}
                              disabled={row.status === 'clasificado'}
                            >
                              <IconReceipt2 size={14} />
                            </ActionIcon>
                          </Tooltip>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={8} ta="center" py="xl">
                      <Stack align="center" gap="sm">
                        <IconReceipt size={40} color="#9A968A" opacity={0.4} />
                        <Text size="sm" c="dimmed">No hay movimientos</Text>
                        <Text size="xs" c="dimmed">Importa un estado de cuenta para comenzar</Text>
                        <Button
                          size="xs"
                          color="teal"
                          style={{ backgroundColor: '#1F5C3A' }}
                          leftSection={<IconPlus size={14} />}
                          onClick={() => setImportModalOpen(true)}
                        >
                          Importar Estado de Cuenta
                        </Button>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          <Divider my="lg" />

          <Group justify="space-between">
            <Group gap="md">
              <Group gap={4}>
                <Box style={{ width: 10, height: 10, backgroundColor: '#1F5C3A', borderRadius: 3 }} />
                <Text size="xs" c="dimmed">Clasificado</Text>
              </Group>
              <Group gap={4}>
                <Box style={{ width: 10, height: 10, backgroundColor: '#C08412', borderRadius: 3 }} />
                <Text size="xs" c="dimmed">Por clasificar</Text>
              </Group>
              <Group gap={4}>
                <Box style={{ width: 10, height: 10, backgroundColor: '#C0392B', borderRadius: 3 }} />
                <Text size="xs" c="dimmed">Sin comprobante</Text>
              </Group>
            </Group>
            <Group gap="sm">
              <Badge variant="light" color="teal" radius="sm">
                <Group gap={4}>
                  <IconCurrencyDollar size={12} />
                  Total: ${totalAmount.toLocaleString()}
                </Group>
              </Badge>
              <Button 
                size="sm"
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={<IconCheck size={16} />}
                onClick={handleSaveClassification}
                loading={isSubmitting}
                disabled={porClasificar === 0 && sinComprobante === 0}
              >
                Guardar Clasificación
              </Button>
            </Group>
          </Group>

          <Divider my="lg" />

          <Box p="md" style={{ backgroundColor: 'rgba(31, 92, 58, 0.04)', borderRadius: '8px', borderLeft: '3px solid #1F5C3A' }}>
            <Group gap="xs">
              <IconAlertCircle size={14} color="#1F5C3A" />
              <Text size="xs" c="#1F5C3A" style={{ lineHeight: 1.5 }}>
                <strong>Al guardar:</strong> Cada cargo clasificado cae a su categoría del P&L de la empresa correcta. 
                Lo que trae factura se cruza con el buzón SAT (G-9) para no contar doble.
              </Text>
            </Group>
          </Box>
        </Card>
      </motion.div>

      {/* ============================================================
          MODAL: Importar Estado de Cuenta
      ============================================================ */}
      <Modal
        opened={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
          setImportForm({ movements: [], file_name: '' });
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconPlus size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Importar Estado de Cuenta</Text>
              <Text size="xs" c="dimmed">Carga los movimientos de la tarjeta</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        <Stack gap="md">
          <Alert
            color="blue"
            variant="light"
            title="Formato esperado"
            icon={<IconFileInvoice size={16} />}
          >
            <Text size="sm">
              El archivo debe contener: Fecha, Comercio, Monto
            </Text>
          </Alert>

          <TextInput
            label="Nombre del Archivo"
            placeholder="Ej: estado_cuenta_nov2026.csv"
            value={importForm.file_name}
            onChange={(e) => setImportForm({ ...importForm, file_name: e.currentTarget.value })}
          />

          <Textarea
            label="Datos (JSON)"
            placeholder='[{"movement_date":"2026-11-24","merchant":"Refaccionaria Camacho","amount":3420}]'
            value={JSON.stringify(importForm.movements, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.currentTarget.value);
                if (Array.isArray(parsed)) {
                  setImportForm({ ...importForm, movements: parsed });
                }
              } catch {
                // Ignorar errores de parseo
              }
            }}
            rows={6}
            styles={{ input: { fontFamily: 'monospace', fontSize: '12px' } }}
          />

          <Divider />

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setImportModalOpen(false);
                setImportForm({ movements: [], file_name: '' });
              }}
            >
              Cancelar
            </Button>
            <Button
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconCheck size={16} />}
              onClick={handleImportMovements}
              loading={isSubmitting}
              disabled={importForm.movements.length === 0}
            >
              Importar {importForm.movements.length} Movimientos
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ============================================================
          MODAL: Registrar Gasto desde Movimiento
      ============================================================ */}
      <Modal
        opened={expenseModalOpen}
        onClose={() => {
          setExpenseModalOpen(false);
          setSelectedMovementForExpense(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconReceipt2 size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Registrar Gasto</Text>
              <Text size="xs" c="dimmed">{selectedMovementForExpense?.merchant}</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        <form onSubmit={(e) => { e.preventDefault(); handleRegisterExpense(); }}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={8}>
                <TextInput
                  label="Descripción"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Monto"
                  value={expenseForm.amount}
                  onChange={(value) => setExpenseForm({ ...expenseForm, amount: Number(value) || 0 })}
                  min={0}
                  step={10}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Categoría"
                  value={expenseForm.category}
                  onChange={(value) => setExpenseForm({ ...expenseForm, category: value || '' })}
                  data={[
                    'FERTILIZANTES',
                    'AGROQUÍMICOS',
                    'SEMILLA',
                    'COMBUSTIBLE',
                    'MANTENIMIENTO',
                    'SERVICIOS',
                    'OTROS',
                  ]}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Subcategoría"
                  placeholder="Ej: Urea, Diesel, etc."
                  value={expenseForm.subcategory}
                  onChange={(e) => setExpenseForm({ ...expenseForm, subcategory: e.currentTarget.value })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Proveedor"
                  placeholder="Nombre del proveedor"
                  value={expenseForm.supplier}
                  onChange={(e) => setExpenseForm({ ...expenseForm, supplier: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="RFC Proveedor"
                  placeholder="RFC del proveedor"
                  value={expenseForm.supplier_rfc}
                  onChange={(e) => setExpenseForm({ ...expenseForm, supplier_rfc: e.currentTarget.value })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Factura/Comprobante"
                  placeholder="Número de factura o ticket"
                  value={expenseForm.invoice_number}
                  onChange={(e) => setExpenseForm({ ...expenseForm, invoice_number: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Método de Pago"
                  value={expenseForm.payment_method}
                  onChange={(value) => setExpenseForm({ ...expenseForm, payment_method: value || 'transfer' })}
                  data={[
                    { value: 'transfer', label: 'Transferencia' },
                    { value: 'cash', label: 'Efectivo' },
                    { value: 'check', label: 'Cheque' },
                    { value: 'card', label: 'Tarjeta' },
                  ]}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Fecha de Pago"
                  type="date"
                  value={expenseForm.payment_date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, payment_date: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Tipo de Gasto"
                  value={expenseForm.expense_type}
                  onChange={(value) => setExpenseForm({ ...expenseForm, expense_type: value || 'operating' })}
                  data={[
                    { value: 'operating', label: 'Operativo' },
                    { value: 'capital', label: 'Capital' },
                    { value: 'administrative', label: 'Administrativo' },
                  ]}
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Notas"
              placeholder="Notas adicionales sobre el gasto"
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.currentTarget.value })}
              rows={2}
            />

            <Divider />

            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setExpenseModalOpen(false);
                  setSelectedMovementForExpense(null);
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
                Registrar Gasto
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* ============================================================
          MODAL: Registrar Gasto Manual
      ============================================================ */}
      <Modal
        opened={manualExpenseModalOpen}
        onClose={() => setManualExpenseModalOpen(false)}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconReceipt2 size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Registrar Gasto Manual</Text>
              <Text size="xs" c="dimmed">Gasto sin movimiento de tarjeta</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        <form onSubmit={(e) => { e.preventDefault(); handleRegisterManualExpense(); }}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={8}>
                <TextInput
                  label="Descripción"
                  value={manualExpenseForm.description}
                  onChange={(e) => setManualExpenseForm({ ...manualExpenseForm, description: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Monto"
                  value={manualExpenseForm.amount}
                  onChange={(value) => setManualExpenseForm({ ...manualExpenseForm, amount: Number(value) || 0 })}
                  min={0}
                  step={10}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Categoría"
                  value={manualExpenseForm.category}
                  onChange={(value) => setManualExpenseForm({ ...manualExpenseForm, category: value || '' })}
                  data={[
                    'FERTILIZANTES',
                    'AGROQUÍMICOS',
                    'SEMILLA',
                    'COMBUSTIBLE',
                    'MANTENIMIENTO',
                    'SERVICIOS',
                    'OTROS',
                  ]}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Subcategoría"
                  placeholder="Ej: Urea, Diesel, etc."
                  value={manualExpenseForm.subcategory}
                  onChange={(e) => setManualExpenseForm({ ...manualExpenseForm, subcategory: e.currentTarget.value })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Proveedor"
                  placeholder="Nombre del proveedor"
                  value={manualExpenseForm.supplier}
                  onChange={(e) => setManualExpenseForm({ ...manualExpenseForm, supplier: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="RFC Proveedor"
                  placeholder="RFC del proveedor"
                  value={manualExpenseForm.supplier_rfc}
                  onChange={(e) => setManualExpenseForm({ ...manualExpenseForm, supplier_rfc: e.currentTarget.value })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Factura/Comprobante"
                  placeholder="Número de factura o ticket"
                  value={manualExpenseForm.invoice_number}
                  onChange={(e) => setManualExpenseForm({ ...manualExpenseForm, invoice_number: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Método de Pago"
                  value={manualExpenseForm.payment_method}
                  onChange={(value) => setManualExpenseForm({ ...manualExpenseForm, payment_method: value || 'cash' })}
                  data={[
                    { value: 'transfer', label: 'Transferencia' },
                    { value: 'cash', label: 'Efectivo' },
                    { value: 'check', label: 'Cheque' },
                    { value: 'card', label: 'Tarjeta' },
                  ]}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Fecha de Pago"
                  type="date"
                  value={manualExpenseForm.payment_date}
                  onChange={(e) => setManualExpenseForm({ ...manualExpenseForm, payment_date: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Tipo de Gasto"
                  value={manualExpenseForm.expense_type}
                  onChange={(value) => setManualExpenseForm({ ...manualExpenseForm, expense_type: value || 'operating' })}
                  data={[
                    { value: 'operating', label: 'Operativo' },
                    { value: 'capital', label: 'Capital' },
                    { value: 'administrative', label: 'Administrativo' },
                  ]}
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Notas"
              placeholder="Notas adicionales sobre el gasto"
              value={manualExpenseForm.notes}
              onChange={(e) => setManualExpenseForm({ ...manualExpenseForm, notes: e.currentTarget.value })}
              rows={2}
            />

            <Divider />

            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => setManualExpenseModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={<IconCheck size={16} />}
              >
                Registrar Gasto
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* ============================================================
          MODAL: Editar Movimiento
      ============================================================ */}
      <Modal
        opened={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedMovement(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconEdit size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Editar Movimiento</Text>
              <Text size="xs" c="dimmed">{selectedMovement?.merchant}</Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateMovement(); }}>
          <Stack gap="md">
            <Select
              label="Empresa"
              value={editForm.empresa}
              onChange={(value) => setEditForm({ ...editForm, empresa: value || '' })}
              data={['Daily Veggies', 'Agrícola JAV']}
            />

            <Select
              label="Categoría"
              value={editForm.category}
              onChange={(value) => setEditForm({ ...editForm, category: value || '' })}
              data={[
                'Mantenimiento',
                'Diésel',
                'Cinta / otros',
                'Admin',
                'FERTILIZANTES',
                'AGROQUÍMICOS',
                'Pendiente',
              ]}
            />

            <TextInput
              label="Comprobante"
              placeholder="Folio SAT o ticket"
              value={editForm.invoice_number}
              onChange={(e) => setEditForm({ ...editForm, invoice_number: e.currentTarget.value })}
            />

            <Select
              label="Estado"
              value={editForm.status}
              onChange={(value) => setEditForm({ ...editForm, status: value || 'por_clasificar' })}
              data={[
                { value: 'clasificado', label: 'Clasificado' },
                { value: 'por_clasificar', label: 'Por clasificar' },
                { value: 'sin_comprobante', label: 'Sin comprobante' },
              ]}
            />

            <Textarea
              label="Notas"
              placeholder="Notas adicionales"
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.currentTarget.value })}
              rows={2}
            />

            <Divider />

            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedMovement(null);
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
                Actualizar Movimiento
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}

export default GrowerCardConciliation;