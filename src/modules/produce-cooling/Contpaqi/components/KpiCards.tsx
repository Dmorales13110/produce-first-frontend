// Contpaqi/components/KpiCards.tsx

import React from 'react';
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Stack, Badge } from '@mantine/core';
import { IconCategory, IconCoin, IconPackage, IconProgress } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { ContpaqiStats } from '../../types';

interface KpiCardsProps {
  stats: ContpaqiStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      label: 'Misma fórmula',
      value: 'CONT-1 del grower',
      sub: 'categorías → cuentas, una sola vez',
      icon: IconCategory,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Equivalencias',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Categorías de PC',
      value: stats.totalCategorias,
      sub: 'del presupuesto PC-PRE',
      icon: IconCategory,
      color: '#2D6BAE',
      bgColor: '#EFF6FF',
      badge: 'Mapeadas',
      badgeColor: 'blue',
      delay: 0.1,
    },
    {
      label: 'IVA acreditable nov',
      value: `$${stats.ivaAcreditable.toLocaleString()}`,
      sub: 'energía + renta + planta',
      icon: IconCoin,
      color: '#2D8F5E',
      bgColor: '#ECFDF5',
      badge: 'Acreditable',
      badgeColor: 'green',
      delay: 0.15,
    },
    {
      label: 'Paquete de nov',
      value: stats.paqueteProgreso,
      sub: `${stats.facturasPendientes} facturas sin conciliar`,
      icon: IconPackage,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: stats.paqueteEstado,
      badgeColor: stats.facturasPendientes > 0 ? 'yellow' : 'green',
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