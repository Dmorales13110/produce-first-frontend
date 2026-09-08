// src/modules/produce-first/PF6_CxCClientes.tsx

import React, { useState, useEffect } from 'react';
import { AccountsReceivableService } from '../../../services/accounts-receivable';
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
  Checkbox,
  TextInput,
  Badge,
  Progress,
  RingProgress,
  ThemeIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconReceipt,
  IconChartPie,
  IconCheck,
  IconInfoCircle,
  IconUsers,
  IconCurrencyDollar,
  IconCalendar,
  IconAlertTriangle,
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

interface FacturaItem {
  id: number;
  fFactura: string;
  cliente: string;
  factura: string;
  cajas: number;
  totalUsd: string;
  cobrado: string;
  saldo: string;
  vence: string;
  fCobro: string;
  estatus: string;
  colorBadge: string;
}

export function CxCClientesView() {
  const [filtroCliente, setFiltroCliente] = useState<string | null>('Todos');
  const [filtroProducto, setFiltroProducto] = useState<string | null>('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Por cobrar');
  const [selectedRows, setSelectedRows] = useState<number[]>([1]);
  const [fechaCobro, setFechaCobro] = useState('28-nov-2026');

  // Datos de Respaldo Lista Maestra Facturas
  const INITIAL_FACTURAS: FacturaItem[] = [
    {
      id: 0,
      fFactura: '12-nov',
      cliente: 'Grubmarket',
      factura: 'F-1665',
      cajas: 315,
      totalUsd: '$5,985',
      cobrado: '$0',
      saldo: '$5,985',
      vence: '27-nov',
      fCobro: '',
      estatus: 'vencida 12d',
      colorBadge: 'red',
    },
    {
      id: 1,
      fFactura: '18-nov',
      cliente: 'GreenLeaf',
      factura: 'F-1663',
      cajas: 450,
      totalUsd: '$7,677',
      cobrado: '$0',
      saldo: '$7,677',
      vence: '03-dic',
      fCobro: '28-nov',
      estatus: 'por cobrar',
      colorBadge: 'blue',
    },
    {
      id: 2,
      fFactura: '18-nov',
      cliente: 'GreenLeaf',
      factura: 'F-1664',
      cajas: 405,
      totalUsd: '$6,909',
      cobrado: '$0',
      saldo: '$6,909',
      vence: '03-dic',
      fCobro: '',
      estatus: 'por cobrar',
      colorBadge: 'blue',
    },
  ];

  const [facturasData, setFacturasData] = useState<FacturaItem[]>(INITIAL_FACTURAS);

  useEffect(() => {
    let isMounted = true;
    AccountsReceivableService.getInvoices()
      .then(res => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          const mapped: FacturaItem[] = res.map((inv: any, idx: number) => ({
            id: idx,
            fFactura: inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '18-nov',
            cliente: inv.customer_name || inv.client || 'Cliente',
            factura: inv.invoice_number || `F-${1660 + idx}`,
            cajas: Number(inv.total_boxes || inv.quantity || 450),
            totalUsd: `$${Number(inv.total_amount || 7677).toLocaleString()}`,
            cobrado: `$${Number(inv.paid_amount || 0).toLocaleString()}`,
            saldo: `$${(Number(inv.total_amount || 7677) - Number(inv.paid_amount || 0)).toLocaleString()}`,
            vence: inv.due_date ? new Date(inv.due_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '03-dic',
            fCobro: inv.payment_date ? new Date(inv.payment_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '',
            estatus: inv.status === 'paid' ? 'cobrada' : (inv.status === 'overdue' ? 'vencida' : 'por cobrar'),
            colorBadge: inv.status === 'paid' ? 'green' : (inv.status === 'overdue' ? 'red' : 'blue'),
          }));
          setFacturasData(mapped);
        }
      })
      .catch(err => {
        console.warn('⚠️ Usando facturas de respaldo:', err);
      });

    return () => { isMounted = false; };
  }, []);


  const toggleRow = (id: number) => {
    setSelectedRows((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Por Cobrar',
      value: '$118,400 USD',
      sub: '9 facturas vivas',
      icon: IconReceipt,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Pendiente',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Vencidas',
      value: '$21,300',
      sub: 'Grubmarket 12 días vencido',
      icon: IconAlertTriangle,
      color: '#DC2626',
      bgColor: '#FEF2F2',
      badge: 'Crítico',
      badgeColor: 'red',
      delay: 0.1,
    },
    {
      label: 'DSO',
      value: '19 días',
      sub: 'meta ≤ 18 (crédito 15)',
      icon: IconCalendar,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Alerta',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Cobrado Nov',
      value: '$164,800 USD',
      sub: 'mes en curso',
      icon: IconTrendingUp,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Mes',
      badgeColor: 'green',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-6 */}
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
                    PF-6 · CxC de Clientes
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconReceipt size={14} />
                    Venta y Embarque
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconCurrencyDollar size={14} />
                    Cuentas por Cobrar
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

          {/* SECCIÓN 1: LISTA MAESTRA DE FACTURAS */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconReceipt size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Lista Maestra · Facturas
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    Misma fórmula que CXP-1
                  </Badge>
                </Group>

                <Group gap="md">
                  <Select
                    label="Cliente"
                    value={filtroCliente}
                    onChange={setFiltroCliente}
                    data={['Todos', 'Grubmarket', 'GreenLeaf', 'Fresh Direct']}
                    size="xs"
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Producto"
                    value={filtroProducto}
                    onChange={setFiltroProducto}
                    data={['Todos', 'Shanghai Bok', 'Coliflor', 'Choy Mieu']}
                    size="xs"
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <SegmentedControl
                    value={filtroEstado}
                    onChange={setFiltroEstado}
                    data={['Por cobrar', 'Vencidas', 'Por vencer 7d', 'Cobradas']}
                    size="xs"
                    color="blue"
                  />
                </Group>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '1000px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ width: 40, textAlign: 'center' }}></Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>F. Factura</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cliente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Factura</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Total USD</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cobrado</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Saldo</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Vence</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        F. Cobro
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Estatus</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {facturasData.map((row) => {
                      const isSelected = selectedRows.includes(row.id);
                      return (
                        <Table.Tr 
                          key={row.id} 
                          style={{ 
                            backgroundColor: isSelected ? '#FFFBEB' : 'transparent',
                            borderBottom: '1px solid #F0F4FF',
                          }}
                        >
                          <Table.Td style={{ textAlign: 'center' }}>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => toggleRow(row.id)}
                              size="xs"
                              color="blue"
                            />
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.fFactura}</Table.Td>
                          <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                            {row.cliente}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.factura}</Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                            {row.cajas}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                            {row.totalUsd}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#6B7280' }}>
                            {row.cobrado}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                            {row.saldo}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.vence}</Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            {row.fCobro ? (
                              <Badge size="xs" color="green" variant="light">
                                {row.fCobro}
                              </Badge>
                            ) : (
                              <Text size="11px" c="dimmed">—</Text>
                            )}
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              size="xs"
                              color={row.colorBadge}
                              variant="light"
                            >
                              {row.estatus}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Divider />

              {/* BARRA DE ACCIÓN MASIVA */}
              <Group align="flex-end" gap="md">
                <TextInput
                  label="Seleccionadas"
                  value="1 · $7,677"
                  readOnly
                  size="xs"
                  w={180}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <TextInput
                  label="Fecha de cobro"
                  value={fechaCobro}
                  onChange={(e) => setFechaCobro(e.currentTarget.value)}
                  size="xs"
                  w={180}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <Button
                  leftSection={<IconCheck size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                >
                  Marcar cobradas
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                cada factura con su crédito real (15d), vencimiento y estatus · seleccionas las cobradas y pones la fecha
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
                <strong>✓ Al guardar:</strong> el cobro dispara la <strong>liquidación final</strong> de los productores 
                de esa factura (PF-8) · el aging alimenta el flujo de caja de PF · sin dispersión, solo control.
              </Text>
            </Group>
          </Paper>

          {/* SECCIÓN 2: AGING Y COMPORTAMIENTO POR CLIENTE */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconChartPie size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Aging y Comportamiento por Cliente
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Análisis
                </Badge>
              </Group>

              <Divider />

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                {/* GRÁFICO DONA Y LEYENDA */}
                <Group gap="md" wrap="nowrap">
                  <RingProgress
                    size={140}
                    thickness={22}
                    roundCaps
                    sections={[
                      { value: 70, color: '#B45309', tooltip: 'Al corriente: 82,400' },
                      { value: 12, color: '#EAB308', tooltip: '1-7d vencido: 14,700' },
                      { value: 18, color: '#DC2626', tooltip: '+7d vencido: 21,300' },
                    ]}
                  />

                  <Stack gap="xs" style={{ flexGrow: 1 }}>
                    <Group justify="space-between">
                      <Group gap={6}>
                        <Box style={{ width: 10, height: 10, backgroundColor: '#B45309', borderRadius: 2 }} />
                        <Text size="xs" fw={500}>Al corriente</Text>
                      </Group>
                      <Text size="xs" fw={700}>82,400</Text>
                    </Group>

                    {/* BANNER NOTA SALDOS A FAVOR */}
                    <Paper p="xs" radius="sm" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                      <Text size="10px" c="#92400E" style={{ lineHeight: 1.4 }}>
                        <strong>Saldos a favor de clientes (pagaron de más en 25-26):</strong> Fresh Direct $136,000 · 
                        Grubmarket $83,000 — cada factura nueva de la temporada les aplica su crédito automáticamente 
                        hasta compensar · el saldo vivo se ve como deuda en GRP-1.
                      </Text>
                    </Paper>

                    <Group justify="space-between">
                      <Group gap={6}>
                        <Box style={{ width: 10, height: 10, backgroundColor: '#EAB308', borderRadius: 2 }} />
                        <Text size="xs" fw={500}>1-7d vencido</Text>
                      </Group>
                      <Text size="xs" fw={700}>14,700</Text>
                    </Group>

                    <Group justify="space-between">
                      <Group gap={6}>
                        <Box style={{ width: 10, height: 10, backgroundColor: '#DC2626', borderRadius: 2 }} />
                        <Text size="xs" fw={500}>+7d vencido</Text>
                      </Group>
                      <Text size="xs" fw={700}>21,300</Text>
                    </Group>
                  </Stack>
                </Group>

                {/* BARRAS COMPORTAMIENTO CLIENTES */}
                <Stack gap="xs">
                  <Box>
                    <Group justify="space-between" mb={2}>
                      <Text size="xs" fw={600} c="#1A3A5C">GreenLeaf · paga a 14d</Text>
                    </Group>
                    <Progress value={100} color="#854D0E" size="sm" radius="xl" />
                  </Box>

                  <Box>
                    <Group justify="space-between" mb={2}>
                      <Text size="xs" fw={600} c="#1A3A5C">Grubmarket · paga a 24d</Text>
                      <Text size="xs" fw={700} c="#DC2626">$1085K</Text>
                    </Group>
                    <Progress value={85} color="#DC2626" size="sm" radius="xl" />
                  </Box>

                  <Box>
                    <Group justify="space-between" mb={2}>
                      <Text size="xs" fw={600} c="#1A3A5C">Fresh Direct · 15d</Text>
                      <Text size="xs" fw={700} c="#1A4B8C">$794K venta</Text>
                    </Group>
                    <Progress value={65} color="#1A4B8C" size="sm" radius="xl" />
                  </Box>

                  <Box>
                    <Group justify="space-between" mb={2}>
                      <Text size="xs" fw={600} c="#1A3A5C">Tay Shing · 16d</Text>
                      <Text size="xs" fw={700} c="#1F5C3A">$679K venta</Text>
                    </Group>
                    <Progress value={50} color="#1F5C3A" size="sm" radius="xl" />
                  </Box>
                </Stack>
              </SimpleGrid>
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
                <strong>✓ PF-6:</strong> la CxC de clientes se alimenta de las proformas confirmadas (PF-5). 
                El aging muestra la salud del cobro y el DSO · al cobrar, se activa la liquidación de productores (PF-8).
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}