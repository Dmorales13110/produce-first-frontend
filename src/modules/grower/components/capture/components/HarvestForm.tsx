// src/modules/grower/capture/components/HarvestForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Stack,
  SimpleGrid,
  Select,
  NumberInput,
  TextInput,
  Textarea,
  Group,
  Button,
  Divider,
  Card,
  Text,
  Badge,
  Alert,
  ThemeIcon
} from '@mantine/core';
import {
  IconTruck,
  IconCheck,
  IconAlertCircle,
  IconScale,
  IconUser,
  IconBox,
  IconClipboardCheck
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useCapture } from '../hooks/useCapture';
import { inputStyles } from '../styles/capture.styles';

interface HarvestFormProps {
  onSuccess?: () => void;
  onQualityAudit?: (harvestReceptionId: string) => void;
}

export const HarvestForm: React.FC<HarvestFormProps> = ({ onSuccess, onQualityAudit }) => {
  const [formData, setFormData] = useState({
    grower_id: '',
    lot_id: '',
    reception_date: new Date().toISOString().split('T')[0],
    good_boxes: 0,
    rejected_boxes: 0,
    weight_kg: 0,
    received_by: '',
    quality_inspector: '',
    observations: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [harvestReceptionId, setHarvestReceptionId] = useState<string | null>(null);

  const {
    growers,
    lots,
    getLotsByGrower,
    submitHarvest,
    getPendingRejections,
  } = useCapture();

  // Verificar rechazos pendientes al seleccionar un grower
  const [hasPendingRejections, setHasPendingRejections] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const checkPending = async () => {
      if (formData.grower_id) {
        try {
          const pending = await getPendingRejections(formData.grower_id);
          setHasPendingRejections(pending.length > 0);
          setPendingCount(pending.reduce((sum, r) => sum + r.rejected_boxes, 0));
        } catch (error) {
          console.error('Error al verificar rechazos:', error);
        }
      }
    };
    checkPending();
  }, [formData.grower_id, getPendingRejections]);

  const filteredLots = formData.grower_id
    ? getLotsByGrower(formData.grower_id)
    : lots;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      const result = await submitHarvest({
        grower_id: formData.grower_id,
        lot_id: formData.lot_id,
        reception_date: formData.reception_date,
        good_boxes: formData.good_boxes,
        rejected_boxes: formData.rejected_boxes,
        weight_kg: formData.weight_kg,
        received_by: formData.received_by,
        quality_inspector: formData.quality_inspector || null,
        observations: formData.observations || null,
      });

      setHarvestReceptionId(result.id);
      setSuccess(true);

      if (onQualityAudit && result.id) {
        onQualityAudit(result.id);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      good_boxes: 0,
      rejected_boxes: 0,
      weight_kg: 0,
      observations: '',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert
                color="green"
                variant="light"
                icon={<IconCheck size={16} />}
                withCloseButton
                onClose={() => setSuccess(false)}
              >
                <Text fw={600}>¡Recepción registrada exitosamente!</Text>
                <Text size="sm" c="dimmed">
                  La recepción ha sido guardada. Puedes proceder con la auditoría de calidad.
                </Text>
                {harvestReceptionId && (
                  <Button
                    size="xs"
                    mt="sm"
                    variant="outline"
                    color="teal"
                    leftSection={<IconClipboardCheck size={14} />}
                    onClick={() => onQualityAudit?.(harvestReceptionId)}
                  >
                    Auditoría de Calidad
                  </Button>
                )}
              </Alert>
            </motion.div>
          )}

          {hasPendingRejections && (
            <Alert
              color="red"
              variant="light"
              icon={<IconAlertCircle size={16} />}
            >
              <Text fw={600}>⚠️ Rechazos Pendientes</Text>
              <Text size="sm">
                El productor tiene <strong>{pendingCount}</strong> cajas rechazadas pendientes de rearmar.
                Debe resolverlas antes de recibir nuevas cajas.
              </Text>
            </Alert>
          )}

          {/* Datos Generales */}
          <Card withBorder p="md" style={{ borderColor: '#E8E5DC' }}>
            <Group gap="sm" mb="md">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconUser size={18} />
              </ThemeIcon>
              <Text fw={700} size="sm" c="#3A3A34">Datos de la Recepción</Text>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Select
                label="Productor"
                placeholder="Selecciona el productor"
                data={growers.map(g => ({
                  value: g.id,
                  label: g.commercial_name || g.legal_name,
                }))}
                value={formData.grower_id}
                onChange={(value) => setFormData({ ...formData, grower_id: value || '', lot_id: '' })}
                required
                searchable
                styles={inputStyles}
                disabled={hasPendingRejections}
              />
              <Select
                label="Lote / Rancho"
                placeholder="Selecciona el lote"
                data={filteredLots.map(l => ({
                  value: l.id,
                  label: `${l.name} (${l.code})`,
                }))}
                value={formData.lot_id}
                onChange={(value) => setFormData({ ...formData, lot_id: value || '' })}
                required
                searchable
                styles={inputStyles}
                disabled={!formData.grower_id || hasPendingRejections}
              />
            </SimpleGrid>

            <TextInput
              label="Fecha de Recepción"
              type="date"
              value={formData.reception_date}
              onChange={(e) => setFormData({ ...formData, reception_date: e.currentTarget.value })}
              required
              mt="md"
              styles={inputStyles}
              disabled={hasPendingRejections}
            />
          </Card>

          {/* Cajas y Peso */}
          <Card withBorder p="md" style={{ borderColor: '#E8E5DC' }}>
            <Group gap="sm" mb="md">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconBox size={18} />
              </ThemeIcon>
              <Text fw={700} size="sm" c="#3A3A34">Cajas y Peso</Text>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <NumberInput
                label="Cajas Buenas"
                placeholder="0"
                min={0}
                value={formData.good_boxes}
                onChange={(value) => setFormData({ ...formData, good_boxes: Number(value) || 0 })}
                required
                styles={inputStyles}
                disabled={hasPendingRejections}
              />
              <NumberInput
                label="Cajas Rechazadas"
                placeholder="0"
                min={0}
                value={formData.rejected_boxes}
                onChange={(value) => setFormData({ ...formData, rejected_boxes: Number(value) || 0 })}
                styles={inputStyles}
                disabled={hasPendingRejections}
              />
              <NumberInput
                label="Peso Total (kg)"
                placeholder="0"
                min={0}
                value={formData.weight_kg}
                onChange={(value) => setFormData({ ...formData, weight_kg: Number(value) || 0 })}
                required
                styles={inputStyles}
                disabled={hasPendingRejections}
              />
            </SimpleGrid>
          </Card>

          {/* Personal */}
          <Card withBorder p="md" style={{ borderColor: '#E8E5DC' }}>
            <Group gap="sm" mb="md">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconUser size={18} />
              </ThemeIcon>
              <Text fw={700} size="sm" c="#3A3A34">Personal</Text>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Recibido por"
                placeholder="Nombre del encargado"
                value={formData.received_by}
                onChange={(e) => setFormData({ ...formData, received_by: e.currentTarget.value })}
                required
                styles={inputStyles}
                disabled={hasPendingRejections}
              />
              <TextInput
                label="Inspector de Calidad"
                placeholder="Nombre del inspector"
                value={formData.quality_inspector}
                onChange={(e) => setFormData({ ...formData, quality_inspector: e.currentTarget.value })}
                styles={inputStyles}
                disabled={hasPendingRejections}
              />
            </SimpleGrid>

            <Textarea
              label="Observaciones"
              placeholder="Notas sobre la recepción..."
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.currentTarget.value })}
              rows={3}
              mt="md"
              styles={inputStyles}
              disabled={hasPendingRejections}
            />
          </Card>

          <Divider />

          {/* Botones */}
          <Group justify="space-between">
            <Group gap="sm">
              <Badge variant="light" color="teal" radius="sm">
                <Group gap={4}>
                  <IconScale size={12} />
                  Total: {formData.good_boxes + formData.rejected_boxes} cajas
                </Group>
              </Badge>
              {formData.weight_kg > 0 && (
                <Badge variant="light" color="blue" radius="sm">
                  {formData.weight_kg} kg
                </Badge>
              )}
            </Group>
            <Group gap="sm">
              <Button
                variant="subtle"
                color="gray"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Limpiar Campos
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                style={{ backgroundColor: '#1F5C3A' }}
                leftSection={<IconTruck size={16} />}
                disabled={hasPendingRejections}
              >
                Emitir Remisión
              </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </motion.div>
  );
};