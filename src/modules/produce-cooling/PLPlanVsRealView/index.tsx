import React from 'react';
import {
  Box,
  Container,
  Paper,
  Text,
  Group,
  Stack,
  Table,
  SimpleGrid,
  Progress,
  Badge,
  ThemeIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconChartBar,
  IconCurrencyDollar,
  IconIceCream,
  IconReceipt,
  IconBuildingStore,
  IconTruck,
  IconBox,
  IconCheck,
  IconTrendingUp,
  IconTrendingDown,
  IconInfoCircle,
  IconPercentage,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

// Tipos de datos
interface PLRow {
  concepto: string;
  plan: string;
  real: string;
  delta: string;
  isPositive: boolean;
}

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

export function PLPlanVsRealView() {
  // --- Datos Tabla P&L Noviembre ---
  const plData: PLRow[] = [
    { concepto: 'Cooling propio', plan: '$39,167', real: '$38,420', delta: '-$747', isPositive: false },
    { concepto: 'Cooling terceros', plan: '$62,400', real: '$71,200', delta: '+$8,800', isPositive: true },
    { concepto: 'Hielo all-in', plan: '$77,760', real: '$81,432', delta: '+$3,672', isPositive: true },
    { concepto: 'Repack', plan: '$24,442', real: '$23,180', delta: '-$1,262', isPositive: false },
    { concepto: '(–) Costos operativos + servicio máquinas', plan: '–$63,992', real: '–$65,110', delta: '–$1,118', isPositive: false },
    { concepto: '(–) Hielo blended (prod. + comprado)', plan: '–$44,640', real: '–$44,150 (54% propio)', delta: '+$490', isPositive: true },
    { concepto: '(–) Destajo repack', plan: '–$20,950', real: '–$19,870', delta: '+$1,080', isPositive: true },
  ];

  // KPI Cards data
  const kpiCards: KpiCard[] = [
    {
      label: 'Utilidad plan temporada',
      value: '$370,931 USD',
      sub: 'de PC-PRE',
      icon: IconCurrencyDollar,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Plan',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Real acumulado nov',
      value: '$54,300 USD',
      sub: 'volumen terceros fuerte',
      icon: IconChartBar,
      color: '#2D6BAE',
      bgColor: '#EFF6FF',
      badge: 'Real',
      badgeColor: 'blue',
      delay: 0.1,
    },
    {
      label: '% hielo propio real nov',
      value: '54%',
      sub: 'plan 50% — las máquinas rinden',
      icon: IconPercentage,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: '54% propio',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Costo hielo blended real',
      value: '$0.74/cj',
      sub: 'plan $0.775',
      icon: IconIceCream,
      color: '#2D8F5E',
      bgColor: '#ECFDF5',
      badge: 'Mejor que plan',
      badgeColor: 'green',
      delay: 0.2,
    },
  ];

  // Costos data para las barras
  const costosData = [
    { label: 'Renta', value: '$136K', progress: 85 },
    { label: 'Hielo comprado (50%)', value: '$125K', progress: 78 },
    { label: 'Nómina + finiquitos', value: '$107K', progress: 65 },
    { label: 'Hielo propio (energía)', value: '$65K', progress: 40 },
    { label: 'Mantenimiento + túnel + máquinas', value: '$50K', progress: 30 },
    { label: 'Admin + sanidad', value: '$23K', progress: 15 },
  ];

  // Ingresos para el doughnut
  const ingresosData = [
    { label: 'Cooling propio', value: '195,833', color: '#0D9488', percentage: 28 },
    { label: 'Cooling terceros', value: '312,000', color: '#3B82F6', percentage: 45 },
    { label: 'Hielo (margen blended)', value: '165,600', color: '#F59E0B', percentage: 24 },
    { label: 'Repack', value: '17,459', color: '#A855F7', percentage: 3 },
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
                <IconReceipt size={20} style={{ opacity: 0.8 }} />
                <Text fw={700} size="lg" c="white">
                  Grupo Produce First — Módulo Produce Cooling
                </Text>
                <Badge size="xs" variant="white" color="blue" radius="sm">
                  PC-PL
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
                    el hielo híbrido medido todos los días
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
                      <Text size="18px" fw={800} style={{ color: card.color, lineHeight: 1.2 }}>
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

          {/* SECCIÓN 1: P&L MENSUAL */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconChartBar size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    P&L mensual · plan vs real
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    Noviembre
                  </Badge>
                </Group>

                <Group gap="lg">
                  <Group gap={6}>
                    <Box w={10} h={10} bg="#CBD5E1" style={{ borderRadius: '50%' }} />
                    <Text size="xs" c="dimmed">Plan $K</Text>
                  </Group>
                  <Group gap={6}>
                    <Box w={10} h={10} bg="#1D4ED8" style={{ borderRadius: '50%' }} />
                    <Text size="xs" c="dimmed">Real $K</Text>
                  </Group>
                </Group>
              </Group>

              <Divider />

              {/* GRÁFICO TENDENCIA PLAN VS REAL (SVG) */}
              <Box style={{ width: '100%', height: 120, borderBottom: '1px solid #E5E7EB' }}>
                <svg width="100%" height="100%" viewBox="0 0 500 80" preserveAspectRatio="none">
                  {/* Línea Plan (Gris suave) */}
                  <path
                    d="M 30,30 L 130,22 L 230,12 L 330,20 L 430,32"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                  />
                  <circle cx="30" cy="30" r="3" fill="#CBD5E1" />
                  <circle cx="130" cy="22" r="3" fill="#CBD5E1" />
                  <circle cx="230" cy="12" r="3" fill="#CBD5E1" />
                  <circle cx="330" cy="20" r="3" fill="#CBD5E1" />
                  <circle cx="430" cy="32" r="3" fill="#CBD5E1" />

                  {/* Línea Real (Azul) */}
                  <path
                    d="M 30,20 L 130,62 L 230,62 L 330,62 L 430,62"
                    fill="none"
                    stroke="#1D4ED8"
                    strokeWidth="2.5"
                  />
                  <circle cx="30" cy="20" r="3.5" fill="#1D4ED8" />
                  <circle cx="130" cy="62" r="3.5" fill="#1D4ED8" />
                  <circle cx="230" cy="62" r="3.5" fill="#1D4ED8" />
                  <circle cx="330" cy="62" r="3.5" fill="#1D4ED8" />
                  <circle cx="430" cy="62" r="3.5" fill="#1D4ED8" />
                </svg>
                <Group justify="space-between" px="md" style={{ marginTop: -15 }}>
                  <Text size="10px" c="dimmed">Nov</Text>
                  <Text size="10px" c="dimmed">Dic</Text>
                  <Text size="10px" c="dimmed">Ene</Text>
                  <Text size="10px" c="dimmed">Feb</Text>
                  <Text size="10px" c="dimmed">Mar</Text>
                </Group>
              </Box>

              {/* TABLA P&L */}
              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>
                        Concepto (USD) · noviembre
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 120 }}>
                        Plan
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 150 }}>
                        Real
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 100 }}>
                        Δ
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {plData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.concepto}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>{row.plan}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>{row.real}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: row.isPositive ? '#16A34A' : '#DC2626' }}>
                          {row.delta}
                        </Table.Td>
                      </Table.Tr>
                    ))}

                    <Table.Tr style={{ backgroundColor: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                      <Table.Td style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>UTILIDAD NOV</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800 }}>$74,187</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800 }}>$85,102</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#16A34A' }}>
                        <Group gap={4} justify="flex-end">
                          <IconTrendingUp size={14} />
                          +$10,915
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Stack>
          </Paper>

          {/* SECCIÓN 2: LA FOTO DE LA TEMPORADA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconBuildingStore size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  La foto de la temporada
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Ingresos vs Costos
                </Badge>
              </Group>

              <Divider />

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" align="center">
                {/* DOUGHNUT CHART SVG (INGRESOS) */}
                <Group gap="lg" align="center">
                  <Box style={{ width: 140, height: 140, position: 'relative' }}>
                    <svg width="100%" height="100%" viewBox="0 0 42 42">
                      <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#E2E8F0" strokeWidth="6" />
                      {/* Segmento 1: Cooling propio (Teal) */}
                      <circle
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#0D9488"
                        strokeWidth="6"
                        strokeDasharray="28 72"
                        strokeDashoffset="25"
                      />
                      {/* Segmento 2: Cooling terceros (Azul) */}
                      <circle
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#3B82F6"
                        strokeWidth="6"
                        strokeDasharray="45 55"
                        strokeDashoffset="97"
                      />
                      {/* Segmento 3: Hielo (Naranja) */}
                      <circle
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#F59E0B"
                        strokeWidth="6"
                        strokeDasharray="24 76"
                        strokeDashoffset="52"
                      />
                      {/* Segmento 4: Repack (Morado) */}
                      <circle
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#A855F7"
                        strokeWidth="6"
                        strokeDasharray="3 97"
                        strokeDashoffset="28"
                      />
                    </svg>
                  </Box>

                  <Stack gap={4} style={{ flex: 1 }}>
                    {ingresosData.map((item, idx) => (
                      <Group key={idx} justify="space-between">
                        <Group gap={6}>
                          <Box w={8} h={8} bg={item.color} style={{ borderRadius: 2 }} />
                          <Text size="11px" c="gray.7">{item.label}</Text>
                        </Group>
                        <Text size="11px" fw={700}>{item.value}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Group>

                {/* BARRAS DE COSTOS */}
                <Stack gap="xs">
                  {costosData.map((item, idx) => (
                    <Box key={idx}>
                      <Group justify="space-between" mb={2}>
                        <Text size="11px" c="gray.7">{item.label}</Text>
                        <Text size="11px" fw={700}>{item.value}</Text>
                      </Group>
                      <Progress value={item.progress} color="red.8" size="sm" radius="xl" />
                    </Box>
                  ))}
                </Stack>
              </SimpleGrid>
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
                <strong>✓ Al guardar:</strong> si el % de hielo propio baja del 50%, el costo blended sube y esta pantalla lo grita — la causa está en la bitácora de producción (PC-4) o en la falla de la máquina (PC-MTO).
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}