// CxpSATConciliado/components/KpiCards.tsx

import React from 'react';
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Stack, Badge } from '@mantine/core';
import { IconWallet, IconCalendar, IconCoin, IconCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { CxpSATStats } from '../../types';

interface KpiCardsProps {
  stats: CxpSATStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      label: 'Saldo por pagar',
      value: `$${stats.saldoPorPagar.toLocaleString()} MXN`,
      sub: 'renta + energía + planta',
      icon: IconWallet,
      color: '#D97706',
      bgColor: '#FFFBEB',
      delay: 0.05,
    },
    {
      label: 'El día 15 manda',
      value: `$${stats.rentaMensual.toLocaleString()}`,
      sub: 'calendario fijo de 6 pagos',
      icon: IconCalendar,
      color: '#DC2626',
      bgColor: '#FEF2F2',
      delay: 0.1,
    },
    {
      label: 'Pagos semanales promedio',
      value: `$${stats.pagoSemanalPromedio.toLocaleString()} MXN`,
      sub: 'energía + nómina + proveedores',
      icon: IconCoin,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      delay: 0.15,
    },
    {
      label: 'Sin dispersión',
      value: 'solo control',
      sub: 'lo que se debe, lo pagado, lo que falta',
      icon: IconCheck,
      color: '#2D8F5E',
      bgColor: '#ECFDF5',
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