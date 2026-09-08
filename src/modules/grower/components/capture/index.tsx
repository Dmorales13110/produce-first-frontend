// src/modules/grower/capture/index.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Group,
  Stack,
  Badge,
  SegmentedControl,
  Card,
  ThemeIcon,
  Divider,
  Loader,
  Center,
  Alert,
  Button,
  SimpleGrid,
  Table
} from '@mantine/core';
import {
  IconScale,
  IconLeaf,
  IconClipboardCheck,
  IconList,
  IconRefresh,
  IconAlertCircle,
  IconBox,
  IconCheck,
  IconX,
  IconEye
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useCapture } from './hooks/useCapture';
import { HarvestForm } from './components/HarvestForm';
import { LaborForm } from './components/LaborForm';
import { QualityAudit } from './components/QualityAudit';

export function GrowerCapture() {
  const [formType, setFormType] = useState('cosecha');
  const [qualityAuditOpen, setQualityAuditOpen] = useState(false);
  const [harvestReceptionId, setHarvestReceptionId] = useState<string>('');
  const [growerId, setGrowerId] = useState<string>('');
  const [totalBoxes, setTotalBoxes] = useState<number>(0);

  const { 
    harvests, 
    isLoading, 
    error, 
    refreshHarvests, 
    getStats,
    setSelectedGrower,
    growers 
  } = useCapture();

  const stats = getStats();

  // Debug - verificar datos
  useEffect(() => {
    console.log('📊 [GrowerCapture] harvests actualizados:', harvests);
    console.log('📊 [GrowerCapture] Cantidad de harvests:', harvests.length);
    
    if (harvests.length > 0) {
      console.log('📊 [GrowerCapture] Primer harvest:', {
        id: harvests[0].id,
        code: harvests[0].code,
        good_boxes: harvests[0].good_boxes,
        rejected_boxes: harvests[0].rejected_boxes,
        quality_percentage: harvests[0].quality_percentage,
        weight_kg: harvests[0].weight_kg,
      });
    }
  }, [harvests]);

  // Seleccionar el primer grower por defecto
  useEffect(() => {
    if (growers.length > 0) {
      setSelectedGrower(growers[0].id);
    }
  }, [growers, setSelectedGrower]);

  // Manejar apertura de auditoría de calidad
  const handleQualityAudit = (id: string) => {
    const harvest = harvests.find(h => h.id === id);
    if (harvest) {
      setHarvestReceptionId(id);
      setGrowerId(harvest.grower_id);
      setTotalBoxes(harvest.good_boxes + harvest.rejected_boxes);
      setQualityAuditOpen(true);
    }
  };

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando módulo de captura...</Text>
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
          title="Error al cargar el módulo"
          icon={<IconAlertCircle size={16} />}
        >
          {error}
          <Button
            size="xs"
            variant="subtle"
            color="red"
            onClick={refreshHarvests}
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
    <Box style={{ maxWidth: 1200, margin: '0 auto', padding: '16px' }}>
      {/* Encabezado */}
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={0}>
          <Text size="xs" fw={700} c="#1F5C3A" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
            G-1 · Captura
          </Text>
          <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            Registro de Campo
          </Text>
          <Text size="sm" c="dimmed">
            Captura de recepciones de cosecha y bitácora de labores
          </Text>
        </Stack>
        <Group gap="sm">
          <Button
            size="xs"
            variant="subtle"
            color="teal"
            onClick={async () => {
              console.log('🔄 Refrescando datos...');
              await refreshHarvests();
              console.log('📊 Datos actualizados:', harvests);
            }}
            leftSection={<IconRefresh size={14} />}
          >
            Refrescar
          </Button>
          <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
            {formType === 'cosecha' ? 'Remisión' : 'Bitácora'}
          </Badge>
        </Group>
      </Group>

      {/* Stats rápidos */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
        <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Recepciones</Text>
              <Text size="xl" fw={800} c="#1F5C3A">{stats.totalHarvests}</Text>
              <Text size="xs" c="dimmed">Total de remisiones</Text>
            </Stack>
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconBox size={20} stroke={2} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Cajas Buenas</Text>
              <Text size="xl" fw={800} c="#1F5C3A">{stats.totalGoodBoxes}</Text>
              <Text size="xs" c="dimmed">Aprobadas en calidad</Text>
            </Stack>
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
              <IconCheck size={20} stroke={2} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Cajas Rechazadas</Text>
              <Text size="xl" fw={800} c="#C0392B">{stats.totalRejectedBoxes}</Text>
              <Text size="xs" c="dimmed">Requieren rearmado</Text>
            </Stack>
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C0392B' }}>
              <IconX size={20} stroke={2} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Calidad Promedio</Text>
              <Text size="xl" fw={800} c="#2A6A8A">{stats.averageQuality}%</Text>
              <Text size="xs" c="dimmed">Overall de calidad</Text>
            </Stack>
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
              <IconClipboardCheck size={20} stroke={2} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Selector de Tipo de Formulario */}
      <Card p="sm" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <SegmentedControl
          value={formType}
          onChange={setFormType}
          fullWidth
          size="md"
          data={[
            { value: 'cosecha', label: 'Nueva Remisión de Cosecha' },
            { value: 'labores', label: 'Bitácora de Labores e Insumos' },
          ]}
          styles={{
            root: { backgroundColor: '#F5F3EE', padding: 4 },
            indicator: { backgroundColor: '#1F5C3A' },
            label: { fontWeight: 600 }
          }}
        />
      </Card>

      {/* Formulario */}
      <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        {formType === 'cosecha' ? (
          <HarvestForm
            onSuccess={() => {
              refreshHarvests();
            }}
            onQualityAudit={handleQualityAudit}
          />
        ) : (
          <LaborForm
            onSuccess={() => {
              refreshHarvests();
            }}
          />
        )}
      </Card>

      {/* Historial de Recepciones */}
      <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }} mt="xl">
        <Group gap="sm" mb="lg">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
            <IconList size={18} />
          </ThemeIcon>
          <Stack gap={0}>
            <Text size="sm" fw={700} c="#3A3A34">Historial de Recepciones</Text>
            <Text size="xs" c="dimmed">
              {harvests.length > 0 
                ? `${harvests.length} remisiones registradas` 
                : 'No hay remisiones registradas aún'}
            </Text>
          </Stack>
          <Button
            size="xs"
            variant="subtle"
            color="teal"
            onClick={() => refreshHarvests()}
            leftSection={<IconRefresh size={14} />}
            ml="auto"
          >
            Refrescar
          </Button>
        </Group>

        <Divider mb="lg" />

        {harvests.length > 0 ? (
          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
              <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Código</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Productor</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Lote</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Cajas</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Calidad</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Estado</Table.Th>
                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Acción</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {harvests.map((harvest) => (
                <Table.Tr key={harvest.id} style={{ borderBottom: '1px solid #EFECE3' }}>
                  <Table.Td fw={700} c="#1F5C3A">{harvest.code}</Table.Td>
                  <Table.Td>{harvest.grower_name || 'N/A'}</Table.Td>
                  <Table.Td>{harvest.lot_name || 'N/A'}</Table.Td>
                  <Table.Td ta="right">{harvest.good_boxes + harvest.rejected_boxes}</Table.Td>
                  <Table.Td ta="right">
                    <Badge
                      size="sm"
                      color={harvest.quality_percentage >= 90 ? 'green' : harvest.quality_percentage >= 70 ? 'yellow' : 'red'}
                      variant="light"
                      radius="xl"
                    >
                      {harvest.quality_percentage}%
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="sm"
                      color={
                        harvest.status === 'completed' ? 'green' :
                        harvest.status === 'received' ? 'blue' :
                        harvest.status === 'quality_checked' ? 'yellow' :
                        'gray'
                      }
                      variant="light"
                      radius="xl"
                    >
                      {harvest.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Button
                      size="xs"
                      variant="subtle"
                      color="teal"
                      leftSection={<IconClipboardCheck size={14} />}
                      onClick={() => handleQualityAudit(harvest.id)}
                      disabled={harvest.status === 'completed'}
                    >
                      Auditar
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <Box ta="center" py="xl">
            <ThemeIcon size="xl" radius="xl" style={{ backgroundColor: '#F5F3EE', color: '#9A968A' }}>
              <IconList size={32} />
            </ThemeIcon>
            <Text size="lg" c="dimmed" mt="md">No hay recepciones registradas</Text>
            <Text size="sm" c="dimmed">Comienza capturando una nueva remisión de cosecha</Text>
          </Box>
        )}
      </Card>

      {/* Modal de Auditoría de Calidad */}
      {qualityAuditOpen && (
        <QualityAudit
          opened={qualityAuditOpen}
          harvestReceptionId={harvestReceptionId}
          totalBoxes={totalBoxes}
          growerId={growerId}
          onClose={() => setQualityAuditOpen(false)}
          onComplete={() => {
            setQualityAuditOpen(false);
            refreshHarvests();
          }}
        />
      )}
    </Box>
  );
}

export default GrowerCapture;