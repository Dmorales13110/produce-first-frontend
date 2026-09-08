// BitacorasVentasServicios/components/RepackForm.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  SimpleGrid,
  Select,
  NumberInput,
  Button,
  Table,
  Badge,
  ScrollArea,
} from '@mantine/core';
import {
  IconBox,
  IconDeviceFloppy,
  IconRefresh,
} from '@tabler/icons-react';
import type { RepackRecord } from '../../types';

interface RepackFormProps {
  data: RepackRecord[];
  onSave: (data: Partial<RepackRecord>) => void;
  lineas: string[];
  turnos: string[];
  folios: string[];
}

export function RepackForm({ data, onSave, lineas, turnos, folios }: RepackFormProps) {
  const [linea, setLinea] = useState<string | null>(lineas[0]);
  const [folio, setFolio] = useState<string | null>(folios[0]);
  const [cajas, setCajas] = useState<number | ''>(448);
  const [turno, setTurno] = useState<string | null>(turnos[0]);

  const handleSave = () => {
    onSave({
      linea: linea || lineas[0],
      folio: folio || folios[0],
      cajas: Number(cajas),
      turno: turno || turnos[0],
    });
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconBox size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            Bitácora · Repack / embolsado - 3 líneas
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Alimenta PC-NOM
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
          <Select
            label="Línea"
            value={linea}
            onChange={setLinea}
            data={lineas}
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
          <NumberInput
            label="Cajas"
            value={cajas}
            onChange={(val) => setCajas(val as number)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Turno"
            value={turno}
            onChange={setTurno}
            data={turnos}
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
            Guardar
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Línea → folio → cajas · alimenta la boleta de destajo (PC-NOM)
        </Text>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '400px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Línea</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Turno</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px' }}>{row.linea}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>{row.folio}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>{row.cajas}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>
                      <Badge size="xs" color="blue" variant="light" radius="sm">
                        {row.turno}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={4} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay registros de repack</Text>
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