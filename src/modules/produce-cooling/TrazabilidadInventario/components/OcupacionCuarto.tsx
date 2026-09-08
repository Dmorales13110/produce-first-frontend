// TrazabilidadInventario/components/OcupacionCuarto.tsx

import React from 'react';
import { Paper, Stack, Text, Group, SimpleGrid, Box, Progress, ThemeIcon } from '@mantine/core';
import { IconBuildingWarehouse, IconCube } from '@tabler/icons-react';
import type { OcupacionItem, TrazabilidadStats } from '../../types';

interface OcupacionCuartoProps {
  ocupacion: OcupacionItem[];
  stats: TrazabilidadStats;
}

export function OcupacionCuarto({ ocupacion, stats }: OcupacionCuartoProps) {
  const totalTarimas = stats.totalTarimas;
  const ocupadas = stats.tarimasOcupadas;
  const porcentaje = stats.porcentajeOcupacion;

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconBuildingWarehouse size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            Ocupación del cuarto · {totalTarimas} tarimas
          </Text>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          
          {/* Gráfico / Indicador Donut Personalizado */}
          <Group justify="center" gap="xl">
            <Box style={{ position: 'relative', width: 140, height: 140 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3.8"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1A4B8C"
                  strokeWidth="3.8"
                  strokeDasharray={`${porcentaje}, 100`}
                />
              </svg>
              <Box style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}>
                <Text size="24px" fw={800} c="#1A3A5C">{Math.round(porcentaje)}%</Text>
                <Text size="10px" c="dimmed">ocupado</Text>
              </Box>
            </Box>

            <Stack gap={4}>
              <Group gap="xs">
                <Box style={{ width: 10, height: 10, backgroundColor: '#1A4B8C', borderRadius: 2 }} />
                <Text size="xs" fw={600} c="dimmed">Ocupadas</Text>
                <Text size="xs" fw={800} ml="auto">{ocupadas}</Text>
              </Group>
              <Group gap="xs">
                <Box style={{ width: 10, height: 10, backgroundColor: '#E5E7EB', borderRadius: 2 }} />
                <Text size="xs" fw={600} c="dimmed">Libres</Text>
                <Text size="xs" fw={800} ml="auto">{stats.tarimasLibres}</Text>
              </Group>
              <Group gap="xs" mt="xs">
                <Box style={{ width: 10, height: 10, backgroundColor: '#2D8F5E', borderRadius: 2 }} />
                <Text size="xs" fw={600} c="dimmed">Cajas</Text>
                <Text size="xs" fw={800} ml="auto">{stats.totalCajas.toLocaleString()}</Text>
              </Group>
            </Stack>
          </Group>

          {/* Desglose de ocupación por vegetal */}
          <Stack gap="xs">
            {ocupacion.map((item) => (
              <Group key={item.producto} gap="xs" align="center">
                <Text size="xs" w={90} style={{ textAlign: 'right' }} fw={500} c="#1A3A5C">
                  {item.producto}
                </Text>
                <Box style={{ flex: 1 }}>
                  <Progress 
                    value={item.porcentaje} 
                    color={item.porcentaje > 70 ? '#DC2626' : item.porcentaje > 40 ? '#D97706' : '#1A4B8C'} 
                    size="sm" 
                    radius="xs" 
                  />
                </Box>
                <Text size="xs" c="dimmed" w={70}>
                  {item.tarimas} tarimas
                </Text>
              </Group>
            ))}
          </Stack>
        </SimpleGrid>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Si la ocupación proyectada rebasa {totalTarimas}, alerta ANTES de comprometer recepción
        </Text>
      </Stack>
    </Paper>
  );
}