// TrazabilidadInventario/components/KardexTable.tsx

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
import { IconBook, IconRefresh } from '@tabler/icons-react';
import type { KardexRecord } from '../../types';

interface KardexTableProps {
  data: KardexRecord[];
  filters: {
    producto: string | null;
    rango: string;
  };
  onFilterChange: (filters: any) => void;
  options: {
    productos: string[];
    rangos: string[];
  };
}

export function KardexTable({ data, filters, onFilterChange, options }: KardexTableProps) {
  // Obtener nombres de productos únicos
  const productos = data.length > 0 ? data[0].productos.map(p => p.nombre) : [];

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
              <IconBook size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#1A3A5C">Vista 2 · Kardex diario por producto</Text>
              <Text size="xs" c="dimmed">{data.length} movimientos registrados</Text>
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
            label="Producto"
            value={filters.producto}
            onChange={(value) => onFilterChange({ ...filters, producto: value })}
            data={options.productos}
            size="xs"
            w={200}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table 
            highlightOnHover 
            withColumnBorders 
            verticalSpacing="xs"
            style={{ minWidth: '700px' }}
          >
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Fecha</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Movimiento</Table.Th>
                {productos.map((producto) => (
                  <React.Fragment key={producto}>
                    <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                      {producto} T×C
                    </Table.Th>
                    <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                      {producto} cajas
                    </Table.Th>
                  </React.Fragment>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row, idx) => {
                  const isInventario = row.movimiento === 'INVENTARIO';
                  return (
                    <Table.Tr 
                      key={idx} 
                      style={{ 
                        backgroundColor: isInventario ? '#FAFAFA' : 'white',
                        borderBottom: '1px solid #F0F4FF',
                      }}
                    >
                      <Table.Td style={{ fontSize: '12px' }}>{row.fecha}</Table.Td>
                      <Table.Td style={{ 
                        fontSize: '12px', 
                        fontWeight: isInventario ? 700 : 500, 
                        color: isInventario ? '#4B5563' : undefined 
                      }}>
                        {row.movimiento}
                      </Table.Td>
                      
                      {row.productos.map((producto, pIdx) => (
                        <React.Fragment key={pIdx}>
                          <Table.Td style={{ textAlign: 'center' }}>
                            {producto.tc && (
                              <Badge color="amber.2" variant="filled" c="dark.8" radius="xs" size="xs">
                                {producto.tc}
                              </Badge>
                            )}
                          </Table.Td>
                          <Table.Td style={{ 
                            fontSize: '12px', 
                            textAlign: 'right', 
                            fontWeight: isInventario ? 700 : 400,
                            color: producto.cajas.startsWith('-') ? '#DC2626' : 
                                   producto.cajas.startsWith('+') ? '#16A34A' : undefined,
                          }}>
                            {producto.cajas}
                          </Table.Td>
                        </React.Fragment>
                      ))}
                    </Table.Tr>
                  );
                })
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={1 + (productos.length * 2)} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay registros de kardex</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Text size="xs" c="dimmed">
          Las cargas se nombran solas con la proforma (PC-EMB) · el RECIBIDO nace del escaneo (ESC-1) · nadie teclea el inventario: es la suma
        </Text>
        <Text size="xs" fw={700} c="#1A3A5C">
          Tu inventario en T | C (tarimas × cajas/tarima) · cada carga con nombre, el inventario se acumula solo
        </Text>
      </Stack>
    </Paper>
  );
}