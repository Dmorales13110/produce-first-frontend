// CashFlow/components/FlujoTable.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  ScrollArea,
  ThemeIcon,
  Box,
} from '@mantine/core';
import { IconList } from '@tabler/icons-react';
import type { CashFlowRecord } from '../../types';

interface FlujoTableProps {
  data: CashFlowRecord[];
}

export function FlujoTable({ data }: FlujoTableProps) {
  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconList size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            Detalle del flujo semanal
          </Text>
          <Box ml="auto">
            <Group gap="lg">
              <Group gap={6}>
                <Box style={{ width: 10, height: 10, backgroundColor: '#16A34A', borderRadius: 2 }} />
                <Text size="xs" c="dimmed">Neto positivo</Text>
              </Group>
              <Group gap={6}>
                <Box style={{ width: 10, height: 10, backgroundColor: '#DC2626', borderRadius: 2 }} />
                <Text size="xs" c="dimmed">Neto negativo</Text>
              </Group>
            </Group>
          </Box>
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '500px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Semana</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Entradas
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Salidas
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Neto
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Nota</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>
                      {row.semana}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                      ${(row.entradas / 1000).toFixed(1)}K
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#DC2626' }}>
                      ${(row.salidas / 1000).toFixed(1)}K
                    </Table.Td>
                    <Table.Td
                      style={{
                        fontSize: '12px',
                        textAlign: 'right',
                        fontWeight: 700,
                        color: row.neto >= 0 ? '#16A34A' : '#DC2626',
                      }}
                    >
                      {row.neto >= 0 ? '+' : ''}{row.neto < 0 ? '-' : ''}${Math.abs(row.neto / 1000).toFixed(1)}K
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.nota}</Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay datos de flujo</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </Paper>
  );
}