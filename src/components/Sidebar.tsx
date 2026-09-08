// src/components/Sidebar.tsx

import { Box, NavLink, Stack, Text, ScrollArea, Tooltip, Divider } from '@mantine/core';
import {
  IconRoute,
  IconLayoutDashboard,
  IconCalendar,
  IconEdit,
  IconReportMoney,
  IconClipboardList,
  IconBook,
  IconSeeding,
  IconLayersIntersect,
  IconLabel,
  IconNotes,
  IconChartBar,
  IconTicket,
  IconStack,
  IconMoneybag,
  IconCreditCardPay,
  IconCreditCardHand,
  IconCashBanknote,
  IconDatabase,
  IconList,
  IconDashboard,
  IconMoneybagPlus,
  IconAnalyze,
  IconCalculator,
  IconCommand,
  IconUser,
  IconListCheck,
  IconCircuitMotor,
  IconCheckupList,
  IconSnowflake,
  IconScan,
  IconTruckDelivery,
  IconSettings,
  IconChartPie,
  IconBuildingStore,
  IconLeaf,
  IconShoppingCart,
  IconPlant,
  IconTruck,
  IconPackage,
  IconUsers,
  IconReceipt,
  IconCurrencyDollar,
  IconFileInvoice,
  IconBuildingBank,
  IconUserCheck,
  IconWorld,
  IconMapPin,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  toggleMobile: () => void;
}

// ============================================================
// CONFIGURACIÓN DE MÓDULOS POR ROL
// ============================================================

const modulesByRole = {
  admin: {
    pf: ['GRP1', 'PF1', 'PF2', 'PF3', 'PF4', 'PF5', 'PF6', 'PFLQC', 'PFOC', 'PFMAT', 'PF7', 'PF8', 'PF10', 'PF9', 'PFBAN', 'PFNOM', 'PFCONT', 'PFREG', 'PFDASH', 'PFUSR', 'PFW1', 'PFW2', 'R07'],
    showGrower: true,
    showCooling: true,
  },
  comercial: {
    pf: ['GRP1', 'PF1', 'PF2', 'PF3', 'PF4', 'PF5', 'PF6', 'PFLQC', 'PFOC', 'PFMAT', 'PF7', 'PF8', 'PF10', 'PF9', 'PFBAN', 'PFNOM', 'PFCONT', 'PFREG', 'PFDASH', 'PFW1'],
    showGrower: false,
    showCooling: false,
  },
  grower: {
    pf: ['GRP1', 'PF1', 'PF2', 'PF3', 'PF7', 'PF8', 'PFW2', 'R07'],
    showGrower: true,
    showCooling: false,
  },
  cooling: {
    pf: ['GRP1', 'PF1', 'PF4', 'PF5', 'PF6', 'PFLQC', 'PFOC', 'PFMAT', 'PF9', 'PFW1'],
    showGrower: false,
    showCooling: true,
  },
};

export function Sidebar({ isCollapsed, toggleMobile }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  // Estados de apertura de secciones
  const [growerOpened, setGrowerOpened] = useState(true);
  const [coolingOpened, setCoolingOpened] = useState(true);
  const [produceFirstOpened, setProduceFirstOpened] = useState(true);

  // Obtener configuración según el rol
  const roleConfig = role ? modulesByRole[role as keyof typeof modulesByRole] : modulesByRole.admin;
  const allowedPfModules = roleConfig?.pf || [];
  const showGrower = roleConfig?.showGrower || false;
  const showCooling = roleConfig?.showCooling || false;

  const colors = {
    textMain: '#3A3A34',
    textMuted: '#A3A39A',
    hoverBg: '#F3F1E9',
    activeBg: '#E8EBE6',
    activeText: '#1F5C3A',
    coolingText: '#1864AB',
    coolingBg: '#E7F5FF',
    coolingActiveBg: '#D0EBFF',
    pfText: '#1A4B8C',
    pfBg: '#F0F7FF',
    pfActiveBg: '#D0EBFF',
    growerText: '#1F5C3A',
    growerBg: '#ECFDF5',
    growerActiveBg: '#D1FAE5',
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) toggleMobile();
  };

  const itemStyles = (isActive: boolean, isCooling = false, isGrower = false) => ({
    root: {
      borderRadius: '8px',
      fontWeight: isActive ? 600 : 500,
      color: isActive
        ? isCooling
          ? colors.coolingText
          : isGrower
          ? colors.growerText
          : colors.pfText
        : colors.textMain,
      backgroundColor: isActive
        ? isCooling
          ? colors.coolingActiveBg
          : isGrower
          ? colors.growerActiveBg
          : colors.pfActiveBg
        : 'transparent',
      padding: isCollapsed ? '10px 0' : '10px 12px',
      display: 'flex',
      justifyContent: isCollapsed ? 'center' : 'flex-start',
    },
    inner: { justifyContent: isCollapsed ? 'center' : 'flex-start' },
    body: { display: isCollapsed ? 'none' : 'block' },
  });

  const isProduceFirstActive = location.pathname.includes('/produce-first');
  const isGrowerActive = location.pathname.includes('/grower') && !location.pathname.includes('/produce-first');
  const isCoolingActive = location.pathname.includes('/produce-cooling') && !location.pathname.includes('/produce-first');

  const isPfRouteActive = (path: string) => {
    return location.pathname === `/produce-first${path}`;
  };

  // Verificar si un módulo PF está permitido
  const isPfModuleAllowed = (moduleId: string) => {
    return allowedPfModules.includes(moduleId);
  };

  return (
    <Box h="100%" p="xs" style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      <Box component={ScrollArea} flex={1} mx="-xs" px="xs">
        <Stack gap="6px">

          {/* ============================================================
              MÓDULO PRODUCE FIRST - SUPER PANEL
          ============================================================ */}
          {isCollapsed ? (
            <Tooltip label="Produce First" position="right" withArrow>
              <NavLink
                leftSection={<IconBuildingStore size={20} stroke={1.5} color={colors.pfText} />}
                active={isProduceFirstActive}
                onClick={() => handleNavigation('/produce-first')}
                styles={{
                  root: {
                    borderRadius: '8px',
                    fontWeight: 700,
                    color: colors.pfText,
                    backgroundColor: isProduceFirstActive ? colors.pfActiveBg : 'transparent',
                    padding: '10px 0',
                    display: 'flex',
                    justifyContent: 'center',
                    border: isProduceFirstActive ? '1px solid #93C5FD' : '1px solid transparent',
                  },
                }}
              />
            </Tooltip>
          ) : (
            <NavLink
              label="PRODUCE FIRST"
              leftSection={<IconBuildingStore size={20} stroke={1.5} color={colors.pfText} />}
              opened={produceFirstOpened}
              onChange={setProduceFirstOpened}
              styles={{
                root: {
                  borderRadius: '8px',
                  fontWeight: 700,
                  color: colors.pfText,
                  backgroundColor: produceFirstOpened ? colors.pfBg : 'transparent',
                  padding: '10px 12px',
                  border: '1px solid #D0EBFF',
                  marginBottom: '4px',
                },
              }}
            >
              {/* GRP1 · Dashboard - SIEMPRE visible para todos */}
              <Text size="10px" fw={700} c={colors.textMuted} pl="sm" my="xs" style={{ letterSpacing: '0.5px' }}>
                GRP1 · DASHBOARD
              </Text>
              <NavLink
                label="Dashboard PF"
                leftSection={<IconDashboard size={16} stroke={1.5} />}
                active={location.pathname === '/produce-first'}
                onClick={() => handleNavigation('/produce-first')}
                styles={itemStyles(location.pathname === '/produce-first')}
                pl="md"
              />

              <Divider my="xs" />

              {/* PLANEACIÓN COMERCIAL - SOLO módulos permitidos */}
              {(isPfModuleAllowed('PF1') || isPfModuleAllowed('PF2') || isPfModuleAllowed('PF3')) && (
                <>
                  <Text size="10px" fw={700} c={colors.textMuted} pl="sm" my="xs" style={{ letterSpacing: '0.5px' }}>
                    PLANEACIÓN COMERCIAL
                  </Text>
                  {isPfModuleAllowed('PF1') && (
                    <NavLink
                      label="PF1 · Catálogos"
                      leftSection={<IconShoppingCart size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pf1')}
                      onClick={() => handleNavigation('/produce-first/pf1')}
                      styles={itemStyles(isPfRouteActive('/pf1'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PF2') && (
                    <NavLink
                      label="PF2 · Programa Ventas vs Siembra"
                      leftSection={<IconCalendar size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pf2')}
                      onClick={() => handleNavigation('/produce-first/pf2')}
                      styles={itemStyles(isPfRouteActive('/pf2'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PF3') && (
                    <NavLink
                      label="PF3 · Pronóstico Semanal"
                      leftSection={<IconChartBar size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pf3')}
                      onClick={() => handleNavigation('/produce-first/pf3')}
                      styles={itemStyles(isPfRouteActive('/pf3'))}
                      pl="xl"
                    />
                  )}
                </>
              )}

              {/* VENTA Y EMBARQUE - SOLO módulos permitidos */}
              {(isPfModuleAllowed('PF4') || isPfModuleAllowed('PF5') || isPfModuleAllowed('PF6') || isPfModuleAllowed('PFLQC')) && (
                <>
                  <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                    VENTA Y EMBARQUE
                  </Text>
                  {isPfModuleAllowed('PF4') && (
                    <NavLink
                      label="PF4 · Planificador de Carga"
                      leftSection={<IconTruck size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pf4')}
                      onClick={() => handleNavigation('/produce-first/pf4')}
                      styles={itemStyles(isPfRouteActive('/pf4'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PF5') && (
                    <NavLink
                      label="PF5 · Proforma · Instrucción Embarque"
                      leftSection={<IconFileInvoice size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pf5')}
                      onClick={() => handleNavigation('/produce-first/pf5')}
                      styles={itemStyles(isPfRouteActive('/pf5'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PF6') && (
                    <NavLink
                      label="PF6 · CxC de Clientes"
                      leftSection={<IconCreditCardHand size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pf6')}
                      onClick={() => handleNavigation('/produce-first/pf6')}
                      styles={itemStyles(isPfRouteActive('/pf6'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PFLQC') && (
                    <NavLink
                      label="PFLQC · Liquidaciones y Quejas"
                      leftSection={<IconReceipt size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pflqc')}
                      onClick={() => handleNavigation('/produce-first/pflqc')}
                      styles={itemStyles(isPfRouteActive('/pflqc'))}
                      pl="xl"
                    />
                  )}
                </>
              )}

              {/* COMPRAS Y MATERIAL - SOLO módulos permitidos */}
              {(isPfModuleAllowed('PFOC') || isPfModuleAllowed('PFMAT')) && (
                <>
                  <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                    COMPRAS Y MATERIAL
                  </Text>
                  {isPfModuleAllowed('PFOC') && (
                    <NavLink
                      label="PFOC · Órdenes de Compra PF"
                      leftSection={<IconClipboardList size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pfoc')}
                      onClick={() => handleNavigation('/produce-first/pfoc')}
                      styles={itemStyles(isPfRouteActive('/pfoc'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PFMAT') && (
                    <NavLink
                      label="PFMAT · Material de Empaque"
                      leftSection={<IconPackage size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pfmat')}
                      onClick={() => handleNavigation('/produce-first/pfmat')}
                      styles={itemStyles(isPfRouteActive('/pfmat'))}
                      pl="xl"
                    />
                  )}
                </>
              )}

              {/* PRODUCTORES - SOLO módulos permitidos */}
              {(isPfModuleAllowed('PF7') || isPfModuleAllowed('PF8')) && (
                <>
                  <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                    PRODUCTORES
                  </Text>
                  {isPfModuleAllowed('PF7') && (
                    <NavLink
                      label="PF7 · Cuenta Corriente Productor"
                      leftSection={<IconUsers size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pf7')}
                      onClick={() => handleNavigation('/produce-first/pf7')}
                      styles={itemStyles(isPfRouteActive('/pf7'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PF8') && (
                    <NavLink
                      label="PF8 · Motor de Liquidaciones"
                      leftSection={<IconCalculator size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pf8')}
                      onClick={() => handleNavigation('/produce-first/pf8')}
                      styles={itemStyles(isPfRouteActive('/pf8'))}
                      pl="xl"
                    />
                  )}
                </>
              )}

              {/* DINERO PF - SOLO módulos permitidos */}
              {(isPfModuleAllowed('PF10') || isPfModuleAllowed('PF9') || isPfModuleAllowed('PFBAN') || isPfModuleAllowed('PFNOM') || isPfModuleAllowed('PFCONT')) && (
                <>
                  <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                    DINERO PF
                  </Text>
                  {isPfModuleAllowed('PF10') && (
                    <NavLink
                      label="PF10 · Presupuesto y P&L"
                      leftSection={<IconMoneybag size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pf10')}
                      onClick={() => handleNavigation('/produce-first/pf10')}
                      styles={itemStyles(isPfRouteActive('/pf10'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PF9') && (
                    <NavLink
                      label="PF9 · CxP de PF"
                      leftSection={<IconCreditCardPay size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pf9')}
                      onClick={() => handleNavigation('/produce-first/pf9')}
                      styles={itemStyles(isPfRouteActive('/pf9'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PFBAN') && (
                    <NavLink
                      label="PFBAN · Bancos PF"
                      leftSection={<IconBuildingBank size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pfban')}
                      onClick={() => handleNavigation('/produce-first/pfban')}
                      styles={itemStyles(isPfRouteActive('/pfban'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PFNOM') && (
                    <NavLink
                      label="PFNOM · Nómina y Gastos"
                      leftSection={<IconList size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pfnom')}
                      onClick={() => handleNavigation('/produce-first/pfnom')}
                      styles={itemStyles(isPfRouteActive('/pfnom'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PFCONT') && (
                    <NavLink
                      label="PFCONT · Contpaqi PF"
                      leftSection={<IconDatabase size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pfcont')}
                      onClick={() => handleNavigation('/produce-first/pfcont')}
                      styles={itemStyles(isPfRouteActive('/pfcont'))}
                      pl="xl"
                    />
                  )}
                </>
              )}

              {/* RESULTADO - SOLO módulos permitidos */}
              {(isPfModuleAllowed('PFREG') || isPfModuleAllowed('PFDASH')) && (
                <>
                  <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                    RESULTADO
                  </Text>
                  {isPfModuleAllowed('PFREG') && (
                    <NavLink
                      label="PFREG · Registro Liquidaciones"
                      leftSection={<IconReportMoney size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pfreg')}
                      onClick={() => handleNavigation('/produce-first/pfreg')}
                      styles={itemStyles(isPfRouteActive('/pfreg'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PFDASH') && (
                    <NavLink
                      label="PFDASH · Dashboard PF"
                      leftSection={<IconChartPie size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pfdash')}
                      onClick={() => handleNavigation('/produce-first/pfdash')}
                      styles={itemStyles(isPfRouteActive('/pfdash'))}
                      pl="xl"
                    />
                  )}
                </>
              )}

              {/* ADMINISTRACIÓN - SOLO módulos permitidos */}
              {isPfModuleAllowed('PFUSR') && (
                <>
                  <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                    ADMINISTRACIÓN
                  </Text>
                  <NavLink
                    label="PFUSR · Usuarios y Permisos"
                    leftSection={<IconUserCheck size={16} stroke={1.5} />}
                    active={isPfRouteActive('/pfusr')}
                    onClick={() => handleNavigation('/produce-first/pfusr')}
                    styles={itemStyles(isPfRouteActive('/pfusr'))}
                    pl="xl"
                  />
                </>
              )}

              {/* PORTALES - SOLO módulos permitidos */}
              {(isPfModuleAllowed('PFW1') || isPfModuleAllowed('PFW2') || isPfModuleAllowed('R07')) && (
                <>
                  <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                    PORTALES · ACCESO EXTERNO
                  </Text>
                  {isPfModuleAllowed('PFW1') && (
                    <NavLink
                      label="PFW1 · Client Portal"
                      leftSection={<IconWorld size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pfw1')}
                      onClick={() => handleNavigation('/produce-first/pfw1')}
                      styles={itemStyles(isPfRouteActive('/pfw1'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('PFW2') && (
                    <NavLink
                      label="PFW2 · Portal del Productor"
                      leftSection={<IconPlant size={16} stroke={1.5} />}
                      active={isPfRouteActive('/pfw2')}
                      onClick={() => handleNavigation('/produce-first/pfw2')}
                      styles={itemStyles(isPfRouteActive('/pfw2'))}
                      pl="xl"
                    />
                  )}
                  {isPfModuleAllowed('R07') && (
                    <NavLink
                      label="R07 · Visitas del Agrónomo"
                      leftSection={<IconMapPin size={16} stroke={1.5} />}
                      active={isPfRouteActive('/r07')}
                      onClick={() => handleNavigation('/produce-first/r07')}
                      styles={itemStyles(isPfRouteActive('/r07'))}
                      pl="xl"
                    />
                  )}
                </>
              )}

              <Divider my="xs" />

              {/* INTEGRACIÓN CON SUBMÓDULOS - SOLO si tiene acceso */}
              {(showGrower || showCooling) && (
                <>
                  <Text size="10px" fw={700} c={colors.textMuted} pl="sm" my="xs" style={{ letterSpacing: '0.5px' }}>
                    INTEGRACIÓN
                  </Text>
                  {showGrower && (
                    <NavLink
                      label="Grower"
                      leftSection={<IconLeaf size={16} stroke={1.5} color={colors.growerText} />}
                      active={location.pathname.includes('/produce-first/grower')}
                      onClick={() => handleNavigation('/produce-first/grower/dashboard')}
                      styles={itemStyles(location.pathname.includes('/produce-first/grower'), false, true)}
                      pl="md"
                    />
                  )}
                  {showCooling && (
                    <NavLink
                      label="Produce Cooling"
                      leftSection={<IconSnowflake size={16} stroke={1.5} color={colors.coolingText} />}
                      active={location.pathname.includes('/produce-first/cooling')}
                      onClick={() => handleNavigation('/produce-first/cooling/reception-scan')}
                      styles={itemStyles(location.pathname.includes('/produce-first/cooling'), true)}
                      pl="md"
                    />
                  )}
                </>
              )}
            </NavLink>
          )}

          {/* ============================================================
              MÓDULO GROWER - Independiente (SOLO si showGrower es true)
          ============================================================ */}
          {showGrower && (
            isCollapsed ? (
              <Tooltip label="Módulo Grower" position="right" withArrow>
                <NavLink
                  leftSection={<IconRoute size={20} stroke={1.5} />}
                  active={isGrowerActive}
                  onClick={() => handleNavigation('/grower/dashboard')}
                  styles={itemStyles(isGrowerActive)}
                />
              </Tooltip>
            ) : (
              <NavLink
                label="GROWER"
                leftSection={<IconRoute size={20} stroke={1.5} />}
                opened={growerOpened}
                onChange={setGrowerOpened}
                styles={{
                  root: {
                    borderRadius: '8px',
                    fontWeight: 700,
                    color: colors.textMain,
                    backgroundColor: growerOpened ? '#FAF9F5' : 'transparent',
                    padding: '10px 12px',
                  },
                }}
              >
                {/* SECCIÓN 1: CONTROL OPERATIVO */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" my="xs" style={{ letterSpacing: '0.5px' }}>
                  CONTROL OPERATIVO - RANCHOS
                </Text>

                <NavLink
                  label="Panel de Control"
                  leftSection={<IconLayoutDashboard size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/dashboard'}
                  onClick={() => handleNavigation('/grower/dashboard')}
                  styles={itemStyles(location.pathname === '/grower/dashboard')}
                  pl="md"
                />
                <NavLink
                  label="Calendario"
                  leftSection={<IconCalendar size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/calendario'}
                  onClick={() => handleNavigation('/grower/calendario')}
                  styles={itemStyles(location.pathname === '/grower/calendario')}
                  pl="md"
                />
                <NavLink
                  label="Captura"
                  leftSection={<IconEdit size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/captura'}
                  onClick={() => handleNavigation('/grower/captura')}
                  styles={itemStyles(location.pathname === '/grower/captura')}
                  pl="md"
                />
                <NavLink
                  label="P&L"
                  leftSection={<IconReportMoney size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/pl'}
                  onClick={() => handleNavigation('/grower/pl')}
                  styles={itemStyles(location.pathname === '/grower/pl')}
                  pl="md"
                />
                <NavLink
                  label="Concentrados"
                  leftSection={<IconLayersIntersect size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/concentrados'}
                  onClick={() => handleNavigation('/grower/concentrados')}
                  styles={itemStyles(location.pathname === '/grower/concentrados')}
                  pl="md"
                />
                <NavLink
                  label="Sectores"
                  leftSection={<IconLabel size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/sectores'}
                  onClick={() => handleNavigation('/grower/sectores')}
                  styles={itemStyles(location.pathname === '/grower/sectores')}
                  pl="md"
                />
                <NavLink
                  label="Planeación"
                  leftSection={<IconClipboardList size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/planeacion'}
                  onClick={() => handleNavigation('/grower/planeacion')}
                  styles={itemStyles(location.pathname === '/grower/planeacion')}
                  pl="md"
                />

                {/* SECCIÓN 2: MONITORIZACIÓN Y BITÁCORAS */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  MONITORIZACIÓN Y BITÁCORAS
                </Text>

                <NavLink
                  label="Fichas Técnicas"
                  leftSection={<IconBook size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/fichas-tecnicas'}
                  onClick={() => handleNavigation('/grower/fichas-tecnicas')}
                  styles={itemStyles(location.pathname === '/grower/fichas-tecnicas')}
                  pl="md"
                />
                <NavLink
                  label="Bitácora y Liberación"
                  leftSection={<IconNotes size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/bitacora'}
                  onClick={() => handleNavigation('/grower/bitacora')}
                  styles={itemStyles(location.pathname === '/grower/bitacora')}
                  pl="md"
                />
                <NavLink
                  label="Pronóstico Cosecha"
                  leftSection={<IconChartBar size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/pronostico'}
                  onClick={() => handleNavigation('/grower/pronostico')}
                  styles={itemStyles(location.pathname === '/grower/pronostico')}
                  pl="md"
                />
                <NavLink
                  label="Boleta de Cosecha"
                  leftSection={<IconTicket size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/boleta-cosecha'}
                  onClick={() => handleNavigation('/grower/boleta-cosecha')}
                  styles={itemStyles(location.pathname === '/grower/boleta-cosecha')}
                  pl="md"
                />

                {/* SECCIÓN 3: COMPRAS Y SEMILLA */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  COMPRAS Y SEMILLA
                </Text>

                <NavLink
                  label="Órdenes de Compra"
                  leftSection={<IconClipboardList size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/orders'}
                  onClick={() => handleNavigation('/grower/orders')}
                  styles={itemStyles(location.pathname === '/grower/orders')}
                  pl="md"
                />
                <NavLink
                  label="Catálogos · Prod y Prov"
                  leftSection={<IconBook size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/catalog'}
                  onClick={() => handleNavigation('/grower/catalog')}
                  styles={itemStyles(location.pathname === '/grower/catalog')}
                  pl="md"
                />
                <NavLink
                  label="Semilla · Dosis"
                  leftSection={<IconSeeding size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/seeds-flow'}
                  onClick={() => handleNavigation('/grower/seeds-flow')}
                  styles={itemStyles(location.pathname === '/grower/seeds-flow')}
                  pl="md"
                />

                {/* SECCIÓN 4: INVENTARIO */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  INVENTARIO
                </Text>
                <NavLink
                  label="Inventario · Todo en Una"
                  leftSection={<IconStack size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/inventory'}
                  onClick={() => handleNavigation('/grower/inventory')}
                  styles={itemStyles(location.pathname === '/grower/inventory')}
                  pl="md"
                />

                {/* SECCIÓN 5: DINERO */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  DINERO
                </Text>
                <NavLink
                  label="Presupuesto de Temporada · Captura"
                  leftSection={<IconMoneybag size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/season-budget'}
                  onClick={() => handleNavigation('/grower/season-budget')}
                  styles={itemStyles(location.pathname === '/grower/season-budget')}
                  pl="md"
                />
                <NavLink
                  label="Cuentas por Pagar · SAT Conciliado"
                  leftSection={<IconCreditCardPay size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/accounts-payable'}
                  onClick={() => handleNavigation('/grower/accounts-payable')}
                  styles={itemStyles(location.pathname === '/grower/accounts-payable')}
                  pl="md"
                />
                <NavLink
                  label="Cuentas por Cobrar"
                  leftSection={<IconCreditCardHand size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/accounts-receivable'}
                  onClick={() => handleNavigation('/grower/accounts-receivable')}
                  styles={itemStyles(location.pathname === '/grower/accounts-receivable')}
                  pl="md"
                />
                <NavLink
                  label="Bancos · Saldos, TC y Flujo"
                  leftSection={<IconCashBanknote size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/banks-and-cash-flow'}
                  onClick={() => handleNavigation('/grower/banks-and-cash-flow')}
                  styles={itemStyles(location.pathname === '/grower/banks-and-cash-flow')}
                  pl="md"
                />
                <NavLink
                  label="Contpaqi · Equivalencias y Export"
                  leftSection={<IconDatabase size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/contpaqi'}
                  onClick={() => handleNavigation('/grower/contpaqi')}
                  styles={itemStyles(location.pathname === '/grower/contpaqi')}
                  pl="md"
                />
                <NavLink
                  label="Nómina Semanal"
                  leftSection={<IconList size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/weekly-payroll'}
                  onClick={() => handleNavigation('/grower/weekly-payroll')}
                  styles={itemStyles(location.pathname === '/grower/weekly-payroll')}
                  pl="md"
                />

                {/* SECCIÓN 6: P&L Y RESULTADOS */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  P&L Y RESULTADOS
                </Text>
                <NavLink
                  label="Dashboard Financiero del Grower"
                  leftSection={<IconDashboard size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/grower-finance-dashboard'}
                  onClick={() => handleNavigation('/grower/grower-finance-dashboard')}
                  styles={itemStyles(location.pathname === '/grower/grower-finance-dashboard')}
                  pl="md"
                />
                <NavLink
                  label="P&L por Sector · Vivos y Cerrados"
                  leftSection={<IconCommand size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/pl-sector'}
                  onClick={() => handleNavigation('/grower/pl-sector')}
                  styles={itemStyles(location.pathname === '/grower/pl-sector')}
                  pl="md"
                />
                <NavLink
                  label="Yield Real vs Ficha Técnica"
                  leftSection={<IconCalculator size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/yield-vs-real'}
                  onClick={() => handleNavigation('/grower/yield-vs-real')}
                  styles={itemStyles(location.pathname === '/grower/yield-vs-real')}
                  pl="md"
                />
                <NavLink
                  label="Temporada · Plan vs Real"
                  leftSection={<IconAnalyze size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/season-plan-vs-real'}
                  onClick={() => handleNavigation('/grower/season-plan-vs-real')}
                  styles={itemStyles(location.pathname === '/grower/season-plan-vs-real')}
                  pl="md"
                />
                <NavLink
                  label="Liquidación de PF · Captura y Conciliación"
                  leftSection={<IconMoneybagPlus size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/pf-liquidations'}
                  onClick={() => handleNavigation('/grower/pf-liquidations')}
                  styles={itemStyles(location.pathname === '/grower/pf-liquidations')}
                  pl="md"
                />

                {/* SECCIÓN 7: ADMINISTRACIÓN */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  ADMINISTRACIÓN
                </Text>
                <NavLink
                  label="Empleados y Cuadrillas"
                  leftSection={<IconUser size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/employees'}
                  onClick={() => handleNavigation('/grower/employees')}
                  styles={itemStyles(location.pathname === '/grower/employees')}
                  pl="md"
                />
                <NavLink
                  label="Asistencia Diaria · Captura"
                  leftSection={<IconListCheck size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/attendance'}
                  onClick={() => handleNavigation('/grower/attendance')}
                  styles={itemStyles(location.pathname === '/grower/attendance')}
                  pl="md"
                />
                <NavLink
                  label="Maquinaria · Diesel, Labores y Servicios"
                  leftSection={<IconCircuitMotor size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/machinery'}
                  onClick={() => handleNavigation('/grower/machinery')}
                  styles={itemStyles(location.pathname === '/grower/machinery')}
                  pl="md"
                />
                <NavLink
                  label="Conciliación de Tarjeta"
                  leftSection={<IconAnalyze size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/card-conciliation'}
                  onClick={() => handleNavigation('/grower/card-conciliation')}
                  styles={itemStyles(location.pathname === '/grower/card-conciliation')}
                  pl="md"
                />
                <NavLink
                  label="Usuarios y Permisos"
                  leftSection={<IconCheckupList size={16} stroke={1.5} />}
                  active={location.pathname === '/grower/user-permissions'}
                  onClick={() => handleNavigation('/grower/user-permissions')}
                  styles={itemStyles(location.pathname === '/grower/user-permissions')}
                  pl="md"
                />
              </NavLink>
            )
          )}

          {/* ============================================================
              MÓDULO PRODUCE COOLING - Independiente (SOLO si showCooling es true)
          ============================================================ */}
          {showCooling && (
            isCollapsed ? (
              <Tooltip label="Produce Cooling" position="right" withArrow>
                <NavLink
                  leftSection={<IconSnowflake size={20} stroke={1.5} color={colors.coolingText} />}
                  active={isCoolingActive}
                  onClick={() => handleNavigation('/produce-cooling/reception-scan')}
                  styles={itemStyles(isCoolingActive, true)}
                />
              </Tooltip>
            ) : (
              <NavLink
                label="PRODUCE COOLING"
                leftSection={<IconSnowflake size={20} stroke={1.5} color={colors.coolingText} />}
                opened={coolingOpened}
                onChange={setCoolingOpened}
                styles={{
                  root: {
                    borderRadius: '8px',
                    fontWeight: 700,
                    color: colors.coolingText,
                    backgroundColor: coolingOpened ? colors.coolingBg : 'transparent',
                    padding: '10px 12px',
                  },
                }}
              >
                {/* OPERACIÓN · ENFRÍA, ENHIELA, EMBARCA */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" my="xs" style={{ letterSpacing: '0.5px' }}>
                  OPERACIÓN · ENFRÍA, ENHIELA, EMBARCA
                </Text>
                <NavLink
                  label="ESC1 · Recepción por Escaneo del Folio"
                  leftSection={<IconScan size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/reception-scan'}
                  onClick={() => handleNavigation('/produce-cooling/reception-scan')}
                  styles={itemStyles(location.pathname === '/produce-cooling/reception-scan', true)}
                  pl="md"
                />
                <NavLink
                  label="PC1 · Trazabilidad e Inventario"
                  leftSection={<IconStack size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/trazabilidad-inventario'}
                  onClick={() => handleNavigation('/produce-cooling/trazabilidad-inventario')}
                  styles={itemStyles(location.pathname === '/produce-cooling/trazabilidad-inventario', true)}
                  pl="md"
                />
                <NavLink
                  label="PC4 · Bitácoras y Ventas de Servicios"
                  leftSection={<IconNotes size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/bitacoras-ventas-servicios'}
                  onClick={() => handleNavigation('/produce-cooling/bitacoras-ventas-servicios')}
                  styles={itemStyles(location.pathname === '/produce-cooling/bitacoras-ventas-servicios', true)}
                  pl="md"
                />
                <NavLink
                  label="PCEMB · Órdenes de Embarque"
                  leftSection={<IconTruckDelivery size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/ordenes-embarque'}
                  onClick={() => handleNavigation('/produce-cooling/ordenes-embarque')}
                  styles={itemStyles(location.pathname === '/produce-cooling/ordenes-embarque', true)}
                  pl="md"
                />

                {/* COMPRAS */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  COMPRAS
                </Text>
                <NavLink
                  label="PCOC · Órdenes de Compra de PC"
                  leftSection={<IconClipboardList size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/ordenes-compra'}
                  onClick={() => handleNavigation('/produce-cooling/ordenes-compra')}
                  styles={itemStyles(location.pathname === '/produce-cooling/ordenes-compra', true)}
                  pl="md"
                />
                <NavLink
                  label="PCCAT · Catálogos de PC · Proveedores y Productos"
                  leftSection={<IconBook size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/catalogos'}
                  onClick={() => handleNavigation('/produce-cooling/catalogos')}
                  styles={itemStyles(location.pathname === '/produce-cooling/catalogos', true)}
                  pl="md"
                />

                {/* DINERO */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  DINERO
                </Text>
                <NavLink
                  label="PCPRE · Presupuesto de PC · El Negocio Completo"
                  leftSection={<IconMoneybag size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/presupuesto'}
                  onClick={() => handleNavigation('/produce-cooling/presupuesto')}
                  styles={itemStyles(location.pathname === '/produce-cooling/presupuesto', true)}
                  pl="md"
                />
                <NavLink
                  label="PCCXP · CxP de PC · SAT Conciliado"
                  leftSection={<IconCreditCardPay size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/cxp'}
                  onClick={() => handleNavigation('/produce-cooling/cxp')}
                  styles={itemStyles(location.pathname === '/produce-cooling/cxp', true)}
                  pl="md"
                />
                <NavLink
                  label="PCCXC · CxC de PC · Servicios Facturados"
                  leftSection={<IconCreditCardHand size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/cxc'}
                  onClick={() => handleNavigation('/produce-cooling/cxc')}
                  styles={itemStyles(location.pathname === '/produce-cooling/cxc', true)}
                  pl="md"
                />
                <NavLink
                  label="PCBAN · Bancos de PC · Saldo y Flujo"
                  leftSection={<IconCashBanknote size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/bancos'}
                  onClick={() => handleNavigation('/produce-cooling/bancos')}
                  styles={itemStyles(location.pathname === '/produce-cooling/bancos', true)}
                  pl="md"
                />
                <NavLink
                  label="PCCONT · Contpaqi de PC · Equivalencias y Export"
                  leftSection={<IconDatabase size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/contpaqi'}
                  onClick={() => handleNavigation('/produce-cooling/contpaqi')}
                  styles={itemStyles(location.pathname === '/produce-cooling/contpaqi', true)}
                  pl="md"
                />

                {/* PERSONAL */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  PERSONAL
                </Text>
                <NavLink
                  label="PCNOM · Personal de Planta · Nómina y Destajo"
                  leftSection={<IconUser size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/nomina'}
                  onClick={() => handleNavigation('/produce-cooling/nomina')}
                  styles={itemStyles(location.pathname === '/produce-cooling/nomina', true)}
                  pl="md"
                />

                {/* PLANTA */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  PLANTA
                </Text>
                <NavLink
                  label="PCMTO · Mantenimiento y Equipos"
                  leftSection={<IconSettings size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/mantenimiento'}
                  onClick={() => handleNavigation('/produce-cooling/mantenimiento')}
                  styles={itemStyles(location.pathname === '/produce-cooling/mantenimiento', true)}
                  pl="md"
                />

                {/* ADMINISTRACIÓN */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  ADMINISTRACIÓN
                </Text>
                <NavLink
                  label="PCUSR · Usuarios y Permisos de PC"
                  leftSection={<IconCheckupList size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/usuarios-permisos'}
                  onClick={() => handleNavigation('/produce-cooling/usuarios-permisos')}
                  styles={itemStyles(location.pathname === '/produce-cooling/usuarios-permisos', true)}
                  pl="md"
                />

                {/* RESULTADO */}
                <Text size="10px" fw={700} c={colors.textMuted} pl="sm" mt="md" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  RESULTADO
                </Text>
                <NavLink
                  label="PCPL · P&L de PC · Plan vs Real"
                  leftSection={<IconChartPie size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/pl'}
                  onClick={() => handleNavigation('/produce-cooling/pl')}
                  styles={itemStyles(location.pathname === '/produce-cooling/pl', true)}
                  pl="md"
                />
                <NavLink
                  label="PC5 · Dashboard de PC"
                  leftSection={<IconDashboard size={16} stroke={1.5} />}
                  active={location.pathname === '/produce-cooling/dashboard'}
                  onClick={() => handleNavigation('/produce-cooling/dashboard')}
                  styles={itemStyles(location.pathname === '/produce-cooling/dashboard', true)}
                  pl="md"
                />
              </NavLink>
            )
          )}

        </Stack>
      </Box>
    </Box>
  );
}