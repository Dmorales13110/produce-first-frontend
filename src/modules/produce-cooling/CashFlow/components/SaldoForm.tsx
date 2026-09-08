// CashFlow/components/SaldoForm.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  NumberInput,
  Button,
  Box,
  Badge,
} from '@mantine/core';
import { IconCheck, IconEdit } from '@tabler/icons-react';

interface SaldoFormProps {
  value: number;
  onChange: (value: number) => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export function SaldoForm({ value, onChange, onSave, isSubmitting }: SaldoFormProps) {
  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="sm">
        <Group gap="xs">
          <IconEdit size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            La única captura de esta pantalla
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            30 segundos
          </Badge>
        </Group>

        <Box style={{ maxWidth: 400 }}>
          <NumberInput
            label="Saldo cuenta PC al corte"
            value={value}
            onChange={(val) => onChange(Number(val))}
            prefix="$ "
            thousandSeparator=","
            size="xs"
            styles={{
              label: { color: '#1A3A5C', fontWeight: 600 },
              input: {
                backgroundColor: '#FFFFFF',
                fontWeight: 600,
                fontSize: '16px',
              },
            }}
          />
        </Box>

        <Group mt={4}>
          <Button
            leftSection={<IconCheck size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={onSave}
            loading={isSubmitting}
          >
            Guardar día
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Saldo al corte · 30 segundos al abrir el día — el TC lo hereda del grupo
        </Text>
      </Stack>
    </Paper>
  );
}