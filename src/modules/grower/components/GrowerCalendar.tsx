// src/modules/grower/GrowerCalendar.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  Text,
  Group,
  ThemeIcon,
  Stack,
  Badge,
  SimpleGrid,
  UnstyledButton,
  Divider,
  Paper,
  Loader,
  Center,
  Button,
  Modal,
  TextInput,
  Select,
  Textarea,
  ActionIcon,
  Tooltip,
  Alert
} from '@mantine/core';
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconMapPin,
  IconCalendarEvent,
  IconList,
  IconDots,
  IconPlus,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconAlertCircle
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useCalendar } from '../hooks/useCalendar';
import type { CalendarEvent } from '../../../services/calendar';

const calendarColors = {
  harvest: { bg: 'rgba(31, 92, 58, 0.12)', text: '#1F5C3A', border: '#1F5C3A', label: 'Cosecha' },
  transplant: { bg: 'rgba(42, 106, 138, 0.12)', text: '#2A6A8A', border: '#2A6A8A', label: 'Trasplante' },
  maintenance: { bg: 'rgba(138, 90, 42, 0.12)', text: '#8A5A2A', border: '#8A5A2A', label: 'Mantenimiento' },
};

export function GrowerCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'harvest' as 'harvest' | 'transplant' | 'maintenance',
    sector: '',
    time: '07:00 AM',
    day: 1,
    month: 0,
    year: 2024,
  });

  const { events, isLoading, error, refresh, addEvent, updateEvent, deleteEvent, getEventsForMonth } = useCalendar();

  // Cargar eventos del mes actual
  useEffect(() => {
    const loadEvents = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      await getEventsForMonth(year, month);
    };
    loadEvents();
  }, [currentDate, getEventsForMonth]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('es-MX', { month: 'long', year: 'numeric' });

  // Obtener eventos del mes
  const monthEvents = events.filter(e => e.year === year && e.month === month);

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Días vacíos antes del primer día
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };

  const days = getDaysInMonth(year, month);
  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      type: 'harvest',
      sector: '',
      time: '07:00 AM',
      day: selectedDay || 1,
      month: month,
      year: year,
    });
    setModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      type: event.type,
      sector: event.sector,
      time: event.time,
      day: event.day,
      month: event.month,
      year: event.year,
    });
    setModalOpen(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este evento?')) {
      await deleteEvent(id);
    }
  };

  const handleSubmit = async () => {
    try {
      const eventData = {
        title: formData.title,
        description: formData.description || null,
        day: formData.day,
        month: formData.month,
        year: formData.year,
        type: formData.type,
        sector: formData.sector,
        time: formData.time,
      };

      if (editingEvent) {
        await updateEvent({ id: editingEvent.id, ...eventData });
      } else {
        await addEvent(eventData);
      }
      setModalOpen(false);
      refresh();
    } catch (err) {
      console.error('Error al guardar evento:', err);
    }
  };

  if (isLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader color="growerGreen" size="xl" type="dots" />
      </Center>
    );
  }

  return (
    <Box>
      {/* Encabezado */}
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={0}>
          <Text size="xs" fw={700} c="#1F5C3A" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
            G-6 · Calendario
          </Text>
          <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
            Cronograma Agrícola
          </Text>
        </Stack>
        <Group gap="sm">
          <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
            {events.length} Eventos
          </Badge>
          <ActionIcon variant="light" color="teal" size="lg" radius="md" onClick={refresh}>
            <IconRefresh size={20} />
          </ActionIcon>
          <Button 
            size="sm" 
            style={{ backgroundColor: '#1F5C3A' }}
            leftSection={<IconPlus size={16} />}
            onClick={handleAddEvent}
          >
            Nuevo Evento
          </Button>
        </Group>
      </Group>

      {error && (
        <Alert 
          color="red" 
          variant="light" 
          icon={<IconAlertCircle size={16} />}
          mb="md"
          withCloseButton
        >
          {error}
        </Alert>
      )}

      <Grid>
        {/* Calendario */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
              {/* Cabecera */}
              <Group justify="space-between" mb="lg">
                <Group gap="sm">
                  <IconCalendarEvent size={18} color="#1F5C3A" />
                  <Stack gap={0}>
                    <Text size="sm" fw={700} c="#3A3A34">Calendario Mensual</Text>
                    <Text size="xs" c="dimmed">Planificación de operaciones</Text>
                  </Stack>
                </Group>
                
                <Group gap="xs">
                  <UnstyledButton
                    onClick={handlePrevMonth}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#F5F3EE',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <IconChevronLeft size={18} color="#3A3A34" />
                  </UnstyledButton>
                  <Text fw={700} size="sm" c="#3A3A34" style={{ minWidth: '120px', textAlign: 'center' }}>
                    {monthName}
                  </Text>
                  <UnstyledButton
                    onClick={handleNextMonth}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#F5F3EE',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <IconChevronRight size={18} color="#3A3A34" />
                  </UnstyledButton>
                </Group>
              </Group>

              <Divider mb="lg" />

              {/* Días de la Semana */}
              <SimpleGrid cols={7} mb="md" spacing={0}>
                {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map((d) => (
                  <Text key={d} size="xs" fw={700} c="#9A968A" ta="center" style={{ letterSpacing: '0.5px', padding: '4px 0' }}>
                    {d}
                  </Text>
                ))}
              </SimpleGrid>

              {/* Cuadrícula */}
              <Box style={{ border: '1px solid #E8E5DC', borderRadius: '8px', overflow: 'hidden' }}>
                <SimpleGrid cols={7} spacing={0}>
                  {days.map((day, idx) => {
                    const dayEvents = day ? monthEvents.filter(e => e.day === day) : [];
                    const isCurrentDay = day ? isToday(day) : false;
                    const isSelected = day === selectedDay;
                    
                    return (
                      <Box
                        key={idx}
                        onClick={() => day && setSelectedDay(day)}
                        style={{
                          height: '100px',
                          borderRight: idx % 7 !== 6 ? '1px solid #E8E5DC' : 'none',
                          borderBottom: idx < days.length - 7 ? '1px solid #E8E5DC' : 'none',
                          padding: '6px 8px',
                          backgroundColor: !day ? '#FAF9F5' : 
                            isCurrentDay ? 'rgba(31, 92, 58, 0.08)' : 
                            isSelected ? 'rgba(31, 92, 58, 0.04)' : '#FFFFFF',
                          transition: 'background-color 0.2s ease',
                          position: 'relative',
                          cursor: day ? 'pointer' : 'default'
                        }}
                      >
                        {day && (
                          <Group justify="space-between" align="flex-start" mb={4}>
                            <Text 
                              size="xs" 
                              fw={700} 
                              c={dayEvents.length > 0 ? '#1F5C3A' : '#9A968A'}
                              style={{
                                backgroundColor: isCurrentDay ? '#1F5C3A' : 'transparent',
                                color: isCurrentDay ? '#FFFFFF' : undefined,
                                padding: isCurrentDay ? '2px 6px' : '0',
                                borderRadius: '50%',
                                width: isCurrentDay ? '24px' : 'auto',
                                height: isCurrentDay ? '24px' : 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {day}
                            </Text>
                            {dayEvents.length > 0 && (
                              <Badge size="xs" variant="dot" color="teal" radius="sm">
                                {dayEvents.length}
                              </Badge>
                            )}
                          </Group>
                        )}

                        {/* Eventos */}
                        <Stack gap={2}>
                          {dayEvents.slice(0, 2).map(e => {
                            const config = calendarColors[e.type];
                            return (
                              <Box
                                key={e.id}
                                onClick={(e) => { e.stopPropagation(); handleEditEvent(e); }}
                                style={{
                                  backgroundColor: config.bg,
                                  borderLeft: `3px solid ${config.border}`,
                                  padding: '2px 4px',
                                  borderRadius: '3px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  cursor: 'pointer'
                                }}
                              >
                                <Text size="9px" fw={600} c={config.text} style={{ lineHeight: 1.3 }}>
                                  {e.title.split('—')[0].trim()}
                                </Text>
                              </Box>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <Text size="8px" c="dimmed" ta="center" fw={600}>
                              +{dayEvents.length - 2} más
                            </Text>
                          )}
                        </Stack>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </Box>
            </Card>
          </motion.div>
        </Grid.Col>

        {/* Agenda */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC' }}>
              <Group gap="sm" mb="lg">
                <IconList size={18} color="#1F5C3A" />
                <Stack gap={0}>
                  <Text size="sm" fw={700} c="#3A3A34">Agenda Próxima</Text>
                  <Text size="xs" c="dimmed">Eventos del mes</Text>
                </Stack>
              </Group>

              <Divider mb="lg" />

              <Stack gap="md">
                {monthEvents.length > 0 ? (
                  monthEvents.map((e, index) => {
                    const config = calendarColors[e.type];
                    return (
                      <motion.div
                        key={e.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Box
                          style={{
                            border: '1px solid #E8E5DC',
                            borderRadius: '8px',
                            padding: '14px',
                            backgroundColor: '#FFFFFF',
                            borderLeft: `4px solid ${config.border}`,
                            transition: 'box-shadow 0.2s ease'
                          }}
                        >
                          <Group justify="space-between" mb={4}>
                            <Badge 
                              size="xs" 
                              style={{ 
                                backgroundColor: config.bg, 
                                color: config.text,
                                fontWeight: 700
                              }}
                            >
                              {config.label}
                            </Badge>
                            <Text size="10px" c="dimmed">Día {e.day}</Text>
                          </Group>
                          
                          <Text size="sm" fw={600} c="#3A3A34" mb={6} style={{ lineHeight: 1.3 }}>
                            {e.title}
                          </Text>
                          
                          <Group gap="md">
                            <Group gap={4} align="center">
                              <IconClock size={12} color="#9A968A" />
                              <Text size="xs" c="dimmed" fw={500}>{e.time}</Text>
                            </Group>
                            <Group gap={4} align="center">
                              <IconMapPin size={12} color="#9A968A" />
                              <Text size="xs" c="dimmed" fw={500}>{e.sector}</Text>
                            </Group>
                          </Group>

                          <Group gap="xs" mt="sm" justify="flex-end">
                            <ActionIcon 
                              size="sm" 
                              variant="subtle" 
                              color="blue"
                              onClick={() => handleEditEvent(e)}
                            >
                              <IconEdit size={14} />
                            </ActionIcon>
                            <ActionIcon 
                              size="sm" 
                              variant="subtle" 
                              color="red"
                              onClick={() => handleDeleteEvent(e.id)}
                            >
                              <IconTrash size={14} />
                            </ActionIcon>
                          </Group>
                        </Box>
                      </motion.div>
                    );
                  })
                ) : (
                  <Box ta="center" py="xl">
                    <IconCalendarEvent size={40} color="#9A968A" opacity={0.4} />
                    <Text size="sm" c="dimmed" mt="md">No hay eventos programados</Text>
                    <Text size="xs" c="dimmed">Haz clic en "Nuevo Evento" para agregar uno</Text>
                  </Box>
                )}
              </Stack>

              <Divider my="lg" />

              {/* Leyenda */}
              <Box>
                <Text size="xs" fw={600} c="dimmed" mb="xs" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Leyenda
                </Text>
                <Group gap="lg">
                  {Object.entries(calendarColors).map(([key, value]) => (
                    <Group key={key} gap={4}>
                      <Box style={{ width: 12, height: 12, backgroundColor: value.bg, borderLeft: `3px solid ${value.border}`, borderRadius: '2px' }} />
                      <Text size="10px" c="dimmed">{value.label}</Text>
                    </Group>
                  ))}
                </Group>
              </Box>
            </Card>
          </motion.div>
        </Grid.Col>
      </Grid>

      {/* Modal de Evento */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
        size="lg"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Título"
            placeholder="Ej: Corte Programado"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.currentTarget.value })}
            required
          />
          
          <Textarea
            label="Descripción"
            placeholder="Detalles del evento..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
            rows={3}
          />

          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Tipo"
                data={[
                  { value: 'harvest', label: 'Cosecha' },
                  { value: 'transplant', label: 'Trasplante' },
                  { value: 'maintenance', label: 'Mantenimiento' },
                ]}
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value as 'harvest' | 'transplant' | 'maintenance' })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Hora"
                placeholder="07:00 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.currentTarget.value })}
              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Sector"
            placeholder="Ej: Sector CO6-A"
            value={formData.sector}
            onChange={(e) => setFormData({ ...formData, sector: e.currentTarget.value })}
            required
          />

          <Grid>
            <Grid.Col span={4}>
              <TextInput
                label="Día"
                type="number"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: parseInt(e.currentTarget.value) || 1 })}
                min={1}
                max={31}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Mes"
                type="number"
                value={formData.month + 1}
                onChange={(e) => setFormData({ ...formData, month: (parseInt(e.currentTarget.value) || 1) - 1 })}
                min={1}
                max={12}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Año"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.currentTarget.value) || 2024 })}
                min={2000}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              style={{ backgroundColor: '#1F5C3A' }}
              onClick={handleSubmit}
              disabled={!formData.title || !formData.sector}
            >
              {editingEvent ? 'Actualizar' : 'Crear'} Evento
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}