// PresupuestoPC/components/VolumenTable.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  ScrollArea,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import type { VolumenPresupuestado } from '../../types';

interface VolumenTableProps {
  data: VolumenPresupuestado[];
}

export function VolumenTable({ data }: VolumenTableProps) {
  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconChartBar size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            2. Captura · Volumen presupuestado
          </Text>
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '500px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Fuente</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Cajas temporada
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Con hielo
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Nota</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((row, idx) => (
                <Table.Tr 
                  key={idx} 
                  style={{ 
                    backgroundColor: row.isTotal ? '#F8FAFC' : row.isDestacado ? '#FEF9C3' : 'white',
                    borderBottom: '1px solid #F0F4FF',
                  }}
                >
                  <Table.Td style={{ 
                    fontSize: '12px', 
                    fontWeight: row.isTotal ? 800 : row.isDestacado ? 600 : 400,
                  }}>
                    {row.fuente}
                  </Table.Td>
                  <Table.Td style={{ 
                    fontSize: '12px', 
                    textAlign: 'right', 
                    fontWeight: row.isTotal ? 800 : 700,
                  }}>
                    {row.cajas.toLocaleString()}
                  </Table.Td>
                  <Table.Td style={{ 
                    fontSize: '12px', 
                    textAlign: 'right', 
                    fontWeight: row.isTotal ? 800 : 700,
                  }}>
                    {row.conHielo > 0 ? row.conHielo.toLocaleString() : '—'}
                  </Table.Td>
                  <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>
                    {row.nota}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Producir el 50% = 144,000 cj = 125 días = 1,152 cj/día = ~4 kg = 9.2 t/día — cómodo contra los 17.3 reales
        </Text>
      </Stack>
    </Paper>
  );
}