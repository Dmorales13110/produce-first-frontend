import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Paper,
  Text,
  Group,
  Stack,
  Badge,
  Table,
  Button,
  TextInput,
  Title,
  Card,
  ThemeIcon,
  Divider,
  Progress,
  RingProgress,
  Tooltip,
  ActionIcon,
  SegmentedControl,
  Modal,
  Textarea
} from '@mantine/core';
import {
  IconFileSpreadsheet,
  IconCheck,
  IconDownload,
  IconBuildingBank,
  IconReceiptTax,
  IconFileInvoice,
  IconChartBar,
  IconUpload,
  IconEye,
  IconEdit,
  IconRefresh,
  IconAlertCircle,
  IconArrowUpRight,
  IconArrowDownRight,
  IconClock,
  IconDatabase,
  IconPackage
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

export function GrowerContpaqiExport() {
  const [viewMode, setViewMode] = useState('equivalencias');
  const [selectedMonth, setSelectedMonth] = useState('nov');

  const [equivalences, setEquivalences] = useState([
    { cat: 'FERTILIZANTES', cuenta: '600-002-000', nombre: 'Fertilizantes y mejoradores', tipo: 'Costo' },
    { cat: 'AGROQUÍMICOS', cuenta: '600-001-000', nombre: 'Agroquímicos y fitosanitarios', tipo: 'Costo' },
    { cat: 'SEMILLA', cuenta: '600-003-000', nombre: 'Semillas', tipo: 'Costo' },
    { cat: 'PLÁNTULA', cuenta: '600-004-000', nombre: 'Plántula y vivero', tipo: 'Costo' },
    { cat: 'FLETES COSECHA', cuenta: '600-010-000', nombre: 'Fletes de cosecha', tipo: 'Costo' },
    { cat: 'DIÉSEL', cuenta: '600-006-000', nombre: 'Combustibles y lubricantes', tipo: 'Costo' },
    { cat: 'CINTA RIEGO', cuenta: '600-005-000', nombre: 'Materiales de riego', tipo: 'Costo' },
    { cat: 'NÓMINA', cuenta: '603-001-000', nombre: 'Sueldos y salarios', tipo: 'Gasto' },
  ]);

  const getStatusColor = (status: string) => {
    if (status === 'listo') return 'green';
    if (status === 'por 4 facturas') return 'orange';
    return 'gray';
  };

  return (
    <Box style={{ backgroundColor: '#F9F9F6', minHeight: '100vh', padding: '16px' }}>
      {/* Encabezado con degradado */}
      <Paper 
        p="xl" 
        radius="lg" 
        mb="xl"
        style={{ 
          background: 'linear-gradient(135deg, #1F5C3A 0%, #2A6A8A 100%)',
          color: '#FFFFFF'
        }}
      >
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Group gap="xs">
              <Badge size="xs" variant="white" color="teal" radius="sm">
                CONT-1 · Contpaqi
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                Invierno 2026-2027
              </Badge>
            </Group>
            <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
              Equivalencias y Export
            </Text>
            <Text size="sm" style={{ opacity: 0.8 }}>
              Tus categorías → sus cuentas, una sola vez
            </Text>
          </Stack>
          <Group gap="xl">
            <Group gap="sm">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                <IconDatabase size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>13</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Categorías del ERP</Text>
              </Stack>
            </Group>
            <RingProgress
              size={80}
              thickness={8}
              sections={[{ value: 94, color: '#FFFFFF' }]}
              label={
                <Text size="xs" fw={700} ta="center" style={{ color: '#FFFFFF' }}>
                  94%
                </Text>
              }
            />
          </Group>
        </Group>
      </Paper>

      {/* KPIs de Resumen */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Categorías ERP
                </Text>
                <Text size="xl" fw={800} c="#1F5C3A">13</Text>
                <Group gap={4}>
                  <IconCheck size={12} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>Todas con cuenta</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconFileSpreadsheet size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Cuentas Contpaqi
                </Text>
                <Text size="xl" fw={800} c="#2A6A8A">13 / 13</Text>
                <Group gap={4}>
                  <IconCheck size={12} color="#2A6A8A" />
                  <Text size="xs" c="#2A6A8A" fw={600}>Confirmadas por despacho</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconBuildingBank size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  IVA Acreditable Nov
                </Text>
                <Text size="xl" fw={800} c="#1F5C3A">$234.7K</Text>
                <Group gap={4}>
                  <Text size="xs" c="dimmed">DV $146.3K · JAV $88.4K</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconReceiptTax size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Paquete Nov
                </Text>
                <Text size="xl" fw={800} c="#C08412">94% listo</Text>
                <Group gap={4}>
                  <IconAlertCircle size={12} color="#C08412" />
                  <Text size="xs" c="#C08412" fw={600}>6 facturas sin conciliar</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                <IconPackage size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>
      </SimpleGrid>

      {/* Selector de Vista */}
      <Group justify="space-between" mb="md">
        <SegmentedControl
          size="sm"
          value={viewMode}
          onChange={setViewMode}
          data={[
            { value: 'equivalencias', label: 'Equivalencias' },
            { value: 'exportacion', label: 'Exportación Mensual' },
          ]}
          styles={{
            root: { backgroundColor: '#F5F3EE' },
            indicator: { backgroundColor: '#1F5C3A' },
            label: { fontWeight: 600 }
          }}
        />
        <Group gap="sm">
          <Badge variant="light" color="teal" radius="sm">
            <Group gap={4}>
              <IconClock size={12} />
              Última exportación: 28-nov-2026
            </Group>
          </Badge>
        </Group>
      </Group>

      {/* Tabla de Equivalencias */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconFileSpreadsheet size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Catálogo de Equivalencias</Text>
                <Text size="xs" c="dimmed">Categoría ERP → Cuenta Contpaqi</Text>
              </Stack>
            </Group>
            <Button 
              size="xs"
              variant="subtle"
              color="gray"
              leftSection={<IconRefresh size={14} />}
            >
              Restablecer
            </Button>
          </Group>

          <Divider mb="lg" />

          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
              <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                  <Group gap="4">
                    <IconFileInvoice size={14} />
                    Categoría (tu archivo)
                  </Group>
                </Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                  <Group gap="4">
                    <IconBuildingBank size={14} />
                    Cuenta Contpaqi
                  </Group>
                </Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                  Nombre de Cuenta
                </Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                  Tipo
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {equivalences.map((row, idx) => (
                <Table.Tr key={idx} style={{ borderBottom: '1px solid #EFECE3' }}>
                  <Table.Td>
                    <Badge variant="light" color="teal" size="sm" radius="sm">
                      {row.cat}
                    </Badge>
                  </Table.Td>
                  <Table.Td style={{ width: '180px' }}>
                    <TextInput 
                      size="xs"
                      styles={{ 
                        input: { 
                          backgroundColor: '#FFFDEB', 
                          fontWeight: 700,
                          color: '#1F5C3A',
                          borderColor: '#E8E5DC'
                        } 
                      }}
                      value={row.cuenta}
                      rightSection={<IconEdit size={12} color="#9A968A" />}
                    />
                  </Table.Td>
                  <Table.Td c="dimmed">{row.nombre}</Table.Td>
                  <Table.Td>
                    <Badge 
                      size="sm"
                      color={row.tipo === 'Costo' ? 'blue' : 'gray'}
                      variant="light"
                      radius="sm"
                    >
                      {row.tipo}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Group justify="flex-end" mt="md">
            <Button 
              size="sm"
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconCheck size={16} />}
            >
              Guardar Equivalencias
            </Button>
          </Group>
        </Card>
      </motion.div>

      {/* Exportación Mensual */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconDownload size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Exportación Mensual</Text>
                <Text size="xs" c="dimmed">Formato Hojas Electrónicas</Text>
              </Stack>
            </Group>
            <SegmentedControl
              size="xs"
              value={selectedMonth}
              onChange={setSelectedMonth}
              data={[
                { value: 'sep', label: 'Sep' },
                { value: 'oct', label: 'Oct' },
                { value: 'nov', label: 'Nov' },
                { value: 'dic', label: 'Dic' },
              ]}
              styles={{
                root: { backgroundColor: '#F5F3EE' },
                indicator: { backgroundColor: '#1F5C3A' },
                label: { fontWeight: 600 }
              }}
            />
          </Group>

          <Divider mb="lg" />

          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
              <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                  <Group gap="4">
                    <IconPackage size={14} />
                    Paquete
                  </Group>
                </Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Empresa</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Contenido</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">Estado</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr style={{ borderBottom: '1px solid #EFECE3' }}>
                <Table.Td fw={600} c="#3A3A34">Egresos + IVA Acreditable</Table.Td>
                <Table.Td>
                  <Badge variant="outline" color="teal" size="sm" radius="sm">DV</Badge>
                </Table.Td>
                <Table.Td c="dimmed">248 facturas con cuenta asignada</Table.Td>
                <Table.Td ta="center">
                  <Badge 
                    size="sm"
                    color="orange"
                    variant="light"
                    radius="xl"
                    leftSection={<IconAlertCircle size={12} />}
                  >
                    Por 4 facturas
                  </Badge>
                </Table.Td>
              </Table.Tr>
              <Table.Tr style={{ borderBottom: '1px solid #EFECE3' }}>
                <Table.Td fw={600} c="#3A3A34">Ingresos (CFDI a PF e interco.)</Table.Td>
                <Table.Td>
                  <Badge variant="outline" color="green" size="sm" radius="sm">Ambas</Badge>
                </Table.Td>
                <Table.Td c="dimmed">6 facturas de CXC-1</Table.Td>
                <Table.Td ta="center">
                  <Badge 
                    size="sm"
                    color="green"
                    variant="light"
                    radius="xl"
                    leftSection={<IconCheck size={12} />}
                  >
                    Listo
                  </Badge>
                </Table.Td>
              </Table.Tr>
              <Table.Tr style={{ backgroundColor: '#FFF8E1' }}>
                <Table.Td fw={600} c="#C08412">Nómina Noviembre</Table.Td>
                <Table.Td>
                  <Badge variant="outline" color="yellow" size="sm" radius="sm">Ambas</Badge>
                </Table.Td>
                <Table.Td c="dimmed">Integración de nómina semanal</Table.Td>
                <Table.Td ta="center">
                  <Badge 
                    size="sm"
                    color="yellow"
                    variant="light"
                    radius="xl"
                    leftSection={<IconClock size={12} />}
                  >
                    En proceso
                  </Badge>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          <Divider my="md" />

          <Group justify="space-between">
            <Group gap="md">
              <Group gap={4}>
                <Box style={{ width: 10, height: 10, backgroundColor: '#1F5C3A', borderRadius: 2 }} />
                <Text size="xs" c="dimmed">Listo</Text>
              </Group>
              <Group gap={4}>
                <Box style={{ width: 10, height: 10, backgroundColor: '#C08412', borderRadius: 2 }} />
                <Text size="xs" c="dimmed">En proceso</Text>
              </Group>
              <Group gap={4}>
                <Box style={{ width: 10, height: 10, backgroundColor: '#C0392B', borderRadius: 2 }} />
                <Text size="xs" c="dimmed">Pendiente</Text>
              </Group>
            </Group>
            <Button 
              size="sm"
              style={{ backgroundColor: '#1F5C3A' }}
              leftSection={<IconDownload size={16} />}
            >
              Exportar Paquete de Noviembre
            </Button>
          </Group>
        </Card>
      </motion.div>
    </Box>
  );
}