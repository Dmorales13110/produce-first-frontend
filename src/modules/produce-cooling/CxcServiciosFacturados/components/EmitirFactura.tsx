// CxcServiciosFacturados/components/EmitirFactura.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  TextInput,
  Button,
  Badge,
  ScrollArea,
  ThemeIcon,
} from '@mantine/core';
import { IconFileInvoice, IconCheck } from '@tabler/icons-react';
import type { FacturaCxc } from '../../types';

interface EmitirFacturaProps {
  data: FacturaCxc[];
  onEmitir: (id: string, folio: string) => void;
}

export function EmitirFactura({ data, onEmitir }: EmitirFacturaProps) {
  const [folios, setFolios] = useState<Record<string, string>>({});

  const handleEmitir = (id: string) => {
    const folio = folios[id] || `PC-F-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`;
    onEmitir(id, folio);
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconFileInvoice size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            Emitir factura · desde el corte de servicios
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            {data.filter(f => f.emitida).length} emitidas
          </Badge>
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Corte</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cliente</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Contenido</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Importe
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', width: 130 }}>
                  Factura
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 100 }}>
                  Acción
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <Table.Tr 
                    key={row.id} 
                    style={{ 
                      backgroundColor: row.emitida ? '#F0FDF4' : 'white',
                      borderBottom: '1px solid #F0F4FF',
                    }}
                  >
                    <Table.Td style={{ fontSize: '12px' }}>{row.corte}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>
                      {row.cliente}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{row.contenido}</Table.Td>
                    <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                      ${row.importe.toLocaleString()} MXN eq.
                    </Table.Td>
                    <Table.Td>
                      {row.emitida ? (
                        <Badge size="xs" color="green" variant="light" radius="sm">
                          {row.factura} ✓
                        </Badge>
                      ) : (
                        <TextInput
                          value={folios[row.id] || row.factura}
                          onChange={(e) => setFolios({ ...folios, [row.id]: e.currentTarget.value })}
                          size="xs"
                          styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600 } }}
                        />
                      )}
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      {row.emitida ? (
                        <Badge size="xs" color="green" variant="light" radius="sm">
                          ✓ Emitida
                        </Badge>
                      ) : (
                        <Button
                          leftSection={<IconCheck size={14} />}
                          size="xs"
                          style={{ backgroundColor: '#1A4B8C' }}
                          fullWidth
                          onClick={() => handleEmitir(row.id)}
                        >
                          Emitir
                        </Button>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay cortes para facturar</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          El corte semanal de PC-4 (bitácoras × tarifas) se convierte en CFDI con un clic
        </Text>
      </Stack>
    </Paper>
  );
}