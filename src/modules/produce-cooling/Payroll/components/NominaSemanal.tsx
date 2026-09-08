// Payroll/components/NominaSemanal.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  ScrollArea,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { IconCalculator } from '@tabler/icons-react';
import type { NominaSemanal } from '../../types';

interface NominaSemanalProps {
  data: NominaSemanal;
}

export function NominaSemanal({ data }: NominaSemanalProps) {
  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconCalculator size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            Nómina semanal · se arma sola
          </Text>
        </Group>

        <Divider />

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '400px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 140 }}>
                  {data.semana}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr style={{ borderBottom: '1px solid #F0F4FF' }}>
                <Table.Td style={{ fontSize: '12px' }}>Sueldos fijos (asistencia × salario vigente)</Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                  ${data.sueldosFijos}
                </Table.Td>
              </Table.Tr>
              <Table.Tr style={{ borderBottom: '1px solid #F0F4FF' }}>
                <Table.Td style={{ fontSize: '12px' }}>Horas extra</Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right' }}>
                  ${data.horasExtra}
                </Table.Td>
              </Table.Tr>
              <Table.Tr style={{ borderBottom: '1px solid #F0F4FF' }}>
                <Table.Td style={{ fontSize: '12px' }}>Destajo repack (boletas)</Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#6B7280' }}>
                  ${data.destajo}
                </Table.Td>
              </Table.Tr>
              <Table.Tr style={{ backgroundColor: '#F8FAFC', borderTop: '2px solid #E5E7EB' }}>
                <Table.Td style={{ fontSize: '13px', fontWeight: 800, color: '#1A3A5C' }}>
                  TOTAL NÓMINA {data.semana}
                </Table.Td>
                <Table.Td style={{ fontSize: '13px', textAlign: 'right', fontWeight: 800, color: '#1A4B8C' }}>
                  ${data.total}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Asistencia × salario vigente + boletas de destajo · el viernes solo se autoriza
        </Text>
      </Stack>
    </Paper>
  );
}