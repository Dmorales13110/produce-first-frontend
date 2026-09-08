// CashFlow/components/KpiCards.tsx

import React from 'react';
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Stack, Badge } from '@mantine/core';
import { IconWallet, IconCoin, IconArrowsUpDown, IconAlertCircle } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { CashFlowStats } from '../../types';

interface KpiCardsProps {
  stats: CashFlowStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      label: 'Saldo cuenta PC',
      value: `$${stats.saldoCuenta} MXN`,
      sub: 'actualizar al corte',
      icon: IconWallet,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Actualizar',
      badgeColor: 'yellow',
      delay: 0.05,
    },
    {
      label: 'TC de hoy',
      value: stats.tcMxnUsd,
      sub: 'el mismo de BAN-1 grower',
      icon: IconCoin,
      color: '#2D6BAE',
      bgColor: '#EFF6FF',
      badge: 'Grupo',
      badgeColor: 'blue',
      delay: 0.1,
    },
    {
      label: 'Ciclo semanal',
      value: (
        <Group gap={4} align="baseline">
          <Text component="span" c="teal.7" fw={800}>+${(stats.entradaSemanal / 1000).toFixed(0)}K</Text>
          <Text component="span" c="dimmed" fw={600}>/</Text>
          <Text component="span" c="red.7" fw={800}>-${(stats.salidaSemanal / 1000).toFixed(0)}K</Text>
        </Group>
      ),
      sub: 'cobra semanal, paga semanal',
      icon: IconArrowsUpDown,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      badge: 'Recurrente',
      badgeColor: 'violet',
      delay: 0.15,
    },
    {
      label: 'Alerta del 15',
      value: stats.alerta15,
      sub: 'el flujo la aparta solo',
      icon: IconAlertCircle,
      color: '#DC2626',
      bgColor: '#FEF2F2',
      badge: '⚠ Programado',
      badgeColor: 'red',
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