// src/modules/produce-first/PFNOM_NominaGastosOficinaPF.tsx

import React, { useState } from 'react';
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
  TextInput,
  Badge,
  ThemeIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconUsers,
  IconCalendarDollar,
  IconPlus,
  IconCheck,
  IconInfoCircle,
  IconUser,
  IconCalendar,
  IconCurrencyDollar,
  IconFileInvoice,
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

interface PlantillaItem {
  id: string;
  persona: string;
  rol: string;
  base: string;
  mensualPlan: string;
  estado: string;
}

export function NominaGastosOficinaPFView() {
  // --- Estados de Captura (Pago del mes) ---
  const [personaConcepto, setPersonaConcepto] = useState<string | null>('JFNO');
  const [mesPago, setMesPago] = useState('noviembre');
  const [montoPago, setMontoPago] = useState('7,042');

  // --- Datos Mock Tabla Principal: Plantilla de PF ---
  const plantillaData: PlantillaItem[] = [
    {
      id: '1',
      persona: 'JFNO',
      rol: 'Dirección / comercial',
      base: 'mensual',
      mensualPlan: '$7,042',
      estado: 'activo',
    },
    {
      id: '2',
      persona: 'Wendy',
      rol: 'Logística y documentación',
      base: 'mensual',
      mensualPlan: '$1,858',
      estado: 'activo',
    },
    {
      id: '3',
      persona: 'Néstor',
      rol: 'Coordinación de cosecha y pronóstico',
      base: 'mensual',
      mensualPlan: '$1,000',
      estado: 'activo',
    },
    {
      id: '4',
      persona: 'Oficina, sistema y bancos',
      rol: 'gastos',
      base: 'mensual',
      mensualPlan: '$3,183',
      estado: '—',
    },
    {
      id: '5',
      persona: 'Otros',
      rol: 'variable',
      base: 'mensual',
      mensualPlan: '$817',
      estado: '—',
    },
  ];

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Equipo de PF',
      value: 'El equipo real',
      sub: 'JFNO · Wendy · Néstor + oficina',
      icon: IconUsers,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Activos',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'Gasto Mensual Plan',
      value: '$13,900 USD',
      sub: 'del presupuesto PF-10',
      icon: IconCurrencyDollar,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Presupuesto',
      badgeColor: 'yellow',
      delay: 0.1,
    },
    {
      label: 'Misma Fórmula',
      value: 'Que la nómina del grower',
      sub: 'salario vigente en la fecha trabajada',
      icon: IconFileInvoice,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Estandar',
      badgeColor: 'green',
      delay: 0.15,
    },
    {
      label: 'Pago',
      value: 'Corrida del viernes de PF',
      sub: 'con su banco',
      icon: IconCalendar,
      color: '#1864AB',
      bgColor: '#E7F5FF',
      badge: 'Semanal',
      badgeColor: 'blue',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-NOM */}
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
                    PF-NOM · Nómina y Gastos de Oficina PF
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconUsers size={14} />
                    Personal
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconCalendarDollar size={14} />
                    Nómina
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

          {/* SECCIÓN TABLA PRINCIPAL: PLANTILLA DE PF */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconUsers size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Plantilla de PF · Tabla Principal
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  {plantillaData.filter(p => p.estado === 'activo').length} activos
                </Badge>
              </Group>

              <Divider />

              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Persona</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Rol</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Base</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Mensual Plan
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center' }}>
                        Estado
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {plantillaData.map((row) => (
                      <Table.Tr key={row.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          <Group gap={4}>
                            <IconUser size={14} color="#6B7280" />
                            {row.persona}
                          </Group>
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#4B5563' }}>{row.rol}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{row.base}</Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 600, color: '#1A4B8C' }}>
                          {row.mensualPlan}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          {row.estado === 'activo' ? (
                            <Badge size="xs" color="green" variant="light">
                              {row.estado}
                            </Badge>
                          ) : (
                            <Text size="xs" c="dimmed">{row.estado}</Text>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Divider />

              <Group>
                <Button
                  leftSection={<IconPlus size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                >
                  + Alta
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                la plantilla del equipo operativo de Produce First · los gastos de oficina y sistema 
                se registran como conceptos fijos
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN CAPTURA · PAGO DEL MES */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconCalendarDollar size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Captura · Pago del Mes
                </Text>
                <Badge size="xs" color="yellow" variant="light" radius="sm">
                  Programar
                </Badge>
              </Group>

              <Divider />

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
                <Select
                  label="Persona / concepto"
                  value={personaConcepto}
                  onChange={setPersonaConcepto}
                  data={['JFNO', 'Wendy', 'Néstor', 'Oficina, sistema y bancos', 'Otros']}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <TextInput
                  label="Mes"
                  value={mesPago}
                  onChange={(e) => setMesPago(e.currentTarget.value)}
                  size="xs"
                  styles={{ label: { color: '#1A3A5C', fontWeight: 600 } }}
                />
                <TextInput
                  label="Monto"
                  value={montoPago}
                  onChange={(e) => setMontoPago(e.currentTarget.value)}
                  size="xs"
                  leftSection={<Text size="xs" fw={700}>$</Text>}
                  styles={{ 
                    label: { color: '#1A3A5C', fontWeight: 600 },
                    input: { fontWeight: 600 } 
                  }}
                />
              </SimpleGrid>

              <Divider />

              <Group>
                <Button
                  leftSection={<IconCheck size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                >
                  Programar pago
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                3 campos y a la corrida del viernes
              </Text>
            </Stack>
          </Paper>

          {/* Callout Informativo Final */}
          <Paper
            p="sm"
            radius="lg"
            style={{
              backgroundColor: '#F0DFDF4',
              border: '1px solid #BBF7D0',
            }}
          >
            <Group align="flex-start" gap="xs">
              <IconCheck size={18} color="#16A34A" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text size="xs" c="#15803D" style={{ flex: 1, lineHeight: 1.5 }}>
                <strong>✓ Al guardar:</strong> cada pago cae contra su renglón del presupuesto (PF-10) · 
                si el equipo crece, se da de alta aquí y el presupuesto lo absorbe · nada se paga fuera del viernes.
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
                <strong>✓ PF-NOM:</strong> la nómina de Produce First gestiona el equipo operativo y los 
                gastos fijos de oficina · cada registro se alinea con el presupuesto (PF-10) y los pagos 
                se programan en la corrida semanal de viernes.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}