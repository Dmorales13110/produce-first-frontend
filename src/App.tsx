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
                
                {/* ✅ GROWER - Ruta simple y directa */}
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
                
                {/* ✅ PRODUCE COOLING - Ruta simple y directa */}
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

                {/* ✅ PRODUCE FIRST - Super Panel */}
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

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ModuleProvider>
      </AuthProvider>
    </MantineProvider>
  );
}