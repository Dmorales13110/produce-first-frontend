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
  Progress,
  ThemeIcon,
  Divider,
  RingProgress,
  Tooltip,
  ActionIcon,
  SegmentedControl,
  Select,
  TextInput,
  Grid,
  Alert,
  Loader,
  Center,
  ScrollArea,
  Menu,
  Modal,
  Textarea,
  NumberInput,
  Avatar,
} from '@mantine/core';
import {
  IconCheck,
  IconClock,
  IconUserCheck,
  IconUserX,
  IconCalendar,
  IconUsers,
  IconBuilding,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowDownRight,
  IconRefresh,
  IconDownload,
  IconEye,
  IconEdit,
  IconSearch,
  IconFilter,
  IconUser,
  IconGauge,
  IconDotsVertical,
  IconFileExport,
  IconPrinter,
  IconPlus,
  IconX,
  IconAlertCircle,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useAttendance } from './hooks/useAttendance';
import { notifications } from '@mantine/notifications';

export function GrowerAttendance() {
  const {
    dailyRecords,
    weeklySummary,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    saveDaily,
    updateDaily,
    closeDay,
    today,
    weekRange,
    getWeekNumber,
  } = useAttendance();

  const [viewMode, setViewMode] = useState('diario');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para editar asistencia
  const [editForm, setEditForm] = useState({
    status: 'present',
    hours_worked: 8,
    overtime_hours: 0,
    notes: '',
  });

  // Obtener día de la semana
  const getDayName = (date: Date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
  };

  const getDayShort = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  };

  // Formatear fecha
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).replace(/\//g, '-');
  };

  const selectedDateStr = formatDate(today);
  const dayName = getDayName(today);
  const dayShort = getDayShort(today);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleRefresh = async () => {
    await refresh();
    notifications.show({
      title: 'Datos actualizados',
      message: 'La asistencia ha sido actualizada',
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

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    setEditForm({
      status: record.status,
      hours_worked: record.hours_worked || 8,
      overtime_hours: record.overtime_hours || 0,
      notes: record.notes || '',
    });
    setEditModalOpen(true);
  };

  const handleUpdateRecord = async () => {
    if (!selectedRecord) return;
    setIsSubmitting(true);
    try {
      await updateDaily(selectedRecord.id, editForm);
      notifications.show({
        title: '✅ Asistencia actualizada',
        message: 'El registro ha sido actualizado exitosamente',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setEditModalOpen(false);
      setSelectedRecord(null);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al actualizar asistencia',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDay = async () => {
    setIsSubmitting(true);
    try {
      const todayStr = today.toISOString().split('T')[0];
      await closeDay(todayStr);
      notifications.show({
        title: '✅ Lista cerrada',
        message: 'La lista del día ha sido cerrada exitosamente',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al cerrar la lista',
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

  const totalEmployees = stats?.totalEmployees || 0;
  const presentes = stats?.present || 0;
  const faltas = stats?.absent || 0;
  const horasTotales = stats?.totalHours || 0;
  const horasExtra = stats?.overtime || 0;
  const attendancePercent = stats?.attendancePercent || 0;

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando asistencia...</Text>
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

  const getStatusColor = (status: string) => {
    if (status === 'present') return 'green';
    if (status === 'absent') return 'red';
    if (status === 'vacation') return 'blue';
    if (status === 'sick') return 'yellow';
    return 'gray';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'present') return 'P';
    if (status === 'absent') return 'F';
    if (status === 'vacation') return 'V';
    if (status === 'sick') return 'E';
    return '—';
  };

  const getStatusFullLabel = (status: string) => {
    if (status === 'present') return 'Presente';
    if (status === 'absent') return 'Falta';
    if (status === 'vacation') return 'Vacaciones';
    if (status === 'sick') return 'Enfermedad';
    if (status === 'holiday') return 'Día Festivo';
    return '—';
  };

  // Obtener los días de la semana actual
  const getWeekDays = () => {
    const weekStart = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Agrupar registros por empleado para la vista semanal
  const getEmployeeWeekly = () => {
    const employeeMap = new Map();
    dailyRecords.forEach(record => {
      const empId = record.employee_id;
      if (!employeeMap.has(empId)) {
        employeeMap.set(empId, {
          employee: record.employee,
          records: {}
        });
      }
      const date = new Date(record.attendance_date);
      const dayIndex = date.getDay() - 1; // 0 = lunes
      if (dayIndex >= 0 && dayIndex < 5) {
        employeeMap.get(empId).records[dayIndex] = record;
      }
    });
    return Array.from(employeeMap.values());
  };

  const employeeWeekly = getEmployeeWeekly();

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
                G-21 · Asistencia
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                Semana {getWeekNumber()}
              </Badge>
            </Group>
            <Group gap="sm" align="center">
              <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                Asistencia Diaria
              </Text>
              <Badge size="lg" variant="light" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}>
                {selectedDateStr} · {dayName}
              </Badge>
            </Group>
            <Group gap="xl" mt={2}>
              <Group gap={4}>
                <IconCalendar size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>
                  {weekRange.dateFrom} al {weekRange.dateTo}
                </Text>
              </Group>
              <Group gap={4}>
                <IconUsers size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>{totalEmployees} Empleados</Text>
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
                <IconUserCheck size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>{presentes}</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Presentes</Text>
              </Stack>
            </Group>
            <RingProgress
              size={90}
              thickness={10}
              sections={[{ value: Math.min(attendancePercent, 100), color: '#FFFFFF' }]}
              label={
                <Stack align="center" gap={0}>
                  <Text size="lg" fw={800} style={{ color: '#FFFFFF' }}>{Math.round(attendancePercent)}%</Text>
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Presentes Hoy</Text>
                <Text size="28px" fw={800} c="#1F5C3A">{presentes} / {totalEmployees}</Text>
                <Group gap={4}>
                  <IconTrendingUp size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>{Math.round(attendancePercent)}% asistencia</Text>
                </Group>
                <Badge size="xs" color={attendancePercent >= 85 ? 'green' : 'yellow'} variant="light" radius="sm">
                  {attendancePercent >= 85 ? 'Excelente' : 'Regular'}
                </Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconUserCheck size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Horas del Día</Text>
                <Text size="28px" fw={800} c="#2A6A8A">{horasTotales.toFixed(2)}</Text>
                <Group gap={4}>
                  <IconClock size={14} color="#2A6A8A" />
                  <Text size="xs" c="#2A6A8A" fw={600}>Alimentan nómina G-8</Text>
                </Group>
                <Badge size="xs" color="blue" variant="light" radius="sm">Calculado automático</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconClock size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Faltas sin Aviso</Text>
                <Text size="28px" fw={800} c="#C0392B">{faltas}</Text>
                <Group gap={4}>
                  <IconUserX size={14} color="#C0392B" />
                  <Text size="xs" c="#C0392B" fw={600}>Requieren atención</Text>
                </Group>
                <Badge size="xs" color="red" variant="light" radius="sm">Requiere atención</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C0392B' }}>
                <IconUserX size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Horas Extra</Text>
                <Text size="28px" fw={800} c="#C08412">{horasExtra}</Text>
                <Group gap={4}>
                  <IconTrendingUp size={14} color="#C08412" />
                  <Text size="xs" c="#C08412" fw={600}>Principalmente cosecha</Text>
                </Group>
                <Badge size="xs" color="yellow" variant="light" radius="sm">+12% vs semana pasada</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                <IconGauge size={20} stroke={2} />
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
              { value: 'diario', label: 'Diario' },
              { value: 'semanal', label: 'Semanal' },
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
              Actualizado: {today.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
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

      {/* ===== VISTA DIARIA ===== */}
      {viewMode === 'diario' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" mb="lg">
              <Group gap="sm">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                  <IconUser size={18} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="sm" fw={700} c="#3A3A34">Lista de Asistencia</Text>
                  <Text size="xs" c="dimmed">{selectedDateStr} · {dayName} · El encargado marca al arranque 7:00 AM</Text>
                </Stack>
              </Group>
              <Group gap="xs">
                <TextInput 
                  size="xs" 
                  placeholder="Buscar..." 
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.currentTarget.value })}
                  rightSection={<IconSearch size={14} />} 
                  style={{ width: 150 }}
                />
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
                    <Table.Th style={{ width: '25%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                      <Group gap="4">
                        <IconUser size={14} />
                        Empleado
                      </Group>
                    </Table.Th>
                    <Table.Th style={{ width: '20%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                      <Group gap="4">
                        <IconBuilding size={14} />
                        Área
                      </Group>
                    </Table.Th>
                    <Table.Th style={{ width: '15%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                      Estado
                    </Table.Th>
                    <Table.Th style={{ width: '15%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                      Horas
                    </Table.Th>
                    <Table.Th style={{ width: '15%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                      Extra
                    </Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                      Acción
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {dailyRecords.length > 0 ? (
                    dailyRecords.map((row, idx) => {
                      const employee = row.employee || {};
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
                              <Avatar size="sm" radius="xl" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                {employee.full_name?.charAt(0) || '?'}
                              </Avatar>
                              <Text fw={600} c="#3A3A34" size="xs">{employee.full_name || 'N/A'}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Badge size="sm" variant="light" color="gray" radius="sm">
                              {employee.position || 'N/A'}
                            </Badge>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            <Badge 
                              size="sm"
                              color={getStatusColor(row.status)}
                              variant="light"
                              radius="xl"
                              style={{ minWidth: 70, justifyContent: 'center' }}
                            >
                              {getStatusFullLabel(row.status)}
                            </Badge>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            <Text size="xs" fw={600}>{row.hours_worked || 0}h</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            <Text size="xs" c="#C08412">{row.overtime_hours || 0}h</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              color="teal"
                              onClick={() => handleEditRecord(row)}
                            >
                              <IconEdit size={14} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={6} ta="center" py="xl">
                        <Stack align="center" gap="sm">
                          <IconUser size={40} color="#9A968A" opacity={0.4} />
                          <Text size="sm" c="dimmed">No hay registros de asistencia para hoy</Text>
                          <Text size="xs" c="dimmed">Los registros aparecerán aquí cuando se marque asistencia</Text>
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
                  <Text size="xs" c="dimmed">Presente</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#C0392B', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Falta</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#C08412', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Horas Extra</Text>
                </Group>
              </Group>
              <Group gap="sm">
                <Badge variant="light" color="teal" radius="sm">
                  <Group gap={4}>
                    <IconUsers size={12} />
                    {dailyRecords.length} empleados registrados
                  </Group>
                </Badge>
                <Button 
                  size="sm"
                  style={{ backgroundColor: '#1F5C3A' }}
                  leftSection={<IconCheck size={16} />}
                  onClick={handleCloseDay}
                  loading={isSubmitting}
                >
                  Cerrar Lista del Día
                </Button>
              </Group>
            </Group>

            <Divider my="lg" />

            <Box p="md" style={{ backgroundColor: 'rgba(31, 92, 58, 0.04)', borderRadius: '8px', borderLeft: '3px solid #1F5C3A' }}>
              <Group gap="xs">
                <IconClock size={14} color="#1F5C3A" />
                <Text size="xs" c="#1F5C3A" style={{ lineHeight: 1.5 }}>
                  <strong>Al guardar:</strong> Las horas alimentan la prenómina (G-8). 
                  El costo se prorratea a sectores por área automáticamente.
                </Text>
              </Group>
            </Box>
          </Card>
        </motion.div>
      )}

      {/* ===== VISTA SEMANAL ===== */}
      {viewMode === 'semanal' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group gap="sm" mb="lg">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconCalendar size={18} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Asistencia Semanal</Text>
                <Text size="xs" c="dimmed">Resumen de la semana {getWeekNumber()} · {weekRange.dateFrom} al {weekRange.dateTo}</Text>
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
                    <Table.Th style={{ width: '20%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                      <Group gap="4">
                        <IconUser size={14} />
                        Empleado
                      </Group>
                    </Table.Th>
                    <Table.Th style={{ width: '15%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                      <Group gap="4">
                        <IconBuilding size={14} />
                        Área
                      </Group>
                    </Table.Th>
                    {weekDays.map((day, idx) => (
                      <Table.Th 
                        key={idx} 
                        style={{ 
                          width: '13%', 
                          color: '#4A4A40', 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          textAlign: 'center',
                          backgroundColor: day.getDay() === today.getDay() ? '#FFFDE7' : 'transparent'
                        }}
                      >
                        {getDayShort(day)}
                        <br />
                        <Text size="8px" c="dimmed">{day.getDate()}</Text>
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {employeeWeekly.length > 0 ? (
                    employeeWeekly.map((item, idx) => {
                      const emp = item.employee || {};
                      return (
                        <Table.Tr key={idx} style={{ borderBottom: '1px solid #EFECE3' }}>
                          <Table.Td>
                            <Group gap="sm" wrap="nowrap">
                              <Avatar size="sm" radius="xl" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                {emp.full_name?.charAt(0) || '?'}
                              </Avatar>
                              <Text fw={600} c="#3A3A34" size="xs">{emp.full_name || 'N/A'}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Badge size="sm" variant="light" color="gray" radius="sm">
                              {emp.position || 'N/A'}
                            </Badge>
                          </Table.Td>
                          {weekDays.map((day, dayIdx) => {
                            const record = item.records[dayIdx];
                            const isToday = day.getDay() === today.getDay();
                            return (
                              <Table.Td 
                                key={dayIdx} 
                                style={{ 
                                  textAlign: 'center',
                                  backgroundColor: isToday ? '#FFFDE7' : 'transparent'
                                }}
                              >
                                {record ? (
                                  <Badge 
                                    size="sm"
                                    color={getStatusColor(record.status)}
                                    variant={isToday ? 'filled' : 'light'}
                                    radius="xl"
                                    style={{ minWidth: 40, justifyContent: 'center' }}
                                  >
                                    {getStatusLabel(record.status)}
                                    {record.overtime_hours > 0 && (
                                      <Text size="8px" c={isToday ? '#FFFFFF' : '#C08412'}>
                                        +{record.overtime_hours}
                                      </Text>
                                    )}
                                  </Badge>
                                ) : (
                                  <Text size="xs" c="dimmed">—</Text>
                                )}
                              </Table.Td>
                            );
                          })}
                        </Table.Tr>
                      );
                    })
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={7} ta="center" py="xl">
                        <Stack align="center" gap="sm">
                          <IconCalendar size={40} color="#9A968A" opacity={0.4} />
                          <Text size="sm" c="dimmed">No hay registros de asistencia para esta semana</Text>
                          <Text size="xs" c="dimmed">Los registros aparecerán aquí cuando se marque asistencia</Text>
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
                  <Text size="xs" c="dimmed">Presente</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#C0392B', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Falta</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#C08412', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Horas Extra</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#FFFDE7', borderRadius: 3, border: '1px solid #E8E5DC' }} />
                  <Text size="xs" c="dimmed">Hoy</Text>
                </Group>
              </Group>
              <Badge variant="light" color="teal" radius="sm">
                <Group gap={4}>
                  <IconUsers size={12} />
                  {employeeWeekly.length} empleados registrados
                </Group>
              </Badge>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ============================================================
          MODAL: Editar Asistencia
      ============================================================ */}
      <Modal
        opened={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedRecord(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconEdit size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Editar Asistencia</Text>
              <Text size="xs" c="dimmed">{selectedRecord?.employee?.full_name}</Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateRecord(); }}>
          <Stack gap="md">
            <Select
              label="Estado"
              value={editForm.status}
              onChange={(value) => setEditForm({ ...editForm, status: value || 'present' })}
              data={[
                { value: 'present', label: 'Presente' },
                { value: 'absent', label: 'Falta' },
                { value: 'vacation', label: 'Vacaciones' },
                { value: 'sick', label: 'Enfermedad' },
                { value: 'holiday', label: 'Día Festivo' },
              ]}
              required
            />

            <NumberInput
              label="Horas Trabajadas"
              value={editForm.hours_worked}
              onChange={(value) => setEditForm({ ...editForm, hours_worked: Number(value) || 0 })}
              min={0}
              step={0.5}
              precision={1}
              required
            />

            <NumberInput
              label="Horas Extra"
              value={editForm.overtime_hours}
              onChange={(value) => setEditForm({ ...editForm, overtime_hours: Number(value) || 0 })}
              min={0}
              step={0.5}
              precision={1}
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
                  setSelectedRecord(null);
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
                Actualizar Asistencia
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}

export default GrowerAttendance;