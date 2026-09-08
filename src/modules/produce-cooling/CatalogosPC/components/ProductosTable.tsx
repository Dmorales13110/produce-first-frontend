// CatalogosPC/components/ProductosTable.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  NumberInput,
  Button,
  Divider,
  ScrollArea,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import { IconBox, IconPlus } from '@tabler/icons-react';
import type { ProductoPC } from '../../types';

interface ProductosTableProps {
  data: ProductoPC[];
  onUpdate: (id: number, data: Partial<ProductoPC>) => void;
  onAdd: () => void;
}

export function ProductosTable({ data, onUpdate, onAdd }: ProductosTableProps) {
  const handleMinMaxChange = (id: number, field: 'min' | 'max', val: number | string) => {
    onUpdate(id, { [field]: Number(val) });
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
              <IconBox size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#1A3A5C">Productos e insumos · con mín/máx</Text>
              <Text size="xs" c="dimmed">{data.length} productos registrados</Text>
            </Stack>
          </Group>

          <Button
            size="xs"
            variant="light"
            color="blue"
            leftSection={<IconPlus size={14} />}
            onClick={onAdd}
          >
            Alta de producto
          </Button>
        </Group>

        <Divider />

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>SKU</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Producto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Unidad</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Proveedor</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Últ. precio
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 90 }}>
                  Mín
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 90 }}>
                  Máx
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
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>{row.sku}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.producto}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.unidad}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.proveedor}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>{row.ultPrecio}</Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <NumberInput
                        value={row.min}
                        onChange={(val) => handleMinMaxChange(row.id, 'min', val)}
                        size="xs"
                        w={55}
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
                    <Table.Td style={{ textAlign: 'center' }}>
                      <NumberInput
                        value={row.max}
                        onChange={(val) => handleMinMaxChange(row.id, 'max', val)}
                        size="xs"
                        w={55}
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
                  <Table.Td colSpan={8} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay productos registrados</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          El mínimo dispara la alerta con OC precargada — el hielo se pide por consumo proyectado del planificador
        </Text>
      </Stack>
    </Paper>
  );
}