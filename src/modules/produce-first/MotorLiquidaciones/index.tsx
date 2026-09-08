// src/modules/produce-first/PF8_MotorLiquidaciones.tsx

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
  Button,
  SegmentedControl,
  SimpleGrid,
  Badge,
  ThemeIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconSettings,
  IconSearch,
  IconReceipt,
  IconCheck,
  IconFileSpreadsheet,
  IconInfoCircle,
  IconUsers,
  IconCurrencyDollar,
  IconPackage,
  IconTruck,
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

interface GeneracionItem {
  camion: string;
  factura: string;
  boleta: string;
  cliente: string;
  vegetal: string;
  cajas: number;
  precio: number;
  venta: number;
  comision: number;
}

interface RetornoBoletaItem {
  boleta: string;
  fCosecha: string;
  cajas: number;
  venta: number;
  descuentos: number;
  retornoNeto: number;
  netoCaja: number;
}

interface DescuentoItem {
  concepto: string;
  origen: string;
  monto: string;
}

interface EstatusItem {
  id: string;
  productor: string;
  cajas: string;
  venta: string;
  neto: string;
  estatus: string;
  color: string;
}

export function MotorLiquidacionesPFView() {
  // --- Estados Filtros ---
  const [filtroProductor, setFiltroProductor] = useState<string | null>('Todos');
  const [filtroEstatus, setFiltroEstatus] = useState<string | null>('Todas');
  const [vistaPeriodo, setVistaPeriodo] = useState('Semana');

  // --- Datos Mock GENERAR · Liquidación de Agrícola JAV ---
  const generacionData: GeneracionItem[] = [
    { camion: '25', factura: 'F-1660', boleta: 'JAV-0508', cliente: 'Fresh Direct', vegetal: 'Bok Choy Mieu', cajas: 180, precio: 20.00, venta: 3600, comision: 360 },
    { camion: '26', factura: 'F-1661', boleta: 'JAV-0509', cliente: 'HJ Produce West', vegetal: 'Bok Choy Mieu', cajas: 360, precio: 19.00, venta: 6840, comision: 684 },
    { camion: '27', factura: 'F-1663', boleta: 'JAV-0510', cliente: 'Greenleaf', vegetal: 'Bok Choy Mieu', cajas: 450, precio: 17.06, venta: 7677, comision: 768 },
    { camion: '28', factura: 'F-1664', boleta: 'JAV-0511', cliente: 'Greenleaf', vegetal: 'Bok Choy Mieu', cajas: 405, precio: 17.06, venta: 6909, comision: 691 },
    { camion: '29', factura: 'F-1665', boleta: 'JAV-0512', cliente: 'Grubmarket', vegetal: 'Bok Choy Mieu', cajas: 315, precio: 19.00, venta: 5985, comision: 599 },
  ];

  // --- Datos Mock El retorno por boleta ---
  const retornoBoletaData: RetornoBoletaItem[] = [
    { boleta: 'JAV-0508', fCosecha: '10-nov', cajas: 180, venta: 3600, descuentos: -1832, retornoNeto: 1768, netoCaja: 9.82 },
    { boleta: 'JAV-0510', fCosecha: '12-nov', cajas: 450, venta: 7677, descuentos: -3905, retornoNeto: 3772, netoCaja: 8.38 },
    { boleta: 'JAV-0512', fCosecha: '14-nov', cajas: 315, venta: 5985, descuentos: -3045, retornoNeto: 2940, netoCaja: 9.33 },
    { boleta: '(+ 2 boletas más)', fCosecha: '', cajas: 765, venta: 13749, descuentos: -6662, retornoNeto: 7087, netoCaja: 9.26 },
  ];

  // --- Datos Mock Descuentos automáticos ---
  const descuentosData: DescuentoItem[] = [
    { concepto: 'Comisión 10%', origen: 'concepto 1 · sobre venta', monto: '-$3,101' },
    { concepto: 'Enfriado $0.15/cj × 1,710', origen: 'concepto 2 · SA/LE/Fernando', monto: '-$257' },
    { concepto: 'Material de empaque · $44.60 × 1,710', origen: 'PF-MAT · tarifa vigente', monto: '-$4,359 USD eq.' },
    { concepto: 'Anticipos ya pagados · $3.50 × 1,710', origen: 'ESC-1 recepciones', monto: '-$5,985' },
    { concepto: 'Semilla financiada (parcialidad 2 de 4)', origen: 'cuenta corriente', monto: '-$3,000' },
    { concepto: 'Gastos trasladables prorrateados (aduanas, exam)', origen: 'PF-9 · check trasladable', monto: '-$742' },
  ];

  // --- Datos Mock Estatus de liquidaciones ---
  const estatusData: EstatusItem[] = [
    { id: 'LIQ-201226', productor: 'Agrícola JAV', cajas: '1,710', venta: '$31,011', neto: '$13,567', estatus: 'por pagar viernes', color: 'blue' },
    { id: 'LIQ-201224', productor: 'Daniel Zermeño', cajas: '2,140', venta: '$38,900', neto: '$19,240', estatus: 'pagada ✓', color: 'green' },
    { id: 'LIQ-201223', productor: 'Fernando (Tips) · 10% + enfriado', cajas: '1,340', venta: '$28,140', neto: '$24,530', estatus: 'pagada ✓', color: 'green' },
    { id: 'LIQ-201220', productor: 'Plantisano', cajas: '480', venta: '$8,930', neto: 'retenida $310', estatus: 'disputada', color: 'red' },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Liquidación en Proceso',
      value: 'LIQ-201226 · JAV',
      sub: 'se genera, no se captura',
      icon: IconSettings,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Automática',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Trazabilidad Completa',
      value: '# de boleta en cada renglón',
      sub: 'viaja desde la proforma (PF-5)',
      icon: IconSearch,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Auditable',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Dos Conceptos',
      value: 'comisión 10% + enfriado $0.15',
      sub: 'por separado',
      icon: IconReceipt,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Separados',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Pago de Viernes',
      value: '4 productores · $61,400 USD',
      sub: 'semana actual',
      icon: IconCurrencyDollar,
      color: '#1864AB',
      bgColor: '#E7F5FF',
      badge: 'Semana',
      badgeColor: 'blue',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-8 */}
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
                    PF-8 · Motor de Liquidaciones
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconUsers size={14} />
                    Productores
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconFileSpreadsheet size={14} />
                    Liquidaciones
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

          {/* SECCIÓN 1: GENERAR LIQUIDACIÓN */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconSettings size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Generar · Liquidación de Agrícola JAV · Semana 47
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Automática
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '1000px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}># Camión</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Factura</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}># Boleta Cosecha</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cliente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Vegetal</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Precio</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Venta</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Comisión 10%</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {generacionData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.camion}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 500, color: '#1A3A5C' }}>
                          {row.factura}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 700, color: '#1A4B8C' }}>
                          <Badge size="xs" color="yellow" variant="light" style={{ backgroundColor: '#FEF9C3' }}>
                            {row.boleta}
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.cliente}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.vegetal}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.cajas}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          ${row.precio.toFixed(2)}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          ${row.venta.toLocaleString()}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          ${row.comision}
                        </Table.Td>
                      </Table.Tr>
                    ))}

                    {/* FILA RESUMEN TOTAL */}
                    <Table.Tr style={{ backgroundColor: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                      <Table.Td colSpan={5} style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>
                        5 camiones
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#111827' }}>
                        1,710
                      </Table.Td>
                      <Table.Td></Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#1A4B8C' }}>
                        $31,011
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#111827' }}>
                        $3,101
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                cada renglón camión-factura trae su <strong># de boleta de cosecha</strong> — 
                el enlace nació en la proforma y el productor ve su retorno boleta por boleta
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 2: EL RETORNO POR BOLETA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconSearch size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  El Retorno por Boleta · Lo que el Productor Recibe
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Trazabilidad
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '800px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}># Boleta</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>F. Cosecha</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Venta</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Descuentos
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Retorno Neto
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Neto / Caja
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {retornoBoletaData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.boleta}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.fCosecha}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.cajas}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          ${row.venta.toLocaleString()}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#DC2626', fontWeight: 600 }}>
                          -${Math.abs(row.descuentos).toLocaleString()}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#1F5C3A' }}>
                          ${row.retornoNeto.toLocaleString()}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#1A4B8C' }}>
                          ${row.netoCaja.toFixed(2)}
                        </Table.Td>
                      </Table.Tr>
                    ))}

                    {/* TOTAL */}
                    <Table.Tr style={{ backgroundColor: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                      <Table.Td style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>TOTAL</Table.Td>
                      <Table.Td></Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#111827' }}>
                        1,710
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#1A4B8C' }}>
                        $31,011
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#DC2626' }}>
                        -$17,444
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#1F5C3A' }}>
                        $13,567
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#1A4B8C' }}>
                        $7.93
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                la misma liquidación, agrupada por su boleta de cosecha: cuánto regresó cada corte
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 3: DESCUENTOS AUTOMÁTICOS */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconReceipt size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Descuentos Automáticos · de la Cuenta Corriente (PF-7)
                </Text>
                <Badge size="xs" color="yellow" variant="light" radius="sm">
                  Origen Auditado
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Origen</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Monto</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {descuentosData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                          {row.concepto}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.origen}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#DC2626', fontWeight: 600 }}>
                          {row.monto}
                        </Table.Td>
                      </Table.Tr>
                    ))}

                    <Table.Tr style={{ backgroundColor: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                      <Table.Td style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>NETO A PAGAR</Table.Td>
                      <Table.Td></Table.Td>
                      <Table.Td style={{ fontSize: '16px', textAlign: 'right', fontWeight: 900, color: '#1F5C3A' }}>
                        $13,567 USD
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Divider />

              <Group>
                <Button
                  leftSection={<IconCheck size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                >
                  Emitir liquidación LIQ-201226 → pago viernes
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                nadie los teclea: cada uno con folio de origen
              </Text>
            </Stack>
          </Paper>

          {/* Callout Informativo Intermedio */}
          <Paper
            p="sm"
            radius="lg"
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
            }}
          >
            <Group align="flex-start" gap="xs">
              <IconCheck size={18} color="#16A34A" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text size="xs" c="#15803D" style={{ flex: 1, lineHeight: 1.5 }}>
                <strong>✓ Al guardar:</strong> la cadena completa: <strong>boleta de cosecha → recepción (ESC-1) → 
                proforma (PF-5) → factura → liquidación → retorno por boleta</strong> · cada liquidación emitida 
                escribe sus renglones en el <strong>Registro de Liquidaciones (PF-REG)</strong> — el productor 
                concilia renglón por renglón con su G-15 · los dos conceptos siempre por separado.
              </Text>
            </Group>
          </Paper>

          {/* SECCIÓN 4: LIQUIDACIONES DE LA SEMANA / ESTATUS */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconFileSpreadsheet size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Liquidaciones de la Semana · Estatus
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    {estatusData.length} registros
                  </Badge>
                </Group>

                <Group gap="md">
                  <Select
                    label="Productor"
                    value={filtroProductor}
                    onChange={setFiltroProductor}
                    data={['Todos', 'Agrícola JAV', 'Daniel Zermeño', 'Fernando (Tips)', 'Plantisano']}
                    size="xs"
                    w={130}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Estatus"
                    value={filtroEstatus}
                    onChange={setFiltroEstatus}
                    data={['Todas', 'por pagar viernes', 'pagada ✓', 'disputada']}
                    size="xs"
                    w={130}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <SegmentedControl
                    value={vistaPeriodo}
                    onChange={setVistaPeriodo}
                    data={['Semana', 'Mes']}
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
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Liquidación</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Productor</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Venta</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Neto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Estatus</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {estatusData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.id}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.productor}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.cajas}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.venta}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1F5C3A' }}>
                          {row.neto}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge size="xs" color={row.color} variant="light">
                            {row.estatus}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
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
                <strong>✓ PF-8:</strong> el motor de liquidaciones toma las proformas confirmadas (PF-5) y 
                aplica automáticamente los descuentos de la cuenta corriente (PF-7) para generar el pago 
                al productor · la liquidación es auditada boleta por boleta.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}