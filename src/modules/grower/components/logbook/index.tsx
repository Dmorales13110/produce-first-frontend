// src/modules/grower/GrowerLogBook.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Table, 
  Paper, 
  Text, 
  Group, 
  Badge, 
  ActionIcon, 
  Stack,
  SimpleGrid,
  Card,
  ThemeIcon,
  Divider,
  Loader,
  Center,
  Alert,
  Button,
  Modal,
  TextInput,
  Select,
  Textarea,
  Grid
} from '@mantine/core';
import { 
  IconCircleCheck, 
  IconCircleX, 
  IconEye,
  IconClock,
  IconPlus,
  IconRefresh,
  IconAlertCircle,
  IconEdit,
  IconTrash,
  IconFilter,
  IconCalendar
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useLogBook } from './hooks/useLogBook';

export function GrowerLogBook() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sector: '',
    parameter: '',
    tech: '',
    status: 'Pendiente' as const,
    description: '',
  });

  const { logs, summary, isLoading, error, refresh, createLog, updateLog, deleteLog, updateStatus } = useLogBook();

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLog) {
        await updateLog({ id: editingLog.id, ...formData });
      } else {
        await createLog(formData);
      }
      setModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      await deleteLog(id);
    }
  };

  const handleEdit = (log: any) => {
    setEditingLog(log);
    setFormData({
      date: log.date,
      sector: log.sector,
      parameter: log.parameter,
      tech: log.tech,
      status: log.status,
      description: log.description || '',
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditingLog(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      sector: '',
      parameter: '',
      tech: '',
      status: 'Pendiente',
      description: '',
    });
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Liberado') return <IconCircleCheck size={14} />;
    if (status === 'Pendiente') return <IconClock size={14} />;
    return <IconCircleX size={14} />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'Liberado') return 'green';
    if (status === 'Pendiente') return 'yellow';
    if (status === 'En Proceso') return 'blue';
    return 'red';
  };

  // ============================================================
  // ESTADOS DE CARGA Y ERROR
  // ============================================================
  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando bitácora...</Text>
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
    <Box>
      {/* Encabezado */}
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={0}>
          <Text size="xs" fw={700} c="#1F5C3A" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
            G-04 · Bitácora
          </Text>
          <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            Registros de Campo
          </Text>
          <Text size="sm" c="dimmed">
            Seguimiento de actividades y monitoreo de campo
          </Text>
        </Stack>
        <Group gap="sm">
          <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
            {summary?.liberados || 0} Liberados
          </Badge>
          <Button
            size="sm"
            style={{ backgroundColor: '#1F5C3A' }}
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
          >
            Nuevo Registro
          </Button>
          <Button
            size="xs"
            variant="subtle"
            color="teal"
            onClick={refresh}
            leftSection={<IconRefresh size={14} />}
          >
            Actualizar
          </Button>
        </Group>
      </Group>

      {/* KPIs de Resumen */}
      {summary && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Total Registros</Text>
                <Text size="xl" fw={800} c="#1F5C3A">{summary.totalLogs}</Text>
                <Text size="xs" c="dimmed">Bitácora completa</Text>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconCalendar size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Liberados</Text>
                <Text size="xl" fw={800} c="#1F5C3A">{summary.liberados}</Text>
                <Text size="xs" c="dimmed">Completados</Text>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconCircleCheck size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Pendientes</Text>
                <Text size="xl" fw={800} c="#C08412">{summary.pendientes}</Text>
                <Text size="xs" c="dimmed">Por completar</Text>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                <IconClock size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">En Proceso</Text>
                <Text size="xl" fw={800} c="#2A6A8A">{summary.enProceso || 0}</Text>
                <Text size="xs" c="dimmed">Activos</Text>
              </Stack>
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconEdit size={20} stroke={2} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>
      )}

      {/* Tabla */}
      <Paper withBorder style={{ borderColor: '#E8E5DC', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
          <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
            <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Folio</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ubicación</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actividad</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Responsable</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estado</Table.Th>
              <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <Table.Tr key={log.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                  <Table.Td>
                    <Text size="xs" fw={700} c="#1F5C3A" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                      {log.code || log.id.substring(0, 8).toUpperCase()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" fw={500} c="#3A3A34">{log.date}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" fw={500} c="#3A3A34">{log.sector}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="#3A3A34">{log.parameter}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed">{log.tech}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      variant="light" 
                      color={getStatusColor(log.status)}
                      leftSection={getStatusIcon(log.status)}
                      style={{ borderRadius: '4px', fontWeight: 600, padding: '4px 10px' }}
                    >
                      {log.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <ActionIcon 
                        variant="subtle" 
                        color="blue" 
                        size="sm"
                        style={{ borderRadius: '4px' }}
                        onClick={() => handleEdit(log)}
                      >
                        <IconEdit size={16} stroke={1.5} />
                      </ActionIcon>
                      <ActionIcon 
                        variant="subtle" 
                        color="red" 
                        size="sm"
                        style={{ borderRadius: '4px' }}
                        onClick={() => handleDelete(log.id)}
                      >
                        <IconTrash size={16} stroke={1.5} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} ta="center" py="xl">
                  <Stack align="center" gap="sm">
                    <IconEye size={40} color="#9A968A" opacity={0.4} />
                    <Text size="sm" c="dimmed">No hay registros en la bitácora</Text>
                    <Text size="xs" c="dimmed">Comienza agregando un nuevo registro</Text>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Nota al pie */}
      <Card mt="md" p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Group gap="xs">
          <ThemeIcon size="sm" radius="xl" color="teal" variant="light">
            <IconFilter size={14} />
          </ThemeIcon>
          <Text size="xs" c="dimmed" style={{ lineHeight: 1.6 }}>
            <strong>Nota:</strong> La bitácora muestra todos los registros de campo. 
            Los registros "Pendientes" requieren revisión y liberación. 
            {logs.length} registros mostrados.
          </Text>
        </Group>
      </Card>

      {/* Modal de Creación/Edición */}
      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingLog ? 'Editar Registro' : 'Nuevo Registro'}
        size="lg"
        centered
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Fecha"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.currentTarget.value })}
              required
            />

            <TextInput
              label="Ubicación / Sector"
              placeholder="Ej: Sector A - Lote 3"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.currentTarget.value })}
              required
            />

            <TextInput
              label="Actividad / Parámetro"
              placeholder="Ej: Aplicación Foliar Calcio"
              value={formData.parameter}
              onChange={(e) => setFormData({ ...formData, parameter: e.currentTarget.value })}
              required
            />

            <TextInput
              label="Responsable"
              placeholder="Ej: Ing. R. Silva"
              value={formData.tech}
              onChange={(e) => setFormData({ ...formData, tech: e.currentTarget.value })}
              required
            />

            <Select
              label="Estado"
              data={[
                { value: 'Pendiente', label: 'Pendiente' },
                { value: 'En Proceso', label: 'En Proceso' },
                { value: 'Liberado', label: 'Liberado' },
                { value: 'Cancelado', label: 'Cancelado' },
              ]}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value as any })}
              required
            />

            <Textarea
              label="Descripción"
              placeholder="Detalles adicionales de la actividad..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
              rows={3}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" color="gray" onClick={() => {
                setModalOpen(false);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                style={{ backgroundColor: '#1F5C3A' }}
                disabled={!formData.sector || !formData.parameter || !formData.tech}
              >
                {editingLog ? 'Actualizar' : 'Guardar'} Registro
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}

export default GrowerLogBook;