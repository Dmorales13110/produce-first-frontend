// BitacorasVentasServicios/components/KpiCards.tsx

import React from 'react';
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Stack, Badge } from '@mantine/core';
import { IconSnowflake, IconTemperature, IconIceCream, IconCoin } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { BitacorasStats } from '../../types';

interface KpiCardsProps {
  stats: BitacorasStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      label: 'Ciclos de vacío hoy',
      value: stats.ciclosHoy,
      sub: '12 tarimas por ciclo',
      icon: IconSnowflake,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      delay: 0.05,
    },
    {
      label: 'Temp entrada → salida',
      value: `${stats.tempEntradaPromedio.toFixed(1)} → ${stats.tempSalidaPromedio.toFixed(1)} °C`,
      sub: 'meta salida ≤ 4 °C',
      icon: IconTemperature,
      color: '#D97706',
      bgColor: '#FFFBEB',
      delay: 0.1,
    },
    {
      label: 'Hielo producido hoy',
      value: `${stats.hieloProducido}t de ${stats.hieloMeta}t`,
      sub: '25t: 11.8 · 10t: 4.4',
      icon: IconIceCream,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      delay: 0.15,
    },
    {
      label: 'Pendiente de cobro',
      value: `$${stats.pendienteCobro.toLocaleString()} USD`,
      sub: 'del corte de servicios',
      icon: IconCoin,
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