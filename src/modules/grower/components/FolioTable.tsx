import React from 'react';
import { Card, Text, Table, Badge, Box, Group } from '@mantine/core';

interface ActiveFolio {
  id: string;
  folioNumber: string;
  sector: string;
  crop: string;
  boxesCount: number;
  status: 'pending' | 'in_transit' | 'received';
}

export const FolioTable: React.FC = () => {
  const activeFolios: ActiveFolio[] = [
    { id: 'f1', folioNumber: 'G03-10941', sector: 'Sector 2b-1', crop: 'A Choy Sum', boxesCount: 450, status: 'pending' },
    { id: 'f2', folioNumber: 'G03-10942', sector: 'Sector 2b-1', crop: 'Iceberg Lettuce', boxesCount: 320, status: 'in_transit' },
    { id: 'f3', folioNumber: 'G03-10943', sector: 'Sector 3b-1', crop: 'Gailan', boxesCount: 680, status: 'received' },
  ];

  const getStatusBadge = (status: ActiveFolio['status']) => {
    const config = {
      pending: { label: 'Listo p/ Escaneo', color: 'gray.6' },
      in_transit: { label: 'En Tránsito', color: 'orange.6' },
      received: { label: 'Recibido Enfriadero', color: 'green.7' }
    };
    return <Badge color={config[status].color} variant="light" size="xs">{config[status].label}</Badge>;
  };

  return (
    <Card withBorder padding="xl" radius="md" style={{ borderColor: '#D8E4D2' }}>
      <Group justify="space-between" mb="md" style={{ borderBottom: '1px solid #EDEAE0', paddingBottom: 8 }}>
        <Text fw={700} size="sm" c="gray.7">Trazabilidad de Folios Recientes (Hoy)</Text>
      </Group>

      <Box style={{ overflowX: 'auto' }}>
        <Table variant="simple" verticalSpacing="sm">
          <Table.Thead style={{ backgroundColor: '#4F6F52' }}>
            <Table.Tr>
              <Table.Th style={{ color: '#fff' }}>Folio Campo</Table.Th>
              <Table.Th style={{ color: '#fff' }}>Sector</Table.Th>
              <Table.Th style={{ color: '#fff' }}>Producto</Table.Th>
              <Table.Th style={{ color: '#fff', textAlign: 'right' }}>Cajas</Table.Th>
              <Table.Th style={{ color: '#fff' }}>Estado del Flujo</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {activeFolios.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td fw={700} c="green.9">{row.folioNumber}</Table.Td>
                <Table.Td>{row.sector}</Table.Td>
                <Table.Td fw={600}>{row.crop}</Table.Td>
                <Table.Td style={{ textAlign: 'right' }} fw={700}>{row.boxesCount}</Table.Td>
                <Table.Td>{getStatusBadge(row.status)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Card>
  );
};