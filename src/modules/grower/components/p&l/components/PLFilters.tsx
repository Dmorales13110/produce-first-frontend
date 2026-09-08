// src/modules/grower/pl/components/PLFilters.tsx
import React from 'react';
import { Group, Text, ThemeIcon, Paper, Button, Select, Badge, Box } from '@mantine/core';
import { IconEye, IconList, IconGridDots, IconRefresh, IconCalendarStats } from '@tabler/icons-react';

interface PLFiltersProps {
  viewMode: 'detallado' | 'resumido';
  setViewMode: (mode: 'detallado' | 'resumido') => void;
  selectedGrower: string;
  setSelectedGrower: (id: string) => void;
  growerOptions: { value: string; label: string }[];
  onRefresh: () => void;
}

export const PLFilters: React.FC<PLFiltersProps> = ({
  viewMode,
  setViewMode,
  selectedGrower,
  setSelectedGrower,
  growerOptions,
  onRefresh,
}) => {
  return (
    <Group justify="space-between" mb="md" align="center">
      <Group gap="sm">
        <Group gap="sm">
          <ThemeIcon size="sm" radius="md" color="teal" variant="light">
            <IconEye size={14} />
          </ThemeIcon>
          <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Vista:
          </Text>
          <Paper p={4} withBorder style={{ borderColor: '#E8E5DC', borderRadius: 8, backgroundColor: '#F5F3EE' }}>
            <Group gap={4}>
              <button
                onClick={() => setViewMode('detallado')}
                style={{
                  padding: '4px 12px',
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: viewMode === 'detallado' ? '#1F5C3A' : 'transparent',
                  color: viewMode === 'detallado' ? '#FFFFFF' : '#9A968A',
                  fontWeight: 600,
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
              >
                <Group gap={4}>
                  <IconList size={14} />
                  Detallado
                </Group>
              </button>
              <button
                onClick={() => setViewMode('resumido')}
                style={{
                  padding: '4px 12px',
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: viewMode === 'resumido' ? '#1F5C3A' : 'transparent',
                  color: viewMode === 'resumido' ? '#FFFFFF' : '#9A968A',
                  fontWeight: 600,
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
              >
                <Group gap={4}>
                  <IconGridDots size={14} />
                  Resumido
                </Group>
              </button>
            </Group>
          </Paper>
        </Group>

        <Select
          size="xs"
          value={selectedGrower}
          onChange={(value) => setSelectedGrower(value || 'todos')}
          data={growerOptions}
          placeholder="Filtrar por rancho"
          style={{ width: 200 }}
          styles={{
            input: { fontWeight: 600, backgroundColor: '#FFFFFF', borderColor: '#E8E5DC' },
          }}
        />

        <Badge variant="light" color="teal" radius="sm">
          <Group gap={4}>
            <IconCalendarStats size={12} />
            {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
          </Group>
        </Badge>
      </Group>

      <Group gap="md">
        <Button
          size="xs"
          variant="subtle"
          color="teal"
          onClick={onRefresh}
          leftSection={<IconRefresh size={14} />}
        >
          Actualizar
        </Button>
        <Group gap={4}>
          <Box style={{ width: 10, height: 10, backgroundColor: '#E8F5E9', borderRadius: 2, borderLeft: '4px solid #1F5C3A' }} />
          <Text size="xs" c="dimmed">Utilidad</Text>
        </Group>
        <Group gap={4}>
          <Box style={{ width: 10, height: 10, backgroundColor: '#F9F8F6', borderRadius: 2, borderLeft: '2px solid #E8E5DC' }} />
          <Text size="xs" c="dimmed">Total</Text>
        </Group>
      </Group>
    </Group>
  );
};