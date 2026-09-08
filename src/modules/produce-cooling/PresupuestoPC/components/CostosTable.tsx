// PresupuestoPC/components/CostosTable.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  NumberInput,
  ScrollArea,
  ThemeIcon,
  Badge,
  Divider,
} from '@mantine/core';
import { IconWallet } from '@tabler/icons-react';
import type { CostoPC } from '../../types';

interface CostosTableProps {
  data: CostoPC[];
  onUpdate: (key: string, valor: number) => void;
  tcMxnUsd: number;
}

export function CostosTable({ data, onUpdate, tcMxnUsd }: CostosTableProps) {
  const totalMXN = data.reduce((sum, c) => sum + c.valor, 0);
  const totalUSD = totalMXN / tcMxnUsd;

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconWallet size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            3. Captura · Presupuesto de costos - línea por línea
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Amarillo = editable
          </Badge>
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Categoría / concepto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Base</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Presupuesto temporada (MXN)
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((row) => (
                <Table.Tr key={row.key} style={{ borderBottom: '1px solid #F0F4FF' }}>
                  <Table.Td style={{ fontSize: '12px' }}>{row.label}</Table.Td>
                  <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.base}</Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    <NumberInput
                      value={row.valor}
                      onChange={(val) => onUpdate(row.key, Number(val))}
                      prefix="$"
                      thousandSeparator=","
                      size="xs"
                      w={150}
                      styles={{ 
                        input: { 
                          textAlign: 'right', 
                          backgroundColor: '#FEF9C3', 
                          fontWeight: 600,
                          marginLeft: 'auto',
                        } 
                      }}
                    />
                  </Table.Td>
                </Table.Tr>
              ))}

              <Table.Tr style={{ backgroundColor: '#F8FAFC', borderTop: '2px solid #E5E7EB' }}>
                <Table.Td colSpan={2} style={{ fontSize: '13px', fontWeight: 800, color: '#1A3A5C' }}>
                  TOTAL COSTOS
                </Table.Td>
                <Table.Td style={{ textAlign: 'right', fontSize: '14px', fontWeight: 800, color: '#1A4B8C' }}>
                  ${totalMXN.toLocaleString()} (${Math.round(totalUSD).toLocaleString()} USD)
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Cada XML conciliado en PC-CXP cae contra SU renglón
        </Text>
      </Stack>
    </Paper>
  );
}