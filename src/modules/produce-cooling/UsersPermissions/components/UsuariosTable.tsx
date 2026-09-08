// UsersPermissions/components/UsuariosTable.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  Badge,
  ScrollArea,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import type { UsuarioPC } from '../../types';

interface UsuariosTableProps {
  data: UsuarioPC[];
}

export function UsuariosTable({ data }: UsuariosTableProps) {
  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconUsers size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            Usuarios y perfiles de la planta
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            {data.length} usuarios
          </Badge>
        </Group>

        <Divider />

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Usuario</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Rol</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Pantallas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 120 }}>
                  PIN
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Turno</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 90 }}>
                  Estado
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>
                      {row.usuario}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.rol}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.pantallas}</Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      {row.pin !== '—' ? (
                        <Badge size="xs" color="blue" variant="light" radius="sm">
                          {row.pin}
                        </Badge>
                      ) : (
                        <Text size="12px" c="gray.5">—</Text>
                      )}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.turno || '—'}</Table.Td>
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
                    <Text size="sm" c="dimmed">No hay usuarios registrados</Text>
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