// Payroll/components/BusinessRulesCallout.tsx

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
          <strong>Al guardar:</strong> la nómina cae a su renglón del presupuesto (PC-PRE) · 
          el destajo de repack se traslada directo contra el ingreso de $0.35 · 
          finiquitos de fin de temporada ($287,079) ya presupuestados · el pago sale en la corrida del viernes de PC.
        </Text>
      </Group>
    </Paper>
  );
}