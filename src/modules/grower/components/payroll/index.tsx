import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Paper,
  Text,
  Group,
  Stack,
  Table,
  Button,
  Grid,
  Card,
  ThemeIcon,
  Divider,
  Progress,
  RingProgress,
  Badge,
  Tooltip,
  ActionIcon,
  SegmentedControl,
  Modal,
  Textarea,
  Alert,
  Loader,
  Center,
  ScrollArea,
  Select,
  NumberInput,
} from '@mantine/core';
import {
  IconUsersGroup,
  IconCheck,
  IconChartPie,
  IconCalendar,
  IconClock,
  IconUser,
  IconUsers,
  IconCurrencyDollar,
  IconArrowUpRight,
  IconArrowDownRight,
  IconBuildingBank,
  IconFileInvoice,
  IconEye,
  IconEdit,
  IconRefresh,
  IconSend,
  IconAlertCircle,
  IconTrendingUp,
  IconTrash,
  IconPlus,
  IconX,
  IconSearch,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { usePayroll } from './hooks/usePayroll';
import { notifications } from '@mantine/notifications';

export function GrowerWeeklyPayroll() {
  const {
    payroll,
    teams,
    workers,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    generatePayroll,
    authorizePayroll,
    markAsPaid,
  } = usePayroll();

  const [viewMode, setViewMode] = useState('semanas');
  const [selectedWeek, setSelectedWeek] = useState('48');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorizeModalOpen, setAuthorizeModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleGeneratePayroll = async () => {
    setIsSubmitting(true);
    try {
      const weekNum = parseInt(selectedWeek);
      await generatePayroll(weekNum);
      notifications.show({
        title: '✅ Nómina generada',
        message: `Nómina de la semana ${selectedWeek} generada exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al generar nómina',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAuthorizeModal = (payrollItem: any) => {
    setSelectedPayroll(payrollItem);
    setAuthorizeModalOpen(true);
  };

  const handleAuthorize = async () => {
    if (!selectedPayroll) return;
    setIsSubmitting(true);
    try {
      await authorizePayroll(selectedPayroll.id);
      notifications.show({
        title: '✅ Nómina autorizada',
        message: `Nómina de la semana ${selectedPayroll.week_number} autorizada`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      setAuthorizeModalOpen(false);
      setSelectedPayroll(null);
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al autorizar nómina',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    setIsSubmitting(true);
    try {
      await markAsPaid(id);
      notifications.show({
        title: '✅ Nómina pagada',
        message: 'La nómina ha sido marcada como pagada',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      refresh();
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al marcar como pagada',
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

  const totalPersonas = payroll.reduce((acc, item) => acc + item.total_workers, 0);
  const totalNomina = payroll.reduce((acc, item) => acc + item.total_amount, 0);
  const totalDestajo = payroll.reduce((acc, item) => acc + item.total_piecework, 0);
  const totalHoras = payroll.reduce((acc, item) => acc + item.total_hours, 0);

  // Agrupar por empresa (simulado)
  const payrollByCompany = payroll.reduce((acc, item) => {
    const team = teams.find(t => t.id === item.team_id);
    const empresa = team?.name?.includes('LE') ? 'JAV' : 'DV';
    if (!acc[empresa]) acc[empresa] = { items: [], workers: 0, amount: 0 };
    acc[empresa].items.push(item);
    acc[empresa].workers += item.total_workers;
    acc[empresa].amount += item.total_amount;
    return acc;
  }, {} as Record<string, { items: any[]; workers: number; amount: number }>);

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando nómina...</Text>
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
          color: '#FFFFFF'
        }}
      >
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Group gap="xs">
              <Badge size="xs" variant="white" color="teal" radius="sm">
                G-8 · Nómina
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                Semana {selectedWeek}
              </Badge>
            </Group>
            <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
              Nómina Semanal
            </Text>
            <Text size="sm" style={{ opacity: 0.8 }}>
              Se construye sola desde asistencia · Solo se autoriza
            </Text>
          </Stack>
          <Group gap="xl">
            <Group gap="sm">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                <IconUsers size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>{totalPersonas}</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Personas</Text>
              </Stack>
            </Group>
            <RingProgress
              size={80}
              thickness={8}
              sections={[{ value: 92, color: '#FFFFFF' }]}
              label={
                <Text size="xs" fw={700} ta="center" style={{ color: '#FFFFFF' }}>
                  92%
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
                  Nómina Semana {selectedWeek}
                </Text>
                <Text size="xl" fw={800} c="#1F5C3A">${totalNomina.toLocaleString()}</Text>
                <Group gap={4}>
                  <IconArrowUpRight size={12} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>+3.2% vs semana pasada</Text>
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
                  Personas Pagadas
                </Text>
                <Text size="xl" fw={800} c="#2A6A8A">{totalPersonas}</Text>
                <Group gap={4}>
                  <Text size="xs" c="dimmed">
                    DV {Object.entries(payrollByCompany).find(([k]) => k === 'DV')?.[1]?.workers || 0} · 
                    JAV {Object.entries(payrollByCompany).find(([k]) => k === 'JAV')?.[1]?.workers || 0}
                  </Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconUsersGroup size={20} stroke={2} />
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
                  Horas Capturadas
                </Text>
                <Text size="xl" fw={800} c="#C08412">{totalHoras.toFixed(0)}</Text>
                <Group gap={4}>
                  <IconClock size={12} color="#C08412" />
                  <Text size="xs" c="dimmed">Desde asistencia (G-21)</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                <IconClock size={20} stroke={2} />
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
                  Destajos de Cosecha
                </Text>
                <Text size="xl" fw={800} c="#1F5C3A">${totalDestajo.toLocaleString()}</Text>
                <Group gap={4}>
                  <IconTrendingUp size={12} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>Por folio cosechado</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconFileInvoice size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>
      </SimpleGrid>

      {/* Controles */}
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <SegmentedControl
            size="sm"
            value={viewMode}
            onChange={setViewMode}
            data={[
              { value: 'semanas', label: 'Semanas' },
              { value: 'quincenas', label: 'Quincenas' },
              { value: 'mes', label: 'Mes' },
            ]}
            styles={{
              root: { backgroundColor: '#F5F3EE' },
              indicator: { backgroundColor: '#1F5C3A' },
              label: { fontWeight: 600 }
            }}
          />
          <SegmentedControl
            size="xs"
            value={selectedWeek}
            onChange={setSelectedWeek}
            data={[
              { value: '46', label: 'S46' },
              { value: '47', label: 'S47' },
              { value: '48', label: 'S48' },
              { value: '49', label: 'S49' },
            ]}
            styles={{
              root: { backgroundColor: '#F5F3EE' },
              indicator: { backgroundColor: '#2A6A8A' },
              label: { fontWeight: 600 }
            }}
          />
          <Button
            size="xs"
            variant="subtle"
            color="teal"
            leftSection={<IconRefresh size={14} />}
            onClick={refresh}
          >
            Actualizar
          </Button>
          <Button
            size="xs"
            variant="outline"
            color="teal"
            leftSection={<IconPlus size={14} />}
            onClick={handleGeneratePayroll}
            loading={isSubmitting}
          >
            Generar Nómina
          </Button>
        </Group>
        <Badge variant="light" color="teal" radius="sm">
          <Group gap={4}>
            <IconCalendar size={12} />
            Corte: Viernes 27-nov-2026
          </Group>
        </Badge>
      </Group>

      {/* Prenómina */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconUsersGroup size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Prenómina Semanal</Text>
                <Text size="xs" c="dimmed">Se arma sola de la asistencia · Solo autoriza</Text>
              </Stack>
            </Group>
            <Group gap="xs">
              <Badge variant="light" color="green" radius="sm">
                <Group gap={4}>
                  <IconCheck size={12} />
                  Lista para autorizar
                </Group>
              </Badge>
            </Group>
          </Group>

          <Divider mb="lg" />

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                    <Group gap="4">
                      <IconBuildingBank size={14} />
                      Empresa
                    </Group>
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                    <Group gap="4">
                      <IconUsersGroup size={14} />
                      Cuadrilla / Área
                    </Group>
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">
                    Personas
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">
                    Días
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">
                    Destajo
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">
                    Total Semana
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">
                    Estado
                  </Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">
                    Acciones
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {payroll.length > 0 ? (
                  payroll.map((row) => {
                    const team = teams.find(t => t.id === row.team_id);
                    const empresa = team?.name?.includes('LE') ? 'JAV' : 'DV';
                    
                    return (
                      <Table.Tr key={row.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                        <Table.Td>
                          <Badge 
                            variant="light" 
                            color={empresa === 'DV' ? 'teal' : 'blue'} 
                            size="sm" 
                            radius="sm"
                          >
                            {empresa}
                          </Badge>
                        </Table.Td>
                        <Table.Td fw={600} c="#3A3A34">{team?.name || 'N/A'}</Table.Td>
                        <Table.Td ta="right" fw={600}>{row.total_workers}</Table.Td>
                        <Table.Td ta="right">
                          <Badge variant="outline" color="gray" size="sm" radius="sm">
                            {row.total_days} días
                          </Badge>
                        </Table.Td>
                        <Table.Td ta="right" fw={600} c={row.total_piecework > 0 ? '#1F5C3A' : 'dimmed'}>
                          ${row.total_piecework.toLocaleString()}
                        </Table.Td>
                        <Table.Td ta="right" fw={700} c="#1F5C3A">${row.total_amount.toLocaleString()}</Table.Td>
                        <Table.Td ta="center">
                          <Badge
                            size="sm"
                            color={row.status === 'draft' ? 'gray' : row.status === 'ready' ? 'blue' : row.status === 'authorized' ? 'green' : 'teal'}
                            variant="light"
                            radius="xl"
                          >
                            {row.status === 'draft' ? 'Borrador' : 
                             row.status === 'ready' ? 'Lista' : 
                             row.status === 'authorized' ? 'Autorizada' : 'Pagada'}
                          </Badge>
                        </Table.Td>
                        <Table.Td ta="center">
                          <Group gap="xs" justify="center">
                            {row.status === 'ready' && (
                              <Button
                                size="xs"
                                color="teal"
                                style={{ backgroundColor: '#1F5C3A' }}
                                leftSection={<IconSend size={12} />}
                                onClick={() => handleOpenAuthorizeModal(row)}
                              >
                                Autorizar
                              </Button>
                            )}
                            {row.status === 'authorized' && (
                              <Button
                                size="xs"
                                color="teal"
                                variant="outline"
                                leftSection={<IconCheck size={12} />}
                                onClick={() => handleMarkAsPaid(row.id)}
                              >
                                Pagar
                              </Button>
                            )}
                            {row.status === 'paid' && (
                              <Badge color="green" variant="light" size="sm">
                                Pagada
                              </Badge>
                            )}
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={8} ta="center" py="xl">
                      <Stack align="center" gap="sm">
                        <IconUsersGroup size={40} color="#9A968A" opacity={0.4} />
                        <Text size="sm" c="dimmed">No hay nómina para esta semana</Text>
                        <Text size="xs" c="dimmed">Genera una nueva nómina para comenzar</Text>
                        <Button
                          size="xs"
                          color="teal"
                          style={{ backgroundColor: '#1F5C3A' }}
                          leftSection={<IconPlus size={14} />}
                          onClick={handleGeneratePayroll}
                          loading={isSubmitting}
                        >
                          Generar Nómina
                        </Button>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          <Divider my="lg" />

          <Stack gap="md">
            <Box p="md" style={{ backgroundColor: 'rgba(31, 92, 58, 0.04)', borderRadius: '8px', borderLeft: '3px solid #1F5C3A' }}>
              <Group gap="xs">
                <IconAlertCircle size={14} color="#1F5C3A" />
                <Text size="xs" c="#1F5C3A" style={{ lineHeight: 1.5 }}>
                  <strong>Al guardar:</strong> El costo cae a Mano de obra por rancho, prorrateado a sectores por horas. 
                  Dispersión el viernes. IMSS se provisiona a su categoría.
                </Text>
              </Group>
            </Box>
          </Stack>
        </Card>
      </motion.div>

      {/* Resumen de Distribución */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group gap="sm" mb="lg">
            <IconChartPie size={18} color="#1F5C3A" />
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#3A3A34">Distribución de Nómina</Text>
              <Text size="xs" c="dimmed">Por empresa y tipo</Text>
            </Stack>
          </Group>

          <Divider mb="lg" />

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Daily Veggies
              </Text>
              <Text size="xl" fw={800} c="#1F5C3A">
                ${(Object.entries(payrollByCompany).find(([k]) => k === 'DV')?.[1]?.amount || 0).toLocaleString()}
              </Text>
              <Group gap={4} mt="xs">
                <Badge size="xs" color="teal" variant="light">
                  {Object.entries(payrollByCompany).find(([k]) => k === 'DV')?.[1]?.workers || 0} personas
                </Badge>
              </Group>
              <Progress 
                value={totalNomina > 0 ? ((Object.entries(payrollByCompany).find(([k]) => k === 'DV')?.[1]?.amount || 0) / totalNomina) * 100 : 0} 
                color="#1F5C3A" 
                size="sm" 
                radius="xl" 
                mt="xs" 
              />
            </Card>

            <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Agrícola JAV
              </Text>
              <Text size="xl" fw={800} c="#2A6A8A">
                ${(Object.entries(payrollByCompany).find(([k]) => k === 'JAV')?.[1]?.amount || 0).toLocaleString()}
              </Text>
              <Group gap={4} mt="xs">
                <Badge size="xs" color="blue" variant="light">
                  {Object.entries(payrollByCompany).find(([k]) => k === 'JAV')?.[1]?.workers || 0} personas
                </Badge>
              </Group>
              <Progress 
                value={totalNomina > 0 ? ((Object.entries(payrollByCompany).find(([k]) => k === 'JAV')?.[1]?.amount || 0) / totalNomina) * 100 : 0} 
                color="#2A6A8A" 
                size="sm" 
                radius="xl" 
                mt="xs" 
              />
            </Card>

            <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Destajo vs Salario
              </Text>
              <Text size="xl" fw={800} c="#C08412">
                {totalNomina > 0 ? Math.round((totalDestajo / totalNomina) * 100) : 0}% Destajo
              </Text>
              <Group gap={4} mt="xs">
                <Badge size="xs" color="orange" variant="light">
                  ${totalDestajo.toLocaleString()} en destajos
                </Badge>
              </Group>
              <Progress 
                value={totalNomina > 0 ? (totalDestajo / totalNomina) * 100 : 0} 
                color="#C08412" 
                size="sm" 
                radius="xl" 
                mt="xs" 
              />
            </Card>
          </SimpleGrid>
        </Card>
      </motion.div>

      {/* ============================================================
          MODAL: Autorizar Nómina
      ============================================================ */}
      <Modal
        opened={authorizeModalOpen}
        onClose={() => {
          setAuthorizeModalOpen(false);
          setSelectedPayroll(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconSend size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Autorizar Nómina</Text>
              <Text size="xs" c="dimmed">
                Semana {selectedPayroll?.week_number} - ${selectedPayroll?.total_amount?.toLocaleString()}
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
            title="Confirmar autorización"
            icon={<IconAlertCircle size={16} />}
          >
            <Text size="sm">
              Vas a autorizar la nómina de la semana <strong>{selectedPayroll?.week_number}</strong>.
              <br />
              Total: <strong>${selectedPayroll?.total_amount?.toLocaleString()}</strong>
              <br />
              Personas: <strong>{selectedPayroll?.total_workers}</strong>
            </Text>
          </Alert>

          <Divider />

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setAuthorizeModalOpen(false);
                setSelectedPayroll(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconCheck size={16} />}
              onClick={handleAuthorize}
            >
              Autorizar Nómina
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

export default GrowerWeeklyPayroll;