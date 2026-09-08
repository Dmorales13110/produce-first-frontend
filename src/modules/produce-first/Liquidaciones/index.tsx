// src/modules/produce-first/PFLQC_LiquidacionesQuejasClientes.tsx

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
  SimpleGrid,
  TextInput,
  Badge,
  ThemeIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconAlertCircle,
  IconChecklist,
  IconReceiptRefund,
  IconCheck,
  IconInfoCircle,
  IconUsers,
  IconFileInvoice,
  IconPackage,
  IconClock,
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

interface RevisionItem {
  registro: string;
  cliente: string;
  factura: string;
  motivo: string;
  cajas: number | string;
  ajuste: string;
  capturo: string;
  estatus: string;
}

interface CreditNoteItem {
  id: number;
  cliente: string;
  factura: string;
  monto: string;
  motivo: string;
  diasPendiente: number;
}

export function LiquidacionesQuejasClientesView() {
  // --- Estados del Formulario de Captura ---
  const [cliente, setCliente] = useState<string | null>('Fresh Direct');
  const [factura, setFactura] = useState<string | null>('F-1660 · 180 cj · $3,600');
  const [producto, setProducto] = useState<string | null>('Bok Choy Mieu');
  const [cajasAfectadas, setCajasAfectadas] = useState('24');
  const [motivo, setMotivo] = useState<string | null>('Calidad (hoja amarilla)');
  const [montoAjuste, setMontoAjuste] = useState('$456.00 USD');
  const [evidencia, setEvidencia] = useState('2 fotos + reporte PDF');
  const [capturadoPor, setCapturadoPor] = useState<string | null>('Nosotros (correo del cliente)');

  // Datos Mock Tabla de Revisión y Aprobación
  const INITIAL_REVISION: RevisionItem[] = [
    {
      registro: 'AJ-0031',
      cliente: 'Fresh Direct',
      factura: 'F-1660',
      motivo: 'Calidad - hoja amarilla',
      cajas: 24,
      ajuste: '−$456',
      capturo: 'cliente (portal)',
      estatus: 'aprobación pendiente',
    },
    {
      registro: 'AJ-0030',
      cliente: 'GreenLeaf',
      factura: 'F-1663',
      motivo: 'Faltante en arribo',
      cajas: 8,
      ajuste: '−$137',
      capturo: 'nosotros',
      estatus: 'aprobado — NC pendiente',
    },
    {
      registro: 'AJ-0029',
      cliente: 'Grubmarket',
      factura: 'F-1665',
      motivo: 'Ajuste precio mercado',
      cajas: '—',
      ajuste: '−$1,449',
      capturo: 'cliente (portal)',
      estatus: 'aprobado — NC pendiente',
    },
    {
      registro: 'AJ-0027',
      cliente: 'Tay Shing',
      factura: 'F-1652',
      motivo: 'Daño de tránsito',
      cajas: 12,
      ajuste: '−$164',
      capturo: 'nosotros',
      estatus: 'rechazado · evidencia insuficiente',
    },
  ];

  const [revisionList, setRevisionList] = useState<RevisionItem[]>(INITIAL_REVISION);
  const [clientesList, setClientesList] = useState<string[]>(['Fresh Direct', 'GreenLeaf', 'Grubmarket', 'Tay Shing']);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.get<any[]>('/customers')
      .then((res) => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          const names = res.map((c) => c.name || c.business_name || c.cliente).filter(Boolean);
          if (names.length > 0) setClientesList(names);
        }
      })
      .catch((err) => console.warn('⚠️ [PF-LQC] Fallback clientes:', err));

    api.get<any[]>('/liquidation-pf')
      .then((res) => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          const mapped: RevisionItem[] = res.slice(0, 10).map((l: any, idx: number) => ({
            registro: l.code || `AJ-${String(35 - idx).padStart(4, '0')}`,
            cliente: l.customer_name || 'Cliente Comercial',
            factura: l.invoice_number || `F-${1660 + idx}`,
            motivo: l.reason || 'Ajuste comercial convenido',
            cajas: l.total_boxes || '—',
            ajuste: `−$${(l.adjustment_amount || 300).toLocaleString()}`,
            capturo: 'sistema',
            estatus: l.status || 'aprobado — NC pendiente',
          }));
          setRevisionList(mapped);
        }
      })
      .catch((err) => console.warn('⚠️ [PF-LQC] Fallback liquidaciones:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRegistrarAjuste = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const nuevo: RevisionItem = {
        registro: `AJ-${Math.floor(1000 + Math.random() * 9000)}`,
        cliente: cliente || 'Cliente',
        factura: factura?.split(' ')[0] || 'F-NUEVA',
        motivo: motivo || 'Ajuste reportado',
        cajas: cajasAfectadas || '—',
        ajuste: `−${montoAjuste}`,
        capturo: capturadoPor?.includes('cliente') ? 'cliente (portal)' : 'nosotros',
        estatus: 'aprobación pendiente',
      };
      setRevisionList((prev) => [nuevo, ...prev]);
      notifications.show({
        title: 'Ajuste Registrado',
        message: `El ajuste ${nuevo.registro} para ${nuevo.cliente} fue registrado y enviado a revisión.`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    }, 500);
  };

  // Datos Mock Notas de Crédito Pendientes
  const creditNotesData: CreditNoteItem[] = [
    {
      id: 1,
      cliente: 'GreenLeaf',
      factura: 'F-1663',
      monto: '$137',
      motivo: 'faltante 8 cj',
      diasPendiente: 2,
    },
    {
      id: 2,
      cliente: 'Grubmarket',
      factura: 'F-1665',
      monto: '$1,449',
      motivo: 'ajuste de mercado',
      diasPendiente: 4,
    },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Ajustes de Clientes Vivos',
      value: '3',
      sub: '2 quejas de calidad · 1 faltante',
      icon: IconAlertTriangle,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Activos',
      badgeColor: 'yellow',
      delay: 0.05,
    },
    {
      label: 'Quién Captura',
      value: 'Cliente o Nosotros',
      sub: 'si el cliente no lo llena, lo llenamos',
      icon: IconUsers,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Flexible',
      badgeColor: 'blue',
      delay: 0.1,
    },
    {
      label: 'Al Aprobar',
      value: 'CxC se Actualiza',
      sub: 'y nace la nota de crédito pendiente',
      icon: IconFileInvoice,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Automático',
      badgeColor: 'green',
      delay: 0.15,
    },
    {
      label: 'NC Pendientes por Hacer',
      value: '2 · $1,586 USD',
      sub: 'emitir notas de crédito',
      icon: IconReceiptRefund,
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

          {/* HEADER - PF-LQC */}
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
                    PF-LQC · Liquidaciones y Quejas de Clientes
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconAlertCircle size={14} />
                    Venta y Embarque
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconReceiptRefund size={14} />
                    Ajustes y NC
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

          {/* SECCIÓN 1: CAPTURA · REGISTRO DE LIQUIDACIÓN / QUEJA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconAlertCircle size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Captura · Registro de Liquidación / Queja del Cliente
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Nuevo Ajuste
                </Badge>
              </Group>

              <Divider />

              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
                <Select
                  label="Cliente"
                  value={cliente}
                  onChange={setCliente}
                  data={['Fresh Direct', 'GreenLeaf', 'Grubmarket', 'Tay Shing']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <Select
                  label="Factura"
                  value={factura}
                  onChange={setFactura}
                  data={['F-1660 · 180 cj · $3,600', 'F-1663 · 450 cj · $7,677', 'F-1665 · 315 cj · $5,985']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <Select
                  label="Producto de la factura"
                  value={producto}
                  onChange={setProducto}
                  data={['Bok Choy Mieu', 'Shanghai Bok Choy', 'Coliflor']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <TextInput
                  label="Cajas afectadas"
                  value={cajasAfectadas}
                  onChange={(e) => setCajasAfectadas(e.currentTarget.value)}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
                <Select
                  label="Motivo"
                  value={motivo}
                  onChange={setMotivo}
                  data={['Calidad (hoja amarilla)', 'Faltante en arribo', 'Ajuste precio mercado', 'Daño de tránsito']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <TextInput
                  label="Monto del ajuste"
                  value={montoAjuste}
                  onChange={(e) => setMontoAjuste(e.currentTarget.value)}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <TextInput
                  label="Evidencia"
                  value={evidencia}
                  onChange={(e) => setEvidencia(e.currentTarget.value)}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <Select
                  label="Capturado por"
                  value={capturadoPor}
                  onChange={setCapturadoPor}
                  data={['Nosotros (correo del cliente)', 'Cliente (portal)']}
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
                  onClick={handleRegistrarAjuste}
                  loading={isSaving}
                >
                  Registrar ajuste → a revisión
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                el cliente lo llena desde su portal (PF-WEB) — o lo llenamos nosotros con su correo/llamada · 
                siempre contra factura y producto
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 2: REVISIÓN Y APROBACIÓN */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconChecklist size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Revisión y Aprobación
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  El ajuste viaja solo
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '800px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Registro</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cliente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Factura</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Motivo</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Cajas</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Ajuste</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Capturó</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Estatus</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {revisionList.map((row, idx) => (
                      <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.registro}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.cliente}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.factura}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.motivo}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'center', color: '#4B5563' }}>
                          {row.cajas}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>
                          {row.ajuste}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '11px', color: '#6B7280' }}>{row.capturo}</Table.Td>
                        <Table.Td>
                          {row.estatus === 'aprobación pendiente' ? (
                            <Button 
                              size="xs" 
                              variant="outline" 
                              color="amber" 
                              style={{ height: 22, fontSize: '10px', padding: '0 8px' }}
                            >
                              aprobar / rechazar
                            </Button>
                          ) : row.estatus.includes('aprobado') ? (
                            <Badge size="xs" color="blue" variant="light">
                              {row.estatus}
                            </Badge>
                          ) : (
                            <Badge size="xs" color="red" variant="light">
                              {row.estatus}
                            </Badge>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                al aprobar: la <strong>CxC (PF-6) se actualiza al monto real</strong> de la factura, la NC queda 
                pendiente por emitir, y si aplica el ajuste se prorratea a la liquidación del productor de esa boleta
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN 3: NOTAS DE CRÉDITO PENDIENTES POR HACER */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconReceiptRefund size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Notas de Crédito Pendientes por Hacer
                </Text>
                <Badge size="xs" color="red" variant="light" radius="sm">
                  {creditNotesData.length} pendientes
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '700px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>NC Pendiente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Cliente</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Factura Origen</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Monto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Motivo</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Días Pendiente
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Acción
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {creditNotesData.map((row) => (
                      <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>NC-por emitir</Table.Td>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.cliente}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.factura}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>
                          {row.monto}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.motivo}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'center', color: '#4B5563' }}>
                          {row.diasPendiente}d
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Button
                            leftSection={<IconCheck size={14} />}
                            size="xs"
                            style={{ backgroundColor: '#1A4B8C', height: 24, fontSize: '11px' }}
                          >
                            Emitir NC
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}

                    {/* FILA TOTAL PENDIENTE */}
                    <Table.Tr style={{ backgroundColor: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                      <Table.Td colSpan={3} style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>
                        TOTAL PENDIENTE
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'right', fontSize: '12px', fontWeight: 800, color: '#DC2626' }}>
                        $1,586
                      </Table.Td>
                      <Table.Td colSpan={3}></Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                la lista que el despacho ve: emitir la NC, ligarla a la factura y cerrar el ajuste
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
                <strong>✓ Al guardar:</strong> el ciclo completo: registro (cliente o nosotros) → aprobación → 
                <strong>CxC al monto real</strong> → NC pendiente → NC emitida y ligada · si el motivo es calidad 
                de origen, el ajuste se prorratea a la liquidación del productor con su # de boleta (PF-8) — 
                nadie absorbe lo que no le toca.
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
                <strong>✓ PF-LQC:</strong> este módulo completa el ciclo de venta · desde el reclamo del cliente 
                hasta la nota de crédito, manteniendo la CxC (PF-6) actualizada y la trazabilidad hacia la 
                liquidación del productor (PF-8).
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}