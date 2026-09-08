import React, { useState } from 'react';
import {
    Box,
    Paper,
    Text,
    Group,
    Stack,
    Badge,
    Table,
    SimpleGrid,
    Card,
    Button,
    TextInput,
    Select,
    Grid,
    ThemeIcon,
    Divider,
    Progress,
    RingProgress,
    Tooltip,
    ActionIcon,
    SegmentedControl,
    Avatar,
    Alert,
    Loader,
    Center,
    ScrollArea,
    Menu,
    Modal,
    NumberInput,
    Textarea,
    Tabs,
    Drawer,
} from '@mantine/core';
import {
    IconTractor,
    IconGasStation,
    IconCheck,
    IconTools,
    IconClock,
    IconCalendar,
    IconBuilding,
    IconUsers,
    IconTrendingUp,
    IconTrendingDown,
    IconArrowUpRight,
    IconArrowDownRight,
    IconRefresh,
    IconDownload,
    IconEye,
    IconEdit,
    IconSearch,
    IconFilter,
    IconGauge,
    IconDashboard,
    IconReport,
    IconDotsVertical,
    IconFileExport,
    IconPrinter,
    IconPlus,
    IconX,
    IconAlertCircle,
    IconTrash,
    IconInfoCircle,
    IconHistory,
    IconSettings,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useMachinery } from './hooks/useMachinery';
import { notifications } from '@mantine/notifications';

export function GrowerMachinery() {
    const {
        equipment,
        events,
        services,
        summary,
        isLoading,
        error,
        filters,
        setFilters,
        refresh,
        createEquipment,
        updateEquipment,
        deleteEquipment,
        getEquipmentById,
        createEvent,
        updateEvent,
        deleteEvent,
        createService,
        updateService,
        deleteService,
        today,
    } = useMachinery();

    const [viewMode, setViewMode] = useState('eventos');
    const [filterTipo, setFilterTipo] = useState('Todos');
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [detailTab, setDetailTab] = useState('info');

    // Estado para formulario de equipo
    const [equipmentForm, setEquipmentForm] = useState({
        code: '',
        name: '',
        type: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        hour_meter: 0,
        last_service: '',
        next_service: '',
        fuel_consumption_weekly: 0,
        maintenance_cost: 0,
        cost_per_hour: 0,
        status: 'operando',
        notes: '',
    });

    // Estado para formulario de evento
    const [eventForm, setEventForm] = useState({
        equipment_id: '',
        event_type: 'labor',
        event_date: new Date().toISOString().split('T')[0],
        event_time: new Date().toTimeString().slice(0, 5),
        sector: '',
        labor_type: '',
        quantity: 0,
        cost: 0,
        operator: '',
        notes: '',
    });

    // Estado para formulario de servicio
    const [serviceForm, setServiceForm] = useState({
        equipment_id: '',
        service_date: new Date().toISOString().split('T')[0],
        service_type: '',
        description: '',
        cost: 0,
        provider: '',
        invoice_number: '',
        hour_meter_at_service: 0,
        next_service_hours: 0,
        notes: '',
    });

    // ============================================================
    // HANDLERS
    // ============================================================

    const handleRefresh = async () => {
        await refresh();
        notifications.show({
            title: 'Datos actualizados',
            message: 'La maquinaria ha sido actualizada',
            color: 'green',
            icon: <IconCheck size={16} />,
            autoClose: 2000,
        });
    };

    const handleExport = () => {
        notifications.show({
            title: 'Exportando reporte',
            message: 'El reporte se está generando...',
            color: 'blue',
            icon: <IconDownload size={16} />,
            autoClose: 2000,
        });
    };

    // ============================================================
    // EQUIPMENT HANDLERS
    // ============================================================

    const handleOpenEquipmentModal = (equip?: any) => {
        if (equip) {
            setSelectedEquipment(equip);
            setEquipmentForm({
                code: equip.code || '',
                name: equip.name || '',
                type: equip.type || '',
                brand: equip.brand || '',
                model: equip.model || '',
                year: equip.year || new Date().getFullYear(),
                hour_meter: equip.hour_meter || 0,
                last_service: equip.last_service || '',
                next_service: equip.next_service || '',
                fuel_consumption_weekly: equip.fuel_consumption_weekly || 0,
                maintenance_cost: equip.maintenance_cost || 0,
                cost_per_hour: equip.cost_per_hour || 0,
                status: equip.status || 'operando',
                notes: equip.notes || '',
            });
        } else {
            setSelectedEquipment(null);
            setEquipmentForm({
                code: `MAQ-${String(equipment.length + 1).padStart(3, '0')}`,
                name: '',
                type: '',
                brand: '',
                model: '',
                year: new Date().getFullYear(),
                hour_meter: 0,
                last_service: '',
                next_service: '',
                fuel_consumption_weekly: 0,
                maintenance_cost: 0,
                cost_per_hour: 0,
                status: 'operando',
                notes: '',
            });
        }
        setEquipmentModalOpen(true);
    };

    const handleCreateEquipment = async () => {
        setIsSubmitting(true);
        try {
            if (selectedEquipment) {
                await updateEquipment(selectedEquipment.id, equipmentForm);
                notifications.show({
                    title: '✅ Equipo actualizado',
                    message: `${equipmentForm.name} actualizado exitosamente`,
                    color: 'green',
                    icon: <IconCheck size={16} />,
                    autoClose: 3000,
                });
            } else {
                await createEquipment(equipmentForm);
                notifications.show({
                    title: '✅ Equipo creado',
                    message: `${equipmentForm.name} creado exitosamente`,
                    color: 'green',
                    icon: <IconCheck size={16} />,
                    autoClose: 3000,
                });
            }
            setEquipmentModalOpen(false);
        } catch (err: any) {
            notifications.show({
                title: '❌ Error',
                message: err.message || 'Error al procesar equipo',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEquipment = async () => {
        if (!selectedEquipment) return;
        setIsSubmitting(true);
        try {
            await deleteEquipment(selectedEquipment.id);
            notifications.show({
                title: '✅ Equipo eliminado',
                message: `${selectedEquipment.name} eliminado exitosamente`,
                color: 'green',
                icon: <IconCheck size={16} />,
                autoClose: 3000,
            });
            setDeleteModalOpen(false);
            setSelectedEquipment(null);
        } catch (err: any) {
            notifications.show({
                title: '❌ Error',
                message: err.message || 'Error al eliminar equipo',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewEquipmentDetail = async (equip: any) => {
        setSelectedEquipment(equip);
        setDetailTab('info');
        setDetailDrawerOpen(true);
    };

    // ============================================================
    // EVENT HANDLERS
    // ============================================================

    const handleOpenEventModal = () => {
        setEventForm({
            equipment_id: equipment.length > 0 ? equipment[0].id : '',
            event_type: 'labor',
            event_date: new Date().toISOString().split('T')[0],
            event_time: new Date().toTimeString().slice(0, 5),
            sector: '',
            labor_type: '',
            quantity: 0,
            cost: 0,
            operator: '',
            notes: '',
        });
        setEventModalOpen(true);
    };

    const handleCreateEvent = async () => {
        setIsSubmitting(true);
        try {
            await createEvent(eventForm);
            notifications.show({
                title: '✅ Evento registrado',
                message: 'El evento ha sido registrado exitosamente',
                color: 'green',
                icon: <IconCheck size={16} />,
                autoClose: 3000,
            });
            setEventModalOpen(false);
        } catch (err: any) {
            notifications.show({
                title: '❌ Error',
                message: err.message || 'Error al registrar evento',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ============================================================
    // SERVICE HANDLERS
    // ============================================================

    const handleOpenServiceModal = (equip?: any) => {
        setServiceForm({
            equipment_id: equip?.id || (equipment.length > 0 ? equipment[0].id : ''),
            service_date: new Date().toISOString().split('T')[0],
            service_type: '',
            description: '',
            cost: 0,
            provider: '',
            invoice_number: '',
            hour_meter_at_service: equip?.hour_meter || 0,
            next_service_hours: 0,
            notes: '',
        });
        setServiceModalOpen(true);
    };

    const handleCreateService = async () => {
        setIsSubmitting(true);
        try {
            await createService(serviceForm);
            notifications.show({
                title: '✅ Servicio registrado',
                message: 'El servicio ha sido registrado exitosamente',
                color: 'green',
                icon: <IconCheck size={16} />,
                autoClose: 3000,
            });
            setServiceModalOpen(false);
        } catch (err: any) {
            notifications.show({
                title: '❌ Error',
                message: err.message || 'Error al registrar servicio',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ============================================================
    // CÁLCULOS
    // ============================================================

    const eventosHoy = events.filter(e => e.event_date === new Date().toISOString().split('T')[0]);
    const equiposOperando = equipment.filter(e => e.status === 'operando').length;
    const equiposDetenidos = equipment.filter(e => e.status === 'en_reparacion' || e.status === 'detenido').length;

    const mockData = {
        temporada: 'Invierno 2026-2027',
        semanaActual: 48,
        fechaCorte: '27-nov-2026',
        totalEquipos: equipment.length,
        consumoDiesel: summary?.fuelConsumption || '0 L',
        costoDiesel: summary?.fuelCost || '$0',
        costoSectores: summary?.sectorCost || '$0',
        equipoDetenido: equiposDetenidos,
    };

    const getEventTypeColor = (type: string) => {
        if (type === 'labor') return '#1F5C3A';
        if (type === 'diesel') return '#2A6A8A';
        return '#C08412';
    };

    const getEventTypeLabel = (type: string) => {
        if (type === 'labor') return 'Labor';
        if (type === 'diesel') return 'Diésel';
        return 'Servicio';
    };

    const getStatusColor = (status: string) => {
        if (status === 'operando') return 'green';
        if (status === 'en_reparacion') return 'yellow';
        return 'gray';
    };

    const getStatusLabel = (status: string) => {
        if (status === 'operando') return 'Operando';
        if (status === 'en_reparacion') return 'En reparación';
        return 'Detenido';
    };

    // ============================================================
    // RENDER
    // ============================================================

    if (isLoading) {
        return (
            <Center style={{ height: '60vh' }}>
                <Stack align="center" gap="md">
                    <Loader color="growerGreen" size="xl" type="dots" />
                    <Text size="sm" c="dimmed">Cargando maquinaria...</Text>
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
        <Box style={{ backgroundColor: '#F4F1EA', minHeight: '100vh', padding: '16px' }}>

            {/* ===== ENCABEZADO ===== */}
            <Paper
                p="xl"
                radius="lg"
                mb="xl"
                style={{
                    background: 'linear-gradient(135deg, #1F5C3A 0%, #2A6A8A 100%)',
                    color: '#FFFFFF',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Group justify="space-between" align="center" style={{ position: 'relative', zIndex: 1 }}>
                    <Stack gap={4}>
                        <Group gap="xs">
                            <Badge size="xs" variant="white" color="teal" radius="sm">
                                MAQ-1 · Maquinaria
                            </Badge>
                            <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                                {mockData.temporada}
                            </Badge>
                        </Group>
                        <Group gap="sm" align="center">
                            <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                                Maquinaria y Servicios
                            </Text>
                            <Badge size="lg" variant="light" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700 }}>
                                Semana {mockData.semanaActual}
                            </Badge>
                        </Group>
                        <Group gap="xl" mt={2}>
                            <Group gap={4}>
                                <IconCalendar size={14} style={{ opacity: 0.7 }} />
                                <Text size="xs" style={{ opacity: 0.8 }}>Corte: {mockData.fechaCorte}</Text>
                            </Group>
                            <Group gap={4}>
                                <IconTractor size={14} style={{ opacity: 0.7 }} />
                                <Text size="xs" style={{ opacity: 0.8 }}>{mockData.totalEquipos} Equipos</Text>
                            </Group>
                            <Group gap={4}>
                                <IconBuilding size={14} style={{ opacity: 0.7 }} />
                                <Text size="xs" style={{ opacity: 0.8 }}>2 Ranchos activos</Text>
                            </Group>
                        </Group>
                    </Stack>

                    <Group gap="xl">
                        <Group gap="sm">
                            <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                                <IconGasStation size={20} />
                            </ThemeIcon>
                            <Stack gap={0}>
                                <Text size="lg" fw={700}>{mockData.consumoDiesel}</Text>
                                <Text size="xs" style={{ opacity: 0.7 }}>Consumo semanal</Text>
                            </Stack>
                        </Group>
                        <RingProgress
                            size={90}
                            thickness={10}
                            sections={[{ value: summary?.operationalPercent || 85, color: '#FFFFFF' }]}
                            label={
                                <Stack align="center" gap={0}>
                                    <Text size="lg" fw={800} style={{ color: '#FFFFFF' }}>{summary?.operationalPercent || 85}%</Text>
                                    <Text size="8px" style={{ opacity: 0.7 }}>operativo</Text>
                                </Stack>
                            }
                        />
                    </Group>
                </Group>
            </Paper>

            {/* ===== KPIs ===== */}
            {/* ===== KPIs ===== */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
                {/* KPI 1: Equipos Totales */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                >
                    <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Equipos Totales</Text>
                                <Text size="28px" fw={800} c="#1F5C3A">{summary?.totalEquipment || 0}</Text>
                                <Group gap={4}>
                                    <IconTractor size={14} color="#1F5C3A" />
                                    <Text size="xs" c="#1F5C3A" fw={600}>
                                        {summary?.equipmentOperating || 0} operando · {summary?.equipmentStopped || 0} detenidos
                                    </Text>
                                </Group>
                                <Progress
                                    value={summary?.operationalPercent || 0}
                                    color="#1F5C3A"
                                    size="xs"
                                    radius="xl"
                                    mt={4}
                                    style={{ width: '100%' }}
                                />
                                <Text size="9px" c="dimmed">{Math.round(summary?.operationalPercent || 0)}% operativo</Text>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                <IconTractor size={20} stroke={2} />
                            </ThemeIcon>
                        </Group>
                    </Card>
                </motion.div>

                {/* KPI 2: Consumo Diésel */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Consumo Diésel</Text>
                                <Text size="28px" fw={800} c="#2A6A8A">{summary?.fuelConsumption || '0 L'}</Text>
                                <Group gap={4}>
                                    <IconGasStation size={14} color="#2A6A8A" />
                                    <Text size="xs" c="#2A6A8A" fw={600}>{summary?.fuelCost || '$0'}</Text>
                                </Group>
                                <Badge size="xs" color="blue" variant="light" radius="sm">
                                    {summary?.fuelConsumptionLiters || 0} L · ${summary?.fuelCostValue || 0}
                                </Badge>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                                <IconGasStation size={20} stroke={2} />
                            </ThemeIcon>
                        </Group>
                    </Card>
                </motion.div>

                {/* KPI 3: Costo a Sectores */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                >
                    <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Costo a Sectores</Text>
                                <Text size="28px" fw={800} c="#C08412">{summary?.sectorCost || '$0'}</Text>
                                <Group gap={4}>
                                    <IconTractor size={14} color="#C08412" />
                                    <Text size="xs" c="#C08412" fw={600}>{summary?.totalHoursWorked || 0} horas</Text>
                                </Group>
                                <Badge size="xs" color="yellow" variant="light" radius="sm">
                                    ${summary?.avgCostPerHour || 0}/hora promedio
                                </Badge>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                                <IconReport size={20} stroke={2} />
                            </ThemeIcon>
                        </Group>
                    </Card>
                </motion.div>

                {/* KPI 4: Eventos Hoy */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.5px">Eventos Hoy</Text>
                                <Text size="28px" fw={800} c="#2A6A8A">{summary?.eventsToday || 0}</Text>
                                <Group gap={4}>
                                    <IconClock size={14} color="#2A6A8A" />
                                    <Text size="xs" c="#2A6A8A" fw={600}>
                                        {summary?.laborEventsToday || 0} labores · {summary?.dieselEventsToday || 0} diésel
                                    </Text>
                                </Group>
                                <Badge size="xs" color="teal" variant="light" radius="sm">
                                    {summary?.serviceEventsToday || 0} servicios
                                </Badge>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                                <IconClock size={20} stroke={2} />
                            </ThemeIcon>
                        </Group>
                    </Card>
                </motion.div>
            </SimpleGrid>

            {/* ===== FILTROS ===== */}
            <Group justify="space-between" mb="md">
                <Group gap="sm">
                    <SegmentedControl
                        size="sm"
                        value={viewMode}
                        onChange={setViewMode}
                        data={[
                            { value: 'eventos', label: 'Eventos' },
                            { value: 'expediente', label: 'Expediente' },
                        ]}
                        styles={{
                            root: { backgroundColor: '#F5F3EE' },
                            indicator: { backgroundColor: '#1F5C3A' },
                            label: { fontWeight: 600 }
                        }}
                    />
                    {viewMode === 'eventos' && (
                        <SegmentedControl
                            size="xs"
                            value={filterTipo}
                            onChange={setFilterTipo}
                            data={['Todos', 'Labor', 'Diésel', 'Servicio']}
                            styles={{
                                root: { backgroundColor: '#F5F3EE' },
                                indicator: { backgroundColor: '#2A6A8A' },
                                label: { fontWeight: 600 }
                            }}
                        />
                    )}
                    <Badge variant="light" color="teal" radius="sm">
                        <Group gap={4}>
                            <IconClock size={12} />
                            Actualizado: Hoy
                        </Group>
                    </Badge>
                </Group>
                <Group gap="xs">
                    <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                            <ActionIcon variant="light" color="teal" size="sm" radius="md">
                                <IconDotsVertical size={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Acciones</Menu.Label>
                            <Menu.Item leftSection={<IconRefresh size={14} />} onClick={handleRefresh}>
                                Actualizar datos
                            </Menu.Item>
                            <Menu.Item leftSection={<IconFileExport size={14} />} onClick={handleExport}>
                                Exportar Excel
                            </Menu.Item>
                            <Menu.Item leftSection={<IconPrinter size={14} />} onClick={() => window.print()}>
                                Imprimir reporte
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item leftSection={<IconPlus size={14} />} onClick={() => handleOpenEquipmentModal()}>
                                Registrar Equipo
                            </Menu.Item>
                            <Menu.Item leftSection={<IconTractor size={14} />} onClick={handleOpenEventModal}>
                                Registrar Evento
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    <ActionIcon variant="light" color="teal" size="sm" radius="md" onClick={handleRefresh}>
                        <IconRefresh size={16} />
                    </ActionIcon>
                    <ActionIcon variant="light" color="teal" size="sm" radius="md" onClick={handleExport}>
                        <IconDownload size={16} />
                    </ActionIcon>
                    <Button
                        size="xs"
                        style={{ backgroundColor: '#1F5C3A' }}
                        leftSection={<IconPlus size={14} />}
                        onClick={handleOpenEventModal}
                    >
                        Registrar Evento
                    </Button>
                </Group>
            </Group>

            {/* ===== CAPTURA ÚNICA ===== */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ marginBottom: '24px' }}
            >
                <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                    <Group gap="sm" mb="lg">
                        <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                            <IconTractor size={18} />
                        </ThemeIcon>
                        <Stack gap={0}>
                            <Text size="sm" fw={700} c="#3A3A34">Captura Única de Maquinaria</Text>
                            <Text size="xs" c="dimmed">Un evento, una captura — la data se reparte sola</Text>
                        </Stack>
                        <Button
                            size="xs"
                            variant="subtle"
                            color="teal"
                            leftSection={<IconPlus size={14} />}
                            onClick={() => handleOpenEquipmentModal()}
                            ml="auto"
                        >
                            Registrar Equipo
                        </Button>
                    </Group>

                    <Divider mb="lg" />

                    <Grid mb="md">
                        <Grid.Col span={{ base: 12, md: 3 }}>
                            <Select
                                size="xs"
                                label="Tipo de evento"
                                placeholder="Seleccionar tipo"
                                data={['Labor en sector', 'Carga de Diésel', 'Servicio / Mto']}
                                styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 3 }}>
                            <Select
                                size="xs"
                                label="Equipo"
                                placeholder="Seleccionar equipo"
                                data={equipment.map(e => `${e.name} · $${e.cost_per_hour}/h`)}
                                styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 3 }}>
                            <Select
                                size="xs"
                                label="Sector (si es labor)"
                                placeholder="Seleccionar sector"
                                data={['12a-1 SA', '5b-1 SA', '3b-2 SA']}
                                styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 3 }}>
                            <Select
                                size="xs"
                                label="Labor"
                                placeholder="Seleccionar labor"
                                data={['Rastra', 'Barbecho', 'Fumigación']}
                                styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <TextInput
                                size="xs"
                                label="Horas / km / litros"
                                placeholder="Ej: 3.5 h"
                                styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <TextInput
                                size="xs"
                                label="Horómetro"
                                placeholder="Ej: 4,182 h"
                                styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Select
                                size="xs"
                                label="Operador"
                                placeholder="Seleccionar operador"
                                data={['J. Ramírez', 'M. Torres', 'R. Salinas']}
                                styles={{ label: { fontWeight: 600, fontSize: '12px' } }}
                            />
                        </Grid.Col>
                    </Grid>

                    <Group justify="space-between">
                        <Button
                            size="sm"
                            style={{ backgroundColor: '#1F5C3A' }}
                            leftSection={<IconCheck size={16} />}
                            onClick={handleOpenEventModal}
                        >
                            Guardar Evento
                        </Button>
                        <Text size="xs" c="dimmed">
                            <strong>Al guardar:</strong> Labor → horas × $/hora caen al sector (G-11) · Carga → descuenta tanque y costo a DIÉSEL · Servicio → expediente + horómetro
                        </Text>
                    </Group>
                </Card>
            </motion.div>

            {/* ===== EVENTOS DE HOY ===== */}
            {viewMode === 'eventos' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{ marginBottom: '24px' }}
                >
                    <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group gap="sm" mb="lg">
                            <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                <IconClock size={18} />
                            </ThemeIcon>
                            <Stack gap={0}>
                                <Text size="sm" fw={700} c="#3A3A34">Eventos de Hoy</Text>
                                <Text size="xs" c="dimmed">Registro de operaciones del día</Text>
                            </Stack>
                        </Group>

                        <Divider mb="lg" />

                        <ScrollArea>
                            <Table
                                verticalSpacing="md"
                                horizontalSpacing="md"
                                highlightOnHover
                                style={{
                                    tableLayout: 'fixed',
                                    width: '100%'
                                }}
                            >
                                <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                                    <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                                        <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Hora</Table.Th>
                                        <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Tipo</Table.Th>
                                        <Table.Th style={{ width: '20%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Equipo</Table.Th>
                                        <Table.Th style={{ width: '28%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Detalle</Table.Th>
                                        <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Costo</Table.Th>
                                        <Table.Th style={{ width: '18%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Operador</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {eventosHoy.length > 0 ? (
                                        eventosHoy.map((row, idx) => {
                                            const equip = equipment.find(e => e.id === row.equipment_id);
                                            return (
                                                <Table.Tr
                                                    key={idx}
                                                    style={{
                                                        borderBottom: '1px solid #EFECE3',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAF9F5'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                                >
                                                    <Table.Td>
                                                        <Text fw={600} c="#3A3A34" size="xs">{row.event_time}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Badge
                                                            size="sm"
                                                            variant="light"
                                                            color={row.event_type === 'labor' ? 'green' : row.event_type === 'diesel' ? 'blue' : 'yellow'}
                                                            radius="sm"
                                                        >
                                                            {getEventTypeLabel(row.event_type)}
                                                        </Badge>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text fw={600} c="#3A3A34" size="xs">{equip?.name || row.equipment_id}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="xs" c="dimmed">
                                                            {row.event_type === 'labor' ? `${row.labor_type || 'Labor'} · ${row.sector || 'N/A'} · ${row.quantity}h` :
                                                                row.event_type === 'diesel' ? `${row.quantity} L · ${row.notes || ''}` :
                                                                    `${row.notes || 'Servicio'}`}
                                                        </Text>
                                                    </Table.Td>
                                                    <Table.Td style={{ textAlign: 'right' }}>
                                                        <Text size="xs" fw={700} c="#1F5C3A">${row.cost.toLocaleString()}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="xs">{row.operator || 'N/A'}</Text>
                                                    </Table.Td>
                                                </Table.Tr>
                                            );
                                        })
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td colSpan={6} ta="center" py="xl">
                                                <Stack align="center" gap="sm">
                                                    <IconClock size={40} color="#9A968A" opacity={0.4} />
                                                    <Text size="sm" c="dimmed">No hay eventos registrados hoy</Text>
                                                    <Text size="xs" c="dimmed">Registra un evento para comenzar</Text>
                                                    <Button
                                                        size="xs"
                                                        color="teal"
                                                        style={{ backgroundColor: '#1F5C3A' }}
                                                        leftSection={<IconPlus size={14} />}
                                                        onClick={handleOpenEventModal}
                                                    >
                                                        Registrar Evento
                                                    </Button>
                                                </Stack>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>

                        <Divider my="lg" />

                        <Group justify="space-between">
                            <Group gap="md">
                                <Group gap={4}>
                                    <Box style={{ width: 10, height: 10, backgroundColor: '#1F5C3A', borderRadius: 3 }} />
                                    <Text size="xs" c="dimmed">Labor</Text>
                                </Group>
                                <Group gap={4}>
                                    <Box style={{ width: 10, height: 10, backgroundColor: '#2A6A8A', borderRadius: 3 }} />
                                    <Text size="xs" c="dimmed">Diésel</Text>
                                </Group>
                                <Group gap={4}>
                                    <Box style={{ width: 10, height: 10, backgroundColor: '#C08412', borderRadius: 3 }} />
                                    <Text size="xs" c="dimmed">Servicio</Text>
                                </Group>
                            </Group>
                            <Badge variant="light" color="teal" radius="sm">
                                <Group gap={4}>
                                    <IconClock size={12} />
                                    {eventosHoy.length} eventos registrados
                                </Group>
                            </Badge>
                        </Group>
                    </Card>
                </motion.div>
            )}

            {/* ===== EXPEDIENTE POR ACTIVO ===== */}
            {viewMode === 'expediente' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Card p="xl" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" mb="lg">
                            <Group gap="sm">
                                <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                    <IconReport size={18} />
                                </ThemeIcon>
                                <Stack gap={0}>
                                    <Text size="sm" fw={700} c="#3A3A34">Expediente por Activo</Text>
                                    <Text size="xs" c="dimmed">Historial y mantenimiento de equipos</Text>
                                </Stack>
                            </Group>
                            <Button
                                size="xs"
                                style={{ backgroundColor: '#1F5C3A' }}
                                leftSection={<IconPlus size={14} />}
                                onClick={() => handleOpenEquipmentModal()}
                            >
                                Registrar Equipo
                            </Button>
                        </Group>

                        <Divider mb="lg" />

                        <ScrollArea>
                            <Table
                                verticalSpacing="md"
                                horizontalSpacing="md"
                                highlightOnHover
                                style={{
                                    tableLayout: 'fixed',
                                    width: '100%'
                                }}
                            >
                                <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                                    <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                                        <Table.Th style={{ width: '18%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Activo</Table.Th>
                                        <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Horómetro</Table.Th>
                                        <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Últ. Servicio</Table.Th>
                                        <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Próximo</Table.Th>
                                        <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Diésel Sem</Table.Th>
                                        <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>Costo Mto</Table.Th>
                                        <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>$/hora</Table.Th>
                                        <Table.Th style={{ width: '12%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Estado</Table.Th>
                                        <Table.Th style={{ width: '10%', color: '#4A4A40', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>Acciones</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {equipment.length > 0 ? (
                                        equipment.map((row, idx) => {
                                            const color = row.status === 'operando' ? '#1F5C3A' : row.status === 'en_reparacion' ? '#C08412' : '#C0392B';
                                            return (
                                                <Table.Tr
                                                    key={idx}
                                                    style={{
                                                        borderBottom: '1px solid #EFECE3',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAF9F5'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                                >
                                                    <Table.Td>
                                                        <Group gap="sm" wrap="nowrap">
                                                            <ThemeIcon size="sm" radius="xl" style={{ backgroundColor: `${color}20`, color: color, flexShrink: 0 }}>
                                                                <IconTractor size={14} />
                                                            </ThemeIcon>
                                                            <Text fw={600} c="#3A3A34" size="xs">{row.name}</Text>
                                                        </Group>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="xs" fw={600}>{row.hour_meter.toLocaleString()}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="xs">{row.last_service ? new Date(row.last_service).toLocaleDateString('es-MX') : '—'}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="xs" c={row.next_service === '—' ? 'dimmed' : '#1F5C3A'}>{row.next_service || '—'}</Text>
                                                    </Table.Td>
                                                    <Table.Td style={{ textAlign: 'right' }}>
                                                        <Text size="xs">{row.fuel_consumption_weekly || 0} L</Text>
                                                    </Table.Td>
                                                    <Table.Td style={{ textAlign: 'right' }}>
                                                        <Text size="xs">${row.maintenance_cost.toLocaleString()}</Text>
                                                    </Table.Td>
                                                    <Table.Td style={{ textAlign: 'right' }}>
                                                        <Text size="xs" fw={700}>${row.cost_per_hour.toFixed(1)}</Text>
                                                    </Table.Td>
                                                    <Table.Td style={{ textAlign: 'center' }}>
                                                        <Badge
                                                            size="sm"
                                                            color={getStatusColor(row.status)}
                                                            variant="light"
                                                            radius="xl"
                                                        >
                                                            {getStatusLabel(row.status)}
                                                        </Badge>
                                                    </Table.Td>
                                                    <Table.Td style={{ textAlign: 'center' }}>
                                                        <Group gap="xs" justify="center">
                                                            <Tooltip label="Ver detalle">
                                                                <ActionIcon
                                                                    size="sm"
                                                                    variant="subtle"
                                                                    color="teal"
                                                                    onClick={() => handleViewEquipmentDetail(row)}
                                                                >
                                                                    <IconEye size={14} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                            <Tooltip label="Editar">
                                                                <ActionIcon
                                                                    size="sm"
                                                                    variant="subtle"
                                                                    color="blue"
                                                                    onClick={() => handleOpenEquipmentModal(row)}
                                                                >
                                                                    <IconEdit size={14} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                            <Tooltip label="Eliminar">
                                                                <ActionIcon
                                                                    size="sm"
                                                                    variant="subtle"
                                                                    color="red"
                                                                    onClick={() => {
                                                                        setSelectedEquipment(row);
                                                                        setDeleteModalOpen(true);
                                                                    }}
                                                                >
                                                                    <IconTrash size={14} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                            <Tooltip label="Registrar Servicio">
                                                                <ActionIcon
                                                                    size="sm"
                                                                    variant="subtle"
                                                                    color="yellow"
                                                                    onClick={() => handleOpenServiceModal(row)}
                                                                >
                                                                    <IconTools size={14} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Group>
                                                    </Table.Td>
                                                </Table.Tr>
                                            );
                                        })
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td colSpan={9} ta="center" py="xl">
                                                <Stack align="center" gap="sm">
                                                    <IconTractor size={40} color="#9A968A" opacity={0.4} />
                                                    <Text size="sm" c="dimmed">No hay equipos registrados</Text>
                                                    <Text size="xs" c="dimmed">Registra un equipo para comenzar</Text>
                                                    <Button
                                                        size="xs"
                                                        color="teal"
                                                        style={{ backgroundColor: '#1F5C3A' }}
                                                        leftSection={<IconPlus size={14} />}
                                                        onClick={() => handleOpenEquipmentModal()}
                                                    >
                                                        Registrar Equipo
                                                    </Button>
                                                </Stack>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>

                        <Divider my="lg" />

                        <Group justify="space-between">
                            <Group gap="sm">
                                <Badge variant="light" color="green" radius="sm">
                                    <Group gap={4}>
                                        <IconCheck size={12} />
                                        {equipment.filter(e => e.status === 'operando').length} operando
                                    </Group>
                                </Badge>
                                <Badge variant="light" color="yellow" radius="sm">
                                    <Group gap={4}>
                                        <IconTools size={12} />
                                        {equipment.filter(e => e.status === 'en_reparacion').length} en reparación
                                    </Group>
                                </Badge>
                                <Badge variant="light" color="gray" radius="sm">
                                    <Group gap={4}>
                                        <IconX size={12} />
                                        {equipment.filter(e => e.status === 'detenido').length} detenidos
                                    </Group>
                                </Badge>
                            </Group>
                            <Button size="xs" variant="subtle" color="teal" rightSection={<IconEye size={14} />}>
                                Ver expediente completo
                            </Button>
                        </Group>
                    </Card>
                </motion.div>
            )}

            {/* ============================================================
          MODAL: Registrar/Editar Equipo
      ============================================================ */}
            <Modal
                opened={equipmentModalOpen}
                onClose={() => {
                    setEquipmentModalOpen(false);
                    setSelectedEquipment(null);
                }}
                title={
                    <Group gap="sm">
                        <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                            <IconTractor size={18} />
                        </ThemeIcon>
                        <Stack gap={0}>
                            <Text size="sm" fw={700}>
                                {selectedEquipment ? 'Editar Equipo' : 'Registrar Equipo'}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {selectedEquipment ? selectedEquipment.name : 'Nueva maquinaria o vehículo'}
                            </Text>
                        </Stack>
                    </Group>
                }
                size="lg"
                centered
            >
                <form onSubmit={(e) => { e.preventDefault(); handleCreateEquipment(); }}>
                    <Stack gap="md">
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Código"
                                    value={equipmentForm.code}
                                    onChange={(e) => setEquipmentForm({ ...equipmentForm, code: e.currentTarget.value })}
                                    required
                                    readOnly={!!selectedEquipment}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Nombre del Equipo"
                                    placeholder="Ej: Tractor 3 - JD 5075"
                                    value={equipmentForm.name}
                                    onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.currentTarget.value })}
                                    required
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Tipo"
                                    placeholder="Ej: Tractor, Camion, Bomba"
                                    value={equipmentForm.type}
                                    onChange={(e) => setEquipmentForm({ ...equipmentForm, type: e.currentTarget.value })}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Marca"
                                    placeholder="Ej: John Deere"
                                    value={equipmentForm.brand}
                                    onChange={(e) => setEquipmentForm({ ...equipmentForm, brand: e.currentTarget.value })}
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Modelo"
                                    placeholder="Ej: 5075"
                                    value={equipmentForm.model}
                                    onChange={(e) => setEquipmentForm({ ...equipmentForm, model: e.currentTarget.value })}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label="Año"
                                    value={equipmentForm.year}
                                    onChange={(value) => setEquipmentForm({ ...equipmentForm, year: Number(value) || new Date().getFullYear() })}
                                    min={1990}
                                    max={new Date().getFullYear() + 1}
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label="Horómetro"
                                    placeholder="0"
                                    value={equipmentForm.hour_meter}
                                    onChange={(value) => setEquipmentForm({ ...equipmentForm, hour_meter: Number(value) || 0 })}
                                    min={0}
                                    step={0.1}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label="Consumo Diésel Semanal (L)"
                                    placeholder="0"
                                    value={equipmentForm.fuel_consumption_weekly}
                                    onChange={(value) => setEquipmentForm({ ...equipmentForm, fuel_consumption_weekly: Number(value) || 0 })}
                                    min={0}
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Último Servicio"
                                    type="date"
                                    value={equipmentForm.last_service}
                                    onChange={(e) => setEquipmentForm({ ...equipmentForm, last_service: e.currentTarget.value })}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Próximo Servicio"
                                    placeholder="Ej: 4,400 h"
                                    value={equipmentForm.next_service}
                                    onChange={(e) => setEquipmentForm({ ...equipmentForm, next_service: e.currentTarget.value })}
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label="Costo Mantenimiento ($)"
                                    placeholder="0"
                                    value={equipmentForm.maintenance_cost}
                                    onChange={(value) => setEquipmentForm({ ...equipmentForm, maintenance_cost: Number(value) || 0 })}
                                    min={0}
                                    step={100}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label="Costo por Hora ($)"
                                    placeholder="0"
                                    value={equipmentForm.cost_per_hour}
                                    onChange={(value) => setEquipmentForm({ ...equipmentForm, cost_per_hour: Number(value) || 0 })}
                                    min={0}
                                    step={0.5}
                                />
                            </Grid.Col>
                        </Grid>

                        <Select
                            label="Estado"
                            value={equipmentForm.status}
                            onChange={(value) => setEquipmentForm({ ...equipmentForm, status: value || 'operando' })}
                            data={[
                                { value: 'operando', label: 'Operando' },
                                { value: 'en_reparacion', label: 'En reparación' },
                                { value: 'detenido', label: 'Detenido' },
                            ]}
                            required
                        />

                        <Textarea
                            label="Notas"
                            placeholder="Notas adicionales sobre el equipo"
                            value={equipmentForm.notes}
                            onChange={(e) => setEquipmentForm({ ...equipmentForm, notes: e.currentTarget.value })}
                            rows={2}
                        />

                        <Divider />

                        <Group justify="space-between">
                            <Button
                                variant="subtle"
                                color="gray"
                                onClick={() => {
                                    setEquipmentModalOpen(false);
                                    setSelectedEquipment(null);
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
                                {selectedEquipment ? 'Actualizar Equipo' : 'Registrar Equipo'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* ============================================================
          MODAL: Registrar Evento
      ============================================================ */}
            <Modal
                opened={eventModalOpen}
                onClose={() => {
                    setEventModalOpen(false);
                    setEventForm({
                        equipment_id: '',
                        event_type: 'labor',
                        event_date: new Date().toISOString().split('T')[0],
                        event_time: new Date().toTimeString().slice(0, 5),
                        sector: '',
                        labor_type: '',
                        quantity: 0,
                        cost: 0,
                        operator: '',
                        notes: '',
                    });
                }}
                title={
                    <Group gap="sm">
                        <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                            <IconTractor size={18} />
                        </ThemeIcon>
                        <Stack gap={0}>
                            <Text size="sm" fw={700}>Registrar Evento</Text>
                            <Text size="xs" c="dimmed">Capturar operación de maquinaria</Text>
                        </Stack>
                    </Group>
                }
                size="lg"
                centered
            >
                <form onSubmit={(e) => { e.preventDefault(); handleCreateEvent(); }}>
                    <Stack gap="md">
                        <Grid>
                            <Grid.Col span={6}>
                                <Select
                                    label="Equipo"
                                    value={eventForm.equipment_id}
                                    onChange={(value) => setEventForm({ ...eventForm, equipment_id: value || '' })}
                                    data={equipment.map(e => ({ value: e.id, label: e.name }))}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label="Tipo de Evento"
                                    value={eventForm.event_type}
                                    onChange={(value) => setEventForm({ ...eventForm, event_type: value as any || 'labor' })}
                                    data={[
                                        { value: 'labor', label: 'Labor en sector' },
                                        { value: 'diesel', label: 'Carga de Diésel' },
                                        { value: 'service', label: 'Servicio / Mantenimiento' },
                                    ]}
                                    required
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Fecha"
                                    type="date"
                                    value={eventForm.event_date}
                                    onChange={(e) => setEventForm({ ...eventForm, event_date: e.currentTarget.value })}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Hora"
                                    type="time"
                                    value={eventForm.event_time}
                                    onChange={(e) => setEventForm({ ...eventForm, event_time: e.currentTarget.value })}
                                    required
                                />
                            </Grid.Col>
                        </Grid>

                        {eventForm.event_type === 'labor' && (
                            <Grid>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Sector"
                                        placeholder="Ej: 12a-1 SA"
                                        value={eventForm.sector}
                                        onChange={(e) => setEventForm({ ...eventForm, sector: e.currentTarget.value })}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Tipo de Labor"
                                        placeholder="Ej: Rastra"
                                        value={eventForm.labor_type}
                                        onChange={(e) => setEventForm({ ...eventForm, labor_type: e.currentTarget.value })}
                                    />
                                </Grid.Col>
                            </Grid>
                        )}

                        <Grid>
                            <Grid.Col span={4}>
                                <NumberInput
                                    label="Cantidad (horas/litros)"
                                    placeholder="0"
                                    value={eventForm.quantity}
                                    onChange={(value) => setEventForm({ ...eventForm, quantity: Number(value) || 0 })}
                                    min={0}
                                    step={0.5}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <NumberInput
                                    label="Costo ($)"
                                    placeholder="0"
                                    value={eventForm.cost}
                                    onChange={(value) => setEventForm({ ...eventForm, cost: Number(value) || 0 })}
                                    min={0}
                                    step={10}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput
                                    label="Operador"
                                    placeholder="Nombre del operador"
                                    value={eventForm.operator}
                                    onChange={(e) => setEventForm({ ...eventForm, operator: e.currentTarget.value })}
                                />
                            </Grid.Col>
                        </Grid>

                        <Textarea
                            label="Notas"
                            placeholder="Detalles adicionales del evento"
                            value={eventForm.notes}
                            onChange={(e) => setEventForm({ ...eventForm, notes: e.currentTarget.value })}
                            rows={2}
                        />

                        <Divider />

                        <Group justify="space-between">
                            <Button
                                variant="subtle"
                                color="gray"
                                onClick={() => {
                                    setEventModalOpen(false);
                                    setEventForm({
                                        equipment_id: '',
                                        event_type: 'labor',
                                        event_date: new Date().toISOString().split('T')[0],
                                        event_time: new Date().toTimeString().slice(0, 5),
                                        sector: '',
                                        labor_type: '',
                                        quantity: 0,
                                        cost: 0,
                                        operator: '',
                                        notes: '',
                                    });
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
                                Registrar Evento
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* ============================================================
          MODAL: Registrar Servicio
      ============================================================ */}
            <Modal
                opened={serviceModalOpen}
                onClose={() => {
                    setServiceModalOpen(false);
                    setServiceForm({
                        equipment_id: '',
                        service_date: new Date().toISOString().split('T')[0],
                        service_type: '',
                        description: '',
                        cost: 0,
                        provider: '',
                        invoice_number: '',
                        hour_meter_at_service: 0,
                        next_service_hours: 0,
                        notes: '',
                    });
                }}
                title={
                    <Group gap="sm">
                        <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                            <IconTools size={18} />
                        </ThemeIcon>
                        <Stack gap={0}>
                            <Text size="sm" fw={700}>Registrar Servicio</Text>
                            <Text size="xs" c="dimmed">Mantenimiento de maquinaria</Text>
                        </Stack>
                    </Group>
                }
                size="lg"
                centered
            >
                <form onSubmit={(e) => { e.preventDefault(); handleCreateService(); }}>
                    <Stack gap="md">
                        <Grid>
                            <Grid.Col span={6}>
                                <Select
                                    label="Equipo"
                                    value={serviceForm.equipment_id}
                                    onChange={(value) => setServiceForm({ ...serviceForm, equipment_id: value || '' })}
                                    data={equipment.map(e => ({ value: e.id, label: e.name }))}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Tipo de Servicio"
                                    placeholder="Ej: Cambio de aceite, Reparación"
                                    value={serviceForm.service_type}
                                    onChange={(e) => setServiceForm({ ...serviceForm, service_type: e.currentTarget.value })}
                                    required
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Fecha de Servicio"
                                    type="date"
                                    value={serviceForm.service_date}
                                    onChange={(e) => setServiceForm({ ...serviceForm, service_date: e.currentTarget.value })}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label="Horómetro al Servicio"
                                    placeholder="0"
                                    value={serviceForm.hour_meter_at_service}
                                    onChange={(value) => setServiceForm({ ...serviceForm, hour_meter_at_service: Number(value) || 0 })}
                                    min={0}
                                    step={0.1}
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label="Costo ($)"
                                    placeholder="0"
                                    value={serviceForm.cost}
                                    onChange={(value) => setServiceForm({ ...serviceForm, cost: Number(value) || 0 })}
                                    min={0}
                                    step={10}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label="Próximo Servicio (horas)"
                                    placeholder="0"
                                    value={serviceForm.next_service_hours}
                                    onChange={(value) => setServiceForm({ ...serviceForm, next_service_hours: Number(value) || 0 })}
                                    min={0}
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Proveedor"
                                    placeholder="Ej: Bombas GTO"
                                    value={serviceForm.provider}
                                    onChange={(e) => setServiceForm({ ...serviceForm, provider: e.currentTarget.value })}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Número de Factura"
                                    placeholder="Ej: F-8760"
                                    value={serviceForm.invoice_number}
                                    onChange={(e) => setServiceForm({ ...serviceForm, invoice_number: e.currentTarget.value })}
                                />
                            </Grid.Col>
                        </Grid>

                        <Textarea
                            label="Descripción"
                            placeholder="Descripción detallada del servicio"
                            value={serviceForm.description}
                            onChange={(e) => setServiceForm({ ...serviceForm, description: e.currentTarget.value })}
                            rows={2}
                        />

                        <Textarea
                            label="Notas"
                            placeholder="Notas adicionales"
                            value={serviceForm.notes}
                            onChange={(e) => setServiceForm({ ...serviceForm, notes: e.currentTarget.value })}
                            rows={2}
                        />

                        <Divider />

                        <Group justify="space-between">
                            <Button
                                variant="subtle"
                                color="gray"
                                onClick={() => {
                                    setServiceModalOpen(false);
                                    setServiceForm({
                                        equipment_id: '',
                                        service_date: new Date().toISOString().split('T')[0],
                                        service_type: '',
                                        description: '',
                                        cost: 0,
                                        provider: '',
                                        invoice_number: '',
                                        hour_meter_at_service: 0,
                                        next_service_hours: 0,
                                        notes: '',
                                    });
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
                                Registrar Servicio
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* ============================================================
          DRAWER: Detalle de Equipo
      ============================================================ */}
            <Drawer
                opened={detailDrawerOpen}
                onClose={() => {
                    setDetailDrawerOpen(false);
                    setSelectedEquipment(null);
                }}
                title={
                    <Group gap="sm">
                        <ThemeIcon size="md" radius="lg" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                            <IconInfoCircle size={18} />
                        </ThemeIcon>
                        <Stack gap={0}>
                            <Text size="sm" fw={700}>{selectedEquipment?.name}</Text>
                            <Text size="xs" c="dimmed">Detalle del equipo</Text>
                        </Stack>
                    </Group>
                }
                size="xl"
                position="right"
                padding="lg"
            >
                {selectedEquipment && (
                    <Stack gap="md">
                        <Tabs value={detailTab} onChange={(value) => setDetailTab(value as string)}>
                            <Tabs.List>
                                <Tabs.Tab value="info" leftSection={<IconInfoCircle size={14} />}>
                                    Información
                                </Tabs.Tab>
                                <Tabs.Tab value="events" leftSection={<IconHistory size={14} />}>
                                    Eventos
                                </Tabs.Tab>
                                <Tabs.Tab value="services" leftSection={<IconTools size={14} />}>
                                    Servicios
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="info" pt="md">
                                <SimpleGrid cols={2} spacing="md">
                                    <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                                        <Text size="xs" c="dimmed" fw={600}>Código</Text>
                                        <Text fw={700}>{selectedEquipment.code}</Text>
                                    </Card>
                                    <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                                        <Text size="xs" c="dimmed" fw={600}>Tipo</Text>
                                        <Text fw={700}>{selectedEquipment.type}</Text>
                                    </Card>
                                    <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                                        <Text size="xs" c="dimmed" fw={600}>Marca / Modelo</Text>
                                        <Text fw={700}>{selectedEquipment.brand} {selectedEquipment.model}</Text>
                                    </Card>
                                    <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                                        <Text size="xs" c="dimmed" fw={600}>Horómetro</Text>
                                        <Text fw={700}>{selectedEquipment.hour_meter.toLocaleString()} h</Text>
                                    </Card>
                                    <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                                        <Text size="xs" c="dimmed" fw={600}>Costo por Hora</Text>
                                        <Text fw={700} c="#1F5C3A">${selectedEquipment.cost_per_hour.toFixed(2)}</Text>
                                    </Card>
                                    <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                                        <Text size="xs" c="dimmed" fw={600}>Estado</Text>
                                        <Badge
                                            color={getStatusColor(selectedEquipment.status)}
                                            variant="light"
                                            size="lg"
                                        >
                                            {getStatusLabel(selectedEquipment.status)}
                                        </Badge>
                                    </Card>
                                </SimpleGrid>

                                {selectedEquipment.notes && (
                                    <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                                        <Text size="xs" c="dimmed" fw={600}>Notas</Text>
                                        <Text size="sm">{selectedEquipment.notes}</Text>
                                    </Card>
                                )}
                            </Tabs.Panel>

                            <Tabs.Panel value="events" pt="md">
                                {events.filter(e => e.equipment_id === selectedEquipment.id).length > 0 ? (
                                    <Table>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Fecha</Table.Th>
                                                <Table.Th>Tipo</Table.Th>
                                                <Table.Th>Detalle</Table.Th>
                                                <Table.Th ta="right">Costo</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {events.filter(e => e.equipment_id === selectedEquipment.id).map((event, idx) => (
                                                <Table.Tr key={idx}>
                                                    <Table.Td>{new Date(event.event_date).toLocaleDateString('es-MX')}</Table.Td>
                                                    <Table.Td>
                                                        <Badge size="sm" color={event.event_type === 'labor' ? 'green' : event.event_type === 'diesel' ? 'blue' : 'yellow'}>
                                                            {getEventTypeLabel(event.event_type)}
                                                        </Badge>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {event.event_type === 'labor' ? `${event.labor_type} · ${event.sector} · ${event.quantity}h` :
                                                            event.event_type === 'diesel' ? `${event.quantity} L` :
                                                                event.notes}
                                                    </Table.Td>
                                                    <Table.Td ta="right" fw={700}>${event.cost.toLocaleString()}</Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                ) : (
                                    <Text ta="center" c="dimmed" py="xl">No hay eventos registrados para este equipo</Text>
                                )}
                            </Tabs.Panel>

                            <Tabs.Panel value="services" pt="md">
                                {services.filter(s => s.equipment_id === selectedEquipment.id).length > 0 ? (
                                    <Table>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Fecha</Table.Th>
                                                <Table.Th>Tipo</Table.Th>
                                                <Table.Th>Costo</Table.Th>
                                                <Table.Th>Proveedor</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {services.filter(s => s.equipment_id === selectedEquipment.id).map((service, idx) => (
                                                <Table.Tr key={idx}>
                                                    <Table.Td>{new Date(service.service_date).toLocaleDateString('es-MX')}</Table.Td>
                                                    <Table.Td>{service.service_type}</Table.Td>
                                                    <Table.Td fw={700} c="#1F5C3A">${service.cost.toLocaleString()}</Table.Td>
                                                    <Table.Td>{service.provider || 'N/A'}</Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                ) : (
                                    <Text ta="center" c="dimmed" py="xl">No hay servicios registrados para este equipo</Text>
                                )}
                            </Tabs.Panel>
                        </Tabs>

                        <Divider />

                        <Group justify="space-between">
                            <Button
                                variant="subtle"
                                color="gray"
                                onClick={() => {
                                    setDetailDrawerOpen(false);
                                    setSelectedEquipment(null);
                                }}
                            >
                                Cerrar
                            </Button>
                            <Group gap="sm">
                                <Button
                                    size="xs"
                                    variant="light"
                                    color="yellow"
                                    leftSection={<IconTools size={14} />}
                                    onClick={() => {
                                        setDetailDrawerOpen(false);
                                        handleOpenServiceModal(selectedEquipment);
                                    }}
                                >
                                    Registrar Servicio
                                </Button>
                                <Button
                                    size="xs"
                                    variant="light"
                                    color="teal"
                                    leftSection={<IconEdit size={14} />}
                                    onClick={() => {
                                        setDetailDrawerOpen(false);
                                        handleOpenEquipmentModal(selectedEquipment);
                                    }}
                                >
                                    Editar
                                </Button>
                            </Group>
                        </Group>
                    </Stack>
                )}
            </Drawer>

            {/* ============================================================
          MODAL: Confirmar Eliminación
      ============================================================ */}
            <Modal
                opened={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedEquipment(null);
                }}
                title="Eliminar Equipo"
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
                            Vas a eliminar el equipo <strong>{selectedEquipment?.name}</strong>.
                            Esta acción no se puede deshacer.
                        </Text>
                    </Alert>

                    <Group justify="space-between">
                        <Button
                            variant="subtle"
                            color="gray"
                            onClick={() => {
                                setDeleteModalOpen(false);
                                setSelectedEquipment(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            color="red"
                            loading={isSubmitting}
                            leftSection={<IconTrash size={16} />}
                            onClick={handleDeleteEquipment}
                        >
                            Eliminar Equipo
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Box>
    );
}

export default GrowerMachinery;