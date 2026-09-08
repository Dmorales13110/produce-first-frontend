// Contpaqi/components/EquivalenciasTable.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  TextInput,
  Button,
  ScrollArea,
  ThemeIcon,
  Badge,
  Divider,
} from '@mantine/core';
import { IconCheck, IconEdit } from '@tabler/icons-react';
import type { EquivalenciaContpaqi } from '../../types';

interface EquivalenciasTableProps {
  data: EquivalenciaContpaqi[];
  onUpdate: (id: number, cuenta: string) => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export function EquivalenciasTable({ data, onUpdate, onSave, isSubmitting }: EquivalenciasTableProps) {
  const handleCuentaChange = (id: number, value: string) => {
    onUpdate(id, value);
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Costo': return 'blue';
      case 'Gasto': return 'red';
      case 'Ingreso': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconEdit size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            Catálogo de equivalencias · categoría PC → cuenta Contpaqi
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            {data.length} equivalencias
          </Badge>
        </Group>

        <Divider />

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>
                  Categoría (presupuesto PC)
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', width: 140 }}>
                  Cuenta Contpaqi
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>
                  Nombre
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', width: 90 }}>
                  Tipo
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                      {row.categoria}
                    </Table.Td>
                    <Table.Td>
                      <TextInput
                        value={row.cuenta}
                        onChange={(e) => handleCuentaChange(row.id, e.currentTarget.value)}
                        size="xs"
                        variant="unstyled"
                        styles={{
                          input: {
                            backgroundColor: '#FEF9C3',
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: '11px',
                            borderRadius: 4,
                            padding: '2px 4px',
                            width: '120px',
                          },
                        }}
                      />
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.nombre}</Table.Td>
                    <Table.Td>
                      <Badge size="xs" color={getTipoColor(row.tipo)} variant="light" radius="sm">
                        {row.tipo}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={4} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay equivalencias registradas</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Group>
          <Button
            leftSection={<IconCheck size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={onSave}
            loading={isSubmitting}
          >
            Guardar equivalencias
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Amarillo = número de cuenta · el despacho lo confirma una vez
        </Text>
      </Stack>
    </Paper>
  );
}