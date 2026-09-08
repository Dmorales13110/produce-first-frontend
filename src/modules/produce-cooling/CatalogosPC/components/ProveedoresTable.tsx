
// CatalogosPC/components/ProveedoresTable.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  SegmentedControl,
  Select,
  NumberInput,
  Box,
  Divider,
  ScrollArea,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import { IconUsers, IconRefresh } from '@tabler/icons-react';
import type { ProveedorPC } from '../../types';

interface ProveedoresTableProps {
  data: ProveedorPC[];
  filters: {
    tipo: string | null;
    estatus: string;
  };
  onFilterChange: (filters: any) => void;
  onUpdate: (id: number, data: Partial<ProveedorPC>) => void;
  options: {
    tipos: string[];
    estatus: string[];
  };
}

export function ProveedoresTable({ data, filters, onFilterChange, onUpdate, options }: ProveedoresTableProps) {
  const handleCreditoChange = (id: number, val: number | string) => {
    onUpdate(id, { credito: Number(val) });
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
              <IconUsers size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#1A3A5C">Proveedores · crédito y lead time</Text>
              <Text size="xs" c="dimmed">{data.length} proveedores registrados</Text>
            </Stack>
          </Group>

          <SegmentedControl
            size="xs"
            value={filters.estatus}
            onChange={(value) => onFilterChange({ ...filters, estatus: value })}
            data={options.estatus}
            styles={{
              root: { backgroundColor: '#F0F4FF' },
              indicator: { backgroundColor: '#1A4B8C' },
              label: { fontWeight: 600 }
            }}
          />
        </Group>

        <Divider />

        <Box style={{ maxWidth: 200 }}>
          <Select
            label="Tipo"
            value={filters.tipo}
            onChange={(value) => onFilterChange({ ...filters, tipo: value })}
            data={options.tipos}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </Box>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Proveedor</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Tipo</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Condiciones</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 100 }}>
                  Crédito (días)
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 100 }}>
                  Lead time
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Gasto temporada
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                  Estado
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>{row.proveedor}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.tipo}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.condiciones}</Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <NumberInput
                        value={row.credito}
                        onChange={(val) => handleCreditoChange(row.id, val)}
                        size="xs"
                        w={60}
                        styles={{
                          input: {
                            textAlign: 'center',
                            backgroundColor: '#FEF9C3',
                            fontWeight: 600,
                            margin: '0 auto',
                          },
                        }}
                      />
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center', fontSize: '12px' }}>
                      {row.leadTime !== '—' ? (
                        <Box
                          component="span"
                          px={8}
                          py={2}
                          style={{
                            backgroundColor: '#FEF9C3',
                            borderRadius: 4,
                            fontWeight: 600,
                            display: 'inline-block',
                            fontSize: '12px',
                          }}
                        >
                          {row.leadTime}
                        </Box>
                      ) : (
                        <Text size="xs" c="dimmed">—</Text>
                      )}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>{row.gasto}</Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Badge 
                        size="xs" 
                        color={row.isActive ? 'green' : 'gray'} 
                        variant="light" 
                        radius="sm"
                      >
                        {row.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay proveedores registrados</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          El crédito calcula el vencimiento en PC-CXP · el lead time las alertas de reposición
        </Text>
      </Stack>
    </Paper>
  );
}