import { Box, Group, Text, Title, UnstyledButton, Stack } from '@mantine/core';
import {
  IconLayoutDashboard, IconCalendar, IconEdit, IconReportMoney,
  IconLayersIntersect, IconLabel, IconClipboardList, IconBuilding,
  IconBook, IconSeeding, IconNotes, IconChartBar, IconTicket
} from '@tabler/icons-react';
import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

// Sub-módulos del ecosistema Growers (Tus vistas viejas)
import DashboardView  from './components/GrowerDashboard';
import { GrowerCalendar } from './components/GrowerCalendar';
import  GrowerCapture from './components/GrowerCapture';
import { GrowerFinance } from './components/GrowerFinance';
import GrowerConcentrated  from './components/GrowerConcentrated';
import  GrowerSectors  from './components/GrowerSectors';
import  GrowerPlanning from './components/GrowerPlanning';
import  GrowerPL  from './components/GrowerPL';

// Insumos y Semillas
import GrowerOrders from './components/GrowerOrders';
import GrowerCatalog from './components/GrowerCatalog';
import GrowerSeedsFlow from './components/GrowerSeedsFlow';

// Inventario
import  GrowerInventory  from './components/GrowerInventory';

//Dinero
import  GrowerAccountsPayable from './components/GrowerAccountPayable';
import  GrowerAccountsReceivable  from './components/GrowerAccountsReceivable';
import  GrowerBanksAndCashflow  from './components/GrowerBanksAndCashFlow';
import { GrowerContpaqiExport } from './components/GrowerContpaqiExport';
import  GrowerSeasonBudget from './components/GrowerSeasonBudget';
import  GrowerWeeklyPayroll  from './components/GrowerWeeklyPayroll';

//P&L Y RESULTADOS
import  GrowerFinanceDashboardView  from './components/GrowerFinanceDashboard';
import  GrowerPFLiquidation  from './components/GrowerPFLiquidation';
import  GrowerSeasonPlanVsReal  from './components/GrowerSeasonPlanVsReal';
import  GrowerYieldVsFicha  from './components/GrowerYieldVsField';
import  GrowerPLSector  from './components/GrowerPLSector';

//ADMINISTRACION
import GrowerAttendance  from './components/GrowerAttendance';
import  GrowerEmployees  from './components/GrowerEmployees';
import GrowerMachinery  from './components/GrowerMachinery';
import  GrowerUsersPermissions  from './components/GrowerUserPermissions';
import  GrowerCardConciliation  from './components/GrowerCardConciliation';

// --- NUEVOS COMPONENTES TÉCNICOS AGREGADOS ---
import GrowerTechnical  from './components/GrowerTechnical';       // FT1
import  GrowerLogBook  from './components/GrowerLogBook';           // G04
import  GrowerForecast  from './components/GrowerForecast';         // G05
import GrowerHarvestTicket  from './components/GrowerHarvestTicket'; // G07

export default function GrowerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRancho, setActiveRancho] = useState<'san_aparicio' | 'la_escondida'>('san_aparicio');

  // Mapeo unificado con nombres e IDs en ESPAÑOL y legibles para el cliente
  const tabs = [
    { id: 'dashboard', path: '/grower/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
    { id: 'calendar', path: '/grower/calendario', label: 'Calendario', icon: IconCalendar },
    { id: 'capture', path: '/grower/captura', label: 'Captura', icon: IconEdit },
    { id: 'pl', path: '/grower/pl', label: 'P&L', icon: IconReportMoney },
    { id: 'concentrates', path: '/grower/concentrados', label: 'Concentrados', icon: IconLayersIntersect },
    { id: 'sectors', path: '/grower/sectores', label: 'Sectores', icon: IconLabel },
    { id: 'planning', path: '/grower/planeacion', label: 'Planeación', icon: IconClipboardList },

  ] as const;

  return (
    <Box style={{ backgroundColor: '#F4F3EF', minHeight: '100vh', padding: '16px' }}>
      {/* 1. Selector de Ranchos Superior */}
      <Group gap="xs" mb="md">
        <UnstyledButton
          onClick={() => setActiveRancho('san_aparicio')}
          style={{
            backgroundColor: activeRancho === 'san_aparicio' ? '#1F5C3A' : '#FFFFFF',
            color: activeRancho === 'san_aparicio' ? '#FFFFFF' : '#3A3A34',
            border: '1px solid #D8E4D2',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
        >
          Daily Veggies · San Aparicio
        </UnstyledButton>
        <UnstyledButton
          onClick={() => setActiveRancho('la_escondida')}
          style={{
            backgroundColor: activeRancho === 'la_escondida' ? '#1F5C3A' : '#FFFFFF',
            color: activeRancho === 'la_escondida' ? '#FFFFFF' : '#3A3A34',
            border: '1px solid #D8E4D2',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
        >
          Agrícola JAV · La Escondida
        </UnstyledButton>
      </Group>

      {/* 2. Banner Principal Módulo Grower */}
      <Box style={{ backgroundColor: '#1F5C3A', borderRadius: '8px 8px 0 0', padding: '20px 24px 0 24px', color: '#FFFFFF' }}>
        <Group align="flex-start" gap="sm" mb="xl">
          <IconBuilding size={28} stroke={1.5} style={{ marginTop: '2px', opacity: 0.9 }} />
          <Stack gap={2}>
            <Title order={3} fw={700} style={{ letterSpacing: '-0.5px', fontSize: '20px' }}>
              {activeRancho === 'san_aparicio' ? 'Grupo Produce First — San Aparicio' : 'Agrícola JAV — La Escondida'}
            </Title>
            <Text size="xs" style={{ opacity: 0.8, fontWeight: 500 }}>
              Control de temporada · Invierno 2026-2027
            </Text>
          </Stack>
        </Group>

        {/* Pestañas de Navegación Interna basadas en URL */}
        <Group gap={4} style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
          {tabs.map((tab) => {
            const IsActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <UnstyledButton
                key={tab.id}
                onClick={() => navigate(tab.path)}
                style={{
                  backgroundColor: IsActive ? '#FFFFFF' : 'transparent',
                  color: IsActive ? '#1F5C3A' : '#FFFFFF',
                  padding: '10px 18px',
                  borderRadius: '6px 6px 0 0',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  opacity: IsActive ? 1 : 0.85,
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={15} stroke={2} />
                {tab.label}
              </UnstyledButton>
            );
          })}
        </Group>
      </Box>

      {/* 3. Contenedor de Sub-pantallas manejado por el Router de Verdad */}
      <Box style={{ backgroundColor: '#FFFFFF', borderRadius: '0 0 8px 8px', padding: '24px', border: '1px solid #E0DDD2', borderTop: 'none' }}>
        <Routes>
          {/* Vistas Core */}
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="calendario" element={<GrowerCalendar />} />
          <Route path="captura" element={<GrowerCapture />} />
          <Route path="pl" element={<GrowerPL />} />
          <Route path="concentrados" element={<GrowerConcentrated />} />
          <Route path="sectores" element={<GrowerSectors />} />
          <Route path="planeacion" element={<GrowerPlanning />} />

          {/* NUEVAS RUTAS FÍSICAS EN ESPAÑOL VINCULADAS AL SIDEBAR */}
          <Route path="fichas-tecnicas" element={<GrowerTechnical />} />
          <Route path="bitacora" element={<GrowerLogBook />} />
          <Route path="pronostico" element={<GrowerForecast />} />
          <Route path="boleta-cosecha" element={<GrowerHarvestTicket />} />

          {/* Insumos y Semillas */}
          <Route path="orders" element={<GrowerOrders />} />
          <Route path="catalog" element={<GrowerCatalog />} />
          <Route path="seeds-flow" element={<GrowerSeedsFlow />} />

          <Route path="inventory" element={<GrowerInventory />} />

          <Route path="season-budget" element={<GrowerSeasonBudget />} />
          <Route path="accounts-payable" element={<GrowerAccountsPayable />} />
          <Route path="accounts-receivable" element={<GrowerAccountsReceivable />} />
          <Route path="banks-and-cash-flow" element={<GrowerBanksAndCashflow />} />
          <Route path="contpaqi" element={<GrowerContpaqiExport />} />
          <Route path="weekly-payroll" element={<GrowerWeeklyPayroll />} />

          <Route path="grower-finance-dashboard" element={<GrowerFinanceDashboardView />} />
          <Route path="pl-sector" element={<GrowerPLSector />} />
          <Route path="yield-vs-real" element={<GrowerYieldVsFicha />} />
          <Route path="season-plan-vs-real" element={<GrowerSeasonPlanVsReal />} />
          <Route path="pf-liquidations" element={<GrowerPFLiquidation />} />

          <Route path="employees" element={<GrowerEmployees />} />
          <Route path="attendance" element={<GrowerAttendance />} />
          <Route path="machinery" element={<GrowerMachinery />} />
          <Route path="card-conciliation" element={<GrowerCardConciliation />} />
          <Route path="user-permissions" element={<GrowerUsersPermissions />} />

          {/* Redirección por defecto si entran a /grower limpio */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}