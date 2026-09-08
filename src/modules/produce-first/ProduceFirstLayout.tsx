// src/modules/produce-first/ProduceFirstLayout.tsx

import React, { useState, useEffect } from 'react';
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
  Divider,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconSnowflake,
  IconLeaf,
  IconDashboard,
  IconChartBar,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProduceFirstLayoutProps {
  children?: React.ReactNode;
}

export function ProduceFirstLayout({ children }: ProduceFirstLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar si el sidebar está colapsado
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
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

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard PF',
      icon: IconDashboard,
      path: '/produce-first',
      color: '#1A4B8C',
    },
    {
      id: 'grower',
      label: 'Grower',
      icon: IconLeaf,
      path: '/produce-first/grower/dashboard',
      color: '#1F5C3A',
    },
    {
      id: 'cooling',
      label: 'Produce Cooling',
      icon: IconSnowflake,
      path: '/produce-first/cooling/reception-scan',
      color: '#1864AB',
    },
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/produce-first' || path === '/produce-first/') return 'dashboard';
    if (path.includes('/grower')) return 'grower';
    if (path.includes('/cooling')) return 'cooling';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string | null>(getActiveTab());

  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
      const tab = tabs.find(t => t.id === value);
      if (tab) {
        navigate(tab.path);
      }
    }
  };

  const headerZIndex = isSidebarCollapsed ? 90 : 95;
  const tabsZIndex = isSidebarCollapsed ? 85 : 90;

  return (
    <Box bg="#F4F5F0" style={{ minHeight: '100vh', paddingTop: 0 }}>
      {/* Header del módulo */}
      <Paper 
        p="md" 
        radius={0} 
        style={{ 
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E8E5DC',
          position: 'sticky',
          top: 60,
          zIndex: headerZIndex,
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
                <IconBuildingStore size={20} />
              </ThemeIcon>
              <Stack gap={0}>
                <Group gap="xs" align="center">
                  <Text size="lg" fw={700} c="#1A3A5C">
                    Produce First
                  </Text>
                  <Badge size="xs" color="blue" variant="light" radius="sm">
                    Super Panel
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed">
                  Grower · Produce Cooling · Integración de Negocios
                </Text>
              </Stack>
            </Group>

            <Group gap="xs">
              <Badge variant="light" color="green" radius="sm">
                <Group gap={4}>
                  <IconLeaf size={12} />
                  Grower
                </Group>
              </Badge>
              <Badge variant="light" color="blue" radius="sm">
                <Group gap={4}>
                  <IconSnowflake size={12} />
                  Cooling
                </Group>
              </Badge>
            </Group>
          </Group>
        </Container>
      </Paper>

      {/* Tabs de navegación */}
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
              top: 120,
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
          <Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Tab 
                key={tab.id} 
                value={tab.id}
                leftSection={<tab.icon size={16} />}
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {tabs.map((tab) => (
            <Tabs.Panel key={tab.id} value={tab.id} pt="md">
              {children}
            </Tabs.Panel>
          ))}
        </Tabs>
      </Container>
    </Box>
  );
}