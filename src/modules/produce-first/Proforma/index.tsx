// src/modules/produce-first/PF5_ProformaInstruccionEmbarque.tsx

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
  ThemeIcon,
  Divider,
  ScrollArea,
  Badge,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconFileText,
  IconTruckDelivery,
  IconCheck,
  IconInfoCircle,
  IconTruck,
  IconBox,
  IconUsers,
  IconCalendar,
  IconFileInvoice,
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

interface PartidaItem {
  producto: string;
  cajas: number;
  precio: number;
  subtotal: string;
  folio1: string;
  cajas1: number;
  folio2: string;
  cajas2: number | string;
  folio3: string;
  cajas3: number | string;
}

interface ProformaItem {
  proforma: string;
  cliente: string;
  salida: string;
  cajas: string;
  valor: string;
  pcAcepto: string;
  cargaConfirmada: string;
  docs: string;
  estatus: string;
  badgeColor: string;
}

export function ProformaInstruccionEmbarqueView() {
  const [filtroCliente, setFiltroCliente] = useState<string | null>('Todos');
  const [filtroEstatus, setFiltroEstatus] = useState<string | null>('Todas');
  const [vistaRango, setVistaRango] = useState('Semana');

  // Datos Mock Captura Partidas
  const partidasData: PartidaItem[] = [
    {
      producto: 'Shanghai Bok Choy',
      cajas: 540,
      precio: 13.50,
      subtotal: '$7,290',
      folio1: 'DV-2725 (584 disp.)',
      cajas1: 540,
      folio2: '—',
      cajas2: '',
      folio3: '—',
      cajas3: '',
    },
    {
      producto: 'Coliflor',
      cajas: 280,
      precio: 18.60,
      subtotal: '$5,208',
      folio1: 'ZER-118 (280 disp.)',
      cajas1: 280,
      folio2: '—',
      cajas2: '',
      folio3: '—',
      cajas3: '',
    },
    {
      producto: 'Choy Mieu',
      cajas: 176,
      precio: 18.50,
      subtotal: '$3,256',
      folio1: 'JAV-0512 (176 disp.)',
      cajas1: 176,
      folio2: '—',
      cajas2: '',
      folio3: '—',
      cajas3: '',
    },
    {
      producto: 'Baby Bok Choy',
      cajas: 450,
      precio: 14.20,
      subtotal: '$6,390',
      folio1: 'DV-2721 (390 disp.)',
      cajas1: 390,
      folio2: 'DV-2718',
      cajas2: 60,
      folio3: '—',
      cajas3: '',
    },
  ];

  // Datos Mock Proformas de la Semana
  const proformasHistorico: ProformaItem[] = [
    {
      proforma: 'PRF-0147',
      cliente: 'Fresh Direct',
      salida: '28-nov',
      cajas: '1,446',
      valor: '$22,144',
      pcAcepto: '—',
      cargaConfirmada: '—',
      docs: 'proforma ✓',
      estatus: 'borrador',
      badgeColor: 'gray',
    },
    {
      proforma: 'PRF-0146',
      cliente: 'GreenLeaf',
      salida: '27-nov',
      cajas: '1,280',
      valor: '$18,940',
      pcAcepto: '✓ 14:05',
      cargaConfirmada: 'en carga',
      docs: 'proforma ✓ · fito ✓',
      estatus: 'aceptada · cargando',
      badgeColor: 'blue',
    },
    {
      proforma: 'PRF-0145',
      cliente: 'Grubmarket',
      salida: '26-nov',
      cajas: '990',
      valor: '$14,240',
      pcAcepto: '✓',
      cargaConfirmada: '✓ 26-nov 17:40',
      docs: 'factura ✓ · XML ✓',
      estatus: 'facturada ✓',
      badgeColor: 'green',
    },
    {
      proforma: 'PRF-0144',
      cliente: 'Fresh Direct',
      salida: '25-nov',
      cajas: '1,120',
      valor: '$15,890',
      pcAcepto: '✓',
      cargaConfirmada: '✓ · difirió: −12 cj en DV-2716',
      docs: 'completo',
      estatus: 'facturada · con ajuste',
      badgeColor: 'amber',
    },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'La Pre-Factura',
      value: 'Proforma = Instrucción',
      sub: 'tus columnas exactas del AppSheet',
      icon: IconFileText,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Instrucción',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'El Viaje',
      value: 'PF → PC → Confirmación',
      sub: 'al confirmar, inventario baja solo',
      icon: IconTruckDelivery,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Flujo',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Proformas de Hoy',
      value: '3',
      sub: '1 aceptada · 1 cargándose · 1 borrador',
      icon: IconFileInvoice,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Activas',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Trazabilidad',
      value: 'Folios de Cosecha',
      sub: 'hasta 3 folios por renglón',
      icon: IconBox,
      color: '#1864AB',
      bgColor: '#E7F5FF',
      badge: 'Origen',
      badgeColor: 'blue',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-5 */}
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
                    PF-5 · Proforma · Instrucción de Embarque
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconTruck size={14} />
                    Venta y Embarque
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconFileText size={14} />
                    Pre-Factura
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

          {/* SECCIÓN 1: CAPTURA · NUEVA PROFORMA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconFileText size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Captura · Nueva Proforma
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  PRF-2026-0147
                </Badge>
              </Group>

              <Divider />

              {/* CAMPOS DEL ENCABEZADO */}
              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
                <TextInput
                  label="Folio proforma"
                  value="PRF-2026-0147"
                  readOnly
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />

                <Select
                  label="Cliente"
                  defaultValue="Fresh Direct - Vancouver"
                  data={['Fresh Direct - Vancouver', 'GreenLeaf', 'Grubmarket']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />

                <Select
                  label="Bodega destino"
                  defaultValue="Vancouver BC"
                  data={['Vancouver BC', 'Los Angeles CA', 'McAllen TX']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />

                <TextInput
                  label="Fecha de salida"
                  defaultValue="vie 28-nov-2026"
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <TextInput
                  label="Camión / placas"
                  defaultValue="Torton R-448 · caja 53'"
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <Select
                  label="Fletero"
                  defaultValue="Transportes McAllen SA"
                  data={['Transportes McAllen SA', 'Fletes del Norte', 'Logística Express']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </SimpleGrid>

              {/* TABLA DE PARTIDAS MULTI-FOLIO */}
              <Stack gap="xs" mt="xs">
                <Text size="12px" fw={600} c="#1A3A5C">
                  Partidas · producto → precio → de qué folios sale
                </Text>

                <ScrollArea style={{ width: '100%' }}>
                  <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '1000px' }}>
                    <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Producto</Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                          Cajas
                        </Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                          Precio
                        </Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                          Subtotal
                        </Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio 1</Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                          Cajas 1
                        </Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio 2</Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                          Cajas 2
                        </Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Folio 3</Table.Th>
                        <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                          Cajas 3
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {partidasData.map((row, idx) => (
                        <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                          <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                            {row.producto}
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center', backgroundColor: '#FEF9C3', fontSize: '12px', fontWeight: 700 }}>
                            {row.cajas}
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center', backgroundColor: '#FEF9C3', fontSize: '12px', fontWeight: 700 }}>
                            ${row.precio.toFixed(2)}
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right', fontSize: '12px', color: '#4B5563' }}>
                            {row.subtotal}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '11px', color: '#4B5563' }}>{row.folio1}</Table.Td>
                          <Table.Td style={{ textAlign: 'center', backgroundColor: '#FEF9C3', fontSize: '12px', fontWeight: 700 }}>
                            {row.cajas1}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '11px', color: '#6B7280' }}>{row.folio2}</Table.Td>
                          <Table.Td style={{ textAlign: 'center', backgroundColor: '#FEF9C3', fontSize: '12px', fontWeight: 700 }}>
                            {row.cajas2}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '11px', color: '#6B7280' }}>{row.folio3}</Table.Td>
                          <Table.Td style={{ textAlign: 'center', backgroundColor: '#FEF9C3', fontSize: '12px', fontWeight: 700 }}>
                            {row.cajas3}
                          </Table.Td>
                        </Table.Tr>
                      ))}

                      {/* FILA TOTAL */}
                      <Table.Tr style={{ backgroundColor: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>TOTAL</Table.Td>
                        <Table.Td style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#111827' }}>1,446</Table.Td>
                        <Table.Td></Table.Td>
                        <Table.Td style={{ textAlign: 'right', fontSize: '12px', fontWeight: 800, color: '#1A4B8C' }}>$22,144</Table.Td>
                        <Table.Td colSpan={6}></Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Stack>

              {/* COSTOS DEL EMBARQUE */}
              <Stack gap="xs" mt="xs">
                <Text size="12px" fw={600} c="#1A3A5C">
                  Costos del Embarque
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
                  <TextInput
                    label="Costo flete"
                    defaultValue="$38,500 MXN"
                    size="xs"
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <TextInput
                    label="Costo fito / derechos"
                    defaultValue="$1,840 + $390"
                    size="xs"
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <TextInput
                    label="Costo aduana total"
                    defaultValue="$265 USD"
                    size="xs"
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <TextInput
                    label="Comisión"
                    defaultValue="10% + $0.15/cj automático"
                    size="xs"
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                </SimpleGrid>
              </Stack>

              <Divider />

              <Group>
                <Button
                  leftSection={<IconCheck size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                >
                  Emitir proforma y ENVIAR a Produce Cooling
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                encabezado del camión + partidas con folio de origen · el folio dice de qué boleta de cosecha vino cada caja
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
                <strong>✓ Al guardar:</strong> la proforma viaja a la bandeja de PC (PC-EMB): allá la aceptan, 
                cargan el camión y <strong>confirman folio por folio</strong> cómo se cargó · al confirmar: 
                el inventario PT baja de esos folios exactos, la proforma se vuelve <strong>factura</strong> 
                (PF-6 CxC) y cada partida queda lista para la liquidación de su productor (PF-8) · 
                trazabilidad: cliente → factura → proforma → folio → boleta → sector → postura.
              </Text>
            </Group>
          </Paper>

          {/* SECCIÓN 2: PROFORMAS DE LA SEMANA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconTruckDelivery size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Proformas de la Semana · El Semáforo del Viaje
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    Histórico
                  </Badge>
                </Group>

                <Group gap="md">
                  <Select
                    label="Cliente"
                    value={filtroCliente}
                    onChange={setFiltroCliente}
                    data={['Todos', 'Fresh Direct', 'GreenLeaf', 'Grubmarket']}
                    size="xs"
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Estatus"
                    value={filtroEstatus}
                    onChange={setFiltroEstatus}
                    data={['Todas', 'Borrador', 'Aceptada', 'Facturada']}
                    size="xs"
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <SegmentedControl
                    value={vistaRango}
                    onChange={setVistaRango}
                    data={['Semana', 'Mes']}
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
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Proforma</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cliente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Salida</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Valor</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>PC Aceptó</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Carga Confirmada</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Docs</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Estatus</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {proformasHistorico.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.proforma}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.cliente}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.salida}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.cajas}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.valor}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', color: '#4B5563' }}>{row.pcAcepto}</Table.Td>
                        <Table.Td style={{ fontSize: '11px', color: '#4B5563' }}>{row.cargaConfirmada}</Table.Td>
                        <Table.Td style={{ fontSize: '11px', color: '#4B5563' }}>{row.docs}</Table.Td>
                        <Table.Td>
                          <Badge
                            size="xs"
                            color={row.badgeColor}
                            variant="light"
                          >
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
                <strong>✓ PF-5:</strong> la proforma es la instrucción de embarque que viaja a Produce Cooling (PC-EMB). 
                Al ser confirmada, se convierte en factura (PF-6) y activa la liquidación del productor (PF-8).
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}