// CxpSATConciliado/components/ListaMaestra.tsx

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
import type { CuentaCxp } from '../../types';

interface ListaMaestraProps {
  data: CuentaCxp[];
  filters: {
    proveedor: string | null;
    categoria: string | null;
    estatus: string;
  };
  onFilterChange: (filters: any) => void;
  onSelectionChange: (ids: number[]) => void;
  options: {
    proveedores: string[];
    categorias: string[];
    estatus: string[];
  };
}

export function ListaMaestra({ data, filters, onFilterChange, onSelectionChange, options }: ListaMaestraProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([1]);

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

  const getEstatusLabel = (estatus: string) => {
    switch (estatus) {
      case 'sin vencer': return 'Sin vencer';
      case 'por vencer': return 'Por vencer';
      case 'vencida': return 'Vencida';
      case 'pagada': return 'Pagada';
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
              <Text size="sm" fw={700} c="#1A3A5C">3. Lista maestra · tu fórmula del archivo de flujo</Text>
              <Text size="xs" c="dimmed">{data.length} cuentas registradas</Text>
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
            w={160}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Categoría"
            value={filters.categoria}
            onChange={(value) => onFilterChange({ ...filters, categoria: value })}
            data={options.categorias}
            size="xs"
            w={160}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '1000px' }}>
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
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Proveedor</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Total MXN
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Pagado
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Saldo
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                  Crédito
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Vence</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', width: 90 }}>
                  F. pago
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                  Estatus
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row) => {
                  const isSelected = selectedIds.includes(row.id);
                  const isPagada = row.estatus === 'pagada';

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
                          disabled={isPagada}
                        />
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px' }}>{row.fFactura}</Table.Td>
                      <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>
                        {row.proveedor}
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px' }}>{row.concepto}</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                        ${row.totalMXN.toLocaleString()}
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: isPagada ? '#16A34A' : undefined }}>
                        {row.pagado > 0 ? `$${row.pagado.toLocaleString()}` : '$0'}
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
                        color: row.estatus === 'vencida' ? '#DC2626' : 
                               row.estatus === 'por vencer' ? '#D97706' : undefined,
                      }}>
                        {row.vence}
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <TextInput
                          value={row.fPago}
                          placeholder=""
                          size="xs"
                          variant="unstyled"
                          readOnly={isPagada}
                          styles={{
                            input: {
                              backgroundColor: row.fPago ? '#E5E7EB' : '#FEF9C3',
                              textAlign: 'center',
                              borderRadius: 4,
                              fontSize: '11px',
                              width: '80px',
                              margin: '0 auto',
                            },
                          }}
                        />
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Badge color={row.colorEstatus} size="xs" radius="sm">
                          {getEstatusLabel(row.estatus)}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  );
                })
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={11} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay cuentas registradas</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Mismas columnas · filtrable por proveedor, concepto, categoría o estatus
        </Text>
      </Stack>
    </Paper>
  );
}