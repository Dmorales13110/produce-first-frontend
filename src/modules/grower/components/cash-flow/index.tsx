import React, { useState } from 'react';
import {
    Box,
    SimpleGrid,
    Paper,
    Text,
    Group,
    Stack,
    Table,
    Button,
    TextInput,
    Grid,
    Card,
    ThemeIcon,
    Divider,
    Progress,
    RingProgress,
    Badge,
    Tooltip,
    ActionIcon,
    SegmentedControl,
    Alert,
    Loader,
    Center,
    Modal,
    NumberInput,
} from '@mantine/core';
import {
    IconBuildingBank,
    IconCheck,
    IconChartLine,
    IconCurrencyDollar,
    IconArrowUpRight,
    IconArrowDownRight,
    IconCalendar,
    IconCash,
    IconCreditCard,
    IconWallet,
    IconTrendingUp,
    IconTrendingDown,
    IconEye,
    IconRefresh,
    IconPencilCheck,
    IconAlertCircle,
    IconClock,
    IconPlus,
    IconEdit,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useCashFlow } from './hooks/useCashFlow';
import { notifications } from '@mantine/notifications';

export function GrowerBanksAndCashflow() {
    const {
        balances,
        projection,
        weeklyDetail,
        liquidityGaps,
        summary,
        exchangeRate,
        isLoading,
        error,
        refresh,
        saveBankBalance,
        saveExchangeRate,
    } = useCashFlow();

    const [bbvaSaldo, setBbvaSaldo] = useState('');
    const [banorteSaldo, setBanorteSaldo] = useState('');
    const [tcHoy, setTcHoy] = useState('');
    const [viewPeriod, setViewPeriod] = useState('4semanas');
    const [isSaving, setIsSaving] = useState(false);

    // ============================================================
    // HANDLERS
    // ============================================================

    const handleSaveBalances = async () => {
        setIsSaving(true);
        try {
            // Guardar BBVA
            if (bbvaSaldo) {
                await saveBankBalance({
                    bank_name: 'BBVA',
                    account_number: 'DV-001',
                    balance: parseFloat(bbvaSaldo.replace(/,/g, '')),
                    currency: 'MXN',
                });
            }

            // Guardar Banorte
            if (banorteSaldo) {
                await saveBankBalance({
                    bank_name: 'Banorte',
                    account_number: 'JAV-001',
                    balance: parseFloat(banorteSaldo.replace(/,/g, '')),
                    currency: 'MXN',
                });
            }

            // Guardar TC
            if (tcHoy) {
                await saveExchangeRate({
                    rate: parseFloat(tcHoy),
                });
            }

            notifications.show({
                title: '✅ Saldos guardados',
                message: 'Los saldos y tipo de cambio han sido actualizados',
                color: 'green',
                icon: <IconCheck size={16} />,
                autoClose: 3000,
            });

            setBbvaSaldo('');
            setBanorteSaldo('');
            setTcHoy('');
            refresh();
        } catch (err: any) {
            notifications.show({
                title: '❌ Error',
                message: err.message || 'Error al guardar saldos',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setIsSaving(false);
        }
    };

    // ============================================================
    // CÁLCULOS
    // ============================================================

    const totalSaldo = balances.reduce((acc, b) => acc + b.balance, 0);
    const bbvaBalance = balances.find(b => b.bank_name === 'BBVA')?.balance || 0;
    const banorteBalance = balances.find(b => b.bank_name === 'Banorte')?.balance || 0;
    const currentRate = exchangeRate?.rate || 17.5;

    // ============================================================
    // RENDER
    // ============================================================

    if (isLoading) {
        return (
            <Center style={{ height: '60vh' }}>
                <Stack align="center" gap="md">
                    <Loader color="growerGreen" size="xl" type="dots" />
                    <Text size="sm" c="dimmed">Cargando flujo de caja...</Text>
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
        <Box style={{ backgroundColor: '#F9F9F6', minHeight: '100vh', padding: '16px' }}>
            {/* Encabezado con degradado */}
            <Paper
                p="xl"
                radius="lg"
                mb="xl"
                style={{
                    background: 'linear-gradient(135deg, #1F5C3A 0%, #2A6A8A 100%)',
                    color: '#FFFFFF'
                }}
            >
                <Group justify="space-between" align="center">
                    <Stack gap={2}>
                        <Group gap="xs">
                            <Badge size="xs" variant="white" color="teal" radius="sm">
                                BAN-1 · Bancos
                            </Badge>
                            <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                                Invierno 2026-2027
                            </Badge>
                        </Group>
                        <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
                            Bancos y Flujo de Caja
                        </Text>
                        <Text size="sm" style={{ opacity: 0.8 }}>
                            Dos capturas de 30 segundos · El flujo se arma solo
                        </Text>
                    </Stack>
                    <Group gap="xl">
                        <Group gap="sm">
                            <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                                <IconWallet size={20} />
                            </ThemeIcon>
                            <Stack gap={0}>
                                <Text size="lg" fw={700}>${totalSaldo.toLocaleString()}</Text>
                                <Text size="xs" style={{ opacity: 0.7 }}>Saldo total</Text>
                            </Stack>
                        </Group>
                        <RingProgress
                            size={80}
                            thickness={8}
                            sections={[{ value: summary?.liquidityScore || 66, color: '#FFFFFF' }]}
                            label={
                                <Text size="xs" fw={700} ta="center" style={{ color: '#FFFFFF' }}>
                                    {summary?.liquidityScore || 66}%
                                </Text>
                            }
                        />
                    </Group>
                </Group>
            </Paper>

            {/* KPIs de Resumen */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                >
                    <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                                <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    BBVA · Daily Veggies
                                </Text>
                                <Text size="xl" fw={800} c="#1F5C3A">${bbvaBalance.toLocaleString()}</Text>
                                <Group gap={4}>
                                    <IconArrowUpRight size={12} color="#1F5C3A" />
                                    <Text size="xs" c="#1F5C3A" fw={600}>+2.4% vs ayer</Text>
                                </Group>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                                <IconCreditCard size={20} stroke={2} />
                            </ThemeIcon>
                        </Group>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card p="md" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                                <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Banorte · Agrícola JAV
                                </Text>
                                <Text size="xl" fw={800} c="#2A6A8A">${banorteBalance.toLocaleString()}</Text>
                                <Group gap={4}>
                                    <IconArrowDownRight size={12} color="#C0392B" />
                                    <Text size="xs" c="#C0392B" fw={600}>-0.8% vs ayer</Text>
                                </Group>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#2A6A8A' }}>
                                <IconCash size={20} stroke={2} />
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
                                    TC de Hoy
                                </Text>
                                <Text size="xl" fw={800} c="#C08412">{currentRate.toFixed(2)}</Text>
                                <Group gap={4}>
                                    <IconClock size={12} color="#C08412" />
                                    <Text size="xs" c="dimmed">
                                        {exchangeRate?.date ? new Date(exchangeRate.date).toLocaleTimeString() : 'No registrado'}
                                    </Text>
                                </Group>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: '#C08412' }}>
                                <IconCurrencyDollar size={20} stroke={2} />
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
                                    Posición 4 Semanas
                                </Text>
                                <Text size="xl" fw={800} c={summary?.projectedBalance && summary.projectedBalance < 0 ? '#C0392B' : '#1F5C3A'}>
                                    ${summary?.projectedBalance?.toLocaleString() || '0'}
                                </Text>
                                <Group gap={4}>
                                    {summary?.projectedBalance && summary.projectedBalance < 0 ? (
                                        <>
                                            <IconAlertCircle size={12} color="#C0392B" />
                                            <Text size="xs" c="#C0392B" fw={600}>Requiere atención</Text>
                                        </>
                                    ) : (
                                        <>
                                            <IconTrendingUp size={12} color="#1F5C3A" />
                                            <Text size="xs" c="#1F5C3A" fw={600}>Posición saludable</Text>
                                        </>
                                    )}
                                </Group>
                            </Stack>
                            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#F5F3EE', color: summary?.projectedBalance && summary.projectedBalance < 0 ? '#C0392B' : '#1F5C3A' }}>
                                <IconTrendingUp size={20} stroke={2} />
                            </ThemeIcon>
                        </Group>
                    </Card>
                </motion.div>
            </SimpleGrid>

            {/* Formulario de Captura */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                style={{ marginBottom: '24px' }}
            >
                <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                    <Group justify="space-between" mb="lg">
                        <Group gap="sm">
                            <IconBuildingBank size={18} color="#1F5C3A" />
                            <Stack gap={0}>
                                <Text size="sm" fw={700} c="#3A3A34">Captura de Saldos</Text>
                                <Text size="xs" c="dimmed">Las dos únicas capturas de esta pantalla</Text>
                            </Stack>
                        </Group>
                        <Badge variant="light" color="teal" radius="sm">
                            <Group gap={4}>
                                <IconClock size={12} />
                                Última actualización: {exchangeRate?.date ? new Date(exchangeRate.date).toLocaleString() : 'Nunca'}
                            </Group>
                        </Badge>
                    </Group>

                    <Divider mb="lg" />

                    <Grid>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <NumberInput
                                label="Saldo BBVA DV al corte"
                                size="xs"
                                value={bbvaSaldo ? parseFloat(bbvaSaldo.replace(/,/g, '')) : undefined}
                                onChange={(value) => setBbvaSaldo(value ? value.toLocaleString() : '')}
                                styles={{
                                    label: { fontWeight: 600, fontSize: '12px' },
                                    input: { fontWeight: 700, color: '#1F5C3A', backgroundColor: '#FFFDEB' }
                                }}
                                leftSection={<IconCreditCard size={14} color="#9A968A" />}
                                thousandSeparator
                                min={0}
                                placeholder="Ej: 1214300"
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <NumberInput
                                label="Saldo Banorte JAV al corte"
                                size="xs"
                                value={banorteSaldo ? parseFloat(banorteSaldo.replace(/,/g, '')) : undefined}
                                onChange={(value) => setBanorteSaldo(value ? value.toLocaleString() : '')}
                                styles={{
                                    label: { fontWeight: 600, fontSize: '12px' },
                                    input: { fontWeight: 700, color: '#2A6A8A', backgroundColor: '#FFFDEB' }
                                }}
                                leftSection={<IconCash size={14} color="#9A968A" />}
                                thousandSeparator
                                min={0}
                                placeholder="Ej: 628900"
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <NumberInput
                                label="TC MXN/USD de hoy"
                                size="xs"
                                value={tcHoy ? parseFloat(tcHoy) : undefined}
                                onChange={(value) => setTcHoy(value ? value.toString() : '')}
                                styles={{
                                    label: { fontWeight: 600, fontSize: '12px' },
                                    input: { fontWeight: 700, color: '#C08412', backgroundColor: '#FFFDEB' }
                                }}
                                leftSection={<IconCurrencyDollar size={14} color="#9A968A" />}
                                min={0}
                                step={0.01}
                                precision={2}
                                placeholder="Ej: 17.50"
                            />
                        </Grid.Col>
                    </Grid>

                    <Group justify="space-between" mt="md">
                        <Button
                            size="sm"
                            style={{ backgroundColor: '#1F5C3A' }}
                            leftSection={<IconPencilCheck size={16} />}
                            onClick={handleSaveBalances}
                            loading={isSaving}
                            disabled={!bbvaSaldo && !banorteSaldo && !tcHoy}
                        >
                            Guardar Día
                        </Button>
                        <Text size="xs" c="dimmed">
                            Saldo al corte por cuenta + TC del día · 30 segundos al abrir el día
                        </Text>
                    </Group>
                </Card>
            </motion.div>

            {/* Flujo de Caja Proyectado */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{ marginBottom: '24px' }}
            >
                <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                    <Group justify="space-between" mb="lg">
                        <Group gap="sm">
                            <IconChartLine size={18} color="#1F5C3A" />
                            <Stack gap={0}>
                                <Text size="sm" fw={700} c="#3A3A34">Flujo de Caja Proyectado</Text>
                                <Text size="xs" c="dimmed">Se arma solo con CxC y CxP</Text>
                            </Stack>
                        </Group>
                        <SegmentedControl
                            size="xs"
                            value={viewPeriod}
                            onChange={setViewPeriod}
                            data={[
                                { value: '4semanas', label: '4 Semanas' },
                                { value: 'mes', label: 'Mes' },
                                { value: 'trimestre', label: 'Trimestre' },
                            ]}
                            styles={{
                                root: { backgroundColor: '#F5F3EE' },
                                indicator: { backgroundColor: '#1F5C3A' },
                                label: { fontWeight: 600 }
                            }}
                        />
                    </Group>

                    <Divider mb="lg" />

                    <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
                        <Table.Thead style={{ backgroundColor: '#FAF9F5' }}>
                            <Table.Tr style={{ borderBottom: '2px solid #E5E2D9' }}>
                                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>
                                    <Group gap="4">
                                        <IconCalendar size={14} />
                                        Periodo
                                    </Group>
                                </Table.Th>
                                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">
                                    <Group gap="4" justify="flex-end">
                                        <IconArrowUpRight size={14} color="#1F5C3A" />
                                        Entradas (CxC)
                                    </Group>
                                </Table.Th>
                                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">
                                    <Group gap="4" justify="flex-end">
                                        <IconArrowDownRight size={14} color="#C0392B" />
                                        Salidas (CxP)
                                    </Group>
                                </Table.Th>
                                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }} ta="right">Neto</Table.Th>
                                <Table.Th style={{ color: '#4A4A40', fontSize: '11px', fontWeight: 700 }}>Nota</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {projection.length > 0 ? (
                                projection.map((row, idx) => (
                                    <Table.Tr
                                        key={idx}
                                        style={{
                                            borderBottom: '1px solid #EFECE3',
                                            backgroundColor: row.isWarning ? '#FFF8E1' : 'transparent'
                                        }}
                                    >
                                        <Table.Td fw={700} c={row.isWarning ? '#C08412' : '#3A3A34'}>
                                            {row.period}
                                        </Table.Td>
                                        <Table.Td ta="right" fw={600} c="#1F5C3A">
                                            ${(row.inflows / 1000).toFixed(0)}K
                                        </Table.Td>
                                        <Table.Td ta="right" fw={600} c="#C0392B">
                                            ${(row.outflows / 1000).toFixed(0)}K
                                        </Table.Td>
                                        <Table.Td ta="right" fw={700} c={row.net >= 0 ? '#1F5C3A' : '#C0392B'}>
                                            ${(row.net / 1000).toFixed(0)}K
                                        </Table.Td>
                                        <Table.Td c="dimmed">
                                            {row.note}
                                            {row.isWarning && (
                                                <Badge color="red" variant="light" size="xs" ml="xs">
                                                    ⚠ Atención
                                                </Badge>
                                            )}
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={5} ta="center" py="xl">
                                        <Text size="sm" c="dimmed">No hay datos de proyección</Text>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>

                    <Divider my="md" />

                    <Group justify="space-between">
                        <Group gap="md">
                            <Group gap={4}>
                                <Box style={{ width: 12, height: 12, backgroundColor: '#1F5C3A', borderRadius: 2 }} />
                                <Text size="xs" c="dimmed">Entradas (CxC)</Text>
                            </Group>
                            <Group gap={4}>
                                <Box style={{ width: 12, height: 12, backgroundColor: '#C0392B', borderRadius: 2 }} />
                                <Text size="xs" c="dimmed">Salidas (CxP)</Text>
                            </Group>
                        </Group>
                        <Text size="xs" c="dimmed">
                            Entradas = CxC por vencimiento · Salidas = CxP por vencimiento + nómina semanal · Cero captura
                        </Text>
                    </Group>
                </Card>
            </motion.div>

            {/* Resumen de Posición */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
            >
                <Card p="lg" radius="lg" withBorder style={{ borderColor: '#E8E5DC', backgroundColor: '#FFFFFF' }}>
                    <Group gap="sm" mb="lg">
                        <IconTrendingUp size={18} color="#1F5C3A" />
                        <Stack gap={0}>
                            <Text size="sm" fw={700} c="#3A3A34">Resumen de Posición</Text>
                            <Text size="xs" c="dimmed">Estado actual y proyección</Text>
                        </Stack>
                    </Group>

                    <Divider mb="lg" />

                    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                        <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                            <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Saldo Disponible
                            </Text>
                            <Text size="xl" fw={800} c="#1F5C3A">${totalSaldo.toLocaleString()}</Text>
                            <Progress
                                value={summary?.liquidityScore || 66}
                                color={summary?.liquidityScore && summary.liquidityScore > 50 ? '#1F5C3A' : '#C08412'}
                                size="sm"
                                radius="xl"
                                mt="xs"
                            />
                            <Text size="xs" c="dimmed" mt={4}>
                                {summary?.liquidityScore || 66}% del presupuesto disponible
                            </Text>
                        </Card>

                        <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                            <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Próximos Vencimientos
                            </Text>
                            <Text size="xl" fw={800} c="#C0392B">
                                ${summary?.nextWeekOutflows?.toLocaleString() || '0'}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {summary?.upcomingPayments?.length || 0} facturas por pagar
                            </Text>
                            <Group gap={4} mt="xs">
                                {summary?.upcomingPayments?.slice(0, 2).map((p, idx) => (
                                    <Badge key={idx} size="xs" color="red" variant="light">
                                        {p.supplier}: ${p.amount.toLocaleString()}
                                    </Badge>
                                ))}
                                {summary?.upcomingPayments && summary.upcomingPayments.length > 2 && (
                                    <Badge size="xs" color="gray" variant="light">
                                        +{summary.upcomingPayments.length - 2} más
                                    </Badge>
                                )}
                            </Group>
                        </Card>

                        <Card p="md" radius="md" style={{ backgroundColor: '#FAF9F5', border: '1px solid #E8E5DC' }}>
                            <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Proyección a 30 días
                            </Text>
                            <Text size="xl" fw={800} c={summary?.projectedBalance && summary.projectedBalance < 0 ? '#C0392B' : '#1F5C3A'}>
                                ${summary?.projectedBalance?.toLocaleString() || '0'}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {summary?.projectedBalance && summary.projectedBalance < 0 ? 'Déficit proyectado' : 'Posición positiva'}
                            </Text>
                            <Group gap={4} mt="xs">
                                <ThemeIcon size="sm" radius="xl" color={summary?.projectedBalance && summary.projectedBalance < 0 ? 'red' : 'teal'} variant="light">
                                    {summary?.projectedBalance && summary.projectedBalance < 0 ? (
                                        <IconAlertCircle size={14} />
                                    ) : (
                                        <IconCheck size={14} />
                                    )}
                                </ThemeIcon>
                                <Text size="xs" c="dimmed">
                                    {summary?.projectedBalance && summary.projectedBalance < 0
                                        ? 'Requiere gestión de flujo'
                                        : 'Flujo saludable'}
                                </Text>
                            </Group>
                        </Card>
                    </SimpleGrid>
                </Card>
            </motion.div>
        </Box>
    );
}

export default GrowerBanksAndCashflow;