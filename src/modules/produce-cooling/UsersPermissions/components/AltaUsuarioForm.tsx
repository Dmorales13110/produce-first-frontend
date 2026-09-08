// UsersPermissions/components/AltaUsuarioForm.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  SimpleGrid,
  TextInput,
  Select,
  Button,
  Badge,
  Divider,
} from '@mantine/core';
import { IconUserPlus, IconCheck } from '@tabler/icons-react';
import type { UsuarioPC, PermisoPC } from '../../types';

interface AltaUsuarioFormProps {
  perfiles: PermisoPC[];
  onCreate: (data: Partial<UsuarioPC>) => void;
  isSubmitting: boolean;
}

export function AltaUsuarioForm({ perfiles, onCreate, isSubmitting }: AltaUsuarioFormProps) {
  const [nombre, setNombre] = useState('');
  const [perfil, setPerfil] = useState<string | null>(perfiles[0]?.nombre || 'Báscula');
  const [turno, setTurno] = useState<string | null>('13:00–01:00');
  const [requierePin, setRequierePin] = useState<string | null>('No');

  const handleCreate = () => {
    if (!nombre.trim()) return;

    const perfilSeleccionado = perfiles.find(p => p.nombre === perfil);
    const pantallas = perfilSeleccionado?.pantallas.join(', ') || '—';
    
    let pin = '—';
    if (requierePin === 'Sí (pagos)') pin = '✓ pagos';
    else if (requierePin === 'Sí (cortes)') pin = '✓ cortes';
    else if (requierePin === 'Sí (autorizador)') pin = '✓ autorizador';

    onCreate({
      usuario: nombre,
      rol: perfil || 'Sin rol',
      pantallas,
      pin,
      turno: turno || 'Turno Completo',
    });

    // Resetear formulario
    setNombre('');
    setPerfil(perfiles[0]?.nombre || 'Báscula');
    setRequierePin('No');
  };

  const perfilOptions = perfiles.map(p => p.nombre);

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <IconUserPlus size={20} color="#1A4B8C" />
          <Text size="16px" fw={700} c="#1A3A5C">
            Captura · Alta / permisos
          </Text>
          <Badge size="xs" color="blue" variant="light" radius="sm">
            Nuevo usuario
          </Badge>
        </Group>

        <Divider />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xs">
          <TextInput
            label="Nombre"
            placeholder="Ej: Operador de hielo"
            value={nombre}
            onChange={(e) => setNombre(e.currentTarget.value)}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Perfil"
            value={perfil}
            onChange={setPerfil}
            data={perfilOptions}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Turno"
            value={turno}
            onChange={setTurno}
            data={['13:00–01:00', '01:00–13:00', 'Turno Completo']}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
          <Select
            label="Requiere PIN"
            value={requierePin}
            onChange={setRequierePin}
            data={['No', 'Sí (pagos)', 'Sí (cortes)', 'Sí (autorizador)']}
            size="xs"
            styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
          />
        </SimpleGrid>

        <Group>
          <Button
            leftSection={<IconCheck size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={handleCreate}
            loading={isSubmitting}
            disabled={!nombre.trim()}
          >
            Crear usuario
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Cada usuario tiene un perfil que define las pantallas a las que tiene acceso
        </Text>
      </Stack>
    </Paper>
  );
}