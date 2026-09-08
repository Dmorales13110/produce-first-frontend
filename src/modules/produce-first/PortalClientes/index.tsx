// src/modules/produce-first/PortalClientes/index.tsx

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
  Tabs,
  Table,
  Button,
  SimpleGrid,
  Select,
  TextInput,
  Badge,
  ThemeIcon,
  Divider,
  ScrollArea,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconWorld,
  IconTruckDelivery,
  IconFileInvoice,
  IconAlertTriangle,
  IconReceipt2,
  IconDownload,
  IconCheck,
  IconShieldCheck,
  IconThermometer,
} from '@tabler/icons-react';

interface EmbarqueItem {
  id: string;
  folio: string;
  camion: string;
  placas: string;
  fletero: string;
  salida: string;
  eta: string;
  cajas: number;
  temperatura: string;
  estatus: 'En Tránsito' | 'En Carga' | 'Entregado';
  color: string;
}

interface FacturaItem {
  id: string;
  factura: string;
  fechaEmision: string;
  vencimiento: string;
  monto: number;
  cajas: number;
  estatus: 'Pendiente' | 'Pagada' | 'Con Ajuste';
  color: string;
  proforma: string;
}

interface QuejaItem {
  id: string;
  folio: string;
  fecha: string;
  factura: string;
  producto: string;
  cajas: number;
  motivo: string;
  monto: number;
  estatus: 'En Revisión' | 'Aprobado — NC Lista' | 'Rechazado';
  color: string;
}

export function PortalClientesView() {
  const [selectedCliente, setSelectedCliente] = useState<string>('Fresh Direct - Vancouver');
  const [activeTab, setActiveTab] = useState<string | null>('embarques');

  // Formulario de Quejas
  const [quejaFactura, setQuejaFactura] = useState<string | null>('F-1660');
  const [quejaProducto, setQuejaProducto] = useState<string | null>('Baby Bok Choy');
  const [quejaCajas, setQuejaCajas] = useState<string>('24');
  const [quejaMotivo, setQuejaMotivo] = useState<string | null>('Calidad - hoja amarilla');
  const [quejaMonto, setQuejaMonto] = useState<string>('456.00');
  const [quejaDetalle, setQuejaDetalle] = useState<string>('');
  const [isSubmittingQueja, setIsSubmittingQueja] = useState<boolean>(false);

  // Datos Iniciales Resilientes
  const [embarques] = useState<EmbarqueItem[]>([
    {
      id: '1',
      folio: 'PRF-0147',
      camion: 'Torton R-448 · Thermo King 53\'',
      placas: '48-AF-3X',
      fletero: 'Transportes McAllen SA',
      salida: '28-Nov 08:30',
      eta: '30-Nov 14:00 (En tiempo)',
      cajas: 1446,
      temperatura: '34°F (Óptima)',
      estatus: 'En Tránsito',
      color: 'blue',
    },
    {
      id: '2',
      folio: 'PRF-0146',
      camion: 'Kenworth T680 · Caja 53\'',
      placas: '92-BB-1Z',
      fletero: 'Fletes del Norte',
      salida: '27-Nov 14:15',
      eta: '29-Nov 18:00',
      cajas: 1280,
      temperatura: '35°F',
      estatus: 'En Tránsito',
      color: 'blue',
    },
    {
      id: '3',
      folio: 'PRF-0145',
      camion: 'Freightliner Cascadia',
      placas: '33-TY-8P',
      fletero: 'Logística Express',
      salida: '25-Nov 10:00',
      eta: '27-Nov 16:30 (Recibido)',
      cajas: 990,
      temperatura: '34°F',
      estatus: 'Entregado',
      color: 'green',
    },
  ]);

  const [facturas] = useState<FacturaItem[]>([
    {
      id: '1',
      factura: 'F-1660',
      fechaEmision: '24-Nov-2026',
      vencimiento: '09-Dic-2026 (15 días)',
      monto: 22144.00,
      cajas: 1446,
      estatus: 'Pendiente',
      color: 'yellow',
      proforma: 'PRF-0147',
    },
    {
      id: '2',
      factura: 'F-1658',
      fechaEmision: '21-Nov-2026',
      vencimiento: '06-Dic-2026',
      monto: 18940.00,
      cajas: 1280,
      estatus: 'Pendiente',
      color: 'yellow',
      proforma: 'PRF-0144',
    },
    {
      id: '3',
      factura: 'F-1652',
      fechaEmision: '14-Nov-2026',
      vencimiento: '29-Nov-2026',
      monto: 15890.00,
      cajas: 1120,
      estatus: 'Pagada',
      color: 'green',
      proforma: 'PRF-0139',
    },
  ]);

  const [quejas, setQuejas] = useState<QuejaItem[]>([
    {
      id: '1',
      folio: 'AJ-0031',
      fecha: '26-Nov-2026',
      factura: 'F-1660',
      producto: 'Baby Bok Choy',
      cajas: 24,
      motivo: 'Calidad - hoja amarilla',
      monto: 456.00,
      estatus: 'En Revisión',
      color: 'yellow',
    },
    {
      id: '2',
      folio: 'AJ-0026',
      fecha: '18-Nov-2026',
      factura: 'F-1652',
      producto: 'Shanghai Mieu',
      cajas: 12,
      motivo: 'Faltante en arribo',
      monto: 164.00,
      estatus: 'Aprobado — NC Lista',
      color: 'green',
    },
  ]);

  // Carga de Clientes reales desde el backend
  const [clientesDisponibles, setClientesDisponibles] = useState<string[]>([
    'Fresh Direct - Vancouver',
    'GreenLeaf Produce - New York',
    'Grubmarket - Brooklyn',
    'Tay Shing - Toronto',
  ]);

  useEffect(() => {
    let isMounted = true;
    api.get<any[]>('/customers')
      .then((res) => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          const names = res.map((c) => c.name || c.business_name).filter(Boolean);
          if (names.length > 0) {
            setClientesDisponibles(names);
          }
        }
      })
      .catch((err) => console.warn('⚠️ [PF-WEB1] Fallback clientes:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDescargaDocumento = (tipo: string, folio: string) => {
    notifications.show({
      title: 'Descarga de Documento',
      message: `Generando archivo ${tipo} para el folio ${folio}...`,
      color: 'blue',
      icon: <IconDownload size={16} />,
    });
  };

  const handleEnviarQueja = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quejaFactura || !quejaProducto || !quejaCajas) {
      notifications.show({
        title: 'Formulario Incompleto',
        message: 'Por favor complete todos los campos obligatorios.',
        color: 'red',
      });
      return;
    }

    setIsSubmittingQueja(true);
    setTimeout(() => {
      setIsSubmittingQueja(false);
      const nuevoFolio = `AJ-${Math.floor(1000 + Math.random() * 9000)}`;
      const nuevaQueja: QuejaItem = {
        id: Date.now().toString(),
        folio: nuevoFolio,
        fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
        factura: quejaFactura,
        producto: quejaProducto,
        cajas: Number(quejaCajas) || 0,
        motivo: quejaMotivo || 'Ajuste comercial reportado',
        monto: Number(quejaMonto) || 0,
        estatus: 'En Revisión',
        color: 'yellow',
      };

      setQuejas((prev) => [nuevaQueja, ...prev]);

      notifications.show({
        title: 'Reclamo Registrado Exitosamente',
        message: `El folio ${nuevoFolio} ha sido enviado al equipo de calidad de Produce First para validación y emisión de Nota de Crédito.`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      setQuejaDetalle('');
      setQuejaCajas('');
    }, 600);
  };

  const totalPorPagar = facturas
    .filter((f) => f.estatus === 'Pendiente')
    .reduce((sum, f) => sum + f.monto, 0);

  const cajasEnTransito = embarques
    .filter((e) => e.estatus === 'En Tránsito')
    .reduce((sum, e) => sum + e.cajas, 0);

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER DEL PORTAL DE CLIENTES */}
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
                <ThemeIcon size="xl" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconWorld size={28} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Group gap="xs">
                    <Text size="22px" fw={800} c="#1A3A5C">
                      Portal del Cliente · PF-WEB1
                    </Text>
                    <Badge size="md" color="blue" variant="light">
                      External Client Portal
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed">
                    Produce First LLC · Embarques, Facturación Digital, Trazabilidad y Ajustes en Tiempo Real
                  </Text>
                </Stack>
              </Group>

              {/* Selector de Cliente Activo */}
              <Group gap="xs">
                <Select
                  label="Cliente Activo"
                  value={selectedCliente}
                  onChange={(val) => setSelectedCliente(val || selectedCliente)}
                  data={clientesDisponibles}
                  size="xs"
                  w={260}
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
              </Group>
            </Group>
          </Paper>

          {/* 4 KPIS DEL CLIENTE */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <Paper p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
              <Group justify="space-between" align="flex-start">
                <Stack gap={2}>
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">Saldo por Pagar</Text>
                  <Text size="20px" fw={800} c="#1A4B8C">
                    ${totalPorPagar.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </Text>
                  <Text size="11px" c="dimmed">2 facturas vigentes</Text>
                </Stack>
                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconReceipt2 size={20} />
                </ThemeIcon>
              </Group>
            </Paper>

            <Paper p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
              <Group justify="space-between" align="flex-start">
                <Stack gap={2}>
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">Cajas en Tránsito</Text>
                  <Text size="20px" fw={800} c="#16A34A">
                    {cajasEnTransito.toLocaleString()} cj
                  </Text>
                  <Text size="11px" c="dimmed">2 camiones refrigerados en ruta</Text>
                </Stack>
                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#ECFDF5', color: '#16A34A' }}>
                  <IconTruckDelivery size={20} />
                </ThemeIcon>
              </Group>
            </Paper>

            <Paper p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
              <Group justify="space-between" align="flex-start">
                <Stack gap={2}>
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">Términos de Crédito</Text>
                  <Text size="20px" fw={800} c="#D97706">
                    15 Días
                  </Text>
                  <Text size="11px" c="dimmed">Línea de crédito aprobada ✓</Text>
                </Stack>
                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
                  <IconShieldCheck size={20} />
                </ThemeIcon>
              </Group>
            </Paper>

            <Paper p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
              <Group justify="space-between" align="flex-start">
                <Stack gap={2}>
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase">Reclamos Activos</Text>
                  <Text size="20px" fw={800} c="#DC2626">
                    {quejas.filter((q) => q.estatus === 'En Revisión').length}
                  </Text>
                  <Text size="11px" c="dimmed">En validación técnica</Text>
                </Stack>
                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                  <IconAlertTriangle size={20} />
                </ThemeIcon>
              </Group>
            </Paper>
          </SimpleGrid>

          {/* TABS PRINCIPALES */}
          <Paper p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Tabs value={activeTab} onChange={setActiveTab} color="blue">
              <Tabs.List>
                <Tabs.Tab value="embarques" leftSection={<IconTruckDelivery size={16} />}>
                  Embarques y Tránsito ({embarques.length})
                </Tabs.Tab>
                <Tabs.Tab value="facturas" leftSection={<IconFileInvoice size={16} />}>
                  Facturas y Documentación ({facturas.length})
                </Tabs.Tab>
                <Tabs.Tab value="quejas" leftSection={<IconAlertTriangle size={16} />}>
                  Reporte de Quejas y Calidad ({quejas.length})
                </Tabs.Tab>
                <Tabs.Tab value="estado-cuenta" leftSection={<IconReceipt2 size={16} />}>
                  Estado de Cuenta
                </Tabs.Tab>
              </Tabs.List>

              {/* TAB 1: EMBARQUES Y TRÁNSITO */}
              <Tabs.Panel value="embarques" pt="md">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text size="14px" fw={700} c="#1A3A5C">
                      Camiones en Ruta hacia sus Bodegas
                    </Text>
                    <Badge size="xs" color="blue" variant="light">
                      Monitoreo Satelital de Frío
                    </Badge>
                  </Group>

                  <ScrollArea>
                    <Table highlightOnHover withColumnBorders verticalSpacing="sm">
                      <Table.Thead style={{ backgroundColor: '#F8FAFC' }}>
                        <Table.Tr>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Folio Proforma</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Unidad / Placas</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Fletero</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Salida</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Arribo Estimado (ETA)</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Termo King</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C', textAlign: 'center' }}>Estatus</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C', textAlign: 'center' }}>Docs</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {embarques.map((emb) => (
                          <Table.Tr key={emb.id}>
                            <Table.Td style={{ fontSize: '12px', fontWeight: 700, color: '#1A4B8C' }}>
                              {emb.folio}
                            </Table.Td>
                            <Table.Td style={{ fontSize: '12px', color: '#374151' }}>
                              {emb.camion} <br />
                              <Text size="10px" c="dimmed">Placas: {emb.placas}</Text>
                            </Table.Td>
                            <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{emb.fletero}</Table.Td>
                            <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{emb.salida}</Table.Td>
                            <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#15803D' }}>{emb.eta}</Table.Td>
                            <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#1A3A5C' }}>
                              {emb.cajas.toLocaleString()}
                            </Table.Td>
                            <Table.Td>
                              <Group gap={4}>
                                <IconThermometer size={14} color="#0284C7" />
                                <Text size="11px" fw={600} c="#0284C7">{emb.temperatura}</Text>
                              </Group>
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'center' }}>
                              <Badge size="xs" color={emb.color} variant="light">
                                {emb.estatus}
                              </Badge>
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'center' }}>
                              <Tooltip label="Descargar Instrucción de Embarque (PDF)">
                                <ActionIcon
                                  size="sm"
                                  variant="subtle"
                                  color="blue"
                                  onClick={() => handleDescargaDocumento('Proforma/Packing List', emb.folio)}
                                >
                                  <IconDownload size={14} />
                                </ActionIcon>
                              </Tooltip>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </ScrollArea>
                </Stack>
              </Tabs.Panel>

              {/* TAB 2: FACTURAS Y DOCUMENTACIÓN */}
              <Tabs.Panel value="facturas" pt="md">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text size="14px" fw={700} c="#1A3A5C">
                      Facturas Comerciales y Certificados de Exportación
                    </Text>
                    <Text size="xs" c="dimmed">
                      Archivos oficiales emitidos por Produce First LLC
                    </Text>
                  </Group>

                  <ScrollArea>
                    <Table highlightOnHover withColumnBorders verticalSpacing="sm">
                      <Table.Thead style={{ backgroundColor: '#F8FAFC' }}>
                        <Table.Tr>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Factura</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Fecha Emisión</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Vencimiento</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C', textAlign: 'right' }}>Total (USD)</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Proforma</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C', textAlign: 'center' }}>Estatus</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C', textAlign: 'center' }}>Descargas</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {facturas.map((fac) => (
                          <Table.Tr key={fac.id}>
                            <Table.Td style={{ fontSize: '12px', fontWeight: 700, color: '#1A3A5C' }}>
                              {fac.factura}
                            </Table.Td>
                            <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{fac.fechaEmision}</Table.Td>
                            <Table.Td style={{ fontSize: '12px', color: '#DC2626', fontWeight: 600 }}>
                              {fac.vencimiento}
                            </Table.Td>
                            <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                              {fac.cajas.toLocaleString()}
                            </Table.Td>
                            <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#1A4B8C' }}>
                              ${fac.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </Table.Td>
                            <Table.Td style={{ fontSize: '11px', color: '#6B7280' }}>{fac.proforma}</Table.Td>
                            <Table.Td style={{ textAlign: 'center' }}>
                              <Badge size="xs" color={fac.color} variant="light">
                                {fac.estatus}
                              </Badge>
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'center' }}>
                              <Group gap={4} justify="center">
                                <Button
                                  size="compact-xs"
                                  variant="light"
                                  color="blue"
                                  leftSection={<IconDownload size={12} />}
                                  onClick={() => handleDescargaDocumento('Factura PDF', fac.factura)}
                                >
                                  PDF
                                </Button>
                                <Button
                                  size="compact-xs"
                                  variant="light"
                                  color="teal"
                                  leftSection={<IconDownload size={12} />}
                                  onClick={() => handleDescargaDocumento('Factura XML', fac.factura)}
                                >
                                  XML
                                </Button>
                              </Group>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </ScrollArea>
                </Stack>
              </Tabs.Panel>

              {/* TAB 3: REPORTE DE QUEJAS Y CALIDAD */}
              <Tabs.Panel value="quejas" pt="md">
                <Stack gap="md">
                  {/* Formulario de Alta de Reclamo */}
                  <Paper p="md" radius="md" withBorder style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
                    <form onSubmit={handleEnviarQueja}>
                      <Stack gap="xs">
                        <Group justify="space-between" align="center">
                          <Group gap="xs">
                            <ThemeIcon size="md" radius="md" color="yellow" variant="light">
                              <IconAlertTriangle size={18} />
                            </ThemeIcon>
                            <Text size="14px" fw={700} c="#92400E">
                              Registrar Incidencia / Queja de Calidad
                            </Text>
                          </Group>
                          <Badge size="xs" color="yellow" variant="filled">
                            Llega directo a PF-LQC
                          </Badge>
                        </Group>

                        <Text size="xs" c="#78350F">
                          Si recibió producto con merma, daño de tránsito o calidad no conforme, reporte los detalles contra factura para que nuestro equipo emita la Nota de Crédito correspondiente.
                        </Text>

                        <Divider my={4} />

                        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xs">
                          <Select
                            label="Factura Afectada"
                            size="xs"
                            value={quejaFactura}
                            onChange={setQuejaFactura}
                            data={facturas.map((f) => f.factura)}
                            required
                          />
                          <Select
                            label="Vegetal / Presentación"
                            size="xs"
                            value={quejaProducto}
                            onChange={setQuejaProducto}
                            data={['Baby Bok Choy', 'Shanghai Bok', 'Shanghai Mieu', 'Snow Pea Tips', 'Coliflor']}
                            required
                          />
                          <TextInput
                            label="Cajas Afectadas"
                            size="xs"
                            placeholder="Ej: 24"
                            type="number"
                            value={quejaCajas}
                            onChange={(e) => setQuejaCajas(e.currentTarget.value)}
                            required
                          />
                          <Select
                            label="Motivo del Reclamo"
                            size="xs"
                            value={quejaMotivo}
                            onChange={setQuejaMotivo}
                            data={[
                              'Calidad - hoja amarilla',
                              'Faltante en descarga',
                              'Daño de tránsito / aplastamiento',
                              'Pudrición / sobremaduro',
                              'Ajuste convenido de mercado',
                            ]}
                            required
                          />
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                          <TextInput
                            label="Monto Estimado del Ajuste (USD)"
                            size="xs"
                            placeholder="Ej: 456.00"
                            value={quejaMonto}
                            onChange={(e) => setQuejaMonto(e.currentTarget.value)}
                          />
                          <TextInput
                            label="Evidencia Fotográfica / PDF"
                            size="xs"
                            placeholder="Adjuntar enlace de fotos de tarima o reporte de bodega..."
                            value={quejaDetalle}
                            onChange={(e) => setQuejaDetalle(e.currentTarget.value)}
                          />
                        </SimpleGrid>

                        <Group justify="flex-end" mt="xs">
                          <Button
                            type="submit"
                            size="xs"
                            color="amber"
                            leftSection={<IconCheck size={14} />}
                            loading={isSubmittingQueja}
                          >
                            Enviar Reclamo a Revisión
                          </Button>
                        </Group>
                      </Stack>
                    </form>
                  </Paper>

                  {/* Historial de Reclamos */}
                  <Stack gap="xs">
                    <Text size="13px" fw={700} c="#1A3A5C">
                      Historial de Reclamos y Estatus de Notas de Crédito
                    </Text>

                    <Table highlightOnHover withColumnBorders verticalSpacing="xs">
                      <Table.Thead style={{ backgroundColor: '#F8FAFC' }}>
                        <Table.Tr>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Folio</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Fecha</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Factura</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Producto</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C', textAlign: 'center' }}>Cajas</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C' }}>Motivo</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C', textAlign: 'right' }}>Ajuste (USD)</Table.Th>
                          <Table.Th style={{ fontSize: '11px', color: '#1A3A5C', textAlign: 'center' }}>Estatus</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {quejas.map((q) => (
                          <Table.Tr key={q.id}>
                            <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>{q.folio}</Table.Td>
                            <Table.Td style={{ fontSize: '11px', color: '#6B7280' }}>{q.fecha}</Table.Td>
                            <Table.Td style={{ fontSize: '11px', color: '#4B5563' }}>{q.factura}</Table.Td>
                            <Table.Td style={{ fontSize: '11px', color: '#374151' }}>{q.producto}</Table.Td>
                            <Table.Td style={{ fontSize: '11px', textAlign: 'center', color: '#374151' }}>{q.cajas}</Table.Td>
                            <Table.Td style={{ fontSize: '11px', color: '#4B5563' }}>{q.motivo}</Table.Td>
                            <Table.Td style={{ fontSize: '11px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>
                              −${q.monto.toFixed(2)}
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'center' }}>
                              <Badge size="xs" color={q.color} variant="light">
                                {q.estatus}
                              </Badge>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Stack>
                </Stack>
              </Tabs.Panel>

              {/* TAB 4: ESTADO DE CUENTA */}
              <Tabs.Panel value="estado-cuenta" pt="md">
                <Stack gap="md">
                  <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                    <Paper p="sm" radius="md" withBorder style={{ backgroundColor: '#F8FAFC' }}>
                      <Text size="xs" c="dimmed">Facturado en el Mes</Text>
                      <Text size="18px" fw={700} c="#1A3A5C">$56,974.00 USD</Text>
                    </Paper>
                    <Paper p="sm" radius="md" withBorder style={{ backgroundColor: '#F8FAFC' }}>
                      <Text size="xs" c="dimmed">Pagos Realizados</Text>
                      <Text size="18px" fw={700} c="#16A34A">$15,890.00 USD</Text>
                    </Paper>
                    <Paper p="sm" radius="md" withBorder style={{ backgroundColor: '#F8FAFC' }}>
                      <Text size="xs" c="dimmed">Notas de Crédito Aplicadas</Text>
                      <Text size="18px" fw={700} c="#DC2626">−$164.00 USD</Text>
                    </Paper>
                  </SimpleGrid>

                  <Paper p="md" radius="md" style={{ backgroundColor: '#F0F7FF', border: '1px solid #BFDBFE' }}>
                    <Group align="flex-start" gap="xs">
                      <IconReceipt2 size={20} color="#1A4B8C" />
                      <Stack gap={2}>
                        <Text size="xs" fw={700} c="#1A4B8C">
                          Instrucciones de Transferencia Bancaria (Wire / ACH)
                        </Text>
                        <Text size="11px" c="#1E3A8A">
                          Banco: Wells Fargo Bank N.A. · Cuenta: Produce First LLC · Routing (ABA): 12100024 · 
                          Referencia de Pago: Indicar número de factura (Ej: F-1660).
                        </Text>
                      </Stack>
                    </Group>
                  </Paper>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}
