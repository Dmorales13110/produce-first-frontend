// PresupuestoPC/components/KpiCards.tsx

import React from 'react';
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Stack } from '@mantine/core';
import { IconBuilding, IconCoin, IconSnowflake, IconTarget } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { PresupuestoPCStats } from '../../types';

interface KpiCardsProps {
  stats: PresupuestoPCStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      label: 'El negocio de PC',
      value: '3 servicios',
      sub: 'enfriar al vacío · enhielar (hielo híbrido) · re-empacar',
      icon: IconBuilding,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      delay: 0.05,
    },
    {
      label: 'Utilidad plan (volumen medio)',
      value: `$${stats.utilidad} USD`,
      sub: `margen ${stats.margen}%`,
      icon: IconCoin,
      color: '#2D8F5E',
      bgColor: '#ECFDF5',
      delay: 0.1,
    },
    {
      label: 'Hielo híbrido',
      value: '50% propio · 50% comprado',
      sub: `+$${stats.hieloBlended}/cj blended · $3,000 USD/mes servicio`,
      icon: IconSnowflake,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      delay: 0.15,
    },
    {
      label: 'Punto de equilibrio',
      value: stats.puntoEquilibrio,
      sub: 'lo propio ya casi cubre',
      icon: IconTarget,
      color: '#D97706',
      bgColor: '#FFFBEB',
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