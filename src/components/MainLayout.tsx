import { AppShell, Burger, Group, Title, Text, Box, Button, Menu, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Sidebar } from '../components/Sidebar';
import { 
  IconMap, 
  IconEdit, 
  IconReceiptDollar, 
  IconShoppingCart, 
  IconPlus 
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const navigate = useNavigate();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: desktopOpened ? 280 : 80,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: false },
      }}
      padding="md"
      styles={{
        main: { backgroundColor: '#F9F8F6', transition: 'padding-left 0.2s ease' },
        header: { backgroundColor: '#FFFFFF', borderBottom: '1px solid #EAE8E1' }
      }}
    >
      {/* HEADER */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" color="#3A3A34" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" color="#3A3A34" />
            <Title order={4} c="#1F5C3A" style={{ letterSpacing: '-0.3px', fontWeight: 700 }}>
              Produce First
            </Title>
          </Group>
          
          <Group gap="sm">
            {/* MENÚ DESPLEGABLE DE ACCIONES RÁPIDAS (QUICK ACTIONS) */}
            <Menu shadow="md" width={220} radius="md" transitionProps={{ transition: 'pop-top-right', duration: 150 }}>
              <Menu.Target>
                <Button 
                  variant="light" 
                  color="growerGreen" 
                  size="xs"
                  leftSection={<IconMap size={16} stroke={2} />}
                  rightSection={<IconPlus size={12} />}
                  styles={{
                    root: {
                      fontWeight: 600,
                      backgroundColor: '#E8EBE6',
                      color: '#1F5C3A',
                      '&:hover': { backgroundColor: '#DEE3DB' }
                    }
                  }}
                >
                  Acciones Rápidas
                </Button>
              </Menu.Target>

              <Menu.Dropdown p="xs">
                <Menu.Label fw={700} style={{ letterSpacing: '0.5px' }}>ACCIONES OPERATIVAS</Menu.Label>
                <Menu.Item 
                  leftSection={<IconEdit size={16} stroke={1.5} color="#1F5C3A" />}
                  onClick={() => navigate('/grower/capture')}
                >
                  Capturar Gasto Diario
                </Menu.Item>
                
                <Menu.Divider />
                <Menu.Label fw={700} style={{ letterSpacing: '0.5px' }}>ADMINISTRACIÓN</Menu.Label>
                <Menu.Item 
                  leftSection={<IconReceiptDollar size={16} stroke={1.5} color="#8A5A2A" />}
                  onClick={() => navigate('/expenses')}
                >
                  Registrar Gasto Core
                </Menu.Item>
                <Menu.Item 
                  leftSection={<IconShoppingCart size={16} stroke={1.5} color="#2A6A8A" />}
                  onClick={() => navigate('/sales-orders')}
                >
                  Nueva Órden de Venta
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Text size="xs" fw={600} c="#A3A39A" visibleFrom="xs" style={{ letterSpacing: '0.5px' }}>
              ERP OPERATIVO · 2026
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      {/* NAVBAR */}
      <AppShell.Navbar>
        <Sidebar isCollapsed={!desktopOpened} toggleMobile={toggleMobile} />
      </AppShell.Navbar>

      {/* CONTENIDO */}
      <AppShell.Main>
        <Box style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}