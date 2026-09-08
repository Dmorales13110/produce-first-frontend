// Contpaqi/components/ExportacionPaquetes.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  Button,
  Badge,
  ScrollArea,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { IconPackage, IconDownload, IconCheck } from '@tabler/icons-react';
import type { PaqueteExportacion } from '../../types';

interface ExportacionPaquetesProps {
  data: PaqueteExportacion[];
  onExportar: (paquete: string) => void;
  isSubmitting: boolean;
}

export function ExportacionPaquetes({ data, onExportar, isSubmitting }: ExportacionPaquetesProps) {
  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'listo': return 'Listo';
      case 'por 2 facturas': return '2 facturas pendientes';
      case 'pendiente': return 'Pendiente';
      default: return estado;
    }
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconPackage size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            Exportación mensual · Hojas Electrónicas
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            {data.filter(p => p.estado === 'listo').length} de {data.length} listos
          </Badge>
        </Group>

        <Divider />

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '500px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Paquete</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Contenido</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', width: 160 }}>
                  Estado
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>
                      {row.paquete}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.contenido}</Table.Td>
                    <Table.Td>
                      <Badge
                        size="xs"
                        color={row.color}
                        variant={row.color === 'yellow' ? 'light' : 'filled'}
                        fullWidth
                        style={{ textTransform: 'lowercase' }}
                      >
                        {getEstadoLabel(row.estado)}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={3} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay paquetes de exportación</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Group>
          <Button
            leftSection={<IconDownload size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={() => onExportar('noviembre')}
            loading={isSubmitting}
          >
            Exportar paquete de noviembre
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Al exportar, se genera el archivo para importar a Contpaqi
        </Text>
      </Stack>
    </Paper>
  );
}