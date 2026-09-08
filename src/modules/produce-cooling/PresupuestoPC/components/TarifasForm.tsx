// PresupuestoPC/components/TarifasForm.tsx

import React from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  SimpleGrid,
  NumberInput,
  Box,
  Badge,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import type { TarifasPC } from '../../types';

interface TarifasFormProps {
  data: TarifasPC;
  onUpdate: (data: Partial<TarifasPC>) => void;
}

export function TarifasForm({ data, onUpdate }: TarifasFormProps) {
  const handleChange = (field: keyof TarifasPC, value: number | string) => {
    onUpdate({ [field]: Number(value) });
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconSettings size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            1. Captura · Tarifas y física de la planta
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Amarillo = editable
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          {/* Columna Izquierda */}
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="12px" c="dimmed">Cooling - cajas propias</Text>
              <NumberInput 
                value={data.coolingPropias} 
                onChange={(val) => handleChange('coolingPropias', val)} 
                prefix="$" 
                decimalScale={2} 
                size="xs" 
                w={90} 
                styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'right' } }} 
                suffix=" /cj" 
              />
            </Group>
            <Group justify="space-between">
              <Text size="12px" c="dimmed">Hielo all-in (cobra)</Text>
              <NumberInput 
                value={data.hieloAllIn} 
                onChange={(val) => handleChange('hieloAllIn', val)} 
                prefix="$" 
                decimalScale={2} 
                size="xs" 
                w={90} 
                styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'right' } }} 
                suffix=" /cj" 
              />
            </Group>
            <Group justify="space-between">
              <Text size="12px" c="dimmed">Costo hielo propio</Text>
              <NumberInput 
                value={data.costoHieloPropio} 
                onChange={(val) => handleChange('costoHieloPropio', val)} 
                prefix="$" 
                decimalScale={2} 
                size="xs" 
                w={90} 
                styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'right' } }} 
                suffix=" /cj" 
              />
            </Group>
            <Group justify="space-between">
              <Text size="12px" c="dimmed">Servicio máquinas de hielo</Text>
              <NumberInput 
                value={data.servicioMaquinas} 
                onChange={(val) => handleChange('servicioMaquinas', val)} 
                prefix="$" 
                thousandSeparator="," 
                size="xs" 
                w={130} 
                styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'right' } }} 
                suffix=" USD/mes × 5" 
              />
            </Group>
            <Group justify="space-between">
              <Text size="12px" c="dimmed">Repack - ingreso / destajo</Text>
              <Group gap={4}>
                <NumberInput 
                  value={data.repackIngreso} 
                  onChange={(val) => handleChange('repackIngreso', val)} 
                  prefix="$" 
                  decimalScale={2} 
                  size="xs" 
                  w={70} 
                  styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'right' } }} 
                />
                <Text size="xs" c="dimmed">/</Text>
                <NumberInput 
                  value={data.repackDestajo} 
                  onChange={(val) => handleChange('repackDestajo', val)} 
                  prefix="$" 
                  decimalScale={2} 
                  size="xs" 
                  w={70} 
                  styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'right' } }} 
                />
              </Group>
            </Group>
            <Group justify="space-between">
              <Text size="12px" c="dimmed">Meses operando</Text>
              <Group gap={4}>
                <NumberInput 
                  value={data.mesesOperando} 
                  onChange={(val) => handleChange('mesesOperando', val)} 
                  size="xs" 
                  w={50} 
                  styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'center' } }} 
                />
                <Text size="xs" c="dimmed">(nov-mar)</Text>
              </Group>
            </Group>
          </Stack>

          {/* Columna Derecha */}
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="12px" c="dimmed">Cooling - cajas de terceros</Text>
              <NumberInput 
                value={data.coolingTerceros} 
                onChange={(val) => handleChange('coolingTerceros', val)} 
                prefix="$" 
                decimalScale={2} 
                size="xs" 
                w={90} 
                styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'right' } }} 
                suffix=" /cj" 
              />
            </Group>
            <Group justify="space-between">
              <Text size="12px" c="dimmed">% del hielo producido en casa</Text>
              <NumberInput 
                value={data.pctHieloCasa} 
                onChange={(val) => handleChange('pctHieloCasa', val)} 
                suffix="%" 
                size="xs" 
                w={90} 
                styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'center' } }} 
              />
            </Group>
            <Group justify="space-between">
              <Text size="12px" c="dimmed">Costo hielo comprado</Text>
              <NumberInput 
                value={data.costoHieloComprado} 
                onChange={(val) => handleChange('costoHieloComprado', val)} 
                prefix="$" 
                decimalScale={2} 
                size="xs" 
                w={90} 
                styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'right' } }} 
                suffix=" /cj" 
              />
            </Group>
            <Group justify="space-between">
              <Text size="12px" c="dimmed">Capacidad real de producción</Text>
              <Group gap={4}>
                <NumberInput 
                  value={data.capacidadProd} 
                  onChange={(val) => handleChange('capacidadProd', val)} 
                  size="xs" 
                  w={70} 
                  styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'center' } }} 
                />
                <Text size="xs" c="dimmed">t/día (12.5 + 5)</Text>
              </Group>
            </Group>
            <Group justify="space-between">
              <Text size="12px" c="dimmed">Cuarto frío - túnel - líneas</Text>
              <Text size="12px" fw={600}>168 tarimas - 12 tarimas/ciclo - 3</Text>
            </Group>
            <Group justify="space-between">
              <Text size="12px" c="dimmed">Tipo de Cambio MXN/USD</Text>
              <NumberInput 
                value={data.tcMxnUsd} 
                onChange={(val) => handleChange('tcMxnUsd', val)} 
                size="xs" 
                w={90} 
                decimalScale={2} 
                styles={{ input: { backgroundColor: '#FEF9C3', fontWeight: 600, textAlign: 'center' } }} 
              />
            </Group>
          </Stack>
        </SimpleGrid>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          1 cuarto de 168 tarimas - túnel de 12 tarimas/ciclo - 3 líneas - hielo mitad y mitad
        </Text>
      </Stack>
    </Paper>
  );
}