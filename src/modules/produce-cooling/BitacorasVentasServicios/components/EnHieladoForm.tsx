// BitacorasVentasServicios/components/EnhieladoForm.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  SimpleGrid,
  TextInput,
  NumberInput,
  Select,
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
import type { EnhieladoRecord } from '../../types';

interface EnhieladoFormProps {
  data: EnhieladoRecord[];
  onSave: (data: Partial<EnhieladoRecord>) => void;
  folios: string[];
  productos: string[];
}

export function EnhieladoForm({ data, onSave, folios, productos }: EnhieladoFormProps) {
  const [hora, setHora] = useState(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }));
  const [folio, setFolio] = useState<string | null>(folios[0]);
  const [producto, setProducto] = useState<string | null>(productos[0]);
  const [tarimas, setTarimas] = useState<number | ''>(8);
  const [hieloKg, setHieloKg] = useState<number | ''>(22);
  const [responsable, setResponsable] = useState<string | null>('Inyector');

  const handleSave = () => {
    onSave({
      hora: hora,
      folio: folio || folios[0],
      producto: producto || productos[0],
      tarimas: Number(tarimas),
      hieloKg: Number(hieloKg),
      responsable: responsable || 'Inyector',
    });
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconIceCream size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            Bitácora · Enhielado
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Por folio
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
          <TextInput
            label="Hora"
            value={hora}
            onChange={(e) => setHora(e.currentTarget.value)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Folio"
            value={folio}
            onChange={setFolio}
            data={folios}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Producto"
            value={producto}
            onChange={setProducto}
            data={productos}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <NumberInput
            label="Tarimas"
            value={tarimas}
            onChange={(val) => setTarimas(val as number)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <NumberInput
            label="Hielo (kg/tarima)"
            value={hieloKg}
            onChange={(val) => setHieloKg(val as number)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Responsable"
            value={responsable}
            onChange={setResponsable}
            data={['Inyector', 'Manual - inyector en falla', 'Supervisor']}
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
            Guardar enhielado
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Por folio: tarimas, hielo aplicado, hora
        </Text>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Hora</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Producto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Tarimas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Hielo (kg)</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Responsable</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px' }}>{row.hora}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>{row.folio}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.producto}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                      <Badge color="amber.1" c="dark.8" size="xs" radius="xs">{row.tarimas}</Badge>
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                      <Badge color="amber.2" c="dark.8" size="xs" radius="xs">{row.hieloKg}</Badge>
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.responsable}</Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay registros de enhielado</Text>
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