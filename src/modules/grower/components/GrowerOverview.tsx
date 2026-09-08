import { SimpleGrid, Card, Text, Title, Group, ThemeIcon, Progress, Stack, Table, Badge, Box, Grid } from '@mantine/core';
import { IconTrendingUp, IconPlant2,  IconAlertTriangle, IconChecklist } from '@tabler/icons-react';
import { motion } from 'framer-motion';

// Helper local de color con contraste optimizado para la paleta agrícola
const agroColors = {
  green: { bg: 'rgba(31, 92, 58, 0.12)', text: '#1F5C3A' },
  blue: { bg: 'rgba(42, 106, 138, 0.12)', text: '#2A6A8A' },
  rust: { bg: 'rgba(138, 90, 42, 0.12)', text: '#8A5A2A' },
  amber: { bg: 'rgba(230, 126, 34, 0.12)', text: '#E67E22' },
};

// Contenedor animado para las tarjetas de KPI
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
} as const;

export function GrowerOverview() {
  // Datos simulados de la maqueta operativa para el bloque actual (CO6 Sectores)
  const kpis = [
    { title: 'SUPERFICIE EN PRODUCCIÓN', value: '42.5 Ha', sub: '92% del área total planeada', icon: IconPlant2, color: agroColors.green },
    { title: 'RENDIMIENTO ESTIMADO', value: '3.2 Ton/Ha', sub: '+0.4% vs ciclo anterior', icon: IconTrendingUp, color: agroColors.blue },
    { title: 'PROYECCIÓN DE COSECHA', value: '136,000 kg', sub: 'Variedad: Roma / Reinas', icon: IconChecklist, color: agroColors.rust },
    { title: 'ALERTAS DE FITOSANIDAD', value: '2 Sectores', sub: 'Monitoreo de humedad activo', icon: IconAlertTriangle, color: agroColors.amber },
  ];

  const sectoresData = [
    { nombre: 'Sector CO6-A (Lote Bajo)', variedad: 'Tomate Roma', progreso: 85, estatus: 'Cosecha Activa', color: '#1F5C3A' },
    { nombre: 'Sector CO6-B (Lote Alto)', variedad: 'Tomate Roma', progreso: 60, estatus: 'Desarrollo', color: '#2A6A8A' },
    { nombre: 'Sector CO6-C (Postura Nueva)', variedad: 'Tomate Reina', progreso: 20, estatus: 'Barbecho / Trasplante', color: '#8A5A2A' },
    { nombre: 'Sector CO6-D (Reserva)', variedad: 'Por planificar', progreso: 0, estatus: 'Inactivo', color: '#A3A39A' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <Stack gap="xl">
        
        {/* Grilla Macro de KPIs */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          {kpis.map((kpi, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card p="lg" style={{ borderColor: '#E0DDD2' }}>
                <Group justify="space-between" align="flex-start">
                  <Stack gap={2}>
                    <Text size="xs" fw={700} c="#A3A39A" style={{ letterSpacing: '0.5px' }}>
                      {kpi.title}
                    </Text>
                    <Title order={2} fw={700} c="#3A3A34" mt={4}>
                      {kpi.value}
                    </Title>
                  </Stack>
                  <ThemeIcon
                    size={42}
                    radius="md"
                    style={{ backgroundColor: kpi.color.bg, color: kpi.color.text }}
                  >
                    <kpi.icon size={22} stroke={2} />
                  </ThemeIcon>
                </Group>
                <Text size="xs" c="dimmed" mt="sm" fw={500}>
                  {kpi.sub}
                </Text>
              </Card>
            </motion.div>
          ))}
        </SimpleGrid>

        {/* Sección del Bloque CO6 Sectores */}
        <Grid>
          {/* Lado Izquierdo: Monitoreo de Avance por Sectores */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <motion.div variants={itemVariants}>
              <Card p="xl" style={{ borderColor: '#E0DDD2', height: '100%' }}>
                <Box mb="lg">
                  <Title order={4} fw={700} c="#3A3A34">
                    Monitoreo de Bloque: CO6 Sectores
                  </Title>
                  <Text size="xs" c="dimmed" mt={2}>
                    Desglose del porcentaje de avance, labranza y maduración por sección asignada.
                  </Text>
                </Box>

                <Stack gap="xl">
                  {sectoresData.map((sector, idx) => (
                    <Stack gap={6} key={idx}>
                      <Group justify="space-between">
                        <Group gap="xs">
                          <Box style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: sector.color }} />
                          <Text size="sm" fw={600} c="#3A3A34">{sector.nombre}</Text>
                        </Group>
                        <Text size="xs" fw={700} c="dimmed">{sector.progreso}%</Text>
                      </Group>
                      <Progress 
                        value={sector.progreso} 
                        color={sector.color} 
                        size="sm" 
                        radius="xl"
                        style={{ backgroundColor: '#EFEDE6' }}
                      />
                      <Group justify="space-between" mt={2}>
                        <Text size="xs" c="dimmed">{sector.variedad}</Text>
                        <Badge 
                          size="xs" 
                          variant="light" 
                          style={{
                            backgroundColor: sector.color === '#A3A39A' ? '#EFEDE6' : `${sector.color}15`,
                            color: sector.color,
                            fontSize: '10px',
                            fontWeight: 700
                          }}
                        >
                          {sector.estatus}
                        </Badge>
                      </Group>
                    </Stack>
                  ))}
                </Stack>
              </Card>
            </motion.div>
          </Grid.Col>

          {/* Lado Derecho: Órdenes de Recolección Recientes */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <motion.div variants={itemVariants}>
              <Card p="xl" style={{ borderColor: '#E0DDD2', height: '100%' }}>
                <Box mb="md">
                  <Title order={4} fw={700} c="#3A3A34">
                    Últimas Remisiones de Campo
                  </Title>
                  <Text size="xs" c="dimmed" mt={2}>
                    Cargas enviadas recientemente hacia la báscula de pesado.
                  </Text>
                </Box>

                <Table verticalSpacing="sm" highlightOnHover variant="simple" style={{ color: '#3A3A34' }}>
                  <Table.Thead>
                    <Table.Tr style={{ borderColor: '#E0DDD2' }}>
                      <Table.Th style={{ color: '#A3A39A', fontSize: '11px' }}>FOLIO</Table.Th>
                      <Table.Th style={{ color: '#A3A39A', fontSize: '11px' }}>SECTOR</Table.Th>
                      <Table.Th style={{ color: '#A3A39A', fontSize: '11px' }} ta="right">JABAS</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr style={{ borderColor: '#E0DDD2' }}>
                      <Table.Td><Text size="xs" fw={700} c="#2A6A8A">#REM-2041</Text></Table.Td>
                      <Table.Td><Text size="xs" fw={500}>CO6-A</Text></Table.Td>
                      <Table.Td ta="right"><Text size="xs" fw={700}>180</Text></Table.Td>
                    </Table.Tr>
                    <Table.Tr style={{ borderColor: '#E0DDD2' }}>
                      <Table.Td><Text size="xs" fw={700} c="#2A6A8A">#REM-2040</Text></Table.Td>
                      <Table.Td><Text size="xs" fw={500}>CO6-A</Text></Table.Td>
                      <Table.Td ta="right"><Text size="xs" fw={700}>220</Text></Table.Td>
                    </Table.Tr>
                    <Table.Tr style={{ borderColor: '#E0DDD2' }}>
                      <Table.Td><Text size="xs" fw={700} c="#2A6A8A">#REM-2039</Text></Table.Td>
                      <Table.Td><Text size="xs" fw={500}>CO6-B</Text></Table.Td>
                      <Table.Td ta="right"><Text size="xs" fw={700}>145</Text></Table.Td>
                    </Table.Tr>
                    <Table.Tr style={{ borderColor: '#E0DDD2' }}>
                      <Table.Td><Text size="xs" fw={700} c="#2A6A8A">#REM-2038</Text></Table.Td>
                      <Table.Td><Text size="xs" fw={500}>CO6-A</Text></Table.Td>
                      <Table.Td ta="right"><Text size="xs" fw={700}>190</Text></Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Card>
            </motion.div>
          </Grid.Col>
        </Grid>

      </Stack>
    </motion.div>
  );
}