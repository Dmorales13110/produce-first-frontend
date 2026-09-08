// ReceptionScan/components/KpiCards.tsx

import React from 'react';
import { SimpleGrid, Paper, Text, Group, Badge, ThemeIcon, Stack } from '@mantine/core';
import {
  IconScan,
  IconCheck,
  IconAlertTriangle,
  IconClock,
  IconBox,
  IconTemperature,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface KpiCardsProps {
  stats: {
    total: number;
    completed: number;
    discrepancies: number;
    totalBoxes: number;
    totalDiscrepancy: number;
    avgTemperature: number;
  };
}

export function KpiCards({ stats }: KpiCardsProps) {
  const successRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cards = [
    {
      label: 'Escaneos de hoy',
      value: stats.total,
      sub: 'folios recibidos',
      icon: IconScan,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: `${stats.total} total`,
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Completados',
      value: stats.completed,
      sub: 'recepciones exitosas',
      icon: IconCheck,
      color: '#2D8F5E',
      bgColor: '#ECFDF5',
      badge: `${successRate}% tasa de éxito`,
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Discrepancias',
      value: stats.discrepancies,
      sub: `Δ ${stats.totalDiscrepancy} cajas total`,
      icon: IconAlertTriangle,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: stats.discrepancies > 0 ? 'Revisión necesaria' : 'Todo en orden',
      badgeColor: stats.discrepancies > 0 ? 'orange' : 'green',
      delay: 0.15,
    },
    {
      label: 'Temperatura Promedio',
      value: `${stats.avgTemperature.toFixed(1)}°C`,
      sub: 'promedio del cuarto frío',
      icon: IconTemperature,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      badge: stats.avgTemperature < 15 ? 'Óptima' : 'Revisar',
      badgeColor: stats.avgTemperature < 15 ? 'green' : 'orange',
      delay: 0.2,
    },
  ];

  const extraCards = [
    {
      label: 'Cajas Totales',
      value: stats.totalBoxes,
      sub: 'recibidas hoy',
      icon: IconBox,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      badge: 'Inventario',
      badgeColor: 'violet',
      delay: 0.25,
    },
    {
      label: 'Tiempo por Escaneo',
      value: '~40s',
      sub: 'escanear · pesar · confirmar',
      icon: IconClock,
      color: '#0891B2',
      bgColor: '#ECFEFF',
      badge: 'Eficiente',
      badgeColor: 'cyan',
      delay: 0.3,
    },
  ];

  const allCards = [...cards, ...extraCards];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing="md">
      {allCards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: card.delay || index * 0.05 }}
          style={{ height: '100%' }}
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
                <Text size="24px" fw={800} style={{ color: card.color, lineHeight: 1.2 }}>
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