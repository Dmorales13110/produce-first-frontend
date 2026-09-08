// Payroll/components/PlantillaTable.tsx

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
  Button,
  ScrollArea,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { IconUsers, IconPlus, IconCheck } from '@tabler/icons-react';
import type { Empleado } from '../../types';

interface PlantillaTableProps {
  data: Empleado[];
  filters: {
    puesto: string | null;
    estatus: string;
  };
  onFilterChange: (filters: any) => void;
  onAdd: () => void;
  options: {
    puestos: string[];
  };
}

export function PlantillaTable({ data, filters, onFilterChange, onAdd, options }: PlantillaTableProps) {
  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Group gap="xs">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
                <IconUsers size={18} />
              </ThemeIcon>
              <Text size="16px" fw={700} c="#1A3A5C">
                Plantilla · tabla principal
              </Text>
            </Group>
            <Select
              label="Puesto"
              value={filters.puesto}
              onChange={(value) => onFilterChange({ ...filters, puesto: value })}
              data={options.puestos}
              size="xs"
              w={160}
              styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
            />
          </Group>

          <SegmentedControl
            size="xs"
            value={filters.estatus}
            onChange={(value) => onFilterChange({ ...filters, estatus: value })}
            data={['Activos', 'Todos']}
            styles={{
              root: { backgroundColor: '#F0F4FF' },
              indicator: { backgroundColor: '#1A4B8C' },
              label: { fontWeight: 600 }
            }}
          />
        </Group>

        <Divider />

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Empleado</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Puesto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Tipo</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Sueldo semanal
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                  Expediente
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 90 }}>
                  Estado
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>
                      {row.nombre}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.puesto}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.tipo}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>
                      {row.sueldo}
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center', fontSize: '12px', color: '#16A34A' }}>
                      {row.expediente ? '✓' : '—'}
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Badge 
                        size="xs" 
                        color={row.estado === 'activo' ? 'blue' : 'gray'} 
                        variant="light"
                      >
                        {row.estado}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay empleados registrados</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={onAdd}
          >
            Alta de empleado
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Misma fórmula que G-20: la plantilla manda, con filtros
        </Text>
      </Stack>
    </Paper>
  );
}