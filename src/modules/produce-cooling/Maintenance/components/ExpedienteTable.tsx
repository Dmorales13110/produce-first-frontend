// Maintenance/components/ExpedienteTable.tsx

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
  TextInput,
  ScrollArea,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';
import type { Equipo } from '../../types';

interface ExpedienteTableProps {
  data: Equipo[];
  filters: {
    equipo: string | null;
    estado: string;
  };
  onFilterChange: (filters: any) => void;
  onUpdate: (id: number, rendReal: string) => void;
  options: {
    equipos: string[];
  };
}

export function ExpedienteTable({ data, filters, onFilterChange, onUpdate, options }: ExpedienteTableProps) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'operando': return 'blue';
      case 'en falla': return 'red';
      case 'mantenimiento': return 'yellow';
      default: return 'gray';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'operando': return 'Operando';
      case 'en falla': return 'En falla';
      case 'mantenimiento': return 'Mantenimiento';
      default: return estado;
    }
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Group gap="xs">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
                <IconFileText size={18} />
              </ThemeIcon>
              <Text size="16px" fw={700} c="#1A3A5C">
                Expediente por equipo · con rendimiento real
              </Text>
            </Group>
            <Select
              label="Equipo"
              value={filters.equipo}
              onChange={(value) => onFilterChange({ ...filters, equipo: value })}
              data={options.equipos}
              size="xs"
              w={160}
              styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
            />
          </Group>

          <SegmentedControl
            size="xs"
            value={filters.estado}
            onChange={(value) => onFilterChange({ ...filters, estado: value })}
            data={['Operando', 'En falla', 'Todos']}
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
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Equipo</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Capacidad nominal</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 140 }}>
                  Rendimiento real
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Últ. servicio</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Costo mto temporada
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 150 }}>
                  Estado
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>
                      {row.nombre}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.capNominal}</Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      {row.editable ? (
                        <TextInput
                          value={row.rendReal}
                          onChange={(e) => onUpdate(row.id, e.currentTarget.value)}
                          size="xs"
                          variant="unstyled"
                          styles={{
                            input: {
                              backgroundColor: '#FEF9C3',
                              textAlign: 'center',
                              fontWeight: 700,
                              fontSize: '11px',
                              borderRadius: 4,
                              width: '120px',
                              margin: '0 auto',
                            },
                          }}
                        />
                      ) : (
                        <Text size="12px" c="gray.7">{row.rendReal}</Text>
                      )}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.ultServicio}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                      ${row.costoMto.toLocaleString()}
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Badge
                        size="xs"
                        color={getEstadoColor(row.estado)}
                        variant={row.estado === 'en falla' ? 'light' : 'filled'}
                        fullWidth
                      >
                        {getEstadoLabel(row.estado)}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay equipos registrados</Text>
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