// BitacorasVentasServicios/components/HieloForm.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  SimpleGrid,
  NumberInput,
  TextInput,
  Button,
  Table,
  Badge,
  ScrollArea,
} from '@mantine/core';
import {
  IconIceCream,
  IconDeviceFloppy,
  IconRefresh,
} from '@tabler/icons-react';
import type { HieloRecord } from '../../types';

interface HieloFormProps {
  data: HieloRecord[];
  onSave: (data: Partial<HieloRecord>) => void;
}

export function HieloForm({ data, onSave }: HieloFormProps) {
  const [m25, setM25] = useState<number | ''>(11.8);
  const [m10, setM10] = useState<number | ''>(4.4);
  const [cajas, setCajas] = useState('1,980');
  const [kgCaja, setKgCaja] = useState<number | ''>(8.2);

  const total = (Number(m25) || 0) + (Number(m10) || 0);

  const handleSave = () => {
    onSave({
      fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
      m25: Number(m25),
      m10: Number(m10),
      total: total,
      cajas: cajas,
      kgCaja: Number(kgCaja),
      estado: total >= 15 ? 'ok' : 'revisar',
      color: total >= 15 ? 'teal' : 'amber',
    });
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconIceCream size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            Bitácora · Producción de hielo - las dos máquinas
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Total: {total.toFixed(1)}t
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
          <NumberInput
            label="Máquina 25 t (rinde 12.5)"
            value={m25}
            onChange={(val) => setM25(val as number)}
            decimalScale={1}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <NumberInput
            label="Máquina 10 t (rinde 5)"
            value={m10}
            onChange={(val) => setM10(val as number)}
            decimalScale={1}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <TextInput
            label="Cajas enhieladas"
            value={cajas}
            onChange={(e) => setCajas(e.currentTarget.value)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <NumberInput
            label="kg/caja"
            value={kgCaja}
            onChange={(val) => setKgCaja(val as number)}
            decimalScale={1}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </SimpleGrid>

        <Group>
          <Button
            leftSection={<IconDeviceFloppy size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={handleSave}
          >
            Guardar producción del día
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Producido por máquina + comprado del día — el % propio real contra el 50% del plan
        </Text>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Fecha</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Máquina 25 t</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Máquina 10 t</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Total t</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas enhieladas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>kg/caja</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Estado</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px' }}>{row.fecha}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                      <Badge color="amber.2" c="dark.8" size="xs" radius="xs">
                        {row.m25 || row.m24 || '—'}
                      </Badge>
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                      <Badge color="amber.2" c="dark.8" size="xs" radius="xs">{row.m10}</Badge>
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>{row.total}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>{row.cajas}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>{row.kgCaja}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>
                      <Badge color={row.color} size="xs" radius="sm">{row.estado}</Badge>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay registros de producción de hielo</Text>
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