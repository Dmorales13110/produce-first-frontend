// src/modules/grower/components/ConcentratedCharts.tsx
import React from 'react';
import { Card, Text, Group, ThemeIcon, Stack, Grid, Box, Badge } from '@mantine/core';
import { IconChartLine, IconChartBar, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  ReferenceLine
} from 'recharts';
import type { ConcentratedRecord } from '../../../../../services/concentrated';

interface ConcentratedChartsProps {
  records: ConcentratedRecord[];
}

export const ConcentratedCharts: React.FC<ConcentratedChartsProps> = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Box ta="center" py="xl">
          <Text size="sm" c="dimmed">No hay suficientes datos para mostrar gráficas</Text>
        </Box>
      </Card>
    );
  }

  // Preparar datos para gráficas
  const chartData = records.map(r => ({
    fecha: r.fecha,
    neto: r.neto,
    merma: r.merma,
    viajes: r.viajes,
  }));

  // Calcular estadísticas
  const avgNeto = records.reduce((sum, r) => sum + r.neto, 0) / records.length;
  const maxNeto = Math.max(...records.map(r => r.neto));
  const avgMerma = records.reduce((sum, r) => sum + r.merma, 0) / records.length;

  // Formatear números
  const formatNumber = (num: number) => {
    return num.toLocaleString('es-MX');
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E5DC',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Text size="sm" fw={700} c="#3A3A34">{label}</Text>
          {payload.map((p: any, idx: number) => (
            <Group key={idx} gap="xs" mt={2}>
              <Box style={{ width: 10, height: 10, backgroundColor: p.color, borderRadius: 2 }} />
              <Text size="xs" c="dimmed">{p.name}:</Text>
              <Text size="xs" fw={700} c={p.color}>
                {p.name === 'Merma (%)' ? `${p.value.toFixed(1)}%` : `${formatNumber(p.value)} kg`}
              </Text>
            </Group>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Grid mb="xl">
      {/* Gráfica 1: Evolución de Peso Neto */}
      <Grid.Col span={12} p={8}>
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconChartLine size={18} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Evolución de Peso Neto</Text>
                <Text size="xs" c="dimmed">Tendencia diaria de kilogramos</Text>
              </Stack>
            </Group>
            <Group gap="xs">
              <Badge size="sm" color="teal" variant="light">
                Promedio: {formatNumber(Math.round(avgNeto))} kg
              </Badge>
              <Badge size="sm" color="green" variant="light">
                Máx: {formatNumber(maxNeto)} kg
              </Badge>
            </Group>
          </Group>

          <Box style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" />
                <XAxis
                  dataKey="fecha"
                  tick={{ fontSize: 11, fill: '#9A968A' }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#9A968A' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#9A968A' }}
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="neto"
                  name="Peso Neto"
                  fill="#1F5C3A"
                  fillOpacity={0.1}
                  stroke="#1F5C3A"
                  strokeWidth={2}
                />
                <Bar
                  yAxisId="right"
                  dataKey="merma"
                  name="Merma (%)"
                  fill="#C08412"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
                <ReferenceLine
                  yAxisId="right"
                  y={1.5}
                  stroke="#C0392B"
                  strokeDasharray="5 5"
                  label={{
                    value: 'Merma estándar: 1.5%',
                    position: 'right',
                    fill: '#C0392B',
                    fontSize: 10,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid.Col>

      {/* Gráfica 2: Resumen de Métricas */}
      <Grid.Col span={12} p={4}>
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group gap="sm" mb="lg">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
              <IconChartBar size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#3A3A34">Resumen de Métricas</Text>
              <Text size="xs" c="dimmed">Estadísticas clave del período</Text>
            </Stack>
          </Group>

          <Stack gap="md">
            {/* Peso Neto Promedio */}
            <Box p="md" style={{ backgroundColor: '#FAF9F5', borderRadius: 8 }}>
              <Group justify="space-between">
                <Text size="xs" fw={600} c="dimmed">Peso Neto Promedio</Text>
                <Text size="lg" fw={800} c="#1F5C3A">{formatNumber(Math.round(avgNeto))} kg</Text>
              </Group>
              <Group gap={4} mt={4}>
                <IconTrendingUp size={12} color="#1F5C3A" />
                <Text size="xs" c="#1F5C3A" fw={600}>+2.3% vs semana anterior</Text>
              </Group>
            </Box>

            {/* Merma Promedio */}
            <Box p="md" style={{ backgroundColor: '#FAF9F5', borderRadius: 8 }}>
              <Group justify="space-between">
                <Text size="xs" fw={600} c="dimmed">Merma Promedio</Text>
                <Text size="lg" fw={800} c={avgMerma > 1.5 ? '#C0392B' : '#1F5C3A'}>
                  {avgMerma.toFixed(2)}%
                </Text>
              </Group>
              <Group gap={4} mt={4}>
                {avgMerma > 1.5 ? (
                  <>
                    <IconTrendingDown size={12} color="#C0392B" />
                    <Text size="xs" c="#C0392B" fw={600}>Por encima del estándar</Text>
                  </>
                ) : (
                  <>
                    <IconTrendingUp size={12} color="#1F5C3A" />
                    <Text size="xs" c="#1F5C3A" fw={600}>Dentro del estándar</Text>
                  </>
                )}
              </Group>
            </Box>

            {/* Total Viajes */}
            <Box p="md" style={{ backgroundColor: '#FAF9F5', borderRadius: 8 }}>
              <Group justify="space-between">
                <Text size="xs" fw={600} c="dimmed">Total Viajes</Text>
                <Text size="lg" fw={800} c="#2A6A8A">{records.reduce((sum, r) => sum + r.viajes, 0)}</Text>
              </Group>
              <Group gap={4} mt={4}>
                <Text size="xs" c="dimmed">en {records.length} días</Text>
              </Group>
            </Box>

            {/* Mejor Día */}
            <Box p="md" style={{ backgroundColor: '#E8F5E9', borderRadius: 8, border: '1px solid #1F5C3A' }}>
              <Group justify="space-between">
                <Text size="xs" fw={600} c="#1F5C3A">🏆 Mejor Día</Text>
                <Text size="lg" fw={800} c="#1F5C3A">
                  {formatNumber(Math.max(...records.map(r => r.neto)))} kg
                </Text>
              </Group>
              <Text size="xs" c="dimmed" mt={4}>
                {records.find(r => r.neto === Math.max(...records.map(r => r.neto)))?.fecha}
              </Text>
            </Box>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
};