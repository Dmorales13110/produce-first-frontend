// ReceptionScan/components/ReceptionHeader.tsx

import React from 'react';
import { Paper, Group, Text, Badge, Stack, Box } from '@mantine/core';
import { IconCalendar, IconBuilding, IconScan, IconSnowflake } from '@tabler/icons-react';

export function ReceptionHeader() {
  return (
    <Paper 
      p="md" 
      radius="lg" 
      style={{ 
        background: 'linear-gradient(135deg, #1A4B8C 0%, #2D6BAE 50%, #4A8BC2 100%)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Group justify="space-between" align="center" style={{ position: 'relative', zIndex: 1 }}>
        <Stack gap={2}>
          <Group gap="xs">
            <Badge size="xs" variant="white" color="blue" radius="sm">
              PC-1 · Escaneo de Recepción
            </Badge>
            <Badge 
              size="xs" 
              variant="light" 
              color="gray" 
              radius="sm" 
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}
            >
              Invierno 2026-2027
            </Badge>
          </Group>
          <Group gap="sm" align="center">
            <IconSnowflake size={24} style={{ opacity: 0.8 }} />
            <Text size="24px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
              Produce Cooling — Recepción
            </Text>
            <Badge 
              size="lg" 
              variant="light" 
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}
            >
              Escanear y Confirmar
            </Badge>
          </Group>
          <Group gap="xl" mt={2}>
            <Group gap={4}>
              <IconCalendar size={14} style={{ opacity: 0.7 }} />
              <Text size="xs" style={{ opacity: 0.8 }}>Hoy: {new Date().toLocaleDateString('es-MX')}</Text>
            </Group>
            <Group gap={4}>
              <IconBuilding size={14} style={{ opacity: 0.7 }} />
              <Text size="xs" style={{ opacity: 0.8 }}>Daily Veggies · San Aparicio</Text>
            </Group>
            <Group gap={4}>
              <IconScan size={14} style={{ opacity: 0.7 }} />
              <Text size="xs" style={{ opacity: 0.8 }}>Escanear · Pesar · Confirmar — 40s por camión</Text>
            </Group>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
}