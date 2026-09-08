// OrdenesCompraPC/components/NuevaOrdenCompra.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  SimpleGrid,
  TextInput,
  Select,
  NumberInput,
  Button,
  Table,
  Box,
  Badge,
  ScrollArea,
} from '@mantine/core';
import {
  IconShoppingCart,
  IconCheck,
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import type { PartidaOC } from '../../types';

interface NuevaOrdenCompraProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
  options: {
    proveedores: string[];
    categorias: string[];
    unidades: string[];
    destinos: string[];
  };
}

export function NuevaOrdenCompra({ onSave, isSubmitting, options }: NuevaOrdenCompraProps) {
  const [noOC, setNoOC] = useState('OC-PC-2026-0038');
  const [proveedor, setProveedor] = useState<string | null>(options.proveedores[1]);
  const [categoria, setCategoria] = useState<string | null>('ENERGÍA (hielo)');
  const [entregaRequerida, setEntregaRequerida] = useState('lun 30-nov');
  const [destino, setDestino] = useState<string | null>(options.destinos[0]);

  const [partidas, setPartidas] = useState<PartidaOC[]>([
    { id: 1, concepto: 'Boquillas + kit inyector', cantidad: 1, unidad: 'kit', precioUnitario: 18400 },
    { id: 2, concepto: '', cantidad: 0, unidad: '', precioUnitario: 0 },
  ]);

  const nextId = Math.max(...partidas.map(p => p.id), 0) + 1;

  const addPartida = () => {
    setPartidas([...partidas, { id: nextId, concepto: '', cantidad: 0, unidad: '', precioUnitario: 0 }]);
  };

  const removePartida = (id: number) => {
    if (partidas.length > 1) {
      setPartidas(partidas.filter(p => p.id !== id));
    }
  };

  const updatePartida = (id: number, field: string, value: any) => {
    setPartidas(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calcularImporte = (cant: number, precio: number) => {
    return cant && precio ? cant * precio : 0;
  };

  const totalOC = partidas.reduce(
    (acc, item) => acc + calcularImporte(item.cantidad, item.precioUnitario),
    0
  );

  const handleSave = () => {
    onSave({
      noOC,
      proveedor,
      categoria,
      entregaRequerida,
      destino,
      partidas: partidas.filter(p => p.concepto.trim() !== ''),
      total: totalOC,
    });
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconShoppingCart size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            Nueva Orden de Compra
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Folio automático
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
          <TextInput
            label="No. de OC"
            value={noOC}
            onChange={(e) => setNoOC(e.currentTarget.value)}
            size="xs"
            description="folio automático"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Proveedor (PC-CAT)"
            value={proveedor}
            onChange={setProveedor}
            data={options.proveedores.slice(1)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Categoría de costo"
            value={categoria}
            onChange={setCategoria}
            data={options.categorias.slice(1)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <TextInput
            label="Entrega requerida"
            value={entregaRequerida}
            onChange={(e) => setEntregaRequerida(e.currentTarget.value)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </SimpleGrid>

        <Box style={{ maxWidth: 320 }}>
          <Select
            label="Destino"
            value={destino}
            onChange={setDestino}
            data={options.destinos}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </Box>

        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="13px" fw={700} c="#1A3A5C">Partidas</Text>
            <Button
              size="xs"
              variant="light"
              color="blue"
              leftSection={<IconPlus size={14} />}
              onClick={addPartida}
            >
              Agregar partida
            </Button>
          </Group>

          <ScrollArea style={{ width: '100%' }}>
            <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
              <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                <Table.Tr>
                  <Table.Th style={{ width: 40, fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>#</Table.Th>
                  <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                  <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 140 }}>
                    Cantidad
                  </Table.Th>
                  <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 140 }}>
                    Precio unit.
                  </Table.Th>
                  <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 140 }}>
                    Importe
                  </Table.Th>
                  <Table.Th style={{ width: 40 }} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {partidas.map((item) => {
                  const importe = calcularImporte(item.cantidad, item.precioUnitario);

                  return (
                    <Table.Tr key={item.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'center' }}>{item.id}</Table.Td>
                      <Table.Td>
                        <TextInput
                          value={item.concepto}
                          onChange={(e) => updatePartida(item.id, 'concepto', e.currentTarget.value)}
                          variant="unstyled"
                          placeholder="Concepto..."
                          size="xs"
                        />
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>
                        <Group gap={4} justify="flex-end">
                          <NumberInput
                            value={item.cantidad || ''}
                            onChange={(val) => updatePartida(item.id, 'cantidad', val)}
                            size="xs"
                            w={60}
                            styles={{
                              input: {
                                textAlign: 'right',
                                backgroundColor: item.cantidad ? '#FEF9C3' : '#FFF',
                              }
                            }}
                          />
                          <Select
                            value={item.unidad || ''}
                            onChange={(val) => updatePartida(item.id, 'unidad', val)}
                            data={options.unidades}
                            size="xs"
                            w={70}
                            styles={{ input: { backgroundColor: item.unidad ? '#FEF9C3' : '#FFF' } }}
                          />
                        </Group>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>
                        <NumberInput
                          value={item.precioUnitario || ''}
                          onChange={(val) => updatePartida(item.id, 'precioUnitario', val)}
                          prefix="$"
                          size="xs"
                          thousandSeparator=","
                          styles={{
                            input: {
                              textAlign: 'right',
                              backgroundColor: item.precioUnitario ? '#FEF9C3' : '#FFF',
                            }
                          }}
                        />
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>
                        {importe > 0 ? `$${importe.toLocaleString()}` : '—'}
                      </Table.Td>
                      <Table.Td>
                        <Button
                          variant="subtle"
                          color="red"
                          size="xs"
                          onClick={() => removePartida(item.id)}
                          disabled={partidas.length <= 1}
                          style={{ padding: 0 }}
                        >
                          <IconTrash size={14} />
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}

                {/* Fila de total */}
                <Table.Tr style={{ backgroundColor: '#F8FAFC', borderTop: '2px solid #E5E7EB' }}>
                  <Table.Td colSpan={4} style={{ textAlign: 'right', fontWeight: 800, fontSize: '13px', color: '#1A3A5C' }}>
                    TOTAL
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right', fontWeight: 800, fontSize: '14px', color: '#1A4B8C' }}>
                    ${totalOC.toLocaleString()}
                  </Table.Td>
                  <Table.Td />
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>

        <Group>
          <Button
            leftSection={<IconDeviceFloppy size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={handleSave}
            loading={isSubmitting}
            disabled={partidas.every(p => p.concepto.trim() === '')}
          >
            Guardar y autorizar OC
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          La categoría es obligatoria — con ella la factura del SAT llega costeada contra el presupuesto (PC-PRE)
        </Text>
      </Stack>
    </Paper>
  );
}