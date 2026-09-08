import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Text,
  Group,
  Stack,
  Select,
  Table,
  Badge,
  SegmentedControl,
  SimpleGrid,
  Progress,
  ThemeIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconDashboard,
  IconClock,
  IconChartBar,
  IconCurrencyDollar,
  IconBuildingStore,
  IconTruck,
  IconBox,
  IconReceipt,
  IconTrendingUp,
  IconTrendingDown,
  IconInfoCircle,
  IconUsers,
  IconFileInvoice,
  IconCalendar,
  IconPercentage,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

// Tipos de datos
interface KpiCard {
  label: string;
  value: string | number;
  sub: string;
  icon: React.FC<any>;
  color: string;
  bgColor: string;
  badge: string;
  badgeColor: string;
  delay: number;
}

interface CostoItem {
  label: string;
  value: string;
  progress: number;
  color?: string;
}

export function DashboardPCView() {
  // --- Filtros ---
  const [filtroServicio, setFiltroServicio] = useState<string | null>('Todos');
  const [filtroCliente, setFiltroCliente] = useState<string | null>('Todos');
  const [vistaMargen, setVistaMargen] = useState('Semana');

  const [filtroCategoria, setFiltroCategoria] = useState<string | null>('Todas');
  const [filtroProveedor, setFiltroProveedor] = useState<string | null>('Todos');
  const [vistaCostos, setVistaCostos] = useState('Mes');

  // KPI Cards data
  const kpiCards: KpiCard[] = [
    {
      label: 'Semanas operadas',
      value: '4 · 32 cortes',
      sub: '$21,525 prom/semana de utilidad',
      icon: IconCalendar,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: '4 semanas',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Utilidad acumulada vs esperada',
      value: '$86,100 / $68,800',
      sub: '125% · terceros arriba del plan',
      icon: IconTrendingUp,
      color: '#2D8F5E',
      bgColor: '#ECFDF5',
      badge: '125%',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Ventas de servicio acum. vs esperadas',
      value: '$194,230 / $188,800',
      sub: '103%',
      icon: IconCurrencyDollar,
      color: '#2D6BAE',
      bgColor: '#EFF6FF',
      badge: '103%',
      badgeColor: 'blue',
      delay: 0.15,
    },
    {
      label: 'Se debe vs Por cobrar',
      value: '$486,200 / $443,452 MXN',
      sub: 'renta del 15 · cortes por cobrar',
      icon: IconFileInvoice,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Por cobrar',
      badgeColor: 'yellow',
      delay: 0.2,
    },
  ];

  // Datos de costos por categoría
  const costosCategoria: CostoItem[] = [
    { label: 'Hielo comprado (46%)', value: '$29.3K', progress: 90 },
    { label: 'Renta', value: '$34K', progress: 95 },
    { label: 'Nómina + destajo', value: '$16.9K', progress: 50 },
    { label: 'Energía hielo propio', value: '$6.9K', progress: 25 },
    { label: 'Mto + serv. máquinas', value: '$6.5K', progress: 22 },
  ];

  const costosProveedor: CostoItem[] = [
    { label: 'Arrendadora del parque', value: '$34K', progress: 95 },
    { label: 'Fábrica de hielo', value: '$29.3K', progress: 88 },
    { label: 'CFE', value: '$8.4K', progress: 30 },
    { label: 'Montacargas GTO', value: '$2.1K', progress: 12 },
    { label: 'Refrig. Bajío', value: '$3.5K', progress: 18 },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">
          {/* HEADER PRINCIPAL - Estilo UsersPermissions */}
          <Paper
            p="sm"
            radius="lg"
            style={{
              background: 'linear-gradient(135deg, #1A4B8C 0%, #2D6BAE 50%, #4A8BC2 100%)',
              color: '#FFFFFF',
            }}
          >
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <IconDashboard size={20} style={{ opacity: 0.8 }} />
                <Text fw={700} size="lg" c="white">
                  Grupo Produce First — Módulo Produce Cooling
                </Text>
                <Badge size="xs" variant="white" color="blue" radius="sm">
                  PC-5
                </Badge>
                <Badge
                  size="xs"
                  variant="light"
                  color="gray"
                  radius="sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}
                >
                  Invierno 2026-2027
                </Badge>
              </Group>

              <Group gap="xs">
                <Badge variant="outline" color="gray.2" radius="sm" style={{ color: '#FFFFFF', borderColor: '#ffffff50' }}>
                  <Group gap={4}>
                    <IconBox size={12} />
                    semanas, márgenes por servicio, costos y el día 15
                  </Group>
                </Badge>
              </Group>
            </Group>
          </Paper>

          {/* 4 KPI CARDS - Estilo UsersPermissions */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            {kpiCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: card.delay || index * 0.05 }}
              >
                <Paper
                  p="md"
                  radius="lg"
                  withBorder
                  style={{
                    borderColor: '#E8E5DC',
                    backgroundColor: '#FFFFFF',
                    height: '100%',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={2} style={{ flex: 1 }}>
                      <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">
                        {card.label}
                      </Text>
                      <Text size="15px" fw={800} style={{ color: card.color, lineHeight: 1.2 }}>
                        {card.value}
                      </Text>
                      <Text size="10px" c="dimmed">{card.sub}</Text>
                      <Badge
                        size="xs"
                        color={card.badgeColor}
                        variant="light"
                        radius="sm"
                        style={{ alignSelf: 'flex-start', marginTop: 2 }}
                      >
                        {card.badge}
                      </Badge>
                    </Stack>
                    <ThemeIcon
                      size="lg"
                      radius="md"
                      style={{
                        backgroundColor: card.bgColor,
                        color: card.color,
                        flexShrink: 0,
                      }}
                    >
                      <card.icon size={20} stroke={2} />
                    </ThemeIcon>
                  </Group>
                </Paper>
              </motion.div>
            ))}
          </SimpleGrid>

          {/* SECCIÓN 1: CÓMO VAMOS CONTRA EL TIEMPO */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconClock size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Cómo vamos contra el tiempo
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Semana 4 de 21
                </Badge>
              </Group>

              <Divider />

              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" fw={600} c="gray.7">Tiempo de temporada transcurrido</Text>
                  <Text size="xs" c="dimmed">19%</Text>
                </Group>
                <Progress value={19} color="gray.5" size="sm" radius="xl" />
              </Box>

              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" fw={600} c="gray.7">Ventas de servicio vs plan a la fecha</Text>
                  <Text size="xs" fw={700} c="blue.7">103% ($194,230 de $188,800)</Text>
                </Group>
                <Progress value={100} color="blue.7" size="sm" radius="xl" />
              </Box>

              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" fw={600} c="gray.7">Utilidad vs plan a la fecha</Text>
                  <Text size="xs" fw={700} c="green.7">125% ($86,100 de $68,800)</Text>
                </Group>
                <Progress value={100} color="green.7" size="sm" radius="xl" />
              </Box>

              {/* GRÁFICOS DUALES DE TENDENCIA (SVG) */}
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mt="xs">
                {/* Gráfico 1: Ventas */}
                <Box style={{ height: 90, borderBottom: '1px solid #E5E7EB' }}>
                  <svg width="100%" height="100%" viewBox="0 0 300 60" preserveAspectRatio="none">
                    <path d="M 20,45 L 90,35 L 160,28 L 230,15 L 280,40" fill="none" stroke="#0284C7" strokeWidth="2" />
                    <path d="M 20,40 L 90,38 L 160,30 L 230,22 L 280,20" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="230" cy="15" r="3" fill="#0284C7" />
                    <circle cx="280" cy="40" r="2.5" fill="#0284C7" />
                  </svg>
                  <Group justify="space-between" px="xs" style={{ marginTop: -12 }}>
                    <Text size="9px" c="dimmed">S45</Text>
                    <Text size="9px" c="dimmed">S46</Text>
                    <Text size="9px" c="dimmed">S47</Text>
                    <Text size="9px" c="dimmed">S48</Text>
                    <Text size="9px" c="dimmed">S49</Text>
                  </Group>
                </Box>

                {/* Gráfico 2: Utilidad */}
                <Box style={{ height: 90, borderBottom: '1px solid #E5E7EB' }}>
                  <svg width="100%" height="100%" viewBox="0 0 300 60" preserveAspectRatio="none">
                    <path d="M 20,40 L 90,32 L 160,22 L 230,10 L 280,35" fill="none" stroke="#16A34A" strokeWidth="2" />
                    <path d="M 20,42 L 90,36 L 160,28 L 230,20 L 280,22" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="230" cy="10" r="3" fill="#16A34A" />
                    <circle cx="280" cy="35" r="2.5" fill="#16A34A" />
                  </svg>
                  <Group justify="space-between" px="xs" style={{ marginTop: -12 }}>
                    <Text size="9px" c="dimmed">S45</Text>
                    <Text size="9px" c="dimmed">S46</Text>
                    <Text size="9px" c="dimmed">S47</Text>
                    <Text size="9px" c="dimmed">S48</Text>
                    <Text size="9px" c="dimmed">S49</Text>
                  </Group>
                </Box>
              </SimpleGrid>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                plan a-la-fecha del presupuesto (PC-PRE)
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 2: UTILIDAD POR SEMANA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconChartBar size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Utilidad por semana
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Cortes semanales
                </Badge>
              </Group>

              <Divider />

              <Box style={{ height: 120 }}>
                <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
                  {/* Barra S45 */}
                  <rect x="110" y="45" width="40" height="40" fill="#0891B2" rx="2" />
                  <text x="130" y="38" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="bold">$16.8K</text>
                  
                  {/* Barra S46 */}
                  <rect x="170" y="35" width="40" height="50" fill="#0891B2" rx="2" />
                  <text x="190" y="28" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="bold">$19.3K</text>
                  
                  {/* Barra S47 */}
                  <rect x="230" y="22" width="40" height="63" fill="#0891B2" rx="2" />
                  <text x="250" y="15" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="bold">$23.6K</text>
                  
                  {/* Barra S48 */}
                  <rect x="290" y="10" width="40" height="75" fill="#0891B2" rx="2" />
                  <text x="310" y="4" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="bold">$26.4K</text>

                  {/* Eje Base */}
                  <line x1="80" y1="85" x2="350" y2="85" stroke="#E2E8F0" strokeWidth="1" />
                  <text x="130" y="96" textAnchor="middle" fontSize="9" fill="#94A3B8">S45</text>
                  <text x="190" y="96" textAnchor="middle" fontSize="9" fill="#94A3B8">S46</text>
                  <text x="250" y="96" textAnchor="middle" fontSize="9" fill="#94A3B8">S47</text>
                  <text x="310" y="96" textAnchor="middle" fontSize="9" fill="#94A3B8">S48</text>
                </svg>
              </Box>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                cada barra es un corte semanal de servicios menos sus costos · clic = su corte (PC-4)
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 3: MARGEN POR SERVICIO X CLIENTE */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconPercentage size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Margen por servicio × cliente
                  </Text>
                </Group>

                <Group gap="md">
                  <Select
                    label="Servicio"
                    value={filtroServicio}
                    onChange={setFiltroServicio}
                    data={['Todos', 'Cooling al vacío', 'Hielo all-in', 'Repack', 'Embolsado']}
                    size="xs"
                    w={130}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Cliente"
                    value={filtroCliente}
                    onChange={setFiltroCliente}
                    data={['Todos', 'PF (propio)', 'Terceros']}
                    size="xs"
                    w={130}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <SegmentedControl
                    value={vistaMargen}
                    onChange={setVistaMargen}
                    data={['Semana', 'Temporada']}
                    size="xs"
                    color="blue"
                  />
                </Group>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Servicio</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        PF (propio) · tarifa
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Terceros · tarifa
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Costo/cj
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Margen propio
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Margen terceros
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr style={{ borderBottom: '1px solid #F0F4FF' }}>
                      <Table.Td style={{ fontSize: '12px', color: '#374151' }}>Cooling al vacío</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>$0.70</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>$1.00</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>$0.42</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#16A34A' }}>$0.28</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#16A34A' }}>$0.58</Table.Td>
                    </Table.Tr>
                    <Table.Tr style={{ borderBottom: '1px solid #F0F4FF' }}>
                      <Table.Td style={{ fontSize: '12px', color: '#374151' }}>Hielo all-in</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#9CA3AF' }}>—</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>$1.35</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>$0.74 (blended real)</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#9CA3AF' }}>—</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#16A34A' }}>$0.61</Table.Td>
                    </Table.Tr>
                    <Table.Tr style={{ borderBottom: '1px solid #F0F4FF' }}>
                      <Table.Td style={{ fontSize: '12px', color: '#374151' }}>Repack</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#9CA3AF' }}>—</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>$0.35</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>$0.30 (destajo)</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#9CA3AF' }}>—</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#16A34A' }}>$0.05</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td style={{ fontSize: '12px', color: '#374151' }}>Embolsado</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>$3.00</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>$3.00</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>$3.00</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#6B7280' }}>traslado directo</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#6B7280' }}>traslado directo</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="11px" c="dimmed">
                el hielo blended real ($0.74) vs plan ($0.775): las máquinas al 54% propio están regalando margen extra — la bitácora (PC-4) lo sostiene
              </Text>
              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                la matriz de tarifas viva: qué deja cada servicio con cada tipo de cliente
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 4: MAYORES COSTOS POR CATEGORÍA Y PROVEEDOR */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconReceipt size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Mayores costos · por categoría y proveedor
                  </Text>
                </Group>

                <Group gap="md">
                  <Select
                    label="Categoría"
                    value={filtroCategoria}
                    onChange={setFiltroCategoria}
                    data={['Todas', 'Hielo comprado', 'Renta', 'Nómina', 'Energía']}
                    size="xs"
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Proveedor"
                    value={filtroProveedor}
                    onChange={setFiltroProveedor}
                    data={['Todos', 'Arrendadora', 'Fábrica de hielo', 'CFE']}
                    size="xs"
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <SegmentedControl
                    value={vistaCostos}
                    onChange={setVistaCostos}
                    data={['Mes', 'Temporada']}
                    size="xs"
                    color="blue"
                  />
                </Group>
              </Group>

              <Divider />

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                {/* Gráfico Barras Categoría */}
                <Stack gap="xs">
                  <Text size="12px" fw={600} c="#1A3A5C" mb={4}>
                    Por categoría
                  </Text>
                  {costosCategoria.map((item, idx) => (
                    <Box key={idx}>
                      <Group justify="space-between" mb={2}>
                        <Text size="11px" c="gray.7">{item.label}</Text>
                        <Text size="11px" fw={700}>{item.value}</Text>
                      </Group>
                      <Progress value={item.progress} color="red.8" size="sm" radius="xl" />
                    </Box>
                  ))}
                </Stack>

                {/* Gráfico Barras Proveedor */}
                <Stack gap="xs">
                  <Text size="12px" fw={600} c="#1A3A5C" mb={4}>
                    Por proveedor
                  </Text>
                  {costosProveedor.map((item, idx) => (
                    <Box key={idx}>
                      <Group justify="space-between" mb={2}>
                        <Text size="11px" c="gray.7">{item.label}</Text>
                        <Text size="11px" fw={700}>{item.value}</Text>
                      </Group>
                      <Progress value={item.progress} color="amber.7" size="sm" radius="xl" />
                    </Box>
                  ))}
                </Stack>
              </SimpleGrid>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                de la CxP de PC (PC-CXP) — cada barra abre sus facturas
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 5: CUÁNTO SE DEBE Y CUÁNTO HAY POR COBRAR */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconBuildingStore size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Cuánto se debe y cuánto hay por cobrar
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  CxP vs CxC
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 140 }}>
                        Monto
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Vivo</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 140 }}>
                        Nota
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr style={{ borderBottom: '1px solid #F0F4FF' }}>
                      <Table.Td style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>Se debe (CxP de PC)</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>$486,200 MXN</Table.Td>
                      <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>renta $396,667 el día 15 · hielo S48</Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Badge size="xs" color="yellow" variant="light">
                          el 15 manda
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr style={{ borderBottom: '1px solid #F0F4FF' }}>
                      <Table.Td style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>Por cobrar (cortes)</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#16A34A' }}>$443,452 MXN</Table.Td>
                      <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>PC-F-0219 terceros + corte S48</Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Badge size="xs" color="blue" variant="light">
                          ciclo 7 días
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>Pendiente del corte de hoy</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#6B7280' }}>$25,152 USD</Table.Td>
                      <Table.Td colSpan={2} style={{ fontSize: '12px', color: '#6B7280' }}>
                        de las bitácoras · aún sin facturar
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Stack>
          </Paper>

          {/* SECCIÓN 6: DÍAS PROMEDIO DE PAGO */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconCalendar size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Días promedio de pago por cliente
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Ciclo de cobro
                </Badge>
              </Group>

              <Divider />

              <Stack gap="xs">
                <Box>
                  <Group justify="space-between" mb={2}>
                    <Text size="11px" c="gray.7">Terceros brócoli · 8 días (pactado 7)</Text>
                    <Text size="11px" fw={700}>8d</Text>
                  </Group>
                  <Progress value={40} color="cyan.8" size="sm" radius="xl" />
                </Box>

                <Box>
                  <Group justify="space-between" mb={2}>
                    <Text size="11px" c="gray.7">Produce First (interco.) · 13 (pactado 15)</Text>
                    <Text size="11px" fw={700}>13d</Text>
                  </Group>
                  <Progress value={65} color="cyan.8" size="sm" radius="xl" />
                </Box>
              </Stack>
            </Stack>
          </Paper>

          {/* CALLOUT INFORMATIVO FINAL - Estilo UsersPermissions */}
          <Paper
            p="sm"
            radius="lg"
            style={{
              backgroundColor: '#F0F7FF',
              border: '1px solid #93C5FD',
            }}
          >
            <Group align="flex-start" gap="xs">
              <IconInfoCircle size={18} color="#1A4B8C" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text size="xs" c="#1A3A5C" style={{ flex: 1, lineHeight: 1.5 }}>
                <strong>✓ Al guardar:</strong> todo sale de las bitácoras (PC-4), los cortes (PC-CXC) y la CxP (PC-CXP) — cero capturas aquí · la misma fórmula del dashboard de PF, con las variables de la planta.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}