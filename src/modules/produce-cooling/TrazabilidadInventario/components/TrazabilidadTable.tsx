// TrazabilidadInventario/components/TrazabilidadTable.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  Badge,
  SegmentedControl,
  Select,
  ScrollArea,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { IconList, IconRefresh, IconSearch } from '@tabler/icons-react';
import type { TrazabilidadRecord } from '../../types';

interface TrazabilidadTableProps {
  data: TrazabilidadRecord[];
  filters: {
    productor: string | null;
    vegetal: string | null;
    estado: string;
  };
  onFilterChange: (filters: any) => void;
  options: {
    productores: string[];
    vegetales: string[];
    estados: string[];
  };
}

export function TrazabilidadTable({ data, filters, onFilterChange, options }: TrazabilidadTableProps) {
  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
              <IconSearch size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#1A3A5C">Vista 1 · Trazabilidad por folio</Text>
              <Text size="xs" c="dimmed">{data.length} folios registrados</Text>
            </Stack>
          </Group>

          <SegmentedControl
            size="xs"
            value={filters.estado}
            onChange={(value) => onFilterChange({ ...filters, estado: value })}
            data={options.estados}
            styles={{
              root: { backgroundColor: '#F0F4FF' },
              indicator: { backgroundColor: '#1A4B8C' },
              label: { fontWeight: 600 }
            }}
          />
        </Group>

        <Divider />

        <Group gap="md">
          <Select
            label="Productor"
            value={filters.productor}
            onChange={(value) => onFilterChange({ ...filters, productor: value })}
            data={options.productores}
            size="xs"
            w={180}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Vegetal"
            value={filters.vegetal}
            onChange={(value) => onFilterChange({ ...filters, vegetal: value })}
            data={options.vegetales}
            size="xs"
            w={180}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table 
            highlightOnHover 
            withColumnBorders 
            verticalSpacing="xs"
            horizontalSpacing="xs"
            style={{ minWidth: '1100px' }}
          >
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>F. recepción</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio cosecha</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Productor</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Vegetal</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas recibidas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio venta 1</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio venta 2</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio venta 3</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', backgroundColor: '#F0FDF4' }}>
                  Saldo en frío
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px' }}>{row.fecha}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>{row.folio}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.productor}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.vegetal}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>{row.recibidas.toLocaleString()}</Table.Td>
                    
                    {/* Ventas 1 */}
                    <Table.Td style={{ fontSize: '12px', color: row.ventas[0]?.folio !== '—' ? '#2563EB' : undefined }}>
                      {row.ventas[0]?.folio || '—'}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                      {row.ventas[0]?.cajas || '—'}
                    </Table.Td>
                    
                    {/* Ventas 2 */}
                    <Table.Td style={{ fontSize: '12px', color: row.ventas[1]?.folio !== '—' ? '#2563EB' : undefined }}>
                      {row.ventas[1]?.folio || '—'}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                      {row.ventas[1]?.cajas || '—'}
                    </Table.Td>
                    
                    {/* Ventas 3 */}
                    <Table.Td style={{ fontSize: '12px', color: row.ventas[2]?.folio !== '—' ? '#2563EB' : undefined }}>
                      {row.ventas[2]?.folio || '—'}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                      {row.ventas[2]?.cajas || '—'}
                    </Table.Td>
                    
                    <Table.Td style={{ 
                      fontSize: '12px', 
                      textAlign: 'right', 
                      fontWeight: 700, 
                      backgroundColor: row.saldo > 0 ? '#F0FDF4' : '#FEF2F2',
                      color: row.saldo > 0 ? '#16A34A' : '#DC2626',
                    }}>
                      {row.saldo}
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={12} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay registros de trazabilidad</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Tu archivo exacto: la recepción a la izquierda, las ventas parciales a la derecha · el saldo es lo que queda en frío
        </Text>
      </Stack>
    </Paper>
  );
}