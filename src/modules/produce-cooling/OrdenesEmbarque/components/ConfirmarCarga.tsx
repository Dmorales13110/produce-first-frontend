// OrdenesEmbarque/components/ConfirmarCarga.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  Checkbox,
  NumberInput,
  TextInput,
  Button,
  SimpleGrid,
  Badge,
  ScrollArea,
  ThemeIcon,
} from '@mantine/core';
import { IconTruckLoading, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import type { CargaItem } from '../../types';

interface ConfirmarCargaProps {
  data?: CargaItem[];  // ✅ Hacer opcional
  onToggle: (id: number) => void;
  onUpdate: (id: number, value: number | string) => void;
  onConfirm: (data: any) => void;
  isSubmitting: boolean;
}

export function ConfirmarCarga({ 
  data = [],  // ✅ Valor por defecto
  onToggle, 
  onUpdate, 
  onConfirm, 
  isSubmitting 
}: ConfirmarCargaProps) {
  const [tempSalida, setTempSalida] = useState<number | string>(3.8);
  const [selloPrecinto, setSelloPrecinto] = useState('MX-88412');
  const [horaSalida, setHoraSalida] = useState('17:40');

  const handleConfirm = () => {
    onConfirm({
      cargas: data,
      temperatura: Number(tempSalida),
      sello: selloPrecinto,
      horaSalida: horaSalida,
    });
  };

  // ✅ Validación segura con optional chaining y valor por defecto
  const cargasSeleccionadas = data?.filter(c => c.checked)?.length || 0;
  const totalCajas = data
    ?.filter(c => c.checked && c.real !== '')
    ?.reduce((sum, c) => sum + Number(c.real), 0) || 0;

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconTruckLoading size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            2. Confirmar la carga · folio por folio
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            {cargasSeleccionadas} de {data?.length || 0} folios
          </Badge>
          <Badge size="xs" color="green" variant="light" radius="sm">
            Total: {totalCajas} cajas
          </Badge>
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ width: 40, textAlign: 'center' }}>✓</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Producto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Instruido</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 120 }}>
                  Cargado real
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Diferencia</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data && data.length > 0 ? (
                data.map((row) => {
                  const valNumReal = Number(row.real);
                  const delta = row.checked && row.real !== '' ? valNumReal - row.instruido : null;

                  return (
                    <Table.Tr 
                      key={row.id} 
                      style={{ 
                        backgroundColor: row.checked ? 'white' : '#FAFAFA',
                        borderBottom: '1px solid #F0F4FF',
                      }}
                    >
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Checkbox
                          checked={row.checked}
                          onChange={() => onToggle(row.id)}
                          color="blue"
                          size="xs"
                        />
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>{row.folio}</Table.Td>
                      <Table.Td style={{ fontSize: '12px' }}>{row.producto}</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>{row.instruido}</Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>
                        <NumberInput
                          value={row.real}
                          onChange={(val) => onUpdate(row.id, val)}
                          disabled={!row.checked}
                          size="xs"
                          styles={{
                            input: {
                              textAlign: 'right',
                              backgroundColor: row.checked ? '#FEF9C3' : '#F3F4F6',
                              fontWeight: 600,
                              width: '100px',
                              marginLeft: 'auto',
                            },
                          }}
                        />
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'center' }}>
                        {delta !== null ? (
                          delta === 0 ? (
                            <Text size="xs" c="dimmed">0</Text>
                          ) : (
                            <Text size="xs" fw={700} c="red.6">{delta > 0 ? '+' : ''}{delta}</Text>
                          )
                        ) : (
                          <Text size="xs" c="dimmed">—</Text>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  );
                })
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6} ta="center" py="xl">
                    <Text size="sm" c="dimmed">
                      {data ? 'No hay cargas para confirmar' : 'Cargando datos...'}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
          <NumberInput
            label="Temperatura de salida (°C)"
            value={tempSalida}
            onChange={setTempSalida}
            decimalScale={1}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <TextInput
            label="Sello / precinto"
            value={selloPrecinto}
            onChange={(e) => setSelloPrecinto(e.currentTarget.value)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <TextInput
            label="Hora de salida"
            value={horaSalida}
            onChange={(e) => setHoraSalida(e.currentTarget.value)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </SimpleGrid>

        <Group>
          <Button
            leftSection={<IconCheck size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={handleConfirm}
            loading={isSubmitting}
            disabled={cargasSeleccionadas === 0 || !data || data.length === 0}
          >
            Confirmar carga completa y cerrar
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          El montacarguista palomea cada folio al subirlo · si difiere, se corrige AQUÍ, antes de que PF facture
        </Text>
      </Stack>
    </Paper>
  );
}