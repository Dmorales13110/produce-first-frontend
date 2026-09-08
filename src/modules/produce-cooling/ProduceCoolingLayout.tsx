// src/modules/produce-cooling/ProduceCoolingLayout.tsx

import React, { useState, useEffect, Suspense } from 'react';
import { SubmoduleLoader } from '../../components/SubmoduleLoader';
import {
  Box,
  Container,
  Paper,
  Group,
  Text,
  Badge,
  Stack,
  Tabs,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core';
import {
  IconScan,
  IconBox,
  IconTemperature,
  IconChartBar,
  IconSettings,
  IconTruck,
  IconClipboardCheck,
  IconSnowflake,
  IconCube,
  IconTruckDelivery,
  IconClipboardList,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReceptionScanView } from './components/ReceptionScan';
import { TrazabilidadInventarioView } from './TrazabilidadInventario';
import { BitacorasVentasServiciosView } from './BitacorasVentasServicios';
import { OrdenesEmbarqueView } from './OrdenesEmbarque';

interface ProduceCoolingLayoutProps {
  children?: React.ReactNode;
}

export function ProduceCoolingLayout({ children }: ProduceCoolingLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useMantineTheme();
  
  const getActiveTab = () => {
    const path = location.pathname.split('/').pop() || 'reception-scan';
    return path;
  };

  const [activeTab, setActiveTab] = useState<string | null>(getActiveTab());

  // Detectar si el sidebar está colapsado (para ajustar z-index)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Observar cambios en el sidebar
    const observer = new MutationObserver(() => {
      const sidebar = document.querySelector('.mantine-AppShell-navbar');
      if (sidebar) {
        const isCollapsed = sidebar.getAttribute('data-collapsed') === 'true' || 
                           sidebar.classList.contains('mantine-visible-from-sm');
        setIsSidebarCollapsed(isCollapsed);
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const modules = [
    {
      id: 'reception-scan',
      label: 'Escaneo de Recepción',
      icon: IconScan,
      color: '#1A4B8C',
      path: '/produce-cooling/reception-scan',
    },
    {
      id: 'trazabilidad-inventario',
      label: 'Trazabilidad e Inventario',
      icon: IconCube,
      color: '#2D6BAE',
      path: '/produce-cooling/trazabilidad-inventario',
    },
    {
      id: 'bitacoras-ventas-servicios',
      label: 'Bitácoras y Ventas',
      icon: IconClipboardList,
      color: '#7C3AED',
      path: '/produce-cooling/bitacoras-ventas-servicios',
    },
    {
      id: 'ordenes-embarque',
      label: 'Órdenes de Embarque',
      icon: IconTruckDelivery,
      color: '#1A4B8C',
      path: '/produce-cooling/ordenes-embarque',
    },
    {
      id: 'cooling-management',
      label: 'Gestión de Enfriamiento',
      icon: IconTemperature,
      color: '#2563EB',
      path: '/produce-cooling/cooling-management',
    },
    {
      id: 'inventory-pt',
      label: 'Inventario PT',
      icon: IconBox,
      color: '#7C3AED',
      path: '/produce-cooling/inventory-pt',
    },
    {
      id: 'quality-control',
      label: 'Control de Calidad',
      icon: IconClipboardCheck,
      color: '#2D8F5E',
      path: '/produce-cooling/quality-control',
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: IconChartBar,
      color: '#D97706',
      path: '/produce-cooling/reports',
    },
  ];

  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
      const module = modules.find(m => m.id === value);
      if (module) {
        navigate(module.path);
      }
    }
  };

  // Renderizar contenido según la ruta
  const renderContent = () => {
    const path = location.pathname.split('/').pop() || 'reception-scan';
    
    if (children) return children;
    
    switch (path) {
      case 'reception-scan':
        return <ReceptionScanView />;
      case 'trazabilidad-inventario':
        return <TrazabilidadInventarioView />;
      case 'bitacoras-ventas-servicios':
        return <BitacorasVentasServiciosView />;
      case 'ordenes-embarque':
        return <OrdenesEmbarqueView />;
      default:
        return <ReceptionScanView />;
    }
  };

  // Ajustar z-index basado en el estado del sidebar
  const headerZIndex = isSidebarCollapsed ? 90 : 95;
  const tabsZIndex = isSidebarCollapsed ? 85 : 90;

  return (
    <Box bg="#F4F5F0" style={{ minHeight: '100vh', paddingTop: 0 }}>
      {/* Header del módulo - AHORA CON Z-INDEX CORRECTO */}
      <Paper 
        p="md" 
        radius={0} 
        style={{ 
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E8E5DC',
          position: 'sticky',
          top: 60, // Altura del header principal
          zIndex: headerZIndex, // Z-index ajustado dinámicamente
          marginTop: 0,
        }}
      >
        <Container fluid>
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <ThemeIcon 
                size="md" 
                radius="lg" 
                style={{ backgroundColor: '#F0F4FF', color: '#1A4B8C' }}
              >
                <IconSnowflake size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Group gap="xs" align="center">
                  <Text size="lg" fw={700} c="#1A3A5C">
                    Produce Cooling
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    v1.0
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed">
                  Cadena de frío · Recepción · Inventario · Calidad
                </Text>
              </Stack>
            </Group>

            <Group gap="xs">
              <Badge variant="light" color="blue" radius="sm">
                <Group gap={4}>
                  <IconTruck size={12} />
                  Activos: 3 camiones
                </Group>
              </Badge>
              <Badge variant="light" color="green" radius="sm">
                <Group gap={4}>
                  <IconBox size={12} />
                  PT: 1,284 cajas
                </Group>
              </Badge>
            </Group>
          </Group>
        </Container>
      </Paper>

      {/* Tabs de navegación - CON Z-INDEX CORRECTO */}
      <Container fluid mt="md">
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          styles={{
            tabsList: {
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '4px',
              border: '1px solid #E8E5DC',
              position: 'sticky',
              top: 120, // Altura del header principal + header del módulo
              zIndex: tabsZIndex,
            },
            tab: {
              fontWeight: 600,
              fontSize: '13px',
              padding: '8px 16px',
              borderRadius: '8px',
              '&[data-active]': {
                backgroundColor: '#F0F4FF',
                color: '#1A4B8C',
              },
            },
          }}
        >

          {modules.map((module) => (
            <Tabs.Panel key={module.id} value={module.id} pt="md">
              <Suspense fallback={<SubmoduleLoader message="Cargando datos de Produce Cooling..." />}>
                {renderContent()}
              </Suspense>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Container>
    </Box>
  );
}