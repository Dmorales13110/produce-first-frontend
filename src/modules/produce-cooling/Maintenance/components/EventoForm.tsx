// Maintenance/components/EventoForm.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  SimpleGrid,
  Select,
  TextInput,
  Button,
  Badge,
  Divider,
} from '@mantine/core';
import { IconCheck, IconTool } from '@tabler/icons-react';
import type { EventoEquipo } from '../../types';

interface EventoFormProps {
  onSave: (data: Partial<EventoEquipo>) => void;
  isSubmitting: boolean;
}

export function EventoForm({ onSave, isSubmitting }: EventoFormProps) {
  const [tipoEvento, setTipoEvento] = useState<string | null>('Servicio / reparación');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>('Inyector de hielo');
  const [descripcion, setDescripcion] = useState('cambio de boquillas');
  const [costo, setCosto] = useState('$8,400 · F-0914');
  const [lectura, setLectura] = useState('4.2 t ayer');
  const [reporto, setReporto] = useState<string | null>('Operador túnel');

  const handleSave = () => {
    onSave({
      tipo: tipoEvento || 'Servicio / reparación',
      equipo: equipoSeleccionado || 'Equipo no especificado',
      descripcion,
      costo,
      lectura,
      reporto: reporto || 'Sin asignar',
    });
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconTool size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            Captura · Evento de equipo
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Nueva incidencia
          </Badge>
        </Group>

        <Divider />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xs">
          <Select
            label="Tipo"
            value={tipoEvento}
            onChange={setTipoEvento}
            data={['Servicio / reparación', 'Preventivo', 'Inspección']}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Equipo"
            value={equipoSeleccionado}
            onChange={setEquipoSeleccionado}
            data={['Inyector de hielo', 'Túnel de vacío', 'Máquina de hielo 25 t', 'Máquina de hielo 10 t', 'Cuarto frío']}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <TextInput
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.currentTarget.value)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <TextInput
            label="Costo"
            value={costo}
            onChange={(e) => setCosto(e.currentTarget.value)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
          <TextInput
            label="Lectura (ton/día · °C · hrs)"
            value={lectura}
            onChange={(e) => setLectura(e.currentTarget.value)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Reportó"
            value={reporto}
            onChange={setReporto}
            data={['Operador túnel', 'Jefe de planta', 'Supervisor']}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </SimpleGrid>

        <Group>
          <Button
            leftSection={<IconCheck size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={handleSave}
            loading={isSubmitting}
          >
            Guardar evento
          </Button>
        </Group>

        <Paper p="xs" radius="sm" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <Text size="xs" c="#15803D" style={{ lineHeight: 1.4 }}>
            <strong>✓ Al guardar:</strong> el costo cae a MANTENIMIENTO del presupuesto vía su factura (PC-CXP) · 
            la lectura de rendimiento alimenta la curva de cada máquina · una falla del cuarto o del hielo alerta al planificador ANTES de comprometer volumen.
          </Text>
        </Paper>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Misma fórmula MAQ-1 del grower: un evento, la data se reparte
        </Text>
      </Stack>
    </Paper>
  );
}