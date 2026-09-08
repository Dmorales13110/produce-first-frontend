// CxcServiciosFacturados/components/BusinessRulesCallout.tsx

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
          <strong>Al guardar:</strong> el cobro alimenta el flujo de PC-BAN · 
          la factura a PF es intercompañía y se elimina en el consolidado del grupo · 
          el ciclo semanal: servicios → corte → factura → cobro en 7 días.
        </Text>
      </Group>
    </Paper>
  );
}