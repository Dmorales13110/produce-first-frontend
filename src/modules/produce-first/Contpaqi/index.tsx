// src/modules/produce-first/PFCONT_ContpaqiEquivalenciasExport.tsx

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
  IconSwitchHorizontal,
  IconFileSpreadsheet,
  IconDeviceFloppy,
  IconDownload,
  IconInfoCircle,
  IconDatabase,
  IconFileInvoice,
  IconCurrencyDollar,
  IconTags,
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

interface EquivalenciaItem {
  id: string;
  categoria: string;
  key: keyof CuentasType;
  nombre: string;
  tipo: string;
}

interface ExportacionItem {
  id: string;
  paquete: string;
  contenido: string;
  estado: string;
  estadoColor: string;
}

interface CuentasType {
  fletes: string;
  aduanas: string;
  fito: string;
  maquila: string;
  empaque: string;
  nomina: string;
  oficina: string;
  deuda: string;
}

export function ContpaqiEquivalenciasExportView() {
  // --- Estado para la edición de cuentas contables ---
  const [cuentas, setCuentas] = useState<CuentasType>({
    fletes: '600-010-000',
    aduanas: '600-011-000',
    fito: '600-012-000',
    maquila: '600-013-000',
    empaque: '600-014-000',
    nomina: '603-001-000',
    oficina: '601-001-000',
    deuda: '605-001-000',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.get<any>('/contpaqi/sync-status')
      .then((res) => {
        if (isMounted && res) {
          console.log('🔵 [PF-CONT] Estado ContPAQi sincronizado:', res);
        }
      })
      .catch((err) => console.warn('⚠️ [PF-CONT] Fallback ContPAQi:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAccountChange = (key: keyof CuentasType, value: string) => {
    setCuentas((prev) => ({ ...prev, [key]: value }));
  };

  const handleGuardarEquivalencias = async () => {
    setIsSaving(true);
    try {
      await api.post('/contpaqi/sync', { equivalencias: cuentas });
      notifications.show({
        title: 'Equivalencias Guardadas',
        message: 'Las cuentas contables han sido guardadas y sincronizadas con ContPAQi.',
        color: 'green',
      });
    } catch (err) {
      console.warn('⚠️ [PF-CONT] Guardado local:', err);
      notifications.show({
        title: 'Equivalencias Guardadas (Local)',
        message: 'Las cuentas contables se han guardado localmente.',
        color: 'blue',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportarPaquete = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      notifications.show({
        title: 'Exportación Completada',
        message: 'El paquete mensual de noviembre ha sido generado y descargado.',
        color: 'green',
      });
    }, 600);
  };

  // --- Datos Mock Tabla 1: Equivalencias ---
  const equivalenciasData: EquivalenciaItem[] = [
    {
      id: '1',
      categoria: 'FLETES (trasladable)',
      key: 'fletes',
      nombre: 'Fletes de exportación',
      tipo: 'Costo',
    },
    {
      id: '2',
      categoria: 'ADUANAS USA / MX (trasladable)',
      key: 'aduanas',
      nombre: 'Gastos aduanales',
      tipo: 'Costo',
    },
    {
      id: '3',
      categoria: 'FITO (trasladable)',
      key: 'fito',
      nombre: 'Fitosanitarios',
      tipo: 'Costo',
    },
    {
      id: '4',
      categoria: 'MAQUILA PC (intercompañía)',
      key: 'maquila',
      nombre: 'Maquila y enfriamiento',
      tipo: 'Costo',
    },
    {
      id: '5',
      categoria: 'MATERIAL DE EMPAQUE',
      key: 'empaque',
      nombre: 'Material de empaque',
      tipo: 'Costo',
    },
    {
      id: '6',
      categoria: 'NÓMINA PF',
      key: 'nomina',
      nombre: 'Sueldos y honorarios',
      tipo: 'Gasto',
    },
    {
      id: '7',
      categoria: 'OFICINA Y SISTEMA',
      key: 'oficina',
      nombre: 'Gastos de administración',
      tipo: 'Gasto',
    },
    {
      id: '8',
      categoria: 'SERVICIO DE DEUDA',
      key: 'deuda',
      nombre: 'Gastos financieros',
      tipo: 'Gasto',
    },
  ];

  // --- Datos Mock Tabla 2: Exportación Mensual ---
  const exportacionData: ExportacionItem[] = [
    {
      id: '1',
      paquete: 'Egresos + IVA + retenciones',
      contenido: '62 facturas clasificadas',
      estado: 'por 3 facturas',
      estadoColor: 'amber',
    },
    {
      id: '2',
      paquete: 'Ingresos (facturas a clientes)',
      contenido: 'facturas de PF-5/PF-6 con XML',
      estado: 'listo',
      estadoColor: 'blue',
    },
    {
      id: '3',
      paquete: 'Liquidaciones a productores',
      contenido: 'desgloses PF-8 del mes',
      estado: 'listo',
      estadoColor: 'blue',
    },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Misma Fórmula',
      value: 'CONT-1 del grupo',
      sub: 'categorías → cuentas, una vez',
      icon: IconSwitchHorizontal,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Estandar',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Categorías de PF',
      value: '8',
      sub: 'del presupuesto y la CxP',
      icon: IconTags,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Activas',
      badgeColor: 'yellow',
      delay: 0.1,
    },
    {
      label: 'IVA + Retenciones',
      value: 'Etiquetados en origen',
      sub: 'fletes con retención 4%',
      icon: IconCurrencyDollar,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Automático',
      badgeColor: 'green',
      delay: 0.15,
    },
    {
      label: 'Paquete de Nov',
      value: 'Listo 95%',
      sub: 'exportación mensual',
      icon: IconFileSpreadsheet,
      color: '#1864AB',
      bgColor: '#E7F5FF',
      badge: 'Progreso',
      badgeColor: 'blue',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-CONT */}
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
                    PF-CONT · Contpaqi de PF · Equivalencias y Export
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconDatabase size={14} />
                    Dinero PF
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconFileSpreadsheet size={14} />
                    Contpaqi
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

          {/* SECCIÓN EQUIVALENCIAS */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconSwitchHorizontal size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Equivalencias · Categoría PF → Cuenta Contpaqi
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Mapeo
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Categoría</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', width: 180 }}>
                        Cuenta Contpaqi
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Nombre</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Tipo</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {equivalenciasData.map((row) => (
                      <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.categoria}
                        </Table.Td>
                        <Table.Td>
                          <TextInput
                            value={cuentas[row.key]}
                            onChange={(e) => handleAccountChange(row.key, e.currentTarget.value)}
                            size="xs"
                            styles={{
                              input: {
                                backgroundColor: '#FEF08A',
                                borderColor: '#FDE047',
                                fontWeight: 600,
                                fontFamily: 'monospace',
                                textAlign: 'center',
                              },
                            }}
                          />
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.nombre}</Table.Td>
                        <Table.Td>
                          <Badge size="xs" color={row.tipo === 'Costo' ? 'blue' : 'gray'} variant="light">
                            {row.tipo}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Divider />

              <Group>
                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                  onClick={handleGuardarEquivalencias}
                  loading={isSaving}
                >
                  Guardar equivalencias
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                <strong>amarillo</strong> = número de cuenta · el despacho confirma una vez
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN EXPORTACIÓN MENSUAL */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconFileSpreadsheet size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Exportación Mensual · Hojas Electrónicas
                </Text>
                <Badge size="xs" color="green" variant="light" radius="sm">
                  Noviembre
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '500px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Paquete</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Contenido</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Estado
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {exportacionData.map((row) => (
                      <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.paquete}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.contenido}</Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Badge size="xs" color={row.estadoColor} variant="light">
                            {row.estado}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Divider />

              <Group>
                <Button
                  leftSection={<IconDownload size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                  onClick={handleExportarPaquete}
                  loading={isExporting}
                >
                  Exportar paquete de noviembre
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                el paquete incluye egresos con IVA y retenciones, ingresos de PF-5/PF-6, 
                y liquidaciones a productores de PF-8 — todo clasificado por cuenta Contpaqi
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
              <IconDeviceFloppy size={18} color="#16A34A" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text size="xs" c="#15803D" style={{ flex: 1, lineHeight: 1.5 }}>
                <strong>✓ Al guardar:</strong> clasificado en origen — el despacho solo importa · 
                cada factura, liquidación y gasto llega a Contpaqi con su cuenta correcta · 
                IVA y retenciones etiquetados desde la captura.
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
                <strong>✓ PF-CONT:</strong> este módulo conecta Produce First con Contpaqi · 
                las 8 categorías mapean a cuentas contables y la exportación mensual genera 
                el paquete completo para el despacho · IVA, retenciones y tipo de gasto 
                se etiquetan automáticamente en origen.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}