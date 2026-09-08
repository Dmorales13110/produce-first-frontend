// src/modules/grower/GrowerConcentrated.tsx
import React, { useState, useMemo } from 'react';
import {
    Card,
    Text,
    Title,
    Group,
    ThemeIcon,
    Stack,
    Table,
    Badge,
    SimpleGrid,
    Paper,
    Divider,
    Box,
    Loader,
    Center,
    Alert,
    Button,
    Select,
    Grid,
    SegmentedControl
} from '@mantine/core';
import {
    IconDatabase,
    IconTruck,
    IconScale,
    IconWeight,
    IconArrowUpRight,
    IconArrowDownRight,
    IconTrendingUp,
    IconRefresh,
    IconAlertCircle,
    IconCalendar,
    IconFilter,
    IconChartLine,
    IconList,
    IconChartBar
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useConcentrated } from './hooks/useConcentrated';
import { useCapture } from '../capture/hooks/useCapture';
import { ConcentratedCharts } from './components/ConcentratedCharts';

export function GrowerConcentrated() {
    const [selectedGrower, setSelectedGrower] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'tabla' | 'graficas'>('tabla');
    const { data, isLoading, error, refresh, setFilters } = useConcentrated();
    const { growers } = useCapture();

    // Formatear números
    const formatNumber = (num: number) => {
        return num.toLocaleString('es-MX');
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Preparar datos para la tabla
    const records = useMemo(() => {
        if (!data?.records) return [];
        return data.records.map(record => ({
            ...record,
            fechaFormateada: formatDate(record.fecha),
            brutoFormateado: `${formatNumber(record.bruto)} kg`,
            taraFormateada: `${formatNumber(record.tara)} kg`,
            netoFormateado: `${formatNumber(record.neto)} kg`,
            mermaFormateada: `${record.merma.toFixed(1)}%`,
        }));
    }, [data]);

    // Estadísticas
    const stats = useMemo(() => {
        if (!data) return null;
        return {
            totalViajes: data.totalViajes,
            totalNeto: data.totalNeto,
            promedioMerma: data.promedioMerma,
            mejorDia: data.mejorDia,
            totalDias: data.records.length,
        };
    }, [data]);

    // Manejar cambio de filtro de grower
    const handleGrowerChange = (value: string | null) => {
        setSelectedGrower(value);
        setFilters({ growerId: value || undefined });
    };

    // ============================================================
    // ESTADOS DE CARGA Y ERROR
    // ============================================================
    if (isLoading) {
        return (
            <Center style={{ height: '60vh' }}>
                <Stack align="center" gap="md">
                    <Loader color="growerGreen" size="xl" type="dots" />
                    <Text size="sm" c="dimmed">Cargando datos de concentrados...</Text>
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
                        G-9 · Concentrado
                    </Text>
                    <Text size="28px" fw={800} c="#3A3A34" style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                        Registro de Pesaje
                    </Text>
                    <Text size="sm" c="dimmed">
                        Consolidado diario de pesajes y mermas
                    </Text>
                </Stack>
                <Group gap="sm">
                    <Badge size="lg" color="teal" radius="sm" style={{ fontWeight: 700, padding: '6px 16px' }}>
                        {stats?.totalDias || 0} Días
                    </Badge>
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

            {/* Filtros */}
            <Paper p="md" radius="lg" withBorder mb="xl" style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                <Group justify="space-between">
                    <Group gap="md">
                        <Group gap="xs">
                            <IconFilter size={16} color="#9A968A" />
                            <Text size="xs" fw={600} c="dimmed">Filtros:</Text>
                        </Group>
                        <Select
                            size="xs"
                            placeholder="Todos los ranchos"
                            data={[
                                { value: '', label: 'Todos los ranchos' },
                                ...(growers || []).map(g => ({
                                    value: g.id,
                                    label: g.commercial_name || g.legal_name || 'Rancho sin nombre',
                                }))
                            ]}
                            value={selectedGrower || ''}
                            onChange={(value) => handleGrowerChange(value || null)}
                            clearable
                            style={{ width: 250 }}
                            styles={{
                                input: { fontWeight: 600, backgroundColor: '#FFFFFF', borderColor: '#E8E5DC' },
                            }}
                        />
                        <Badge variant="light" color="teal" radius="sm">
                            <Group gap={4}>
                                <IconCalendar size={12} />
                                {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                            </Group>
                        </Badge>
                    </Group>

                    <SegmentedControl
                        size="xs"
                        value={viewMode}
                        onChange={(value) => setViewMode(value as 'tabla' | 'graficas')}
                        data={[
                            { value: 'tabla', label: 'Tabla' },
                            { value: 'graficas', label: 'Gráficas' },
                        ]}
                        styles={{
                            root: { backgroundColor: '#F5F3EE' },
                            indicator: { backgroundColor: '#1F5C3A' },
                            label: { fontWeight: 600 }
                        }}
                    />
                </Group>
            </Paper>

            {/* KPIs de Resumen */}
            {stats && (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                            <Group justify="space-between" align="flex-start">
                                <Stack gap={2}>
                                    <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Total Viajes
                                    </Text>
                                    <Text size="xl" fw={800} c="#1F5C3A">{stats.totalViajes}</Text>
                                    <Text size="xs" c="dimmed">en {stats.totalDias} días</Text>
                                </Stack>
                                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                    <IconTruck size={20} stroke={2} />
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
                                        Peso Neto Total
                                    </Text>
                                    <Text size="xl" fw={800} c="#2A6A8A">{formatNumber(stats.totalNeto)} kg</Text>
                                    <Text size="xs" c="dimmed">promedio {formatNumber(Math.round(stats.totalNeto / stats.totalDias))} kg/día</Text>
                                </Stack>
                                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                                    <IconWeight size={20} stroke={2} />
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
                                        Promedio Merma
                                    </Text>
                                    <Text size="xl" fw={800} c={stats.promedioMerma > 1.5 ? '#C0392B' : '#1F5C3A'}>
                                        {stats.promedioMerma.toFixed(2)}%
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        {stats.promedioMerma > 1.5 ? '⚠️ Por encima del estándar' : '✅ Dentro del estándar'}
                                    </Text>
                                </Stack>
                                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: stats.promedioMerma > 1.5 ? '#C0392B' : '#1F5C3A' }}>
                                    <IconTrendingUp size={20} stroke={2} />
                                </ThemeIcon>
                            </Group>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                    >
                        <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                            <Group justify="space-between" align="flex-start">
                                <Stack gap={2}>
                                    <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Mejor Día
                                    </Text>
                                    <Text size="xl" fw={800} c="#1F5C3A">{formatNumber(stats.mejorDia?.neto || 0)} kg</Text>
                                    <Text size="xs" c="dimmed">
                                        {stats.mejorDia ? `${formatDate(stats.mejorDia.fecha)} · ${stats.mejorDia.viajes} viajes` : 'Sin datos'}
                                    </Text>
                                </Stack>
                                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                    <IconArrowUpRight size={20} stroke={2} />
                                </ThemeIcon>
                            </Group>
                        </Card>
                    </motion.div>
                </SimpleGrid>
            )}

            {/* Gráficas o Tabla según vista */}
            {viewMode === 'graficas' ? (
                <ConcentratedCharts records={records} />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Paper
                        withBorder
                        style={{
                            borderColor: '#E8E5DC',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                        }}
                    >
                        <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
                            <Table.Thead style={{ backgroundColor: '#1F5C3A' }}>
                                <Table.Tr>
                                    <Table.Th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', padding: '14px 20px' }}>
                                        <Group gap="xs">
                                            <IconDatabase size={16} />
                                            Fecha
                                        </Group>
                                    </Table.Th>
                                    <Table.Th style={{
                                        color: '#FFFFFF',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        padding: '14px 20px'
                                    }}>
                                        Viajes
                                    </Table.Th>
                                    <Table.Th style={{
                                        color: '#FFFFFF',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        padding: '14px 20px'
                                    }}>
                                        Peso Bruto
                                    </Table.Th>
                                    <Table.Th style={{
                                        color: '#FFFFFF',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        padding: '14px 20px'
                                    }}>
                                        Tara
                                    </Table.Th>
                                    <Table.Th style={{
                                        color: '#FFFFFF',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        padding: '14px 20px'
                                    }}>
                                        Peso Neto
                                    </Table.Th>
                                    <Table.Th style={{
                                        color: '#FFFFFF',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        padding: '14px 20px'
                                    }}>
                                        Merma
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {records.length > 0 ? (
                                    records.map((c, idx) => (
                                        <Table.Tr key={idx} style={{ borderBottom: '1px solid #EFECE3' }}>
                                            <Table.Td>
                                                <Text size="sm" fw={700} c="#3A3A34">{c.fechaFormateada}</Text>
                                            </Table.Td>
                                            <Table.Td ta="right">
                                                <Badge variant="light" color="teal" radius="sm" size="sm">
                                                    {c.viajes}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td ta="right">
                                                <Text size="sm" fw={500} c="#3A3A34">{c.brutoFormateado}</Text>
                                            </Table.Td>
                                            <Table.Td ta="right">
                                                <Text size="sm" c="dimmed" fw={500}>{c.taraFormateada}</Text>
                                            </Table.Td>
                                            <Table.Td ta="right">
                                                <Text size="sm" fw={700} c="#1F5C3A">{c.netoFormateado}</Text>
                                            </Table.Td>
                                            <Table.Td ta="right">
                                                <Badge
                                                    size="sm"
                                                    color={c.merma <= 1.5 ? 'green' : c.merma <= 2.5 ? 'yellow' : 'red'}
                                                    variant="light"
                                                    radius="xl"
                                                    style={{ fontWeight: 700 }}
                                                >
                                                    {c.mermaFormateada}
                                                </Badge>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))
                                ) : (
                                    <Table.Tr>
                                        <Table.Td colSpan={6} ta="center" py="xl">
                                            <Stack align="center" gap="sm">
                                                <IconDatabase size={40} color="#9A968A" opacity={0.4} />
                                                <Text size="sm" c="dimmed">No hay registros de concentrado</Text>
                                                <Text size="xs" c="dimmed">Los datos aparecerán cuando se registren pesajes</Text>
                                            </Stack>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                </motion.div>
            )}

            {/* Nota al pie */}
            <Card mt="md" p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                <Group gap="xs">
                    <ThemeIcon size="sm" radius="xl" color="teal" variant="light">
                        <IconScale size={14} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed" style={{ lineHeight: 1.6 }}>
                        <strong>Nota:</strong> El concentrado de carga muestra el consolidado diario de pesajes.
                        La merma incluye pérdidas por humedad y daños durante el transporte.
                        Merma estándar: &lt; 1.5% · {records.length} registros mostrados
                    </Text>
                </Group>
            </Card>
        </Box>
    );
}

export default GrowerConcentrated;