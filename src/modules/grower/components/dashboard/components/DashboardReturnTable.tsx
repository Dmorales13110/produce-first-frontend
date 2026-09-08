// src/modules/dashboard/components/DashboardReturnTable.tsx
import React from 'react';
import { Card, Text, Group, Stack, Divider, Table, Badge } from '@mantine/core';
import { IconBuildingWarehouse } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export const DashboardReturnTable: React.FC = () => {
  // Datos de ejemplo para la tabla de retorno
  const returnData = [
    { 
      cultivo: 'Shanghai Bok', 
      saRetorno: '$7.94', 
      saCosto: '$4.10', 
      saMargen: '$3.84', 
      leRetorno: '$8.12', 
      leCosto: '$4.45', 
      leMargen: '$3.67',
      saColor: 'green',
      leColor: 'green'
    },
    { 
      cultivo: 'Celtuce', 
      saRetorno: '$8.90', 
      saCosto: '$9.31', 
      saMargen: '-$0.41', 
      leRetorno: '$7.55', 
      leCosto: '$4.28', 
      leMargen: '$3.27',
      saColor: 'red',
      leColor: 'green'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Group gap="sm" mb="lg">
          <IconBuildingWarehouse size={18} color="#1F5C3A" />
          <Stack gap={0}>
            <Text size="sm" fw={700} c="#3A3A34">Retorno por Cultivo x Rancho</Text>
            <Text size="xs" c="dimmed">SA · San Aparicio · LE · La Escondida</Text>
          </Stack>
        </Group>
        <Divider mb="lg" />
        <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
          <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
            <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Cultivo</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">SA Retorno</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">SA Costo</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">SA Margen</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">LE Retorno</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">LE Costo</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">LE Margen</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {returnData.map((row, idx) => (
              <Table.Tr key={idx} style={{ borderBottom: '1px solid #EFECE3' }}>
                <Table.Td fw={700} c="#3A3A34">{row.cultivo}</Table.Td>
                <Table.Td ta="right">{row.saRetorno}</Table.Td>
                <Table.Td ta="right">{row.saCosto}</Table.Td>
                <Table.Td ta="right">
                  <Badge color={row.saColor} variant="light" size="sm" radius="sm">{row.saMargen}</Badge>
                </Table.Td>
                <Table.Td ta="right">{row.leRetorno}</Table.Td>
                <Table.Td ta="right">{row.leCosto}</Table.Td>
                <Table.Td ta="right">
                  <Badge color={row.leColor} variant="light" size="sm" radius="sm">{row.leMargen}</Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </motion.div>
  );
};