// src/modules/grower/capture/components/QualityAudit.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Stack,
  Text,
  Group,
  Badge,
  Button,
  Progress,
  Divider,
  Table,
  Alert,
  Select,
  Textarea,
  Card,
  ThemeIcon,
  Loader,
  Center,
  ActionIcon
} from '@mantine/core';
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconClipboardCheck,
  IconBox,
  IconArrowLeft,
  IconArrowRight,
  IconRefresh
} from '@tabler/icons-react';
import { useCapture } from '../hooks/useCapture';

interface QualityAuditProps {
  opened: boolean;
  harvestReceptionId: string;
  totalBoxes: number;
  growerId: string;
  onClose: () => void;
  onComplete: () => void;
}

export const QualityAudit: React.FC<QualityAuditProps> = ({
  opened,
  harvestReceptionId,
  totalBoxes,
  growerId,
  onClose,
  onComplete
}) => {
  const [currentBox, setCurrentBox] = useState(1);
  const [inspections, setInspections] = useState<any[]>([]);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingRejections, setPendingRejections] = useState<any[]>([]);
  const [isCheckingPending, setIsCheckingPending] = useState(true);

  const { getPendingRejections, inspectQuality, resolveRejection } = useCapture();

  useEffect(() => {
    if (opened && growerId) {
      const checkPending = async () => {
        setIsCheckingPending(true);
        try {
          const pending = await getPendingRejections(growerId);
          setPendingRejections(pending);
        } catch (error) {
          console.error('Error al verificar rechazos:', error);
        } finally {
          setIsCheckingPending(false);
        }
      };
      checkPending();
    }
  }, [opened, growerId, getPendingRejections]);

  const handleInspect = () => {
    if (isApproved === null) return;

    const inspection = {
      box_number: currentBox,
      is_approved: isApproved,
      rejection_reason: isApproved ? null : rejectionReason,
      rejection_notes: isApproved ? null : rejectionNotes || undefined,
    };

    setInspections([...inspections, inspection]);

    if (currentBox < totalBoxes) {
      setCurrentBox(currentBox + 1);
      setIsApproved(null);
      setRejectionReason(null);
      setRejectionNotes('');
    } else {
      handleSubmitInspection();
    }
  };

  const handleSubmitInspection = async () => {
    setIsSubmitting(true);
    try {
      await inspectQuality({
        harvest_reception_id: harvestReceptionId,
        inspector_id: 'current_user_id',
        inspected_boxes: inspections,
        notes,
      });

      onComplete();
    } catch (error) {
      console.error('Error al guardar inspección:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentBox > 1) {
      setCurrentBox(currentBox - 1);
      const previous = inspections[currentBox - 2];
      if (previous) {
        setIsApproved(previous.is_approved);
        setRejectionReason(previous.rejection_reason || null);
        setRejectionNotes(previous.rejection_notes || '');
      }
    }
  };

  const approvedCount = inspections.filter(i => i.is_approved).length;
  const rejectedCount = inspections.filter(i => !i.is_approved).length;
  const progress = totalBoxes > 0 ? (inspections.length / totalBoxes) * 100 : 0;

  if (isCheckingPending) {
    return (
      <Modal opened={opened} onClose={onClose} title="Auditoría de Calidad" size="xl" centered>
        <Center style={{ height: 200 }}>
          <Loader color="growerGreen" size="xl" type="dots" />
        </Center>
      </Modal>
    );
  }

  if (pendingRejections.length > 0) {
    const totalPending = pendingRejections.reduce((sum, r) => sum + r.rejected_boxes, 0);
    return (
      <Modal opened={opened} onClose={onClose} title="Auditoría de Calidad" size="xl" centered>
        <Alert color="red" variant="light" icon={<IconAlertCircle size={20} />}>
          <Stack gap="md">
            <Text fw={700} size="lg">Rechazos Pendientes</Text>
            <Text>
              El cosechador tiene <strong>{totalPending}</strong> cajas rechazadas pendientes de rearmar.
            </Text>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Recepción</Table.Th>
                  <Table.Th>Cajas Rechazadas</Table.Th>
                  <Table.Th>Fecha</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {pendingRejections.map((r) => (
                  <Table.Tr key={r.id}>
                    <Table.Td>{r.harvest_receptions?.code || 'N/A'}</Table.Td>
                    <Table.Td>{r.rejected_boxes}</Table.Td>
                    <Table.Td>{new Date(r.created_at).toLocaleDateString()}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={onClose}>
                Cerrar
              </Button>
              <Button
                style={{ backgroundColor: '#1F5C3A' }}
                onClick={async () => {
                  try {
                    for (const rejection of pendingRejections) {
                      await resolveRejection(rejection.id);
                    }
                    const pending = await getPendingRejections(growerId);
                    setPendingRejections(pending);
                  } catch (error) {
                    console.error('Error al resolver rechazos:', error);
                  }
                }}
              >
                Marcar como rearmadas
              </Button>
            </Group>
          </Stack>
        </Alert>
      </Modal>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon size="md" radius="xl" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
            <IconClipboardCheck size={18} />
          </ThemeIcon>
          <Text fw={700}>Auditoría de Calidad</Text>
        </Group>
      }
      size="xl"
      centered
    >
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="sm" fw={600}>
            Inspeccionando caja {currentBox} de {totalBoxes}
          </Text>
          <Badge color="teal" variant="light">
            {Math.round(progress)}% completado
          </Badge>
        </Group>
        <Progress value={progress} color="teal" size="md" radius="xl" />

        <Group gap="md">
          <Badge color="green" variant="light" size="lg">
            <Group gap={4}>
              <IconCheck size={14} />
              {approvedCount} aprobadas
            </Group>
          </Badge>
          <Badge color="red" variant="light" size="lg">
            <Group gap={4}>
              <IconX size={14} />
              {rejectedCount} rechazadas
            </Group>
          </Badge>
        </Group>

        <Divider />

        {currentBox <= totalBoxes ? (
          <Card withBorder p="md">
            <Group gap="sm" mb="md">
              <ThemeIcon size="md" radius="xl" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                <IconBox size={18} />
              </ThemeIcon>
              <Text fw={700} size="lg" c="#1F5C3A">
                Caja #{currentBox}
              </Text>
            </Group>

            <Stack gap="md">
              <Group gap="md">
                <Button
                  variant={isApproved === true ? 'filled' : 'outline'}
                  color="green"
                  onClick={() => setIsApproved(true)}
                  leftSection={<IconCheck size={16} />}
                  style={{ flex: 1 }}
                >
                  Aprobar
                </Button>
                <Button
                  variant={isApproved === false ? 'filled' : 'outline'}
                  color="red"
                  onClick={() => setIsApproved(false)}
                  leftSection={<IconX size={16} />}
                  style={{ flex: 1 }}
                >
                  Rechazar
                </Button>
              </Group>

              {isApproved === false && (
                <Stack gap="sm">
                  <Select
                    label="Motivo de rechazo"
                    placeholder="Selecciona el motivo"
                    data={[
                      { value: 'plaga', label: 'Plaga' },
                      { value: 'floracion', label: 'Floración' },
                      { value: 'tamaño', label: 'Tamaño incorrecto' },
                      { value: 'clima', label: 'Daño por clima' },
                      { value: 'daño_mecanico', label: 'Daño mecánico' },
                      { value: 'calidad_interna', label: 'Calidad interna' },
                      { value: 'otro', label: 'Otro' },
                    ]}
                    value={rejectionReason}
                    onChange={setRejectionReason}
                    required
                  />
                  <Textarea
                    label="Notas del rechazo"
                    placeholder="Describe el problema..."
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.currentTarget.value)}
                    rows={2}
                  />
                </Stack>
              )}

              <Group>
                <Button
                  variant="subtle"
                  color="gray"
                  onClick={handlePrevious}
                  disabled={currentBox === 1}
                  leftSection={<IconArrowLeft size={14} />}
                >
                  Anterior
                </Button>
                <Button
                  style={{ backgroundColor: '#1F5C3A', flex: 1 }}
                  onClick={handleInspect}
                  disabled={isApproved === null || (isApproved === false && !rejectionReason)}
                  loading={isSubmitting}
                  rightSection={<IconArrowRight size={14} />}
                >
                  {currentBox === totalBoxes ? 'Finalizar Auditoría' : 'Siguiente Caja'}
                </Button>
              </Group>
            </Stack>
          </Card>
        ) : (
          <Alert color="green" variant="light" icon={<IconClipboardCheck size={20} />}>
            <Text fw={700}>¡Auditoría completada!</Text>
            <Text size="sm">
              {approvedCount} cajas aprobadas, {rejectedCount} cajas rechazadas
            </Text>
            {rejectedCount > 0 && (
              <Alert color="red" variant="light" mt="sm" icon={<IconAlertCircle size={16} />}>
                <Text size="sm">
                  El cosechador debe rearmar {rejectedCount} cajas antes de poder recibir nuevas.
                </Text>
              </Alert>
            )}
            <Button
              fullWidth
              mt="md"
              style={{ backgroundColor: '#1F5C3A' }}
              onClick={handleSubmitInspection}
              loading={isSubmitting}
            >
              Guardar Auditoría
            </Button>
          </Alert>
        )}

        {inspections.length > 0 && (
          <>
            <Divider />
            <Text size="sm" fw={600}>Historial de inspecciones</Text>
            <Table verticalSpacing="xs" style={{ fontSize: '12px' }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Caja</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Motivo</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {inspections.map((box, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td fw={600}>#{box.box_number}</Table.Td>
                    <Table.Td>
                      <Badge
                        size="sm"
                        color={box.is_approved ? 'green' : 'red'}
                        variant="light"
                      >
                        {box.is_approved ? 'Aprobada' : 'Rechazada'}
                      </Badge>
                    </Table.Td>
                    <Table.Td c="dimmed">
                      {box.is_approved ? '—' : (box.rejection_reason || 'Sin motivo')}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </>
        )}
      </Stack>
    </Modal>
  );
};