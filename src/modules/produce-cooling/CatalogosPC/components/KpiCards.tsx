// CatalogosPC/components/KpiCards.tsx

import React from 'react';
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Stack, Badge } from '@mantine/core';
import { IconBooks, IconStar, IconPlus, IconSnowflake } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { CatalogosPCStats } from '../../types';

interface KpiCardsProps {
  stats: CatalogosPCStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      label: 'Misma fórmula que el grower',
      value: 'CAT-1',
      sub: 'proveedores con crédito y lead time · productos con mín/máx',
      icon: IconBooks,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      delay: 0.05,
    },
    {
      label: 'El proveedor estrella',
      value: stats.proveedorEstrella,
      sub: stats.gastoEstrella,
      icon: IconStar,
      color: '#D97706',
      bgColor: '#FFFBEB',
      delay: 0.1,
    },
    {
      label: 'Se captura',
      value: 'al dar de alta',
      sub: 'OC, CxP e inventario lo usan solos',
      icon: IconPlus,
      color: '#2D6BAE',
      bgColor: '#EFF6FF',
      delay: 0.15,
    },
    {
      label: 'Peculiaridad de PC',
      value: 'el hielo',
      sub: stats.peculiaridad,
      icon: IconSnowflake,
      color: '#2563EB',
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