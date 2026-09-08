// src/modules/produce-first/PFDASH_DashboardProduceFirst.tsx

import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Text,
  Group,
  Stack,
  Table,
  Button,
  SimpleGrid,
  Select,
  Progress,
  Badge,
  ScrollArea,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconClock,
  IconChartBar,
  IconAdjustmentsHorizontal,
  IconReceipt2,
  IconCalendarTime,
  IconAlertCircle,
  IconInfoCircle,
  IconTruck,
  IconCurrencyDollar,
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconFileInvoice,
  IconCalendar,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

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

interface RetornoMatrizItem {
  cultivo: string;
  freshDirect: string;
  grubmarket: string;
  greenleaf: string;
  manley: string;
  luckyTaro: string;
  promedio: string;
}

interface CamionBarItem {
  cam: string;
  monto: string;
  isNegative: boolean;
}

interface DeudaCobroItem {
  concepto: string;
  monto: string;
  vivo: string;
  vencido: string;
  nota: string;
  notaColor: string;
}

interface DiasPagoItem {
  cliente: string;
  dias: number;
  text: string;
  isAlert: boolean;
}

export function DashboardProduceFirstView() {
  // --- Estados de Filtros Matriz Cultivo x Cliente ---
  const [cultivoFilter, setCultivoFilter] = useState<string | null>('Todos');
  const [clienteFilter, setClienteFilter] = useState<string | null>('Todos');
  const [productorFilter, setProductorFilter] = useState<string | null>('Todos');
  const [rangoRetorno, setRangoRetorno] = useState<'Temporada' | 'Ult4Sem'>('Temporada');

  // --- Estados de Filtros Mayores Costos ---
  const [categoriaCostos, setCategoriaCostos] = useState<string | null>('Todas');
  const [proveedorCostos, setProveedorCostos] = useState<string | null>('Todos');
  const [rangoCostos, setRangoCostos] = useState<'Mes' | 'Temporada'>('Mes');

  // --- Datos Mock Matriz Retorno Promedio ---
  const retornoMatrizData: RetornoMatrizItem[] = [
    { cultivo: 'Baby Bok Choy', freshDirect: '$9.86', grubmarket: '$9.40', greenleaf: '$8.72', manley: '$10.12', luckyTaro: '—', promedio: '$9.44' },
    { cultivo: 'Shanghai Bok', freshDirect: '$8.90', grubmarket: '$7.62', greenleaf: '$7.85', manley: '$8.93', luckyTaro: '$6.41 ⚠', promedio: '$7.94' },
    { cultivo: 'Shanghai Mieu', freshDirect: '$7.61', grubmarket: '$7.20', greenleaf: '$8.05', manley: '—', luckyTaro: '—', promedio: '$7.55' },
    { cultivo: 'Snow Pea Tips (P.Fijo)', freshDirect: '—', grubmarket: '$10.31', greenleaf: '$10.31', manley: '$10.31', luckyTaro: '—', promedio: '$10.31' },
    { cultivo: 'Yu Choy', freshDirect: '—', grubmarket: '—', greenleaf: '$9.12', manley: '—', luckyTaro: '—', promedio: '$9.12' },
  ];

  // --- Datos Mock Utilidad por Camión ---
  const camionesBarData: CamionBarItem[] = [
    { cam: 'C1', monto: '$1,643', isNegative: false },
    { cam: 'C2', monto: '$1,809', isNegative: false },
    { cam: 'C3', monto: '$1,513', isNegative: false },
    { cam: 'C4', monto: '$2,025', isNegative: false },
    { cam: 'C5', monto: '$1,243', isNegative: false },
    { cam: 'C6', monto: '$3,402', isNegative: false },
    { cam: 'C7', monto: '$1,296', isNegative: false },
    { cam: 'C8', monto: '−$430', isNegative: true },
    { cam: 'C9', monto: '$1,319', isNegative: false },
    { cam: 'C10', monto: '$2,247', isNegative: false },
  ];

  // --- Datos Mock Cuánto se Debe y Cuánto hay por Cobrar ---
  const deudasCobrosData: DeudaCobroItem[] = [
    {
      concepto: 'Por cobrar (clientes)',
      monto: '$36,140 USD',
      vivo: '3 facturas',
      vencido: '$14,820 · Grubmarket 6d',
      nota: 'Llamar',
      notaColor: 'red',
    },
    {
      concepto: 'Se debe (proveedores)',
      monto: '$18,060 USD eq.',
      vivo: '5 facturas',
      vencido: '$1,050 · Refacciones',
      nota: 'al corriente',
      notaColor: 'gray',
    },
    {
      concepto: 'Saldos a favor de clientes',
      monto: '$219,000 USD',
      vivo: 'FD $136K + GM $83K',
      vencido: 'compensándose en facturas',
      nota: 'en curso',
      notaColor: 'blue',
    },
    {
      concepto: 'Deuda bancaria (GRP-1)',
      monto: '$260,000 USD',
      vivo: 'Santander + BanBajío',
      vencido: 'calendario en GRP-1',
      nota: '',
      notaColor: 'gray',
    },
  ];

  // --- Datos Mock Días Promedio de Pago por Cliente ---
  const diasPagoClienteData: DiasPagoItem[] = [
    { cliente: 'GreenLeaf', dias: 14, text: '14d', isAlert: false },
    { cliente: 'Fresh Direct', dias: 15, text: '15d', isAlert: false },
    { cliente: 'Manley', dias: 16, text: '16d', isAlert: false },
    { cliente: 'Tay Shing', dias: 16, text: '16d', isAlert: false },
    { cliente: 'Lucky Taro', dias: 19, text: '19d', isAlert: false },
    { cliente: 'Grubmarket', dias: 24, text: '24d ⚠', isAlert: true },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Camiones de la Temporada',
      value: '10',
      sub: '9 con utilidad · 1 con pérdida · $1,425 prom/camión',
      icon: IconTruck,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Activos',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Utilidad Acumulada vs Esperada',
      value: '$14,247 / $16,000',
      sub: '89% del pronóstico a la fecha',
      icon: IconTrendingUp,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: '89%',
      badgeColor: 'yellow',
      delay: 0.1,
    },
    {
      label: 'Ventas Acumuladas vs Esperadas',
      value: '$131,206 / $138,600',
      sub: '95% del pronóstico a la fecha',
      icon: IconCurrencyDollar,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: '95%',
      badgeColor: 'green',
      delay: 0.15,
    },
    {
      label: 'Posición Neta CxC − CxP',
      value: '+$18,080 USD',
      sub: 'CxC (PF-6) − CxP (PF-9)',
      icon: IconFileInvoice,
      color: '#1864AB',
      bgColor: '#E7F5FF',
      badge: 'Neta',
      badgeColor: 'blue',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-DASH */}
          <Paper
            p="lg"
            radius="lg"
            withBorder
            style={{
              borderColor: '#E8E5DC',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <ThemeIcon size="lg" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
                  <IconBuildingStore size={24} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="20px" fw={800} c="#1A3A5C">
                    PF-DASH · Dashboard de Produce First
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconChartBar size={14} />
                    Resultado
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconClock size={14} />
                    Tiempo Real
                  </Group>
                </Badge>
              </Group>
            </Group>
          </Paper>

          {/* 4 KPI Cards */}
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
                  Cómo Vamos Contra el Tiempo
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Semana 4 de 22
                </Badge>
              </Group>

              <Divider />

              {/* BARRA PROGRESO TEMPORADA */}
              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" fw={600} c="dimmed">Tiempo de temporada transcurrido</Text>
                  <Text size="xs" fw={700} c="#1A3A5C">18%</Text>
                </Group>
                <Progress value={18} color="amber" size="sm" radius="xl" />
              </Box>

              {/* PROGRESO VENTAS Y UTILIDAD */}
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Paper p="xs" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E7EB' }} radius="sm">
                  <Group justify="space-between" mb={4}>
                    <Text size="xs" fw={600} c="dimmed">Ventas vs pronóstico a la fecha</Text>
                    <Text size="xs" fw={700} c="#1A3A5C">$131,206 de $138,600</Text>
                  </Group>
                  <Progress value={95} color="#854D0E" size="md" radius="sm" />
                  <Text size="11px" ta="right" fw={700} c="amber.9" mt={2}>95%</Text>
                </Paper>

                <Paper p="xs" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E7EB' }} radius="sm">
                  <Group justify="space-between" mb={4}>
                    <Text size="xs" fw={600} c="dimmed">Utilidad vs pronóstico a la fecha</Text>
                    <Text size="xs" fw={700} c="#1A3A5C">$14,247 de $16,000</Text>
                  </Group>
                  <Progress value={89} color="#B45309" size="md" radius="sm" />
                  <Text size="11px" ta="right" fw={700} c="amber.9" mt={2}>89%</Text>
                </Paper>
              </SimpleGrid>

              {/* GRÁFICO TENDENCIA SVG */}
              <Paper p="sm" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E7EB' }} radius="sm">
                <Box style={{ height: 80, width: '100%' }}>
                  <svg width="100%" height="100%" viewBox="0 0 400 60" preserveAspectRatio="none">
                    {/* Línea Ventas */}
                    <path d="M 30,45 L 120,35 L 210,25 L 300,15 L 370,30" fill="none" stroke="#854D0E" strokeWidth="2" />
                    <circle cx="30" cy="45" r="3" fill="#854D0E" />
                    <circle cx="120" cy="35" r="3" fill="#854D0E" />
                    <circle cx="210" cy="25" r="3" fill="#854D0E" />
                    <circle cx="300" cy="15" r="3" fill="#854D0E" />
                    <circle cx="370" cy="30" r="3" fill="#854D0E" />

                    {/* Línea Utilidad */}
                    <path d="M 30,48 L 120,40 L 210,30 L 300,20 L 370,35" fill="none" stroke="#B45309" strokeWidth="2" strokeDasharray="4 3" />
                    <circle cx="30" cy="48" r="3" fill="#B45309" />
                    <circle cx="120" cy="40" r="3" fill="#B45309" />
                    <circle cx="210" cy="30" r="3" fill="#B45309" />
                    <circle cx="300" cy="20" r="3" fill="#B45309" />
                    <circle cx="370" cy="35" r="3" fill="#B45309" />

                    {/* Eje X */}
                    <text x="30" y="56" textAnchor="middle" fontSize="9" fill="#94A3B8">S43</text>
                    <text x="120" y="56" textAnchor="middle" fontSize="9" fill="#94A3B8">S44</text>
                    <text x="210" y="56" textAnchor="middle" fontSize="9" fill="#94A3B8">S45</text>
                    <text x="300" y="56" textAnchor="middle" fontSize="9" fill="#94A3B8">S46</text>
                    <text x="370" y="56" textAnchor="middle" fontSize="9" fill="#94A3B8">S47</text>
                  </svg>
                </Box>
                <Group justify="flex-end" gap="md">
                  <Group gap={4}>
                    <Box style={{ width: 10, height: 10, backgroundColor: '#854D0E', borderRadius: 2 }} />
                    <Text size="10px" c="dimmed">Ventas</Text>
                  </Group>
                  <Group gap={4}>
                    <Box style={{ width: 10, height: 10, backgroundColor: '#B45309', borderRadius: 2 }} />
                    <Text size="10px" c="dimmed">Utilidad</Text>
                  </Group>
                </Group>
              </Paper>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                la pregunta del CFO: ¿el avance de venta y utilidad va al ritmo del calendario? · plan a-la-fecha, no plan total
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 2: UTILIDAD POR CAMIÓN */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconChartBar size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Utilidad por Camión
                </Text>
                <Badge size="xs" color="green" variant="light" radius="sm">
                  {camionesBarData.filter(b => !b.isNegative).length} positivos
                </Badge>
              </Group>

              <Divider />

              {/* BARRAS DE CAMIONES */}
              <Paper p="md" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E7EB' }} radius="sm">
                <Group justify="space-between" align="flex-end" style={{ height: 110 }}>
                  {camionesBarData.map((b) => (
                    <Stack key={b.cam} gap={4} align="center" style={{ flex: 1 }}>
                      <Text size="10px" fw={700} c={b.isNegative ? 'red.7' : 'dark.7'}>
                        {b.monto}
                      </Text>
                      <Box
                        style={{
                          width: '60%',
                          height: b.isNegative ? 16 : Math.max(20, (parseFloat(b.monto.replace(/[^0-9.-]/g, '')) / 100) * 2),
                          backgroundColor: b.isNegative ? '#EF4444' : '#B45309',
                          borderRadius: 2,
                          minHeight: b.isNegative ? 16 : 20,
                        }}
                      />
                      <Text size="10px" c="dimmed" fw={600}>{b.cam}</Text>
                    </Stack>
                  ))}
                </Group>
              </Paper>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                del registro (PF-REG) · la roja es el camión 8 · clic = sus renglones
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 3: RETORNO FINAL POR CULTIVO x CLIENTE */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconAdjustmentsHorizontal size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Retorno Final por Cultivo × Cliente
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    Con filtro
                  </Badge>
                </Group>

                <Group gap={4}>
                  <Button
                    size="xs"
                    variant={rangoRetorno === 'Temporada' ? 'filled' : 'default'}
                    onClick={() => setRangoRetorno('Temporada')}
                    style={{ 
                      backgroundColor: rangoRetorno === 'Temporada' ? '#1A4B8C' : undefined,
                      color: rangoRetorno === 'Temporada' ? '#FFFFFF' : '#374151',
                      fontSize: '11px',
                    }}
                  >
                    Temporada
                  </Button>
                  <Button
                    size="xs"
                    variant={rangoRetorno === 'Ult4Sem' ? 'filled' : 'default'}
                    onClick={() => setRangoRetorno('Ult4Sem')}
                    style={{ 
                      backgroundColor: rangoRetorno === 'Ult4Sem' ? '#1A4B8C' : undefined,
                      color: rangoRetorno === 'Ult4Sem' ? '#FFFFFF' : '#374151',
                      fontSize: '11px',
                    }}
                  >
                    Últ. 4 semanas
                  </Button>
                </Group>
              </Group>

              <Divider />

              {/* FILTROS MATRIZ */}
              <Group gap="xs">
                <Select
                  label="Cultivo"
                  size="xs"
                  value={cultivoFilter}
                  onChange={setCultivoFilter}
                  data={['Todos', 'Baby Bok Choy', 'Shanghai Bok', 'Shanghai Mieu', 'Snow Pea Tips', 'Yu Choy']}
                  w={130}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <Select
                  label="Cliente"
                  size="xs"
                  value={clienteFilter}
                  onChange={setClienteFilter}
                  data={['Todos', 'Fresh Direct', 'Grubmarket', 'Greenleaf', 'Manley', 'Lucky Taro']}
                  w={130}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <Select
                  label="Productor"
                  size="xs"
                  value={productorFilter}
                  onChange={setProductorFilter}
                  data={['Todos', 'Daily Veggies', 'EFW', 'Fernando García']}
                  w={130}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </Group>

              {/* TABLA MATRIZ */}
              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cultivo \ Cliente →</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Fresh Direct</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Grubmarket</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Greenleaf</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Manley</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Lucky Taro</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>PROMEDIO</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {retornoMatrizData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.cultivo}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.freshDirect}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.grubmarket}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.greenleaf}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.manley}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: row.luckyTaro.includes('⚠') ? '#DC2626' : '#4B5563', fontWeight: row.luckyTaro.includes('⚠') ? 700 : undefined }}>
                          {row.luckyTaro}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#1A4B8C' }}>
                          {row.promedio}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                Lucky Taro devuelve $6.41 en Shanghai Bok — $1.53 abajo del promedio: el dato para la llamada
              </Text>
              <Text size="xs" fw={600} c="#1A3A5C">
                el $/caja que regresa al productor después de todo — la tabla para negociar precios y elegir a quién mandarle qué
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 4: MAYORES COSTOS */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconReceipt2 size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Mayores Costos · por Categoría y Proveedor
                  </Text>
                  <Badge size="xs" color="yellow" variant="light" radius="sm">
                    Con filtro
                  </Badge>
                </Group>

                <Group gap={4}>
                  <Button
                    size="xs"
                    variant={rangoCostos === 'Mes' ? 'filled' : 'default'}
                    onClick={() => setRangoCostos('Mes')}
                    style={{ 
                      backgroundColor: rangoCostos === 'Mes' ? '#1A4B8C' : undefined,
                      color: rangoCostos === 'Mes' ? '#FFFFFF' : '#374151',
                      fontSize: '11px',
                    }}
                  >
                    Mes
                  </Button>
                  <Button
                    size="xs"
                    variant={rangoCostos === 'Temporada' ? 'filled' : 'default'}
                    onClick={() => setRangoCostos('Temporada')}
                    style={{ 
                      backgroundColor: rangoCostos === 'Temporada' ? '#1A4B8C' : undefined,
                      color: rangoCostos === 'Temporada' ? '#FFFFFF' : '#374151',
                      fontSize: '11px',
                    }}
                  >
                    Temporada
                  </Button>
                </Group>
              </Group>

              <Divider />

              {/* FILTROS COSTOS */}
              <Group gap="xs">
                <Select
                  label="Categoría"
                  size="xs"
                  value={categoriaCostos}
                  onChange={setCategoriaCostos}
                  data={['Todas', 'Transporte', 'Enfriamiento/Re-emp', 'Exportación', 'Empaque', 'Fito/Derecho']}
                  w={140}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <Select
                  label="Proveedor"
                  size="xs"
                  value={proveedorCostos}
                  onChange={setProveedorCostos}
                  data={['Todos', 'Fletes GTO', 'Produce Cooling', 'Joe Arévalo', 'Frescopack', 'J.P. Pacheco']}
                  w={140}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </Group>

              {/* BARRAS PARALELAS COSTOS */}
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                {/* POR CATEGORÍA */}
                <Stack gap="xs">
                  <Text size="12px" fw={600} c="#1A3A5C">Por Categoría</Text>
                  {[
                    { label: 'Transporte', val: 100, labelVal: '$5,980' },
                    { label: 'Enfriamiento/Re-emp', val: 60, labelVal: '$3,590' },
                    { label: 'Exportación', val: 32, labelVal: '$1,952' },
                    { label: 'Empaque', val: 20, labelVal: '$1,210' },
                    { label: 'Fito/Derecho', val: 8, labelVal: '$436' },
                  ].map((item) => (
                    <Group key={item.label} justify="space-between" wrap="nowrap">
                      <Text size="11px" style={{ width: 120, flexShrink: 0 }} fw={500} c="#4B5563">
                        {item.label}
                      </Text>
                      <Progress value={item.val} color="#DC2626" size="sm" style={{ flex: 1 }} radius="xl" />
                      <Text size="11px" fw={700} style={{ width: 50, textAlign: 'right' }} c="#1A3A5C">
                        {item.labelVal}
                      </Text>
                    </Group>
                  ))}
                </Stack>

                {/* POR PROVEEDOR */}
                <Stack gap="xs">
                  <Text size="12px" fw={600} c="#1A3A5C">Por Proveedor</Text>
                  {[
                    { label: 'Fletes GTO (Ricardo)', val: 100, labelVal: '$5,980' },
                    { label: 'Produce Cooling', val: 60, labelVal: '$3,590' },
                    { label: 'Joe Arévalo', val: 21, labelVal: '$1,283' },
                    { label: 'Frescopack', val: 20, labelVal: '$1,210' },
                    { label: 'J.P. Pacheco', val: 11, labelVal: '$669' },
                  ].map((item) => (
                    <Group key={item.label} justify="space-between" wrap="nowrap">
                      <Text size="11px" style={{ width: 130, flexShrink: 0 }} fw={500} c="#4B5563">
                        {item.label}
                      </Text>
                      <Progress value={item.val} color="#D97706" size="sm" style={{ flex: 1 }} radius="xl" />
                      <Text size="11px" fw={700} style={{ width: 50, textAlign: 'right' }} c="#1A3A5C">
                        {item.labelVal}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </SimpleGrid>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                del registro y la CxP — cada barra abre sus facturas
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 5: CUÁNTO SE DEBE Y CUÁNTO HAY POR COBRAR */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconAlertCircle size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Cuánto se Debe y Cuánto hay por Cobrar
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Resumen
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Monto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Vivo</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Vencido</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Nota</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {deudasCobrosData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.concepto}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#1A4B8C' }}>
                          {row.monto}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.vivo}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.vencido}</Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          {row.nota && (
                            <Badge size="xs" color={row.notaColor} variant="light">
                              {row.nota}
                            </Badge>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                las dos listas maestras, resumidas · el detalle vive en PF-6 y PF-9
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 6: DÍAS PROMEDIO DE PAGO POR CLIENTE */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconCalendarTime size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Días Promedio de Pago por Cliente
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Crédito 15d
                </Badge>
              </Group>

              <Divider />

              <Stack gap="xs">
                {diasPagoClienteData.map((item) => (
                  <Group key={item.cliente} justify="space-between" wrap="nowrap">
                    <Text size="11px" style={{ width: 120, flexShrink: 0 }} fw={600} c="#1A3A5C">
                      {item.cliente}
                    </Text>
                    <Progress
                      value={(item.dias / 30) * 100}
                      color={item.isAlert ? '#DC2626' : '#854D0E'}
                      size="md"
                      style={{ flex: 1 }}
                      radius="xl"
                    />
                    <Text size="11px" fw={700} c={item.isAlert ? 'red.7' : 'dark.7'} style={{ width: 50, textAlign: 'right' }}>
                      {item.text}
                    </Text>
                  </Group>
                ))}
              </Stack>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                del registro: fecha de depósito − fecha de factura · el crédito pactado es 15 días
              </Text>
            </Stack>
          </Paper>

          {/* Callout Informativo Final */}
          <Paper
            p="sm"
            radius="lg"
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
            }}
          >
            <Group align="flex-start" gap="xs">
              <IconInfoCircle size={18} color="#16A34A" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text size="xs" c="#15803D" style={{ flex: 1, lineHeight: 1.5 }}>
                <strong>✓ Al guardar:</strong> todo sale del registro (PF-REG), la CxC (PF-6) y la CxP (PF-9) — 
                cero capturas aquí · los filtros cruzan cultivo × cliente × productor × proveedor × periodo.
              </Text>
            </Group>
          </Paper>

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
                <strong>✓ PF-DASH:</strong> el dashboard de Produce First consolida toda la operación · 
                camiones, retornos por cultivo, costos, cobranza y días de pago · todo en tiempo real 
                desde las fuentes de datos operativos.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}