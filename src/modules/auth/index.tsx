// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Stack, 
  Paper, 
  Group, 
  Title, 
  Text, 
  ThemeIcon, 
  Grid, 
  Card, 
  LoadingOverlay, 
  Box,
  Badge,
  Divider
} from '@mantine/core';
import { 
  IconPlant2, 
  IconTractor, 
  IconLeaf, 
  IconShield,
  IconCalendar,
  IconChartBar,
  IconUsers,
  IconBuildingWarehouse
} from '@tabler/icons-react';
import { useLogin } from './hooks/useLogin';
import { LoginForm } from './components/LoginForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { authBannerStyles, authSidePanelStyles } from './styles/auth.styles';

type PageType = 'login' | 'forgot' | 'reset';

export const LoginPage = () => {
  const [page, setPage] = useState<PageType>('login');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const { isLoading: isLoginLoading } = useLogin();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
      setPage('reset');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('produce_first_token');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <Box style={{ minHeight: '100vh', background: '#F4F1EA' }}>
      <Container size="lg" py="xl">
        <Stack gap="xl">

          {/* ===== BANNER ===== */}
          <Paper
            p="xl"
            radius="lg"
            style={authBannerStyles}
          >
            <Box
              style={{
                position: 'absolute',
                top: -60,
                right: -40,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
              }}
            />
            <Box
              style={{
                position: 'absolute',
                bottom: -80,
                left: '40%',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.02)',
              }}
            />
            
            <Group justify="space-between" align="center" style={{ position: 'relative', zIndex: 1 }}>
              <Stack gap={4}>
                <Group gap="xs">
                  <Badge size="xs" variant="white" color="teal" radius="sm">
                    ERP Agrícola
                  </Badge>
                  <Badge size="xs" variant="light" color="gray" radius="sm" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}>
                    v1.0
                  </Badge>
                </Group>
                <Title order={1} c="white" fw={800} style={{ fontSize: '32px' }}>
                  Produce First
                </Title>
                <Text c="green.1" size="md" style={{ opacity: 0.9 }}>
                  Sistema ERP Agrícola · Gestión inteligente para el campo
                </Text>
              </Stack>
              <ThemeIcon 
                size={72} 
                radius="xl" 
                variant="light" 
                color="white" 
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.15)' }}
              >
                <IconPlant2 size={36} stroke={1.5} />
              </ThemeIcon>
            </Group>
          </Paper>

          {/* ===== FORMULARIO + PANEL LATERAL ===== */}
          <Grid columns={12}>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card
                p="xl"
                radius="lg"
                withBorder
                style={{ 
                  background: '#FFFFFF', 
                  borderColor: '#E8E5DC', 
                  position: 'relative', 
                  minHeight: '460px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
              >
                <LoadingOverlay visible={isLoginLoading} zIndex={1000} overlayProps={{ radius: 'lg', blur: 2 }} />

                {page === 'login' && <LoginForm onNavigate={(p) => setPage(p)} />}
                {page === 'forgot' && <ForgotPasswordForm onBack={() => setPage('login')} />}
                {page === 'reset' && resetToken && <ResetPasswordForm token={resetToken} onBack={() => setPage('login')} />}
              </Card>
            </Grid.Col>

            {/* ===== PANEL LATERAL ===== */}
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Paper
                p="xl"
                radius="lg"
                style={authSidePanelStyles}
              >
                <Stack gap="xl" align="center" justify="center" style={{ height: '100%', width: '100%' }}>
                  <ThemeIcon
                    size={100}
                    radius="xl"
                    variant="light"
                    color="green"
                    style={{ background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' }}
                  >
                    <IconPlant2 size={50} stroke={1.5} color="#1F5C3A" />
                  </ThemeIcon>

                  <Stack gap="md" align="center">
                    <Title order={3} ta="center" fw={700} c="#3A3A34">Produce First</Title>
                    <Text ta="center" c="dimmed" size="sm" maw={320}>
                      Plataforma integral para la gestión agrícola, desde el campo hasta la comercialización.
                    </Text>
                  </Stack>

                  <Divider style={{ width: '100%' }} />

                  <Stack gap="sm" style={{ width: '100%' }}>
                    <Group gap="sm">
                      <ThemeIcon size={34} radius="xl" variant="light" color="green" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                        <IconTractor size={18} stroke={1.5} />
                      </ThemeIcon>
                      <Stack gap={0}>
                        <Text size="sm" fw={600} c="#3A3A34">Gestión de Productores</Text>
                        <Text size="xs" c="dimmed">Control de lotes y cultivos</Text>
                      </Stack>
                    </Group>

                    <Group gap="sm">
                      <ThemeIcon size={34} radius="xl" variant="light" color="green" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                        <IconLeaf size={18} stroke={1.5} />
                      </ThemeIcon>
                      <Stack gap={0}>
                        <Text size="sm" fw={600} c="#3A3A34">Ciclos de Siembra</Text>
                        <Text size="xs" c="dimmed">Planificación y seguimiento</Text>
                      </Stack>
                    </Group>

                    <Group gap="sm">
                      <ThemeIcon size={34} radius="xl" variant="light" color="green" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                        <IconShield size={18} stroke={1.5} />
                      </ThemeIcon>
                      <Stack gap={0}>
                        <Text size="sm" fw={600} c="#3A3A34">Sincronización CONTPAQi</Text>
                        <Text size="xs" c="dimmed">Integración contable automatizada</Text>
                      </Stack>
                    </Group>

                    <Group gap="sm">
                      <ThemeIcon size={34} radius="xl" variant="light" color="green" style={{ backgroundColor: '#F5F3EE', color: '#1F5C3A' }}>
                        <IconChartBar size={18} stroke={1.5} />
                      </ThemeIcon>
                      <Stack gap={0}>
                        <Text size="sm" fw={600} c="#3A3A34">Dashboard Financiero</Text>
                        <Text size="xs" c="dimmed">Métricas y rentabilidad</Text>
                      </Stack>
                    </Group>
                  </Stack>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>

          {/* ===== FOOTER ===== */}
          <Group justify="center" py="xl">
            <Stack gap="xs" align="center">
              <Text size="sm" c="dimmed" ta="center">
                © {new Date().getFullYear()} Produce First · Todos los derechos reservados
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
};