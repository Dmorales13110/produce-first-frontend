// OrdenesEmbarque/components/OrdenesTable.tsx

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
import { IconList, IconRefresh, IconDownload } from '@tabler/icons-react';
import type { OrdenEmbarque } from '../../types';

interface OrdenesTableProps {
  data: OrdenEmbarque[];
  filters: {
    cliente: string | null;
    estatus: string | null;
    rango: string;
  };
  onFilterChange: (filters: any) => void;
  options: {
    clientes: string[];
    estatus: string[];
    rangos: string[];
  };
}

export function OrdenesTable({ data, filters, onFilterChange, options }: OrdenesTableProps) {
  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
              <IconList size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#1A3A5C">Órdenes de la semana</Text>
              <Text size="xs" c="dimmed">{data.length} órdenes registradas</Text>
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
            w={160}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Estatus"
            value={filters.estatus}
            onChange={(value) => onFilterChange({ ...filters, estatus: value })}
            data={options.estatus}
            size="xs"
            w={160}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Proforma</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cliente</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Salida</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Aceptada</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Confirmada</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Estatus</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>{row.proforma}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.cliente}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.salida}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>{row.cajas}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>
                      {row.aceptada !== '—' ? (
                        <Badge size="xs" color="green" variant="light" radius="sm">
                          {row.aceptada}
                        </Badge>
                      ) : (
                        <Text size="xs" c="dimmed">—</Text>
                      )}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>
                      {row.confirmada !== '—' && row.confirmada !== 'en carga' ? (
                        <Badge size="xs" color="blue" variant="light" radius="sm">
                          {row.confirmada}
                        </Badge>
                      ) : row.confirmada === 'en carga' ? (
                        <Badge size="xs" color="yellow" variant="light" radius="sm">
                          En carga
                        </Badge>
                      ) : (
                        <Text size="xs" c="dimmed">—</Text>
                      )}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>
                      <Badge color={row.color} size="xs" radius="sm">
                        {row.estatus === 'por aceptar' && 'Por aceptar'}
                        {row.estatus === 'cargando' && 'Cargando'}
                        {row.estatus === 'confirmada' && 'Confirmada'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay órdenes registradas</Text>
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