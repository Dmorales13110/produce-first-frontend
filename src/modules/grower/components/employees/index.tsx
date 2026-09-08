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
  SegmentedControl,
  ActionIcon,
  ThemeIcon,
  Divider,
  Progress,
  RingProgress,
  Tooltip,
  Avatar,
  Modal,
  NumberInput,
  Textarea,
  Alert,
  Loader,
  Center,
  ScrollArea,
  Menu,
} from '@mantine/core';
import {
  IconUserPlus,
  IconTrophy,
  IconAlertCircle,
  IconCheck,
  IconSearch,
  IconUsers,
  IconUser,
  IconCalendar,
  IconClock,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowDownRight,
  IconCurrencyDollar,
  IconChartBar,
  IconEye,
  IconRefresh,
  IconDownload,
  IconGauge,
  IconBuilding,
  IconReport,
  IconFileAnalytics,
  IconEdit,
  IconTrash,
  IconFilter,
  IconDotsVertical,
  IconFileExport,
  IconPrinter,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useEmployees } from './hooks/useEmployees';
import { notifications } from '@mantine/notifications';

export function GrowerEmployees() {
  const {
    employees,
    ranking,
    rates,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updateRate,
  } = useEmployees();

  const [filterTipo, setFilterTipo] = useState('Activos');
  const [viewMode, setViewMode] = useState('plantilla');
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [editEmployeeModalOpen, setEditEmployeeModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para formulario de empleado
  const [employeeForm, setEmployeeForm] = useState({
    code: '',
    full_name: '',
    position: '',
    employee_type: 'Eventual',
    salary: 0,
    has_file: false,
    status: 'activo',
    seniority: '',
    phone: '',
    email: '',
    notes: '',
  });

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleRefresh = async () => {
    await refresh();
    notifications.show({
      title: 'Datos actualizados',
      message: 'La lista de empleados ha sido actualizada',
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

  const handleOpenCreateEmployee = () => {
    setEmployeeForm({
      code: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      full_name: '',
      position: '',
      employee_type: 'Eventual',
      salary: 0,
      has_file: false,
      status: 'activo',
      seniority: '',
      phone: '',
      email: '',
      notes: '',
    });
    setEmployeeModalOpen(true);
  };

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setEmployeeForm({
      code: employee.code,
      full_name: employee.full_name,
      position: employee.position,
      employee_type: employee.employee_type,
      salary: employee.salary,
      has_file: employee.has_file,
      status: employee.status,
      seniority: employee.seniority || '',
      phone: employee.phone || '',
      email: employee.email || '',
      notes: employee.notes || '',
    });
    setEditEmployeeModalOpen(true);
  };

  const handleDeleteEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setDeleteModalOpen(true);
  };

  const handleCreateEmployee = async () => {
    setIsSubmitting(true);
    try {
      await createEmployee(employeeForm);
      notifications.show({
        title: '✅ Empleado creado',
        message: `${employeeForm.full_name} agregado exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setEmployeeModalOpen(false);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al crear empleado',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;
    setIsSubmitting(true);
    try {
      await updateEmployee(selectedEmployee.id, employeeForm);
      notifications.show({
        title: '✅ Empleado actualizado',
        message: `${employeeForm.full_name} actualizado exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setEditEmployeeModalOpen(false);
      setSelectedEmployee(null);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al actualizar empleado',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    setIsSubmitting(true);
    try {
      await deleteEmployee(selectedEmployee.id);
      notifications.show({
        title: '✅ Empleado eliminado',
        message: `${selectedEmployee.full_name} eliminado exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setDeleteModalOpen(false);
      setSelectedEmployee(null);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al eliminar empleado',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRate = async (id: string, field: string, value: any) => {
    try {
      await updateRate(id, { [field]: value });
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al actualizar tarifa',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  // ============================================================
  // FILTROS
  // ============================================================

  const filteredEmployees = employees.filter(emp => {
    if (filterTipo === 'Activos') return emp.status === 'activo';
    if (filterTipo === 'Inactivos') return emp.status === 'inactivo';
    return true;
  });

  // ============================================================
  // CÁLCULOS
  // ============================================================

  const totalEmpleados = employees.length;
  const activos = employees.filter(e => e.status === 'activo').length;
  const fijos = employees.filter(e => e.employee_type === 'Fijo').length;
  const eventuales = employees.filter(e => e.employee_type === 'Eventual').length;
  const attendance = summary?.attendance || '96.2%';

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando empleados...</Text>
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
    semanaActual: 48,
    fechaCorte: '27-nov-2026',
  };

  const getStatusColor = (status: string) => {
    if (status === 'activo') return 'green';
    return 'gray';
  };

  const getTypeColor = (type: string) => {
    if (type === 'Fijo') return 'teal';
    if (type === 'Capitan') return 'blue';
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
                G-20 · Empleados
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                {mockData.temporada}
              </Badge>
            </Group>
            <Group gap="sm" align="center">
              <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                Empleados y Cuadrillas
              </Text>
              <Badge size="lg" variant="light" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}>
                Semana {mockData.semanaActual}
              </Badge>
            </Group>
            <Group gap="xl" mt={2}>
              <Group gap={4}>
                <IconCalendar size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>Corte: {mockData.fechaCorte}</Text>
              </Group>
              <Group gap={4}>
                <IconUsers size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>{totalEmpleados} Empleados</Text>
              </Group>
              <Group gap={4}>
                <IconBuilding size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>2 Ranchos activos</Text>
              </Group>
            </Group>
          </Stack>

          <Group gap="xl">
            <Group gap="sm">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                <IconUsers size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>{activos}</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Activos</Text>
              </Stack>
            </Group>
            <RingProgress
              size={90}
              thickness={10}
              sections={[{ value: parseFloat(attendance), color: '#FFFFFF' }]}
              label={
                <Stack align="center" gap={0}>
                  <Text size="lg" fw={800} style={{ color: '#FFFFFF' }}>{Math.round(parseFloat(attendance))}%</Text>
                  <Text size="8px" style={{ opacity: 0.7 }}>asistencia</Text>
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Plantilla Total</Text>
                <Text size="28px" fw={800} c="#1F5C3A">{totalEmpleados}</Text>
                <Group gap={4}>
                  <IconUsers size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>{fijos} fijos · {eventuales} eventuales</Text>
                </Group>
                <Badge size="xs" color="teal" variant="light" radius="sm">Activos</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconUsers size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Fijos Activos</Text>
                <Text size="28px" fw={800} c="#2A6A8A">{fijos}</Text>
                <Group gap={4}>
                  <IconCurrencyDollar size={14} color="#2A6A8A" />
                  <Text size="xs" c="#2A6A8A" fw={600}>$1,680 - $7,500/sem</Text>
                </Group>
                <Badge size="xs" color="blue" variant="light" radius="sm">Rango salarial</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconUser size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Eventuales</Text>
                <Text size="28px" fw={800} c="#C08412">{eventuales}</Text>
                <Group gap={4}>
                  <IconTrendingUp size={14} color="#C08412" />
                  <Text size="xs" c="#C08412" fw={600}>$1,680/sem promedio</Text>
                </Group>
                <Badge size="xs" color="yellow" variant="light" radius="sm">MO Desarrollo</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                <IconTrendingUp size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Asistencia</Text>
                <Text size="28px" fw={800} c="#1F5C3A">{attendance}</Text>
                <Group gap={4}>
                  <IconClock size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>Calculada de asistencia diaria</Text>
                </Group>
                <Badge size="xs" color="green" variant="light" radius="sm">Excelente</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconCalendar size={20} stroke={2} />
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
              { value: 'plantilla', label: 'Plantilla' },
              { value: 'ranking', label: 'Ranking' },
              { value: 'tarifas', label: 'Tarifas' },
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
              Actualizado: Hoy
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
            </Menu.Dropdown>
          </Menu>
          <ActionIcon variant="light" color="teal" size="sm" radius="md" onClick={handleRefresh}>
            <IconRefresh size={16} />
          </ActionIcon>
          <ActionIcon variant="light" color="teal" size="sm" radius="md" onClick={handleExport}>
            <IconDownload size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {/* ===== PLANTILLA ===== */}
      {viewMode === 'plantilla' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '24px' }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" mb="lg">
              <Group gap="sm">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                  <IconUsers size={18} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="sm" fw={700} c="#3A3A34">Plantilla</Text>
                  <Text size="xs" c="dimmed">{filteredEmployees.length} empleados</Text>
                </Stack>
              </Group>
              <Group gap="xs">
                <TextInput
                  size="xs"
                  placeholder="Buscar..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.currentTarget.value })}
                  rightSection={<IconSearch size={14} />}
                  style={{ width: 200 }}
                />
                <Select
                  size="xs"
                  placeholder="Tipo"
                  value={filters.type || null}
                  onChange={(value) => setFilters({ ...filters, type: value || undefined })}
                  data={[
                    { value: '', label: 'Todos' },
                    { value: 'Fijo', label: 'Fijo' },
                    { value: 'Capitan', label: 'Capitán' },
                    { value: 'Eventual', label: 'Eventual' },
                  ]}
                  style={{ width: 110 }}
                  clearable
                />
                <SegmentedControl
                  size="xs"
                  value={filterTipo}
                  onChange={setFilterTipo}
                  data={['Activos', 'Inactivos', 'Todos']}
                  styles={{
                    root: { backgroundColor: '#F5F3EE' },
                    indicator: { backgroundColor: '#1F5C3A' },
                    label: { fontWeight: 600 }
                  }}
                />
                <Button
                  size="xs"
                  style={{ backgroundColor: '#1F5C3A' }}
                  leftSection={<IconPlus size={14} />}
                  onClick={handleOpenCreateEmployee}
                >
                  Agregar
                </Button>
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
                    <Table.Th style={{ width: '22%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Empleado</Table.Th>
                    <Table.Th style={{ width: '18%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Puesto</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Tipo</Table.Th>
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Sueldo</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Expediente</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Antigüedad</Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Estado</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((row, idx) => {
                      const color = row.status === 'activo' ? (row.employee_type === 'Fijo' ? '#1F5C3A' : '#2A6A8A') : '#9A968A';
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
                            <Group gap="sm" wrap="nowrap">
                              <Avatar size="sm" radius="xl" style={{ backgroundColor: `${color}20`, color: color }}>
                                {row.full_name.charAt(0)}
                              </Avatar>
                              <Text fw={600} c="#3A3A34" size="xs">{row.full_name}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text size="xs">{row.position}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge 
                              size="sm"
                              color={getTypeColor(row.employee_type)}
                              variant="light"
                              radius="sm"
                            >
                              {row.employee_type}
                            </Badge>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right' }}>
                            <Text size="xs" fw={600}>${row.salary.toLocaleString()}</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            <Badge 
                              size="sm"
                              color={row.has_file ? 'green' : 'red'}
                              variant="light"
                              radius="xl"
                            >
                              {row.has_file ? '✓' : 'X'}
                            </Badge>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            <Text size="xs" c="dimmed">{row.seniority || '—'}</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            <Badge 
                              size="sm"
                              color={getStatusColor(row.status)}
                              variant="light"
                              radius="xl"
                            >
                              {row.status}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={7} ta="center" py="xl">
                        <Stack align="center" gap="sm">
                          <IconUsers size={40} color="#9A968A" opacity={0.4} />
                          <Text size="sm" c="dimmed">
                            {filters.search ? 'No hay empleados que coincidan con la búsqueda' : 'No hay empleados registrados'}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {filters.search ? 'Prueba con otro término' : 'Agrega un empleado para comenzar'}
                          </Text>
                          {!filters.search && (
                            <Button
                              size="xs"
                              color="teal"
                              style={{ backgroundColor: '#1F5C3A' }}
                              leftSection={<IconPlus size={14} />}
                              onClick={handleOpenCreateEmployee}
                            >
                              Agregar Empleado
                            </Button>
                          )}
                        </Stack>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            <Divider my="lg" />

            <Group justify="space-between">
              <Group gap="sm">
                <Badge variant="light" color="green" radius="sm">
                  <Group gap={4}>
                    <IconCheck size={12} />
                    {employees.filter((p) => p.status === 'activo').length} activos
                  </Group>
                </Badge>
                <Badge variant="light" color="gray" radius="sm">
                  <Group gap={4}>
                    <IconAlertCircle size={12} />
                    {employees.filter((p) => p.status === 'inactivo').length} inactivos
                  </Group>
                </Badge>
              </Group>
              <Button
                size="xs"
                variant="light"
                color="teal"
                leftSection={<IconUserPlus size={14} />}
                onClick={handleOpenCreateEmployee}
              >
                Agregar Empleado
              </Button>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ===== RANKING ===== */}
      {viewMode === 'ranking' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ marginBottom: '24px' }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group gap="sm" mb="lg">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                <IconTrophy size={18} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Ranking de Cosechadores</Text>
                <Text size="xs" c="dimmed">El campeón por producto · Nace de la boleta de destajo (G-7)</Text>
              </Stack>
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
                    <Table.Th style={{ width: '18%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Producto</Table.Th>
                    <Table.Th style={{ width: '25%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Campeón</Table.Th>
                    <Table.Th style={{ width: '18%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Cuadrilla</Table.Th>
                    <Table.Th style={{ width: '13%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Cajas/día</Table.Th>
                    <Table.Th style={{ width: '13%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Objetivo</Table.Th>
                    <Table.Th style={{ width: '13%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>vs Obj.</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {ranking.length > 0 ? (
                    ranking.map((row, idx) => {
                      const colors = ['#1F5C3A', '#2A6A8A', '#C08412', '#7D3C98'];
                      const color = colors[idx % colors.length];
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
                            <Group gap="sm" wrap="nowrap">
                              <ThemeIcon size="sm" radius="xl" style={{ backgroundColor: `${color}20`, color: color, flexShrink: 0 }}>
                                <IconTrophy size={14} />
                              </ThemeIcon>
                              <Text fw={600} c="#3A3A34" size="xs">{row.product}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={700} c="#1F5C3A" size="xs">{row.champion}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="xs">{row.team}</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right' }}>
                            <Text size="xs" fw={700}>{row.boxes_per_day.toFixed(1)}</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right' }}>
                            <Text size="xs">{row.target_boxes}</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right' }}>
                            <Badge 
                              size="sm"
                              color="green"
                              variant="light"
                              radius="xl"
                            >
                              {row.vs_target}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={6} ta="center" py="xl">
                        <Stack align="center" gap="sm">
                          <IconTrophy size={40} color="#9A968A" opacity={0.4} />
                          <Text size="sm" c="dimmed">No hay datos de ranking</Text>
                          <Text size="xs" c="dimmed">Los datos aparecerán cuando haya cosechadores</Text>
                        </Stack>
                      </Table.Td>
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
                    <IconTrendingUp size={12} />
                    Promedio: +71.5% vs objetivo
                  </Group>
                </Badge>
              </Group>
              <Button size="xs" variant="subtle" color="teal" rightSection={<IconEye size={14} />}>
                Ver ranking completo
              </Button>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ===== TARIFAS ===== */}
      {viewMode === 'tarifas' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group gap="sm" mb="lg">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconCurrencyDollar size={18} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Tarifas de Cosecha</Text>
                <Text size="xs" c="dimmed">Captura · Las tarifas se editan aquí con vigencia</Text>
              </Stack>
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
                    <Table.Th style={{ width: '18%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Producto</Table.Th>
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Tarifa Destajo</Table.Th>
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Objetivo cj/día</Table.Th>
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Flete</Table.Th>
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Tarifa Total</Table.Th>
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Costo Real</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Vigencia</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rates.length > 0 ? (
                    rates.map((row, idx) => (
                      <Table.Tr 
                        key={idx} 
                        style={{ 
                          borderBottom: '1px solid #EFECE3',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <Table.Td>
                          <Text fw={600} c="#3A3A34" size="xs">{row.product}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <NumberInput
                            size="xs"
                            value={row.piece_rate}
                            onChange={(value) => handleUpdateRate(row.id, 'piece_rate', Number(value) || 0)}
                            min={0}
                            step={0.5}
                            precision={2}
                            styles={{ 
                              input: { 
                                fontWeight: 700, 
                                textAlign: 'center', 
                                backgroundColor: '#FFFDE7', 
                                borderRadius: 4,
                                width: 80,
                                margin: '0 auto'
                              } 
                            }}
                          />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <NumberInput
                            size="xs"
                            value={row.target_boxes}
                            onChange={(value) => handleUpdateRate(row.id, 'target_boxes', Number(value) || 0)}
                            min={0}
                            styles={{ 
                              input: { 
                                fontWeight: 700, 
                                textAlign: 'center', 
                                backgroundColor: '#FFFDE7', 
                                borderRadius: 4,
                                width: 70,
                                margin: '0 auto'
                              } 
                            }}
                          />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <NumberInput
                            size="xs"
                            value={row.freight}
                            onChange={(value) => handleUpdateRate(row.id, 'freight', Number(value) || 0)}
                            min={0}
                            step={0.5}
                            precision={2}
                            styles={{ 
                              input: { 
                                fontWeight: 700, 
                                textAlign: 'center', 
                                backgroundColor: '#FFFDE7', 
                                borderRadius: 4,
                                width: 70,
                                margin: '0 auto'
                              } 
                            }}
                          />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Text size="xs" fw={700} c="#1F5C3A">${row.total_rate.toFixed(2)}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Text size="xs" c="dimmed">{row.actual_cost}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge size="sm" variant="outline" color="gray" radius="sm">
                            {row.validity_date ? new Date(row.validity_date).toLocaleDateString('es-MX', { month: 'short', year: '2-digit' }) : 'N/A'}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={7} ta="center" py="xl">
                        <Stack align="center" gap="sm">
                          <IconCurrencyDollar size={40} color="#9A968A" opacity={0.4} />
                          <Text size="sm" c="dimmed">No hay tarifas configuradas</Text>
                          <Text size="xs" c="dimmed">Las tarifas aparecerán aquí cuando se configuren</Text>
                        </Stack>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            <Divider my="lg" />

            <Group justify="space-between">
              <Group gap="sm">
                <Badge variant="light" color="yellow" radius="sm">
                  <Group gap={4}>
                    <IconEdit size={12} />
                    Campos en amarillo son editables
                  </Group>
                </Badge>
              </Group>
              <Group gap="sm">
                <Text size="xs" c="dimmed">
                  Aplican a boletas nuevas
                </Text>
              </Group>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ============================================================
          MODAL: Crear Empleado
      ============================================================ */}
      <Modal
        opened={employeeModalOpen}
        onClose={() => {
          setEmployeeModalOpen(false);
          setEmployeeForm({
            code: '',
            full_name: '',
            position: '',
            employee_type: 'Eventual',
            salary: 0,
            has_file: false,
            status: 'activo',
            seniority: '',
            phone: '',
            email: '',
            notes: '',
          });
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconUserPlus size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Agregar Empleado</Text>
              <Text size="xs" c="dimmed">Registrar un nuevo empleado en la plantilla</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreateEmployee(); }}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Código"
                  value={employeeForm.code}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, code: e.currentTarget.value })}
                  required
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Nombre Completo"
                  placeholder="Ej: Juan Pérez"
                  value={employeeForm.full_name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, full_name: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Puesto"
                  placeholder="Ej: Tractorista A"
                  value={employeeForm.position}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Tipo"
                  value={employeeForm.employee_type}
                  onChange={(value) => setEmployeeForm({ ...employeeForm, employee_type: value || 'Eventual' })}
                  data={[
                    { value: 'Fijo', label: 'Fijo' },
                    { value: 'Capitan', label: 'Capitán' },
                    { value: 'Eventual', label: 'Eventual' },
                  ]}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={4}>
                <NumberInput
                  label="Sueldo Semanal"
                  placeholder="0"
                  value={employeeForm.salary}
                  onChange={(value) => setEmployeeForm({ ...employeeForm, salary: Number(value) || 0 })}
                  min={0}
                  step={100}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Antigüedad"
                  placeholder="Ej: 3 años"
                  value={employeeForm.seniority}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, seniority: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Estado"
                  value={employeeForm.status}
                  onChange={(value) => setEmployeeForm({ ...employeeForm, status: value || 'activo' })}
                  data={[
                    { value: 'activo', label: 'Activo' },
                    { value: 'inactivo', label: 'Inactivo' },
                  ]}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Teléfono"
                  placeholder="Ej: 555-123-4567"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Email"
                  placeholder="ejemplo@correo.com"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.currentTarget.value })}
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Notas"
              placeholder="Notas adicionales sobre el empleado"
              value={employeeForm.notes}
              onChange={(e) => setEmployeeForm({ ...employeeForm, notes: e.currentTarget.value })}
              rows={2}
            />

            <Divider />

            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setEmployeeModalOpen(false);
                  setEmployeeForm({
                    code: '',
                    full_name: '',
                    position: '',
                    employee_type: 'Eventual',
                    salary: 0,
                    has_file: false,
                    status: 'activo',
                    seniority: '',
                    phone: '',
                    email: '',
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
                Agregar Empleado
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* ============================================================
          MODAL: Editar Empleado
      ============================================================ */}
      <Modal
        opened={editEmployeeModalOpen}
        onClose={() => {
          setEditEmployeeModalOpen(false);
          setSelectedEmployee(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconEdit size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Editar Empleado</Text>
              <Text size="xs" c="dimmed">{selectedEmployee?.full_name}</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateEmployee(); }}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Código"
                  value={employeeForm.code}
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Nombre Completo"
                  value={employeeForm.full_name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, full_name: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Puesto"
                  value={employeeForm.position}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.currentTarget.value })}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Tipo"
                  value={employeeForm.employee_type}
                  onChange={(value) => setEmployeeForm({ ...employeeForm, employee_type: value || 'Eventual' })}
                  data={[
                    { value: 'Fijo', label: 'Fijo' },
                    { value: 'Capitan', label: 'Capitán' },
                    { value: 'Eventual', label: 'Eventual' },
                  ]}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={4}>
                <NumberInput
                  label="Sueldo Semanal"
                  value={employeeForm.salary}
                  onChange={(value) => setEmployeeForm({ ...employeeForm, salary: Number(value) || 0 })}
                  min={0}
                  step={100}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Antigüedad"
                  value={employeeForm.seniority}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, seniority: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Estado"
                  value={employeeForm.status}
                  onChange={(value) => setEmployeeForm({ ...employeeForm, status: value || 'activo' })}
                  data={[
                    { value: 'activo', label: 'Activo' },
                    { value: 'inactivo', label: 'Inactivo' },
                  ]}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Teléfono"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.currentTarget.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.currentTarget.value })}
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Notas"
              value={employeeForm.notes}
              onChange={(e) => setEmployeeForm({ ...employeeForm, notes: e.currentTarget.value })}
              rows={2}
            />

            <Divider />

            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setEditEmployeeModalOpen(false);
                  setSelectedEmployee(null);
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
                Actualizar Empleado
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
          setSelectedEmployee(null);
        }}
        title="Eliminar Empleado"
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
              Vas a eliminar al empleado <strong>{selectedEmployee?.full_name}</strong>.
              Esta acción no se puede deshacer.
            </Text>
          </Alert>

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedEmployee(null);
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
              Eliminar Empleado
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

export default GrowerEmployees;