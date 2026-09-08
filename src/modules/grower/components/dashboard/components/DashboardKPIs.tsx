// src/modules/dashboard/components/DashboardKPIs.tsx
import React from 'react';
import { SimpleGrid, Card, Text, Group, Stack, ThemeIcon, Divider, Progress, Badge } from '@mantine/core';
import { IconReceipt, IconCoin, IconTrendingUp, IconCash, IconArrowUpRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { CFOMetrics } from '../../../../../services/dashboard';

interface DashboardKPIsProps {
  metrics: CFOMetrics | null;
}

export const DashboardKPIs: React.FC<DashboardKPIsProps> = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Anticipos Pagados
              </Text>
              <Text size="xl" fw={800} c="#1F5C3A">${metrics.paidAdvancesAmount.toLocaleString()}</Text>
              <Group gap={4}>
                <IconTrendingUp size={12} color="#1F5C3A" />
                <Text size="xs" c="#1F5C3A" fw={600}>{metrics.paidAdvances} pagos realizados</Text>
              </Group>
            </Stack>
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconReceipt size={20} stroke={2} />
            </ThemeIcon>
          </Group>
          <Divider my="sm" />
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Pendientes</Text>
            <Badge size="xs" color="orange" variant="light">${metrics.pendingAdvancesAmount.toLocaleString()}</Badge>
          </Group>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Gastos Pagados
              </Text>
              <Text size="xl" fw={800} c="#C08412">${metrics.paidExpensesAmount.toLocaleString()}</Text>
              <Group gap={4}>
                <IconArrowUpRight size={12} color="#C08412" />
                <Text size="xs" c="#C08412" fw={600}>{metrics.paidExpenses} gastos registrados</Text>
              </Group>
            </Stack>
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
              <IconCoin size={20} stroke={2} />
            </ThemeIcon>
          </Group>
          <Divider my="sm" />
          <Progress 
            value={metrics.paidExpenses > 0 ? (metrics.paidExpenses / (metrics.paidExpenses + metrics.pendingExpenses)) * 100 : 0} 
            color="#C08412" 
            size="xs" 
            radius="xl" 
          />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Balance Neto
              </Text>
              <Text size="xl" fw={800} c={metrics.netBalance >= 0 ? '#1F5C3A' : '#C0392B'}>
                ${metrics.netBalance.toLocaleString()}
              </Text>
              <Group gap={4}>
                <Text size="xs" c="dimmed">Anticipos - Gastos</Text>
              </Group>
            </Stack>
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: metrics.netBalance >= 0 ? '#1F5C3A' : '#C0392B' }}>
              <IconCash size={20} stroke={2} />
            </ThemeIcon>
          </Group>
          <Divider my="sm" />
          <Group justify="space-between">
            <Text size="xs" c="dimmed">{metrics.totalAdvances} anticipos</Text>
            <Text size="xs" c="dimmed">{metrics.totalExpenses} gastos</Text>
          </Group>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Por Cobrar
              </Text>
              <Text size="xl" fw={800} c="#2A6A8A">${metrics.collectionPending.toLocaleString()}</Text>
              <Group gap={4}>
                <Text size="xs" c="dimmed">{metrics.pendingAdvances} anticipos pendientes</Text>
              </Group>
            </Stack>
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
              <IconTrendingUp size={20} stroke={2} />
            </ThemeIcon>
          </Group>
          <Divider my="sm" />
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Por cobrar</Text>
            <Badge size="xs" color="blue" variant="light">${metrics.collectionPending.toLocaleString()}</Badge>
          </Group>
        </Card>
      </motion.div>
    </SimpleGrid>
  );
};