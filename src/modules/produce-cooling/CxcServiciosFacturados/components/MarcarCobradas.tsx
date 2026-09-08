// CxcServiciosFacturados/components/MarcarCobradas.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  TextInput,
  Button,
  Badge,
} from '@mantine/core';
import { IconCheck, IconCash } from '@tabler/icons-react';

interface MarcarCobradasProps {
  selectedIds: number[];
  onMarcarCobradas: (ids: number[], fechaCobro: string) => void;
  isSubmitting: boolean;
}

export function MarcarCobradas({ selectedIds, onMarcarCobradas, isSubmitting }: MarcarCobradasProps) {
  const [fechaCobro, setFechaCobro] = useState('');

  const totalSeleccionado = selectedIds.length;

  const handleMarcar = () => {
    if (selectedIds.length === 0) return;
    const fecha = fechaCobro || new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    onMarcarCobradas(selectedIds, fecha);
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconCash size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            Marcar cobradas
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
            label="Fecha de cobro"
            value={fechaCobro}
            onChange={(e) => setFechaCobro(e.currentTarget.value)}
            placeholder="ej: 01-dic"
            size="xs"
            w={180}
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
            Marcar cobradas
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Seleccionas, fecha, listo — espejo exacto de CxC del grower
        </Text>
      </Stack>
    </Paper>
  );
}