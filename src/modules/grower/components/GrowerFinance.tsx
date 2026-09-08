import React from 'react';
import { 
  Stack, SimpleGrid, Card, Text, Title, Group, ThemeIcon, 
  Table, Badge, Progress, Box, Grid 
} from '@mantine/core';
import { 
  IconPigMoney, IconTrendingUp, IconTrendingDown, 
  IconReceiptDollar, IconChartBar 
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

// Colores analíticos optimizados
const financeColors = {
  profit: { bg: 'rgba(31, 92, 58, 0.12)', text: '#1F5C3A' },
  expense: { bg: 'rgba(138, 90, 42, 0.12)', text: '#8A5A2A' },
  projection: { bg: 'rgba(42, 106, 138, 0.12)', text: '#2A6A8A' },
};

export function GrowerFinance() {
  
  // Datos macro financieros del bloque actual (CO6 Sectores)
  const financialKPIs = [
    { title: 'INVERSIÓN ACUMULADA', value: '$24,850.00', sub: 'Costos directos de insumos y labor', icon: IconReceiptDollar, color: financeColors.expense },
    { title: 'VENTAS ESTIMADAS', value: '$48,960.00', sub: 'Basado en kg cosechados contratados', icon: IconTrendingUp, color: financeColors.projection },
    { title: 'MARGEN OPERATIVO (P&L)', value: '$24,110.00', sub: 'Utilidad bruta proyectada: 49.2%', icon: IconPigMoney, color: financeColors.profit },
  ];

  // Desglose de Gastos por Categoría Operativa
  const costBreakdown = [
    { categoria: 'Insumos y Fertilizantes', monto: 11200, porcentaje: 45, color: '#8A5A2A' },
    { categoria: 'Mano de Obra y Jornales', monto: 7450, porcentaje: 30, color: '#E67E22' },
    { categoria: 'Diésel y Maquinaria', monto: 3730, porcentaje: 15, color: '#2A6A8A' },
    { categoria: 'Fletes y Logística Inicial', monto: 2470, porcentaje: 10, color: '#A3A39A' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <Stack gap="xl">
        
        {/* KPIs Financieros Principales */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          {financialKPIs.map((kpi, idx) => (
            <Card key={idx} p="lg" style={{ borderColor: '#E0DDD2' }}>
              <Group justify="space-between" align="flex-start">
                <Stack gap={2}>
                  <Text size="xs" fw={700} c="#A3A39A" style={{ letterSpacing: '0.5px' }}>
                    {kpi.title}
                  </Text>
                  <Title order={2} fw={800} c="#3A3A34" mt={4}>
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
          ))}
        </SimpleGrid>

        {/* Bloque Dividido: Distribución de Costos e Historial de Transacciones */}
        <Grid>
          
          {/* Gráfica de Distribución de Costos Real acumulado */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Card p="xl" style={{ borderColor: '#E0DDD2', height: '100%' }}>
              <Box mb="xl">
                <Group gap="xs">
                  <ThemeIcon size="sm" radius="xl" style={{ backgroundColor: 'rgba(138, 90, 42, 0.12)', color: '#8A5A2A' }}>
                    <IconChartBar size={14} />
                  </ThemeIcon>
                  <Title order={4} fw={700} c="#3A3A34">
                    Estructura de Costos
                  </Title>
                </Group>
                <Text size="xs" c="dimmed" mt={2}>
                  Distribución del capital invertido en el bloque CO6.
                </Text>
              </Box>

              <Stack gap="lg">
                {costBreakdown.map((item, idx) => (
                  <Stack gap={4} key={idx}>
                    <Group justify="space-between">
                      <Text size="xs" fw={600} c="#3A3A34">{item.categoria}</Text>
                      <Text size="xs" fw={700} c="#3A3A34">
                        ${item.monto.toLocaleString('en-US')} ({item.porcentaje}%)
                      </Text>
                    </Group>
                    <Progress 
                      value={item.porcentaje} 
                      color={item.color} 
                      size="sm" 
                      radius="xl"
                      style={{ backgroundColor: '#EFEDE6' }}
                    />
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Grid.Col>

          {/* Tabla P&L Detallada por Sector */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Card p="xl" style={{ borderColor: '#E0DDD2', height: '100%' }}>
              <Box mb="md">
                <Title order={4} fw={700} c="#3A3A34">
                  Estado de Resultados Corto (P&L por Sector)
                </Title>
                <Text size="xs" c="dimmed" mt={2}>
                  Margen de rentabilidad calculado por sección de cultivo activa.
                </Text>
              </Box>

              <Table verticalSpacing="sm" highlightOnHover variant="simple" style={{ color: '#3A3A34' }}>
                <Table.Thead>
                  <Table.Tr style={{ borderColor: '#E0DDD2' }}>
                    <Table.Th style={{ color: '#A3A39A', fontSize: '11px' }}>SECTOR</Table.Th>
                    <Table.Th style={{ color: '#A3A39A', fontSize: '11px' }} ta="right">COSTOS</Table.Th>
                    <Table.Th style={{ color: '#A3A39A', fontSize: '11px' }} ta="right">INGRESOS</Table.Th>
                    <Table.Th style={{ color: '#A3A39A', fontSize: '11px' }} ta="right">ESTADO</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr style={{ borderColor: '#E0DDD2' }}>
                    <Table.Td><Text size="xs" fw={700}>CO6-A (Lote Bajo)</Text></Table.Td>
                    <Table.Td ta="right"><Text size="xs" c="#8A5A2A" fw={500}>$12,400</Text></Table.Td>
                    <Table.Td ta="right"><Text size="xs" c="#1F5C3A" fw={700}>$28,500</Text></Table.Td>
                    <Table.Td ta="right">
                      <Badge variant="light" size="xs" style={{ backgroundColor: 'rgba(31, 92, 58, 0.12)', color: '#1F5C3A' }}>
                        Rentable
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr style={{ borderColor: '#E0DDD2' }}>
                    <Table.Td><Text size="xs" fw={700}>CO6-B (Lote Alto)</Text></Table.Td>
                    <Table.Td ta="right"><Text size="xs" c="#8A5A2A" fw={500}>$8,150</Text></Table.Td>
                    <Table.Td ta="right"><Text size="xs" c="#1F5C3A" fw={700}>$16,200</Text></Table.Td>
                    <Table.Td ta="right">
                      <Badge variant="light" size="xs" style={{ backgroundColor: 'rgba(31, 92, 58, 0.12)', color: '#1F5C3A' }}>
                        Rentable
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr style={{ borderColor: '#E0DDD2' }}>
                    <Table.Td><Text size="xs" fw={700}>CO6-C (Postura Nueva)</Text></Table.Td>
                    <Table.Td ta="right"><Text size="xs" c="#8A5A2A" fw={500}>$4,300</Text></Table.Td>
                    <Table.Td ta="right"><Text size="xs" c="dimmed" fw={700}>$4,260</Text></Table.Td>
                    <Table.Td ta="right">
                      <Badge variant="light" size="xs" style={{ backgroundColor: 'rgba(230, 126, 34, 0.12)', color: '#E67E22' }}>
                        Punto Equilibrio
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Card>
          </Grid.Col>

        </Grid>

      </Stack>
    </motion.div>
  );
}