// src/App.tsx

import { MantineProvider, createTheme, colorsTuple } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import { ModuleProvider } from './context/ModuleContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginRoute } from './routes/LoginRoute';
import { MainLayout } from './components/MainLayout';
import { NotFoundPage } from './components/NotFoundPage';

// --- Lazy Loading de Módulos ---
const MainDashboard = React.lazy(() => import('./modules/dashboard/index'));
const GrowerDashboard = React.lazy(() => import('./modules/grower'));
const ProduceCoolingModule = React.lazy(() => import('./modules/produce-cooling'));
const ProduceFirstModule = React.lazy(() => import('./modules/produce-first'));
const PortalClientesView = React.lazy(() => import('./modules/produce-first/PortalClientes/index').then(m => ({ default: m.PortalClientesView })));

const theme = createTheme({
  primaryColor: 'growerGreen',
  colors: {
    growerGreen: colorsTuple('#1F5C3A'),
    coolingBlue: colorsTuple('#2A6A8A'),
    firstRust: colorsTuple('#8A5A2A'),
    produceFirst: colorsTuple('#1A4B8C'),
  },
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  defaultRadius: 'md',
  components: {
    Card: {
      defaultProps: {
        bg: '#FFFFFF',
        withBorder: true,
      },
      styles: {
        root: { borderColor: '#E0DDD2' }
      }
    }
  }
});

const globalStyles = `
  body {
    background-color: #EFEDE6 !important;
    color: #3A3A34;
    margin: 0;
    padding: 0;
  }
`;

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <div>Cargando...</div>
  </div>
);

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <style>{globalStyles}</style>
      <AuthProvider>
        <ModuleProvider>
          <BrowserRouter>
            <Routes>
              {/* Ruta de Login - Pública */}
              <Route path="/login" element={<LoginRoute />} />

              {/* ============================================================
                  RUTAS PROTEGIDAS (con ProtectedRoute como wrapper)
              ============================================================ */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <MainLayout>
                      <Suspense fallback={<PageLoader />}>
                        <MainDashboard />
                      </Suspense>
                    </MainLayout>
                  }
                />

                {/* Redirecciones de conveniencia y compatibilidad */}
                <Route path="/harvest-receptions" element={<Navigate to="/produce-cooling/reception-scan" replace />} />
                <Route path="/expenses" element={<Navigate to="/produce-first/pf9" replace />} />
                <Route path="/sales-orders" element={<Navigate to="/produce-first/pf4" replace />} />
                <Route path="/advance-payments" element={<Navigate to="/produce-first/pf7" replace />} />
                {/* ✅ PORTAL CLIENTES - Protegido para admin y customer */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'customer']} />}>
                  <Route
                    path="/portal-clientes"
                    element={
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <PortalClientesView />
                        </Suspense>
                      </MainLayout>
                    }
                  />
                </Route>
                
                {/* ✅ GROWER - Protegido para admin y grower */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'grower']} />}>
                  <Route
                    path="/grower/*"
                    element={
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <GrowerDashboard />
                        </Suspense>
                      </MainLayout>
                    }
                  />
                </Route>
                
                {/* ✅ PRODUCE COOLING - Protegido para admin y cooling */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'cooling']} />}>
                  <Route
                    path="/produce-cooling/*"
                    element={
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <ProduceCoolingModule />
                        </Suspense>
                      </MainLayout>
                    }
                  />
                </Route>

                {/* ✅ PRODUCE FIRST - Protegido EXCLUSIVAMENTE para admin */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route
                    path="/produce-first/*"
                    element={
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <ProduceFirstModule />
                        </Suspense>
                      </MainLayout>
                    }
                  />
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ModuleProvider>
      </AuthProvider>
    </MantineProvider>
  );
}