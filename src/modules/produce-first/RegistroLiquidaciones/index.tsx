// src/modules/produce-first/PFREG_RegistroLiquidaciones.tsx

import React, { useState, useEffect } from 'react';
import { api } from '../../../services/apiClient';
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
  Badge,
  ScrollArea,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconTable,
  IconTruck,
  IconInfoCircle,
  IconFileInvoice,
  IconUsers,
  IconCurrencyDollar,
  IconBox,
  IconCalendar,
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

interface RegistroDetalleItem {
  cam: string;
  fecha: string;
  fact: string;
  cliente: string;
  tipo: string;
  productor: string;
  vegetal: string;
  cajas: number;
  precioCj: string;
  venta: string;
  comision: string;
  fitoDer: string;
  enfrRee: string;
  transp: string;
  exp: string;
}

interface ResumenCamionItem {
  camion: string;
  fecha: string;
  cliente: string;
  renglones: number;
  cajas: string;
  venta: string;
  gastosProd: string;
  utilidadBruta: string;
  margen: string;
  estatus: string;
  estatusColor: string;
}

export function RegistroLiquidacionesView() {
  // --- Estados de Filtros ---
  const [clienteFilter, setClienteFilter] = useState<string | null>('Todos');
  const [productorFilter, setProductorFilter] = useState<string | null>('Todos');
  const [vegetalFilter, setVegetalFilter] = useState<string | null>('Todos');
  const [tipoFilter, setTipoFilter] = useState<string | null>('Todos');
  const [tabFiltro, setTabFiltro] = useState('Todas');

  // --- Datos Mock Tabla 1: Registro Detallado ---
  const INITIAL_REGISTRO_DETALLE: RegistroDetalleItem[] = [
    {
      cam: '1',
      fecha: '24-oct',
      fact: '1630',
      cliente: 'Fresh Direct',
      tipo: 'Comisión',
      productor: 'Daily Veggies',
      vegetal: 'Baby Bok Choy',
      cajas: 450,
      precioCj: '$14.50',
      venta: '$6,525',
      comision: '$652.50',
      fitoDer: '$43.55',
      enfrRee: '$450.00',
      transp: '$744.54',
      exp: '$195',
    },
    {
      cam: '1',
      fecha: '24-oct',
      fact: '1630',
      cliente: 'Fresh Direct',
      tipo: 'Comisión',
      productor: 'EFW',
      vegetal: 'Shanghai Mieu',
      cajas: 450,
      precioCj: '$12.00',
      venta: '$5,400',
      comision: '$540.00',
      fitoDer: '$43.55',
      enfrRee: '$450.00',
      transp: '$744.54',
      exp: '$195',
    },
    {
      cam: '6',
      fecha: '31-oct',
      fact: '1636',
      cliente: 'Grubmarket',
      tipo: 'Comisión',
      productor: 'Daily Veggies',
      vegetal: 'Shanghai Bok',
      cajas: 900,
      precioCj: '$12.00',
      venta: '$10,800',
      comision: '$1,080.00',
      fitoDer: '$85.64',
      enfrRee: '$900.00',
      transp: '$1,489.08',
      exp: '$390',
    },
    {
      cam: '6',
      fecha: '31-oct',
      fact: '1636',
      cliente: 'Grubmarket',
      tipo: 'P. Fijo',
      productor: 'Fernando García',
      vegetal: 'Snow Pea Tips',
      cajas: 203,
      precioCj: '$23.00',
      venta: '$4,669',
      comision: '—',
      fitoDer: '$19.32',
      enfrRee: '$203.00',
      transp: '$330.24',
      exp: '$93',
    },
    {
      cam: '8',
      fecha: '01-nov',
      fact: '1638',
      cliente: 'Fortune Growers',
      tipo: 'Comisión',
      productor: 'Daily Veggies',
      vegetal: 'Shanghai Bok',
      cajas: 135,
      precioCj: '$0.00',
      venta: '$0',
      comision: '$0.00',
      fitoDer: '$12.86',
      enfrRee: '$135.00',
      transp: '$223.36',
      exp: '$58',
    },
    {
      cam: '380',
      fecha: '03-jun',
      fact: '2134',
      cliente: 'Greenleaf',
      tipo: 'Comisión',
      productor: '(por liquidar)',
      vegetal: 'Chinese Cauli',
      cajas: 720,
      precioCj: '$19.00',
      venta: '$13,680',
      comision: '$1,368.00',
      fitoDer: '...',
      enfrRee: '...',
      transp: '...',
      exp: '...',
    },
  ];

  const [registroDetalleList, setRegistroDetalleList] = useState<RegistroDetalleItem[]>(INITIAL_REGISTRO_DETALLE);
  const [clientesList, setClientesList] = useState<string[]>(['Todos', 'Fresh Direct', 'Grubmarket', 'Fortune Growers', 'Greenleaf']);
  const [productoresList, setProductoresList] = useState<string[]>(['Todos', 'Daily Veggies', 'EFW', 'Fernando García']);

  useEffect(() => {
    let isMounted = true;
    api.get<any[]>('/customers')
      .then((res) => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          const names = res.map((c) => c.name || c.business_name || c.cliente).filter(Boolean);
          if (names.length > 0) setClientesList(['Todos', ...names]);
        }
      })
      .catch((err) => console.warn('⚠️ [PF-REG] Fallback clientes:', err));

    api.get<any[]>('/growers')
      .then((res) => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          const names = res.map((g) => g.name || g.grower_name || g.business_name).filter(Boolean);
          if (names.length > 0) setProductoresList(['Todos', ...names]);
        }
      })
      .catch((err) => console.warn('⚠️ [PF-REG] Fallback productores:', err));

    api.get<any[]>('/liquidation-pf')
      .then((res) => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          const mapped: RegistroDetalleItem[] = res.slice(0, 15).map((l: any, idx: number) => ({
            cam: String(l.truck_number || idx + 1),
            fecha: l.date ? new Date(l.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : 'Reciente',
            fact: l.invoice_number || `16${30 + idx}`,
            cliente: l.customer_name || 'Cliente Comercial',
            tipo: l.type || 'Comisión',
            productor: l.grower_name || 'Productor',
            vegetal: l.product_name || 'Hortaliza',
            cajas: l.boxes || 500,
            precioCj: `$${(l.price_per_box || 14).toFixed(2)}`,
            venta: `$${(l.total_sale || 7000).toLocaleString()}`,
            comision: `$${(l.commission || 700).toFixed(2)}`,
            fitoDer: `$${(l.fito || 45).toFixed(2)}`,
            enfrRee: `$${(l.cooling || 450).toFixed(2)}`,
            transp: `$${(l.freight || 750).toFixed(2)}`,
            exp: `$${(l.export_fee || 195).toFixed(2)}`,
          }));
          setRegistroDetalleList(mapped);
        }
      })
      .catch((err) => console.warn('⚠️ [PF-REG] Fallback liquidaciones detalle:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // --- Datos Mock Tabla 2: Utilidad por Camión ---
  const resumenCamionData: ResumenCamionItem[] = [
    {
      camion: '1',
      fecha: '24-oct',
      cliente: 'Fresh Direct',
      renglones: 3,
      cajas: '1,350',
      venta: '$16,425',
      gastosProd: '$4,299.77',
      utilidadBruta: '+$1,642.50',
      margen: '10.0%',
      estatus: 'cobrado',
      estatusColor: 'gray',
    },
    {
      camion: '4',
      fecha: '29-oct',
      cliente: 'Fresh Direct',
      renglones: 1,
      cajas: '1,350',
      venta: '$20,250',
      gastosProd: '$3,918.44',
      utilidadBruta: '+$2,025.00',
      margen: '10.0%',
      estatus: 'cobrado',
      estatusColor: 'gray',
    },
    {
      camion: '6',
      fecha: '31-oct',
      cliente: 'Grubmarket',
      renglones: 3,
      cajas: '1,373',
      venta: '$19,384',
      gastosProd: '$4,157.35',
      utilidadBruta: '+$3,401.63',
      margen: '17.5%',
      estatus: 'cobrado',
      estatusColor: 'gray',
    },
    {
      camion: '8',
      fecha: '01-nov',
      cliente: 'Fortune Growers',
      renglones: 1,
      cajas: '135',
      venta: '$0',
      gastosProd: '$429.77',
      utilidadBruta: '−$429.77',
      margen: '—',
      estatus: 'no cobrable',
      estatusColor: 'red',
    },
    {
      camion: '10',
      fecha: '04-nov',
      cliente: 'Manley Sales',
      renglones: 3,
      cajas: '1,383',
      venta: '$20,652',
      gastosProd: '$4,214.90',
      utilidadBruta: '+$2,247.19',
      margen: '10.9%',
      estatus: 'cobrado',
      estatusColor: 'gray',
    },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'El Dato Puntual',
      value: 'Utilidad por camión, por producto',
      sub: 'tu registro de 380 camiones, vivo',
      icon: IconTable,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Detalle',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Nada se Teclea Aquí',
      value: 'Cada renglón nace solo',
      sub: 'proforma → carga confirmada → liquidación',
      icon: IconFileInvoice,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Automático',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Utilidad PF · Temporada',
      value: '$14,247 USD',
      sub: '10 camiones · 1 con pérdida',
      icon: IconTrendingUp,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Acumulado',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Retorno Promedio al Productor',
      value: '$9.86 /cj',
      sub: 'visible por renglón',
      icon: IconCurrencyDollar,
      color: '#1864AB',
      bgColor: '#E7F5FF',
      badge: 'Productor',
      badgeColor: 'blue',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-REG */}
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
                    PF-REG · Registro de Liquidaciones
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconTable size={14} />
                    Resultado
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconTruck size={14} />
                    Por Camión
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

          {/* SECCIÓN REGISTRO DETALLADO */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconTable size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    El Registro · Renglón por Camión × Producto
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    {registroDetalleList.length} renglones
                  </Badge>
                </Group>
              </Group>

              <Divider />

              {/* FILTROS */}
              <Group justify="space-between" align="flex-end">
                <Group gap="xs">
                  <Select
                    label="Cliente"
                    size="xs"
                    value={clienteFilter}
                    onChange={setClienteFilter}
                    data={clientesList}
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Productor"
                    size="xs"
                    value={productorFilter}
                    onChange={setProductorFilter}
                    data={productoresList}
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Vegetal"
                    size="xs"
                    value={vegetalFilter}
                    onChange={setVegetalFilter}
                    data={['Todos', 'Baby Bok Choy', 'Shanghai Mieu', 'Shanghai Bok', 'Snow Pea Tips']}
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Tipo"
                    size="xs"
                    value={tipoFilter}
                    onChange={setTipoFilter}
                    data={['Todos', 'Comisión', 'P. Fijo']}
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                </Group>

                <Group gap={4}>
                  {['Todas', 'Liquidadas (L)', 'Pendientes (P)', 'Con pérdida', 'Sin cobrar'].map((t) => (
                    <Button
                      key={t}
                      size="xs"
                      variant={tabFiltro === t ? 'filled' : 'default'}
                      onClick={() => setTabFiltro(t)}
                      style={{
                        backgroundColor: tabFiltro === t ? '#1A4B8C' : undefined,
                        color: tabFiltro === t ? '#FFFFFF' : '#374151',
                        fontSize: '11px',
                      }}
                    >
                      {t}
                    </Button>
                  ))}
                </Group>
              </Group>

              {/* TABLA CON SCROLL HORIZONTAL */}
              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '1100px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>#Cam</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Fecha</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Fact</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cliente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Tipo</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Productor</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Vegetal</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>$/cj</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Venta</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Comisión</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Fito/Der</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Enfr/Ree</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Transp</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Exp</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {registroDetalleList.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '11px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.cam}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', color: '#6B7280' }}>{row.fecha}</Table.Td>
                        <Table.Td style={{ fontSize: '11px', color: '#4B5563' }}>{row.fact}</Table.Td>
                        <Table.Td style={{ fontSize: '11px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.cliente}
                        </Table.Td>
                        <Table.Td>
                          <Badge size="xs" color={row.tipo === 'Comisión' ? 'blue' : 'amber'} variant="light">
                            {row.tipo}
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', color: '#4B5563' }}>{row.productor}</Table.Td>
                        <Table.Td style={{ fontSize: '11px', color: '#374151' }}>{row.vegetal}</Table.Td>
                        <Table.Td style={{ fontSize: '11px', textAlign: 'right', color: '#4B5563' }}>
                          {row.cajas}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', textAlign: 'right', color: '#4B5563' }}>
                          {row.precioCj}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.venta}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', textAlign: 'right', color: '#4B5563' }}>
                          {row.comision}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', textAlign: 'right', color: '#4B5563' }}>
                          {row.fitoDer}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', textAlign: 'right', color: '#4B5563' }}>
                          {row.enfrRee}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', textAlign: 'right', color: '#4B5563' }}>
                          {row.transp}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', textAlign: 'right', color: '#4B5563' }}>
                          {row.exp}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                mejoras sobre tu excel: subtotal por camión al agrupar · la pérdida se pinta sola · 
                L/P automático: P mientras la liquidación no se emita (PF-8) · el estatus de cobro viene 
                de la CxC (PF-6) y el depósito real actualiza el renglón
              </Text>

              <Text size="xs" fw={600} c="#1A3A5C">
                cada costo llega prorrateado de su origen: fito y flete de la proforma (PF-5), 
                enfriamiento del corte de PC, exportación de las extranjeras (PF-9) · 
                amarillo solo en <strong>Problemas de Calidad</strong> (PF-LQC) — todo lo demás es automático
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN UTILIDAD POR CAMIÓN (RESUMEN) */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconTruck size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Utilidad por Camión · El Resumen que Colapsa
                </Text>
                <Badge size="xs" color="green" variant="light" radius="sm">
                  {resumenCamionData.length} camiones
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '900px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}># Camión</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Fecha</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cliente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Renglones
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Cajas
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Venta
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Gastos p/Prod
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Utilidad Bruta PF
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Margen
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Estatus
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {resumenCamionData.map((row, idx) => (
                      <Table.Tr 
                        key={idx} 
                        style={{ 
                          backgroundColor: row.utilidadBruta.startsWith('−') ? '#FEF2F2' : 'transparent',
                          borderBottom: '1px solid #F0F4FF',
                        }}
                      >
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.camion}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.fecha}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.cliente}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.renglones}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.cajas}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.venta}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#DC2626' }}>
                          {row.gastosProd}
                        </Table.Td>
                        <Table.Td
                          style={{
                            fontSize: '12px',
                            textAlign: 'right',
                            fontWeight: 700,
                            color: row.utilidadBruta.startsWith('+') ? '#16A34A' : '#DC2626',
                          }}
                        >
                          {row.utilidadBruta}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.margen}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge size="xs" color={row.estatusColor} variant="light">
                            {row.estatus}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                  <Table.Tfoot style={{ backgroundColor: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                    <Table.Tr>
                      <Table.Td colSpan={3} style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>
                        10 camiones
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                        24
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                        9,847
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#1A4B8C' }}>
                        $131,206
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                        $28,904
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#16A34A' }}>
                        $14,247
                      </Table.Td>
                      <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                        10.9%
                      </Table.Td>
                      <Table.Td />
                    </Table.Tr>
                  </Table.Tfoot>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                el mismo registro, agrupado: un renglón por camión con su venta, sus gastos y lo que PF ganó o perdió
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
                <strong>✓ Al guardar:</strong> la cadena que lo llena: <strong>proforma (PF-5)</strong> 
                pone camión, cliente, vegetal y folios · <strong>la carga confirmada (PC-EMB)</strong> 
                pone las cajas reales · <strong>los costos prorrateados llegan de PF-9 y del corte de PC</strong> · 
                <strong>la liquidación (PF-8)</strong> cierra el renglón con retorno/cj · 
                <strong>el depósito (PF-6)</strong> cierra el cobro — este registro es la fuente única 
                del dashboard y del P&L.
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
                <strong>✓ PF-REG:</strong> el registro de liquidaciones es la fuente única de verdad 
                para el dashboard y el P&L · cada renglón se llena automáticamente desde PF-5, PC-EMB, 
                PF-9, PF-8 y PF-6 · no se captura nada manualmente aquí.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}