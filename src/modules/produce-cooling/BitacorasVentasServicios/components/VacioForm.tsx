// BitacorasVentasServicios/components/VacioForm.tsx

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
  IconSnowflake,
  IconLockCheck,
  IconDeviceFloppy,
  IconRefresh,
} from '@tabler/icons-react';
import type { VacioRecord } from '../../types';

interface VacioFormProps {
  data: VacioRecord[];
  onSave: (data: Partial<VacioRecord>) => void;
  operadores: string[];
}

export function VacioForm({ data, onSave, operadores }: VacioFormProps) {
  const [ciclo, setCiclo] = useState<number>(data.length + 1);
  const [folioInput, setFolioInput] = useState('DV-2725 - ZER-11B');
  const [tarimas, setTarimas] = useState<number | ''>(12);
  const [horaEntrada, setHoraEntrada] = useState('15:42');
  const [tempEntrada, setTempEntrada] = useState<number | ''>(22.1);
  const [horaSalida, setHoraSalida] = useState('16:10');
  const [tempSalida, setTempSalida] = useState<number | ''>(3.4);
  const [operador, setOperador] = useState<string | null>(operadores[0]);

  const handleSave = () => {
    onSave({
      ciclo: ciclo,
      folios: folioInput,
      tarimas: Number(tarimas),
      entrada: horaEntrada,
      tEntrada: Number(tempEntrada),
      salida: horaSalida,
      tSalida: Number(tempSalida),
      operador: operador || operadores[0],
    });
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconSnowflake size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            Bitácora · Ciclo de enfriamiento al vacío
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Ciclo #{ciclo}
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
          <TextInput
            label="Folios en el ciclo"
            value={folioInput}
            onChange={(e) => setFolioInput(e.currentTarget.value)}
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
          <TextInput
            label="Hora entrada"
            value={horaEntrada}
            onChange={(e) => setHoraEntrada(e.currentTarget.value)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <NumberInput
            label="Temp entrada (°C)"
            value={tempEntrada}
            onChange={(val) => setTempEntrada(val as number)}
            decimalScale={1}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <TextInput
            label="Hora salida"
            value={horaSalida}
            onChange={(e) => setHoraSalida(e.currentTarget.value)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <NumberInput
            label="Temp salida (°C)"
            value={tempSalida}
            onChange={(val) => setTempSalida(val as number)}
            decimalScale={1}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Operador"
            value={operador}
            onChange={setOperador}
            data={operadores}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </SimpleGrid>

        <Group>
          <Button
            leftSection={<IconLockCheck size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={handleSave}
          >
            Cerrar ciclo
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          El operador la llena al cerrar cada ciclo
        </Text>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Ciclo</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folios</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Tarimas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Entrada</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Temp ent.</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Salida</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Temp sal.</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Operador</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <Table.Tr key={row.ciclo} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>{row.ciclo}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.folios}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>{row.tarimas}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.entrada}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                      <Badge color="amber.2" c="dark.8" size="xs" radius="xs">{row.tEntrada}</Badge>
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.salida}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                      <Badge color="yellow.1" c="dark.8" size="xs" radius="xs">{row.tSalida}</Badge>
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.operador}</Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={8} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay ciclos registrados</Text>
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