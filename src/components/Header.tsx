import { Box, Group, Select, Text, Avatar } from '@mantine/core';
import { IconBuildingFactory2 } from '@tabler/icons-react';
import { useState } from 'react';

export function Header() {
  // Simulación de las empresas del corporativo para la UI
  const [selectedCompany, setSelectedCompany] = useState<string | null>('PF');

  return (
    <Box 
      h={70} 
      px="md" 
      style={{ 
        borderBottom: '1px solid #e9ecef', 
        backgroundColor: '#ffffff',
        position: 'fixed',
        top: 0,
        left: 260,
        right: 0,
        zIndex: 100
      }}
    >
      <Group justify="space-between" h="100%">
        {/* Selector de Empresa Activa */}
        <Group gap="xs">
          <IconBuildingFactory2 size={20} color="#2e7d32" />
          <Select
            placeholder="Seleccionar Empresa"
            data={[
              { value: 'PF', label: 'Grupo Produce First' },
              { value: 'DV', label: 'Don Víctor' },
              { value: 'JAV', label: 'San Javier' },
              { value: 'PC', label: 'Produce Cooling' },
            ]}
            value={selectedCompany}
            onChange={setSelectedCompany}
            allowDeselect={false}
            style={{ width: 220 }}
            styles={{
              input: { fontWeight: 500 }
            }}
          />
        </Group>

        {/* Perfil de Usuario */}
        <Group gap="sm">
          <Box style={{ textAlign: 'right' }}>
            <Text size="sm" fw={600}>Diego Morales</Text>
            <Text size="xs" c="dimmed">Administrador</Text>
          </Box>
          <Avatar radius="xl" color="produceGreen">DM</Avatar>
        </Group>
      </Group>
    </Box>
  );
}