import { AppShell, Burger, Group, Title, Text, Box, Button, Menu, ActionIcon, Avatar, Badge, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Sidebar } from '../components/Sidebar';
import { AdminClaudeChatbot } from './admin/AdminClaudeChatbot';
import { useAuth } from '../context/AuthContext';
import { 
  IconMap, 
  IconEdit, 
  IconReceiptDollar, 
  IconShoppingCart, 
  IconPlus,
  IconLogout,
  IconWorld
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { NavigationProgressBar } from './NavigationProgressBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const roleBadges: Record<string, { label: string; color: string }> = {
  admin: { label: 'ADMINISTRADOR', color: 'red' },
  grower: { label: 'GROWER / CAMPO', color: 'teal' },
  cooling: { label: 'CUARTOS FRÍOS', color: 'blue' },
  comercial: { label: 'COMERCIAL', color: 'cyan' },
  customer: { label: 'CLIENTE', color: 'indigo' },
};

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const currentRoleInfo = role ? (roleBadges[role] || { label: role.toUpperCase(), color: 'gray' }) : { label: 'INVITADO', color: 'gray' };

  // Si el usuario es un cliente externo, ofrecer layout limpio y dedicado
  if (role === 'customer') {
    return (
      <Box style={{ minHeight: '100vh', backgroundColor: '#F9F8F6' }}>
        <NavigationProgressBar />
        <Box 
          component="header" 
          style={{ 
            height: 64, 
            backgroundColor: '#FFFFFF', 
            borderBottom: '1px solid #EAE8E1',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px'
          }}
        >
          <Group justify="space-between" style={{ width: '100%' }}>
            <Group gap="xs">
              <IconWorld size={24} color="#1F5C3A" />
              <div>
                <Title order={4} c="#1F5C3A" style={{ letterSpacing: '-0.3px', fontWeight: 700 }}>
                  Produce First · Portal de Clientes
                </Title>
                <Text size="xs" c="#8A8A80">Autoservicio y Seguimiento de Embarques</Text>
              </div>
            </Group>

            <Group gap="md">
              <Group gap="xs">
                <Avatar radius="xl" size="sm" color="teal">
                  {user?.name?.substring(0, 2).toUpperCase() || 'CL'}
                </Avatar>
                <Box visibleFrom="xs">
                  <Text size="xs" fw={700} c="#3A3A34">{user?.name || 'Cliente Comercial'}</Text>
                  <Text size="10px" c="#A3A39A">{user?.email || 'cliente@producefirst.com'}</Text>
                </Box>
              </Group>
              <Button 
                variant="subtle" 
                color="red" 
                size="xs" 
                leftSection={<IconLogout size={14} />}
                onClick={() => {
                  logout();
                  navigate('/login', { replace: true });
                }}
              >
                Cerrar Sesión
              </Button>
            </Group>
          </Group>
        </Box>

        <Box style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '24px 16px' }}>
          {children}
        </Box>
      </Box>
    );
  }

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
      <NavigationProgressBar />
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
                  onClick={() => navigate('/grower/captura')}
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

            <Divider orientation="vertical" />

            {/* IDENTIFICACIÓN DE USUARIO Y ROL */}
            <Group gap="xs">
              <Avatar radius="xl" size="sm" color={currentRoleInfo.color}>
                {user?.name?.substring(0, 2).toUpperCase() || (role ? role.substring(0, 2).toUpperCase() : 'US')}
              </Avatar>
              <Box visibleFrom="xs">
                <Text size="xs" fw={700} c="#3A3A34" style={{ lineHeight: 1.1 }}>
                  {user?.name || 'Usuario Produce First'}
                </Text>
                <Badge size="xs" variant="light" color={currentRoleInfo.color} mt={2}>
                  {currentRoleInfo.label}
                </Badge>
              </Box>
            </Group>

            {/* BOTÓN CERRAR SESIÓN */}
            <Button 
              variant="subtle" 
              color="red" 
              size="xs" 
              leftSection={<IconLogout size={14} />}
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
            >
              Cerrar Sesión
            </Button>
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

      {/* ASISTENTE EJECUTIVO CLAUDE (EXCLUSIVO ADMINISTRADORES) */}
      <AdminClaudeChatbot />
    </AppShell>
  );
}