// Payroll/components/BoletaDestajo.tsx

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  Text,
  Group,
  Table,
  NumberInput,
  TextInput,
  Select,
  Button,
  SimpleGrid,
  ScrollArea,
  ThemeIcon,
  Divider,
  Alert,
  Loader,
  Center,
} from '@mantine/core';
import { IconReceipt, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import type { BoletaDestajo, TrabajadorDestajo } from '../../types';

interface BoletaDestajoProps {
  data: BoletaDestajo | null;
  onUpdate: (trabajadores: TrabajadorDestajo[]) => void;
  isSubmitting: boolean;
}

export function BoletaDestajo({ data, onUpdate, isSubmitting }: BoletaDestajoProps) {
  const [trabajadores, setTrabajadores] = useState<TrabajadorDestajo[]>([]);
  const [folio, setFolio] = useState('');
  const [fecha, setFecha] = useState('');
  const [producto, setProducto] = useState('');
  const [tarifa, setTarifa] = useState(0);

  // Inicializar datos cuando cambia la prop
  useEffect(() => {
    if (data && data.trabajadores) {
      setTrabajadores(data.trabajadores);
      setFolio(data.folio || 'RPK-0000');
      setFecha(data.fecha || new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }));
      setProducto(data.producto || 'Brócoli re-empacado');
      setTarifa(data.tarifa || 0.30);
    }
  }, [data]);

  const handleCajasChange = (id: number, value: number) => {
    setTrabajadores(prev =>
      prev.map(t =>
        t.id === id ? { ...t, cajas: value } : t
      )
    );
  };

  const totalCajas = trabajadores.reduce((sum, t) => sum + (t.cajas || 0), 0);
  const totalImporte = totalCajas * tarifa;

  const handleSave = () => {
    onUpdate(trabajadores);
  };

  // Estado de carga
  if (!data) {
    return (
      <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Center style={{ height: '100px' }}>
          <Loader color="blue" size="sm" type="dots" />
          <Text size="sm" c="dimmed" ml="sm">Cargando boleta de destajo...</Text>
        </Center>
      </Paper>
    );
  }

  // Estado vacío
  if (trabajadores.length === 0) {
    return (
      <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
        <Stack gap="md">
          <Group gap="xs">
            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
              <IconReceipt size={18} />
            </ThemeIcon>
            <Text size="16px" fw={700} c="#1A3A5C">
              Captura · Boleta de destajo de repack
            </Text>
          </Group>
          <Divider />
          <Alert
            color="blue"
            variant="light"
            title="No hay trabajadores registrados"
            icon={<IconAlertCircle size={16} />}
          >
            <Text size="sm">Agrega trabajadores a la boleta de destajo para comenzar.</Text>
          </Alert>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}>
            <IconReceipt size={18} />
          </ThemeIcon>
          <Text size="16px" fw={700} c="#1A3A5C">
            Captura · Boleta de destajo de repack
          </Text>
        </Group>

        <Divider />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xs">
          <TextInput
            label="Folio boleta"
            value={folio}
            readOnly
            size="xs"
            styles={{ input: { backgroundColor: '#F0F4FF', fontWeight: 600 } }}
          />
          <TextInput
            label="Fecha"
            value={fecha}
            readOnly
            size="xs"
            styles={{ input: { backgroundColor: '#F0F4FF', fontWeight: 600 } }}
          />
          <Select
            label="Producto"
            value={producto}
            onChange={(value) => setProducto(value || '')}
            data={['Brócoli re-empacado', 'Apio', 'Coliflor']}
            size="xs"
          />
          <TextInput
            label="Tarifa"
            value={`$${tarifa} USD/cj`}
            readOnly
            size="xs"
            styles={{ input: { backgroundColor: '#F0F4FF', fontWeight: 600 } }}
          />
        </SimpleGrid>

        <ScrollArea style={{ width: '100%' }}>
          <Table highlightOnHover withColumnBorders verticalSpacing="xs" style={{ minWidth: '400px' }}>
            <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', width: 40 }}>#</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C' }}>Trabajador</Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 120 }}>
                  Cajas
                </Table.Th>
                <Table.Th style={{ fontSize: '11px', fontWeight: 700, color: '#1A3A5C', textAlign: 'right', width: 120 }}>
                  Importe
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {trabajadores.map((item) => (
                <Table.Tr key={item.id} style={{ borderBottom: '1px solid #F0F4FF' }}>
                  <Table.Td style={{ fontSize: '12px', color: '#6B7280' }}>{item.id}</Table.Td>
                  <Table.Td style={{ fontSize: '12px', fontWeight: 600, color: '#1A4B8C' }}>
                    {item.nombre}
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      value={item.cajas || 0}
                      onChange={(val) => handleCajasChange(item.id, Number(val))}
                      size="xs"
                      variant="unstyled"
                      styles={{
                        input: {
                          backgroundColor: '#FEF9C3',
                          textAlign: 'center',
                          fontWeight: 700,
                          fontSize: '11px',
                          borderRadius: 4,
                          width: '100px',
                          marginLeft: 'auto',
                        },
                      }}
                    />
                  </Table.Td>
                  <Table.Td style={{ fontSize: '12px', textAlign: 'right', color: '#4B5563' }}>
                    ${((item.cajas || 0) * tarifa)}
                  </Table.Td>
                </Table.Tr>
              ))}

              <Table.Tr style={{ backgroundColor: '#F8FAFC', borderTop: '2px solid #E5E7EB' }}>
                <Table.Td colSpan={2} style={{ fontSize: '12px', fontWeight: 700, color: '#1A3A5C' }}>
                  TOTAL
                </Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700 }}>
                  {totalCajas}
                </Table.Td>
                <Table.Td style={{ fontSize: '12px', textAlign: 'right', fontWeight: 700, color: '#1A4B8C' }}>
                  ${totalImporte}
                </Table.Td>
              </Table.Tr>
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
            Emitir boleta de repack
          </Button>
        </Group>

        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Idéntica a la boleta de cosecha: una por día por producto · persona → cajas · cuadra contra la bitácora de PC-4
        </Text>
      </Stack>
    </Paper>
  );
}