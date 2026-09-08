// src/modules/produce-first/PF3_PronosticoSemanal.tsx

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
  Button,
  SegmentedControl,
  SimpleGrid,
  Progress,
  ThemeIcon,
  Divider,
  ScrollArea,
  Badge,
} from '@mantine/core';
import {
  IconCalendar,
  IconCheck,
  IconTarget,
  IconBuildingStore,
  IconChartBar,
  IconTruck,
  IconUsers,
  IconInfoCircle,
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
  productor: string;
  producto: string;
  lun: string;
  mar: string;
  mie: string;
  jue: string;
  vie: string;
  sab: string;
  total: number;
}

interface AciertoItem {
  productor: string;
  porcentaje: number;
}

export function PronosticoSemanalView() {
  const [filtroProductor, setFiltroProductor] = useState<string | null>('Todos');
  const [filtroDia, setFiltroDia] = useState<string | null>('Semana completa');
  const [semanaActiva, setSemanaActiva] = useState('S49');

  // Datos de respaldo de la tabla de pronóstico por productor
  const INITIAL_PRONOSTICO: PronosticoItem[] = [
    { productor: 'Daily Veggies', producto: 'Shanghai Bok', lun: '20/45', mar: '18/45', mie: '20/45', jue: '16/45', vie: '22/45', sab: '14/45', total: 110 },
    { productor: 'Daily Veggies', producto: 'Choy Mieu', lun: '13/45', mar: '10/45', mie: '12/45', jue: '10/45', vie: '14/45', sab: '8/45', total: 67 },
    { productor: 'Agrícola JAV', producto: 'Big Bok Choy', lun: '24/35', mar: '', mie: '', jue: '20/35', vie: '', sab: '', total: 44 },
    { productor: 'Daniel Zermeño', producto: 'Coliflor', lun: '28/35', mar: '', mie: '30/35', jue: '', vie: '26/35', sab: '', total: 84 },
    { productor: 'Fernando', producto: 'Tips', lun: '9/56', mar: '', mie: '9/56', jue: '', vie: '10/56', sab: '', total: 28 },
  ];

  const [pronosticoData, setPronosticoData] = useState<PronosticoItem[]>(INITIAL_PRONOSTICO);

  useEffect(() => {
    let isMounted = true;
    api.get<any[]>('/forecast')
      .then(res => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          const mapped: PronosticoItem[] = res.map((f: any) => ({
            productor: f.grower_name || f.grower?.commercial_name || 'Productor',
            producto: f.product_name || f.crop || 'Vegetal',
            lun: f.monday || '20/45',
            mar: f.tuesday || '18/45',
            mie: f.wednesday || '20/45',
            jue: f.thursday || '16/45',
            vie: f.friday || '22/45',
            sab: f.saturday || '14/45',
            total: Number(f.total_boxes || f.total || 110),
          }));
          setPronosticoData(mapped);
        }
      })
      .catch(err => {
        console.warn('⚠️ Usando pronóstico de respaldo:', err);
      });

    return () => { isMounted = false; };
  }, []);

  // Datos mock de % de acierto por productor
  const aciertoData: AciertoItem[] = [
    { productor: 'Daily Veggies', porcentaje: 94.8 },
    { productor: 'Fernando (Tips)', porcentaje: 93.2 },
    { productor: 'Daniel Zermeño', porcentaje: 89.4 },
    { productor: 'Agrícola JAV', porcentaje: 87.6 },
    { productor: 'Plantisano', porcentaje: 82.1 },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Pronóstico S49',
      value: '226 pallets',
      sub: '10 productores · captura del jueves',
      icon: IconCalendar,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Semanal',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Formato Néstor',
      value: 'pallets / cajas-por-tarima',
      sub: '10/45 = 10 pallets de 45',
      icon: IconChartBar,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Estandarizado',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'vs Demanda',
      value: '+7 pallets',
      sub: 'holgura sana',
      icon: IconTrendingUp,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Sana',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Confirmación',
      value: 'viernes 12:00',
      sub: 'los clientes reciben availability',
      icon: IconTruck,
      color: '#1864AB',
      bgColor: '#E7F5FF',
      badge: 'Publicación',
      badgeColor: 'blue',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-3 */}
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
                    PF-3 · Pronóstico Semanal Multi-productor
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
                    <IconTarget size={14} />
                    Formato Néstor
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

          {/* SECCIÓN 1: CAPTURA DE PRONÓSTICO */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconCalendar size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Captura · Pronóstico por Productor × Producto × Día
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    Formato Néstor
                  </Badge>
                </Group>

                <Group gap="md">
                  <Select
                    label="Productor"
                    value={filtroProductor}
                    onChange={setFiltroProductor}
                    data={['Todos', 'Daily Veggies', 'Agrícola JAV', 'Daniel Zermeño', 'Fernando']}
                    size="xs"
                    w={130}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Día"
                    value={filtroDia}
                    onChange={setFiltroDia}
                    data={['Semana completa', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']}
                    size="xs"
                    w={140}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <SegmentedControl
                    value={semanaActiva}
                    onChange={setSemanaActiva}
                    data={['S49', 'S50']}
                    size="xs"
                    color="blue"
                  />
                </Group>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '900px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Productor</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Producto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Lun</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Mar</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Mié</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Jue</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Vie</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Sáb</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Total Pallets
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {pronosticoData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.productor}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.producto}</Table.Td>
                        
                        {[row.lun, row.mar, row.mie, row.jue, row.vie, row.sab].map((val, cellIdx) => (
                          <Table.Td key={cellIdx} style={{ textAlign: 'center' }}>
                            {val ? (
                              <Badge
                                size="xs"
                                color="yellow"
                                variant="light"
                                style={{
                                  backgroundColor: '#FEF9C3',
                                  color: '#854D0E',
                                  fontWeight: 700,
                                  fontSize: '11px',
                                }}
                              >
                                {val}
                              </Badge>
                            ) : null}
                          </Table.Td>
                        ))}

                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#1A4B8C' }}>
                          {row.total}
                        </Table.Td>
                      </Table.Tr>
                    ))}
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
                  Cerrar pronóstico {semanaActiva} y publicar availability
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                el formato real de Néstor hecho tabla: pallets/estiba por día — 15 minutos el jueves
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
                <strong>✓ Al guardar:</strong> el pronóstico llena la dispo del planificador (PF-4) · 
                se compara contra el programa (PF-2) por producto · el % de acierto por productor se 
                mide solo al llegar los folios reales (ESC-1).
              </Text>
            </Group>
          </Paper>

          {/* SECCIÓN 2: % DE ACIERTO POR PRODUCTOR */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconTarget size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  % de Acierto por Productor · Temporada
                </Text>
                <Badge size="xs" color="green" variant="light" radius="sm">
                  Medición
                </Badge>
              </Group>

              <Divider />

              <Stack gap="xs" style={{ maxWidth: 600 }}>
                {aciertoData.map((item, idx) => (
                  <Group key={idx} justify="space-between" align="center" wrap="nowrap">
                    <Text size="12px" fw={500} style={{ width: 140, flexShrink: 0, color: '#1A3A5C' }}>
                      {item.productor}
                    </Text>
                    <Box style={{ flexGrow: 1 }}>
                      <Progress 
                        value={item.porcentaje} 
                        color={item.porcentaje >= 90 ? 'green' : item.porcentaje >= 80 ? 'yellow' : 'red'} 
                        size="md" 
                        radius="xl" 
                      />
                    </Box>
                    <Text size="12px" fw={700} c="dimmed" style={{ width: 45, textAlign: 'right', flexShrink: 0 }}>
                      {item.porcentaje}%
                    </Text>
                  </Group>
                ))}
              </Stack>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                el que pronostica bien recibe mejores posiciones en el programa
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
                <strong>✓ PF-3:</strong> el pronóstico semanal alimenta PF-4 (Planificador de Carga) y 
                se valida contra PF-2 (Programa de Ventas vs Siembra). La precisión del pronóstico 
                mejora con la experiencia de cada productor.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}