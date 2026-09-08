// ReceptionScan/components/ManualCaptureForm.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  SimpleGrid,
  Select,
  NumberInput,
  TextInput,
  Button,
  Badge,
} from '@mantine/core';
import { IconUserPlus, IconCheck, IconInfoCircle } from '@tabler/icons-react';
import { EXTERNAL_PRODUCERS, AVAILABLE_VEGETABLES, COLD_ROOM_POSITIONS } from '../../../types';

interface ManualCaptureFormProps {
  onConfirm: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function ManualCaptureForm({ onConfirm, isSubmitting }: ManualCaptureFormProps) {
  const [producer, setProducer] = useState<string | null>(EXTERNAL_PRODUCERS[0]);
  const [vegetable, setVegetable] = useState<string | null>(AVAILABLE_VEGETABLES[0]);
  const [pallets, setPallets] = useState<number | ''>(8);
  const [boxesPerPallet, setBoxesPerPallet] = useState<number | ''>(35);
  const [temperature, setTemperature] = useState<number | ''>(21.4);
  const [coldRoomPosition, setColdRoomPosition] = useState<string | null>(COLD_ROOM_POSITIONS[0]);

  const totalBoxes = typeof pallets === 'number' && typeof boxesPerPallet === 'number'
    ? pallets * boxesPerPallet
    : 0;

  const handleConfirm = async () => {
    await onConfirm({
      producer: producer || EXTERNAL_PRODUCERS[0],
      vegetable: vegetable || AVAILABLE_VEGETABLES[0],
      pallets: Number(pallets),
      boxesPerPallet: Number(boxesPerPallet),
      temperature: Number(temperature),
      coldRoomPosition: coldRoomPosition || COLD_ROOM_POSITIONS[0],
    });
  };

  const generatedFolio = `${(producer || 'EXT').substring(0, 3).toUpperCase()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconUserPlus size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            Captura manual — productores externos (sin boleta escaneable)
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Sin escaneo disponible
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing="xs">
          <Select
            label="Productor externo"
            value={producer}
            onChange={setProducer}
            data={EXTERNAL_PRODUCERS}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Vegetal"
            value={vegetable}
            onChange={setVegetable}
            data={AVAILABLE_VEGETABLES}
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
          <NumberInput
            label="Cajas por tarima"
            value={boxesPerPallet}
            onChange={(val) => setBoxesPerPallet(val as number)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <TextInput
            label="Cajas totales"
            value={totalBoxes}
            readOnly
            description="se calcula solo"
            size="xs"
            styles={{ 
              input: { backgroundColor: '#F0F4FF', fontWeight: 600, color: '#1A3A5C' },
              label: { color: '#1A3A5C', fontWeight: 600 }
            }}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs">
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
            label="Posición en el cuarto"
            value={coldRoomPosition}
            onChange={setColdRoomPosition}
            data={COLD_ROOM_POSITIONS}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <TextInput
            label="Folio generado"
            value={generatedFolio}
            readOnly
            description="automático · consecutivo por productor"
            size="xs"
            styles={{ 
              input: { backgroundColor: '#F0F4FF', fontWeight: 600, color: '#1A3A5C' },
              label: { color: '#1A3A5C', fontWeight: 600 }
            }}
          />
        </SimpleGrid>

        <Group mt="xs">
          <Button
            leftSection={<IconCheck size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            radius="sm"
            size="sm"
            onClick={handleConfirm}
            loading={isSubmitting}
          >
            Confirmar recepción manual
          </Button>
        </Group>

        <Text size="xs" c="dimmed">
          Mismo destino que el escaneo: entra al inventario por folio, abona la cuenta del productor y dispara su anticipo si aplica — la trazabilidad no distingue origen
        </Text>

        <Text size="xs" fw={700} c="#1A3A5C">
          Para todo el que NO es San Aparicio / La Escondida: Zermeño, Fernando, Earth Feed, terceros — 6 campos y el folio se genera solo
        </Text>
      </Stack>
    </Paper>
  );
}