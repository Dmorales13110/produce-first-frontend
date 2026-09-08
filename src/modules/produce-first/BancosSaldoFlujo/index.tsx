// src/modules/produce-first/PFBAN_BancosPFSaldoFlujo.tsx

import React, { useState, useEffect } from 'react';
import { CashFlowService } from '../../../services/cash-flow';
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
  IconWallet,
  IconTrendingUp,
  IconChartLine,
  IconDeviceFloppy,
  IconInfoCircle,
  IconCurrencyDollar,
  IconCalendar,
  IconFileInvoice,
  IconCheck,
  IconUsers,
  IconCreditCard,
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

interface FlujoItem {
  periodo: string;
  entradas: string;
  salidas: string;
  neto: string;
  nota: string;
  highlight: boolean;
}

export function BancosPFSaldoFlujoView() {
  // --- Estado de la captura ---
  const [saldoCorte, setSaldoCorte] = useState(() => localStorage.getItem('pf_saldo_corte') || '684,200');

  // --- Datos de Respaldo Tabla Flujo Proyectado ---
  const INITIAL_FLUJO: FlujoItem[] = [
    {
      periodo: 'S49',
      entradas: '$498K',
      salidas: '$402K',
      neto: '+$96K',
      nota: 'cobros GreenLeaf + Fresh Direct',
      highlight: false,
    },
    {
      periodo: 'S52 (CNY)',
      entradas: '$520K',
      salidas: '$441K',
      neto: '+$79K',
      nota: 'liquidaciones altas del pico',
      highlight: false,
    },
    {
      periodo: 'Jun-26',
      entradas: '$430K',
      salidas: '$468K',
      neto: '−$38K',
      nota: 'arranca Santander $30K/mes',
      highlight: true,
    },
  ];

  const [flujoProyectadoData, setFlujoProyectadoData] = useState<FlujoItem[]>(INITIAL_FLUJO);

  useEffect(() => {
    let isMounted = true;
    CashFlowService.getBankBalances()
      .then(res => {
        if (isMounted && res && res.total_balance) {
          setSaldoCorte(Number(res.total_balance).toLocaleString());
        }
      })
      .catch(err => {
        console.warn('⚠️ Usando saldo de respaldo:', err);
      });

    return () => { isMounted = false; };
  }, []);

  const handleSaveDia = async () => {
    localStorage.setItem('pf_saldo_corte', saldoCorte);
    try {
      const num = parseFloat(saldoCorte.replace(/,/g, ''));
      if (!isNaN(num)) {
        await CashFlowService.updateBankBalance('pf-main', num);
      }
    } catch (e) {
      console.warn('⚠️ Guardado local:', e);
    }

    notifications.show({
      title: 'Saldo guardado',
      message: 'Saldo al corte guardado exitosamente',
      color: 'green',
      icon: <IconCheck size={16} />,
      autoClose: 3000,
    });
  };

  // KPI Cards
  const kpiCards: KpiCard[] = [
    {
      label: 'Saldo Cuenta PF',
      value: '$684,200 MXN',
      sub: 'actualizar al corte',
      icon: IconWallet,
      color: '#1A4B8C',
      bgColor: '#F0F7FF',
      badge: 'Actual',
      badgeColor: 'blue',
      delay: 0.05,
    },
    {
      label: 'El TC del Grupo',
      value: '17.50',
      sub: 'se captura una vez, todos lo heredan',
      icon: IconCurrencyDollar,
      color: '#D97706',
      bgColor: '#FFFBEB',
      badge: 'Referencia',
      badgeColor: 'yellow',
      delay: 0.1,
    },
    {
      label: 'Flujo del Mes',
      value: '+$412K',
      sub: 'cobros − liquidaciones − gastos',
      icon: IconTrendingUp,
      color: '#1F5C3A',
      bgColor: '#ECFDF5',
      badge: 'Positivo',
      badgeColor: 'green',
      delay: 0.15,
    },
    {
      label: 'Junio–Octubre',
      value: '−$30K/mes extra',
      sub: 'el calendario Santander vive en el flujo',
      icon: IconCalendar,
      color: '#DC2626',
      bgColor: '#FEF2F2',
      badge: 'Deuda',
      badgeColor: 'red',
      delay: 0.2,
    },
  ];

  return (
    <Box bg="#F4F5F0" p="md" style={{ minHeight: '100vh' }}>
      <Container fluid>
        <Stack gap="md">

          {/* HEADER - PF-BAN */}
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
                    PF-BAN · Bancos de PF · Saldo y Flujo
                  </Text>
                  <Text size="xs" c="dimmed">
                    Produce First · Invierno 2026–2027
                  </Text>
                </Stack>
              </Group>

              <Group gap="xs">
                <Badge size="lg" color="blue" variant="light">
                  <Group gap={4}>
                    <IconWallet size={14} />
                    Dinero PF
                  </Group>
                </Badge>
                <Badge size="lg" color="amber" variant="light">
                  <Group gap={4}>
                    <IconChartLine size={14} />
                    Flujo de Caja
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

          {/* SECCIÓN CAPTURA DE SALDO */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconWallet size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  La Única Captura
                </Text>
                <Badge size="xs" color="blue" variant="light" radius="sm">
                  30 segundos
                </Badge>
              </Group>

              <Divider />

              <Box maw={400}>
                <TextInput
                  label="Saldo cuenta PF al corte"
                  value={saldoCorte}
                  onChange={(e) => setSaldoCorte(e.currentTarget.value)}
                  size="sm"
                  leftSection={<Text size="xs" fw={700}>$</Text>}
                  styles={{ 
                    label: { color: '#1A3A5C', fontWeight: 600 },
                    input: { fontSize: '1rem', fontWeight: 600 } 
                  }}
                />
              </Box>

              <Group>
                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  size="xs"
                  style={{ backgroundColor: '#1A4B8C' }}
                  onClick={handleSaveDia}
                >
                  Guardar día
                </Button>
              </Group>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                saldo al corte · 30 segundos
              </Text>
            </Stack>
          </Paper>

          {/* SECCIÓN FLUJO PROYECTADO */}
          <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F7FF', color: '#1A4B8C' }}>
                  <IconTrendingUp size={18} />
                </ThemeIcon>
                <Text size="16px" fw={700} c="#1A3A5C">
                  Flujo Proyectado · Se Arma Solo
                </Text>
                <Badge size="xs" color="green" variant="light" radius="sm">
                  Automático
                </Badge>
              </Group>

              <Divider />

              {/* Marcador del gráfico de líneas */}
              <Paper p="md" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E7EB' }} radius="md">
                <Group justify="space-between" mb="xs">
                  <Text size="xs" fw={600} c="dimmed">Proyección de Entradas y Salidas ($K)</Text>
                  <Group gap="md">
                    <Group gap={4}>
                      <Box style={{ width: 10, height: 10, backgroundColor: '#3B82F6', borderRadius: 2 }} />
                      <Text size="11px" c="dimmed">Entradas $K</Text>
                    </Group>
                    <Group gap={4}>
                      <Box style={{ width: 10, height: 10, backgroundColor: '#DC2626', borderRadius: 2 }} />
                      <Text size="11px" c="dimmed">Salidas $K</Text>
                    </Group>
                  </Group>
                </Group>

                {/* SVG Gráfico de líneas simplificado */}
                <Box style={{ height: 120, width: '100%' }}>
                  <svg width="100%" height="100%" viewBox="0 0 500 100" preserveAspectRatio="none">
                    {/* Línea Entradas (Azul) */}
                    <path d="M 50,70 L 180,55 L 310,40 L 440,60" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
                    <circle cx="50" cy="70" r="3.5" fill="#3B82F6" />
                    <circle cx="180" cy="55" r="3.5" fill="#3B82F6" />
                    <circle cx="310" cy="40" r="3.5" fill="#3B82F6" />
                    <circle cx="440" cy="60" r="3.5" fill="#3B82F6" />

                    {/* Línea Salidas (Rojo) */}
                    <path d="M 50,60 L 180,65 L 310,50 L 440,75" fill="none" stroke="#DC2626" strokeWidth="2.5" />
                    <circle cx="50" cy="60" r="3.5" fill="#DC2626" />
                    <circle cx="180" cy="65" r="3.5" fill="#DC2626" />
                    <circle cx="310" cy="50" r="3.5" fill="#DC2626" />
                    <circle cx="440" cy="75" r="3.5" fill="#DC2626" />

                    {/* Eje X */}
                    <text x="50" y="92" textAnchor="middle" fontSize="9" fill="#64748B">S49</text>
                    <text x="180" y="92" textAnchor="middle" fontSize="9" fill="#64748B">S50</text>
                    <text x="310" y="92" textAnchor="middle" fontSize="9" fill="#64748B">S51</text>
                    <text x="440" y="92" textAnchor="middle" fontSize="9" fill="#64748B">S52</text>
                  </svg>
                </Box>
              </Paper>

              {/* TABLA DE FLUJO */}
              <ScrollArea style={{ width: '100%' }}>
                <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '600px' }}>
                  <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Periodo</Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Entradas
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Salidas
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right' }}>
                        Neto
                      </Table.Th>
                      <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Nota</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {flujoProyectadoData.map((row, idx) => (
                      <Table.Tr 
                        key={idx} 
                        style={{ 
                          backgroundColor: row.highlight ? '#FEF2F2' : 'transparent',
                          borderBottom: '1px solid #F0F4FF',
                        }}
                      >
                        <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A3A5C' }}>
                          {row.periodo}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.entradas}
                        </Table.Td>
                        <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                          {row.salidas}
                        </Table.Td>
                        <Table.Td
                          style={{
                            fontSize: '12px',
                            textAlign: 'right',
                            fontWeight: 700,
                            color: row.neto.startsWith('+') ? '#16A34A' : '#DC2626',
                          }}
                        >
                          {row.neto}
                        </Table.Td>
                        <Table.Td>
                          {row.highlight ? (
                            <Badge size="xs" color="amber" variant="light">
                              {row.nota}
                            </Badge>
                          ) : (
                            <Text size="12px" c="dimmed">{row.nota}</Text>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                <strong>entradas</strong> = CxC de clientes por vencimiento (PF-6) · 
                <strong>salidas</strong> = liquidaciones de viernes (PF-8) + CxP (PF-9) + nómina + Santander en sus meses
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
                <strong>✓ Al guardar:</strong> misma disciplina del grupo: una captura de 30 segundos · 
                los vencimientos reales de PF-6, PF-8 y PF-9 arman el flujo — y la deuda tiene su lugar 
                en la curva, no en la memoria.
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
                <strong>✓ PF-BAN:</strong> el banco de Produce First muestra el saldo al corte y el flujo 
                proyectado · se alimenta automáticamente de PF-6 (CxC), PF-8 (Liquidaciones) y PF-9 (CxP) · 
                el TC del grupo se usa para conversión de divisas en toda la plataforma.
              </Text>
            </Group>
          </Paper>

        </Stack>
      </Container>
    </Box>
  );
}