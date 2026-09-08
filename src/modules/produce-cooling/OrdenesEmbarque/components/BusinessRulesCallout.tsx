// OrdenesEmbarque/components/BusinessRulesCallout.tsx

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
          <strong>Al guardar:</strong> al confirmar: el <strong>inventario PT (PC-1) descuenta de esos folios exactos</strong> · 
          PF recibe la confirmación y la proforma se vuelve <strong>factura (PF-6)</strong> con las cajas REALES cargadas · 
          si hubo diferencia, PF factura lo real y el folio guarda la causa — nadie factura lo que no subió al camión.
        </Text>
      </Group>
    </Paper>
  );
}