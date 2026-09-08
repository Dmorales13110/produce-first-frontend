// src/modules/grower/capture/components/LaborForm.tsx
import React, { useState } from 'react';
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
  IconEdit,
  IconCheck,
  IconLeaf,
  IconCurrencyDollar,
  IconBuilding
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useCapture } from '../hooks/useCapture';
import { inputStyles } from '../styles/capture.styles';

interface LaborFormProps {
  onSuccess?: () => void;
}

export const LaborForm: React.FC<LaborFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'labor' as const,
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    lot_id: '',
    provider: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { lots, submitExpense } = useCapture();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      await submitExpense({
        type: formData.type,
        category: formData.category,
        amount: formData.amount,
        date: formData.date,
        description: formData.description,
        lot_id: formData.lot_id || null,
        provider: formData.provider || null,
        notes: formData.notes || null,
      });

      setSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      category: '',
      amount: 0,
      description: '',
      provider: '',
      notes: '',
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
                <Text fw={600}>¡Bitácora guardada exitosamente!</Text>
                <Text size="sm" c="dimmed">
                  La labor ha sido registrada y el costo se ha asignado correctamente.
                </Text>
              </Alert>
            </motion.div>
          )}

          <Card withBorder p="md" style={{ borderColor: '#E8E5DC' }}>
            <Group gap="sm" mb="md">
              <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                <IconLeaf size={18} />
              </ThemeIcon>
              <Text fw={700} size="sm" c="#3A3A34">Datos de la Labor</Text>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Select
                label="Tipo de Labor"
                placeholder="Selecciona la actividad"
                data={[
                  { value: 'labor', label: 'Labor de campo' },
                  { value: 'transport', label: 'Transporte' },
                  { value: 'packaging', label: 'Empaque' },
                  { value: 'maintenance', label: 'Mantenimiento' },
                  { value: 'supplies', label: 'Insumos' },
                  { value: 'other', label: 'Otro' },
                ]}
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value as any || 'labor' })}
                required
                styles={inputStyles}
              />
              <Select
                label="Lote / Rancho"
                placeholder="Selecciona el lote (opcional)"
                data={lots.map(l => ({
                  value: l.id,
                  label: `${l.name} (${l.code})`,
                }))}
                value={formData.lot_id}
                onChange={(value) => setFormData({ ...formData, lot_id: value || '' })}
                searchable
                clearable
                styles={inputStyles}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
              <TextInput
                label="Categoría"
                placeholder="Ej: Fertilizantes, Riego, etc."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.currentTarget.value })}
                required
                styles={inputStyles}
              />
              <NumberInput
                label="Monto"
                placeholder="0.00"
                min={0}
                value={formData.amount}
                onChange={(value) => setFormData({ ...formData, amount: Number(value) || 0 })}
                required
                leftSection={<IconCurrencyDollar size={14} />}
                styles={inputStyles}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
              <TextInput
                label="Proveedor"
                placeholder="Nombre del proveedor"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.currentTarget.value })}
                styles={inputStyles}
              />
              <TextInput
                label="Fecha"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.currentTarget.value })}
                required
                styles={inputStyles}
              />
            </SimpleGrid>

            <TextInput
              label="Descripción"
              placeholder="Breve descripción de la labor"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
              required
              mt="md"
              styles={inputStyles}
            />

            <Textarea
              label="Notas"
              placeholder="Detalles adicionales..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.currentTarget.value })}
              rows={3}
              mt="md"
              styles={inputStyles}
            />
          </Card>

          <Divider />

          <Group justify="space-between">
            <Group gap="sm">
              <Badge variant="light" color="blue" radius="sm">
                <Group gap={4}>
                  <IconCurrencyDollar size={12} />
                  ${formData.amount.toFixed(2)}
                </Group>
              </Badge>
              <Badge variant="light" color="gray" radius="sm">
                {formData.type}
              </Badge>
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
                leftSection={<IconEdit size={16} />}
              >
                Guardar Bitácora
              </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </motion.div>
  );
};