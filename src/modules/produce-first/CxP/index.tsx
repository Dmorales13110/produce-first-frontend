// src/modules/produce-first/PF9_CxPProduceFirst.tsx

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
  Checkbox,
  TextInput,
  Badge,
  ThemeIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconDownload,
  IconEdit,
  IconListCheck,
  IconCheck,
  IconPlus,
  IconInfoCircle,
  IconCurrencyDollar,
  IconFileInvoice,
  IconTruck,
  IconPackage,
  IconUsers,
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

interface SatItem {
  id: string;
  factura: string;
  proveedor: string;
  concepto: string;
  monto: string;
  categoria: string;
  trasladable: boolean;
  conciliado: boolean;
}

interface ListaMaestraItem {
  id: string;
  fecha: string;
  proveedor: string;
  concepto: string;
  divisaTc: string;
  totalMXN: string;
  saldo: string;
  credito: string;
  vence: string;
  fPago: string;
  origen: string;
  estatus: string;
  colorEstatus: string;
}

export function CxPProduceFirstView() {
  // --- Estados de Captura Manual (2b) ---
  const [proveedorExtranjero, setProveedorExtranjero] = useState<string | null>('Joe Arévalo (agente USA)');
  const [invoiceNum, setInvoiceNum] = useState('INV-2026-1148');
  const [montoUSD, setMontoUSD] = useState('912.56');
  const [tcDia, setTcDia] = useState('19.44');
  const [categoriaExtranjera, setCategoriaExtranjera] = useState<string | null>('ADUANAS USA');
  const [trasladableProductor, setTrasladableProductor] = useState<string | null>('Sí — prorratear por embarque');

  // --- Estados Filtros y Acciones Lista Maestra ---
  const [filtroProveedor, setFiltroProveedor] = useState<string | null>('Todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>('Todas');
  const [filtroEstatusTab, setFiltroEstatusTab] = useState('Por pagar');
  const [fechaPagoAccion, setFechaPagoAccion] = useState('');
  const [bancoRefAccion, setBancoRefAccion] = useState<string | null>('Cuenta PF ****8841');

  // --- Selección de filas ---
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // --- Datos Mock Sección 2: Descarga del SAT ---
  const satData: SatItem[] = [
    { id: 'sat-1', factura: 'F-2287', proveedor: 'Produce Cooling', concepto: 'Maquila nov (interco.)', monto: '$297,652', categoria: 'MAQUILA PC', trasladable: false, conciliado: true },
    { id: 'sat-2', factura: 'F-0448', proveedor: 'Fletes GTO Norte', concepto: 'Flete Celaya–McAllen', monto: '$38,500', categoria: 'FLETES', trasladable: true, conciliado: true },
  ];

  // --- Datos Mock Sección 3: Lista Maestra ---
  const listaMaestraData: ListaMaestraItem[] = [
    {
      id: '1',
      fecha: '13-nov',
      proveedor: 'Joe Arévalo',
      concepto: 'Gastos de exportación',
      divisaTc: 'USD $912.56 · 19.44',
      totalMXN: '$17,738',
      saldo: '$17,738',
      credito: '15d',
      vence: '28-nov',
      fPago: '',
      origen: 'extranjera · manual',
      estatus: 'por pagar',
      colorEstatus: 'blue',
    },
    {
      id: '2',
      fecha: '18-nov',
      proveedor: 'Produce Cooling',
      concepto: 'Maquila nov (interco.)',
      divisaTc: 'MXN',
      totalMXN: '$297,652',
      saldo: '$297,652',
      credito: '30d',
      vence: '18-dic',
      fPago: '',
      origen: 'SAT ✓',
      estatus: 'por pagar',
      colorEstatus: 'blue',
    },
    {
      id: '3',
      fecha: '11-nov',
      proveedor: 'Keystone Cold',
      concepto: 'Freight pick up',
      divisaTc: 'USD $100 · 18.00',
      totalMXN: '$1,800',
      saldo: '$0',
      credito: '0d',
      vence: '11-nov',
      fPago: '11-nov',
      origen: 'extranjera · manual',
      estatus: 'pagada',
      colorEstatus: 'gray',
    },
    {
      id: '4',
      fecha: '10-nov',
      proveedor: 'J.P. Pacheco',
      concepto: 'Gastos aduanales',
      divisaTc: 'USD $283 · 18.24',
      totalMXN: '$5,161',
      saldo: '$0',
      credito: '30d',
      vence: '10-dic',
      fPago: '28-nov',
      origen: 'SAT ✓',
      estatus: 'pagada',
      colorEstatus: 'gray',
    },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(listaMaestraData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((item) => item !== id));
    }
  };

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'CxP de PF Viva',
      value: '$284K MXN',
      sub: 'aduanas · fletes · maquila PC',
      icon: IconFileInvoice,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Pendiente',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Facturas Extranjeras',
      value: 'Captura Manual',
      sub: 'Arévalo, Keystone: sin CFDI en el SAT',
      icon: IconEdit,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Manual',
      badgeColor: 'yellow',
      delay: 0.1,
    },
    {
      label: 'Check Trasladable',
      value: 'En la Conciliación',
      sub: 'el gasto viaja al descuento del productor',
      icon: IconUsers,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Productor',
      badgeColor: 'green',
      delay: 0.15,
    },
    {
      label: 'Misma Fórmula',
      value: 'Que tu archivo de flujo',
      sub: 'crédito · vencimiento · pagada + fecha',
      icon: IconCalendar,
      color: '#1864AB',
      bgColor: '#E7F5FF',
      badge: 'Control',
      badgeColor: 'blue',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-9 */}
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
                    PF-9 · CxP de Produce First
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconFileInvoice size={14} />
                    Dinero PF
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconCurrencyDollar size={14} />
                    Cuentas por Pagar
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
                      <Text size="16px" fw={800} style={{ color: card.color, lineHeight: 1.2 }}>
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

          {/* SECCIÓN 2: DESCARGA DEL SAT */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconDownload size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  2. Descarga del SAT · Conciliar en la Misma Fila
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Automática
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '800px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Factura</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Proveedor</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Monto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Categoría</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Trasladable
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        ✓
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {satData.map((row) => (
                      <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.factura}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.proveedor}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.concepto}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.monto}
                        </Table.Td>
                        <Table.Td style={{ width: 150 }}>
                          <Select
                            defaultValue={row.categoria}
                            data={['MAQUILA PC', 'FLETES', 'ADUANAS', 'EMPAQUE']}
                            size="xs"
                            styles={{ input: { fontSize: '11px' } }}
                          />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Checkbox
                            defaultChecked={row.trasladable}
                            color="brown"
                            size="xs"
                          />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Button
                            size="xs"
                            color="blue"
                            style={{ padding: '2px 8px', height: 26 }}
                          >
                            ✓
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                lo nacional llega solo · el check <strong>trasladable</strong> manda el gasto al descuento del productor (PF-8)
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 2b: CAPTURA MANUAL · FACTURA EXTRANJERA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconEdit size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  2b. Captura Manual · Factura Extranjera
                </Text>
                <Badge size="xs" color="yellow" variant="light" radius="sm">
                  Sin CFDI
                </Badge>
              </Group>

              <Divider />

              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
                <Select
                  label="Proveedor extranjero"
                  value={proveedorExtranjero}
                  onChange={setProveedorExtranjero}
                  data={['Joe Arévalo (agente USA)', 'Keystone Cold', 'Customs Broker Inc.']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <TextInput
                  label="Invoice #"
                  value={invoiceNum}
                  onChange={(e) => setInvoiceNum(e.currentTarget.value)}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <TextInput
                  label="Monto USD"
                  value={montoUSD}
                  onChange={(e) => setMontoUSD(e.currentTarget.value)}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <TextInput
                  label="TC del día"
                  value={tcDia}
                  onChange={(e) => setTcDia(e.currentTarget.value)}
                  size="xs"
                  description="de PF-BAN"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <Select
                  label="Categoría"
                  value={categoriaExtranjera}
                  onChange={setCategoriaExtranjera}
                  data={['ADUANAS USA', 'FLETES USA', 'INSPECCIONES', 'LOGÍSTICA']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <Select
                  label="Trasladable al productor"
                  value={trasladableProductor}
                  onChange={setTrasladableProductor}
                  data={['Sí — prorratear por embarque', 'No — gasto propio PF']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </SimpleGrid>

              <Divider />

              <Group>
                <Button
                  leftSection={<IconPlus size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                >
                  Agregar a la lista maestra
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                banco extranjero, sin CFDI: 6 campos y entra a la misma lista maestra con su TC. 
                Queda marcada como <strong>extranjera · manual</strong> para el paquete de Contpaqi (sin XML).
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 3, 4, 5: LISTA MAESTRA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconListCheck size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    3-4-5. Lista Maestra · Filtrable · Marcar Pagadas
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    {listaMaestraData.length} registros
                  </Badge>
                </Group>

                <SegmentedControl
                  value={filtroEstatusTab}
                  onChange={setFiltroEstatusTab}
                  data={['Por pagar', 'Vencidas', 'Por vencer 7d', 'Pagadas']}
                  size="xs"
                  color="blue"
                />
              </Group>

              <Group gap="md">
                <Select
                  label="Proveedor"
                  value={filtroProveedor}
                  onChange={setFiltroProveedor}
                  data={['Todos', 'Joe Arévalo', 'Produce Cooling', 'Keystone Cold', 'J.P. Pacheco']}
                  size="xs"
                  w={160}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <Select
                  label="Categoría"
                  value={filtroCategoria}
                  onChange={setFiltroCategoria}
                  data={['Todas', 'ADUANAS USA', 'MAQUILA PC', 'FLETES', 'GASTOS ADUANALES']}
                  size="xs"
                  w={160}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '1100px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ width: 40, textAlign: 'center' }}>
                        <Checkbox
                          size="xs"
                          onChange={(e) => handleSelectAll(e.currentTarget.checked)}
                          checked={selectedRows.length === listaMaestraData.length}
                          indeterminate={selectedRows.length > 0 && selectedRows.length < listaMaestraData.length}
                        />
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Fecha</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Proveedor</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Divisa · TC</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Total MXN
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Saldo
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Crédito</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Vence</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>F. Pago</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Origen</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Estatus
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {listaMaestraData.map((row) => (
                      <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Checkbox
                            size="xs"
                            checked={selectedRows.includes(row.id)}
                            onChange={(e) => handleSelectRow(row.id, e.currentTarget.checked)}
                          />
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.fecha}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.proveedor}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.concepto}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.divisaTc}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.totalMXN}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                          {row.saldo}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.credito}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.vence}</Table.Td>
                        <Table.Td style={{ fontSize: '12px' }}>
                          {row.fPago ? (
                            <Badge size="xs" color="green" variant="light">
                              {row.fPago}
                            </Badge>
                          ) : (
                            <TextInput size="xs" style={{ width: 70 }} placeholder="-- / --" />
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            size="xs"
                            variant="outline"
                            color={row.origen.includes('extranjera') ? 'orange' : 'gray'}
                          >
                            {row.origen}
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge size="xs" color={row.colorEstatus} variant="light">
                            {row.estatus}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              {/* BARRA DE ACCIONES PARA MARCAR PAGADAS */}
              <Paper p="sm" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E7EB' }} radius="md">
                <Group align="flex-end" justify="space-between">
                  <Group gap="md">
                    <TextInput
                      label="Seleccionadas"
                      value={selectedRows.length.toString()}
                      readOnly
                      size="xs"
                      w={100}
                      styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                    />
                    <TextInput
                      label="Fecha de pago"
                      placeholder="-- / --"
                      value={fechaPagoAccion}
                      onChange={(e) => setFechaPagoAccion(e.currentTarget.value)}
                      size="xs"
                      w={130}
                      styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                    />
                    <Select
                      label="Banco (ref.)"
                      value={bancoRefAccion}
                      onChange={setBancoRefAccion}
                      data={['Cuenta PF ****8841', 'Cuenta USD ****1092', 'Caja Chica']}
                      size="xs"
                      w={180}
                      styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                    />
                  </Group>

                  <Button
                    leftSection={<IconCheck size={16} />}
                    size="xs"
                    style={{ backgroundColor: '#1A4B8C' }}
                    disabled={selectedRows.length === 0}
                  >
                    Marcar pagadas
                  </Button>
                </Group>
              </Paper>
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
              <IconCheck size={18} color="#16A34A" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text size="xs" c="#15803D" style={{ flex: 1, lineHeight: 1.5 }}>
                <strong>✓ Al guardar:</strong> lo trasladable se prorratea al embarque y se descuenta al productor (PF-8) — 
                neto en cero para PF — lo demás cae a su categoría del presupuesto (PF-10) · 
                el flujo de PF-BAN se proyecta con estos vencimientos.
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
                <strong>✓ PF-9:</strong> la CxP de Produce First integra facturas SAT (automáticas) y 
                facturas extranjeras (manuales) · el check trasladable permite que los gastos 
                se descuenten directamente a los productores vía PF-8.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}