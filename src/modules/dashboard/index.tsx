import { Container, Grid, Divider, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useWelcome } from './hooks/useWelcome';

// Componentes locales con animaciones incorporadas
import { WelcomeHeader } from './components/WelcomeHeader';
import { QuickActions } from './components/QuickActions';
import { ModuleAccess } from './components/ModuleAccess';
import { TipsSection } from './components/TipsSection';
import { WelcomeFooter } from './components/WelcomeFooter';

import {
  IconRoute,
  IconReceiptDollar,
  IconShoppingCart,
  IconScale,
  IconPigMoney,
  IconBulb,
  IconSparkles,
  IconHelpCircle,
  IconEdit,
} from '@tabler/icons-react';

export default function MainDashboard() {
  const navigate = useNavigate();
  const { currentTime, getGreeting, getGreetingIcon, formatDate, formatTime } = useWelcome();

  // Acciones Rápidas Operativas (Enfoque en velocidad de captura)
  const quickActions = [
    {
      icon: IconEdit,
      label: 'Capturar Campo',
      description: 'Registra bitácoras de insumos o labores en los ranchos',
      color: 'growerGreen',
      onClick: () => navigate('/grower/capture'),
    },
    {
      icon: IconReceiptDollar,
      label: 'Registrar Gasto Core',
      description: 'Captura egresos administrativos o de insumos directos',
      color: 'firstRust',
      onClick: () => navigate('/produce-first/pf9'),
    },
    {
      icon: IconScale,
      label: 'Entrada de Báscula',
      description: 'Genera boletas de recepción de cosecha en tiempo real',
      color: 'coolingBlue',
      onClick: () => navigate('/produce-cooling/reception-scan'),
    },
    {
      icon: IconShoppingCart,
      label: 'Nueva Orden de Venta',
      description: 'Registra un pedido o contrato de comercialización',
      color: 'grape',
      onClick: () => navigate('/produce-first/pf4'),
    },
  ];

  // Cuadrícula de Módulos Core del Sistema
  const modules = [
    { icon: IconRoute, label: 'Módulo Growers', path: '/grower/dashboard', color: 'growerGreen' },
    { icon: IconScale, label: 'Recepciones Báscula', path: '/produce-cooling/reception-scan', color: 'coolingBlue' },
    { icon: IconReceiptDollar, label: 'Control de Gastos', path: '/produce-first/pf9', color: 'firstRust' },
    { icon: IconPigMoney, label: 'Anticipos Productores', path: '/produce-first/pf7', color: 'teal' },
    { icon: IconShoppingCart, label: 'Órdenes de Venta', path: '/produce-first/pf4', color: 'grape' },
  ];

  // Tips dinámicos operacionales
  const tips = [
    {
      icon: IconBulb,
      text: 'Recuerda que la ventana operativa del ciclo estacional inicia con la planeación de posturas.',
      color: 'yellow',
    },
    {
      icon: IconSparkles,
      text: 'Puedes revisar el análisis financiero del rancho ingresando a la pestaña P&L de Growers.',
      color: 'growerGreen',
    },
    {
      icon: IconHelpCircle,
      text: 'Los accesos del menú superior de Acciones Rápidas están disponibles en cualquier módulo.',
      color: 'coolingBlue',
    },
  ];

  return (
    <Container fluid p={0}>
      <Stack gap="xl">
        {/* Header con Saludo Dinámico */}
        <WelcomeHeader
          greeting={getGreeting()}
          companyName="Produce First"
          greetingIcon={getGreetingIcon()}
          currentTime={currentTime}
          formatTime={formatTime}
          formatDate={formatDate}
        />

        <Divider color="#E0DDD2" />

        {/* Bloque de Acciones Rápidas (Interactivos y con efecto Hover/Tap) */}
        <QuickActions actions={quickActions} />

        {/* Bloque Dividido: Accesos a Módulos y Tips */}
        <Grid >
          <Grid.Col span={{ base: 12, md: 8 }}>
            <ModuleAccess modules={modules} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TipsSection tips={tips} />
          </Grid.Col>
        </Grid>

        <Divider color="#E0DDD2" mt="lg" />

        {/* Footer Institucional */}
        <WelcomeFooter
          companyName="Produce First"
          onHelpClick={() => window.open('/user-manual', '_blank')}
          onSupportClick={() => window.open('#', '_blank')}
        />
      </Stack>
    </Container>
  );
}