// OrdenesEmbarque/components/KpiCards.tsx

import React from 'react';
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Stack, Badge } from '@mantine/core';
import { IconClipboardList, IconTruckLoading, IconCheck, IconAlertTriangle } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { OrdenesEmbarqueStats } from '../../types';

interface KpiCardsProps {
  stats: OrdenesEmbarqueStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      label: 'Bandeja de hoy',
      value: `${stats.bandejaHoy} proformas de PF`,
      sub: `${stats.porAceptar} por aceptar · ${stats.enCarga} en carga`,
      icon: IconClipboardList,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      delay: 0.05,
    },
    {
      label: 'El circuito',
      value: 'aceptar → cargar → confirmar',
      sub: 'folio por folio',
      icon: IconTruckLoading,
      color: '#2D6BAE',
      bgColor: '#EFF6FF',
      delay: 0.1,
    },
    {
      label: 'Carga confirmada hoy',
      value: `PRF-0145 · ${stats.cajasConfirmadas} cj`,
      sub: 'factura liberada en PF',
      icon: IconCheck,
      color: '#2D8F5E',
      bgColor: '#ECFDF5',
      delay: 0.15,
    },
    {
      label: 'Diferencias',
      value: `${stats.diferencias} esta semana`,
      sub: 'avisadas a PF antes de facturar',
      icon: IconAlertTriangle,
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