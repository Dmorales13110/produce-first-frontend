// src/modules/produce-first/PFOC_OrdenesCompraPF.tsx

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
  TextInput,
  NumberInput,
  Badge,
  ThemeIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconShoppingCart,
  IconLink,
  IconCheck,
  IconInfoCircle,
  IconTruck,
  IconPackage,
  IconFileInvoice,
  IconClock,
  IconCurrencyDollar,
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

interface OCItem {
  oc: string;
  proveedor: string;
  categoria: string;
  total: string;
  estatus: string;
  badgeColor: string;
  cxp: string;
  nota: string;
}

export function OrdenesCompraPFView() {
  // --- Estados del Formulario de Captura ---
  const [proveedor, setProveedor] = useState<string | null>('Fletes GTO Norte');
  const [categoria, setCategoria] = useState<string | null>('FLETES (trasladable)');
  const [fechaEntrega, setFechaEntrega] = useState('vie 28-nov');
  const [divisa, setDivisa] = useState<string | null>('MXN');

  const [concepto1, setConcepto1] = useState('Flete Celaya–McAllen · camión 47');
  const [cantidad1, setCantidad1] = useState<number | string>(1);
  const [precio1, setPrecio1] = useState<number | string>(38500);

  const [concepto2, setConcepto2] = useState('');
  const [cantidad2, setCantidad2] = useState<number | string>('');
  const [precio2, setPrecio2] = useState<number | string>('');

  // --- Estados de Filtro Tabla Seguimiento ---
  const [filtroProveedor, setFiltroProveedor] = useState<string | null>('Todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>('Todas');
  const [filtroEstatus, setFiltroEstatus] = useState('Abiertas');

  // --- Datos Mock Seguimiento de OCs ---
  const ocsData: OCItem[] = [
    {
      oc: 'OC-PF-0052',
      proveedor: 'Fletes GTO Norte',
      categoria: 'FLETES (trasladable)',
      total: '$38,500',
      estatus: 'autorizada',
      badgeColor: 'blue',
      cxp: 'al llegar factura',
      nota: 'camión 47',
    },
    {
      oc: 'OC-PF-0051',
      proveedor: 'Frescopack',
      categoria: 'MATERIAL',
      total: '$41,724',
      estatus: 'recibida',
      badgeColor: 'amber',
      cxp: 'F-8812 conciliada ✓',
      nota: 'nació en PF-MAT',
    },
    {
      oc: 'OC-PF-0050',
      proveedor: 'Joe Arévalo',
      categoria: 'ADUANAS USA',
      total: 'USD $912.56',
      estatus: 'servicio en curso',
      badgeColor: 'yellow',
      cxp: 'entrará como extranjera manual',
      nota: 'embarques nov',
    },
  ];

  const totalCalculado =
    (Number(cantidad1) || 0) * (Number(precio1) || 0) +
    (Number(cantidad2) || 0) * (Number(precio2) || 0);

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Misma Fórmula',
      value: 'OC-1 del Grower',
      sub: 'captura + seguimiento con cascada',
      icon: IconShoppingCart,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Estandar',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'OCs Vivas',
      value: '5',
      sub: '$182K MXN + $1,240 USD',
      icon: IconFileInvoice,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Activas',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Las de Material',
      value: 'Nacen en PF-MAT',
      sub: 'y aparecen aquí en seguimiento',
      icon: IconPackage,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Automático',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Sin OC no hay Pago Sorpresa',
      value: 'XML llega y ya sabe',
      sub: 'la factura se concilia contra la OC',
      icon: IconTruck,
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

          {/* HEADER - PF-OC */}
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
                    PF-OC · Órdenes de Compra de PF
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconShoppingCart size={14} />
                    Compras y Material
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconFileInvoice size={14} />
                    Control de Gastos
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

          {/* SECCIÓN 1: CAPTURA · NUEVA ÓRDEN DE COMPRA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconShoppingCart size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Nueva Orden de Compra de PF
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  OC-PF-2026-0052
                </Badge>
              </Group>

              <Divider />

              {/* CAMPOS DEL ENCABEZADO */}
              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
                <TextInput
                  label="No. de OC"
                  value="OC-PF-2026-0052"
                  readOnly
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />

                <Select
                  label="Proveedor"
                  value={proveedor}
                  onChange={setProveedor}
                  data={['Fletes GTO Norte', 'Frescopack', 'Joe Arévalo']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />

                <Select
                  label="Categoría"
                  value={categoria}
                  onChange={setCategoria}
                  data={['FLETES (trasladable)', 'MATERIAL', 'ADUANAS USA', 'SERVICIOS']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />

                <TextInput
                  label="Entrega / servicio"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.currentTarget.value)}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="sm">
                <Select
                  label="Divisa"
                  value={divisa}
                  onChange={setDivisa}
                  data={['MXN', 'USD']}
                  size="xs"
                  w={140}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </SimpleGrid>

              {/* TABLA DE PARTIDAS */}
              <Stack gap="xs" mt="xs">
                <Text size="12px" fw={600} c="#1A3A5C">
                  Partidas
                </Text>

                <ScrollArea style={{ width: '100%' }}>
                  <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
                    <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                      <Table.Tr>
                        <Table.Th style={{ width: 40, fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                          #
                        </Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Concepto</Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 140 }}>
                          Cantidad
                        </Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 160 }}>
                          Precio Unit.
                        </Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 140 }}>
                          Importe
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {/* RENGLÓN 1 */}
                      <Table.Tr style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'center', color: '#6B7280' }}>1</Table.Td>
                        <Table.Td style={{ fontSize: '12px' }}>
                          <TextInput
                            variant="unstyled"
                            size="xs"
                            value={concepto1}
                            onChange={(e) => setConcepto1(e.currentTarget.value)}
                            styles={{ input: { fontSize: '12px' } }}
                          />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <NumberInput
                            size="xs"
                            variant="unstyled"
                            styles={{ input: { textAlign: 'center', fontWeight: 700 } }}
                            value={cantidad1}
                            onChange={setCantidad1}
                            min={0}
                          />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <NumberInput
                            size="xs"
                            variant="unstyled"
                            styles={{ input: { textAlign: 'center', fontWeight: 700 } }}
                            prefix="$"
                            thousandSeparator=","
                            value={precio1}
                            onChange={setPrecio1}
                            min={0}
                          />
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          ${((Number(cantidad1) || 0) * (Number(precio1) || 0)).toLocaleString()}
                        </Table.Td>
                      </Table.Tr>

                      {/* RENGLÓN 2 */}
                      <Table.Tr style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'center', color: '#6B7280' }}>2</Table.Td>
                        <Table.Td style={{ fontSize: '12px' }}>
                          <TextInput
                            variant="unstyled"
                            size="xs"
                            placeholder="Concepto adicional..."
                            value={concepto2}
                            onChange={(e) => setConcepto2(e.currentTarget.value)}
                            styles={{ input: { fontSize: '12px' } }}
                          />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <NumberInput
                            size="xs"
                            variant="unstyled"
                            styles={{ input: { textAlign: 'center', fontWeight: 700 } }}
                            value={cantidad2}
                            onChange={setCantidad2}
                            min={0}
                          />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <NumberInput
                            size="xs"
                            variant="unstyled"
                            styles={{ input: { textAlign: 'center', fontWeight: 700 } }}
                            prefix="$"
                            thousandSeparator=","
                            value={precio2}
                            onChange={setPrecio2}
                            min={0}
                          />
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {((Number(cantidad2) || 0) * (Number(precio2) || 0)) > 0
                            ? `$${((Number(cantidad2) || 0) * (Number(precio2) || 0)).toLocaleString()}`
                            : ''}
                        </Table.Td>
                      </Table.Tr>

                      {/* FILA TOTAL */}
                      <Table.Tr style={{ backgroundColor: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                        <Table.Td colSpan={4} style={{ fontSize: '12px', fontWeight: 800, textAlign: 'right', color: '#111827' }}>
                          TOTAL
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right', fontSize: '12px', fontWeight: 800, color: '#1A4B8C' }}>
                          ${totalCalculado.toLocaleString()}
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Stack>

              <Divider />

              <Group>
                <Button
                  leftSection={<IconCheck size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                >
                  Guardar y autorizar OC
                </Button>
              </Group>

              {/* Callout Banner Informativo Interno */}
              <Paper
                p="sm"
                radius="sm"
                style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}
              >
                <Group align="flex-start" gap="xs">
                  <IconInfoCircle size={16} color="#92400E" style={{ marginTop: 1, flexShrink: 0 }} />
                  <Text size="xs" c="#92400E" style={{ lineHeight: 1.5 }}>
                    <strong>✓ Al guardar:</strong> al llegar la factura, PF-9 la concilia contra esta OC · 
                    si es trasladable, el check ya viene sugerido · las OC de material nacen de la solicitud 
                    automática en PF-MAT y aquí solo se les da seguimiento.
                  </Text>
                </Group>
              </Paper>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                la categoría es obligatoria — con ella la factura (SAT o extranjera manual) llega costeada 
                contra el presupuesto
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 2: SEGUIMIENTO DE OCs */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconLink size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Seguimiento de OCs
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    {ocsData.length} activas
                  </Badge>
                </Group>

                <Group gap="md">
                  <Select
                    label="Proveedor"
                    value={filtroProveedor}
                    onChange={setFiltroProveedor}
                    data={['Todos', 'Fletes GTO Norte', 'Frescopack', 'Joe Arévalo']}
                    size="xs"
                    w={140}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Categoría"
                    value={filtroCategoria}
                    onChange={setFiltroCategoria}
                    data={['Todas', 'FLETES (trasladable)', 'MATERIAL', 'ADUANAS USA']}
                    size="xs"
                    w={140}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <SegmentedControl
                    value={filtroEstatus}
                    onChange={setFiltroEstatus}
                    data={['Abiertas', 'Recibidas', 'Todas']}
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
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>OC</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Proveedor</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Categoría</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Total</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Estatus</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>→ CxP</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>→ Nota</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {ocsData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.oc}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.proveedor}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.categoria}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.total}
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            size="xs"
                            color={row.badgeColor}
                            variant="light"
                          >
                            {row.estatus}
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', color: '#4B5563' }}>{row.cxp}</Table.Td>
                        <Table.Td style={{ fontSize: '11px', color: '#6B7280' }}>{row.nota}</Table.Td>
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
                <strong>✓ PF-OC:</strong> las órdenes de compra son el control de gastos de Produce First · 
                se concilian contra facturas en PF-9 (CxP) y se categorizan para costear correctamente cada 
                operación · las OC de material nacen automáticamente desde PF-MAT.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}