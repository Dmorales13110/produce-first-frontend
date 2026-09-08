// src/modules/grower/pl/components/PLKPIs.tsx
import React from 'react';
import { SimpleGrid, Card, Text, Group, Stack, ThemeIcon, Progress, Badge } from '@mantine/core';
import { IconCoin, IconCash, IconChartBar, IconGauge, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface PLKPIsProps {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  totalHarvests: number;
}

export const PLKPIs: React.FC<PLKPIsProps> = ({ totalRevenue, totalCosts, netProfit, totalHarvests }) => {
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const kpis = [
    {
      title: 'Utilidad Neta',
      value: `$${netProfit.toLocaleString()}`,
      change: `${netProfit >= 0 ? '+' : ''}${netProfit > 0 ? Math.round((netProfit / (totalRevenue || 1)) * 100) : 0}%`,
      trend: netProfit >= 0 ? 'up' : 'down',
      color: netProfit >= 0 ? '#1F5C3A' : '#C0392B',
      description: 'vs ingresos',
      progress: netProfit > 0 ? Math.min((netProfit / (totalRevenue || 1)) * 100, 100) : 0,
      icon: IconCoin,
    },
    {
      title: 'Ingresos Totales',
      value: `$${totalRevenue.toLocaleString()}`,
      change: `${totalHarvests} cosechas`,
      trend: 'up',
      color: '#2A6A8A',
      description: 'de harvest_receptions',
      progress: totalRevenue > 0 ? 100 : 0,
      icon: IconCash,
    },
    {
      title: 'Costos Totales',
      value: `$${totalCosts.toLocaleString()}`,
      change: 'operativos',
      trend: 'down',
      color: '#C08412',
      description: 'de expenses',
      progress: totalCosts > 0 ? 100 : 0,
      icon: IconChartBar,
    },
    {
      title: 'Margen Neto',
      value: `${margin >= 0 ? margin.toFixed(1) : 0}%`,
      change: `${margin >= 0 ? '+' : ''}${Math.round(margin)}%`,
      trend: margin >= 0 ? 'up' : 'down',
      color: margin >= 15 ? '#1F5C3A' : margin >= 0 ? '#C08412' : '#C0392B',
      description: 'vs ingresos',
      progress: margin > 0 ? Math.min(margin, 100) : 0,
      icon: IconGauge,
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        const TrendIcon = kpi.trend === 'up' ? IconTrendingUp : IconTrendingDown;

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card
              p="md"
              radius="lg"
              withBorder
              style={{
                borderColor: '#E8E5DC',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <Group justify="space-between" align="flex-start" mb="xs">
                <Stack gap={2}>
                  <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {kpi.title}
                  </Text>
                  <Text size="xl" fw={800} c={kpi.color}>
                    {kpi.value}
                  </Text>
                </Stack>
                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: kpi.color }}>
                  <Icon size={20} stroke={2} />
                </ThemeIcon>
              </Group>

              <Group gap={4} mb="xs">
                <TrendIcon size={14} color={kpi.trend === 'up' ? '#1F5C3A' : '#C0392B'} />
                <Text size="xs" fw={600} c={kpi.trend === 'up' ? '#1F5C3A' : '#C0392B'}>
                  {kpi.change}
                </Text>
                <Text size="xs" c="dimmed">{kpi.description}</Text>
              </Group>

              <Progress
                value={Math.min(kpi.progress, 100)}
                color={kpi.trend === 'up' ? '#1F5C3A' : '#C08412'}
                size="xs"
                radius="xl"
              />
            </Card>
          </motion.div>
        );
      })}
    </SimpleGrid>
  );
};