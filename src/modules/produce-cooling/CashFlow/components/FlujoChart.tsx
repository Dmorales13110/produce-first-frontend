// CashFlow/components/FlujoChart.tsx

import React from 'react';
import { Paper, Stack, Text, Group, Box } from '@mantine/core';
import { IconChartLine } from '@tabler/icons-react';

interface FlujoChartProps {
  semanas: string[];
  entradas: number[];
  salidas: number[];
}

export function FlujoChart({ semanas, entradas, salidas }: FlujoChartProps) {
  // Normalizar datos para el gráfico SVG
  const maxValue = Math.max(...[...entradas, ...salidas]);
  const minValue = Math.min(...[...entradas, ...salidas]);
  const range = maxValue - minValue || 1;

  const getY = (value: number) => {
    // Invertir para que el gráfico vaya de abajo hacia arriba
    return 80 - ((value - minValue) / range) * 60;
  };

  const width = 600;
  const step = width / (semanas.length - 1);

  const entradaPoints = entradas.map((v, i) => `${i * step},${getY(v)}`).join(' ');
  const salidaPoints = salidas.map((v, i) => `${i * step},${getY(v)}`).join(' ');

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <IconChartLine size={20} color="#1A4B8C" />
            <Text size="16px" fw={700} c="#1A3A5C">
              Flujo semanal · se arma solo
            </Text>
          </Group>

          <Group gap="lg">
            <Group gap={6}>
              <Box style={{ width: 10, height: 10, backgroundColor: '#94A3B8', borderRadius: '50%' }} />
              <Text size="xs" c="dimmed">Entradas ($K)</Text>
            </Group>
            <Group gap={6}>
              <Box style={{ width: 10, height: 10, backgroundColor: '#DC2626', borderRadius: '50%' }} />
              <Text size="xs" c="dimmed">Salidas ($K)</Text>
            </Group>
          </Group>
        </Group>

        {/* Gráfico SVG */}
        <Box style={{ width: '100%', height: 120, borderBottom: '1px solid #E5E7EB' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${width} 100`} preserveAspectRatio="none">
            {/* Línea Entradas */}
            <polyline
              points={entradaPoints}
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2"
            />
            {/* Puntos Entradas */}
            {entradas.map((v, i) => (
              <circle key={`e-${i}`} cx={i * step} cy={getY(v)} r="3" fill="#94A3B8" />
            ))}

            {/* Línea Salidas */}
            <polyline
              points={salidaPoints}
              fill="none"
              stroke="#DC2626"
              strokeWidth="2"
            />
            {/* Puntos Salidas */}
            {salidas.map((v, i) => (
              <circle key={`s-${i}`} cx={i * step} cy={getY(v)} r="3" fill="#DC2626" />
            ))}
          </svg>

          {/* Labels del eje X */}
          <Group justify="space-between" px="xs" style={{ marginTop: -10 }}>
            {semanas.map((semana, i) => (
              <Text key={i} size="10px" c="dimmed">{semana}</Text>
            ))}
          </Group>
        </Box>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Entradas = CxC por vencimiento · Salidas = CxP + nómina semanal + renta el 15
        </Text>
      </Stack>
    </Paper>
  );
}