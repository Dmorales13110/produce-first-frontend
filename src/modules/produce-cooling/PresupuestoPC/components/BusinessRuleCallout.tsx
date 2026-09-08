// PresupuestoPC/components/BusinessRulesCallout.tsx

import React from 'react';
import { Paper, Group, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export function BusinessRulesCallout() {
  return (
    <Paper 
      p="sm" 
      radius="lg" 
      style={{ 
        backgroundColor: '#F0F7FF', 
        border: '1px solid #93C5FD',
      }}
    >
      <Group align="flex-start" gap="xs">
        <IconInfoCircle size={18} color="#1A4B8C" style={{ marginTop: 2, flexShrink: 0 }} />
        <Text size="xs" c="#1A3A5C" style={{ flex: 1, lineHeight: 1.5 }}>
          <strong>Al guardar:</strong> la bitácora de hielo (PC-4) registra producido Y comprado por día — 
          el % real contra el 50% del plan y el costo blended real contra $0.775 - 
          la OC semanal de hielo comprado sale del faltante: demanda del planificador - producción proyectada.
        </Text>
      </Group>
    </Paper>
  );
}