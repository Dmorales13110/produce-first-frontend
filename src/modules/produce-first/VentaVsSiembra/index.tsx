// src/modules/produce-first/PF2_ProgramaVentasSiembra.tsx

import React, { useState, useEffect } from 'react';
import { api } from '../../../services/apiClient';
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
  ThemeIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconShoppingCart,
  IconPlant,
  IconChartLine,
  IconAlertTriangle,
  IconCalendar,
  IconUsers,
  IconPackage,
  IconTrendingUp,
  IconTrendingDown,
  IconInfoCircle,
  IconBuildingStore,
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

interface VentaItem {
  cliente: string;
  producto: string;
  s45: number;
  s46: number;
  s47: number;
  s48: number;
  s49: number;
  s50: number;
}

interface SiembraItem {
  productor: string;
  ubicacion: string;
  producto: string;
  ha: string;
  fecha: string;
  semillas: string;
  cosecha: string;
}

interface GapItem {
  semana: string;
  demanda: string;
  oferta: string;
  gap: string;
  accion: string;
  color: string;
}

export function ProgramaVentasSiembraView() {
  // --- Filtros ---
  const [filtroCliente, setFiltroCliente] = useState<string | null>('Todos');
  const [filtroProducto, setFiltroProducto] = useState<string | null>('Todos');
  const [vistaTemporal, setVistaTemporal] = useState('Nov-Dic');

  // --- Datos de Respaldo Ventas ---
  const INITIAL_VENTAS: VentaItem[] = [
    { cliente: 'Fresh Direct', producto: 'Chinese Cauli', s45: 0, s46: 600, s47: 600, s48: 450, s49: 450, s50: 450 },
    { cliente: 'Fresh Direct', producto: 'Shanghai Mieu', s45: 700, s46: 1000, s47: 1200, s48: 950, s49: 950, s50: 1000 },
    { cliente: 'Grubmarket', producto: 'Chinese Cauli', s45: 0, s46: 200, s47: 600, s48: 500, s49: 500, s50: 500 },
    { cliente: 'GreenLeaf', producto: 'A Choy Sum', s45: 0, s46: 385, s47: 315, s48: 315, s49: 490, s50: 175 },
  ];

  // --- Datos de Respaldo Siembra ---
  const INITIAL_SIEMBRA: SiembraItem[] = [
    { productor: 'JC Álvarez (Agro SF)', ubicacion: '—', producto: 'Baby Napa', ha: '1.0', fecha: '16-feb-27', semillas: '139,650', cosecha: 'S14' },
    { productor: 'Rufino', ubicacion: '—', producto: 'Baby Bok (directa)', ha: '1.0', fecha: '03-mar-27', semillas: '468,000', cosecha: 'S17' },
    { productor: 'Ismael Padilla', ubicacion: 'Romita', producto: 'Coliflor China', ha: '1.4', fecha: '04-sep-26', semillas: '52,500', cosecha: 'S46 ✓' },
    { productor: 'Agrijiusa', ubicacion: 'Celaya', producto: 'Baby Napa', ha: '0.95', fecha: '15-sep-26', semillas: '139,650', cosecha: 'S45 ✓' },
  ];

  const [ventasData, setVentasData] = useState<VentaItem[]>(INITIAL_VENTAS);
  const [siembraData, setSiembraData] = useState<SiembraItem[]>(INITIAL_SIEMBRA);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      api.get<any[]>('/planting-schedules'),
      api.get<any[]>('/sales'),
    ]).then(([siembraRes, ventasRes]) => {
      if (!isMounted) return;

      if (siembraRes.status === 'fulfilled' && Array.isArray(siembraRes.value) && siembraRes.value.length > 0) {
        const mappedSiembra: SiembraItem[] = siembraRes.value.map((ps: any) => ({
          productor: ps.grower_name || ps.grower?.commercial_name || 'Productor',
          ubicacion: ps.location || ps.rancho || 'Bajío',
          producto: ps.product_name || ps.variety || 'Vegetal',
          ha: String(ps.hectares || '1.0'),
          fecha: ps.planting_date ? new Date(ps.planting_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '—',
          semillas: Number(ps.seed_quantity || 120000).toLocaleString(),
          cosecha: ps.expected_harvest_date ? new Date(ps.expected_harvest_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : 'S48',
        }));
        setSiembraData(mappedSiembra);
      }

      if (ventasRes.status === 'fulfilled' && Array.isArray(ventasRes.value) && ventasRes.value.length > 0) {
        const mappedVentas: VentaItem[] = ventasRes.value.map((s: any) => ({
          cliente: s.customer_name || s.customer || 'Cliente',
          producto: s.product_name || s.variety || 'Vegetal',
          s45: Number(s.s45 || 0),
          s46: Number(s.s46 || 300),
          s47: Number(s.s47 || 400),
          s48: Number(s.s48 || 450),
          s49: Number(s.s49 || 450),
          s50: Number(s.s50 || 500),
        }));
        setVentasData(mappedVentas);
      }
    });

    return () => { isMounted = false; };
  }, []);

  // --- Datos Mock Gaps ---
  const gapsData: GapItem[] = [
    { semana: 'S52 (21-dic)', demanda: '11,800', oferta: '11,000', gap: '-800', accion: 'coliflor: hablar con Zermeño', color: 'red' },
    { semana: 'CNY-2 (25-ene)', demanda: '19,600', oferta: '17,900', gap: '-1,700', accion: 'asegurar mieu con JAV', color: 'red' },
    { semana: 'S50', demanda: '10,200', oferta: '10,400', gap: '+200', accion: 'ok', color: 'gray' },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Demanda Comprometida S49',
      value: '9,800 cj',
      sub: '4 clientes · programa 26-27',
      icon: IconShoppingCart,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Comprometida',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Oferta Programada S49',
      value: '10,150 cj',
      sub: 'posturas de 10 productores',
      icon: IconPlant,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Programada',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Pico CNY',
      value: '20 ene – 1 feb',
      sub: '200% · embarcar con 6 días de anticipo',
      icon: IconCalendar,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Crítico',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Gap Crítico',
      value: 'S52 coliflor −800 cj',
      sub: 'hablar con Zermeño',
      icon: IconAlertTriangle,
      color: '#DC2626',
      bgColor: '#FEF2F2',
      badge: 'Atención',
      badgeColor: 'red',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-2 */}
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
                    PF-2 · Programa de Ventas vs Siembra
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconCalendar size={14} />
                    Planeación Comercial
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconAlertTriangle size={14} />
                    Gaps visibles semanas antes
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

          {/* SECCIÓN 1: PROGRAMA DE VENTAS */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconShoppingCart size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Captura · Programa de Ventas
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    Cliente × Producto × Semana
                  </Badge>
                </Group>

                <Group gap="md">
                  <Select
                    label="Cliente"
                    value={filtroCliente}
                    onChange={setFiltroCliente}
                    data={['Todos', 'Fresh Direct', 'Grubmarket', 'GreenLeaf']}
                    size="xs"
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Producto"
                    value={filtroProducto}
                    onChange={setFiltroProducto}
                    data={['Todos', 'Chinese Cauli', 'Shanghai Mieu', 'A Choy Sum']}
                    size="xs"
                    w={130}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <SegmentedControl
                    value={vistaTemporal}
                    onChange={setVistaTemporal}
                    data={['Nov-Dic', 'CNY', 'Temporada']}
                    size="xs"
                    color="blue"
                  />
                </Group>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '800px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cliente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Producto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>S45</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>S46</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>S47</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>S48</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>S49</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>S50</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {ventasData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>{row.cliente}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.producto}</Table.Td>
                        <Table.Td style={{ textAlign: 'center', backgroundColor: '#FEF9C3', fontSize: '12px', fontWeight: 600 }}>
                          {row.s45}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center', backgroundColor: '#FEF9C3', fontSize: '12px', fontWeight: 600 }}>
                          {row.s46}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center', backgroundColor: '#FEF9C3', fontSize: '12px', fontWeight: 600 }}>
                          {row.s47}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center', backgroundColor: '#FEF9C3', fontSize: '12px', fontWeight: 600 }}>
                          {row.s48}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center', backgroundColor: '#FEF9C3', fontSize: '12px', fontWeight: 600 }}>
                          {row.s49}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center', backgroundColor: '#FEF9C3', fontSize: '12px', fontWeight: 600 }}>
                          {row.s50}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="11px" c="dimmed">+ 22 renglones más...</Text>
              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                tu matriz real (100% = pedido normal semanal) · amarillo = cajas comprometidas
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 2: PROGRAMA DE SIEMBRA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconPlant size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Captura · Programa de Siembra Multi-productor
                </Text>
                <Badge size="xs" color="green" variant="light" radius="sm">
                  Posturas
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '800px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Productor</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Ubicación</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Producto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Ha</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Fecha Siembra
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Semillas/ha
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>
                        Cosecha Est.
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {siembraData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>{row.productor}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.ubicacion}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.producto}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>{row.ha}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'center', color: '#374151' }}>{row.fecha}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>{row.semillas}</Table.Td>
                        <Table.Td>
                          <Badge 
                            size="xs" 
                            color={row.cosecha.includes('✓') ? 'green' : 'gray'} 
                            variant="light"
                          >
                            {row.cosecha}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="11px" c="dimmed">+ 180 posturas más...</Text>
              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                tu Programa General: cada postura externa con productor, ha, población y fecha — la oferta futura
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 3: OFERTA VS DEMANDA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconChartLine size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Resultado · Oferta vs Demanda por Semana
                </Text>
                <Badge size="xs" color="red" variant="light" radius="sm">
                  Gaps Críticos
                </Badge>
              </Group>

              <Divider />

              {/* GRÁFICO SVG DUAL */}
              <Box style={{ height: 120, width: '100%' }}>
                <svg width="100%" height="100%" viewBox="0 0 500 100" preserveAspectRatio="none">
                  {/* Línea Demanda */}
                  <path d="M 40,65 L 110,63 L 180,62 L 250,65 L 320,30 L 410,15 L 470,15" fill="none" stroke="#94A3B8" strokeWidth="2.5" />
                  <circle cx="40" cy="65" r="3.5" fill="#94A3B8" />
                  <circle cx="110" cy="63" r="3.5" fill="#94A3B8" />
                  <circle cx="180" cy="62" r="3.5" fill="#94A3B8" />
                  <circle cx="250" cy="65" r="3.5" fill="#94A3B8" />
                  <circle cx="320" cy="30" r="3.5" fill="#94A3B8" />
                  <circle cx="410" cy="15" r="3.5" fill="#94A3B8" />
                  <circle cx="470" cy="15" r="3.5" fill="#94A3B8" />

                  {/* Línea Oferta */}
                  <path d="M 40,65 L 110,64 L 180,63 L 250,65 L 320,38 L 410,25 L 470,25" fill="none" stroke="#854D0E" strokeWidth="2.5" />
                  <circle cx="40" cy="65" r="3.5" fill="#854D0E" />
                  <circle cx="110" cy="64" r="3.5" fill="#854D0E" />
                  <circle cx="180" cy="63" r="3.5" fill="#854D0E" />
                  <circle cx="250" cy="65" r="3.5" fill="#854D0E" />
                  <circle cx="320" cy="38" r="3.5" fill="#854D0E" />
                  <circle cx="410" cy="25" r="3.5" fill="#854D0E" />
                  <circle cx="470" cy="25" r="3.5" fill="#854D0E" />

                  {/* Eje X */}
                  <text x="40" y="92" textAnchor="middle" fontSize="9" fill="#64748B">S48</text>
                  <text x="110" y="92" textAnchor="middle" fontSize="9" fill="#64748B">S49</text>
                  <text x="180" y="92" textAnchor="middle" fontSize="9" fill="#64748B">S50</text>
                  <text x="250" y="92" textAnchor="middle" fontSize="9" fill="#64748B">S51</text>
                  <text x="320" y="92" textAnchor="middle" fontSize="9" fill="#64748B">S52</text>
                  <text x="410" y="92" textAnchor="middle" fontSize="9" fill="#64748B">CNY-1</text>
                  <text x="470" y="92" textAnchor="middle" fontSize="9" fill="#64748B">CNY-2</text>
                </svg>
              </Box>

              <Group justify="flex-end" gap="xl">
                <Group gap={6}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#94A3B8', borderRadius: 2 }} />
                  <Text size="11px" c="dimmed">Demanda cj</Text>
                </Group>
                <Group gap={6}>
                  <Box style={{ width: 10, height: 10, backgroundColor: '#854D0E', borderRadius: 2 }} />
                  <Text size="11px" c="dimmed">Oferta cj</Text>
                </Group>
              </Group>

              {/* TABLA DE GAPS */}
              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Semana</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Demanda</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Oferta</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Gap</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Acción</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {gapsData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>{row.semana}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>{row.demanda}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>{row.oferta}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: row.color === 'red' ? '#DC2626' : '#4B5563' }}>
                          {row.gap}
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            size="xs"
                            color={row.color}
                            variant="light"
                          >
                            {row.accion}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                se recalcula al tocar cualquiera de las dos capturas — aquí ves el hueco antes de que sea problema
              </Text>
            </Stack>
          </Paper>

          {/* Callout Informativo Final */}
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
                <strong>✓ PF-2:</strong> la demanda y la oferta se encuentran aquí — el gap se ve semanas antes, 
                no el viernes del embarque. Alimenta PF-3 (Pronóstico) y PF-4 (Planificador de Carga).
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}