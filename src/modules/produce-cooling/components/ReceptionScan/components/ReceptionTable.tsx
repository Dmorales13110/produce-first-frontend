// ReceptionScan/components/ReceptionTable.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  Badge,
  SegmentedControl,
  Select,
  ActionIcon,
  ScrollArea,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { IconRefresh, IconDownload, IconAlertTriangle, IconCheck, IconList } from '@tabler/icons-react';
import type { ReceptionRecord, ReceptionFilters } from '../../../types';

interface ReceptionTableProps {
  data: ReceptionRecord[];
  filters: ReceptionFilters;
  onFilterChange: (filters: ReceptionFilters) => void;
  onRefresh: () => void;
}

export function ReceptionTable({ data, filters, onFilterChange, onRefresh }: ReceptionTableProps) {
  const producers = ['Todos', ...new Set(data.map(r => r.producer))];
  const products = ['Todos', ...new Set(data.map(r => r.product))];

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
              <IconList size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#1A3A5C">Recepciones de hoy</Text>
              <Text size="xs" c="dimmed">{data.length} registros</Text>
            </Stack>
          </Group>

          <Group gap="sm">
            <SegmentedControl
              size="xs"
              value={filters.dateRange || 'today'}
              onChange={(value) => onFilterChange({ ...filters, dateRange: value as any })}
              data={[
                { value: 'today', label: 'Hoy' },
                { value: 'week', label: 'Semana' },
              ]}
              styles={{
                root: { backgroundColor: '#F0F4FF' },
                indicator: { backgroundColor: '#1A4B8C' },
                label: { fontWeight: 600 }
              }}
            />
            <ActionIcon variant="light" color="blue" size="sm" radius="md" onClick={onRefresh}>
              <IconRefresh size={16} />
            </ActionIcon>
            <ActionIcon variant="light" color="blue" size="sm" radius="md">
              <IconDownload size={16} />
            </ActionIcon>
          </Group>
        </Group>

        <Divider />

        <Group gap="md">
          <Select
            label="Productor"
            value={filters.producer || 'Todos'}
            onChange={(value) => onFilterChange({ ...filters, producer: value || undefined })}
            data={producers}
            size="xs"
            w={200}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Producto"
            value={filters.product || 'Todos'}
            onChange={(value) => onFilterChange({ ...filters, product: value || undefined })}
            data={products}
            size="xs"
            w={200}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table 
            highlightOnHover 
            withColumnBorders 
            verticalSpacing="xs"
            style={{ minWidth: '900px' }}
          >
            <Table.Thead style={{ backgroundColor: '#F0F4FF' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Hora</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Productor</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Producto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Boleta</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Recibidas</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Diferencia</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cuarto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Estado</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '13px' }}>{row.time}</Table.Td>
                    <Table.Td style={{ fontSize: '13px', fontWeight: 600, color: '#1A4B8C' }}>{row.folio}</Table.Td>
                    <Table.Td style={{ fontSize: '13px' }}>{row.producer}</Table.Td>
                    <Table.Td style={{ fontSize: '13px' }}>{row.product}</Table.Td>
                    <Table.Td style={{ fontSize: '13px', textAlign: 'right' }}>{row.invoiceBoxes}</Table.Td>
                    <Table.Td style={{ fontSize: '13px', textAlign: 'right', fontWeight: 600 }}>{row.receivedBoxes}</Table.Td>
                    <Table.Td style={{ fontSize: '13px', textAlign: 'center' }}>
                      {row.delta !== 0 ? (
                        <Text size="12px" fw={700} c="red.7">{row.delta}</Text>
                      ) : (
                        <Text size="12px" c="dimmed">0</Text>
                      )}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '13px' }}>{row.coldRoomPosition}</Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Badge
                        size="sm"
                        color={row.status === 'completed' ? 'green' : row.status === 'discrepancy' ? 'orange' : 'gray'}
                        variant="light"
                        radius="xl"
                      >
                        {row.status === 'completed' ? 'Completada' : row.status === 'discrepancy' ? 'Discrepancia' : 'Pendiente'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={9} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay recepciones registradas</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Divider />

        <Group justify="space-between">
          <Group gap="sm">
            <Badge variant="light" color="green" radius="sm">
              <Group gap={4}>
                <IconCheck size={12} />
                {data.filter(r => r.status === 'completed').length} completadas
              </Group>
            </Badge>
            <Badge variant="light" color="orange" radius="sm">
              <Group gap={4}>
                <IconAlertTriangle size={12} />
                {data.filter(r => r.status === 'discrepancy').length} discrepancias
              </Group>
            </Badge>
          </Group>
          <Text size="xs" c="dimmed">
            Total de cajas: {data.reduce((sum, r) => sum + r.receivedBoxes, 0)}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}