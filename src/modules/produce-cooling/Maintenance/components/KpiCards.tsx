// Maintenance/components/KpiCards.tsx

import React from 'react';
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Stack, Badge } from '@mantine/core';
import { IconTool, IconSnowflake, IconAlertTriangle, IconCoin } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { MaintenanceStats } from '../../types';

interface KpiCardsProps {
  stats: MaintenanceStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      label: 'El equipo completo',
      value: `${stats.activos} activos`,
      sub: '1 cuarto · 2 máquinas de hielo · túnel · inyector · 3 líneas',
      icon: IconTool,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: `${stats.totalEquipos} equipos`,
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Hielo propio',
      value: `${stats.hieloCapacidad} t/día reales`,
      sub: '25t rinde 12.5 · 10t rinde 5',
      icon: IconSnowflake,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      badge: 'Capacidad',
      badgeColor: 'blue',
      delay: 0.1,
    },
    {
      label: 'En falla',
      value: stats.enFalla,
      sub: 'refacción llega jueves',
      icon: IconAlertTriangle,
      color: '#DC2626',
      bgColor: '#FEF2F2',
      badge: '⚠ Urgente',
      badgeColor: 'red',
      delay: 0.15,
    },
    {
      label: 'Mantenimiento nov',
      value: `$${stats.costoMtoMes}`,
      sub: `presupuesto $${stats.presupuestoMto}/mes`,
      icon: IconCoin,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: `${Math.round((stats.costoMtoMes / stats.presupuestoMto) * 100)}%`,
      badgeColor: 'yellow',
      delay: 0.2,
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: card.delay || index * 0.05 }}
        >
          <Paper 
            p="md" 
            radius="lg" 
            withBorder 
            style={{ 
              borderColor: '#E8E5DC', 
              backgroundColor: '#FFFFFF',
              height: '100%',
              transition: 'all 0.2s ease',
            }}
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap={2} style={{ flex: 1 }}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">
                  {card.label}
                </Text>
                <Text size="18px" fw={800} style={{ color: card.color, lineHeight: 1.2 }}>
                  {card.value}
                </Text>
                <Text size="10px" c="dimmed">{card.sub}</Text>
                <Badge 
                  size="xs" 
                  color={card.badgeColor} 
                  variant="light" 
                  radius="sm"
                  style={{ alignSelf: 'flex-start', marginTop: 2 }}
                >
                  {card.badge}
                </Badge>
              </Stack>
              <ThemeIcon 
                size="lg" 
                radius="md" 
                style={{ 
                  backgroundColor: card.bgColor, 
                  color: card.color,
                  flexShrink: 0,
                }}
              >
                <card.icon size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Paper>
        </motion.div>
      ))}
    </SimpleGrid>
  );
}