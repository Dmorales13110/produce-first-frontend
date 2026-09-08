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
  SegmentedControl,
  Progress,
  ThemeIcon,
  Divider,
  Tooltip,
  ActionIcon,
  Select,
  Grid,
  RingProgress,
  Button,
  Avatar,
  Alert,
  Loader,
  Center,
  Modal,
  ScrollArea,
  Menu,
} from '@mantine/core';
import {
  IconRoute,
  IconPlant2,
  IconAlertCircle,
  IconCheck,
  IconTrendingUp,
  IconArrowUpRight,
  IconArrowDownRight,
  IconCurrencyDollar,
  IconChartBar,
  IconEye,
  IconFilter,
  IconRefresh,
  IconDownload,
  IconGauge,
  IconBuildingWarehouse,
  IconCalendar,
  IconUsers,
  IconBuilding,
  IconTarget,
  IconBox,
  IconReport,
  IconAnalyze,
  IconBrandSpeedtest,
  IconLeaf,
  IconSeeding,
  IconFlower,
  IconTree,
  IconClock,
  IconDotsVertical,
  IconFileExport,
  IconPrinter,
  IconZoom,
  IconInfoCircle,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { usePLSector } from './hooks/usePLSector';
import { notifications } from '@mantine/notifications';

export function GrowerPLSector() {
  const {
    liveSectors,
    closedSectors,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
  } = usePLSector();

  const [filterVivo, setFilterVivo] = useState('Todos');
  const [viewMode, setViewMode] = useState('vivos');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<any>(null);
  const [sectorType, setSectorType] = useState<'live' | 'closed'>('live');
  const [showAllLive, setShowAllLive] = useState(false);
  const [showAllClosed, setShowAllClosed] = useState(false);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleRefresh = async () => {
    await refresh();
    notifications.show({
      title: 'Datos actualizados',
      message: 'El P&L por sector ha sido actualizado',
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

  const handleViewSectorDetail = (sector: any, type: 'live' | 'closed') => {
    setSelectedSector(sector);
    setSectorType(type);
    setDetailModalOpen(true);
  };

  const handleViewAllLive = () => {
    setShowAllLive(true);
    notifications.show({
      title: 'Mostrando todos los sectores',
      message: `${liveSectors.length} sectores activos`,
      color: 'blue',
      autoClose: 2000,
    });
  };

  const handleViewAllClosed = () => {
    setShowAllClosed(true);
    notifications.show({
      title: 'Mostrando todas las posturas',
      message: `${closedSectors.length} posturas cerradas`,
      color: 'blue',
      autoClose: 2000,
    });
  };

  const handleFilterChange = (value: string) => {
    setFilterVivo(value);
    if (value === 'Todos') {
      setFilters({ ...filters, status: undefined });
    } else if (value === 'Sanos') {
      setFilters({ ...filters, status: 'sano' });
    } else if (value === 'En rojo') {
      setFilters({ ...filters, status: 'en rojo' });
    }
  };

  // ============================================================
  // FILTROS
  // ============================================================

  const filteredLiveSectors = liveSectors.filter(sector => {
    if (filterVivo === 'Todos') return true;
    if (filterVivo === 'Sanos') return sector.status === 'sano';
    if (filterVivo === 'En rojo') return sector.status === 'en rojo';
    return true;
  });

  const displayLiveSectors = showAllLive ? filteredLiveSectors : filteredLiveSectors.slice(0, 5);
  const displayClosedSectors = showAllClosed ? closedSectors : closedSectors.slice(0, 4);

  // ============================================================
  // CÁLCULOS
  // ============================================================

  const totalVivos = liveSectors.length;
  const totalCerrados = closedSectors.length;
  const enRojo = liveSectors.filter(s => s.status === 'en rojo').length;
  const mejorCerrada = summary?.bestClosed;
  const utilidadTotalCerrados = summary?.totalProfitClosed || 0;

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando P&L por Sector...</Text>
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

  const getStatusColor = (estado: string) => {
    if (estado === 'sano') return 'green';
    if (estado === 'vigilar') return 'yellow';
    return 'red';
  };

  const getStatusIcon = (estado: string) => {
    if (estado === 'sano') return <IconCheck size={14} />;
    if (estado === 'vigilar') return <IconAlertCircle size={14} />;
    return <IconAlertCircle size={14} />;
  };

  const getStatusLabel = (estado: string) => {
    if (estado === 'sano') return 'Sano';
    if (estado === 'vigilar') return 'Vigilar';
    return 'En Rojo';
  };

  const mockData = {
    temporada: 'Invierno 2026-2027',
    semanaActual: 48,
    fechaCorte: '27-nov-2026',
    totalHa: 182.8,
    totalPosturas: 224,
    agronomos: ['Ing. R. Silva', 'Ing. M. Gomez', 'Ing. N. Hernandez']
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
                G-11 · P&L por Sector
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                {mockData.temporada}
              </Badge>
            </Group>
            <Group gap="sm" align="center">
              <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                P&L por Sector
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
                <Text size="lg" fw={700}>{totalVivos + totalCerrados}</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Total Sectores</Text>
              </Stack>
            </Group>
            <RingProgress
              size={90}
              thickness={10}
              sections={[{ value: 68, color: '#FFFFFF' }]}
              label={
                <Stack align="center" gap={0}>
                  <Text size="lg" fw={800} style={{ color: '#FFFFFF' }}>68%</Text>
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Sectores Vivos</Text>
                <Text size="28px" fw={800} c="#1F5C3A">{totalVivos}</Text>
                <Group gap={4}>
                  <IconTrendingUp size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>P&L en movimiento</Text>
                </Group>
                <Badge size="xs" color="teal" variant="light" radius="sm">Activos</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconRoute size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Posturas Cerradas</Text>
                <Text size="28px" fw={800} c="#2A6A8A">{totalCerrados}</Text>
                <Group gap={4}>
                  <IconCheck size={14} color="#2A6A8A" />
                  <Text size="xs" c="#2A6A8A" fw={600}>P&L final auditado</Text>
                </Group>
                <Badge size="xs" color="blue" variant="light" radius="sm">${utilidadTotalCerrados.toLocaleString()} utilidad</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconPlant2 size={20} stroke={2} />
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
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Mejor Cerrada</Text>
                <Text size="20px" fw={800} c="#1F5C3A">{mejorCerrada?.sector_code || 'N/A'}</Text>
                <Group gap={4}>
                  <IconCurrencyDollar size={14} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>${mejorCerrada?.profit_per_box || 0}/cj</Text>
                </Group>
                <Badge size="xs" color="green" variant="light" radius="sm">+{mejorCerrada?.vs_plan || '$0'} vs plan</Badge>
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
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">En Rojo Hoy</Text>
                <Text size="28px" fw={800} c="#C0392B">{enRojo}</Text>
                <Group gap={4}>
                  <IconAlertCircle size={14} color="#C0392B" />
                  <Text size="xs" c="#C0392B" fw={600}>Yield bajo o gasto alto</Text>
                </Group>
                <Badge size="xs" color="red" variant="light" radius="sm">Requiere atencion</Badge>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C0392B' }}>
                <IconAlertCircle size={20} stroke={2} />
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
              { value: 'vivos', label: 'Vivos' },
              { value: 'cerrados', label: 'Cerrados' },
            ]}
            styles={{
              root: { backgroundColor: '#F5F3EE' },
              indicator: { backgroundColor: '#1F5C3A' },
              label: { fontWeight: 600 }
            }}
          />
          {viewMode === 'vivos' && (
            <SegmentedControl
              size="xs"
              value={filterVivo}
              onChange={handleFilterChange}
              data={['Todos', 'En rojo', 'Sanos']}
              styles={{
                root: { backgroundColor: '#F5F3EE' },
                indicator: { backgroundColor: '#2A6A8A' },
                label: { fontWeight: 600 }
              }}
            />
          )}
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

      {/* ===== VISTA VIVOS ===== */}
      {viewMode === 'vivos' && (
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
                  <IconRoute size={18} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="sm" fw={700} c="#3A3A34">Sectores Vivos</Text>
                  <Text size="xs" c="dimmed">
                    Mostrando {displayLiveSectors.length} de {filteredLiveSectors.length} sectores
                    {filterVivo !== 'Todos' && ` · Filtro: ${filterVivo}`}
                  </Text>
                </Stack>
              </Group>
              <Group gap="sm">
                {filterVivo !== 'Todos' && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => handleFilterChange('Todos')}
                  >
                    Limpiar filtro
                  </Button>
                )}
                {!showAllLive && filteredLiveSectors.length > 5 && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="teal"
                    rightSection={<IconEye size={14} />}
                    onClick={handleViewAllLive}
                  >
                    Ver todos ({filteredLiveSectors.length})
                  </Button>
                )}
                {showAllLive && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => setShowAllLive(false)}
                  >
                    Mostrar menos
                  </Button>
                )}
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
                    <Table.Th style={{ width: '14%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Sector</Table.Th>
                    <Table.Th style={{ width: '16%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Cultivo</Table.Th>
                    <Table.Th style={{ width: '8%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Ha</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Gasto Acum.</Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Cajas</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Liq. Proy.</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Utilidad</Table.Th>
                    <Table.Th style={{ width: '8%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>$/cj</Table.Th>
                    <Table.Th style={{ width: '8%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Estado</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {displayLiveSectors.length > 0 ? (
                    displayLiveSectors.map((row, idx) => {
                      const statusColor = getStatusColor(row.status);
                      return (
                        <Table.Tr 
                          key={idx} 
                          style={{ 
                            borderBottom: '1px solid #EFECE3',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF9F5'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          onClick={() => handleViewSectorDetail(row, 'live')}
                        >
                          <Table.Td>
                            <Group gap="sm" wrap="nowrap">
                              <ThemeIcon size="sm" radius="xl" style={{ backgroundColor: `${statusColor === 'green' ? '#1F5C3A' : statusColor === 'yellow' ? '#C08412' : '#C0392B'}20`, color: statusColor === 'green' ? '#1F5C3A' : statusColor === 'yellow' ? '#C08412' : '#C0392B', flexShrink: 0 }}>
                                {statusColor === 'green' ? <IconLeaf size={14} /> : <IconAlertCircle size={14} />}
                              </ThemeIcon>
                              <Text fw={700} c="#1F5C3A" size="xs">{row.sector_code}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text size="xs">{row.crop}</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            <Badge variant="outline" color="gray" size="sm" radius="sm">
                              {row.area_ha} ha
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="xs" c="#3A3A34">${row.accumulated_expense.toLocaleString()}</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right' }}>
                            <Text size="xs" fw={600}>{row.boxes_harvested.toLocaleString()}</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right' }}>
                            <Text size="xs">${row.projected_liquidation.toLocaleString()}</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right' }}>
                            <Text size="xs" fw={700} c={row.profit < 0 ? '#C0392B' : '#1F5C3A'}>
                              {row.profit < 0 ? '-' : ''}${Math.abs(row.profit).toLocaleString()}
                            </Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right' }}>
                            <Text size="xs" fw={600}>${row.profit_per_box.toFixed(2)}</Text>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            <Badge 
                              size="sm"
                              color={statusColor}
                              variant="light"
                              radius="xl"
                              leftSection={getStatusIcon(row.status)}
                              style={{ minWidth: 70, justifyContent: 'center' }}
                            >
                              {getStatusLabel(row.status)}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={9} ta="center" py="xl">
                        <Stack align="center" gap="sm">
                          <IconRoute size={40} color="#9A968A" opacity={0.4} />
                          <Text size="sm" c="dimmed">
                            {filterVivo !== 'Todos' ? `No hay sectores ${filterVivo.toLowerCase()}` : 'No hay sectores vivos'}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {filterVivo !== 'Todos' ? 'Prueba con otro filtro' : 'Los sectores aparecerán aquí cuando estén activos'}
                          </Text>
                          {filterVivo !== 'Todos' && (
                            <Button
                              size="xs"
                              variant="subtle"
                              color="teal"
                              onClick={() => handleFilterChange('Todos')}
                            >
                              Ver todos los sectores
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
                  <Box style={{ width: 10, height: 10, backgroundColor: '#1F5C3A', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Sano</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#C08412', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Vigilar</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#C0392B', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">En rojo</Text>
                </Group>
              </Group>
              <Group gap="sm">
                <Badge variant="light" color="teal" radius="sm">
                  <Group gap={4}>
                    <IconBox size={12} />
                    {liveSectors.reduce((acc, s) => acc + s.boxes_harvested, 0).toLocaleString()} cajas totales
                  </Group>
                </Badge>
                <Badge variant="light" color="blue" radius="sm">
                  <Group gap={4}>
                    <IconCurrencyDollar size={12} />
                    ${liveSectors.reduce((acc, s) => acc + s.profit, 0).toLocaleString()} utilidad total
                  </Group>
                </Badge>
              </Group>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ===== VISTA CERRADOS ===== */}
      {viewMode === 'cerrados' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" mb="lg">
              <Group gap="sm">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                  <IconPlant2 size={18} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="sm" fw={700} c="#3A3A34">Posturas Cerradas</Text>
                  <Text size="xs" c="dimmed">
                    Mostrando {displayClosedSectors.length} de {closedSectors.length} posturas
                  </Text>
                </Stack>
              </Group>
              <Group gap="sm">
                {!showAllClosed && closedSectors.length > 4 && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="teal"
                    rightSection={<IconEye size={14} />}
                    onClick={handleViewAllClosed}
                  >
                    Ver todas ({closedSectors.length})
                  </Button>
                )}
                {showAllClosed && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => setShowAllClosed(false)}
                  >
                    Mostrar menos
                  </Button>
                )}
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
                    <Table.Th style={{ width: '15%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Postura</Table.Th>
                    <Table.Th style={{ width: '16%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Cultivo</Table.Th>
                    <Table.Th style={{ width: '8%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Ha</Table.Th>
                    <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Cajas</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Ingreso</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Costo</Table.Th>
                    <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Utilidad</Table.Th>
                    <Table.Th style={{ width: '8%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>$/cj</Table.Th>
                    <Table.Th style={{ width: '7%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>vs Plan</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {displayClosedSectors.length > 0 ? (
                    displayClosedSectors.map((row, idx) => (
                      <Table.Tr 
                        key={idx} 
                        style={{ 
                          borderBottom: '1px solid #EFECE3',
                          backgroundColor: row.is_best ? '#E8F5E9' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = row.is_best ? '#C8E6C9' : '#FAF9F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = row.is_best ? '#E8F5E9' : 'transparent'}
                        onClick={() => handleViewSectorDetail(row, 'closed')}
                      >
                        <Table.Td>
                          <Group gap="sm" wrap="nowrap">
                            <ThemeIcon size="sm" radius="xl" style={{ backgroundColor: `${row.is_best ? '#1F5C3A' : '#2A6A8A'}20`, color: row.is_best ? '#1F5C3A' : '#2A6A8A', flexShrink: 0 }}>
                              <IconSeeding size={14} />
                            </ThemeIcon>
                            <Text fw={700} c={row.is_best ? '#1F5C3A' : '#3A3A34'} size="xs">
                              {row.sector_code}
                            </Text>
                            {row.is_best && (
                              <Badge size="xs" color="green" variant="light" radius="sm">
                                Mejor
                              </Badge>
                            )}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs">{row.crop}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge variant="outline" color="gray" size="sm" radius="sm">
                            {row.area_ha} ha
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" fw={600}>{row.boxes_harvested.toLocaleString()}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs">${row.revenue.toLocaleString()}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs">${row.cost.toLocaleString()}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" fw={700} c="#1F5C3A">${row.profit.toLocaleString()}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Text size="xs" fw={700}>${row.profit_per_box.toFixed(2)}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Badge 
                            size="sm"
                            color={row.vs_plan.startsWith('+') ? 'green' : 'red'}
                            variant="light"
                            radius="xl"
                            style={{ minWidth: 60, justifyContent: 'center' }}
                          >
                            {row.vs_plan}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={9} ta="center" py="xl">
                        <Stack align="center" gap="sm">
                          <IconPlant2 size={40} color="#9A968A" opacity={0.4} />
                          <Text size="sm" c="dimmed">No hay posturas cerradas</Text>
                          <Text size="xs" c="dimmed">Las posturas aparecerán aquí cuando se completen</Text>
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
                  <Text size="xs" c="dimmed">Por encima del plan</Text>
                </Group>
                <Group gap={4}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#C0392B', borderRadius: 3 }} />
                  <Text size="xs" c="dimmed">Por debajo del plan</Text>
                </Group>
              </Group>
              <Group gap="sm">
                <Badge variant="light" color="green" radius="sm">
                  <Group gap={4}>
                    <IconTrendingUp size={12} />
                    Promedio: +$0.35 vs plan
                  </Group>
                </Badge>
                <Badge variant="light" color="blue" radius="sm">
                  <Group gap={4}>
                    <IconCurrencyDollar size={12} />
                    ${utilidadTotalCerrados.toLocaleString()} utilidad total
                  </Group>
                </Badge>
                <Button size="xs" variant="subtle" color="teal" rightSection={<IconDownload size={14} />} onClick={handleExport}>
                  Exportar
                </Button>
              </Group>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* ============================================================
          MODAL: Detalle de Sector
      ============================================================ */}
      <Modal
        opened={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedSector(null);
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconInfoCircle size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>{selectedSector?.sector_code}</Text>
              <Text size="xs" c="dimmed">
                {sectorType === 'live' ? 'Sector Vivo - P&L en tiempo real' : 'Postura Cerrada - P&L Auditado'}
              </Text>
            </Stack>
          </Group>
        }
        size="lg"
        centered
      >
        {selectedSector && (
          <Stack gap="md">
            {/* Información general */}
            <SimpleGrid cols={3} spacing="md">
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Cultivo</Text>
                <Text size="lg" fw={700} c="#3A3A34">{selectedSector.crop}</Text>
              </Card>
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Hectáreas</Text>
                <Text size="lg" fw={700} c="#1F5C3A">{selectedSector.area_ha} ha</Text>
              </Card>
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Cajas Cosechadas</Text>
                <Text size="lg" fw={700} c="#2A6A8A">{selectedSector.boxes_harvested.toLocaleString()}</Text>
              </Card>
            </SimpleGrid>

            <Divider />

            {/* Financiero */}
            <Text size="sm" fw={600}>Resumen Financiero</Text>
            <SimpleGrid cols={sectorType === 'live' ? 3 : 4} spacing="md">
              {sectorType === 'live' && (
                <>
                  <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                    <Text size="xs" c="dimmed" fw={600}>Gasto Acumulado</Text>
                    <Text size="lg" fw={700} c="#C08412">${selectedSector.accumulated_expense.toLocaleString()}</Text>
                  </Card>
                  <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                    <Text size="xs" c="dimmed" fw={600}>Liquidación Proyectada</Text>
                    <Text size="lg" fw={700} c="#2A6A8A">${selectedSector.projected_liquidation.toLocaleString()}</Text>
                  </Card>
                </>
              )}
              {sectorType === 'closed' && (
                <>
                  <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                    <Text size="xs" c="dimmed" fw={600}>Ingreso Total</Text>
                    <Text size="lg" fw={700} c="#1F5C3A">${selectedSector.revenue.toLocaleString()}</Text>
                  </Card>
                  <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                    <Text size="xs" c="dimmed" fw={600}>Costo Total</Text>
                    <Text size="lg" fw={700} c="#C08412">${selectedSector.cost.toLocaleString()}</Text>
                  </Card>
                </>
              )}
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Utilidad</Text>
                <Text size="lg" fw={700} c={selectedSector.profit < 0 ? '#C0392B' : '#1F5C3A'}>
                  {selectedSector.profit < 0 ? '-' : ''}${Math.abs(selectedSector.profit).toLocaleString()}
                </Text>
              </Card>
              <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                <Text size="xs" c="dimmed" fw={600}>Utilidad por Caja</Text>
                <Text size="lg" fw={700} c="#2A6A8A">${selectedSector.profit_per_box.toFixed(2)}</Text>
              </Card>
            </SimpleGrid>

            {sectorType === 'closed' && (
              <>
                <Divider />
                <Card p="md" radius="md" style={{ backgroundColor: '#E8F5E9', border: '1px solid #1F5C3A' }}>
                  <Group justify="space-between">
                    <Group gap={4}>
                      <IconTrendingUp size={16} color="#1F5C3A" />
                      <Text size="sm" fw={600} c="#1F5C3A">Comparativa vs Plan</Text>
                    </Group>
                    <Badge 
                      size="lg" 
                      color={selectedSector.vs_plan.startsWith('+') ? 'green' : 'red'} 
                      variant="light"
                    >
                      {selectedSector.vs_plan}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed" mt={4}>
                    {selectedSector.vs_plan.startsWith('+') 
                      ? 'Esta postura superó el plan establecido' 
                      : 'Esta postura está por debajo del plan establecido'}
                  </Text>
                </Card>
              </>
            )}

            {sectorType === 'live' && (
              <>
                <Divider />
                <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                  <Group justify="space-between">
                    <Group gap={4}>
                      <IconGauge size={16} color="#9A968A" />
                      <Text size="xs" fw={600} c="dimmed">Progreso</Text>
                    </Group>
                    <Group gap="md">
                      <Text size="sm" fw={700} c="#1F5C3A">{selectedSector.progress_percent}%</Text>
                      <Progress value={selectedSector.progress_percent} color="#1F5C3A" size="sm" radius="xl" style={{ width: 100 }} />
                    </Group>
                  </Group>
                  <Group justify="space-between" mt={4}>
                    <Text size="xs" c="dimmed" fw={600}>Tendencia</Text>
                    <Badge 
                      size="sm" 
                      color={selectedSector.trend.startsWith('+') ? 'green' : 'red'} 
                      variant="light"
                    >
                      {selectedSector.trend}
                    </Badge>
                  </Group>
                </Card>
              </>
            )}

            <Divider />

            <Group justify="flex-end">
              <Button variant="subtle" color="gray" onClick={() => setDetailModalOpen(false)}>
                Cerrar
              </Button>
              <Button size="xs" variant="subtle" color="teal" rightSection={<IconReport size={14} />}>
                Reporte completo
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}

export default GrowerPLSector;