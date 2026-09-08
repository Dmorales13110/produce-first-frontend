// src/modules/produce-first/PF10_PresupuestoPyLPF.tsx

import React, { useState, useEffect } from 'react';
import { BudgetService } from '../../../services/budget';
import { PLService } from '../../../services/pl';
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
  TextInput,
  Badge,
  ThemeIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconCalculator,
  IconReceipt,
  IconChartBar,
  IconCalendar,
  IconDeviceAnalytics,
  IconDeviceFloppy,
  IconInfoCircle,
  IconCurrencyDollar,
  IconTrendingUp,
  IconTrendingDown,
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

interface PronosticoItem {
  fuente: string;
  cajas: string;
  fob: string;
  comision: string;
  enfriado: string;
  ingreso: string;
}

interface GastoItem {
  categoria: string;
  presupuesto: string;
  nota: string;
}

interface PyLItem {
  concepto: string;
  monto: string;
  esSubtotal: boolean;
}

interface CalendarioItem {
  fecha: string;
  pago: string;
  saldo: string;
  libre?: boolean;
}

export function PresupuestoPyLPFView() {
  // --- Estados de Captura / Pronóstico ---
  const [conceptoEnfriado, setConceptoEnfriado] = useState('$0.15 USD/cj');
  const [conceptoComision, setConceptoComision] = useState('10%');
  const [tcPlan, setTcPlan] = useState('17.68');

  // --- Datos de Respaldo Sección 1: Pronóstico de Ingresos ---
  const INITIAL_PRONOSTICO: PronosticoItem[] = [
    { fuente: 'Daily Veggies - San Aparicio', cajas: '151,140', fob: '$2,275,490', comision: '$227,550', enfriado: '$22,671', ingreso: '$250,221' },
    { fuente: 'Agrícola JAV - La Escondida', cajas: '152,422', fob: '$2,224,502', comision: '$222,450', enfriado: '$22,863', ingreso: '$245,313' },
    { fuente: 'Fernando García - Snow Pea Tips', cajas: '35,280', fob: '$470,282', comision: '$47,028', enfriado: '$5,292', ingreso: '$52,320' },
  ];

  // --- Datos de Respaldo Sección 2: Presupuesto Gastos de Operación ---
  const INITIAL_GASTOS: GastoItem[] = [
    { categoria: 'JFNO', presupuesto: '$84,500', nota: 'gasto operativo' },
    { categoria: 'Wendy', presupuesto: '$22,300', nota: '' },
    { categoria: 'Néstor', presupuesto: '$12,000', nota: 'gasto operativo' },
    { categoria: 'Oficina, sistema y bancos', presupuesto: '$38,200', nota: '' },
    { categoria: 'Otros', presupuesto: '$9,800', nota: '' },
  ];

  const [pronosticoData, setPronosticoData] = useState<PronosticoItem[]>(INITIAL_PRONOSTICO);
  const [gastosData, setGastosData] = useState<GastoItem[]>(INITIAL_GASTOS);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      BudgetService.getSeasons(),
      BudgetService.getCosts(),
      PLService.getSummary(),
    ]).then(([seasonsRes, costsRes]) => {
      if (!isMounted) return;

      if (costsRes.status === 'fulfilled' && Array.isArray(costsRes.value) && costsRes.value.length > 0) {
        const mappedGastos: GastoItem[] = costsRes.value.map((c: any) => ({
          categoria: c.concept || c.category || 'Gasto Operativo',
          presupuesto: `$${Number(c.budgeted || c.amount || 20000).toLocaleString()}`,
          nota: c.notes || 'presupuestado',
        }));
        setGastosData(mappedGastos);
      }
    });

    return () => { isMounted = false; };
  }, []);

  // --- Datos Mock Sección 3: Resultado P&L ---
  const pyLData: PyLItem[] = [
    { concepto: 'Ingreso comisión 10%', monto: '$497,028', esSubtotal: false },
    { concepto: 'Ingreso enfriado $0.15/cj', monto: '$50,826', esSubtotal: false },
    { concepto: '(−) Gastos de operación PF', monto: '−$166,800', esSubtotal: false },
    { concepto: 'UTILIDAD OPERATIVA PLAN', monto: '$381,054', esSubtotal: true },
    { concepto: '(−) Santander ($30,000 cada día 14 - último 14-oct)', monto: '−$120,000', esSubtotal: false },
    { concepto: '(−) Otros PF (a más tardar 30-ago, junto con PCA)', monto: '−$39,000', esSubtotal: false },
    { concepto: '(−) Devolución a clientes: FD $136K + GM $83K (se compensa en facturas)', monto: '−$219,000', esSubtotal: false },
    { concepto: 'POSICIÓN NETA PLAN · todo pagado', monto: '$3,054', esSubtotal: true },
  ];

  // --- Datos Mock Sección 4: Calendario Santander ---
  const calendarioSantander: CalendarioItem[] = [
    { fecha: '14-jul', pago: '$30,000', saldo: '$90,000' },
    { fecha: '14-ago', pago: '$30,000', saldo: '$60,000' },
    { fecha: '14-sep', pago: '$30,000', saldo: '$30,000' },
    { fecha: '14-oct', pago: '$30,000', saldo: '$0 · libre ✓', libre: true },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Pronóstico 26-27',
      value: 'dos conceptos por caja',
      sub: '10% comisión + $0.15 de enfriado',
      icon: IconCalculator,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Plan',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Ingreso Plan PF',
      value: '$547,854 USD',
      sub: '338,542 cajas · SA + LE + Fernando',
      icon: IconCurrencyDollar,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Ingreso',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Utilidad Plan PF',
      value: '$381,054 USD',
      sub: 'después de gastos de operación',
      icon: IconTrendingUp,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Utilidad',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Deuda de PF al Cierre',
      value: '$378,000 USD',
      sub: 'Santander $120K + otros $39K + clientes $219K',
      icon: IconTrendingDown,
      color: '#DC2626',
      bgColor: '#FEF2F2',
      badge: 'Pendiente',
      badgeColor: 'red',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-10 */}
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
                    PF-10 · Presupuesto y P&L de PF
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconCalculator size={14} />
                    Dinero PF
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconChartBar size={14} />
                    Presupuesto
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

          {/* SECCIÓN 1: CAPTURA · PRONÓSTICO DE INGRESOS */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconCalculator size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  1. Captura · Pronóstico de Ingresos
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Por concepto y fuente
                </Badge>
              </Group>

              <Divider />

              <Group gap="xl" mb="xs">
                <TextInput
                  label="Concepto enfriado"
                  value={conceptoEnfriado}
                  onChange={(e) => setConceptoEnfriado(e.currentTarget.value)}
                  size="xs"
                  w={140}
                  styles={{ 
                    label: { color: '#1A3A5C', fontWeight: 600 },
                    input: { backgroundColor: '#FEF9C3', fontWeight: 600 } 
                  }}
                />
                <TextInput
                  label="Concepto comisión"
                  value={conceptoComision}
                  onChange={(e) => setConceptoComision(e.currentTarget.value)}
                  size="xs"
                  w={140}
                  styles={{ 
                    label: { color: '#1A3A5C', fontWeight: 600 },
                    input: { backgroundColor: '#FEF9C3', fontWeight: 600 } 
                  }}
                />
                <TextInput
                  label="TC plan"
                  value={tcPlan}
                  onChange={(e) => setTcPlan(e.currentTarget.value)}
                  size="xs"
                  w={100}
                  styles={{ 
                    label: { color: '#1A3A5C', fontWeight: 600 },
                    input: { backgroundColor: '#FEF9C3', fontWeight: 600 } 
                  }}
                />
              </Group>

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '800px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Fuente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Cajas Plan
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        FOB Plan USD
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Comisión 10%
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Enfriado $0.15
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Ingreso PF
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {pronosticoData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 500, color: '#1A3A5C' }}>
                          {row.fuente}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.cajas}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.fob}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.comision}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.enfriado}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#1F5C3A' }}>
                          {row.ingreso}
                        </Table.Td>
                      </Table.Tr>
                    ))}

                    {/* TOTAL */}
                    <Table.Tr style={{ backgroundColor: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                      <Table.Td style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>TOTAL</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#111827' }}>
                        338,842
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#1A4B8C' }}>
                        $4,970,282
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#111827' }}>
                        $497,028
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#111827' }}>
                        $50,826
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 900, color: '#1F5C3A' }}>
                        $547,854
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                amarillo = tuyo · el <strong>enfriado $0.15/cj</strong> aplica a San Aparicio, La Escondida 
                y Fernando García (tips) · la <strong>comisión 10%</strong> es concepto aparte
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 2: CAPTURA · PRESUPUESTO DE GASTOS */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconReceipt size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  2. Captura · Presupuesto de Gastos de Operación
                </Text>
                <Badge size="xs" color="yellow" variant="light" radius="sm">
                  Gastos PF
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '500px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Categoría (USD)</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Presupuesto 26-27
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Nota</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {gastosData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 500, color: '#1A3A5C' }}>
                          {row.categoria}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.presupuesto}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.nota}</Table.Td>
                      </Table.Tr>
                    ))}
                    <Table.Tr style={{ backgroundColor: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                      <Table.Td style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>TOTAL GASTOS PF</Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#DC2626' }}>
                        $166,800
                      </Table.Td>
                      <Table.Td></Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Divider />

              <Group justify="space-between" align="center">
                <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                  fletes, empaque, aduanas y fito NO viven aquí son <strong>gastos trasladables al productor</strong> — 
                  se pagan en PF-9 y se descuentan al productor en PF-8, netos en cero por diseño
                </Text>

                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                >
                  Guardar presupuesto de PF
                </Button>
              </Group>
            </Stack>
          </Paper>

          {/* SECCIÓN 3: RESULTADO · P&L PLAN */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconChartBar size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  3. Resultado · P&L Plan 26-27
                </Text>
                <Badge size="xs" color="green" variant="light" radius="sm">
                  Hasta la última deuda
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '500px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto (USD)</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Plan 26-27
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {pyLData.map((row, idx) => (
                      <Table.Tr 
                        key={idx} 
                        style={{ 
                          backgroundColor: row.esSubtotal ? '#F3F4F6' : 'transparent',
                          borderBottom: row.esSubtotal ? '2px solid #E5E7EB' : '1px solid #F0F4FF',
                        }}
                      >
                        <Table.Td style={{ 
                          fontSize: '12px', 
                          fontWeight: row.esSubtotal ? 800 : 400,
                          color: row.esSubtotal ? '#111827' : '#374151',
                        }}>
                          {row.concepto}
                        </Table.Td>
                        <Table.Td style={{ 
                          fontSize: '12px', 
                          textAlign: 'right', 
                          fontWeight: row.esSubtotal ? 800 : 500,
                          color: row.concepto.includes('(−)') ? '#DC2626' : 
                                 row.esSubtotal ? '#111827' : '#4B5563',
                        }}>
                          {row.monto}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                se recalculan al tocar cualquier amarillo · el real se acumula solo con cada liquidación y cada XML
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 4: CALENDARIO SANTANDER */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconCalendar size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  4. Santander · El Calendario del Día 14
                </Text>
                <Badge size="xs" color="red" variant="light" radius="sm">
                  Deuda
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '500px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Fecha</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Pago</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Saldo después</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {calendarioSantander.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.fecha}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#DC2626', fontWeight: 600 }}>
                          {row.pago}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>
                          {row.libre ? (
                            <Badge size="xs" color="green" variant="light">
                              {row.saldo}
                            </Badge>
                          ) : (
                            <Text size="12px" color="#4B5563">{row.saldo}</Text>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" fw={700} c="#1A3A5C">
                $30,000 cada 14 de mes · el 14 de octubre PF queda libre del banco
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
                <strong>✓ Al guardar:</strong> aquí no se captura ningún resultado: las liquidaciones (PF-8) 
                traen los dos conceptos reales, la CxP (PF-9) trae el gasto — y este pronóstico es la vara · 
                el real arranca en cero con la temporada.
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
                <strong>✓ PF-10:</strong> el presupuesto y P&L de Produce First muestra el plan financiero 
                completo · los conceptos de ingreso son comisión 10% y enfriado $0.15/cj · los gastos operativos 
                se presupuestan aquí · los gastos trasladables viven en PF-9 y se descuentan en PF-8.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}