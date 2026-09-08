// src/modules/dashboard/index.tsx
import React, { useState } from 'react';
import { 
  SimpleGrid, 
  Card, 
  Text, 
  Title, 
  Group, 
  Stack, 
  Box, 
  Grid, 
  Progress, 
  Table, 
  Flex, 
  Badge,
  ThemeIcon,
  Divider,
  RingProgress,
  Paper,
  SegmentedControl,
  Button,
  Loader,
  Center,
  Alert,
  Tooltip
} from '@mantine/core';
import { 
  IconClock, 
  IconChartBar, 
  IconFilter, 
  IconCalendarStats, 
  IconTrendingUp, 
  IconCoin,
  IconReceipt,
  IconChartPie,
  IconBuildingWarehouse,
  IconCash,
  IconArrowUpRight,
  IconArrowDownRight,
  IconGauge,
  IconPlant,
  IconTruck,
  IconLeaf,
  IconTemperature,
  IconDroplet,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconRefresh,
  IconUsers,
  IconBox,
  IconPackage,
  IconBuilding,
  IconSun,
  IconCloud,
  IconCloudRain,
  IconWind
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useDashboardData } from './hooks/useDashboardData';
import { useWeather } from './hooks/useWeather';
import { useSeasonInfo } from './hooks/useSeasonInfo';

// Componentes hijos
import { DashboardKPIs } from './components/DashboardKPIs';
import { DashboardAlerts } from './components/DashboardAlerts';
import { DashboardProgress } from './components/DashboardProgress';
import { DashboardTrends } from './components/DashboardTrends';
import { DashboardCosts } from './components/DashboardCosts';
import { DashboardReturnTable } from './components/DashboardReturnTable';

export function DashboardView() {
  const [timeFilter, setTimeFilter] = useState('weekly');
  const { data, isLoading, error, refresh } = useDashboardData();
  const { weather, forecast, isLoading: weatherLoading } = useWeather();
  const { seasonInfo } = useSeasonInfo();

  // Obtener icono del clima
  const getWeatherIcon = (condition: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Despejado': <IconSun size={20} />,
      'Soleado': <IconSun size={20} />,
      'Nublado': <IconCloud size={20} />,
      'Parcialmente nublado': <IconCloud size={20} />,
      'Lluvia': <IconCloudRain size={20} />,
      'Lluvia ligera': <IconCloudRain size={20} />,
      'Tormenta': <IconCloudRain size={20} />,
      'Niebla': <IconCloud size={20} />,
      'Viento': <IconWind size={20} />,
    };
    return iconMap[condition] || <IconSun size={20} />;
  };

  if (isLoading || weatherLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader color="growerGreen" size="xl" type="dots" />
          <Text size="sm" c="dimmed">Cargando dashboard...</Text>
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
          title="Error al cargar el dashboard"
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

  const { metrics, clients, products, shipments, alerts, ytd } = data;

  return (
    <Box>
      {/* Encabezado con información real */}
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
                Dashboard · Grower
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                {seasonInfo?.season || 'Invierno 2026-2027'}
              </Badge>
              <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}>
                Semana {seasonInfo?.week || 49}
              </Badge>
            </Group>
            <Text size="28px" fw={800} style={{ fontFamily: 'var(--mantine-font-family-monospace, sans-serif)' }}>
              Panorama General
            </Text>
            <Group gap="md" mt={4}>
              <Text size="sm" style={{ opacity: 0.8 }}>
                {seasonInfo?.season || 'Invierno 2026-2027'} · Pronóstico vs Real
              </Text>
              <Text size="xs" style={{ opacity: 0.6 }}>
                {seasonInfo?.startDate || '01-nov-2026'} - {seasonInfo?.endDate || '31-may-2027'}
              </Text>
            </Group>
          </Stack>
          
          <Group gap="xl">
            {/* Clima REAL */}
            {weather && (
              <Group gap="sm">
                <ThemeIcon size="md" radius="xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                  {getWeatherIcon(weather.condition)}
                </ThemeIcon>
                <Stack gap={0}>
                  <Group gap={4} align="baseline">
                    <Text size="lg" fw={700}>{weather.temp}°C</Text>
                    <Text size="xs" style={{ opacity: 0.7 }}>{weather.condition}</Text>
                  </Group>
                  <Text size="xs" style={{ opacity: 0.7 }}>Sensación: {weather.feelsLike}°C</Text>
                </Stack>
                <Divider orientation="vertical" color="rgba(255,255,255,0.2)" />
                <Stack gap={0}>
                  <Group gap={4}>
                    <IconDroplet size={14} style={{ opacity: 0.7 }} />
                    <Text size="sm" fw={600}>{weather.humidity}%</Text>
                  </Group>
                  <Text size="xs" style={{ opacity: 0.7 }}>Humedad</Text>
                </Stack>
                <Divider orientation="vertical" color="rgba(255,255,255,0.2)" />
                <Stack gap={0}>
                  <Group gap={4}>
                    <IconWind size={14} style={{ opacity: 0.7 }} />
                    <Text size="sm" fw={600}>{weather.wind} km/h</Text>
                  </Group>
                  <Text size="xs" style={{ opacity: 0.7 }}>Viento</Text>
                </Stack>
                <Divider orientation="vertical" color="rgba(255,255,255,0.2)" />
                <Stack gap={0}>
                  <Text size="xs" style={{ opacity: 0.7 }}>{weather.location}</Text>
                  <Text size="xs" style={{ opacity: 0.5 }}>☀️ {weather.sunrise} · 🌅 {weather.sunset}</Text>
                </Stack>
              </Group>
            )}

            {/* Ring de rendimiento */}
            <RingProgress
              size={80}
              thickness={8}
              sections={[{ value: metrics ? (metrics.boxesYtd / (metrics.totalBoxesHarvested || 1)) * 100 : 75, color: '#FFFFFF' }]}
              label={
                <Stack align="center" gap={0}>
                  <Text size="xs" fw={700} ta="center" style={{ color: '#FFFFFF' }}>
                    {metrics ? Math.round((metrics.boxesYtd / (metrics.totalBoxesHarvested || 1)) * 100) : 75}%
                  </Text>
                  <Text size="8px" style={{ opacity: 0.6 }}>ejecutado</Text>
                </Stack>
              }
            />
          </Group>
        </Group>

        {/* Pronóstico rápido */}
        {forecast && forecast.length > 0 && (
          <Group gap="md" mt="md" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
            <Text size="xs" style={{ opacity: 0.6 }}>Pronóstico:</Text>
            {forecast.slice(0, 3).map((day, idx) => (
              <Group key={idx} gap={4}>
                <Text size="xs" style={{ opacity: 0.7 }}>{day.date.split('/')[0]}/</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>{day.icon}</Text>
                <Text size="xs" style={{ opacity: 0.7 }}>{day.tempMax}°/{day.tempMin}°</Text>
                {idx < 2 && <Divider orientation="vertical" color="rgba(255,255,255,0.1)" size={1} />}
              </Group>
            ))}
          </Group>
        )}
      </Paper>

      {/* Filtros rápidos */}
      <Group justify="space-between" mb="xl">
        <Group gap="sm">
          <ThemeIcon size="sm" radius="md" color="teal" variant="light">
            <IconFilter size={14} />
          </ThemeIcon>
          <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Periodo:
          </Text>
          <Paper p={4} withBorder style={{ borderColor: '#E8E5DC', borderRadius: 8, backgroundColor: '#F5F3EE' }}>
            <Group gap={4}>
              {[
                { value: 'daily', label: 'Hoy' },
                { value: 'weekly', label: 'Semana' },
                { value: 'monthly', label: 'Mes' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeFilter(option.value)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: timeFilter === option.value ? '#1F5C3A' : 'transparent',
                    color: timeFilter === option.value ? '#FFFFFF' : '#9A968A',
                    fontWeight: 600,
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </Group>
          </Paper>
        </Group>
        
        <Group gap="xs">
          <Badge variant="light" color="teal" radius="sm">
            <Group gap={4}>
              <IconClock size={12} />
              Actualizado: {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
            </Group>
          </Badge>
          <Button 
            size="xs" 
            variant="subtle" 
            color="gray" 
            leftSection={<IconRefresh size={14} />}
            onClick={refresh}
          >
            Actualizar
          </Button>
        </Group>
      </Group>

      {/* KPIs */}
      <DashboardKPIs metrics={metrics} />

      {/* Alertas */}
      <DashboardAlerts alerts={alerts} />

      {/* Progreso de temporada */}
      <DashboardProgress metrics={metrics} seasonInfo={seasonInfo} />

      {/* Tendencias */}
      <DashboardTrends metrics={metrics} />

      {/* Costos */}
      <DashboardCosts metrics={metrics} />

      {/* Tabla de retorno */}
      <DashboardReturnTable />
    </Box>
  );
}

// Exportamos el componente como default para lazy loading
export default DashboardView;