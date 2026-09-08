// CxcServiciosFacturados/components/ListaMaestraCxc.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  Checkbox,
  Badge,
  SegmentedControl,
  Select,
  TextInput,
  ScrollArea,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { IconList, IconRefresh } from '@tabler/icons-react';
import type { CuentaCxc } from '../../types';

interface ListaMaestraCxcProps {
  data: CuentaCxc[];
  filters: {
    cliente: string | null;
    servicio: string | null;
    estatus: string;
  };
  onFilterChange: (filters: any) => void;
  onSelectionChange: (ids: number[]) => void;
  options: {
    clientes: string[];
    servicios: string[];
    estatus: string[];
  };
}

export function ListaMaestraCxc({ data, filters, onFilterChange, onSelectionChange, options }: ListaMaestraCxcProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
      onSelectionChange([]);
    } else {
      const allIds = data.map(row => row.id);
      setSelectedIds(allIds);
      onSelectionChange(allIds);
    }
  };

  const toggleSelectRow = (id: number) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter(item => item !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelected);
    onSelectionChange(newSelected);
  };

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'por cobrar': return 'blue';
      case 'vencida': return 'red';
      case 'cobrada': return 'gray';
      default: return 'gray';
    }
  };

  const getEstatusLabel = (estatus: string) => {
    switch (estatus) {
      case 'por cobrar': return 'Por cobrar';
      case 'vencida': return 'Vencida';
      case 'cobrada': return 'Cobrada';
      default: return estatus;
    }
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
              <IconList size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#1A3A5C">Lista maestra por cobrar</Text>
              <Text size="xs" c="dimmed">{data.length} facturas registradas</Text>
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
            label="Cliente"
            value={filters.cliente}
            onChange={(value) => onFilterChange({ ...filters, cliente: value })}
            data={options.clientes}
            size="xs"
            w={160}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Servicio"
            value={filters.servicio}
            onChange={(value) => onFilterChange({ ...filters, servicio: value })}
            data={options.servicios}
            size="xs"
            w={160}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '900px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ width: 40, textAlign: 'center' }}>
                  <Checkbox
                    size="xs"
                    checked={selectedIds.length === data.length && data.length > 0}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                    onChange={toggleSelectAll}
                  />
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>F. factura</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cliente</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Factura</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Total
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Cobrado
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Saldo
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                  Crédito
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Vence</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', width: 90 }}>
                  F. cobro
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row) => {
                  const isSelected = selectedIds.includes(row.id);
                  const isCobrada = row.estatus === 'cobrada';

                  return (
                    <Table.Tr 
                      key={row.id} 
                      style={{ 
                        backgroundColor: isSelected ? '#F0FDF4' : 'white',
                        borderBottom: '1px solid #F0F4FF',
                      }}
                    >
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Checkbox
                          size="xs"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(row.id)}
                          disabled={isCobrada}
                        />
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px' }}>{row.fFactura}</Table.Td>
                      <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>
                        {row.cliente}
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px' }}>{row.factura}</Table.Td>
                      <Table.Td style={{ fontSize: '12px' }}>{row.concepto}</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                        ${row.total.toLocaleString()}
                      </Table.Td>
                      <Table.Td style={{ 
                        fontSize: '12px', 
                        textAlign: 'right',
                        color: isCobrada ? '#16A34A' : undefined,
                      }}>
                        {row.cobrado > 0 ? `$${row.cobrado.toLocaleString()}` : '$0'}
                      </Table.Td>
                      <Table.Td style={{ 
                        fontSize: '12px', 
                        textAlign: 'right', 
                        fontWeight: 600,
                        color: row.saldo > 0 ? '#DC2626' : '#16A34A',
                      }}>
                        ${row.saldo.toLocaleString()}
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'center' }}>{row.credito}</Table.Td>
                      <Table.Td style={{ 
                        fontSize: '12px',
                        color: row.estatus === 'vencida' ? '#DC2626' : undefined,
                      }}>
                        {row.vence}
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <TextInput
                          value={row.fCobro}
                          placeholder=""
                          size="xs"
                          variant="unstyled"
                          readOnly={isCobrada}
                          styles={{
                            input: {
                              backgroundColor: row.fCobro ? '#E5E7EB' : '#FEF9C3',
                              textAlign: 'center',
                              borderRadius: 4,
                              fontSize: '11px',
                              width: '80px',
                              margin: '0 auto',
                            },
                          }}
                        />
                      </Table.Td>
                    </Table.Tr>
                  );
                })
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={11} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay facturas registradas</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Espejo exacto de la CxC del grower: crédito, vencimiento, cobrada y fecha
        </Text>
      </Stack>
    </Paper>
  );
}