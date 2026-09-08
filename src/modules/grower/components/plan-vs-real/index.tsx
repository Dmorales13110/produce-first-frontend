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
  Divider,
  Progress,
  RingProgress,
  Tooltip,
  ActionIcon,
  SegmentedControl,
  Button,
  Grid,
  Avatar,
  Alert,
  Loader,
  Center,
  Modal,
  ScrollArea,
  Menu,
  Select,
  Textarea,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconCheck,
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
  IconTarget,
  IconBuildingWarehouse,
  IconCalendar,
  IconUsers,
  IconBuilding,
  IconClock,
  IconReport,
  IconAnalyze,
  IconBrandSpeedtest,
  IconBox,
  IconFileAnalytics,
  IconDotsVertical,
  IconFileExport,
  IconPrinter,
  IconEdit,
  IconX,
  IconChartPie,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Scatter,
  ScatterChart,
  ZAxis,
  ComposedChart,
  Area,
  ReferenceLine,
} from 'recharts';
import { usePlanVsReal } from './hooks/usePlanVsReal';
import { notifications } from '@mantine/notifications';

export function GrowerSeasonPlanVsReal() {
  const {
    metrics,
    deviations,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    updateDeviation,
  } = usePlanVsReal();

  const [viewMode, setViewMode] = useState('detallado');
  const [graphType, setGraphType] = useState('barras');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDeviation, setSelectedDeviation] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    action: '',
  });

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleRefresh = async () => {
    await refresh();
    notifications.show({
      title: 'Datos actualizados',
      message: 'Plan vs Real ha sido actualizado',
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

  const handleViewDeviationDetail = (deviation: any) => {
    setSelectedDeviation(deviation);
    setDetailModalOpen(true);
  };

  const handleEditDeviation = (deviation: any) => {
    setSelectedDeviation(deviation);
    setEditForm({
      status: deviation.status,
      action: deviation.action || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedDeviation) return;

    try {
      await updateDeviation(selectedDeviation.id, {
        status: editForm.status,
        action: editForm.action,
      });
      notifications.show({
        title: '✅ Desviación actualizada',
        message: 'La desviación ha sido actualizada exitosamente',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
      setEditModalOpen(false);
      setSelectedDeviation(null);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al actualizar desviación',
        color: 'red',
        icon: <IconAlertTriangle size={16} />,
      });
    }
  };

  // ============================================================
  // CÁLCULOS Y DATOS PARA GRÁFICOS
  // ============================================================

  const totalPlan = summary?.totalPlan || 0;
  const totalReal = summary?.totalReal || 0;
  const avgProgress = summary?.avgProgress || 0;
  const onTrackCount = summary?.onTrackCount || 0;
  const attentionCount = summary?.attentionCount || 0;
  const criticalCount = summary?.criticalCount || 0;
  const totalImpact = summary?.totalImpact || 0;

  // Datos para gráficos
  const chartData = metrics.map(m => ({
    name: m.concept,
    plan: m.plan_value,
    real: m.real_value,
    progress: m.progress_percent,
    status: m.status,
    variance: m.variance,
    projected: m.projected_value,
  }));

  // Datos para gráfico de torta - Distribución de status
  const statusData = [
    { name: 'On Track', value: onTrackCount, color: '#1F5C3A' },
    { name: 'Atención', value: attentionCount, color: '#C08412' },
    { name: 'Crítico', value: criticalCount, color: '#C0392B' },
  ].filter(d => d.value > 0);

  // Datos para gráfico de torta - Distribución de severidad de desviaciones
  const severityData = [
    { name: 'Alta', value: deviations.filter(d => d.severity === 'high').length, color: '#C0392B' },
    { name: 'Media', value: deviations.filter(d => d.severity === 'medium').length, color: '#C08412' },
    { name: 'Baja', value: deviations.filter(d => d.severity === 'low').length, color: '#2A6A8A' },
  ].filter(d => d.value > 0);

  // Datos para regresión lineal (simulada)
  const regressionData = metrics.map((m, idx) => ({
    x: idx + 1,
    y: m.progress_percent,
    name: m.concept,
    plan: m.plan_value,
    real: m.real_value,
  }));

  // Calcular línea de regresión (simplificada)
  const calculateRegressionLine = (data: any[]) => {
    if (data.length < 2) return [];
    const n = data.length;
    const sumX = data.reduce((s, d) => s + d.x, 0);
    const sumY = data.reduce((s, d) => s + d.y, 0);
    const sumXY = data.reduce((s, d) => s + d.x * d.y, 0);
    const sumX2 = data.reduce((s, d) => s + d.x * d.x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return data.map(d => ({
      x: d.x,
      y: slope * d.x + intercept,
    }));
  };

  const regressionLine = calculateRegressionLine(regressionData);

  // Datos para tendencia semanal (simulada)
  const weeklyTrendData = [
    { week: 'S44', plan: 95, real: 92, status: 'on-track' },
    { week: 'S45', plan: 96, real: 94, status: 'on-track' },
    { week: 'S46', plan: 97, real: 95, status: 'attention' },
    { week: 'S47', plan: 98, real: 93, status: 'critical' },
    { week: 'S48', plan: 100, real: 91, status: 'critical' },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando Plan vs Real...</Text>
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

  const getStatusColor = (status: string) => {
    if (status === 'on-track') return '#1F5C3A';
    if (status === 'attention') return '#C08412';
    return '#C0392B';
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return '#C0392B';
    if (severity === 'medium') return '#C08412';
    return '#2A6A8A';
  };

  const mockData = {
    temporada: 'Invierno 2026-2027',
    semanaActual: 48,
    semanasTotales: 30,
    fechaCorte: '27-nov-2026',
    totalHa: 182.8,
    totalPosturas: 224,
    agronomos: ['Ing. R. Silva', 'Ing. M. Gomez', 'Ing. N. Hernandez']
  };

  const COLORS = ['#1F5C3A', '#C08412', '#C0392B', '#2A6A8A', '#7D3C98'];

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
                G-17 · Plan vs Real
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                {mockData.temporada}
              </Badge>
            </Group>
            <Group gap="sm" align="center">
              <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                Plan vs Real
              </Text>
              <Badge size="lg" variant="light" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}>
                Semana {mockData.semanaActual}/{mockData.semanasTotales}
              </Badge>
            </Group>
            <Group gap="xl" mt={2}>
              <Group gap={4}>
                <IconCalendar size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>Corte: {mockData.fechaCorte}</Text>
              </Group>
              <Group gap={4}>
                <IconUsers size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>{mockData.agronomos.length} Agronomos</Text>
              </Group>
              <Group gap={4}>
                <IconBuilding size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" style={{ opacity: 0.8 }}>{mockData.totalHa} Ha · {mockData.totalPosturas} Posturas</Text>
              </Group>
            </Group>
          </Stack>

          <Group gap="xl">
            <Group gap="sm">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                <IconTarget size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>{avgProgress.toFixed(1)}%</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Avance</Text>
              </Stack>
            </Group>
            <RingProgress
              size={90}
              thickness={10}
              sections={[{ value: Math.min(avgProgress, 100), color: '#FFFFFF' }]}
              label={
                <Stack align="center" gap={0}>
                  <Text size="lg" fw={800} style={{ color: '#FFFFFF' }}>{Math.round(avgProgress)}%</Text>
                  <Text size="8px" style={{ opacity: 0.7 }}>ejecutado</Text>
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Avance Temporada</Text>
                <Text size="28px" fw={800} c="#1F5C3A">{avgProgress.toFixed(1)}%</Text>
                <Group gap={4}>
                  <IconTrendingUp size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>Cajas cosechadas</Text>
                </Group>
                <Badge size="xs" color="green" variant="light" radius="sm">On Track</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconTrendingUp size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Utilidad al Corte</Text>
                <Text size="28px" fw={800} c="#1F5C3A">${(totalReal / 1000).toFixed(1)}K</Text>
                <Group gap={4}>
                  <IconCurrencyDollar size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>12% del plan</Text>
                </Group>
                <Badge size="xs" color="blue" variant="light" radius="sm">USD</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconCurrencyDollar size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Métricas On Track</Text>
                <Text size="28px" fw={800} c="#1F5C3A">{onTrackCount}</Text>
                <Group gap={4}>
                  <IconCheck size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>de {metrics.length} métricas</Text>
                </Group>
                <Group gap={4}>
                  <Badge size="xs" color="yellow" variant="light" radius="sm">{attentionCount} atención</Badge>
                  <Badge size="xs" color="red" variant="light" radius="sm">{criticalCount} críticas</Badge>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconGauge size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Impacto Desviaciones</Text>
                <Text size="28px" fw={800} c="#C0392B">${totalImpact.toLocaleString()}</Text>
                <Group gap={4}>
                  <IconAlertTriangle size={14} color="#C0392B" />
                  <Text size="xs" c="#C0392B" fw={600}>{deviations.length} desviaciones activas</Text>
                </Group>
                <Badge size="xs" color="red" variant="light" radius="sm">Requiere atención</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C0392B' }}>
                <IconAlertTriangle size={20} stroke={2} />
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
              { value: 'detallado', label: 'Detallado' },
              { value: 'grafico', label: 'Gráfico' },
              { value: 'resumido', label: 'Resumido' },
            ]}
            styles={{
              root: { backgroundColor: '#F5F3EE' },
              indicator: { backgroundColor: '#1F5C3A' },
              label: { fontWeight: 600 }
            }}
          />
          {viewMode === 'grafico' && (
            <SegmentedControl
              size="xs"
              value={graphType}
              onChange={setGraphType}
              data={[
                { value: 'barras', label: 'Barras' },
                { value: 'torta', label: 'Torta' },
                { value: 'regresion', label: 'Regresión' },
                { value: 'tendencia', label: 'Tendencia' },
              ]}
              styles={{
                root: { backgroundColor: '#F5F3EE' },
                indicator: { backgroundColor: '#2A6A8A' },
                label: { fontWeight: 600 }
              }}
            />
          )}
          <Badge variant="light" color="green" radius="sm">
            <Group gap={4}>
              <IconCheck size={12} />
              On Track
            </Group>
          </Badge>
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

      {/* ===== VISTA GRÁFICO ===== */}
      {viewMode === 'grafico' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '24px' }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" mb="lg">
              <Group gap="sm">
                <IconChartBar size={18} color="#1F5C3A" />
                <Stack gap={0}>
                  <Text size="sm" fw={700} c="#3A3A34">
                    {graphType === 'barras' && 'Análisis de Barras'}
                    {graphType === 'torta' && 'Distribución de Métricas'}
                    {graphType === 'regresion' && 'Análisis de Regresión Lineal'}
                    {graphType === 'tendencia' && 'Análisis de Tendencia'}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {graphType === 'barras' && 'Comparativa Plan vs Real por métrica'}
                    {graphType === 'torta' && 'Distribución de status y severidad'}
                    {graphType === 'regresion' && 'Correlación entre plan y real'}
                    {graphType === 'tendencia' && 'Evolución semanal de rendimiento'}
                  </Text>
                </Stack>
              </Group>
              <Badge variant="light" color="teal" radius="sm">
                <Group gap={4}>
                  <IconCalendar size={12} />
                  Semana {mockData.semanaActual}
                </Group>
              </Badge>
            </Group>

            <Divider mb="lg" />

            {/* ===== GRÁFICO DE BARRAS ===== */}
            {graphType === 'barras' && (
              <Box style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => {
                      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                      return `$${value}`;
                    }} />
                    <YAxis type="category" dataKey="name" width={80} />
                    <RechartsTooltip 
                      formatter={(value: number, name: string) => {
                        if (name === 'Plan') return [`$${value.toLocaleString()}`, 'Plan'];
                        if (name === 'Real') return [`$${value.toLocaleString()}`, 'Real'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="plan" fill="#9A968A" name="Plan" />
                    <Bar 
                      dataKey="real" 
                      fill={(entry: any) => getStatusColor(entry.status)} 
                      name="Real"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* ===== GRÁFICO DE TORTA ===== */}
            {graphType === 'torta' && (
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text size="sm" fw={600} ta="center" mb="md">Distribución por Status</Text>
                  <Box style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => [`${value} métricas`, 'Cantidad']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text size="sm" fw={600} ta="center" mb="md">Distribución por Severidad</Text>
                  <Box style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={severityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => [`${value} desviaciones`, 'Cantidad']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid.Col>
              </Grid>
            )}

            {/* ===== GRÁFICO DE REGRESIÓN LINEAL ===== */}
            {graphType === 'regresion' && (
              <Box style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Métrica" 
                      label={{ value: 'Índice de Métrica', position: 'bottom' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Progreso" 
                      label={{ value: 'Progreso (%)', angle: -90, position: 'left' }}
                      domain={[0, 100]}
                    />
                    <RechartsTooltip 
                      formatter={(value, name) => {
                        if (name === 'x') return [value, 'Métrica'];
                        if (name === 'y') return [`${value.toFixed(1)}%`, 'Progreso'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    {/* Datos de regresión (scatter) */}
                    <Scatter 
                      name="Métricas" 
                      data={regressionData} 
                      fill="#1F5C3A"
                      shape="circle"
                    >
                      {regressionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                      ))}
                    </Scatter>
                    {/* Línea de regresión */}
                    <Scatter
                      name="Línea de Regresión"
                      data={regressionLine}
                      fill="none"
                      stroke="#C0392B"
                      strokeWidth={2}
                      line={{ stroke: '#C0392B', strokeWidth: 2 }}
                      shape="none"
                    />
                    {/* Referencia al 100% */}
                    <ReferenceLine y={100} stroke="#1F5C3A" strokeDasharray="3 3" label={{ value: 'Meta 100%', position: 'right' }} />
                  </ScatterChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* ===== GRÁFICO DE TENDENCIA ===== */}
            {graphType === 'tendencia' && (
              <Box style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={weeklyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[80, 105]} />
                    <RechartsTooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="plan" 
                      fill="#9A968A" 
                      stroke="#9A968A" 
                      name="Plan" 
                      fillOpacity={0.3}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="real" 
                      stroke={(entry: any) => getStatusColor(entry.status)} 
                      name="Real" 
                      strokeWidth={2}
                      dot={{ r: 6 }}
                    />
                    <ReferenceLine y={100} stroke="#1F5C3A" strokeDasharray="3 3" label={{ value: 'Meta', position: 'right' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            )}

            <Divider my="lg" />

            <Group justify="space-between">
              <Group gap="md">
                <Group gap={4}>
                  <Box style={{ width: 12, height: 12, backgroundColor: '#1F5C3A', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">On Track</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 12, height: 12, backgroundColor: '#C08412', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Atención</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 12, height: 12, backgroundColor: '#C0392B', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Crítico</Text>
                </Group>
              </Group>
              <Group gap="sm">
                <Badge variant="light" color="teal" radius="sm">
                  <Group gap={4}>
                    <IconTrendingUp size={12} />
                    {onTrackCount} métricas On Track
                  </Group>
                </Badge>
                <Badge variant="light" color="red" radius="sm">
                  <Group gap={4}>
                    <IconAlertTriangle size={12} />
                    {criticalCount} críticas
                  </Group>
                </Badge>
              </Group>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ===== VISTA DETALLADO ===== */}
      {viewMode === 'detallado' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '24px' }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group gap="sm" mb="lg">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconChartBar size={18} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Temporada · Plan vs Real</Text>
                <Text size="xs" c="dimmed">Comparativa de métricas clave y proyección</Text>
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
                    <Table.Th style={{ width: '18%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Concepto</Table.Th>
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Plan</Table.Th>
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Real</Table.Th>
                    <Table.Th style={{ width: '18%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Avance</Table.Th>
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Proyección</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Vs Plan</Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {metrics.length > 0 ? (
                    metrics.map((row, idx) => (
                      <Table.Tr 
                        key={idx} 
                        style={{ 
                          borderBottom: '1px solid #EFECE3',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF9F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Table.Td>
                          <Text fw={700} c="#3A3A34" size="xs">{row.concept}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" fw={600}>
                            {row.plan_value >= 1000000 ? `$${(row.plan_value / 1000000).toFixed(2)}M` : 
                             row.plan_value >= 1000 ? `${(row.plan_value / 1000).toFixed(1)}K` : 
                             row.plan_value.toLocaleString()}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" fw={600} c="#1F5C3A">
                            {row.real_value >= 1000000 ? `$${(row.real_value / 1000000).toFixed(2)}M` : 
                             row.real_value >= 1000 ? `${(row.real_value / 1000).toFixed(1)}K` : 
                             row.real_value.toLocaleString()}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Group gap="xs" justify="center">
                            <Progress 
                              value={Math.min(row.progress_percent, 100)} 
                              color={row.status === 'on-track' ? '#1F5C3A' : row.status === 'attention' ? '#C08412' : '#C0392B'} 
                              size="sm" 
                              radius="xl"
                              style={{ width: '60px' }}
                            />
                            <Text size="xs" fw={700} c={getStatusColor(row.status)}>
                              {row.progress_percent.toFixed(1)}%
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" fw={700} c="#2A6A8A">
                            {row.projected_value >= 1000000 ? `$${(row.projected_value / 1000000).toFixed(2)}M` : 
                             row.projected_value >= 1000 ? `${(row.projected_value / 1000).toFixed(1)}K` : 
                             row.projected_value.toLocaleString()}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" fw={600} c={row.variance < 0 ? '#1F5C3A' : '#C0392B'}>
                            {row.variance >= 0 ? '+' : ''}{row.variance.toLocaleString()}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge 
                            size="sm"
                            color={row.status === 'on-track' ? 'green' : row.status === 'attention' ? 'yellow' : 'red'}
                            variant="light"
                            radius="xl"
                            leftSection={row.status === 'on-track' ? <IconCheck size={12} /> : <IconAlertTriangle size={12} />}
                            style={{ minWidth: 80, justifyContent: 'center' }}
                          >
                            {row.status === 'on-track' ? 'On Track' : row.status === 'attention' ? 'Atencion' : 'Critico'}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={7} ta="center" py="xl">
                        <Stack align="center" gap="sm">
                          <IconChartBar size={40} color="#9A968A" opacity={0.4} />
                          <Text size="sm" c="dimmed">No hay métricas disponibles</Text>
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
              <Group gap="sm">
                <Badge variant="light" color="teal" radius="sm">
                  <Group gap={4}>
                    <IconBox size={12} />
                    {onTrackCount} metricas On Track
                  </Group>
                </Badge>
                <Text size="xs" c="dimmed">
                  Proyeccion basada en tendencia actual
                </Text>
              </Group>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ===== VISTA RESUMIDO ===== */}
      {viewMode === 'resumido' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '24px' }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group gap="sm" mb="lg">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconChartPie size={18} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Resumen Ejecutivo</Text>
                <Text size="xs" c="dimmed">Vista consolidada de métricas clave</Text>
              </Stack>
            </Group>

            <Divider mb="lg" />

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
              <Card p="lg" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Plan Total</Text>
                <Text size="28px" fw={800} c="#2A6A8A">
                  ${totalPlan >= 1000000 ? `${(totalPlan / 1000000).toFixed(2)}M` : 
                   totalPlan >= 1000 ? `${(totalPlan / 1000).toFixed(1)}K` : 
                   totalPlan.toLocaleString()}
                </Text>
                <Progress value={100} color="#2A6A8A" size="sm" radius="xl" mt="xs" />
                <Text size="xs" c="dimmed" mt={4}>Presupuesto total</Text>
              </Card>

              <Card p="lg" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Real Acumulado</Text>
                <Text size="28px" fw={800} c="#1F5C3A">
                  ${totalReal >= 1000000 ? `${(totalReal / 1000000).toFixed(2)}M` : 
                   totalReal >= 1000 ? `${(totalReal / 1000).toFixed(1)}K` : 
                   totalReal.toLocaleString()}
                </Text>
                <Progress 
                  value={totalPlan > 0 ? (totalReal / totalPlan) * 100 : 0} 
                  color="#1F5C3A" 
                  size="sm" 
                  radius="xl" 
                  mt="xs" 
                />
                <Text size="xs" c="dimmed" mt={4}>
                  {totalPlan > 0 ? ((totalReal / totalPlan) * 100).toFixed(1) : 0}% del plan ejecutado
                </Text>
              </Card>

              <Card p="lg" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Estado General</Text>
                <Group gap="xs" mt={4}>
                  <Badge size="lg" color="green" variant="light">
                    <Group gap={4}>
                      <IconCheck size={14} />
                      {onTrackCount} On Track
                    </Group>
                  </Badge>
                  <Badge size="lg" color="yellow" variant="light">
                    <Group gap={4}>
                      <IconAlertTriangle size={14} />
                      {attentionCount} Atención
                    </Group>
                  </Badge>
                  <Badge size="lg" color="red" variant="light">
                    <Group gap={4}>
                      <IconAlertTriangle size={14} />
                      {criticalCount} Crítico
                    </Group>
                  </Badge>
                </Group>
                <Progress 
                  value={metrics.length > 0 ? (onTrackCount / metrics.length) * 100 : 0} 
                  color="green" 
                  size="sm" 
                  radius="xl" 
                  mt="xs" 
                />
                <Text size="xs" c="dimmed" mt={4}>
                  {metrics.length > 0 ? Math.round((onTrackCount / metrics.length) * 100) : 0}% de métricas en verde
                </Text>
              </Card>
            </SimpleGrid>

            <Divider my="lg" />

            <Group justify="space-between">
              <Group gap="sm">
                <Badge variant="light" color="teal" radius="sm">
                  <Group gap={4}>
                    <IconAlertTriangle size={12} />
                    Impacto desviaciones: ${totalImpact.toLocaleString()}
                  </Group>
                </Badge>
              </Group>
              <Group gap="sm">
                <Button size="xs" variant="light" color="teal" leftSection={<IconEye size={14} />}>
                  Ver detalle completo
                </Button>
              </Group>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ===== DESVIACIONES ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#C0392B' }}>
                <IconAlertTriangle size={18} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#C0392B">Desviaciones del Plan</Text>
                <Text size="xs" c="dimmed">Donde se esta yendo el plan · Acciones recomendadas</Text>
              </Stack>
            </Group>
            <Badge variant="light" color="red" radius="sm">
              <Group gap={4}>
                <IconAlertTriangle size={12} />
                {deviations.filter(d => d.severity === 'high').length} criticas
              </Group>
            </Badge>
          </Group>

          <Divider mb="lg" />

          <Grid>
            {deviations.length > 0 ? (
              deviations.map((item, idx) => (
                <Grid.Col key={idx} span={{ base: 12, md: 4 }}>
                  <Card 
                    p="md" 
                    radius="md" 
                    withBorder
                    style={{ 
                      borderColor: getSeverityColor(item.severity),
                      backgroundColor: `${getSeverityColor(item.severity)}06`,
                      height: '100%',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleViewDeviationDetail(item)}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <Group gap="sm" mb="xs">
                      <ThemeIcon 
                        size="sm" 
                        radius="xl" 
                        color="red" 
                        variant="light"
                        style={{ backgroundColor: `${getSeverityColor(item.severity)}20`, color: getSeverityColor(item.severity) }}
                      >
                        <IconAlertTriangle size={14} />
                      </ThemeIcon>
                      <Text fw={700} size="sm" c={getSeverityColor(item.severity)}>
                        {item.signal_text}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed" mb="sm">{item.detail}</Text>
                    <Divider my="xs" />
                    <Group justify="space-between" mt="xs">
                      <Group gap="xs" style={{ flex: 1 }}>
                        <Badge size="xs" color="teal" variant="light" radius="sm">
                          Accion
                        </Badge>
                        <Text size="xs" fw={600} c="#1F5C3A" truncate>{item.action || 'Pendiente'}</Text>
                      </Group>
                      <Badge 
                        size="xs" 
                        color={item.severity === 'high' ? 'red' : 'yellow'} 
                        variant="light" 
                        radius="sm"
                      >
                        ${item.impact_amount.toLocaleString()}
                      </Badge>
                    </Group>
                  </Card>
                </Grid.Col>
              ))
            ) : (
              <Grid.Col span={12}>
                <Box ta="center" py="xl">
                  <IconCheck size={40} color="#1F5C3A" opacity={0.4} />
                  <Text size="sm" c="dimmed" mt="sm">No hay desviaciones activas</Text>
                  <Text size="xs" c="dimmed">Todas las metricas estan en linea con el plan</Text>
                </Box>
              </Grid.Col>
            )}
          </Grid>

          <Divider my="lg" />

          <Group justify="space-between">
            <Group gap="sm">
              <ThemeIcon size="sm" radius="xl" color="red" variant="light">
                <IconAlertTriangle size={14} />
              </ThemeIcon>
              <Text size="xs" c="dimmed">
                <strong>{deviations.filter(d => d.severity === 'high').length}</strong> desviaciones criticas 
                · <strong>{deviations.filter(d => d.severity === 'medium').length}</strong> en seguimiento
              </Text>
            </Group>
            <Group gap="sm">
              <Badge variant="light" color="red" radius="sm">
                <Group gap={4}>
                  <IconCurrencyDollar size={12} />
                  Impacto total: ${totalImpact.toLocaleString()}
                </Group>
              </Badge>
              <Button size="xs" variant="subtle" color="teal" rightSection={<IconEye size={14} />}>
                Ver todas
              </Button>
            </Group>
          </Group>
        </Card>
      </motion.div>

      {/* ============================================================
          MODAL: Detalle de Desviación
      ============================================================ */}
      <Modal
        opened={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedDeviation(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#C0392B' }}>
              <IconAlertTriangle size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>{selectedDeviation?.signal_text}</Text>
              <Text size="xs" c="dimmed">Detalle de la desviación</Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        {selectedDeviation && (
          <Stack gap="md">
            <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Text size="xs" c="dimmed" fw={600}>Detalle</Text>
              <Text size="sm" c="#3A3A34">{selectedDeviation.detail}</Text>
            </Card>

            <SimpleGrid cols={2} spacing="md">
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Severidad</Text>
                <Badge 
                  size="lg" 
                  color={selectedDeviation.severity === 'high' ? 'red' : selectedDeviation.severity === 'medium' ? 'yellow' : 'blue'} 
                  variant="light"
                >
                  {selectedDeviation.severity === 'high' ? 'Alta' : selectedDeviation.severity === 'medium' ? 'Media' : 'Baja'}
                </Badge>
              </Card>
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Impacto</Text>
                <Text size="xl" fw={800} c="#C0392B">${selectedDeviation.impact_amount.toLocaleString()}</Text>
              </Card>
            </SimpleGrid>

            <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Text size="xs" c="dimmed" fw={600}>Acción</Text>
              <Text size="sm" c="#3A3A34">{selectedDeviation.action || 'Pendiente'}</Text>
            </Card>

            <Divider />

            <Group justify="space-between">
              <Button variant="subtle" color="gray" onClick={() => setDetailModalOpen(false)}>
                Cerrar
              </Button>
              <Group gap="sm">
                <Button
                  size="xs"
                  variant="light"
                  color="teal"
                  leftSection={<IconEdit size={14} />}
                  onClick={() => {
                    setDetailModalOpen(false);
                    handleEditDeviation(selectedDeviation);
                  }}
                >
                  Editar
                </Button>
              </Group>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* ============================================================
          MODAL: Editar Desviación
      ============================================================ */}
      <Modal
        opened={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDeviation(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconEdit size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Editar Desviación</Text>
              <Text size="xs" c="dimmed">{selectedDeviation?.signal_text}</Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        <Stack gap="md">
          <Select
            label="Estado"
            value={editForm.status}
            onChange={(value) => setEditForm({ ...editForm, status: value || '' })}
            data={[
              { value: 'active', label: 'Activa' },
              { value: 'resolved', label: 'Resuelta' },
              { value: 'dismissed', label: 'Descartada' },
            ]}
            required
          />
          <Textarea
            label="Acción"
            placeholder="Descripción de la acción tomada"
            value={editForm.action}
            onChange={(e) => setEditForm({ ...editForm, action: e.currentTarget.value })}
            rows={3}
          />

          <Divider />

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setEditModalOpen(false);
                setSelectedDeviation(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconCheck size={16} />}
              onClick={handleSaveEdit}
              loading={isLoading}
            >
              Guardar Cambios
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

export default GrowerSeasonPlanVsReal;