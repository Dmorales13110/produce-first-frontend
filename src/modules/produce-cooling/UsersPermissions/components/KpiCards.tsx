// UsersPermissions/components/KpiCards.tsx

import React from 'react';
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Stack, Badge } from '@mantine/core';
import { IconUsers, IconDeviceTablet, IconKey, IconFileCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { UsersPermissionsStats } from '../../types';

interface KpiCardsProps {
  stats: UsersPermissionsStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      label: 'Usuarios de planta',
      value: stats.totalUsuarios,
      sub: 'misma fórmula que USR-1',
      icon: IconUsers,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: `${stats.activos} activos`,
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'La tablet de la báscula',
      value: 'usuario compartido',
      sub: 'cada escaneo firma quién estaba',
      icon: IconDeviceTablet,
      color: '#2D6BAE',
      bgColor: '#EFF6FF',
      badge: 'Con turno',
      badgeColor: 'blue',
      delay: 0.1,
    },
    {
      label: 'PIN de autorización',
      value: `${stats.conPin} usuarios`,
      sub: 'pagos y cortes',
      icon: IconKey,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: `${stats.conPin} con PIN`,
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Bitácoras firmadas',
      value: 'siempre',
      sub: 'ciclo, hielo y carga con responsable',
      icon: IconFileCheck,
      color: '#2D8F5E',
      bgColor: '#ECFDF5',
      badge: 'Trazabilidad',
      badgeColor: 'green',
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