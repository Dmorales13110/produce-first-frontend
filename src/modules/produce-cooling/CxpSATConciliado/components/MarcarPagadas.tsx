// CxpSATConciliado/components/MarcarPagadas.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  TextInput,
  Select,
  Button,
  Badge,
} from '@mantine/core';
import { IconCheck, IconCreditCard } from '@tabler/icons-react';

interface MarcarPagadasProps {
  selectedIds: number[];
  onMarcarPagadas: (ids: number[], fechaPago: string, banco: string) => void;
  isSubmitting: boolean;
  options: {
    bancos: string[];
  };
}

export function MarcarPagadas({ selectedIds, onMarcarPagadas, isSubmitting, options }: MarcarPagadasProps) {
  const [fechaPago, setFechaPago] = useState('01-dic-2026');
  const [banco, setBanco] = useState<string | null>(options.bancos[0]);

  const totalSeleccionado = selectedIds.length;

  const handleMarcar = () => {
    if (selectedIds.length === 0) return;
    onMarcarPagadas(selectedIds, fechaPago, banco || options.bancos[0]);
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconCreditCard size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            4. Marcar pagadas
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            {totalSeleccionado} seleccionadas
          </Badge>
        </Group>

        <Group gap="md" align="flex-end">
          <TextInput
            label="Seleccionadas"
            value={`${totalSeleccionado} · $${(totalSeleccionado * 10000).toLocaleString()}`}
            size="xs"
            readOnly
            w={180}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <TextInput
            label="Fecha de pago"
            value={fechaPago}
            onChange={(e) => setFechaPago(e.currentTarget.value)}
            size="xs"
            w={180}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Banco (ref.)"
            value={banco}
            onChange={setBanco}
            data={options.bancos}
            size="xs"
            w={220}
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </Group>

        <Group>
          <Button
            leftSection={<IconCheck size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={handleMarcar}
            loading={isSubmitting}
            disabled={totalSeleccionado === 0}
          >
            Marcar como pagadas
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Seleccionas, fecha, listo — sin archivos de dispersión
        </Text>
      </Stack>
    </Paper>
  );
}