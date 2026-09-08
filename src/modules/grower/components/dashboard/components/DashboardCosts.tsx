// src/modules/dashboard/components/DashboardCosts.tsx
import React from 'react';
import { Card, Text, Group, Stack, Divider, Grid, Box, Progress, Flex } from '@mantine/core';
import { IconChartPie, IconCalendarStats } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { CFOMetrics } from '../../../../../services/dashboard';

interface DashboardCostsProps {
  metrics: CFOMetrics | null;
}

export const DashboardCosts: React.FC<DashboardCostsProps> = ({ metrics }) => {
  if (!metrics) return null;

  const costosData = [
    { cat: 'Nómina + destajo', label: '$428K', val: 100, color: '#1F5C3A' },
    { cat: 'Fertilizantes', label: '$277K', val: 68, color: '#2A6A8A' },
    { cat: 'Diésel / maquinaria', label: '$148K', val: 35, color: '#C08412' },
    { cat: 'Semilla', label: '$96K', val: 22, color: '#8A5A2A' },
  ];

  const cobrosData = [
    { label: 'S45', dias: '8d', w: 100 },
    { label: 'S46', dias: '7d', w: 85 },
    { label: 'S47', dias: '9d', w: 115, highlight: true },
    { label: 'S48', dias: '7d', w: 85 },
  ];

  return (
    <Grid mb="xl">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group gap="sm" mb="lg">
              <IconChartPie size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Mayores Costos</Text>
                <Text size="xs" c="dimmed">Por categoría</Text>
              </Stack>
            </Group>
            <Divider mb="lg" />
            <Stack gap="md">
              {costosData.map((item, i) => (
                <Box key={i}>
                  <Group justify="space-between" mb={4}>
                    <Group gap="sm">
                      <Box style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
                      <Text size="xs" fw={600}>{item.cat}</Text>
                    </Group>
                    <Text size="xs" fw={700} c="#3A3A34">{item.label}</Text>
                  </Group>
                  <Progress value={item.val} color={item.color} size="sm" radius="xl" />
                </Box>
              ))}
            </Stack>
          </Card>
        </motion.div>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
        >
          <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group gap="sm" mb="lg">
              <IconCalendarStats size={18} color="#2A6A8A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Días de Cobro</Text>
                <Text size="xs" c="dimmed">Liquidación con PF</Text>
              </Stack>
            </Group>
            <Divider mb="lg" />
            <Stack gap="md">
              {cobrosData.map((row, i) => (
                <Group key={i} gap="sm" wrap="nowrap">
                  <Text size="xs" fw={600} style={{ width: '40px' }} c="dimmed">{row.label}</Text>
                  <Box style={{ flex: 1 }}>
                    <Flex align="center" justify="space-between" px="sm" style={{
                      width: `${Math.min(row.w, 100)}%`,
                      maxWidth: '100%',
                      backgroundColor: row.highlight ? '#2A6A8A' : '#1F5C3A',
                      height: '28px',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 700,
                      transition: 'width 0.3s ease'
                    }}>
                      <Text size="10px" fw={700}>Ciclo PF</Text>
                      <Text size="10px" fw={700}>{row.dias}</Text>
                    </Flex>
                  </Box>
                </Group>
              ))}
            </Stack>
            <Divider my="md" />
            <Text size="xs" c="dimmed">
              Promedio: <strong>7.8 días</strong> · Meta: &lt; 10 días
            </Text>
          </Card>
        </motion.div>
      </Grid.Col>
    </Grid>
  );
};