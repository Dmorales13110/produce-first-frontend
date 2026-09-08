// src/modules/produce-first/PFMAT_MaterialEmpaquePF.tsx

import React, { useState, useEffect } from 'react';
import { api } from '../../../services/apiClient';
import { notifications } from '@mantine/notifications';
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
  IconBox,
  IconTruckDelivery,
  IconReceipt,
  IconScale,
  IconCheck,
  IconInfoCircle,
  IconPackage,
  IconUsers,
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

interface BOMItem {
  componente: string;
  costoCaja: number;
  unidTarima: string;
  proveedor: string;
  diasAnticipo: number;
}

interface SolicitudOCItem {
  componente: string;
  necesidad: string;
  inventario: string;
  aPedir: string;
  pedirAntesDe: string;
  accion: string;
}

interface ConciliacionItem {
  material: string;
  invInicial: string;
  compras: string;
  entregado: string;
  esperado: string;
  conteo: string;
  merma: number;
}

export function MaterialEmpaquePFView() {
  // --- Estados Formulario Captura Entrega a Productor ---
  const [productor, setProductor] = useState<string | null>('Plantisano');
  const [material, setMaterial] = useState<string | null>('Caja SB28 · $39.80');
  const [cantidad, setCantidad] = useState<number | string>(180);
  const [folioRemision, setFolioRemision] = useState('REM-0219');

  // --- Estados Filtros Conciliación ---
  const [filtroMaterial, setFiltroMaterial] = useState<string | null>('Todos');
  const [filtroProductor, setFiltroProductor] = useState<string | null>('Todos');
  const [vistaConciliacion, setVistaConciliacion] = useState('Temporada');

  const [productoresList, setProductoresList] = useState<string[]>(['Plantisano', 'Rancho Los Olivos', 'Agrícola San José']);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.get<any[]>('/growers')
      .then((growers) => {
        if (isMounted && Array.isArray(growers) && growers.length > 0) {
          const names = growers.map((g) => g.name || g.grower_name || g.business_name).filter(Boolean);
          if (names.length > 0) setProductoresList(names);
        }
      })
      .catch((err) => console.warn('⚠️ [PF-MAT] Fallback productores:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRegistrarEntrega = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      notifications.show({
        title: 'Entrega Registrada',
        message: `Se registraron ${cantidad} unidades de ${material} para ${productor} con remisión ${folioRemision}.`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      setFolioRemision(`REM-0${Math.floor(220 + Math.random() * 50)}`);
    }, 400);
  };

  // --- Datos Mock CAPTURA · BOM por producto ---
  const bomData: BOMItem[] = [
    { componente: 'Caja Strongbox SB21', costoCaja: 37.12, unidTarima: '50', proveedor: 'Frescopack', diasAnticipo: 7 },
    { componente: 'Tarima de madera', costoCaja: 4.79, unidTarima: '1', proveedor: 'Joel Solís', diasAnticipo: 2 },
    { componente: 'Esquinero de plástico', costoCaja: 1.41, unidTarima: '4', proveedor: 'Rubén Rmz.', diasAnticipo: 7 },
    { componente: 'Fleje + sello', costoCaja: 0.24, unidTarima: '—', proveedor: 'Flejes Carpa', diasAnticipo: 7 },
    { componente: 'Cubre tarima + papel + etiqueta', costoCaja: 1.99, unidTarima: '—', proveedor: 'Frescopack', diasAnticipo: 7 },
  ];

  // --- Datos Mock Solicitud de OC de material · semana 49 ---
  const solicitudOcData: SolicitudOCItem[] = [
    { componente: 'Caja SB21', necesidad: '9,150', inventario: '6,840', aPedir: '2,310', pedirAntesDe: 'lun 30-nov', accion: 'crear' },
    { componente: 'Cubre tarima', necesidad: '204', inventario: '150', aPedir: '54', pedirAntesDe: 'lun 30-nov', accion: 'crear' },
    { componente: 'Tarima', necesidad: '204', inventario: '310', aPedir: '0', pedirAntesDe: '—', accion: 'ok' },
  ];

  // --- Datos Mock Conciliación del cierre ---
  const conciliacionData: ConciliacionItem[] = [
    { material: 'Caja SB21', invInicial: '2,856 ($107,671)', compras: '900 ($41,724)', entregado: '2,410', esperado: '1,346', conteo: '1,338', merma: -8 },
    { material: 'Caja SB28', invInicial: '1,240', compras: '600', entregado: '980', esperado: '860', conteo: '857', merma: -3 },
    { material: 'Tarima', invInicial: '310', compras: '240', entregado: '384', esperado: '166', conteo: '166', merma: 0 },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'El Material es de PF',
      value: 'PC no compra material',
      sub: 'solo enfría, enhiela y embarca',
      icon: IconPackage,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Ownership',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Costo Real 25-26',
      value: '$1,019,389 USD',
      sub: 'cobrado a productores $1,064,234',
      icon: IconFileInvoice,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Material',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Costo Empaque por Caja',
      value: '$45.53',
      sub: '8 componentes',
      icon: IconBox,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'BOM',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'En Poder de Productores',
      value: '$184K MXN',
      sub: 'por recuperar o descontar',
      icon: IconUsers,
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

          {/* HEADER - PF-MAT */}
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
                    PF-MAT · Material de Empaque
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconBox size={14} />
                    Compras y Material
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconScale size={14} />
                    BOM y Conciliación
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

          {/* SECCIÓN 1: CAPTURA · BOM POR PRODUCTO */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconBox size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Captura · BOM por Producto
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Bill of Materials
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Componente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        $/caja
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Unid/tarima
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Proveedor</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Días Anticipo
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {bomData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 500, color: '#1A3A5C' }}>
                          {row.componente}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#1A4B8C' }}>
                          ${row.costoCaja.toFixed(2)}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center', fontSize: '12px', color: '#4B5563' }}>
                          {row.unidTarima}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.proveedor}</Table.Td>
                        <Table.Td style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#D97706' }}>
                          {row.diasAnticipo}d
                        </Table.Td>
                      </Table.Tr>
                    ))}

                    {/* FILA COSTO / CAJA */}
                    <Table.Tr style={{ backgroundColor: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                      <Table.Td style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>COSTO / CAJA</Table.Td>
                      <Table.Td style={{ textAlign: 'right', fontSize: '12px', fontWeight: 800, color: '#1A4B8C' }}>
                        $45.53
                      </Table.Td>
                      <Table.Td colSpan={3}></Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                amarillo = costo y consumo por caja · con días de anticipo del proveedor
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 2: SOLICITUD DE OC DE MATERIAL */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconTruckDelivery size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Solicitud de OC de Material · Semana 49
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Automática
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Componente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Necesidad S49
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Inventario
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        A Pedir
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Pedir antes de</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Acción
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {solicitudOcData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.componente}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.necesidad}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.inventario}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>
                          {row.aPedir}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.pedirAntesDe}</Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          {row.accion === 'crear' ? (
                            <Button
                              size="xs"
                              style={{ backgroundColor: '#1A4B8C', height: 22, fontSize: '10px' }}
                            >
                              Crear OC
                            </Button>
                          ) : (
                            <Badge size="xs" color="green" variant="light">
                              ok
                            </Badge>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                BOM × programa de ventas (PF-2) − inventario = la solicitud de OC nace sola, tú solo la autorizas
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 3: CAPTURA · ENTREGA DE MATERIAL A PRODUCTOR */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconReceipt size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Captura · Entrega de Material a Productor
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Descuento Automático
                </Badge>
              </Group>

              <Divider />

              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
                <Select
                  label="Productor"
                  value={productor}
                  onChange={setProductor}
                  data={productoresList}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <Select
                  label="Material"
                  value={material}
                  onChange={setMaterial}
                  data={['Caja SB28 · $39.80', 'Caja SB21 · $37.12', 'Tarima madera · $4.79']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <NumberInput
                  label="Cantidad"
                  value={cantidad}
                  onChange={setCantidad}
                  size="xs"
                  min={0}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <TextInput
                  label="Folio remisión"
                  value={folioRemision}
                  onChange={(e) => setFolioRemision(e.currentTarget.value)}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </SimpleGrid>

              <Divider />

              <Group>
                <Button
                  leftSection={<IconCheck size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                  onClick={handleRegistrarEntrega}
                  loading={isSaving}
                >
                  Registrar entrega
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                3 campos · el precio descontado lo trae el catálogo (tu formato: SB28 a $39.80) · 
                se carga a su cuenta corriente (PF-7)
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 4: CONCILIACIÓN DEL CIERRE */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconScale size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Conciliación del Cierre
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    Cierre de Cuentas
                  </Badge>
                </Group>

                <Group gap="md">
                  <Select
                    label="Material"
                    value={filtroMaterial}
                    onChange={setFiltroMaterial}
                    data={['Todos', 'Caja SB21', 'Caja SB28', 'Tarima']}
                    size="xs"
                    w={130}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Productor"
                    value={filtroProductor}
                    onChange={setFiltroProductor}
                    data={['Todos', 'Plantisano', 'Rancho Los Olivos']}
                    size="xs"
                    w={130}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <SegmentedControl
                    value={vistaConciliacion}
                    onChange={setVistaConciliacion}
                    data={['Temporada', 'Mes']}
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
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Material</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Inv. Inicial
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Compras (OC)
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Entregado
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Esperado
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Conteo
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Capturar
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Merma
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {conciliacionData.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.material}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.invInicial}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.compras}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.entregado}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.esperado}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#1F5C3A' }}>
                          {row.conteo}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Button
                            variant="subtle"
                            color="blue"
                            size="xs"
                            style={{ height: 20, fontSize: '10px', padding: '0 6px' }}
                          >
                            capturar
                          </Button>
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: row.merma < 0 ? '#DC2626' : '#4B5563' }}>
                          {row.merma}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                inicial + compras − entregas = esperado vs conteo → merma con nombre
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
              <IconCheck size={18} color="#16A34A" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text size="xs" c="#15803D" style={{ flex: 1, lineHeight: 1.5 }}>
                <strong>✓ Al guardar:</strong> las OCs de material entran a la CxP de PF (PF-9) al llegar su XML · 
                lo entregado se descuenta solo en la liquidación (PF-8) · el costo de $45.53/cj alimenta el cobro 
                de empaque a productores — el ciclo completo vive en PF, y PC solo lo usa en línea.
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
                <strong>✓ PF-MAT:</strong> el material de empaque es propiedad de Produce First · 
                se entrega a productores, se descuenta en PF-8 (Liquidaciones) y se concilia físicamente 
                con conteos de inventario · las solicitudes de OC nacen automáticamente del BOM × programa de ventas.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}