import { useState } from 'react';
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
  Grid,
  Card,
  ThemeIcon,
  Divider,
  Progress,
  RingProgress,
  Alert,
  Loader,
  Center,
  NumberInput,
  Modal,
  TextInput,
  Textarea,
  ActionIcon,
  Tooltip,
  ScrollArea,
} from '@mantine/core';
import {
  IconCalculator,
  IconCheck,
  IconCoins,
  IconTrendingUp,
  IconChartBar,
  IconFileAnalytics,
  IconPencilCheck,
  IconRefresh,
  IconArrowUpRight,
  IconBuildingBank,
  IconTarget,
  IconAlertCircle,
  IconPlus,
  IconTrash,
  IconEdit,
  IconDotsVertical,
  IconX,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useBudget } from './hooks/useBudget';
import { notifications } from '@mantine/notifications';

// ID de temporada por defecto
const DEFAULT_SEASON_ID = 'season-2026-2027';

export function GrowerSeasonBudget() {
  const {
    season,
    costs,
    fob,
    summary,
    isLoading,
    error,
    refresh,
    updateSeason,
    createCost,
    updateCost,
    deleteCost,
    createFOB,
    updateFOB,
    deleteFOB,
    saveBudget,
  } = useBudget(DEFAULT_SEASON_ID);

  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para modales
  const [newCostModalOpen, setNewCostModalOpen] = useState(false);
  const [newFOBModalOpen, setNewFOBModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: 'cost' | 'fob' } | null>(null);

  // Estado para nuevo costo
  const [newCostForm, setNewCostForm] = useState({
    category: '',
    san_aparicio: 0,
    la_escondida: 0,
    notes: '',
  });

  // Estado para nuevo FOB
  const [newFOBForm, setNewFOBForm] = useState({
    crop_1: '',
    fob_1: 0,
    crop_2: '',
    fob_2: 0,
  });

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleSeasonChange = (field: keyof typeof season, value: any) => {
    if (!season) return;
    updateSeason({ [field]: value });
  };

  const handleCostChange = async (id: string, field: 'san_aparicio' | 'la_escondida', value: number) => {
    const cost = costs.find(c => c.id === id);
    if (!cost) return;

    try {
      await updateCost(id, {
        category: cost.category,
        san_aparicio: field === 'san_aparicio' ? value : cost.san_aparicio,
        la_escondida: field === 'la_escondida' ? value : cost.la_escondida,
        notes: cost.notes,
      });
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al actualizar costo',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const handleFOBChange = async (id: string, field: 'fob_1' | 'fob_2', value: number) => {
    const fobItem = fob.find(f => f.id === id);
    if (!fobItem) return;

    try {
      await updateFOB(id, {
        crop_1: fobItem.crop_1,
        fob_1: field === 'fob_1' ? value : fobItem.fob_1,
        crop_2: fobItem.crop_2,
        fob_2: field === 'fob_2' ? value : fobItem.fob_2,
      });
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al actualizar FOB',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  // ============================================================
  // HANDLERS - AGREGAR
  // ============================================================

  const handleAddCost = async () => {
    if (!newCostForm.category.trim()) {
      notifications.show({
        title: '⚠️ Campo requerido',
        message: 'La categoría es obligatoria',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createCost({
        category: newCostForm.category,
        san_aparicio: newCostForm.san_aparicio || 0,
        la_escondida: newCostForm.la_escondida || 0,
        notes: newCostForm.notes || '',
      });
      notifications.show({
        title: '✅ Categoría agregada',
        message: `${newCostForm.category} agregada exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      setNewCostModalOpen(false);
      setNewCostForm({ category: '', san_aparicio: 0, la_escondida: 0, notes: '' });
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al agregar categoría',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFOB = async () => {
    if (!newFOBForm.crop_1.trim()) {
      notifications.show({
        title: '⚠️ Campo requerido',
        message: 'El nombre del cultivo es obligatorio',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createFOB({
        crop_1: newFOBForm.crop_1,
        fob_1: newFOBForm.fob_1 || 0,
        crop_2: newFOBForm.crop_2 || '',
        fob_2: newFOBForm.fob_2 || 0,
      });
      notifications.show({
        title: '✅ Cultivo agregado',
        message: `${newFOBForm.crop_1} agregado exitosamente`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      setNewFOBModalOpen(false);
      setNewFOBForm({ crop_1: '', fob_1: 0, crop_2: '', fob_2: 0 });
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al agregar cultivo',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // HANDLERS - ELIMINAR
  // ============================================================

  const handleDeleteClick = (id: string, name: string, type: 'cost' | 'fob') => {
    setDeleteTarget({ id, name, type });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsSubmitting(true);
    try {
      if (deleteTarget.type === 'cost') {
        await deleteCost(deleteTarget.id);
        notifications.show({
          title: '✅ Categoría eliminada',
          message: `${deleteTarget.name} eliminada exitosamente`,
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      } else {
        await deleteFOB(deleteTarget.id);
        notifications.show({
          title: '✅ Cultivo eliminado',
          message: `${deleteTarget.name} eliminado exitosamente`,
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      }
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al eliminar',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // HANDLERS - GUARDAR
  // ============================================================

  const handleSaveBudget = async () => {
    setIsSaving(true);
    try {
      await saveBudget();
      notifications.show({
        title: '✅ Presupuesto guardado',
        message: 'El presupuesto de temporada ha sido guardado exitosamente',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    } catch (err: any) {
      notifications.show({
        title: '❌ Error',
        message: err.message || 'Error al guardar presupuesto',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // CÁLCULOS
  // ============================================================

  const totalSA = costs.reduce((acc, curr) => acc + curr.san_aparicio, 0);
  const totalLE = costs.reduce((acc, curr) => acc + curr.la_escondida, 0);
  const totalPromedio = costs.length > 0 ? (totalSA + totalLE) / 2 : 0;

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando presupuesto...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Box p="md">
        <Alert
          color="red"
          variant="light"
          title="Error al cargar datos"
          icon={<IconAlertCircle size={16} />}
        >
          {error}
          <Button
            size="xs"
            variant="subtle"
            color="red"
            onClick={refresh}
            mt="sm"
            leftSection={<IconRefresh size={14} />}
          >
            Reintentar
          </Button>
        </Alert>
      </Box>
    );
  }

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
                PRE-1 · Presupuesto
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                {season?.name || 'Temporada'}
              </Badge>
            </Group>
            <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
              Presupuesto de Temporada
            </Text>
            <Text size="sm" style={{ opacity: 0.8 }}>
              El "plan" contra el que todo se mide · Captura anual
            </Text>
          </Stack>
          <Group gap="xl">
            <Group gap="sm">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                <IconTarget size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="lg" fw={700}>${summary?.result?.profit_usd?.toLocaleString() || '0'}K</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>Utilidad plan</Text>
              </Stack>
            </Group>
            <RingProgress
              size={80}
              thickness={8}
              sections={[{ value: summary?.result?.execution_percent || 0, color: '#FFFFFF' }]}
              label={
                <Text size="xs" fw={700} ta="center" style={{ color: '#FFFFFF' }}>
                  {Math.round(summary?.result?.execution_percent || 0)}%
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
                  Costo/ha Promedio
                </Text>
                <Text size="xl" fw={800} c="#1F5C3A">${totalPromedio.toFixed(0)}</Text>
                <Group gap={4}>
                  <IconArrowUpRight size={12} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>+2.3% vs última temp.</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconCalculator size={20} stroke={2} />
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
                  TC Plan
                </Text>
                <Text size="xl" fw={800} c="#2A6A8A">${season?.exchange_rate?.toFixed(2) || '17.68'}</Text>
                <Group gap={4}>
                  <Text size="xs" c="dimmed">Comisión PF: {season?.commission_percent || 10}%</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconCoins size={20} stroke={2} />
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
                  Utilidad Plan
                </Text>
                <Text size="xl" fw={800} c="#1F5C3A">${summary?.result?.profit_usd?.toLocaleString() || '0'}K</Text>
                <Group gap={4}>
                  <IconTrendingUp size={12} color="#1F5C3A" />
                  <Text size="xs" c="#1F5C3A" fw={600}>+12.4% vs última temp.</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconTrendingUp size={20} stroke={2} />
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
                  Cajas Plan
                </Text>
                <Text size="xl" fw={800} c="#2A6A8A">{summary?.result?.total_boxes?.toLocaleString() || '0'}</Text>
                <Group gap={4}>
                  <Text size="xs" c="dimmed">Venta FOB: ${(summary?.result?.total_fob_usd || 0).toLocaleString()}</Text>
                </Group>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconChartBar size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </motion.div>
      </SimpleGrid>

      {/* 1. Costo por Hectárea */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconCalculator size={18} color="#1F5C3A" />
              <Stack gap={0}>
                <Text size="sm" fw={700} c="#3A3A34">Costo por Hectárea</Text>
                <Text size="xs" c="dimmed">Captura por categoría y rancho</Text>
              </Stack>
            </Group>
            <Group gap="xs">
              <Badge variant="light" color="teal" radius="sm">SA: ${totalSA.toLocaleString()}</Badge>
              <Badge variant="light" color="blue" radius="sm">LE: ${totalLE.toLocaleString()}</Badge>
              <Button
                size="xs"
                variant="subtle"
                color="teal"
                leftSection={<IconPlus size={14} />}
                onClick={() => setNewCostModalOpen(true)}
              >
                Agregar
              </Button>
            </Group>
          </Group>

          <Divider mb="lg" />

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Categoría</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">San Aparicio</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">La Escondida</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Nota</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {costs.map((row) => (
                  <Table.Tr key={row.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                    <Table.Td fw={600} c="#3A3A34">{row.category}</Table.Td>
                    <Table.Td ta="right" style={{ width: '130px' }}>
                      <NumberInput
                        size="xs"
                        styles={{ 
                          input: { 
                            textAlign: 'right', 
                            backgroundColor: '#FFFDEB', 
                            fontWeight: 700,
                            borderColor: '#E8E5DC',
                            color: '#1F5C3A',
                            minWidth: '80px'
                          } 
                        }}
                        value={row.san_aparicio}
                        onChange={(value) => handleCostChange(row.id, 'san_aparicio', Number(value) || 0)}
                        min={0}
                        step={10}
                      />
                    </Table.Td>
                    <Table.Td ta="right" style={{ width: '130px' }}>
                      <NumberInput
                        size="xs"
                        styles={{ 
                          input: { 
                            textAlign: 'right', 
                            backgroundColor: '#FFFDEB', 
                            fontWeight: 700,
                            borderColor: '#E8E5DC',
                            color: '#2A6A8A',
                            minWidth: '80px'
                          } 
                        }}
                        value={row.la_escondida}
                        onChange={(value) => handleCostChange(row.id, 'la_escondida', Number(value) || 0)}
                        min={0}
                        step={10}
                      />
                    </Table.Td>
                    <Table.Td c="dimmed">{row.notes}</Table.Td>
                    <Table.Td ta="center">
                      <Tooltip label="Eliminar categoría">
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          size="sm"
                          onClick={() => handleDeleteClick(row.id, row.category, 'cost')}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
                <Table.Tr style={{ backgroundColor: '#FAF9F5', borderTop: '2px solid #E5E2D9' }}>
                  <Table.Td fw={800} c="#1F5C3A">TOTAL $/ha</Table.Td>
                  <Table.Td ta="right" fw={800} c="#1F5C3A">${totalSA.toLocaleString()}</Table.Td>
                  <Table.Td ta="right" fw={800} c="#2A6A8A">${totalLE.toLocaleString()}</Table.Td>
                  <Table.Td />
                  <Table.Td />
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </ScrollArea>

          <Group justify="flex-end" mt="md">
            <Button 
              size="xs" 
              variant="subtle" 
              color="gray" 
              leftSection={<IconRefresh size={14} />}
              onClick={refresh}
            >
              Restablecer
            </Button>
            <Button 
              size="xs" 
              style={{ backgroundColor: '#1F5C3A' }} 
              leftSection={<IconPencilCheck size={14} />}
              onClick={handleSaveBudget}
              loading={isSaving}
            >
              Guardar Presupuesto
            </Button>
          </Group>
        </Card>
      </motion.div>

      {/* 2. FOB Plan */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group gap="sm" mb="lg">
            <IconCoins size={18} color="#2A6A8A" />
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#3A3A34">FOB Plan por Cultivo</Text>
              <Text size="xs" c="dimmed">Precios objetivo y tipo de cambio</Text>
            </Stack>
            <Button
              size="xs"
              variant="subtle"
              color="blue"
              leftSection={<IconPlus size={14} />}
              onClick={() => setNewFOBModalOpen(true)}
              ml="auto"
            >
              Agregar Cultivo
            </Button>
          </Group>

          <Divider mb="lg" />

          <Grid mb="lg">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Tipo de Cambio Plan"
                size="xs"
                value={season?.exchange_rate || 17.68}
                onChange={(value) => handleSeasonChange('exchange_rate', Number(value) || 17.68)}
                min={10}
                max={30}
                step={0.01}
                precision={2}
                styles={{ 
                  label: { fontWeight: 600, fontSize: '12px' },
                  input: { fontWeight: 700, color: '#1F5C3A' }
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Comisión PF"
                size="xs"
                value={season?.commission_percent || 10}
                onChange={(value) => handleSeasonChange('commission_percent', Number(value) || 0)}
                min={0}
                max={100}
                step={0.5}
                styles={{ 
                  label: { fontWeight: 600, fontSize: '12px' },
                  input: { fontWeight: 700 }
                }}
                rightSection="%"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Anticipo a Liquidación"
                size="xs"
                value={season?.advance_percent || 48.4}
                onChange={(value) => handleSeasonChange('advance_percent', Number(value) || 0)}
                min={0}
                max={100}
                step={0.5}
                styles={{ 
                  label: { fontWeight: 600, fontSize: '12px' },
                  input: { fontWeight: 700, color: '#2A6A8A' }
                }}
                rightSection="%"
              />
            </Grid.Col>
          </Grid>

          <ScrollArea>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Cultivo</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">FOB Plan USD/cj</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Cultivo</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">FOB Plan USD/cj</Table.Th>
                  <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="center">Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {fob.map((item) => (
                  <Table.Tr key={item.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                    <Table.Td fw={600} c="#3A3A34">{item.crop_1}</Table.Td>
                    <Table.Td ta="right" style={{ width: '120px' }}>
                      <NumberInput
                        size="xs"
                        styles={{ 
                          input: { 
                            textAlign: 'right', 
                            backgroundColor: '#FFFDEB', 
                            fontWeight: 700,
                            borderColor: '#E8E5DC',
                            color: '#1F5C3A'
                          } 
                        }}
                        value={item.fob_1}
                        onChange={(value) => handleFOBChange(item.id, 'fob_1', Number(value) || 0)}
                        min={0}
                        step={0.5}
                        precision={2}
                        rightSection="$"
                        rightSectionWidth={20}
                      />
                    </Table.Td>
                    <Table.Td fw={600} c="#3A3A34">{item.crop_2}</Table.Td>
                    <Table.Td ta="right" style={{ width: '120px' }}>
                      <NumberInput
                        size="xs"
                        styles={{ 
                          input: { 
                            textAlign: 'right', 
                            backgroundColor: '#FFFDEB', 
                            fontWeight: 700,
                            borderColor: '#E8E5DC',
                            color: '#2A6A8A'
                          } 
                        }}
                        value={item.fob_2}
                        onChange={(value) => handleFOBChange(item.id, 'fob_2', Number(value) || 0)}
                        min={0}
                        step={0.5}
                        precision={2}
                        rightSection="$"
                        rightSectionWidth={20}
                      />
                    </Table.Td>
                    <Table.Td ta="center">
                      <Tooltip label="Eliminar cultivo">
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          size="sm"
                          onClick={() => handleDeleteClick(item.id, item.crop_1, 'fob')}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>
      </motion.div>

      {/* 3. Resultado Plan */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        style={{ marginBottom: '24px' }}
      >
        <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
          <Group gap="sm" mb="lg">
            <IconFileAnalytics size={18} color="#1F5C3A" />
            <Stack gap={0}>
              <Text size="sm" fw={700} c="#3A3A34">Resultado del Plan</Text>
              <Text size="xs" c="dimmed">Resumen de la temporada</Text>
            </Stack>
          </Group>

          <Divider mb="lg" />

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                {[
                  { label: 'Cajas', value: summary?.result?.total_boxes?.toLocaleString() || '0', color: '#1F5C3A' },
                  { label: 'Venta FOB', value: `$${(summary?.result?.total_fob_usd || 0).toLocaleString()} USD`, color: '#2A6A8A' },
                  { label: 'Liquidación Neta', value: `$${(summary?.result?.net_liquidation_usd || 0).toLocaleString()} USD`, color: '#2A6A8A' },
                  { label: 'Costo Total', value: `$${(summary?.result?.total_cost_usd || 0).toLocaleString()} USD`, color: '#C08412' },
                ].map((item, idx) => (
                  <Group key={idx} justify="space-between" p="xs" style={{ 
                    backgroundColor: idx % 2 === 0 ? '#FAF9F5' : 'transparent',
                    borderRadius: '6px'
                  }}>
                    <Text size="sm" fw={600} c="#3A3A34">{item.label}</Text>
                    <Text size="sm" fw={700} c={item.color}>{item.value}</Text>
                  </Group>
                ))}
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="xl" style={{ 
                backgroundColor: '#E8F5E9', 
                borderRadius: '12px',
                border: '2px solid #1F5C3A',
                textAlign: 'center'
              }}>
                <Text size="xs" fw={600} c="#1F5C3A" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Utilidad de Temporada
                </Text>
                <Text size="32px" fw={800} c="#1F5C3A" mt="xs">${(summary?.result?.profit_usd || 0).toLocaleString()} USD</Text>
                <Divider my="sm" color="#1F5C3A" opacity={0.3} />
                <Group justify="center" gap="xl">
                  <Stack gap={0} align="center">
                    <Text size="xs" c="dimmed">Por caja</Text>
                    <Text size="sm" fw={700} c="#1F5C3A">${(summary?.result?.profit_per_box || 0).toFixed(2)} USD</Text>
                  </Stack>
                  <Stack gap={0} align="center">
                    <Text size="xs" c="dimmed">Margen</Text>
                    <Text size="sm" fw={700} c="#1F5C3A">{(summary?.result?.margin_percent || 0).toFixed(1)}%</Text>
                  </Stack>
                </Group>
                <Progress 
                  value={summary?.result?.execution_percent || 0} 
                  color="#1F5C3A" 
                  size="sm" 
                  radius="xl" 
                  mt="md" 
                />
                <Text size="xs" c="dimmed" mt={4}>
                  {Math.round(summary?.result?.execution_percent || 0)}% del presupuesto ejecutado
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>
      </motion.div>

      {/* Nota al pie */}
      <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Group gap="xs">
          <ThemeIcon size="sm" radius="xl" color="teal" variant="light">
            <IconBuildingBank size={14} />
          </ThemeIcon>
          <Text size="xs" c="dimmed" style={{ lineHeight: 1.6 }}>
            <strong>Nota:</strong> Al guardar, cada gasto real capturado (OC, buzón, nómina, diésel) 
            se compara contra SU categoría de este presupuesto. El puente plan-real de G-17 nace aquí. 
            Los campos en amarillo son editables para ajustar el presupuesto.
          </Text>
        </Group>
      </Card>

      {/* ============================================================
          MODAL: Agregar Categoría de Costo
      ============================================================ */}
      <Modal
        opened={newCostModalOpen}
        onClose={() => {
          setNewCostModalOpen(false);
          setNewCostForm({ category: '', san_aparicio: 0, la_escondida: 0, notes: '' });
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconPlus size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Agregar Categoría de Costo</Text>
              <Text size="xs" c="dimmed">Nueva categoría para el presupuesto</Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAddCost(); }}>
          <Stack gap="md">
            <TextInput
              label="Categoría"
              placeholder="Ej: Empaques, Transporte, etc."
              value={newCostForm.category}
              onChange={(e) => setNewCostForm({ ...newCostForm, category: e.currentTarget.value })}
              required
              autoFocus
            />
            <NumberInput
              label="San Aparicio ($/ha)"
              placeholder="0"
              value={newCostForm.san_aparicio}
              onChange={(value) => setNewCostForm({ ...newCostForm, san_aparicio: Number(value) || 0 })}
              min={0}
              step={10}
            />
            <NumberInput
              label="La Escondida ($/ha)"
              placeholder="0"
              value={newCostForm.la_escondida}
              onChange={(value) => setNewCostForm({ ...newCostForm, la_escondida: Number(value) || 0 })}
              min={0}
              step={10}
            />
            <TextInput
              label="Nota (opcional)"
              placeholder="Observación sobre esta categoría"
              value={newCostForm.notes}
              onChange={(e) => setNewCostForm({ ...newCostForm, notes: e.currentTarget.value })}
            />
            <Divider />
            <Group justify="space-between">
              <Button 
                variant="subtle" 
                color="gray" 
                onClick={() => {
                  setNewCostModalOpen(false);
                  setNewCostForm({ category: '', san_aparicio: 0, la_escondida: 0, notes: '' });
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                loading={isSubmitting}
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={<IconCheck size={16} />}
              >
                Agregar Categoría
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* ============================================================
          MODAL: Agregar Cultivo FOB
      ============================================================ */}
      <Modal
        opened={newFOBModalOpen}
        onClose={() => {
          setNewFOBModalOpen(false);
          setNewFOBForm({ crop_1: '', fob_1: 0, crop_2: '', fob_2: 0 });
        }}
        title={
          <Group gap="sm">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
              <IconPlus size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" fw={700}>Agregar Cultivo FOB</Text>
              <Text size="xs" c="dimmed">Nuevo cultivo con precio objetivo</Text>
            </Stack>
          </Group>
        }
        size="md"
        centered
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAddFOB(); }}>
          <Stack gap="md">
            <TextInput
              label="Cultivo 1"
              placeholder="Ej: Lechuga Romana"
              value={newFOBForm.crop_1}
              onChange={(e) => setNewFOBForm({ ...newFOBForm, crop_1: e.currentTarget.value })}
              required
              autoFocus
            />
            <NumberInput
              label="FOB 1 (USD/caja)"
              placeholder="0.00"
              value={newFOBForm.fob_1}
              onChange={(value) => setNewFOBForm({ ...newFOBForm, fob_1: Number(value) || 0 })}
              min={0}
              step={0.5}
              precision={2}
            />
            <Divider label="Cultivo 2 (opcional)" labelPosition="center" />
            <TextInput
              label="Cultivo 2"
              placeholder="Ej: Lechuga Batavia"
              value={newFOBForm.crop_2}
              onChange={(e) => setNewFOBForm({ ...newFOBForm, crop_2: e.currentTarget.value })}
            />
            <NumberInput
              label="FOB 2 (USD/caja)"
              placeholder="0.00"
              value={newFOBForm.fob_2}
              onChange={(value) => setNewFOBForm({ ...newFOBForm, fob_2: Number(value) || 0 })}
              min={0}
              step={0.5}
              precision={2}
            />
            <Divider />
            <Group justify="space-between">
              <Button 
                variant="subtle" 
                color="gray" 
                onClick={() => {
                  setNewFOBModalOpen(false);
                  setNewFOBForm({ crop_1: '', fob_1: 0, crop_2: '', fob_2: 0 });
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                loading={isSubmitting}
                style={{ backgroundColor: '#2A6A8A' }}
                leftSection={<IconCheck size={16} />}
              >
                Agregar Cultivo
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* ============================================================
          MODAL: Confirmar Eliminación
      ============================================================ */}
      <Modal
        opened={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setDeleteTarget(null);
        }}
        title="Confirmar Eliminación"
        size="sm"
        centered
      >
        <Stack gap="md">
          <Alert
            color="red"
            variant="light"
            title="¿Estás seguro?"
            icon={<IconAlertCircle size={16} />}
          >
            <Text size="sm">
              Vas a eliminar <strong>{deleteTarget?.name}</strong>.
              Esta acción no se puede deshacer.
            </Text>
          </Alert>

          <Group justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setDeleteTarget(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              color="red"
              loading={isSubmitting}
              leftSection={<IconTrash size={16} />}
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

export default GrowerSeasonBudget;