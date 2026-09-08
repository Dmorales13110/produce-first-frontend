// src/modules/produce-first/PF7_CuentaCorrienteProductor.tsx

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
  SegmentedControl,
  SimpleGrid,
  ThemeIcon,
  Divider,
  ScrollArea,
  Badge,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconFolder,
  IconSearch,
  IconInfoCircle,
  IconUsers,
  IconCurrencyDollar,
  IconPackage,
  IconPackages,
  IconReceipt,
  IconFileInvoice,
  IconAlertTriangle,
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

interface ResumenProductor {
  id: string;
  productor: string;
  anticipos: string;
  semilla: string;
  material: string;
  liquidado: string;
  saldoFavor: string;
}

interface DetalleMovimiento {
  fecha: string;
  movimiento: string;
  origen: string;
  cargo: string;
  abono: string;
}

export function CuentaCorrienteProductorView() {
  // --- Estados de Selección y Filtros ---
  const [filtroProductor, setFiltroProductor] = useState<string | null>('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Con saldo');
  const [selectedProductor, setSelectedProductor] = useState<string>('Agrícola JAV');

  // --- Datos Mock Tabla General ---
  const resumenProductores: ResumenProductor[] = [
    {
      id: '1',
      productor: 'Agrícola JAV',
      anticipos: '$28,400',
      semilla: '$12,000 (200 lb mieu)',
      material: '$38,400 MXN',
      liquidado: '$412,300',
      saldoFavor: '$333,500',
    },
    {
      id: '2',
      productor: 'Daniel Zermeño',
      anticipos: '$21,900',
      semilla: '$0',
      material: '$64,200 MXN',
      liquidado: '$298,100',
      saldoFavor: '$212,000',
    },
    {
      id: '3',
      productor: 'Julio Mandujano',
      anticipos: '$1,800 ($4.5×400)',
      semilla: '$229',
      material: '$8,100 MXN',
      liquidado: '$14,600',
      saldoFavor: '$4,471',
    },
    {
      id: '4',
      productor: 'Mafe Farms',
      anticipos: '$3,240',
      semilla: '$148 (napa 0.6 lb)',
      material: '$15,300 MXN',
      liquidado: '$41,200',
      saldoFavor: '$22,512',
    },
    {
      id: '5',
      productor: 'Fernando (Tips)',
      anticipos: '— (precio fijo)',
      semilla: '$0',
      material: '$21,800 MXN',
      liquidado: '$96,150',
      saldoFavor: '$74,350',
    },
  ];

  // --- Datos Mock Tabla Detalle Auditable ---
  const detalleMovimientos: DetalleMovimiento[] = [
    {
      fecha: '26-nov',
      movimiento: 'Anticipo folio JAV-0512 · 446 cj × $3.50',
      origen: 'ESC-1 escaneo',
      cargo: '$1,561',
      abono: '',
    },
    {
      fecha: '20-nov',
      movimiento: 'Entrega 180 cajas SB28 × $39.80',
      origen: 'PC-3',
      cargo: '$7,164',
      abono: '',
    },
    {
      fecha: '15-nov',
      movimiento: 'Liquidación LIQ-191225 neta',
      origen: 'PF-8',
      cargo: '',
      abono: '$24,809',
    },
    {
      fecha: '08-oct',
      movimiento: 'Semilla 200 lb Shanghai Mieu',
      origen: 'OC semilla',
      cargo: '$12,000',
      abono: '',
    },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'La Pantalla Anti-Pleitos',
      value: 'Un saldo vivo por productor',
      sub: 'anticipos + semilla + material − liquidaciones',
      icon: IconFolder,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Trazabilidad',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Anticipos Pagados Nov',
      value: '$48,200 USD',
      sub: 'disparados por escaneo',
      icon: IconCurrencyDollar,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Mes',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Semilla Financiada Viva',
      value: '$14,110',
      sub: 'JAV $12,000 mieu · resto menores',
      icon: IconPackages,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Pendiente',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Material por Recuperar',
      value: '$184K MXN',
      sub: 'de PC-3',
      icon: IconPackage,
      color: '#DC2626',
      bgColor: '#FEF2F2',
      badge: 'Por descontar',
      badgeColor: 'red',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-7 */}
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
                    PF-7 · Cuenta Corriente del Productor
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
                    <IconFolder size={14} />
                    Cuenta Corriente
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

          {/* SECCIÓN 1: CUENTA CORRIENTE · POR PRODUCTOR */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="flex-end">
                <Group gap="xs" align="flex-end">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconFolder size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Cuenta Corriente · por Productor
                  </Text>
                  <Box ml="md">
                    <Select
                      label="Productor"
                      value={filtroProductor}
                      onChange={setFiltroProductor}
                      data={['Todos', 'Agrícola JAV', 'Daniel Zermeño', 'Julio Mandujano', 'Mafe Farms']}
                      size="xs"
                      w={160}
                      styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                    />
                  </Box>
                </Group>

                <SegmentedControl
                  value={filtroEstado}
                  onChange={setFiltroEstado}
                  data={['Con saldo', 'Todos']}
                  size="xs"
                  color="blue"
                />
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '800px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Productor</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Anticipos Pagados
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Semilla Financiada
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Material Entregado
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        − Liquidado
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Saldo a su Favor
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {resumenProductores.map((row) => {
                      const isSelected = selectedProductor === row.productor;
                      return (
                        <Table.Tr
                          key={row.id}
                          onClick={() => setSelectedProductor(row.productor)}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#FEF3C7' : 'transparent',
                            borderBottom: '1px solid #F0F4FF',
                          }}
                        >
                          <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                            {row.productor}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                            {row.anticipos}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                            {row.semilla}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                            {row.material}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                            {row.liquidado}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 800, color: '#1F5C3A' }}>
                            {row.saldoFavor}
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                cada renglón nació de una captura en otra pantalla — aquí solo se ve la verdad acumulada
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 2: DETALLE DE UN PRODUCTOR */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconSearch size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  El Detalle de un Productor
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  {selectedProductor}
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Fecha</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Movimiento</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Origen</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cargo</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Abono</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {detalleMovimientos.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.fecha}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                          {row.movimiento}
                        </Table.Td>
                        <Table.Td>
                          <Badge size="xs" color="blue" variant="light">
                            {row.origen}
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#DC2626', fontWeight: 600 }}>
                          {row.cargo}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#16A34A', fontWeight: 600 }}>
                          {row.abono}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                clic en cualquier renglón y ves el movimiento exacto con su origen
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
                <strong>✓ PF-7:</strong> cuando PF-8 genera la liquidación, estos saldos se descuentan solos 
                y el productor recibe el desglose completo — el pleito se muere porque todo tiene folio.
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
                <strong>✓ Origen de los datos:</strong> Anticipos (ESC-1) · Semilla (OC semilla) · 
                Material (PF-MAT) · Liquidaciones (PF-8) — todo con trazabilidad auditada.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}