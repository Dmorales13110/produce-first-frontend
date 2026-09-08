// CxpSATConciliado/components/ConciliacionSAT.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  Select,
  Button,
  Badge,
  ScrollArea,
  ThemeIcon,
} from '@mantine/core';
import { IconCheck, IconCloudDownload } from '@tabler/icons-react';
import type { FacturaSAT } from '../../types';

interface ConciliacionSATProps {
  data: FacturaSAT[];
  onConciliar: (id: string, data: { categoria: string; oc: string }) => void;
  options: {
    categorias: string[];
    ocs: string[];
  };
}

export function ConciliacionSAT({ data, onConciliar, options }: ConciliacionSATProps) {
  const [categoriaValues, setCategoriaValues] = useState<Record<string, string>>({});
  const [ocValues, setOcValues] = useState<Record<string, string>>({});

  const handleConciliar = (id: string) => {
    onConciliar(id, {
      categoria: categoriaValues[id] || options.categorias[1] || 'RENTA',
      oc: ocValues[id] || options.ocs[0] || 'Sin OC · contrato',
    });
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconCloudDownload size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            2. Descarga del SAT · conciliación en la misma fila
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            {data.filter(f => f.conciliada).length} de {data.length} conciliadas
          </Badge>
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Factura</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Proveedor</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Monto
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', width: 140 }}>
                  Categoría
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', width: 160 }}>
                  OC
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 50 }}>
                  ✓
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <Table.Tr 
                    key={row.id} 
                    style={{ 
                      backgroundColor: row.conciliada ? '#F0FDF4' : 'white',
                      borderBottom: '1px solid #F0F4FF',
                    }}
                  >
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>
                      {row.factura}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.proveedor}</Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.concepto}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>
                      ${row.monto.toLocaleString()}
                    </Table.Td>
                    <Table.Td>
                      <Select
                        value={categoriaValues[row.id] || row.categoria}
                        onChange={(val) => setCategoriaValues({ ...categoriaValues, [row.id]: val || '' })}
                        data={options.categorias}
                        size="xs"
                        disabled={row.conciliada}
                        styles={{ input: { backgroundColor: row.conciliada ? '#F0FDF4' : '#FEF9C3' } }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Select
                        value={ocValues[row.id] || row.oc}
                        onChange={(val) => setOcValues({ ...ocValues, [row.id]: val || '' })}
                        data={options.ocs}
                        size="xs"
                        disabled={row.conciliada}
                        styles={{ input: { backgroundColor: row.conciliada ? '#F0FDF4' : '#FEF9C3' } }}
                      />
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      {row.conciliada ? (
                        <Badge size="xs" color="green" variant="light" radius="sm">
                          ✓ Conciliada
                        </Badge>
                      ) : (
                        <Button
                          size="xs"
                          style={{ backgroundColor: '#1A4B8C' }}
                          onClick={() => handleConciliar(row.id)}
                          p={6}
                        >
                          <IconCheck size={16} />
                        </Button>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay facturas del SAT</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Group gap={4} mt={4}>
          <Text size="xs" c="teal.7" fw={600} style={{ cursor: 'pointer' }}>
            + Agregar cuenta sin factura
          </Text>
          <Text size="xs" c="dimmed">(finiquitos, caja chica) — mismo renglón, sin XML</Text>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Un clic por factura — igual que el grower
        </Text>
      </Stack>
    </Paper>
  );
}