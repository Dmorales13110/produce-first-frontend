// Maintenance/components/RestriccionGrafico.tsx

import React from 'react';
import { Paper, Stack, Text, Group, Box, Badge } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';

interface RestriccionGraficoProps {
  dias: string[];
  capacidad: number[];
  demanda: number[];
}

export function RestriccionGrafico({ dias, capacidad, demanda }: RestriccionGraficoProps) {
  const maxValue = Math.max(...demanda, ...capacidad);
  const height = 100;
  const padding = 20;
  const chartHeight = height - padding;

  const getY = (value: number) => {
    return chartHeight - ((value / (maxValue * 1.2)) * chartHeight);
  };

  const width = 600;
  const step = width / (dias.length - 1);

  const capacidadPoints = capacidad.map((v, i) => `${i * step},${getY(v)}`).join(' ');
  const demandaPoints = demanda.map((v, i) => `${i * step},${getY(v)}`).join(' ');

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <IconChartBar size={20} color="#1A4B8C" />
            <Text size="16px" fw={700} c="#1A3A5C">
              La restricción que manda
            </Text>
            <Badge size="xs" color="blue" variant="light" radius="sm">
              Hielo disponible vs demanda
            </Badge>
          </Group>

          <Group gap="lg">
            <Group gap={6}>
              <Box style={{ width: 10, height: 10, backgroundColor: '#94A3B8', borderRadius: '50%' }} />
              <Text size="xs" c="dimmed">Capacidad real {capacidad[0]}t</Text>
            </Group>
            <Group gap={6}>
              <Box style={{ width: 10, height: 10, backgroundColor: '#D97706', borderRadius: '50%' }} />
              <Text size="xs" c="dimmed">Demanda de hielo t</Text>
            </Group>
          </Group>
        </Group>

        {/* Gráfico SVG */}
        <Box style={{ width: '100%', height: 130, borderBottom: '1px solid #E5E7EB' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            {/* Línea Capacidad Real */}
            <polyline
              points={capacidadPoints}
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            {capacidad.map((v, i) => (
              <circle key={`c-${i}`} cx={i * step} cy={getY(v)} r="3" fill="#94A3B8" />
            ))}

            {/* Línea Demanda */}
            <polyline
              points={demandaPoints}
              fill="none"
              stroke="#D97706"
              strokeWidth="2"
            />
            {demanda.map((v, i) => (
              <circle key={`d-${i}`} cx={i * step} cy={getY(v)} r="3" fill="#D97706" />
            ))}

            {/* Línea de alerta cuando demanda > capacidad */}
            {demanda.some((d, i) => d > capacidad[i]) && (
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="rgba(220, 38, 38, 0.05)"
              />
            )}
          </svg>

          {/* Labels del eje X */}
          <Group justify="space-between" px="md" style={{ marginTop: -10 }}>
            {dias.map((dia, i) => (
              <Text key={i} size="10px" c="dimmed">{dia}</Text>
            ))}
          </Group>
        </Box>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Hielo disponible vs demanda del día: si el enhielado proyectado pide más de {capacidad[0]} t, el planificador lo ve
        </Text>
      </Stack>
    </Paper>
  );
}