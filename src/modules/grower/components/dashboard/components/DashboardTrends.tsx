// src/modules/dashboard/components/DashboardTrends.tsx
import React from 'react';
import { Card, Text, Group, Stack, Divider, Grid, Flex, Badge, Box } from '@mantine/core';
import { IconTrendingUp, IconChartBar } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { CFOMetrics } from '../../../../../services/dashboard';

interface DashboardTrendsProps {
  metrics: CFOMetrics | null;
}

export const DashboardTrends: React.FC<DashboardTrendsProps> = ({ metrics }) => {
  if (!metrics) return null;

  // Datos de ejemplo para las tendencias
  const fobData = [
    { sem: 'S45', h: 30, v: '$22K' },
    { sem: 'S46', h: 45, v: '$48K' },
    { sem: 'S47', h: 60, v: '$75K' },
    { sem: 'S48', h: 90, v: '$112K', peak: true },
    { sem: 'S49', h: 50, v: '$131K' }
  ];

  const utilidadData = [
    { sem: 'S45', h: 20, v: '$15K' },
    { sem: 'S46', h: 35, v: '$38K' },
    { sem: 'S47', h: 55, v: '$62K' },
    { sem: 'S48', h: 85, v: '$96K', peak: true },
    { sem: 'S49', h: 70, v: '$96.4K' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      style={{ marginBottom: '24px' }}
    >
      <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Group justify="space-between" mb="lg">
          <Group gap="sm">
            <IconTrendingUp size={18} color="#1F5C3A" />
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#3A3A34">Tendencia Semanal</Text>
              <Text size="xs" c="dimmed">S45 - S49 · Proyectado vs Real</Text>
            </Stack>
          </Group>
          <Badge variant="light" color="green" radius="sm">+8.2% vs plan</Badge>
        </Group>
        <Divider mb="lg" />
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {/* ✅ Usamos Box en lugar de Text con component="p" */}
            <Box mb="md">
              <Group gap="4">
                <IconChartBar size={14} color="#9A968A" />
                <Text size="xs" fw={700} c="#9A968A" tt="uppercase" lts="0.5px">
                  FOB · Plan vs Real
                </Text>
              </Group>
            </Box>
            <Flex align="flex-end" justify="space-between" h={140} style={{ borderBottom: '2px solid #E5E2D9', paddingBottom: '8px' }}>
              {fobData.map((pt, i) => (
                <Stack key={i} gap={2} align="center" style={{ flex: 1 }}>
                  <Text size="9px" fw={700} c="#1F5C3A">{pt.v}</Text>
                  <Box style={{ 
                    height: `${pt.h}px`, 
                    width: '12px', 
                    backgroundColor: pt.peak ? '#1F5C3A' : '#A3C6B1', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }} />
                  <Text size="10px" fw={600} c="dimmed">{pt.sem}</Text>
                </Stack>
              ))}
            </Flex>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {/* ✅ Usamos Box en lugar de Text con component="p" */}
            <Box mb="md">
              <Group gap="4">
                <IconTrendingUp size={14} color="#9A968A" />
                <Text size="xs" fw={700} c="#9A968A" tt="uppercase" lts="0.5px">
                  Utilidad · Plan Acumulado
                </Text>
              </Group>
            </Box>
            <Flex align="flex-end" justify="space-between" h={140} style={{ borderBottom: '2px solid #E5E2D9', paddingBottom: '8px' }}>
              {utilidadData.map((pt, i) => (
                <Stack key={i} gap={2} align="center" style={{ flex: 1 }}>
                  <Text size="9px" fw={700} c="#C08412">{pt.v}</Text>
                  <Box style={{ 
                    height: `${pt.h}px`, 
                    width: '12px', 
                    backgroundColor: pt.peak ? '#C08412' : '#F5DCA6', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }} />
                  <Text size="10px" fw={600} c="dimmed">{pt.sem}</Text>
                </Stack>
              ))}
            </Flex>
          </Grid.Col>
        </Grid>
      </Card>
    </motion.div>
  );
};