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
  Progress,
  ThemeIcon,
  Divider,
  RingProgress,
  Tooltip,
  ActionIcon,
  SegmentedControl,
  Button,
  Grid,
  Avatar,
  Skeleton,
  Alert,
  Loader,
  Center,
  Modal,
  ScrollArea,
  Menu,
  TextInput,
  NumberInput,
  Textarea,
} from '@mantine/core';
import {
  IconChartBar,
  IconAlertTriangle,
  IconCheck,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowDownRight,
  IconPlant,
  IconBuildingWarehouse,
  IconEye,
  IconRefresh,
  IconDownload,
  IconGauge,
  IconTarget,
  IconLeaf,
  IconSeeding,
  IconFlower,
  IconTree,
  IconClock,
  IconCalendar,
  IconUsers,
  IconBuilding,
  IconBrandSpeedtest,
  IconAnalyze,
  IconReport,
  IconChartPie,
  IconDotsVertical,
  IconFileExport,
  IconPrinter,
  IconEdit,
  IconZoom,
  IconInfoCircle,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useYieldVsFicha } from './hooks/useYieldVsFicha';
import { notifications } from '@mantine/notifications';

export function GrowerYieldVsFicha() {
  const {
    crops,
    weeklyData,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    updateCrop,
  } = useYieldVsFicha();

  const [viewMode, setViewMode] = useState('detallado');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    actual_yield: 0,
    notes: '',
  });
  const [showAll, setShowAll] = useState(false);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleRefresh = async () => {
    await refresh();
    notifications.show({
      title: 'Datos actualizados',
      message: 'El rendimiento vs ficha ha sido actualizado',
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

  const handleViewDetail = (crop: any) => {
    setSelectedCrop(crop);
    setDetailModalOpen(true);
  };

  const handleEditCrop = (crop: any) => {
    setSelectedCrop(crop);
    setEditForm({
      actual_yield: crop.actual_yield,
      notes: crop.notes || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCrop) return;

    try {
      await updateCrop(selectedCrop.id, {
        actual_yield: editForm.actual_yield,
        notes: editForm.notes,
      });
      notifications.show({
        title: '✅ Cultivo actualizado',
        message: `${selectedCrop.crop_name} actualizado exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
      setEditModalOpen(false);
      setSelectedCrop(null);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al actualizar cultivo',
        color: 'red',
        icon: <IconAlertTriangle size={16} />,
      });
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    if (value === 'todos') {
      setFilters({ ...filters, status: undefined });
    } else if (value === 'excelente') {
      setFilters({ ...filters, status: 'excellent' });
    } else if (value === 'critico') {
      setFilters({ ...filters, status: 'critical' });
    }
  };

  // ============================================================
  // FILTROS Y DATOS
  // ============================================================

  const filteredCrops = crops.filter(crop => {
    if (filterStatus === 'todos') return true;
    if (filterStatus === 'excelente') return crop.status === 'excellent';
    if (filterStatus === 'critico') return crop.status === 'critical';
    return true;
  });

  const displayCrops = showAll ? filteredCrops : filteredCrops.slice(0, 5);

  // ============================================================
  // CÁLCULOS
  // ============================================================

  const averageYield = summary?.averageYield || 0;
  const totalClosed = summary?.totalClosed || 0;
  const aboveTarget = summary?.aboveTarget || 0;
  const belowTarget = summary?.belowTarget || 0;
  const bestCrop = summary?.bestCrop;
  const worstCrop = summary?.worstCrop;

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando datos de rendimiento...</Text>
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
    if (status === 'excellent') return '#1F5C3A';
    if (status === 'good') return '#2A6A8A';
    if (status === 'critical') return '#C0392B';
    return '#C08412';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'excellent') return 'Excelente';
    if (status === 'good') return 'Sano';
    if (status === 'critical') return 'Crítico';
    return 'Atención';
  };

  const getStatusBadgeColor = (status: string) => {
    if (status === 'excellent') return 'green';
    if (status === 'good') return 'teal';
    if (status === 'critical') return 'red';
    return 'yellow';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'excellent') return <IconCheck size={14} />;
    if (status === 'good') return <IconTrendingUp size={14} />;
    if (status === 'critical') return <IconAlertTriangle size={14} />;
    return <IconAlertTriangle size={14} />;
  };

  const mockData = {
    totalHa: 182.8,
    totalPosturas: 224,
    temporada: 'Invierno 2026-2027',
    semanaActual: 48,
    semanasTotales: 30,
    fechaCorte: '27-nov-2026',
    agronomos: ['Ing. R. Silva', 'Ing. M. Gomez', 'Ing. N. Hernandez'],
    topVariedades: ['Shanghai Bok Choy', 'Baby Napa', 'Coliflor China']
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
        <Box
          style={{
            position: 'absolute',
            top: -50,
            right: -30,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: -80,
            left: '60%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.02)',
          }}
        />

        <Group justify="space-between" align="center" style={{ position: 'relative', zIndex: 1 }}>
          <Stack gap={4}>
            <Group gap="xs">
              <Badge size="xs" variant="white" color="teal" radius="sm">
                G-12 · Yield vs Ficha
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                {mockData.temporada}
              </Badge>
            </Group>
            <Group gap="sm" align="center">
              <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                Yield vs Ficha Técnica
              </Text>
              <Badge size="lg" variant="light" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}>
                Semana {mockData.semanaActual}/{mockData.semanasTotales}
              </Badge>
            </Group>
            <Group gap="xl" mt={2}>
              <Group gap={4}>
                <IconClock size={14} style={{ opacity: 0.7 }} />
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
                <Text size="lg" fw={700}>{averageYield.toFixed(1)}%</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Yield Promedio</Text>
              </Stack>
            </Group>
            <RingProgress
              size={90}
              thickness={10}
              sections={[{ value: Math.min(averageYield, 100), color: '#FFFFFF' }]}
              label={
                <Stack align="center" gap={0}>
                  <Text size="lg" fw={800} style={{ color: '#FFFFFF' }}>{Math.round(averageYield)}%</Text>
                  <Text size="8px" style={{ opacity: 0.7 }}>vs ficha</Text>
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Yield Promedio</Text>
                <Group gap="xs" align="baseline">
                  <Text size="28px" fw={800} c="#1F5C3A">{averageYield.toFixed(1)}%</Text>
                  <Badge size="xs" color="green" variant="light" radius="sm">+2.1%</Badge>
                </Group>
                <Text size="xs" c="dimmed">Real vs Ficha Técnica</Text>
                <Progress value={Math.min(averageYield, 100)} color="#1F5C3A" size="xs" radius="xl" mt={4} />
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
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Mejor Cultivo</Text>
                <Text size="20px" fw={800} c="#1F5C3A">{bestCrop?.crop_name || 'N/A'}</Text>
                <Group gap={4}>
                  <IconArrowUpRight size={14} color="#1F5C3A" />
                  <Text size="xs" fw={700} c="#1F5C3A">{bestCrop?.yield_percent?.toFixed(1) || '0'}%</Text>
                  <Text size="xs" c="dimmed">· {bestCrop?.trend || '0%'}</Text>
                </Group>
                <Badge size="xs" color="green" variant="light" radius="sm">{bestCrop?.trend || '0%'}</Badge>
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
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Peor Cultivo</Text>
                <Text size="20px" fw={800} c="#C0392B">{worstCrop?.crop_name || 'N/A'}</Text>
                <Group gap={4}>
                  <IconArrowDownRight size={14} color="#C0392B" />
                  <Text size="xs" fw={700} c="#C0392B">{worstCrop?.yield_percent?.toFixed(1) || '0'}%</Text>
                  <Text size="xs" c="dimmed">· {worstCrop?.trend || '0%'}</Text>
                </Group>
                <Badge size="xs" color="red" variant="light" radius="sm">{worstCrop?.trend || '0%'}</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C0392B' }}>
                <IconTrendingDown size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Posturas Cerradas</Text>
                <Text size="28px" fw={800} c="#2A6A8A">{totalClosed}</Text>
                <Group gap={4}>
                  <IconBuildingWarehouse size={14} color="#2A6A8A" />
                  <Text size="xs" c="dimmed">Muestra de temporada</Text>
                </Group>
                <Group gap={4}>
                  <Badge size="xs" color="green" variant="light" radius="sm">{aboveTarget} ≥ 95%</Badge>
                  <Badge size="xs" color="red" variant="light" radius="sm">{belowTarget} {'<'} 90%</Badge>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconPlant size={20} stroke={2} />
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
              { value: 'grafico', label: 'Grafico' },
            ]}
            styles={{
              root: { backgroundColor: '#F5F3EE' },
              indicator: { backgroundColor: '#1F5C3A' },
              label: { fontWeight: 600 }
            }}
          />
          <SegmentedControl
            size="xs"
            value={filterStatus}
            onChange={handleFilterChange}
            data={[
              { value: 'todos', label: 'Todos' },
              { value: 'excelente', label: 'Excelente' },
              { value: 'critico', label: 'Critico' },
            ]}
            styles={{
              root: { backgroundColor: '#F5F3EE' },
              indicator: { backgroundColor: '#2A6A8A' },
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
              <Menu.Divider />
              <Menu.Item leftSection={<IconZoom size={14} />}>
                Configurar vista
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

      {/* ===== VISTA GRAFICO ===== */}
      {viewMode === 'grafico' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" mb="lg">
              <Group gap="sm">
                <IconChartBar size={18} color="#1F5C3A" />
                <Stack gap={0}>
                  <Text size="sm" fw={700} c="#3A3A34">Yield por Cultivo</Text>
                  <Text size="xs" c="dimmed">% vs ficha técnica · Línea de 100% es la ficha</Text>
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

            <ScrollArea>
              <Stack gap="lg">
                {displayCrops.length > 0 ? (
                  displayCrops.map((item, i) => (
                    <Box key={i}>
                      <Group justify="space-between" mb={4}>
                        <Group gap="sm" style={{ minWidth: 280 }}>
                          <ThemeIcon size="sm" radius="xl" style={{ backgroundColor: `${getStatusColor(item.status)}20`, color: getStatusColor(item.status) }}>
                            {getStatusIcon(item.status)}
                          </ThemeIcon>
                          <Text size="xs" fw={600} c="#3A3A34">{item.crop_name}</Text>
                          <Badge 
                            size="xs" 
                            color={getStatusBadgeColor(item.status)}
                            variant="light"
                            radius="sm"
                            style={{ minWidth: 60, justifyContent: 'center' }}
                          >
                            {getStatusLabel(item.status)}
                          </Badge>
                        </Group>
                        <Group gap="md" style={{ minWidth: 180, justifyContent: 'flex-end' }}>
                          <Tooltip label={`${item.closed_posturas} posturas cerradas`}>
                            <Group gap={4}>
                              <IconPlant size={12} color="#9A968A" />
                              <Text size="xs" c="dimmed">{item.closed_posturas}</Text>
                            </Group>
                          </Tooltip>
                          <Badge 
                            size="sm"
                            color={item.yield_percent < 90 ? 'red' : item.yield_percent >= 100 ? 'green' : 'teal'}
                            variant="light"
                            radius="xl"
                            style={{ minWidth: 60, justifyContent: 'center' }}
                          >
                            {item.yield_percent.toFixed(1)}%
                          </Badge>
                        </Group>
                      </Group>
                      <Box style={{ position: 'relative', padding: '2px 0' }}>
                        <Progress 
                          value={Math.min(item.yield_percent, 100)} 
                          color={item.yield_percent < 90 ? 'red' : item.yield_percent >= 100 ? 'teal' : 'green'} 
                          size="lg" 
                          radius="xl"
                          style={{ backgroundColor: '#F5F3EE' }}
                        />
                        <Box 
                          style={{
                            position: 'absolute',
                            top: -2,
                            left: '100%',
                            width: 2,
                            height: 'calc(100% + 4px)',
                            backgroundColor: 'rgba(0,0,0,0.12)',
                            transform: 'translateX(-2px)',
                            borderRadius: 2
                          }}
                        />
                      </Box>
                      <Group justify="flex-end" mt={2}>
                        <Text size="9px" c="dimmed">
                          {item.trend?.startsWith('+') ? '↑' : '↓'} Tendencia: {item.trend || '0%'}
                        </Text>
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          color="teal"
                          onClick={() => handleViewDetail(item)}
                        >
                          <IconEye size={12} />
                        </ActionIcon>
                      </Group>
                    </Box>
                  ))
                ) : (
                  <Box ta="center" py="xl">
                    <IconPlant size={40} color="#9A968A" opacity={0.4} />
                    <Text size="sm" c="dimmed" mt="sm">
                      {filterStatus !== 'todos' ? 'No hay cultivos con este filtro' : 'No hay datos de cultivos'}
                    </Text>
                  </Box>
                )}
              </Stack>
            </ScrollArea>

            <Divider my="lg" />

            <Group justify="space-between">
              <Group gap="md">
                <Group gap={4}>
                  <Box style={{ width: 12, height: 12, backgroundColor: '#1F5C3A', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">≥ 100% (Supera ficha)</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 12, height: 12, backgroundColor: '#2A6A8A', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">90% - 100% (Cumple)</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 12, height: 12, backgroundColor: '#C0392B', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">{'< 90%'} (Revision)</Text>
                </Group>
              </Group>
              <Group gap="sm">
                <Badge variant="light" color="green" radius="sm">
                  <Group gap={4}>
                    <IconTrendingUp size={12} />
                    {aboveTarget} cultivos ≥ 95%
                  </Group>
                </Badge>
                <Badge variant="light" color="red" radius="sm">
                  <Group gap={4}>
                    <IconAlertTriangle size={12} />
                    {belowTarget} requieren revision
                  </Group>
                </Badge>
              </Group>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ===== VISTA DETALLADO ===== */}
      {viewMode === 'detallado' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
            <Group justify="space-between" mb="lg">
              <Group gap="sm">
                <IconPlant size={18} color="#1F5C3A" />
                <Stack gap={0}>
                  <Text size="sm" fw={700} c="#3A3A34">Detalle por Cultivo</Text>
                  <Text size="xs" c="dimmed">
                    Mostrando {displayCrops.length} de {filteredCrops.length} cultivos
                    {filterStatus !== 'todos' && ` · Filtro: ${filterStatus}`}
                  </Text>
                </Stack>
              </Group>
              <Group gap="sm">
                {filterStatus !== 'todos' && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => handleFilterChange('todos')}
                  >
                    Limpiar filtro
                  </Button>
                )}
                {!showAll && filteredCrops.length > 5 && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="teal"
                    rightSection={<IconEye size={14} />}
                    onClick={() => setShowAll(true)}
                  >
                    Ver todos ({filteredCrops.length})
                  </Button>
                )}
                {showAll && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => setShowAll(false)}
                  >
                    Mostrar menos
                  </Button>
                )}
                <Button size="xs" variant="light" color="teal" leftSection={<IconEye size={14} />}>
                  Ver todos
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
                  <Table.Tr>
                    <Table.Th style={{ width: '20%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                      <Group gap="4">
                        <IconLeaf size={14} />
                        Cultivo
                      </Group>
                    </Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>
                      Ficha
                    </Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>
                      Real
                    </Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                      Yield
                    </Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                      Posturas
                    </Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                      Tendencia
                    </Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                      Status
                    </Table.Th>
                    <Table.Th style={{ width: '16%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                      Nota
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {displayCrops.length > 0 ? (
                    displayCrops.map((row, idx) => (
                      <Table.Tr 
                        key={idx} 
                        style={{ 
                          borderBottom: '1px solid #EFECE3',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF9F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => handleViewDetail(row)}
                      >
                        <Table.Td>
                          <Group gap="sm" wrap="nowrap">
                            <ThemeIcon size="sm" radius="xl" style={{ backgroundColor: `${getStatusColor(row.status)}20`, color: getStatusColor(row.status), flexShrink: 0 }}>
                              {getStatusIcon(row.status)}
                            </ThemeIcon>
                            <Text fw={700} c="#3A3A34" size="xs" truncate>{row.crop_name}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs">{row.technical_spec.toLocaleString()}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" fw={600}>{row.actual_yield.toLocaleString()}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge 
                            size="sm"
                            color={row.yield_percent < 90 ? 'red' : row.yield_percent >= 100 ? 'green' : 'teal'}
                            variant="light"
                            radius="xl"
                            style={{ minWidth: 60, justifyContent: 'center' }}
                          >
                            {row.yield_percent.toFixed(1)}%
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge variant="outline" color="gray" size="sm" radius="sm">
                            {row.closed_posturas}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            size="xs"
                            color={row.trend?.startsWith('+') ? 'green' : 'red'}
                            variant="light"
                            radius="sm"
                          >
                            {row.trend || '0%'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            size="sm"
                            color={getStatusBadgeColor(row.status)}
                            variant="light"
                            radius="sm"
                            style={{ minWidth: 70, justifyContent: 'center' }}
                          >
                            {getStatusLabel(row.status)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs" wrap="nowrap">
                            <Text size="xs" c="dimmed" truncate>{row.notes || '—'}</Text>
                            <ActionIcon
                              size="xs"
                              variant="subtle"
                              color="teal"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCrop(row);
                              }}
                            >
                              <IconEdit size={12} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={8} ta="center" py="xl">
                        <Stack align="center" gap="sm">
                          <IconPlant size={40} color="#9A968A" opacity={0.4} />
                          <Text size="sm" c="dimmed">
                            {filterStatus !== 'todos' ? 'No hay cultivos con este filtro' : 'No hay datos de cultivos'}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {filterStatus !== 'todos' ? 'Prueba con otro filtro' : 'Los datos apareceran aquí cuando estén disponibles'}
                          </Text>
                          {filterStatus !== 'todos' && (
                            <Button
                              size="xs"
                              variant="subtle"
                              color="teal"
                              onClick={() => handleFilterChange('todos')}
                            >
                              Ver todos los cultivos
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
              <Group gap="md">
                <Group gap={4}>
                  <Box style={{ width: 12, height: 12, backgroundColor: '#1F5C3A', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Excelente (≥ 100%)</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 12, height: 12, backgroundColor: '#2A6A8A', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Sano (90% - 99%)</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 12, height: 12, backgroundColor: '#C0392B', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Critico ({'<'} 90%)</Text>
                </Group>
              </Group>
              <Group gap="sm">
                <Badge variant="light" color="teal" radius="sm">
                  <Group gap={4}>
                    <IconTrendingUp size={12} />
                    {aboveTarget} cultivos ≥ 95%
                  </Group>
                </Badge>
                <Badge variant="light" color="red" radius="sm">
                  <Group gap={4}>
                    <IconAlertTriangle size={12} />
                    {belowTarget} requieren revision
                  </Group>
                </Badge>
                <Button size="xs" variant="subtle" color="teal" rightSection={<IconReport size={14} />}>
                  Reporte completo
                </Button>
              </Group>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ============================================================
          MODAL: Detalle de Cultivo
      ============================================================ */}
      <Modal
        opened={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedCrop(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconInfoCircle size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>{selectedCrop?.crop_name}</Text>
              <Text size="xs" c="dimmed">Detalle de rendimiento vs ficha técnica</Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        {selectedCrop && (
          <Stack gap="md">
            {/* Información general */}
            <SimpleGrid cols={3} spacing="md">
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Ficha Técnica</Text>
                <Text size="xl" fw={800} c="#2A6A8A">{selectedCrop.technical_spec.toLocaleString()}</Text>
              </Card>
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Rendimiento Real</Text>
                <Text size="xl" fw={800} c="#1F5C3A">{selectedCrop.actual_yield.toLocaleString()}</Text>
              </Card>
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Yield</Text>
                <Text size="xl" fw={800} c={selectedCrop.yield_percent >= 95 ? '#1F5C3A' : '#C0392B'}>
                  {selectedCrop.yield_percent.toFixed(1)}%
                </Text>
              </Card>
            </SimpleGrid>

            <Divider />

            <SimpleGrid cols={2} spacing="md">
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Posturas Cerradas</Text>
                <Text size="xl" fw={800} c="#2A6A8A">{selectedCrop.closed_posturas}</Text>
              </Card>
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Tendencia</Text>
                <Badge 
                  size="lg" 
                  color={selectedCrop.trend?.startsWith('+') ? 'green' : 'red'} 
                  variant="light"
                >
                  {selectedCrop.trend || '0%'}
                </Badge>
              </Card>
            </SimpleGrid>

            <Divider />

            <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
              <Text size="xs" c="dimmed" fw={600}>Notas</Text>
              <Text size="sm" c="#3A3A34">{selectedCrop.notes || 'Sin notas registradas'}</Text>
            </Card>

            <Divider />

            <Group justify="space-between">
              <Button 
                variant="subtle" 
                color="gray" 
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedCrop(null);
                }}
              >
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
                    handleEditCrop(selectedCrop);
                  }}
                >
                  Editar
                </Button>
                <Button size="xs" variant="subtle" color="teal" rightSection={<IconReport size={14} />}>
                  Reporte completo
                </Button>
              </Group>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* ============================================================
          MODAL: Editar Cultivo
      ============================================================ */}
      <Modal
        opened={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCrop(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconEdit size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Editar Cultivo</Text>
              <Text size="xs" c="dimmed">{selectedCrop?.crop_name}</Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        <Stack gap="md">
          <NumberInput
            label="Rendimiento Real"
            placeholder="Ingresa el rendimiento real"
            value={editForm.actual_yield}
            onChange={(value) => setEditForm({ ...editForm, actual_yield: Number(value) || 0 })}
            min={0}
            step={10}
            required
          />
          <Textarea
            label="Notas"
            placeholder="Notas sobre el rendimiento"
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.currentTarget.value })}
            rows={3}
          />

          <Divider />

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setEditModalOpen(false);
                setSelectedCrop(null);
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

export default GrowerYieldVsFicha;