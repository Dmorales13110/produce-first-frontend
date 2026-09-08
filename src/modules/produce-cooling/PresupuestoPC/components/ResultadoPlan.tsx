// PresupuestoPC/components/ResultadoPlan.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  Progress,
  ScrollArea,
  ThemeIcon,
  Divider,
  Box,
  Badge
} from '@mantine/core';
import { IconChartPie } from '@tabler/icons-react';
import type { ResultadoPlan } from '../../types';

interface ResultadoPlanProps {
  data: ResultadoPlan[];
  margin: number;
}

export function ResultadoPlan({ data, margin }: ResultadoPlanProps) {
  const ingresos = data.filter(d => d.tipo === 'ingreso' && !d.destacado);
  const costos = data.filter(d => d.tipo === 'costo');
  const utilidad = data.find(d => d.tipo === 'utilidad');

  // Datos para gráficos de sensibilidad
  const sensibilidadData = [
    { label: 'Punto de equilibrio (terceros)', value: 20, color: 'amber', detail: '124K cj' },
    { label: 'Volumen bajo', value: 50, color: 'blue', detail: '500K cj' },
    { label: 'Volumen medio', value: 75, color: 'teal', detail: '600K cj' },
    { label: 'Comprar todo el hielo', value: 15, color: 'gray', detail: '$72,000 margen' },
    { label: 'Híbrido 50/50 (plan)', value: 60, color: 'cyan', detail: '$150,600 margen' },
  ];

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconChartPie size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            4. Resultado · El plan de la temporada
          </Text>
          <Group gap={4}>
            <Badge size="xs" color="green" variant="light" radius="sm">Ingresos</Badge>
            <Badge size="xs" color="red" variant="light" radius="sm">Costos</Badge>
            <Badge size="xs" color="teal" variant="light" radius="sm">Utilidad</Badge>
          </Group>
        </Group>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '500px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto (USD)</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                  Plan temporada
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((row, idx) => {
                const isIngreso = row.tipo === 'ingreso';
                const isCosto = row.tipo === 'costo';
                const isUtilidad = row.tipo === 'utilidad';
                const isDestacado = row.destacado;

                return (
                  <Table.Tr 
                    key={idx} 
                    style={{ 
                      backgroundColor: isDestacado ? '#F8FAFC' : 'white',
                      borderBottom: '1px solid #F0F4FF',
                    }}
                  >
                    <Table.Td style={{ 
                      fontSize: isDestacado ? '13px' : '12px',
                      fontWeight: isDestacado ? 800 : 400,
                      color: isCosto ? '#DC2626' : isUtilidad ? '#047857' : '#1A3A5C',
                    }}>
                      {row.concepto}
                    </Table.Td>
                    <Table.Td style={{ 
                      fontSize: isDestacado ? '13px' : '12px',
                      textAlign: 'right',
                      fontWeight: isDestacado ? 800 : 400,
                      color: isCosto ? '#DC2626' : isUtilidad ? '#047857' : '#1A3A5C',
                    }}>
                      {row.monto < 0 ? `-$${Math.abs(row.monto).toLocaleString()}` : `$${row.monto.toLocaleString()}`}
                      {isUtilidad && (
                        <Text component="span" size="xs" fw={500} c="dimmed">
                          {' '}(margen {margin}%)
                        </Text>
                      )}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Divider />

        {/* Gráficos de sensibilidad */}
        <Stack gap="xs" mt="sm">
          <Text size="13px" fw={600} c="#1A3A5C">Análisis de sensibilidad</Text>
          
          {sensibilidadData.map((item, idx) => (
            <Group key={idx} gap="xs" align="center">
              <Text size="11px" fw={600} c="dimmed" w={220}>{item.label}</Text>
              <Box style={{ flex: 1 }}>
                <Progress value={item.value} color={item.color} size="sm" radius="xl" />
              </Box>
              <Text size="11px" fw={700} w={100} ta="right">{item.detail}</Text>
            </Group>
          ))}
        </Stack>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Se recalcula al tocar cualquier amarillo - el hielo blended cuesta $0.775/cj y se cobra $1.35
        </Text>
      </Stack>
    </Paper>
  );
}