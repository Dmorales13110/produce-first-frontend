// CxpSATConciliado/components/FlujoVencimiento.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Progress,
  ThemeIcon,
  Badge,
  Box
} from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import type { FlujoVencimiento } from '../../types';

interface FlujoVencimientoProps {
  data: FlujoVencimiento[];
}

export function FlujoVencimiento({ data }: FlujoVencimientoProps) {
  const maxMonto = Math.max(...data.map(d => d.monto));

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconChartBar size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            5. El flujo por vencimiento · la agenda de PC
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Próximos vencimientos
          </Badge>
        </Group>

        <Stack gap="xs" mt="xs">
          {data.map((item, idx) => {
            const porcentaje = (item.monto / maxMonto) * 100;
            const isRenta = item.tipo === 'renta';
            
            return (
              <Group key={idx} gap="xs" align="center">
                <Text size="12px" fw={600} c={isRenta ? 'red.7' : 'dimmed'} w={160}>
                  {item.semana}
                </Text>
                <Box style={{ flex: 1 }}>
                  <Progress 
                    value={porcentaje} 
                    color={isRenta ? 'red' : 'blue'} 
                    size="md" 
                    radius="sm" 
                  />
                </Box>
                <Text size="12px" fw={700} c={isRenta ? 'red.7' : undefined} w={80} ta="right">
                  ${(item.monto / 1000).toFixed(0)}K
                </Text>
                {isRenta && (
                  <Badge size="xs" color="red" variant="light" radius="sm">
                    Renta
                  </Badge>
                )}
              </Group>
            );
          })}
        </Stack>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          La renta el 15 y el hielo semanal dominan la curva
        </Text>
      </Stack>
    </Paper>
  );
}