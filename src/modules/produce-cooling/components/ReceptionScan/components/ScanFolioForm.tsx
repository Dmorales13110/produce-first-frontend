// ReceptionScan/components/ScanFolioForm.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  TextInput,
  Button,
  Table,
  Box,
  SimpleGrid,
  NumberInput,
  Select,
  Badge,
  ActionIcon,
} from '@mantine/core';
import {
  IconScan,
  IconCheck,
  IconRefresh,
  IconBarcode,
  IconInfoCircle,
} from '@tabler/icons-react';
import type { FolioDetail } from '../../../types';

interface ScanFolioFormProps {
  folioDetail: FolioDetail | null;
  onScan: (folio: string) => Promise<void>;
  onConfirm: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function ScanFolioForm({ folioDetail, onScan, onConfirm, isSubmitting }: ScanFolioFormProps) {
  const [folioInput, setFolioInput] = useState('DV-2725');
  const [receivedBoxes, setReceivedBoxes] = useState<number | ''>(584);
  const [temperature, setTemperature] = useState<number | ''>(12.4);
  const [coldRoomPosition, setColdRoomPosition] = useState<string | null>('Fila A-3');
  const [pallets, setPallets] = useState<number | ''>(13);

  const handleScan = async () => {
    if (folioInput.trim()) {
      await onScan(folioInput.trim());
    }
  };

  const handleConfirm = async () => {
    if (!folioDetail) return;
    
    await onConfirm({
      folio: folioDetail.folio,
      receivedBoxes: Number(receivedBoxes),
      temperature: Number(temperature),
      coldRoomPosition: coldRoomPosition || 'Fila A-1',
      pallets: Number(pallets),
    });
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <IconScan size={20} color="#1A4B8C" />
            <Text size="16px" fw={700} c="#1A3A5C">
              Escanear folio al llegar el camión
            </Text>
            <Badge size="xs" color="blue" variant="light" radius="sm">
              Autollenado
            </Badge>
          </Group>
          <ActionIcon
            variant="light"
            color="blue"
            size="sm"
            radius="md"
            onClick={() => handleScan()}
          >
            <IconRefresh size={16} />
          </ActionIcon>
        </Group>

        {/* Input de escaneo */}
        <Paper p="xs" radius="sm" style={{ backgroundColor: '#F0F7FF', border: '1.5px solid #93C5FD' }}>
          <Group justify="space-between" align="center">
            <TextInput
              value={folioInput}
              onChange={(e) => setFolioInput(e.currentTarget.value)}
              variant="unstyled"
              placeholder="Escanee o teclee el código del folio..."
              styles={{ 
                input: { 
                  fontSize: '18px', 
                  fontWeight: 700, 
                  color: '#1F2937',
                  padding: '4px 8px',
                } 
              }}
              style={{ flex: 1 }}
              rightSection={
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  leftSection={<IconBarcode size={14} />}
                  onClick={handleScan}
                >
                  Escanear
                </Button>
              }
            />
            <Text size="xs" c="dimmed">último escaneo: 14:20</Text>
          </Group>
        </Paper>

        {/* Detalle del folio */}
        {folioDetail && (
          <Box>
            <Text size="xs" fw={700} c="dimmed" mb="xs">
              Lo que trae el folio {folioDetail.folio} — <Text component="span" fw={400} c="dimmed">nadie lo captura</Text>
            </Text>
            <Table variant="simple" verticalSpacing="xs" horizontalSpacing="sm">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td fw={600} w={180} c="dimmed" style={{ backgroundColor: '#FAFAFA' }}>Productor</Table.Td>
                  <Table.Td style={{ backgroundColor: '#FAFAFA' }}>{folioDetail.producer}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600} c="dimmed">Producto</Table.Td>
                  <Table.Td>{folioDetail.product}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600} c="dimmed" style={{ backgroundColor: '#FAFAFA' }}>Cajas según boleta</Table.Td>
                  <Table.Td style={{ backgroundColor: '#FAFAFA' }}>{folioDetail.invoiceBoxes}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600} c="dimmed">Sectores de origen</Table.Td>
                  <Table.Td>{folioDetail.sectors}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600} c="dimmed" style={{ backgroundColor: '#FAFAFA' }}>Cuadrilla</Table.Td>
                  <Table.Td style={{ backgroundColor: '#FAFAFA' }}>{folioDetail.crew}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Box>
        )}

        {/* Formulario de confirmación */}
        <Box mt="xs">
          <Text size="xs" fw={700} c="#1A3A5C" mb="xs">
            Lo único que PC confirma
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xs">
            <NumberInput
              label="Cajas recibidas (conteo)"
              value={receivedBoxes}
              onChange={(val) => setReceivedBoxes(val as number)}
              description="= boleta · si difiere se registra la merma en tránsito"
              size="xs"
              styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
            />
            <NumberInput
              label="Temperatura de llegada"
              value={temperature}
              onChange={(val) => setTemperature(val as number)}
              suffix=" °C"
              decimalScale={1}
              size="xs"
              styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
            />
            <Select
              label="Posición en el cuarto (168 tarimas)"
              value={coldRoomPosition}
              onChange={setColdRoomPosition}
              data={['Fila A-1', 'Fila A-2', 'Fila A-3', 'Fila B-1', 'Fila B-2', 'Fila C-1', 'Fila C-2']}
              size="xs"
              styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
            />
            <NumberInput
              label="Tarimas"
              value={pallets}
              onChange={(val) => setPallets(val as number)}
              size="xs"
              styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
            />
          </SimpleGrid>
        </Box>

        <Group mt="xs">
          <Button
            leftSection={<IconCheck size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            radius="sm"
            size="sm"
            onClick={handleConfirm}
            loading={isSubmitting}
            disabled={!folioDetail}
          >
            Confirmar recepción
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Se escanea el código de la boleta (o se teclea) — todo lo demás lo trae el folio
        </Text>
      </Stack>
    </Paper>
  );
}