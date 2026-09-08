// OrdenesCompraPC/components/SeguimientoOCs.tsx

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
  Divider,
  ScrollArea,
  ThemeIcon,
} from '@mantine/core';
import { IconList, IconRefresh, IconDownload, IconLink } from '@tabler/icons-react';
import type { OrdenCompraPC } from '../../types';

interface SeguimientoOCsProps {
  data: OrdenCompraPC[];
  filters: {
    proveedor: string | null;
    categoria: string | null;
    estatus: string;
  };
  onFilterChange: (filters: any) => void;
  options: {
    proveedores: string[];
    categorias: string[];
    estatus: string[];
  };
}

export function SeguimientoOCs({ data = [], filters, onFilterChange, options }: SeguimientoOCsProps) {
  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'autorizada': return 'blue';
      case 'recibida': return 'cyan';
      case 'facturada': return 'teal';
      case 'conciliada': return 'green';
      case 'borrador': return 'gray';
      default: return 'gray';
    }
  };

  const getEstatusLabel = (estatus: string) => {
    switch (estatus) {
      case 'autorizada': return 'Autorizada';
      case 'recibida': return 'Recibida';
      case 'facturada': return 'Facturada';
      case 'conciliada': return 'Conciliada';
      case 'borrador': return 'Borrador';
      default: return estatus;
    }
  };

  // ✅ Asegurar que data siempre sea un array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
              <IconLink size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#1A3A5C">Seguimiento de OCs · la cascada visible</Text>
              <Text size="xs" c="dimmed">{safeData.length} órdenes registradas</Text>
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

        <Group gap="md">
          <Select
            label="Proveedor"
            value={filters.proveedor}
            onChange={(value) => onFilterChange({ ...filters, proveedor: value })}
            data={options.proveedores}
            size="xs"
            w={180}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Categoría"
            value={filters.categoria}
            onChange={(value) => onFilterChange({ ...filters, categoria: value })}
            data={options.categorias}
            size="xs"
            w={180}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>OC</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Proveedor</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Categoría</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Total</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Estatus</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>CxP</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Destino</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {safeData.length > 0 ? (
                safeData.map((row) => {
                  // ✅ Asegurar que row.cxp existe
                  const cxpStatus = row.cxp || '';
                  const isConciliated = typeof cxpStatus === 'string' && cxpStatus.includes('✓');
                  
                  return (
                    <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                      <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>{row.noOC}</Table.Td>
                      <Table.Td style={{ fontSize: '12px' }}>{row.proveedor}</Table.Td>
                      <Table.Td style={{ fontSize: '12px' }}>
                        <Badge size="xs" color="gray" variant="light" radius="sm">
                          {row.categoria}
                        </Badge>
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>
                        ${row.total?.toLocaleString() || '0'}
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getEstatusColor(row.estatus)} size="xs" radius="sm">
                          {getEstatusLabel(row.estatus)}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {isConciliated ? (
                          <Badge size="xs" color="green" variant="light" radius="sm">
                            {cxpStatus}
                          </Badge>
                        ) : (
                          <Text size="xs" c="dimmed">{cxpStatus || '—'}</Text>
                        )}
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px' }}>{row.destino || '—'}</Table.Td>
                    </Table.Tr>
                  );
                })
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay órdenes de compra registradas</Text>
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