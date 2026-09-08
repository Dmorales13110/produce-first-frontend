// src/modules/grower/pl/components/PLHeader.tsx
import React from 'react';
import { Paper, Group, Stack, Text, Badge, RingProgress, ThemeIcon, Box } from '@mantine/core';
import { IconCash } from '@tabler/icons-react';
import { headerGradientStyles } from '../styles/pl.styles';

interface PLHeaderProps {
  totalRevenue: number;
  netProfit: number;
  totalHarvests: number;
}

export const PLHeader: React.FC<PLHeaderProps> = ({ totalRevenue, netProfit, totalHarvests }) => {
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <Paper p="xl" radius="lg" mb="xl" style={headerGradientStyles}>
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
              G-3 · P&L
            </Badge>
            <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
              TC: 17.68
            </Badge>
            <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}>
              {totalHarvests} cosechas
            </Badge>
          </Group>
          <Group gap="sm" align="center">
            <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
              Estado de Resultados
            </Text>
            <Badge size="lg" variant="light" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}>
              {new Date().getFullYear()}
            </Badge>
          </Group>
          <Group gap="md" mt={4}>
            <Text size="sm" style={{ opacity: 0.8 }}>
              Pronóstico vs Real · Invierno 2026-2027
            </Text>
            <Text size="xs" style={{ opacity: 0.6 }}>
              Ingresos vs Costos por rancho
            </Text>
          </Group>
        </Stack>

        <Group gap="xl">
          <Group gap="sm">
            <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
              <IconCash size={20} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="lg" fw={700}>${totalRevenue.toLocaleString()}</Text>
              <Text size="xs" style={{ opacity: 0.7 }}>Ingresos totales</Text>
            </Stack>
          </Group>
          <RingProgress
            size={90}
            thickness={10}
            sections={[{ value: Math.min(Math.abs(margin), 100), color: '#FFFFFF' }]}
            label={
              <Stack align="center" gap={0}>
                <Text size="lg" fw={800} style={{ color: '#FFFFFF' }}>
                  {margin >= 0 ? Math.round(margin) : 0}%
                </Text>
                <Text size="8px" style={{ opacity: 0.7 }}>margen</Text>
              </Stack>
            }
          />
        </Group>
      </Group>
    </Paper>
  );
};