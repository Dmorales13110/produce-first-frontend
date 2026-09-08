// src/modules/grower/GrowerForecast.tsx
import React, { useMemo } from 'react';
import { 
  Box, 
  SimpleGrid, 
  Paper, 
  Text, 
  Group, 
  ThemeIcon, 
  Stack, 
  Progress, 
  Badge, 
  Table,
  Divider,
  Grid,
  RingProgress,
  Card,
  Loader,
  Center,
  Alert,
  Button,
  Select
} from '@mantine/core';
import { 
  IconTrendingUp, 
  IconScale, 
  IconCalendarDue, 
  IconChartBar, 
  IconTarget,
  IconArrowUpRight,
  IconChartPie,
  IconChartLine,
  IconBuildingWarehouse,
  IconCheck,
  IconClock,
  IconRefresh,
  IconAlertCircle
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useForecast } from './hooks/useForecast';
import { useCapture } from '../capture/hooks/useCapture';

export function GrowerForecast() {
  const { data, isLoading, error, refresh, setFilters, filters } = useForecast();
  const { growers } = useCapture();

  // Preparar datos para la gráfica
  const chartData = useMemo(() => {
    if (!data?.chartData) return [];
    return data.chartData;
  }, [data]);

  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 1;
    return Math.max(...chartData.map(d => Math.max(d.pronostico, d.real || 0)));
  }, [chartData]);

  // Obtener semanas disponibles (simulado)
  const semanasDisponibles = ['48', '47', '46', '45'];

  // ============================================================
  // ESTADOS DE CARGA Y ERROR
  // ============================================================
  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando pronóstico...</Text>
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

  const kpis = data?.kpis || [];
  const forecastBreakdown = data?.breakdown || [];
  const ranchData = data?.ranchData || [];
  const semana = data?.semana || '48';

  return (
    <Box>
      {/* Encabezado */}
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={0}>
          <Text size="xs" fw={700} c="#1F5C3A" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
            G-05 · Pronóstico
          </Text>
          <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            Cosecha Semanal
          </Text>
          <Text size="sm" c="dimmed">
            Pronóstico vs Real por producto y rancho
          </Text>
        </Stack>
        <Group gap="sm">
          <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
            Semana {semana}
          </Badge>
          <Select
            size="xs"
            placeholder="Semana"
            data={semanasDisponibles.map(s => ({ value: s, label: `Semana ${s}` }))}
            value={filters.semana || semana}
            onChange={(value) => setFilters({ ...filters, semana: value || undefined })}
            style={{ width: 130 }}
            styles={{
              input: { fontWeight: 600, backgroundColor: '#FFFFFF', borderColor: '#E8E5DC' },
            }}
          />
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

      {/* KPIs con animación */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
        {kpis.map((kpi, index) => {
          // Mapeo de iconos
          const iconMap: Record<string, any> = {
            'IconScale': IconScale,
            'IconTarget': IconTarget,
            'IconTrendingUp': IconTrendingUp,
            'IconCalendarDue': IconCalendarDue,
          };
          const Icon = iconMap[kpi.icon] || IconChartBar;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                <Group justify="space-between" align="flex-start">
                  <Stack gap={2}>
                    <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {kpi.title}
                    </Text>
                    <Text size="xl" fw={800} c="#3A3A34">{kpi.value}</Text>
                    <Badge size="xs" color="green" variant="light" radius="sm">
                      {kpi.change}
                    </Badge>
                  </Stack>
                  <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: kpi.color || '#1F5C3A' }}>
                    <Icon size={20} stroke={2} />
                  </ThemeIcon>
                </Group>
              </Card>
            </motion.div>
          );
        })}
      </SimpleGrid>

      {/* Gráficas principales */}
      <Grid mb="xl">
        {/* Gráfica de barras */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
              <Group justify="space-between" mb="lg">
                <Group gap="sm">
                  <IconChartBar size={18} color="#1F5C3A" />
                  <Text size="sm" fw={700} c="#3A3A34">Pronóstico vs Real</Text>
                </Group>
                <Group gap="md">
                  <Group gap={4}>
                    <Box style={{ width: 12, height: 12, backgroundColor: '#D4DEC9', borderRadius: 3 }} />
                    <Text size="xs" c="dimmed">Pronóstico</Text>
                  </Group>
                  <Group gap={4}>
                    <Box style={{ width: 12, height: 12, backgroundColor: '#1F5C3A', borderRadius: 3 }} />
                    <Text size="xs" c="dimmed">Real</Text>
                  </Group>
                </Group>
              </Group>

              <Box style={{ padding: '10px 0' }}>
                {chartData.map((dataItem, i) => (
                  <Box key={i} mb="md">
                    <Group justify="space-between" mb={4}>
                      <Text size="xs" fw={600} c="#3A3A34">{dataItem.day}</Text>
                      <Group gap="md">
                        <Text size="xs" c="dimmed">{dataItem.pronostico}</Text>
                        <Text size="xs" fw={700} c="#1F5C3A">{dataItem.real > 0 ? dataItem.real : '-'}</Text>
                      </Group>
                    </Group>
                    <Box style={{ position: 'relative', height: 20, backgroundColor: '#F5F3EE', borderRadius: 4, overflow: 'hidden' }}>
                      <Box
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${(dataItem.pronostico / maxValue) * 100}%`,
                          backgroundColor: '#D4DEC9',
                          borderRadius: 4,
                          transition: 'width 0.8s ease'
                        }}
                      />
                      {dataItem.real > 0 && (
                        <Box
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${(dataItem.real / maxValue) * 100}%`,
                            backgroundColor: '#1F5C3A',
                            borderRadius: 4,
                            transition: 'width 0.8s ease',
                            opacity: 0.85
                          }}
                        />
                      )}
                    </Box>
                    {dataItem.real > 0 && (
                      <Text size="10px" c={dataItem.cumplimiento >= 95 ? '#1F5C3A' : '#E05624'} ta="right" mt={2}>
                        {dataItem.cumplimiento >= 95 ? '✓' : '⚠'} {dataItem.cumplimiento}%
                      </Text>
                    )}
                  </Box>
                ))}
              </Box>

              <Divider my="md" />

              <Group justify="center" gap="xl">
                <Group gap={4}>
                  <IconCheck size={14} color="#1F5C3A" />
                  <Text size="xs" c="dimmed">Meta: <strong style={{ color: '#3A3A34' }}>93% - 100%</strong></Text>
                </Group>
                <Group gap={4}>
                  <IconTrendingUp size={14} color="#1F5C3A" />
                  <Text size="xs" c="dimmed">Tendencia: <strong style={{ color: '#1F5C3A' }}>Estable</strong></Text>
                </Group>
              </Group>
            </Card>
          </motion.div>
        </Grid.Col>

        {/* Cards de rendimiento */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            {/* Ring Progress */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
                <Group justify="space-between" mb="md">
                  <Text size="sm" fw={700} c="#3A3A34">Rendimiento Total</Text>
                  <IconChartPie size={18} color="#1F5C3A" />
                </Group>
                <Group justify="center">
                  <RingProgress
                    size={140}
                    thickness={14}
                    sections={[
                      { value: data?.cumplimientoGlobal || 75, color: '#1F5C3A' },
                      { value: 100 - (data?.cumplimientoGlobal || 75), color: '#D4DEC9' }
                    ]}
                    label={
                      <Stack align="center" gap={0}>
                        <Text size="xl" fw={800} c="#1F5C3A">{Math.round(data?.cumplimientoGlobal || 75)}%</Text>
                        <Text size="xs" c="dimmed">Cumplimiento</Text>
                      </Stack>
                    }
                  />
                </Group>
                <Group justify="center" gap="md" mt="md">
                  <Group gap={4}>
                    <Box style={{ width: 8, height: 8, backgroundColor: '#1F5C3A', borderRadius: '50%' }} />
                    <Text size="xs" c="dimmed">Completado</Text>
                  </Group>
                  <Group gap={4}>
                    <Box style={{ width: 8, height: 8, backgroundColor: '#D4DEC9', borderRadius: '50%' }} />
                    <Text size="xs" c="dimmed">Pendiente</Text>
                  </Group>
                </Group>
              </Card>
            </motion.div>

            {/* Avance por Rancho */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
                <Group justify="space-between" mb="md">
                  <Text size="sm" fw={700} c="#3A3A34">Avance por Rancho</Text>
                  <IconBuildingWarehouse size={18} color="#1F5C3A" />
                </Group>
                <Stack gap="lg">
                  {ranchData.map((ranch, idx) => (
                    <Box key={idx}>
                      <Group justify="space-between" mb={4}>
                        <Group gap="sm">
                          <Box
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: ranch.value >= 70 ? '#1F5C3A' : ranch.value >= 50 ? '#D4DEC9' : '#E8E5DC'
                            }}
                          />
                          <Text size="xs" fw={600} c="#3A3A34">{ranch.name}</Text>
                        </Group>
                        <Stack gap={0} align="flex-end">
                          <Text size="xs" fw={700} c="#1F5C3A">{ranch.value}%</Text>
                          <Text size="10px" c="dimmed">{ranch.ton} Ton</Text>
                        </Stack>
                      </Group>
                      <Progress
                        value={ranch.value}
                        color={ranch.value >= 70 ? '#1F5C3A' : ranch.value >= 50 ? '#D4DEC9' : '#E8E5DC'}
                        size="md"
                        radius="xl"
                      />
                    </Box>
                  ))}
                </Stack>
              </Card>
            </motion.div>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Tabla de Desglose */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconChartLine size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Desglose Analítico</Text>
                <Text size="xs" c="dimmed">Precisión por variante y lote</Text>
              </Stack>
            </Group>
            <Badge variant="light" color="teal" radius="sm">Actualizado</Badge>
          </Group>

          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
              <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Producto</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Rancho</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Sector</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Pronóstico</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Real</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} ta="right">Precisión</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {forecastBreakdown.map((row, idx) => (
                <Table.Tr key={idx} style={{ borderBottom: '1px solid #EFECE3' }}>
                  <Table.Td fw={700} c="#1F5C3A">{row.producto}</Table.Td>
                  <Table.Td fw={500} c="#3A3A34">{row.rancho}</Table.Td>
                  <Table.Td c="dimmed">{row.sector}</Table.Td>
                  <Table.Td ta="right" fw={600}>{row.pronostico}</Table.Td>
                  <Table.Td ta="right" fw={700} c="#1F5C3A">{row.real}</Table.Td>
                  <Table.Td ta="right">
                    <Badge color="green" variant="light" size="sm" radius="sm">
                      <Group gap={2}>
                        <Text size="xs" fw={700}>{row.acierto}</Text>
                        <IconArrowUpRight size={12} />
                      </Group>
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </motion.div>
    </Box>
  );
}

export default GrowerForecast;