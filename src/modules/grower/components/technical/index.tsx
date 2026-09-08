// src/modules/grower/GrowerTechnical.tsx
import React from 'react';
import { 
  Box, 
  SimpleGrid, 
  Paper, 
  Text, 
  Group, 
  ThemeIcon, 
  Badge, 
  Progress, 
  Stack, 
  Divider,
  Table,
  Card,
  Loader,
  Center,
  Alert,
  Button
} from '@mantine/core';
import { 
  IconThermometer, 
  IconDroplet, 
  IconLeaf,
  IconAlertTriangle, 
  IconInfoCircle,
  IconScale,
  IconClock,
  IconRefresh,
  IconAlertCircle,
  IconPlant,
  IconSeeding
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTechnical } from './hooks/useTechnical';

const CARD_ANIMATION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
};

// Mapeo de iconos
const iconMap: Record<string, any> = {
  'IconLeaf': IconLeaf,
  'IconThermometer': IconThermometer,
  'IconDroplet': IconDroplet,
  'IconPlant': IconPlant,
  'IconSeeding': IconSeeding,
};

const getStatusColor = (status: string) => {
  if (status === 'Óptimo') return 'green';
  if (status === 'Atención') return 'orange';
  return 'red';
};

export function GrowerTechnical() {
  const { parameters, yieldSpecs, isLoading, error, refresh } = useTechnical();

  // ============================================================
  // ESTADOS DE CARGA Y ERROR
  // ============================================================
  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando fichas técnicas...</Text>
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

  // Usar datos reales o los de ejemplo si no hay
  const displayParameters = parameters.length > 0 ? parameters : [
    { 
      id: '1',
      crop: 'Shanghai Bok Choy', 
      variety: 'Híbrido F1',
      temp: '15°C - 22°C', tempVal: 85,
      humidity: '65% - 75%', humVal: 72,
      ph: '6.0 - 6.8', 
      ec: '1.5 - 2.0 dS/m', 
      daysToHarvest: '45-50 días',
      status: 'Óptimo', 
      icon: 'IconLeaf',
      alert: null
    },
    { 
      id: '2',
      crop: 'Baby Napa', 
      variety: 'Hoja Rizada',
      temp: '13°C - 20°C', tempVal: 92,
      humidity: '70% - 80%', humVal: 78,
      ph: '5.8 - 6.5', 
      ec: '1.8 - 2.4 dS/m', 
      daysToHarvest: '55-60 días',
      status: 'Óptimo', 
      icon: 'IconThermometer',
      alert: null
    },
    { 
      id: '3',
      crop: 'Coliflor China', 
      variety: 'Flores Blancas',
      temp: '16°C - 25°C', tempVal: 55, 
      humidity: '60% - 70%', humVal: 45, 
      ph: '6.2 - 7.0', 
      ec: '2.0 - 2.5 dS/m', 
      daysToHarvest: '75-85 días',
      status: 'Atención', 
      icon: 'IconDroplet',
      alert: 'Estrés hídrico detectado en Postura 5a-1'
    },
  ];

  const displayYieldSpecs = yieldSpecs.length > 0 ? yieldSpecs : [
    { id: '1', crop: 'Shanghai Bok Choy', yieldTarget: '12-15 Ton/Ha', weightBox: '4.5 Kg', maxWaste: '3.5%', actionCode: 'TKT-STANDARD' },
    { id: '2', crop: 'Baby Napa', yieldTarget: '18-22 Ton/Ha', weightBox: '6.0 Kg', maxWaste: '4.0%', actionCode: 'TKT-HIGH' },
    { id: '3', crop: 'Coliflor China', yieldTarget: '15-20 Ton/Ha', weightBox: '5.5 Kg', maxWaste: '5.0%', actionCode: 'TKT-CRITICAL' },
  ];

  return (
    <Box p="md">
      {/* Encabezado */}
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={0}>
          <Text size="xs" fw={700} c="#1F5C3A" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
            G-12 · Fichas Técnicas
          </Text>
          <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            Monitoreo de Cultivos
          </Text>
          <Text size="sm" c="dimmed">
            Parámetros técnicos y estándares de calidad por cultivo
          </Text>
        </Stack>
        <Group gap="sm">
          <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
            {displayParameters.length} Cultivos
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

      {/* Tarjetas de Cultivos */}
      <SimpleGrid cols={{ base: 1, md: 3 }} mb="xl" spacing="lg">
        {displayParameters.map((item, index) => {
          // Obtener el icono correcto
          const IconComponent = iconMap[item.icon] || IconLeaf;
          
          return (
            <motion.div key={index} {...CARD_ANIMATION}>
              <Card 
                p="lg" 
                radius="lg" 
                withBorder 
                style={{ 
                  borderColor: '#E8E5DC', 
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Group justify="space-between" align="flex-start" mb="md">
                  <Group gap="sm">
                    <ThemeIcon variant="light" size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A', border: '1px solid #E8E5DC' }}>
                      <IconComponent size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={800} size="md" c="#3A3A34">{item.crop}</Text>
                      <Text size="xs" c="dimmed">{item.variety}</Text>
                    </div>
                  </Group>
                  <Badge 
                    variant="light" 
                    color={getStatusColor(item.status)}
                    size="sm"
                    style={{ borderRadius: '4px', fontWeight: 600 }}
                  >
                    {item.status}
                  </Badge>
                </Group>

                <Divider my="md" color="#F0EFEA" />

                <Stack gap="md" mb="lg">
                  <div>
                    <Group justify="space-between" mb={4}>
                      <Group gap={4}>
                        <IconThermometer size={14} color="#9A968A" />
                        <Text size="xs" fw={500} c="dimmed">Temperatura</Text>
                      </Group>
                      <Text size="xs" fw={700} c="#3A3A34">{item.temp}</Text>
                    </Group>
                    <Progress value={item.tempVal} color={item.tempVal > 90 ? 'orange' : '#1F5C3A'} size="sm" radius="xl" />
                  </div>

                  <div>
                    <Group justify="space-between" mb={4}>
                      <Group gap={4}>
                        <IconDroplet size={14} color="#9A968A" />
                        <Text size="xs" fw={500} c="dimmed">Humedad del Suelo</Text>
                      </Group>
                      <Text size="xs" fw={700} c="#3A3A34">{item.humidity}</Text>
                    </Group>
                    <Progress value={item.humVal} color={item.humVal < 50 ? 'red' : '#1F5C3A'} size="sm" radius="xl" />
                  </div>
                </Stack>

                <SimpleGrid cols={2} spacing="xs" p="sm" style={{ backgroundColor: '#FAF9F5', borderRadius: '6px', border: '1px solid #EFECE3' }}>
                  <Stack gap={1}>
                    <Text size="10px" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.3px' }}>pH</Text>
                    <Text size="sm" fw={800} c="#1F5C3A">{item.ph}</Text>
                  </Stack>
                  <Stack gap={1}>
                    <Text size="10px" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.3px' }}>CE</Text>
                    <Text size="sm" fw={800} c="#3A3A34">{item.ec}</Text>
                  </Stack>
                </SimpleGrid>

                <Box mt="md">
                  <Group gap={6}>
                    <IconClock size={14} color="#9A968A" />
                    <Text size="xs" c="dimmed">Cosecha: <strong style={{ color: '#3A3A34' }}>{item.daysToHarvest}</strong></Text>
                  </Group>

                  {item.alert && (
                    <Box mt="xs" p="xs" style={{ backgroundColor: 'rgba(224, 86, 36, 0.06)', borderRadius: '4px', border: '1px solid rgba(224, 86, 36, 0.12)' }}>
                      <Group gap={6} align="center">
                        <IconAlertTriangle size={14} color="#E05624" />
                        <Text size="xs" fw={600} c="#E05624">{item.alert}</Text>
                      </Group>
                    </Box>
                  )}
                </Box>
              </Card>
            </motion.div>
          );
        })}
      </SimpleGrid>

      {/* Tabla de Estándares */}
      <Paper 
        p="xl" 
        radius="lg" 
        withBorder 
        style={{ 
          borderColor: '#E8E5DC', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          backgroundColor: '#FFFFFF'
        }}
      >
        <Group justify="space-between" align="center" mb="lg">
          <Group gap="sm">
            <ThemeIcon variant="light" color="teal" size="md" radius="sm" style={{ backgroundColor: '#EAF0E6', color: '#1F5C3A' }}>
              <IconInfoCircle size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#3A3A34">Estándares de Empaque</Text>
              <Text size="xs" c="dimmed">Rendimiento y especificaciones de tolerancia</Text>
            </Stack>
          </Group>
          <Badge variant="dot" color="teal" size="sm" style={{ padding: '4px 12px' }}>
            {displayYieldSpecs.length} Cultivos
          </Badge>
        </Group>

        <Divider mb="lg" />

        <Table verticalSpacing="md" horizontalSpacing="md" style={{ fontSize: '13px' }} highlightOnHover>
          <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
            <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
              <Table.Th style={{ color: '#4A4A40', fontWeight: 700 }}>Cultivo</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontWeight: 700 }}>Rendimiento Esperado</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontWeight: 700 }}>Peso Neto por Caja</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontWeight: 700 }} ta="right">Merma Máxima</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontWeight: 700 }} ta="center">Configuración</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {displayYieldSpecs.map((spec, idx) => (
              <Table.Tr key={idx} style={{ borderBottom: '1px solid #EFECE3' }}>
                <Table.Td fw={700} c="#1F5C3A">{spec.crop}</Table.Td>
                <Table.Td fw={500} c="#3A3A34">{spec.yieldTarget}</Table.Td>
                <Table.Td>
                  <Group gap={6}>
                    <IconScale size={14} color="#9A968A" />
                    <Text size="xs" fw={500}>{spec.weightBox}</Text>
                  </Group>
                </Table.Td>
                <Table.Td ta="right">
                  <Badge variant="light" color={idx === 2 ? 'red' : 'gray'} radius="sm">
                    {spec.maxWaste}
                  </Badge>
                </Table.Td>
                <Table.Td ta="center">
                  <Badge size="xs" variant="outline" color="gray" radius="sm" style={{ letterSpacing: '0.3px' }}>
                    {spec.actionCode}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Nota al pie */}
      <Card mt="md" p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Group gap="xs">
          <ThemeIcon size="sm" radius="xl" color="teal" variant="light">
            <IconInfoCircle size={14} />
          </ThemeIcon>
          <Text size="xs" c="dimmed" style={{ lineHeight: 1.6 }}>
            <strong>Nota:</strong> Las fichas técnicas se actualizan automáticamente con los parámetros 
            agronómicos registrados. Los valores de temperatura y humedad son monitoreados en tiempo real.
            {displayParameters.filter(p => p.status === 'Atención').length > 0 && 
              ` ⚠️ ${displayParameters.filter(p => p.status === 'Atención').length} cultivo(s) requieren atención.`}
          </Text>
        </Group>
      </Card>
    </Box>
  );
}

export default GrowerTechnical;