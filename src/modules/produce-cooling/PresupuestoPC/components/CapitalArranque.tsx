// PresupuestoPC/components/CapitalArranque.tsx

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
import { IconAlertTriangle } from '@tabler/icons-react';
import type { CapitalArranque } from '../../types';

interface CapitalArranqueProps {
  data: CapitalArranque[];
}

export function CapitalArranque({ data }: CapitalArranqueProps) {
  const total = data.reduce((sum, c) => sum + c.monto, 0);

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
            <IconAlertTriangle size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#DC2626">
            Capital de arranque
          </Text>
          <Badge size="xs" color="red" variant="light" radius="sm">
            Necesario antes de operar
          </Badge>
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '400px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  MXN
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cuándo</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((row, idx) => (
                <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                  <Table.Td style={{ fontSize: '12px' }}>{row.concepto}</Table.Td>
                  <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                    ${row.monto.toLocaleString()}
                  </Table.Td>
                  <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.cuando}</Table.Td>
                </Table.Tr>
              ))}

              <Table.Tr style={{ backgroundColor: '#F8FAFC', borderTop: '2px solid #E5E7EB' }}>
                <Table.Td style={{ fontSize: '13px', fontWeight: 800, color: '#1A3A5C' }}>TOTAL</Table.Td>
                <Table.Td style={{ fontSize: '13px', textAlign: 'right', fontWeight: 800, color: '#DC2626' }}>
                  ${total.toLocaleString()}
                </Table.Td>
                <Table.Td style={{ fontSize: '13px', fontWeight: 700, color: '#1A4B8C' }}>
                  (${(total / 17.5).toFixed(0)} USD)
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </Paper>
  );
}