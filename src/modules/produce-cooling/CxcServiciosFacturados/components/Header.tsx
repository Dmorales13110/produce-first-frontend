// CxcServiciosFacturados/components/Header.tsx

import React from 'react';
import { Paper, Group, Text, Badge } from '@mantine/core';
import { IconCreditCardHand, IconBox } from '@tabler/icons-react';

export function CxcServiciosFacturadosHeader() {
  return (
    <Paper 
      p="sm" 
      radius="lg" 
      style={{ 
        background: 'linear-gradient(135deg, #1A4B8C 0%, #2D6BAE 50%, #4A8BC2 100%)',
        color: '#FFFFFF',
      }}
    >
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <IconCreditCardHand size={20} style={{ opacity: 0.8 }} />
          <Text fw={700} size="lg" c="white">
            Produce Cooling — CxC · Servicios Facturados
          </Text>
          <Badge size="xs" variant="white" color="blue" radius="sm">
            PC-CXC
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

        <Group gap="xs">
          <Badge variant="outline" color="gray.2" radius="sm" style={{ color: '#FFFFFF', borderColor: '#ffffff50' }}>
            <Group gap={4}>
              <IconBox size={12} />
              Del corte de bitácoras al cobro semanal
            </Group>
          </Badge>
        </Group>
      </Group>
    </Paper>
  );
}