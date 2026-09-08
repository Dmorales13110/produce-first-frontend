// src/modules/grower/GrowerSectors.tsx
import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Card, 
  Text, 
  Group, 
  Badge, 
  Stack, 
  Box, 
  SegmentedControl, 
  Progress,
  SimpleGrid,
  ThemeIcon,
  Paper,
  Divider,
  Loader,
  Center,
  Alert,
  Button,
  Select,
  Grid
} from '@mantine/core';
import { 
  IconFilter, 
  IconGridDots, 
  IconSquare, 
  IconMapPin,
  IconPlant,
  IconTrendingUp,
  IconSquareCheck,
  IconRefresh,
  IconAlertCircle,
  IconCalendar,
  IconUsers
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useSectors } from './hooks/useSectors';
import { useCapture } from '../capture/hooks/useCapture';

export function GrowerSectors() {
  const [sectorFilter, setSectorFilter] = useState('todos');
  const [selectedGrower, setSelectedGrower] = useState<string | null>(null);
  const { sectors, summary, isLoading, error, refresh, setFilters } = useSectors();
  const { growers } = useCapture();

  // Preparar datos para la tabla
  const filteredData = useMemo(() => {
    if (sectorFilter === 'todos') return sectors;
    if (sectorFilter === 'b23') return sectors.filter(row => row.sector_id === '2b-1' || row.sector_id === '3b-1');
    if (sectorFilter === 'b56') return sectors.filter(row => row.sector_id === '5a-1' || row.sector_id === '6a-1');
    return sectors;
  }, [sectors, sectorFilter]);

  // Estadísticas
  const stats = useMemo(() => {
    if (!summary) return null;
    return {
      totalSectores: summary.totalSectores,
      totalHa: summary.totalHa,
      cultivosUnicos: summary.cultivosUnicos,
      enCosecha: summary.enCosecha,
      enDesarrollo: summary.enDesarrollo,
      enMonitoreo: summary.enMonitoreo,
    };
  }, [summary]);

  // Manejar cambio de filtro de grower
  const handleGrowerChange = (value: string | null) => {
    setSelectedGrower(value);
    setFilters({ growerId: value || undefined });
  };

  // ============================================================
  // ESTADOS DE CARGA Y ERROR
  // ============================================================
  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando datos de sectores...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Box p="md">
        <Alert
          color="red"
          variant="light"
          title="Error al cargar datos"
          icon={<IconAlertCircle size={16} />}
        >
          {error}
          <Button
            size="xs"
            variant="subtle"
            color="red"
            onClick={refresh}
            mt="sm"
            leftSection={<IconRefresh size={14} />}
          >
            Reintentar
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Encabezado */}
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={0}>
          <Text size="xs" fw={700} c="#1F5C3A" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
            G-8 · Sectores
          </Text>
          <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            Control Operativo
          </Text>
          <Text size="sm" c="dimmed">
            Monitoreo de sectores y avance de cultivos
          </Text>
        </Stack>
        <Group gap="sm">
          <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
            {stats?.totalSectores || 0} Sectores
          </Badge>
          <Button
            size="xs"
            variant="subtle"
            color="teal"
            onClick={refresh}
            leftSection={<IconRefresh size={14} />}
          >
            Actualizar
          </Button>
        </Group>
      </Group>

      {/* Filtros */}
      <Paper p="md" radius="lg" withBorder mb="xl" style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Group justify="space-between">
          <Group gap="md">
            <Group gap="xs">
              <IconFilter size={16} color="#9A968A" />
              <Text size="xs" fw={600} c="dimmed">Filtros:</Text>
            </Group>
            <Select
              size="xs"
              placeholder="Todos los ranchos"
              data={[
                { value: '', label: 'Todos los ranchos' },
                ...(growers || []).map(g => ({
                  value: g.id,
                  label: g.commercial_name || g.legal_name || 'Rancho sin nombre',
                }))
              ]}
              value={selectedGrower || ''}
              onChange={(value) => handleGrowerChange(value || null)}
              clearable
              style={{ width: 200 }}
              styles={{
                input: { fontWeight: 600, backgroundColor: '#FFFFFF', borderColor: '#E8E5DC' },
              }}
            />
          </Group>

          <SegmentedControl
            size="xs"
            value={sectorFilter}
            onChange={setSectorFilter}
            data={[
              { value: 'todos', label: 'Todos' },
              { value: 'b23', label: 'Bloque 2b-3b' },
              { value: 'b56', label: 'Bloque 5a-6a' },
            ]}
            styles={{
              root: { backgroundColor: '#F5F3EE' },
              indicator: { backgroundColor: '#1F5C3A' },
              label: { fontWeight: 600 }
            }}
          />
        </Group>
      </Paper>

      {/* KPIs de Resumen */}
      {stats && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
          {[
            { 
              title: 'Sectores Activos', 
              value: stats.totalSectores, 
              icon: IconMapPin, 
              color: '#1F5C3A',
              desc: `${sectors.length} cultivos`
            },
            { 
              title: 'Hectáreas Totales', 
              value: stats.totalHa.toFixed(1), 
              icon: IconSquare, 
              color: '#2A6A8A',
              desc: 'en producción'
            },
            { 
              title: 'Cultivos', 
              value: stats.cultivosUnicos, 
              icon: IconPlant, 
              color: '#C08412',
              desc: 'variedades diferentes'
            },
            { 
              title: 'En Cosecha', 
              value: stats.enCosecha, 
              icon: IconSquareCheck, 
              color: '#1F5C3A',
              desc: `${Math.round((stats.enCosecha / (stats.totalSectores || 1)) * 100)}% del total`
            },
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={2}>
                      <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {kpi.title}
                      </Text>
                      <Text size="xl" fw={800} c={kpi.color}>{kpi.value}</Text>
                      <Text size="xs" c="dimmed">{kpi.desc}</Text>
                    </Stack>
                    <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: kpi.color }}>
                      <Icon size={20} stroke={2} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </motion.div>
            );
          })}
        </SimpleGrid>
      )}

      {/* Leyenda de Estados */}
      <Group gap="md" mb="md">
        <Group gap={4}>
          <Box style={{ width: 10, height: 10, backgroundColor: '#1F5C3A', borderRadius: '50%' }} />
          <Text size="xs" c="dimmed">Cosecha</Text>
        </Group>
        <Group gap={4}>
          <Box style={{ width: 10, height: 10, backgroundColor: '#2A6A8A', borderRadius: '50%' }} />
          <Text size="xs" c="dimmed">Desarrollo</Text>
        </Group>
        <Group gap={4}>
          <Box style={{ width: 10, height: 10, backgroundColor: '#8A5A2A', borderRadius: '50%' }} />
          <Text size="xs" c="dimmed">Monitoreo</Text>
        </Group>
        <Group gap={4}>
          <Box style={{ width: 10, height: 10, backgroundColor: '#A3A39A', borderRadius: '50%' }} />
          <Text size="xs" c="dimmed">Post-trasplante</Text>
        </Group>
      </Group>

      {/* Tabla Principal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        key={sectorFilter}
      >
        <Paper 
          withBorder 
          style={{ 
            borderColor: '#E8E5DC', 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}
        >
          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead style={{ backgroundColor: '#1F5C3A' }}>
              <Table.Tr>
                <Table.Th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', padding: '14px 20px' }}>
                  <Group gap="xs">
                    <IconGridDots size={16} />
                    Sector
                  </Group>
                </Table.Th>
                <Table.Th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', padding: '14px 20px' }}>
                  <Group gap="xs">
                    <IconPlant size={16} />
                    Cultivo / Variedad
                  </Group>
                </Table.Th>
                <Table.Th style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  textAlign: 'center',
                  padding: '14px 20px'
                }}>
                  Hectáreas
                </Table.Th>
                <Table.Th style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  textAlign: 'center',
                  padding: '14px 20px'
                }}>
                  Grupo
                </Table.Th>
                <Table.Th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', padding: '14px 20px' }}>
                  Estado
                </Table.Th>
                <Table.Th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', padding: '14px 20px' }}>
                  Progreso
                </Table.Th>
                <Table.Th style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  textAlign: 'right',
                  padding: '14px 20px'
                }}>
                  Cajas Totales
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <Table.Tr key={index} style={{ borderBottom: '1px solid #EFECE3' }}>
                    <Table.Td>
                      <Badge 
                        variant="light" 
                        color="teal" 
                        size="sm" 
                        radius="sm"
                        style={{ fontWeight: 700 }}
                      >
                        {row.sector_id}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={600} c="#3A3A34">{row.cultivo}</Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Text size="sm" fw={500}>{row.ha} ha</Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge 
                        variant="outline" 
                        color="gray" 
                        size="sm" 
                        radius="sm"
                        style={{ fontWeight: 700 }}
                      >
                        {row.grupo}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6}>
                        <Box 
                          style={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            backgroundColor: row.color 
                          }} 
                        />
                        <Text size="sm" fw={500} c={row.color}>{row.estado}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <Progress 
                          value={row.avance} 
                          color={row.color} 
                          size="sm" 
                          radius="xl"
                          style={{ flex: 1, backgroundColor: '#F5F3EE' }} 
                        />
                        <Text size="xs" fw={700} style={{ minWidth: '32px', textAlign: 'right' }}>
                          {row.avance}%
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" fw={700} c="#1F5C3A">{row.cajas}</Text>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7} ta="center" py="xl">
                    <Stack align="center" gap="sm">
                      <IconPlant size={40} color="#9A968A" opacity={0.4} />
                      <Text size="sm" c="dimmed">No hay sectores registrados</Text>
                      <Text size="xs" c="dimmed">Los datos aparecerán cuando se registren sectores</Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </motion.div>

      {/* Nota al pie */}
      <Card mt="md" p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Group gap="xs">
          <ThemeIcon size="sm" radius="xl" color="teal" variant="light">
            <IconTrendingUp size={14} />
          </ThemeIcon>
          <Text size="xs" c="dimmed" style={{ lineHeight: 1.6 }}>
            <strong>Nota:</strong> El progreso de corte se actualiza diariamente con la captura de cosecha. 
            Los sectores en estado "Cosecha Activa" tienen prioridad en la programación de viajes. 
            {filteredData.length} sectores mostrados
          </Text>
        </Group>
      </Card>
    </Box>
  );
}

export default GrowerSectors;