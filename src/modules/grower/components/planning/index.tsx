// src/modules/grower/GrowerPlanning.tsx
import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Card, 
  Text, 
  Group, 
  Stack, 
  Box, 
  Grid, 
  Badge, 
  SimpleGrid, 
  Title,
  ThemeIcon,
  Paper,
  Divider,
  Progress,
  SegmentedControl,
  Loader,
  Center,
  Alert,
  Button,
  Select
} from '@mantine/core';
import { 
  IconClipboardList, 
  IconCalendarStats, 
  IconArrowUpRight,
  IconCalendar,
  IconPlant,
  IconTruck,
  IconTrendingUp,
  IconChartBar,
  IconEye,
  IconRefresh,
  IconAlertCircle
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { usePlanning } from './hooks/usePlanning';

export function GrowerPlanning() {
  const [viewMode, setViewMode] = useState<'all' | 'active' | 'closed'>('all');
  const { summary, weeks, isLoading, error, refresh, setFilters } = usePlanning();

  // Preparar métricas
  const planningMetrics = useMemo(() => {
    if (!summary) return [];
    return [
      { 
        label: 'Semanas Programadas', 
        val: `${summary.semanasProgramadas} Semanas`, 
        sub: 'Ciclo Invierno 2026-2027', 
        icon: IconCalendar, 
        color: '#1F5C3A' 
      },
      { 
        label: 'Posturas Totales', 
        val: `${summary.posturasTotales} Posturas`, 
        sub: 'Planificadas en diseño inicial', 
        icon: IconPlant, 
        color: '#2A6A8A' 
      },
      { 
        label: 'Meta de Cajas Global', 
        val: `${summary.metaCajasGlobal.toLocaleString()} cj`, 
        sub: 'Estimación comercial McAllen', 
        icon: IconTruck, 
        color: '#C08412' 
      },
    ];
  }, [summary]);

  // Filtrar semanas según vista
  const filteredWeeks = useMemo(() => {
    if (viewMode === 'all') return weeks;
    if (viewMode === 'active') return weeks.filter(w => w.status === 'En Ejecución');
    if (viewMode === 'closed') return weeks.filter(w => w.status === 'Cerrada');
    return weeks;
  }, [weeks, viewMode]);

  // Manejar cambio de estado en filtros
  const handleStatusChange = (value: string | null) => {
    setFilters({ status: value as 'all' | 'active' | 'closed' || 'all' });
  };

  const getStatusColor = (status: string) => {
    if (status === 'Cerrada') return 'green';
    if (status === 'En Ejecución') return 'yellow';
    return 'gray';
  };

  const getStatusBadgeColor = (status: string) => {
    if (status === 'Cerrada') return '#E8F5E9';
    if (status === 'En Ejecución') return '#FFF8E1';
    return '#F5F3EE';
  };

  const getStatusTextColor = (status: string) => {
    if (status === 'Cerrada') return '#1F5C3A';
    if (status === 'En Ejecución') return '#C08412';
    return '#9A968A';
  };

  // ============================================================
  // ESTADOS DE CARGA Y ERROR
  // ============================================================
  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando datos de planeación...</Text>
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
            PRE-1 · Planeación
          </Text>
          <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            Cronograma de Trabajo
          </Text>
          <Text size="sm" c="dimmed">
            Planificación semanal de siembras, trasplantes y volumen estimado
          </Text>
        </Stack>
        <Group gap="sm">
          <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
            {weeks.length} Semanas
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
        </Group>
      </Group>

      {/* KPIs de Resumen */}
      {planningMetrics.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mb="xl" spacing="md">
          {planningMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={2}>
                      <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {metric.label}
                      </Text>
                      <Text size="xl" fw={800} c={metric.color}>{metric.val}</Text>
                      <Text size="xs" c="dimmed">{metric.sub}</Text>
                    </Stack>
                    <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: metric.color }}>
                      <Icon size={20} stroke={2} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </motion.div>
            );
          })}
        </SimpleGrid>
      )}

      {/* Controles */}
      <Group justify="space-between" mb="md" align="center">
        <Group gap="sm">
          <ThemeIcon size="sm" radius="md" color="teal" variant="light">
            <IconEye size={14} />
          </ThemeIcon>
          <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Vista:
          </Text>
          <Paper p={4} withBorder style={{ borderColor: '#E8E5DC', borderRadius: 8, backgroundColor: '#F5F3EE' }}>
            <Group gap={4}>
              {[
                { value: 'all', label: 'Todas' },
                { value: 'active', label: 'Activas' },
                { value: 'closed', label: 'Cerradas' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setViewMode(option.value as 'all' | 'active' | 'closed')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: viewMode === option.value ? '#1F5C3A' : 'transparent',
                    color: viewMode === option.value ? '#FFFFFF' : '#9A968A',
                    fontWeight: 600,
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </Group>
          </Paper>
        </Group>
        
        <Group gap="md">
          <Group gap={4}>
            <Box style={{ width: 10, height: 10, backgroundColor: '#1F5C3A', borderRadius: '50%' }} />
            <Text size="xs" c="dimmed">Cerrada</Text>
          </Group>
          <Group gap={4}>
            <Box style={{ width: 10, height: 10, backgroundColor: '#C08412', borderRadius: '50%' }} />
            <Text size="xs" c="dimmed">En Ejecución</Text>
          </Group>
          <Group gap={4}>
            <Box style={{ width: 10, height: 10, backgroundColor: '#9A968A', borderRadius: '50%' }} />
            <Text size="xs" c="dimmed">Pendiente</Text>
          </Group>
        </Group>
      </Group>

      {/* Tabla Principal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        key={viewMode}
      >
        <Paper 
          withBorder 
          style={{ 
            borderColor: '#E8E5DC', 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}
        >
          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead style={{ backgroundColor: '#1F5C3A' }}>
              <Table.Tr>
                <Table.Th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', padding: '14px 20px' }}>
                  <Group gap="xs">
                    <IconCalendarStats size={16} />
                    Semana
                  </Group>
                </Table.Th>
                <Table.Th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', padding: '14px 20px' }}>
                  <Group gap="xs">
                    <IconCalendar size={16} />
                    Fecha Inicio
                  </Group>
                </Table.Th>
                <Table.Th style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  textAlign: 'center',
                  padding: '14px 20px'
                }}>
                  Siembras
                </Table.Th>
                <Table.Th style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  textAlign: 'center',
                  padding: '14px 20px'
                }}>
                  Trasplantes
                </Table.Th>
                <Table.Th style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  textAlign: 'right',
                  padding: '14px 20px'
                }}>
                  Volumen Estimado
                </Table.Th>
                <Table.Th style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  textAlign: 'right',
                  padding: '14px 20px'
                }}>
                  Costo
                </Table.Th>
                <Table.Th style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  textAlign: 'center',
                  padding: '14px 20px'
                }}>
                  Avance
                </Table.Th>
                <Table.Th style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  textAlign: 'center',
                  padding: '14px 20px'
                }}>
                  Estado
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredWeeks.length > 0 ? (
                filteredWeeks.map((row, i) => (
                  <Table.Tr key={i} style={{ borderBottom: '1px solid #EFECE3' }}>
                    <Table.Td>
                      <Badge 
                        variant="light" 
                        color="teal" 
                        size="sm" 
                        radius="sm"
                        style={{ fontWeight: 700 }}
                      >
                        {row.semana}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500} c="#3A3A34">{row.fecha}</Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge variant="light" color="blue" size="sm" radius="sm">
                        {row.siembras}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge variant="light" color="teal" size="sm" radius="sm">
                        {row.trasplantes}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" fw={700} c="#1F5C3A">{row.cajasEst}</Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" fw={600} c="#3A3A34">{row.costoEst}</Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Group gap="xs" wrap="nowrap" justify="center">
                        <Progress 
                          value={row.progress} 
                          color={row.status === 'Cerrada' ? 'green' : row.status === 'En Ejecución' ? 'yellow' : 'gray'} 
                          size="sm" 
                          radius="xl"
                          style={{ width: '60px', backgroundColor: '#F5F3EE' }} 
                        />
                        <Text size="xs" fw={700}>{row.progress}%</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge 
                        size="sm"
                        variant="light"
                        style={{
                          backgroundColor: getStatusBadgeColor(row.status),
                          color: getStatusTextColor(row.status),
                          fontWeight: 700
                        }}
                      >
                        {row.status}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={8} ta="center" py="xl">
                    <Stack align="center" gap="sm">
                      <IconCalendarStats size={40} color="#9A968A" opacity={0.4} />
                      <Text size="sm" c="dimmed">No hay semanas programadas</Text>
                      <Text size="xs" c="dimmed">Los datos aparecerán cuando se registren planificaciones</Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </motion.div>

      {/* Nota al pie */}
      <Card mt="md" p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Group gap="xs">
          <ThemeIcon size="sm" radius="xl" color="teal" variant="light">
            <IconChartBar size={14} />
          </ThemeIcon>
          <Text size="xs" c="dimmed" style={{ lineHeight: 1.6 }}>
            <strong>Nota:</strong> El cronograma semanal se actualiza automáticamente con los datos de 
            siembras y trasplantes registrados en el módulo G-2. Los costos estimados son en USD y 
            se actualizan mensualmente con el tipo de cambio vigente. 
            {filteredWeeks.length} semanas mostradas
          </Text>
        </Group>
      </Card>
    </Box>
  );
}

export default GrowerPlanning;