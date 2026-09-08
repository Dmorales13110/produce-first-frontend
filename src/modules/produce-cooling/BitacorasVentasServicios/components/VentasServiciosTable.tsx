// BitacorasVentasServicios/components/VentasServiciosTable.tsx

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
import { IconCoin, IconRefresh, IconDownload } from '@tabler/icons-react';
import type { VentaServicioRecord } from '../../types';

interface VentasServiciosTableProps {
  data?: VentaServicioRecord[]; // ✅ Hacer opcional
  filters: {
    rango: string;
    cliente: string;
    servicio: string;
  };
  onFilterChange: (filters: any) => void;
  options: {
    clientes: string[];
    servicios: string[];
    rangos: string[];
  };
}

export function VentasServiciosTable({ 
  data = [], // ✅ Valor por defecto
  filters, 
  onFilterChange, 
  options 
}: VentasServiciosTableProps) {
  // ✅ Validación de seguridad antes de usar reduce
  const totals = (data || []).reduce(
    (acc, row) => ({
      enfriadas: acc.enfriadas + (row.enfriadas || 0),
      servicio: acc.servicio + (row.servicio || 0),
      hielo: acc.hielo + (row.hielo || 0),
      repack: acc.repack + (row.repack || 0),
      total: acc.total + (row.total || 0),
      pagado: acc.pagado + (row.pagado || 0),
      pendiente: acc.pendiente + (row.pendiente || 0),
    }),
    { enfriadas: 0, servicio: 0, hielo: 0, repack: 0, total: 0, pagado: 0, pendiente: 0 }
  );

  // ✅ Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Stack gap="md" align="center" py="xl">
          <ThemeIcon size="xl" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconCoin size={24} />
          </ThemeIcon>
          <Text size="lg" fw={600} c="#1A3A5C">No hay datos disponibles</Text>
          <Text size="sm" c="dimmed">No se encontraron registros de ventas de servicios</Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
              <IconCoin size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#1A3A5C">Ventas de Servicios - el corte, como tu Hoja2</Text>
              <Text size="xs" c="dimmed">{data.length} productos registrados</Text>
            </Stack>
          </Group>

          <SegmentedControl
            size="xs"
            value={filters.rango}
            onChange={(value) => onFilterChange({ ...filters, rango: value })}
            data={options.rangos}
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
            label="Cliente"
            value={filters.cliente}
            onChange={(value) => onFilterChange({ ...filters, cliente: value })}
            data={options.clientes}
            size="xs"
            w={150}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Servicio"
            value={filters.servicio}
            onChange={(value) => onFilterChange({ ...filters, servicio: value })}
            data={options.servicios}
            size="xs"
            w={150}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '800px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Producto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas enfriadas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Servicio $</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Hielo $</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Repack $</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Total</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Pagado</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Pendiente</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((row, idx) => (
                <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                  <Table.Td style={{ fontSize: '12px', fontWeight: 500 }}>{row.producto}</Table.Td>
                  <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>{row.enfriadas.toLocaleString()}</Table.Td>
                  <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>${row.servicio.toLocaleString()}</Table.Td>
                  <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                    {row.hielo > 0 ? `$${row.hielo.toLocaleString()}` : '—'}
                  </Table.Td>
                  <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                    {row.repack > 0 ? `$${row.repack.toLocaleString()}` : '—'}
                  </Table.Td>
                  <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>
                    ${row.total.toLocaleString()}
                  </Table.Td>
                  <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#16A34A' }}>
                    ${row.pagado.toLocaleString()}
                  </Table.Td>
                  <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#D97706', fontWeight: 600 }}>
                    ${row.pendiente.toLocaleString()}
                  </Table.Td>
                </Table.Tr>
              ))}

              {/* Total Row */}
              <Table.Tr style={{ backgroundColor: '#F8FAFC', borderTop: '2px solid #E5E7EB' }}>
                <Table.Td style={{ fontSize: '12px', fontWeight: 800, color: '#1A3A5C' }}>TOTAL</Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800 }}>
                  {totals.enfriadas.toLocaleString()}
                </Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800 }}>
                  ${totals.servicio.toLocaleString()}
                </Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800 }}>
                  ${totals.hielo.toLocaleString()}
                </Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800 }}>
                  ${totals.repack.toLocaleString()}
                </Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#1A4B8C' }}>
                  ${totals.total.toLocaleString()}
                </Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#16A34A' }}>
                  ${totals.pagado.toLocaleString()}
                </Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#D97706' }}>
                  ${totals.pendiente.toLocaleString()}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Cada folio + sus bitácoras = el cargo · con pagado y pendiente por producto
        </Text>
      </Stack>
    </Paper>
  );
}