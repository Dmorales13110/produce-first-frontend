// Payroll/components/AsistenciaForm.tsx

import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  Checkbox,
  TextInput,
  Button,
  ScrollArea,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { IconCheck, IconClock } from '@tabler/icons-react';
import type { Empleado, AsistenciaDia } from '../../types';

interface AsistenciaFormProps {
  empleados: Empleado[];
  asistencia: AsistenciaDia[];
  onSave: (data: AsistenciaDia[]) => void;
  isSubmitting: boolean;
}

export function AsistenciaForm({ empleados, asistencia, onSave, isSubmitting }: AsistenciaFormProps) {
  const [asistenciaData, setAsistenciaData] = useState<AsistenciaDia[]>(asistencia);

  const handleTogglePresente = (empleadoId: number) => {
    setAsistenciaData(prev =>
      prev.map(a =>
        a.empleadoId === empleadoId
          ? { ...a, presente: !a.presente }
          : a
      )
    );
  };

  const handleHorasExtraChange = (empleadoId: number, value: number) => {
    setAsistenciaData(prev =>
      prev.map(a =>
        a.empleadoId === empleadoId
          ? { ...a, horasExtra: value }
          : a
      )
    );
  };

  const getEmpleadoNombre = (id: number) => {
    const emp = empleados.find(e => e.id === id);
    return emp?.nombre || 'Desconocido';
  };

  const getEmpleadoTurno = (id: number) => {
    const emp = empleados.find(e => e.id === id);
    return emp?.turno || '—';
  };

  const handleSave = () => {
    onSave(asistenciaData);
  };

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconClock size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            Captura · Asistencia del día
          </Text>
        </Group>

        <Divider />

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '500px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Empleado</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Turno</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'center', width: 90 }}>
                  Presente
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 100 }}>
                  Horas extra
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {asistenciaData.length > 0 ? (
                asistenciaData.map((row) => (
                  <Table.Tr key={row.empleadoId} style={{ borderBottom: '1px solid #F0F4FF' }}>
                    <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>
                      {getEmpleadoNombre(row.empleadoId)}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '12px' }}>{getEmpleadoTurno(row.empleadoId)}</Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Checkbox
                        checked={row.presente}
                        onChange={() => handleTogglePresente(row.empleadoId)}
                        size="xs"
                      />
                    </Table.Td>
                    <Table.Td>
                      <TextInput
                        value={row.horasExtra}
                        onChange={(e) => handleHorasExtraChange(row.empleadoId, Number(e.currentTarget.value))}
                        size="xs"
                        variant="unstyled"
                        styles={{
                          input: {
                            backgroundColor: '#FEF9C3',
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: '11px',
                            borderRadius: 4,
                            width: '60px',
                            marginLeft: 'auto',
                          },
                        }}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={4} ta="center" py="xl">
                    <Text size="sm" c="dimmed">No hay asistencia registrada</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Group>
          <Button
            leftSection={<IconCheck size={16} />}
            style={{ backgroundColor: '#1A4B8C' }}
            size="xs"
            onClick={handleSave}
            loading={isSubmitting}
          >
            Guardar asistencia
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          2 minutos al abrir el turno (1 PM) · alimenta la nómina sola
        </Text>
      </Stack>
    </Paper>
  );
}