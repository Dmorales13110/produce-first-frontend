// src/modules/produce-first/ProduceFirstDashboard.tsx

import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Text,
  Group,
  Stack,
  SimpleGrid,
  Badge,
  ThemeIcon,
  Divider,
  Progress,
  Table,
  ScrollArea,
  Select,
  SegmentedControl,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconLeaf,
  IconSnowflake,
  IconCurrencyDollar,
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconInfoCircle,
  IconCalendar,
  IconTruck,
  IconBox,
  IconUsers,
  IconReceipt,
  IconDashboard,
  IconShoppingCart,
  IconPlant,
  IconEdit,
  IconCreditCardPay,
  IconCreditCardHand,
  IconCashBanknote,
  IconChartPie,
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

interface ClienteItem {
  cliente: string;
  ciudad: string;
  taxId: string;
  credito: string;
  cajas: string;
  ventaUsd: string;
  avgCj: string;
}

interface ProductorItem {
  productor: string;
  contacto: string;
  modalidad: string;
  especialidad: string;
  cajas: string;
  ventaUsd: string;
}

export function ProduceFirstDashboardView() {
  // --- Filtros ---
  const [filtroPais, setFiltroPais] = useState<string | null>('Todos');
  const [estadoClientes, setEstadoClientes] = useState('Activos');

  // --- Datos Mock Clientes ---
  const clientesData: ClienteItem[] = [
    { cliente: 'GreenLeaf Produce', ciudad: 'Maspeth NY', taxId: '824188850', credito: '15d', cajas: '98,515', ventaUsd: '$1,252,035', avgCj: '$12.71' },
    { cliente: 'Grubmarket', ciudad: 'Brooklyn NY', taxId: '464890268', credito: '15d', cajas: '74,743', ventaUsd: '$1,085,476', avgCj: '$14.52' },
    { cliente: 'Fresh Direct', ciudad: 'Vancouver', taxId: '856228887', credito: '15d', cajas: '55,986', ventaUsd: '$793,558', avgCj: '$14.17' },
    { cliente: 'Tay Shing', ciudad: 'Markham ON', taxId: '812221158', credito: '15d', cajas: '50,085', ventaUsd: '$679,139', avgCj: '$13.56' },
    { cliente: 'Manley Sales', ciudad: 'Scarborough', taxId: '856592175', credito: '15d', cajas: '42,478', ventaUsd: '$519,918', avgCj: '$12.24' },
  ];

  // --- Datos Mock Productores ---
  const productoresData: ProductorItem[] = [
    { productor: 'Daily Veggies', contacto: 'Efrén Hernández', modalidad: '10% + $0.15 enfriado', especialidad: 'Shanghai Bok · Baby Bok', cajas: '147,467', ventaUsd: '$1,937,112' },
    { productor: 'Agrícola JAV', contacto: 'Raúl Monter', modalidad: '10% + $0.15 enfriado', especialidad: 'Mieu · Coliflor', cajas: '93,839', ventaUsd: '$1,220,559' },
    { productor: 'Daniel Zermeño', contacto: 'Cristóbal Loza', modalidad: '10% + $0.15 enfriado', especialidad: 'Coliflor · Celtuce · Mini Napa', cajas: '81,601', ventaUsd: '$1,047,046' },
    { productor: 'Fernando García', contacto: 'Fernando García', modalidad: '10% + $0.15 enfriado', especialidad: 'Snow Pea Tips (~1,500 cj/sem)', cajas: '48,075', ventaUsd: '$640,803' },
    { productor: 'Plantisano', contacto: 'Ismael Padilla', modalidad: '10% + $0.15 enfriado', especialidad: 'Coliflor', cajas: '12,822', ventaUsd: '$189,129' },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Clientes Activos',
      value: '15',
      sub: 'USA + Canadá · todos a 15 días',
      icon: IconShoppingCart,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Activos',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Productores',
      value: '10',
      sub: '9 a comisión 10% · 1 precio fijo',
      icon: IconPlant,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Activos',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Anticipos por Producto',
      value: '$3.00–$4.50 USD/cj',
      sub: 'capturables aquí, una vez',
      icon: IconCurrencyDollar,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Configurable',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Módulos Integrados',
      value: 'PF-2 a PF-9',
      sub: 'sin catálogo no hay programa ni liquidación',
      icon: IconBuildingStore,
      color: '#1864AB',
      bgColor: '#E7F5FF',
      badge: 'Ecosistema',
      badgeColor: 'blue',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - Dashboard Produce First */}
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
                    Dashboard Produce First
                  </Text>
                  <Text size="xs" c="dimmed">
                    Catálogos · Clientes, Productores y Anticipos · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconShoppingCart size={14} />
                    PF-1
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconBuildingStore size={14} />
                    Comercializadora
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

          {/* SECCIÓN 1: CLIENTES */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconShoppingCart size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Clientes · Datos Reales 25-26
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    Exportación
                  </Badge>
                </Group>

                <Group gap="md">
                  <Select
                    label="País"
                    value={filtroPais}
                    onChange={setFiltroPais}
                    data={['Todos', 'USA', 'Canadá']}
                    size="xs"
                    w={120}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <SegmentedControl
                    value={estadoClientes}
                    onChange={setEstadoClientes}
                    data={['Activos', 'Todos']}
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
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Ciudad</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>TAX ID</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Crédito</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas 25-26</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Venta USD</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>$/cj prom</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {clientesData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>{row.cliente}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.ciudad}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.taxId}</Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge size="xs" color="yellow" variant="light">
                            {row.credito}
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>{row.cajas}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.ventaUsd}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>{row.avgCj}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="11px" c="dimmed">+ 10 más (Trudeau, YW, Lucky Taro...)</Text>
              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                el crédito calcula el vencimiento de cada factura en PF-6
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 2: PRODUCTORES */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconPlant size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Productores · con Modalidad y Anticipo
                </Text>
                <Badge size="xs" color="green" variant="light" radius="sm">
                  10 Activos
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '800px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Productor</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Contacto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Modalidad</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Especialidad</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas 25-26</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Venta USD</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {productoresData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>{row.productor}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.contacto}</Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge size="xs" color="amber" variant="outline" style={{ backgroundColor: '#FFFBEB' }}>
                            {row.modalidad}
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.especialidad}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>{row.cajas}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.ventaUsd}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="11px" c="dimmed">+ 5 más (Mafe, Agrijiusa, Mandujano...)</Text>
              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                dos conceptos 26-27: <strong>comisión 10%</strong> sobre venta + <strong>enfriado $0.15/cj</strong> — aplica a San Aparicio, La Escondida y Fernando García (tips)
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 3: CAPTURA DE ANTICIPOS */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconEdit size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Captura · Anticipos por Producto
                </Text>
                <Badge size="xs" color="yellow" variant="light" radius="sm">
                  Configuración
                </Badge>
              </Group>

              <Divider />

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                <Stack gap="xs">
                  <Paper p="sm" radius="md" withBorder style={{ borderColor: '#F0F4FF' }}>
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <ThemeIcon size="sm" radius="md" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                          <IconBox size={14} />
                        </ThemeIcon>
                        <Text size="12px" fw={600} c="#1A3A5C">Napa / Baby Napa / Big Bok / Flat Cab.</Text>
                      </Group>
                      <Text size="14px" fw={800} c="#D97706">$3.00</Text>
                    </Group>
                  </Paper>

                  <Paper p="sm" radius="md" withBorder style={{ borderColor: '#F0F4FF' }}>
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <ThemeIcon size="sm" radius="md" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                          <IconBox size={14} />
                        </ThemeIcon>
                        <Text size="12px" fw={600} c="#1A3A5C">Celtuce</Text>
                      </Group>
                      <Text size="14px" fw={800} c="#D97706">$4.50</Text>
                    </Group>
                  </Paper>

                  <Paper p="sm" radius="md" withBorder style={{ borderColor: '#F0F4FF' }}>
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <ThemeIcon size="sm" radius="md" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                          <IconBox size={14} />
                        </ThemeIcon>
                        <Text size="12px" fw={600} c="#1A3A5C">Snow Pea Tips</Text>
                      </Group>
                      <Text size="12px" c="dimmed" style={{ fontStyle: 'italic' }}>precio fijo — sin anticipo</Text>
                    </Group>
                  </Paper>
                </Stack>

                <Stack gap="xs">
                  <Paper p="sm" radius="md" withBorder style={{ borderColor: '#F0F4FF' }}>
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <ThemeIcon size="sm" radius="md" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                          <IconBox size={14} />
                        </ThemeIcon>
                        <Text size="12px" fw={600} c="#1A3A5C">Shanghai Bok / Baby Bok</Text>
                      </Group>
                      <Text size="14px" fw={800} c="#D97706">$3.50</Text>
                    </Group>
                  </Paper>

                  <Paper p="sm" radius="md" withBorder style={{ borderColor: '#F0F4FF' }}>
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <ThemeIcon size="sm" radius="md" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                          <IconBox size={14} />
                        </ThemeIcon>
                        <Text size="12px" fw={600} c="#1A3A5C">Mieu / Coliflor</Text>
                      </Group>
                      <Text size="14px" fw={800} c="#D97706">$3.50</Text>
                    </Group>
                  </Paper>

                  <Paper p="sm" radius="md" withBorder style={{ borderColor: '#F0F4FF' }}>
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <ThemeIcon size="sm" radius="md" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                          <IconBox size={14} />
                        </ThemeIcon>
                        <Text size="12px" fw={600} c="#1A3A5C">Mini Napa</Text>
                      </Group>
                      <Text size="14px" fw={800} c="#D97706">$3.00</Text>
                    </Group>
                  </Paper>
                </Stack>
              </SimpleGrid>

              <Divider />

              <Paper p="md" radius="lg" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <Group align="flex-start" gap="xs">
                  <IconInfoCircle size={18} color="#16A34A" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Text size="xs" c="#15803D" style={{ flex: 1, lineHeight: 1.5 }}>
                    <strong>✓ Al guardar:</strong> tus montos reales · la recepción escaneada (ESC-1) dispara el anticipo con este monto automáticamente.
                  </Text>
                </Group>
              </Paper>
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
                <strong>✓ PF-1:</strong> este es el catálogo base que alimenta todos los módulos del ecosistema Produce First — 
                sin esta configuración no hay programa de producción ni liquidaciones.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}