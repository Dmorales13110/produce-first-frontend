// BitacorasVentasServicios/components/TemperaturasChart.tsx

import React from 'react';
import { Paper, Stack, Text, Group, Box } from '@mantine/core';
import { IconChartLine } from '@tabler/icons-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { TemperaturaData } from '../../types';

interface TemperaturasChartProps {
  data: TemperaturaData[];
}

export function TemperaturasChart({ data }: TemperaturasChartProps) {
  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <IconChartLine size={20} color="#1A4B8C" />
            <Text size="16px" fw={700} c="#1A3A5C">
              Temperaturas del día
            </Text>
          </Group>

          <Group gap="lg">
            <Group gap={6}>
              <Box style={{ width: 10, height: 10, backgroundColor: '#D97706', borderRadius: 2 }} />
              <Text size="11px" c="dimmed">Temp entrada</Text>
            </Group>
            <Group gap={6}>
              <Box style={{ width: 10, height: 10, backgroundColor: '#0284C7', borderRadius: 2 }} />
              <Text size="11px" c="dimmed">Temp salida</Text>
            </Group>
          </Group>
        </Group>

        <Box style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="ciclo" 
                tickLine={false} 
                axisLine={false} 
                style={{ fontSize: '11px', fill: '#6B7280' }} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                style={{ fontSize: '11px', fill: '#6B7280' }} 
                domain={[0, 25]} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E8E5DC',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="tEntrada" 
                stroke="#D97706" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#D97706' }} 
                name="Temp Entrada (°C)" 
              />
              <Line 
                type="monotone" 
                dataKey="tSalida" 
                stroke="#0284C7" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#0284C7' }} 
                name="Temp Salida (°C)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Evolución de temperaturas por ciclo de vacío
        </Text>
      </Stack>
    </Paper>
  );
}