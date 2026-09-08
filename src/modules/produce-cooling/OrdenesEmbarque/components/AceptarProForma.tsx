// OrdenesEmbarque/components/AceptarProforma.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  Badge,
  Button,
  ScrollArea,
  ThemeIcon,
} from '@mantine/core';
import { IconCheck, IconAlertCircle, IconTruckLoading } from '@tabler/icons-react';
import type { ProformaItem } from '../../types';

interface AceptarProformaProps {
  data?: ProformaItem[];  // ✅ Hacer opcional
  onAceptar: () => void;
  isSubmitting: boolean;
  proformaId: string;
}

export function AceptarProforma({ 
  data = [],  // ✅ Valor por defecto
  onAceptar, 
  isSubmitting, 
  proformaId 
}: AceptarProformaProps) {
  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconTruckLoading size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            1. Aceptar · Proforma recibida de PF · {proformaId || 'Cargando...'}
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Revisar disponibilidad
          </Badge>
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Producto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas pedidas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio instruido</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Disponible</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Alcanza</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px' }}>{row.producto}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>{row.instruido}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>{row.folio}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>{row.disp}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>
                      {row.alcanza === 'ok' && (
                        <Badge color="green" size="xs" radius="xl" leftSection={<IconCheck size={10} />}>
                          Ok
                        </Badge>
                      )}
                      {row.alcanza === 'justo' && (
                        <Badge color="yellow" size="xs" radius="xl" leftSection={<IconAlertCircle size={10} />}>
                          Justo
                        </Badge>
                      )}
                      {row.alcanza === 'insuficiente' && (
                        <Badge color="red" size="xs" radius="xl" leftSection={<IconAlertCircle size={10} />}>
                          Insuficiente
                        </Badge>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5} ta="center" py="xl">
                    <Text size="sm" c="dimmed">
                      {proformaId ? 'No hay proformas para aceptar' : 'Cargando proforma...'}
                    </Text>
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
            onClick={onAceptar}
            loading={isSubmitting}
            disabled={data.length === 0}  // ✅ Deshabilitar si no hay datos
          >
            Aceptar orden → a piso de carga
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          La instrucción llega con todo: cliente, camión, partidas y de qué folios sale — PC solo revisa que la disponibilidad alcance
        </Text>
      </Stack>
    </Paper>
  );
}