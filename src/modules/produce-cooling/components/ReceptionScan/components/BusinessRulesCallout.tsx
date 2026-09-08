// ReceptionScan/components/BusinessRulesCallout.tsx

import React from 'react';
import { Paper, Group, Text, Box } from '@mantine/core';
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
          <strong>Al guardar:</strong> al confirmar: entra al <strong>inventario PT</strong> por folio · 
          se abona la recepción a la <strong>cuenta del productor</strong> (dispara su anticipo si aplica) · 
          la diferencia boleta vs recibido queda como <strong>merma en tránsito con responsable</strong> · 
          y la trazabilidad queda completa: cuando este folio se venda, el cliente se conecta hasta la postura y la semilla.
        </Text>
      </Group>
    </Paper>
  );
}