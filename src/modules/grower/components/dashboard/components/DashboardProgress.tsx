// src/modules/dashboard/components/DashboardProgress.tsx
import React from 'react';
import { Card, Text, Group, Stack, Divider, Grid, Progress } from '@mantine/core';
import { IconGauge } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { CFOMetrics } from '../../../../../services/dashboard';

interface SeasonInfo {
  season: string;
  week: number;
  totalWeeks: number;
  startDate: string;
  endDate: string;
}

interface DashboardProgressProps {
  metrics: CFOMetrics | null;
  seasonInfo?: SeasonInfo | null;
}

export const DashboardProgress: React.FC<DashboardProgressProps> = ({ metrics, seasonInfo }) => {
  if (!metrics) return null;

  const progressTime = seasonInfo ? (seasonInfo.week / seasonInfo.totalWeeks) * 100 : 13;
  const progressHarvest = metrics.totalBoxesHarvested > 0 ? 97 : 0;
  const progressUtilidad = metrics.netBalance > 0 ? 92 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      style={{ marginBottom: '24px' }}
    >
      <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Group gap="sm" mb="lg">
          <IconGauge size={18} color="#1F5C3A" />
          <Stack gap={0}>
            <Text size="sm" fw={700} c="#3A3A34">Avance General de Temporada</Text>
            <Text size="xs" c="dimmed">
              {seasonInfo?.season || 'Invierno 2026-2027'} · Semana {seasonInfo?.week || 4} de {seasonInfo?.totalWeeks || 30}
            </Text>
          </Stack>
        </Group>
        <Divider mb="lg" />
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="xs" fw={600} c="#3A3A34">Tiempo transcurrido</Text>
                <Text size="xs" fw={700} c="#9A968A">{Math.round(progressTime)}%</Text>
              </Group>
              <Progress value={progressTime} color="#9A968A" size="lg" radius="xl" />
              <Text size="xs" c="dimmed">Semana {seasonInfo?.week || 4} de {seasonInfo?.totalWeeks || 30}</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="xs" fw={600} c="#3A3A34">Cajas cosechadas</Text>
                <Text size="xs" fw={700} c="#1F5C3A">{progressHarvest}%</Text>
              </Group>
              <Progress value={progressHarvest} color="#1F5C3A" size="lg" radius="xl" />
              <Text size="xs" c="dimmed">{metrics.totalBoxesHarvested.toLocaleString()} cajas</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="xs" fw={600} c="#3A3A34">Utilidad acumulada</Text>
                <Text size="xs" fw={700} c="#C08412">{progressUtilidad}%</Text>
              </Group>
              <Progress value={progressUtilidad} color="#C08412" size="lg" radius="xl" />
              <Text size="xs" c="dimmed">${metrics.netBalance.toLocaleString()}</Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
    </motion.div>
  );
};