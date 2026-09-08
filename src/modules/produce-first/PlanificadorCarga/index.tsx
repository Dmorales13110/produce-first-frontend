// src/modules/produce-first/PF4_PlanificadorCarga.tsx

import React, { useState, useEffect } from 'react';
import { api } from '../../../services/apiClient';
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
  ThemeIcon,
  Divider,
  ScrollArea,
  Badge,
  Grid,
  Card,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconTruck,
  IconCalendar,
  IconCheck,
  IconInfoCircle,
  IconPackage,
  IconMapPin,
  IconUsers,
  IconClock,
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

interface CargaItem {
  cliente: string;
  destino: string;
  producto: string;
  pallets: number;
  cajas: number;
  peso: string;
  fecha: string;
  status: string;
}

export function PlanificadorCargaView() {
  const [filtroCliente, setFiltroCliente] = useState<string | null>('Todos');
  const [filtroStatus, setFiltroStatus] = useState<string | null>('Todos');
  const [semanaActiva, setSemanaActiva] = useState('S49');

  // Datos de respaldo de carga
  const INITIAL_CARGA: CargaItem[] = [
    { cliente: 'GreenLeaf', destino: 'Maspeth NY', producto: 'Shanghai Bok', pallets: 10, cajas: 450, peso: '4,500 kg', fecha: 'Lun 18', status: 'Programado' },
    { cliente: 'Grubmarket', destino: 'Brooklyn NY', producto: 'Choy Mieu', pallets: 8, cajas: 360, peso: '3,600 kg', fecha: 'Mar 19', status: 'Programado' },
    { cliente: 'Fresh Direct', destino: 'Vancouver', producto: 'Big Bok Choy', pallets: 12, cajas: 420, peso: '4,200 kg', fecha: 'Mié 20', status: 'Confirmado' },
    { cliente: 'Tay Shing', destino: 'Markham ON', producto: 'Coliflor', pallets: 6, cajas: 210, peso: '2,100 kg', fecha: 'Jue 21', status: 'En Ruta' },
    { cliente: 'Manley Sales', destino: 'Scarborough', producto: 'Tips', pallets: 4, cajas: 224, peso: '2,240 kg', fecha: 'Vie 22', status: 'Entregado' },
  ];

  const [cargaData, setCargaData] = useState<CargaItem[]>(INITIAL_CARGA);

  useEffect(() => {
    let isMounted = true;
    api.get<any[]>('/sales')
      .then(res => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          const mapped: CargaItem[] = res.map((s: any) => ({
            cliente: s.customer_name || s.customer || 'Cliente',
            destino: s.destination || 'USA',
            producto: s.product_name || s.product || 'Vegetal',
            pallets: Math.round(Number(s.boxes || 400) / 45) || 10,
            cajas: Number(s.boxes || 450),
            peso: `${(Number(s.boxes || 450) * 10).toLocaleString()} kg`,
            fecha: s.delivery_date ? new Date(s.delivery_date).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }) : 'Lun 18',
            status: s.status || 'Programado',
          }));
          setCargaData(mapped);
        }
      })
      .catch(err => {
        console.warn('⚠️ Usando cargas de respaldo:', err);
      });

    return () => { isMounted = false; };
  }, []);

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Pallets Programados',
      value: '40',
      sub: 'para la semana S49',
      icon: IconPackage,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Total',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Cajas Estimadas',
      value: '1,664',
      sub: 'promedio 41.6 cajas/pallet',
      icon: IconTruck,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Volumen',
      badgeColor: 'green',
      delay: 0.1,
    },
    {
      label: 'Clientes Atendidos',
      value: '5',
      sub: '3 exportación · 2 local',
      icon: IconUsers,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Semana',
      badgeColor: 'yellow',
      delay: 0.15,
    },
    {
      label: 'Peso Total',
      value: '16,640 kg',
      sub: '16.6 toneladas',
      icon: IconMapPin,
      color: '#1864AB',
      bgColor: '#E7F5FF',
      badge: 'Carga',
      badgeColor: 'blue',
      delay: 0.2,
    },
  ];

  // Resumen de carga por día
  const resumenDia = [
    { dia: 'Lunes', pallets: 10, cajas: 450, clientes: 2 },
    { dia: 'Martes', pallets: 8, cajas: 360, clientes: 1 },
    { dia: 'Miércoles', pallets: 12, cajas: 420, clientes: 1 },
    { dia: 'Jueves', pallets: 6, cajas: 210, clientes: 1 },
    { dia: 'Viernes', pallets: 4, cajas: 224, clientes: 1 },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-4 */}
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
                    PF-4 · Planificador de Carga
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
                    <IconClock size={14} />
                    Disponibilidad
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

          {/* Resumen de Carga por Día */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconCalendar size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Resumen de Carga por Día
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  Distribución
                </Badge>
              </Group>

              <Divider />

              <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="md">
                {resumenDia.map((item, idx) => (
                  <Card key={idx} p="md" radius="md" withBorder style={{ borderColor: '#F0F4FF' }}>
                    <Stack gap={4} align="center">
                      <Text size="12px" fw={700} c="#1A3A5C">{item.dia}</Text>
                      <Text size="20px" fw={800} c="#1A4B8C">{item.pallets}</Text>
                      <Text size="10px" c="dimmed">{item.cajas} cajas</Text>
                      <Badge size="xs" color="gray" variant="light">
                        {item.clientes} clientes
                      </Badge>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </Stack>
          </Paper>

          {/* SECCIÓN: TABLA DE CARGA */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                    <IconTruck size={18} />
                  </ThemeIcon>
                  <Text size="16px" fw={700} c="#1A3A5C">
                    Detalle de Carga Programada
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    Semana {semanaActiva}
                  </Badge>
                </Group>

                <Group gap="md">
                  <Select
                    label="Cliente"
                    value={filtroCliente}
                    onChange={setFiltroCliente}
                    data={['Todos', 'GreenLeaf', 'Grubmarket', 'Fresh Direct', 'Tay Shing', 'Manley Sales']}
                    size="xs"
                    w={130}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <Select
                    label="Status"
                    value={filtroStatus}
                    onChange={setFiltroStatus}
                    data={['Todos', 'Programado', 'Confirmado', 'En Ruta', 'Entregado']}
                    size="xs"
                    w={130}
                    styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                  />
                  <SegmentedControl
                    value={semanaActiva}
                    onChange={setSemanaActiva}
                    data={['S49', 'S50']}
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
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Destino</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Producto</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Pallets</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Cajas</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>Peso</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Fecha</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {cargaData.map((row, idx) => {
                      const statusColor = row.status === 'Entregado' ? 'green' : 
                                         row.status === 'En Ruta' ? 'blue' : 
                                         row.status === 'Confirmado' ? 'teal' : 'yellow';
                      return (
                        <Table.Tr key={idx} style={{ borderBottom: '1px solid #F0F4FF' }}>
                          <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                            {row.cliente}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.destino}</Table.Td>
                          <Table.Td style={{ fontSize: '12px', color: '#374151' }}>{row.producto}</Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600 }}>
                            {row.pallets}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                            {row.cajas}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                            {row.peso}
                          </Table.Td>
                          <Table.Td style={{ fontSize: '12px', textAlign: 'center', color: '#4B5563' }}>
                            {row.fecha}
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            <Badge size="xs" color={statusColor} variant="light">
                              {row.status}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Divider />

              <Group justify="space-between">
                <Group>
                  <Button
                    leftSection={<IconCheck size={16} />}
                    size="xs"
                    style={{ backgroundColor: '#1A4B8C' }}
                  >
                    Confirmar Carga
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    color="blue"
                  >
                    Generar Instrucción Embarque (PF-5)
                  </Button>
                </Group>
                <Badge size="sm" color="blue" variant="light">
                  <Group gap={4}>
                    <IconClock size={12} />
                    Última actualización: hoy 10:30
                  </Group>
                </Badge>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                la carga se planifica con el pronóstico (PF-3) y el programa (PF-2) · al confirmar, 
                se genera la instrucción de embarque (PF-5)
              </Text>
            </Stack>
          </Paper>

          {/* Callout Informativo */}
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
                <strong>✓ PF-4:</strong> el planificador de carga toma el pronóstico semanal (PF-3) y 
                el programa de ventas (PF-2) para armar la carga diaria. Al confirmar, se genera la 
                instrucción de embarque (PF-5) y se actualiza la disponibilidad en PF-6 (CxC).
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}