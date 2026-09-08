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
  ThemeIcon,
  Select,
  Progress,
  Grid,
  Divider,
  Button,
  RingProgress,
  Tooltip,
  ActionIcon,
  SegmentedControl,
  Modal,
  Alert,
  Loader,
  Center,
  Menu,
  ScrollArea,
  Drawer,
} from '@mantine/core';
import {
  IconChartBar,
  IconCurrencyDollar,
  IconTrendingUp,
  IconAlertTriangle,
  IconRoute,
  IconArrowUpRight,
  IconArrowDownRight,
  IconFileAnalytics,
  IconBuildingWarehouse,
  IconClock,
  IconCheck,
  IconGauge,
  IconCalendar,
  IconChartPie,
  IconEye,
  IconDownload,
  IconRefresh,
  IconZoom,
  IconBuilding,
  IconUsers,
  IconTarget,
  IconBox,
  IconDotsVertical,
  IconFileExport,
  IconPrinter,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useFinanceDashboard } from './hooks/useFinanceDashboard';
import { notifications } from '@mantine/notifications';

export function GrowerFinanceDashboardView() {
  const {
    metrics,
    filteredRanches,
    harvestProgress,
    summary,
    isLoading,
    error,
    refresh,
    empresaId,
    setEmpresaId,
    timeRange,
    setTimeRange,
    totalMetrics,
  } = useFinanceDashboard();

  const [empresaFilter, setEmpresaFilter] = useState<string>('Consolidado');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRanch, setSelectedRanch] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [harvestDetailModalOpen, setHarvestDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const handleRefresh = async () => {
    await refresh();
    notifications.show({
      title: 'Dashboard actualizado',
      message: 'Los datos han sido actualizados correctamente',
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

  const handlePrint = () => {
    window.print();
  };

  const handleViewRanchDetail = (ranch: any) => {
    setSelectedRanch(ranch);
    setDetailModalOpen(true);
  };

  const handleViewHarvestDetail = () => {
    setHarvestDetailModalOpen(true);
  };

  const handleEmpresaChange = (value: string | null) => {
    setEmpresaFilter(value || 'Consolidado');
    if (value === 'Consolidado') {
      setEmpresaId(null);
    } else if (value === 'Daily Veggies · San Aparicio') {
      setEmpresaId('11111111-1111-1111-1111-111111111111');
    } else if (value === 'Agricola JAV') {
      setEmpresaId('22222222-2222-2222-2222-222222222222');
    } else if (value === 'La Escondida') {
      setEmpresaId('33333333-3333-3333-3333-333333333333');
    }
  };

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando dashboard financiero...</Text>
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
          icon={<IconAlertTriangle size={16} />}
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

  const getStatusColor = (estatus: string) => {
    if (estatus === 'Excelente') return 'green';
    if (estatus === 'Sano') return 'teal';
    if (estatus === 'Atencion') return 'orange';
    return 'red';
  };

  const getStatusIcon = (estatus: string) => {
    if (estatus === 'Excelente') return <IconCheck size={14} />;
    if (estatus === 'Sano') return <IconTrendingUp size={14} />;
    return <IconAlertTriangle size={14} />;
  };

  const progressData = harvestProgress || {
    total_boxes_harvested: 34120,
    total_boxes_planned: 303562,
    total_boxes_projected: 298400,
    progress_percent: 11.2,
  };

  const summaryData = summary || {
    totalHa: 182.8,
    totalPosturas: 224,
    temporada: 'Invierno 2026-2027',
    semanaActual: 48,
    semanasTotales: 30,
    fechaCorte: '27-nov-2026',
    agronomos: ['Ing. R. Silva', 'Ing. M. Gomez', 'Ing. N. Hernandez'],
    topVariedades: ['Shanghai Bok Choy', 'Baby Napa', 'Coliflor China'],
  };

  // Datos de ejemplo para el detalle de cosecha
  const weeklyHarvestData = [
    { week: 'S45', cajas: 1200, avance: 0.4, status: 'Iniciando' },
    { week: 'S46', cajas: 4500, avance: 1.5, status: 'En progreso' },
    { week: 'S47', cajas: 8200, avance: 2.7, status: 'En progreso' },
    { week: 'S48', cajas: 34120, avance: 11.2, status: 'En progreso' },
  ];

  const topVariedadesData = [
    { nombre: 'Shanghai Bok Choy', cajas: 12450, porcentaje: 36.5 },
    { nombre: 'Baby Napa', cajas: 8790, porcentaje: 25.8 },
    { nombre: 'Coliflor China', cajas: 6540, porcentaje: 19.2 },
  ];

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
                GDASH · Vision Ejecutiva
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                {summaryData.temporada}
              </Badge>
            </Group>
            <Group gap="sm" align="center">
              <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                Dashboard Financiero
              </Text>
              <Badge size="lg" variant="light" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}>
                Semana {summaryData.semanaActual}/{summaryData.semanasTotales}
              </Badge>
            </Group>
            <Group gap="xl" mt={2}>
              <Group gap={4}>
                <IconClock size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>Corte: {summaryData.fechaCorte}</Text>
              </Group>
              <Group gap={4}>
                <IconUsers size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>{summaryData.agronomos.length} Agronomos</Text>
              </Group>
              <Group gap={4}>
                <IconBuilding size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>{summaryData.totalHa} Ha · {summaryData.totalPosturas} Posturas</Text>
              </Group>
            </Group>
          </Stack>

          <Group gap="xl">
            <Group gap="sm">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                <IconTarget size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>$4.43M</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Venta FOB Proy.</Text>
              </Stack>
            </Group>
            <RingProgress
              size={90}
              thickness={10}
              sections={[{ value: 72, color: '#FFFFFF' }]}
              label={
                <Stack align="center" gap={0}>
                  <Text size="lg" fw={800} style={{ color: '#FFFFFF' }}>72%</Text>
                  <Text size="8px" style={{ opacity: 0.7 }}>ejecutado</Text>
                </Stack>
              }
            />
          </Group>
        </Group>
      </Paper>

      {/* ===== FILTROS Y CONTROLES ===== */}
      <Group justify="space-between" mb="xl">
        <Group gap="sm">
          <Select
            size="xs"
            value={empresaFilter}
            onChange={handleEmpresaChange}
            data={[
              { value: 'Consolidado', label: 'Consolidado' },
              { value: 'Daily Veggies · San Aparicio', label: 'Daily Veggies · San Aparicio' },
              { value: 'Agricola JAV', label: 'Agricola JAV' },
              { value: 'La Escondida', label: 'La Escondida' },
            ]}
            placeholder="Seleccionar empresa"
            leftSection={<IconBuilding size={14} />}
            styles={{
              input: { fontWeight: 600, backgroundColor: '#FFFFFF', borderColor: '#E8E5DC' },
              dropdown: { color: '#333' }
            }}
            style={{ width: 250 }}
          />
          <SegmentedControl
            size="xs"
            value={timeRange}
            onChange={(value) => {
              setTimeRange(value);
              notifications.show({
                title: 'Vista actualizada',
                message: `Mostrando datos de ${value === 'ytd' ? 'año a la fecha' : value === 'qtd' ? 'trimestre' : 'mes'}`,
                color: 'blue',
                autoClose: 1500,
              });
            }}
            data={[
              { value: 'ytd', label: 'YTD' },
              { value: 'qtd', label: 'QTD' },
              { value: 'mtd', label: 'MTD' },
            ]}
            styles={{
              root: { backgroundColor: '#F5F3EE' },
              indicator: { backgroundColor: '#1F5C3A' },
              label: { fontWeight: 600 }
            }}
          />
          <Badge variant="light" color="green" radius="sm">
            <Group gap={4}>
              <IconCheck size={12} />
              On Track
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
              <Menu.Item leftSection={<IconPrinter size={14} />} onClick={handlePrint}>
                Imprimir reporte
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconZoom size={14} />} onClick={() => setDrawerOpen(true)}>
                Configurar dashboard
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

      {/* ===== KPIS PRINCIPALES ===== */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
        {metrics.map((metric, idx) => {
          const TrendIcon = metric.trend === 'up' ? IconArrowUpRight : IconArrowDownRight;
          const isRevenue = metric.metric_key === 'total_revenue';
          const isCost = metric.metric_key === 'operating_costs';
          const isProfit = metric.metric_key === 'net_profit';
          const isMargin = metric.metric_key === 'net_margin';
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                <Group justify="space-between" align="flex-start">
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">
                      {metric.metric_name}
                    </Text>
                    <Text size="28px" fw={800} c={metric.color}>
                      {isMargin ? `${metric.current_value}%` : `$${(metric.current_value / 1000).toFixed(1)}K`}
                    </Text>
                    <Group gap={4}>
                      <TrendIcon size={14} color={metric.trend === 'up' ? '#1F5C3A' : '#C0392B'} />
                      <Text size="xs" fw={600} c={metric.trend === 'up' ? '#1F5C3A' : '#C0392B'}>
                        {metric.change_percent > 0 ? '+' : ''}{metric.change_percent}%
                      </Text>
                      <Text size="xs" c="dimmed">· {metric.description}</Text>
                    </Group>
                    <Progress 
                      value={metric.progress} 
                      color={metric.color} 
                      size="xs" 
                      radius="xl" 
                      mt={4}
                      style={{ width: '100%' }}
                    />
                  </Stack>
                  <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: metric.color, flexShrink: 0 }}>
                    {isRevenue ? <IconCurrencyDollar size={20} stroke={2} /> :
                     isCost ? <IconChartBar size={20} stroke={2} /> :
                     isProfit ? <IconTrendingUp size={20} stroke={2} /> :
                     <IconGauge size={20} stroke={2} />}
                  </ThemeIcon>
                </Group>
              </Card>
            </motion.div>
          );
        })}
      </SimpleGrid>

      {/* ===== SECCION PRINCIPAL ===== */}
      <Grid mb="xl">
        {/* Avance de Cosecha */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ height: '100%' }}
          >
            <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF', height: '100%' }}>
              <Group gap="sm" mb="lg">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                  <IconRoute size={18} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="sm" fw={700} c="#3A3A34">Progreso de Cosecha</Text>
                  <Text size="xs" c="dimmed">{progressData.total_boxes_harvested.toLocaleString()} de {progressData.total_boxes_planned.toLocaleString()} cajas</Text>
                </Stack>
              </Group>

              <Divider mb="lg" />

              <Box mb="xl">
                <Group justify="space-between" mb={6}>
                  <Text size="xs" fw={600} c="#3A3A34">Avance Temporada</Text>
                  <Group gap={4}>
                    <Text size="xs" fw={700} c="#1F5C3A">{progressData.progress_percent}%</Text>
                    <Badge size="xs" color="green" variant="light" radius="sm">+2.3%</Badge>
                  </Group>
                </Group>
                <Progress value={progressData.progress_percent} color="#1F5C3A" size="lg" radius="xl" />
                <Group justify="space-between" mt={4}>
                  <Text size="xs" c="dimmed">0%</Text>
                  <Text size="xs" c="dimmed" fw={600}>Meta: 100%</Text>
                </Group>
              </Box>

              <Divider mb="lg" />

              <Stack gap="md">
                <Group justify="space-between" p="xs" style={{ backgroundColor: '#FAF9F5', borderRadius: '6px' }}>
                  <Group gap={4}>
                    <IconBox size={14} color="#9A968A" />
                    <Text size="xs" fw={600} c="dimmed">Cajas Proyectadas Cierre:</Text>
                  </Group>
                  <Text size="xs" fw={700} c="#1F5C3A">{progressData.total_boxes_projected.toLocaleString()} cj</Text>
                </Group>
                <Group justify="space-between" p="xs" style={{ backgroundColor: '#FAF9F5', borderRadius: '6px' }}>
                  <Group gap={4}>
                    <IconCurrencyDollar size={14} color="#9A968A" />
                    <Text size="xs" fw={600} c="dimmed">Costo Promedio por Ha:</Text>
                  </Group>
                  <Group gap={4}>
                    <Text size="xs" fw={700} c="#C08412">$9,120 USD</Text>
                    <Badge size="xs" color="red" variant="light" radius="sm">+6.1%</Badge>
                  </Group>
                </Group>
                <Group justify="space-between" p="xs" style={{ backgroundColor: '#FAF9F5', borderRadius: '6px' }}>
                  <Group gap={4}>
                    <IconTrendingUp size={14} color="#9A968A" />
                    <Text size="xs" fw={600} c="dimmed">Precio Retorno / Caja:</Text>
                  </Group>
                  <Text size="xs" fw={700} c="#1F5C3A">$7.41 USD</Text>
                </Group>
                <Group justify="space-between" p="xs" style={{ backgroundColor: '#FAF9F5', borderRadius: '6px' }}>
                  <Group gap={4}>
                    <IconGauge size={14} color="#9A968A" />
                    <Text size="xs" fw={600} c="dimmed">Yield Promedio:</Text>
                  </Group>
                  <Text size="xs" fw={700} c="#2A6A8A">96.4%</Text>
                </Group>
              </Stack>

              <Divider my="lg" />

              <Group justify="space-between">
                <Badge variant="light" color="green" radius="sm">
                  <Group gap={4}>
                    <IconCheck size={12} />
                    On Track
                  </Group>
                </Badge>
                <Button 
                  size="xs" 
                  variant="subtle" 
                  color="teal" 
                  rightSection={<IconEye size={14} />}
                  onClick={handleViewHarvestDetail}
                >
                  Ver Detalle
                </Button>
              </Group>
            </Card>
          </motion.div>
        </Grid.Col>

        {/* Desempeno por Rancho */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            style={{ height: '100%' }}
          >
            <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF', height: '100%' }}>
              <Group justify="space-between" mb="lg">
                <Group gap="sm">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                    <IconBuildingWarehouse size={18} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text size="sm" fw={700} c="#3A3A34">Desempeno por Rancho</Text>
                    <Text size="xs" c="dimmed">
                      {filteredRanches.length} ranchos {empresaId ? '· Filtrado' : '· Consolidado'}
                    </Text>
                  </Stack>
                </Group>
                <Group gap="xs">
                  <SegmentedControl
                    size="xs"
                    value={viewMode}
                    onChange={(value) => setViewMode(value as 'cards' | 'table')}
                    data={[
                      { value: 'cards', label: 'Tarjetas' },
                      { value: 'table', label: 'Tabla' },
                    ]}
                    styles={{
                      root: { backgroundColor: '#F5F3EE' },
                      indicator: { backgroundColor: '#1F5C3A' },
                      label: { fontWeight: 600 }
                    }}
                  />
                </Group>
              </Group>

              <Divider mb="lg" />

              {viewMode === 'cards' ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                  {filteredRanches.map((row, idx) => {
                    const statusColor = getStatusColor(row.status);
                    return (
                      <Card
                        key={idx}
                        p="md"
                        radius="md"
                        withBorder
                        style={{
                          borderColor: '#E8E5DC',
                          backgroundColor: '#FAF9F5',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => handleViewRanchDetail(row)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FAF9F5';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Group justify="space-between" mb={4}>
                          <Text size="sm" fw={700} c="#3A3A34">{row.ranch_name}</Text>
                          <Badge size="xs" color={statusColor} variant="light" radius="xl">
                            {row.status}
                          </Badge>
                        </Group>
                        <Group gap="md" mt={4}>
                          <Stack gap={0} align="center">
                            <Text size="xl" fw={800} c="#1F5C3A">{row.yield_percent}%</Text>
                            <Text size="9px" c="dimmed">Yield</Text>
                          </Stack>
                          <Stack gap={0} align="center">
                            <Text size="xl" fw={800} c="#C08412">${(row.accumulated_expense / 1000).toFixed(0)}K</Text>
                            <Text size="9px" c="dimmed">Gasto</Text>
                          </Stack>
                          <Stack gap={0} align="center">
                            <Text size="xl" fw={800} c={row.projected_profit < 0 ? '#C0392B' : '#1F5C3A'}>
                              {row.projected_profit < 0 ? '-' : ''}${Math.abs(row.projected_profit / 1000).toFixed(0)}K
                            </Text>
                            <Text size="9px" c="dimmed">Utilidad</Text>
                          </Stack>
                        </Group>
                        <Divider my="xs" />
                        <Group justify="space-between">
                          <Group gap={4}>
                            <IconBox size={12} color="#9A968A" />
                            <Text size="xs" c="dimmed">{row.active_sectors} sectores</Text>
                          </Group>
                          <ThemeIcon size="sm" radius="xl" color={statusColor} variant="light">
                            {getStatusIcon(row.status)}
                          </ThemeIcon>
                        </Group>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              ) : (
                <ScrollArea>
                  <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
                    <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                      <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                        <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Rancho</Table.Th>
                        <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Sectores</Table.Th>
                        <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Yield</Table.Th>
                        <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Gasto Acum.</Table.Th>
                        <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Utilidad</Table.Th>
                        <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Estado</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {filteredRanches.map((row, idx) => {
                        const statusColor = getStatusColor(row.status);
                        return (
                          <Table.Tr
                            key={idx}
                            style={{ borderBottom: '1px solid #EFECE3', cursor: 'pointer' }}
                            onClick={() => handleViewRanchDetail(row)}
                          >
                            <Table.Td>
                              <Group gap="sm" wrap="nowrap">
                                <ThemeIcon size="sm" radius="xl" style={{ backgroundColor: `${statusColor}20`, color: statusColor === 'green' ? '#1F5C3A' : statusColor === 'teal' ? '#2A6A8A' : '#C0392B', flexShrink: 0 }}>
                                  {getStatusIcon(row.status)}
                                </ThemeIcon>
                                <Text fw={700} c="#3A3A34" size="xs">{row.ranch_name}</Text>
                              </Group>
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'center' }}>
                              <Badge variant="light" color="teal" size="sm" radius="sm">
                                {row.active_sectors}
                              </Badge>
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'right' }}>
                              <Text size="xs" fw={600} c="#1F5C3A">{row.yield_percent}%</Text>
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'right' }}>
                              <Text size="xs" c="#3A3A34">${row.accumulated_expense.toLocaleString()}</Text>
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'right' }}>
                              <Text size="xs" fw={700} c={row.projected_profit < 0 ? '#C0392B' : '#1F5C3A'}>
                                {row.projected_profit < 0 ? '-' : ''}${Math.abs(row.projected_profit).toLocaleString()}
                              </Text>
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'center' }}>
                              <Badge size="sm" color={statusColor} variant="light" radius="xl" style={{ minWidth: 80, justifyContent: 'center' }}>
                                {row.status}
                              </Badge>
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              )}

              <Divider my="lg" />

              <Group justify="space-between">
                <Group gap="md">
                  <Group gap={4}>
                    <Box style={{ width: 10, height: 10, backgroundColor: '#1F5C3A', borderRadius: 3 }} />
                    <Text size="xs" c="dimmed">Excelente</Text>
                  </Group>
                  <Group gap={4}>
                    <Box style={{ width: 10, height: 10, backgroundColor: '#2A6A8A', borderRadius: 3 }} />
                    <Text size="xs" c="dimmed">Sano</Text>
                  </Group>
                  <Group gap={4}>
                    <Box style={{ width: 10, height: 10, backgroundColor: '#C0392B', borderRadius: 3 }} />
                    <Text size="xs" c="dimmed">Atencion</Text>
                  </Group>
                </Group>
                <Badge variant="light" color="teal" radius="sm">
                  <Group gap={4}>
                    <IconBuilding size={12} />
                    {filteredRanches.length} ranchos activos
                  </Group>
                </Badge>
              </Group>
            </Card>
          </motion.div>
        </Grid.Col>
      </Grid>

      {/* ===== RESUMEN FINANCIERO ADICIONAL ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconChartPie size={18} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Resumen Financiero</Text>
                <Text size="xs" c="dimmed">Metricas clave de la temporada</Text>
              </Stack>
            </Group>
            <Badge variant="light" color="teal" radius="sm">
              <Group gap={4}>
                <IconCalendar size={12} />
                Corte: {summaryData.fechaCorte}
              </Group>
            </Badge>
          </Group>

          <Divider mb="lg" />

          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <Card p="lg" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Group gap={4} mb={4}>
                <IconCurrencyDollar size={14} color="#1F5C3A" />
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Total Facturado</Text>
              </Group>
              <Text size="28px" fw={800} c="#1F5C3A">${(totalMetrics.totalRevenue / 1000).toFixed(1)}K</Text>
              <Text size="xs" c="dimmed">11.4% del presupuesto</Text>
              <Progress value={11.4} color="#1F5C3A" size="sm" radius="xl" mt="xs" />
            </Card>

            <Card p="lg" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Group gap={4} mb={4}>
                <IconChartBar size={14} color="#C08412" />
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Costo Promedio</Text>
              </Group>
              <Text size="28px" fw={800} c="#C08412">$9,120 USD</Text>
              <Group gap={4}>
                <Text size="xs" c="dimmed">+6.1% vs presupuesto</Text>
                <Badge size="xs" color="red" variant="light" radius="sm">↑</Badge>
              </Group>
              <Progress value={106} color="#C08412" size="sm" radius="xl" mt="xs" />
            </Card>

            <Card p="lg" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Group gap={4} mb={4}>
                <IconTrendingUp size={14} color="#2A6A8A" />
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Retorno por Caja</Text>
              </Group>
              <Text size="28px" fw={800} c="#2A6A8A">$7.41 USD</Text>
              <Group gap={4}>
                <Text size="xs" c="dimmed">+2.3% vs presupuesto</Text>
                <Badge size="xs" color="green" variant="light" radius="sm">↑</Badge>
              </Group>
              <Progress value={102.3} color="#2A6A8A" size="sm" radius="xl" mt="xs" />
            </Card>

            <Card p="lg" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Group gap={4} mb={4}>
                <IconAlertTriangle size={14} color="#C0392B" />
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Sectores en Riesgo</Text>
              </Group>
              <Text size="28px" fw={800} c="#C0392B">
                {filteredRanches.filter(r => r.status === 'Atencion' || r.status === 'Critico').length}
              </Text>
              <Text size="xs" c="dimmed">Requieren atencion inmediata</Text>
              <Progress 
                value={filteredRanches.length > 0 ? (filteredRanches.filter(r => r.status === 'Atencion' || r.status === 'Critico').length / filteredRanches.length) * 100 : 0} 
                color="#C0392B" 
                size="sm" 
                radius="xl" 
                mt="xs" 
              />
            </Card>
          </SimpleGrid>

          <Divider my="lg" />

          <Group justify="space-between">
            <Group gap="md">
              <Group gap={4}>
                <Box style={{ width: 10, height: 10, backgroundColor: '#1F5C3A', borderRadius: 3 }} />
                <Text size="xs" c="dimmed">On Track</Text>
              </Group>
              <Group gap={4}>
                <Box style={{ width: 10, height: 10, backgroundColor: '#C08412', borderRadius: 3 }} />
                <Text size="xs" c="dimmed">Atencion</Text>
              </Group>
              <Group gap={4}>
                <Box style={{ width: 10, height: 10, backgroundColor: '#C0392B', borderRadius: 3 }} />
                <Text size="xs" c="dimmed">Critico</Text>
              </Group>
            </Group>
          </Group>
        </Card>
      </motion.div>

      {/* ============================================================
          MODAL: Detalle de Rancho
      ============================================================ */}
      <Modal
        opened={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedRanch(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconBuildingWarehouse size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>{selectedRanch?.ranch_name}</Text>
              <Text size="xs" c="dimmed">Detalle del desempeno</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        {selectedRanch && (
          <Stack gap="md">
            <SimpleGrid cols={3} spacing="md">
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Sectores Activos</Text>
                <Text size="xl" fw={800} c="#1F5C3A">{selectedRanch.active_sectors}</Text>
              </Card>
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Yield</Text>
                <Text size="xl" fw={800} c="#2A6A8A">{selectedRanch.yield_percent}%</Text>
              </Card>
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Estado</Text>
                <Badge size="lg" color={getStatusColor(selectedRanch.status)} variant="light">
                  {selectedRanch.status}
                </Badge>
              </Card>
            </SimpleGrid>

            <Divider />

            <SimpleGrid cols={2} spacing="md">
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Gasto Acumulado</Text>
                <Text size="xl" fw={800} c="#C08412">${selectedRanch.accumulated_expense.toLocaleString()}</Text>
              </Card>
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Utilidad Proyectada</Text>
                <Text size="xl" fw={800} c={selectedRanch.projected_profit < 0 ? '#C0392B' : '#1F5C3A'}>
                  {selectedRanch.projected_profit < 0 ? '-' : ''}${Math.abs(selectedRanch.projected_profit).toLocaleString()}
                </Text>
              </Card>
            </SimpleGrid>

            <Divider />

            <Group justify="flex-end">
              <Button variant="subtle" color="gray" onClick={() => setDetailModalOpen(false)}>
                Cerrar
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* ============================================================
          MODAL: Detalle de Cosecha
      ============================================================ */}
      <Modal
        opened={harvestDetailModalOpen}
        onClose={() => setHarvestDetailModalOpen(false)}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconRoute size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Detalle de Cosecha</Text>
              <Text size="xs" c="dimmed">Avance detallado por semana y variedad</Text>
            </Stack>
          </Group>
        }
        size="xl"
        centered
      >
        <Stack gap="md">
          {/* Resumen rápido */}
          <SimpleGrid cols={4} spacing="md">
            <Card p="sm" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Text size="xs" c="dimmed" fw={600}>Total Cosechado</Text>
              <Text size="xl" fw={800} c="#1F5C3A">{progressData.total_boxes_harvested.toLocaleString()}</Text>
            </Card>
            <Card p="sm" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Text size="xs" c="dimmed" fw={600}>Proyección</Text>
              <Text size="xl" fw={800} c="#2A6A8A">{progressData.total_boxes_projected.toLocaleString()}</Text>
            </Card>
            <Card p="sm" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Text size="xs" c="dimmed" fw={600}>Avance</Text>
              <Text size="xl" fw={800} c="#C08412">{progressData.progress_percent}%</Text>
            </Card>
            <Card p="sm" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Text size="xs" c="dimmed" fw={600}>Meta</Text>
              <Text size="xl" fw={800} c="#1F5C3A">100%</Text>
            </Card>
          </SimpleGrid>

          <Divider />

          {/* Tabla de progreso semanal */}
          <Text size="sm" fw={600}>Progreso Semanal</Text>
          <Table verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#4A4A40' }}>Semana</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#4A4A40', textAlign: 'right' }}>Cajas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#4A4A40', textAlign: 'right' }}>Avance</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#4A4A40', textAlign: 'center' }}>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {weeklyHarvestData.map((row, idx) => (
                <Table.Tr key={idx} style={{ borderBottom: '1px solid #EFECE3' }}>
                  <Table.Td fw={600}>{row.week}</Table.Td>
                  <Table.Td ta="right">{row.cajas.toLocaleString()}</Table.Td>
                  <Table.Td ta="right">
                    <Group gap={4} justify="flex-end">
                      <Text size="sm">{row.avance}%</Text>
                      <Progress value={row.avance} size="xs" color="#1F5C3A" style={{ width: 60 }} />
                    </Group>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Badge size="xs" color={row.avance > 5 ? 'green' : 'blue'} variant="light" radius="xl">
                      {row.status}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Divider />

          {/* Top variedades */}
          <Text size="sm" fw={600}>Top Variedades Cosechadas</Text>
          <SimpleGrid cols={3} spacing="md">
            {topVariedadesData.map((variedad, idx) => (
              <Card key={idx} p="sm" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Group justify="space-between">
                  <Text size="xs" fw={600}>{variedad.nombre}</Text>
                  <Badge size="xs" color="teal" variant="light">
                    {variedad.cajas.toLocaleString()} cj
                  </Badge>
                </Group>
                <Progress 
                  value={variedad.porcentaje} 
                  color="#1F5C3A" 
                  size="xs" 
                  radius="xl" 
                  mt={4} 
                />
                <Text size="9px" c="dimmed" mt={2}>{variedad.porcentaje}% del total</Text>
              </Card>
            ))}
          </SimpleGrid>

          <Divider />

          <Group justify="flex-end">
            <Button variant="subtle" color="gray" onClick={() => setHarvestDetailModalOpen(false)}>
              Cerrar
            </Button>
            <Button size="xs" variant="subtle" color="teal" rightSection={<IconFileAnalytics size={14} />}>
              Reporte completo
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ============================================================
          DRAWER: Configuracion del Dashboard
      ============================================================ */}
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Configurar Dashboard"
        padding="lg"
        size="md"
        position="right"
      >
        <Stack gap="lg">
          <Text size="sm" fw={600}>Preferencias de visualizacion</Text>
          
          <Divider />
          
          <Stack gap="xs">
            <Text size="xs" fw={600} c="dimmed">Periodo de tiempo</Text>
            <SegmentedControl
              value={timeRange}
              onChange={(value) => {
                setTimeRange(value);
                setDrawerOpen(false);
              }}
              data={[
                { value: 'ytd', label: 'YTD' },
                { value: 'qtd', label: 'QTD' },
                { value: 'mtd', label: 'MTD' },
              ]}
              fullWidth
            />
          </Stack>

          <Stack gap="xs">
            <Text size="xs" fw={600} c="dimmed">Vista de ranchos</Text>
            <SegmentedControl
              value={viewMode}
              onChange={(value) => setViewMode(value as 'cards' | 'table')}
              data={[
                { value: 'cards', label: 'Tarjetas' },
                { value: 'table', label: 'Tabla' },
              ]}
              fullWidth
            />
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text size="xs" fw={600} c="dimmed">Acciones rapidas</Text>
            <Button variant="light" color="teal" leftSection={<IconRefresh size={14} />} onClick={handleRefresh} fullWidth>
              Actualizar datos
            </Button>
            <Button variant="light" color="blue" leftSection={<IconDownload size={14} />} onClick={handleExport} fullWidth>
              Exportar reporte
            </Button>
            <Button variant="light" color="gray" leftSection={<IconPrinter size={14} />} onClick={handlePrint} fullWidth>
              Imprimir
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Box>
  );
}

export default GrowerFinanceDashboardView;