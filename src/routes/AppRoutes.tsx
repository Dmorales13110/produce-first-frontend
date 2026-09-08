// src/routes/AppRoutes.tsx

import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import { MainLayout } from '../components/MainLayout';

// ============================================================
// DEBUG: Logs para verificar carga de módulos
// ============================================================
console.log('🔄 [AppRoutes] Archivo AppRoutes.tsx cargado');
console.log('🔄 [AppRoutes] Directorio actual:', window.location.pathname);

// --- Lazy Loading de Módulos (Pantallas Separadas) ---
const MainDashboard = React.lazy(() => {
  console.log('🔄 [AppRoutes] Cargando MainDashboard...');
  return import('../modules/dashboard/index').then(module => {
    console.log('✅ [AppRoutes] MainDashboard cargado correctamente');
    return module;
  }).catch(err => {
    console.error('❌ [AppRoutes] Error cargando MainDashboard:', err);
    throw err;
  });
});

const GrowerDashboard = React.lazy(() => {
  console.log('🔄 [AppRoutes] Cargando GrowerDashboard...');
  return import('../modules/grower').then(module => {
    console.log('✅ [AppRoutes] GrowerDashboard cargado correctamente');
    return module;
  }).catch(err => {
    console.error('❌ [AppRoutes] Error cargando GrowerDashboard:', err);
    throw err;
  });
});

// ✅ Módulo Produce Cooling - Rutas de cadena de frío
const ProduceCoolingModule = React.lazy(() => {
  console.log('🔄 [AppRoutes] Cargando ProduceCoolingModule...');
  console.log('🔄 [AppRoutes] Ruta de importación: ../modules/produce-cooling');
  
  return import('../modules/produce-cooling')
    .then(module => {
      console.log('✅ [AppRoutes] ProduceCoolingModule cargado correctamente');
      console.log('✅ [AppRoutes] Módulo:', module);
      console.log('✅ [AppRoutes] Export default:', module.default);
      console.log('✅ [AppRoutes] Exportaciones:', Object.keys(module));
      
      if (!module.default) {
        console.error('❌ [AppRoutes] El módulo no tiene export default');
      }
      
      return module;
    })
    .catch(err => {
      console.error('❌ [AppRoutes] ERROR cargando ProduceCoolingModule:');
      console.error('❌ [AppRoutes] Mensaje:', err.message);
      console.error('❌ [AppRoutes] Stack:', err.stack);
      throw err;
    });
});

// ✅ Módulo Produce First - Super Panel (Grower + Cooling)
const ProduceFirstModule = React.lazy(() => {
  console.log('🔄 [AppRoutes] Cargando ProduceFirstModule...');
  return import('../modules/produce-first').then(module => {
    console.log('✅ [AppRoutes] ProduceFirstModule cargado correctamente');
    return module;
  }).catch(err => {
    console.error('❌ [AppRoutes] Error cargando ProduceFirstModule:', err);
    throw err;
  });
});

// --- Fallback de Carga ---
const PageLoader = () => (
  <Center style={{ width: '100%', height: '50vh' }}>
    <Loader color="growerGreen" size="md" type="dots" />
  </Center>
);

// --- Placeholders Temporales ---
const PlaceholderView = ({ title }: { title: string }) => (
  <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: 'md', border: '1px solid #E0DDD2' }}>
    <h2>{title}</h2>
    <p>Este módulo está en proceso de migración al nuevo stack.</p>
  </div>
);

export const AppRoutes: React.FC = () => {
  console.log('🔄 [AppRoutes] Renderizando AppRoutes');
  console.log('🔄 [AppRoutes] Ruta actual:', window.location.pathname);
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rutas Protegidas dentro del MainLayout */}
        <Route path="/" element={<MainLayout children={undefined} />}>
          
          {/* Redirección por defecto al Panel Principal */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* ============================================================
              PANTALLA 1: Panel Principal Corporativo
          ============================================================ */}
          <Route 
            path="dashboard" 
            element={
              <Suspense fallback={<PageLoader />}>
                <MainDashboard />
              </Suspense>
            } 
          />
          
          {/* ============================================================
              PANTALLA 2: Ecosistema Growers (Legacy - Mantener por compatibilidad)
          ============================================================ */}
          <Route 
            path="grower/*" 
            element={
              <Suspense fallback={<PageLoader />}>
                <GrowerDashboard />
              </Suspense>
            } 
          />
          
          {/* ============================================================
              PANTALLA 3: Produce Cooling (Legacy - Mantener por compatibilidad)
          ============================================================ */}
          <Route 
            path="produce-cooling/*" 
            element={
              <Suspense fallback={<PageLoader />}>
                <ProduceCoolingModule />
              </Suspense>
            } 
          />
          
          {/* ============================================================
              PANTALLA 4: PRODUCE FIRST - Super Panel (NUEVO)
              Agrupa Grower + Produce Cooling en un solo módulo
          ============================================================ */}
          <Route 
            path="produce-first/*" 
            element={
              <Suspense fallback={<PageLoader />}>
                <ProduceFirstModule />
              </Suspense>
            } 
          />
          
          {/* ============================================================
              RUTAS DE PRUEBA
          ============================================================ */}
          <Route 
            path="produce-cooling-test" 
            element={
              <div style={{ padding: '40px', backgroundColor: '#E7F5FF' }}>
                <h1 style={{ color: '#1864AB' }}>✅ Ruta de prueba de Produce Cooling</h1>
                <p>Si ves esto, el enrutamiento funciona correctamente.</p>
                <p>Ahora prueba: <code>/produce-cooling/reception-scan</code></p>
              </div>
            } 
          />
          
          <Route 
            path="produce-first-test" 
            element={
              <div style={{ padding: '40px', backgroundColor: '#E7F5FF' }}>
                <h1 style={{ color: '#1A4B8C' }}>✅ Ruta de prueba de Produce First</h1>
                <p>Si ves esto, el super panel está funcionando correctamente.</p>
                <p>Prueba las rutas:</p>
                <ul>
                  <li><code>/produce-first</code> - Dashboard consolidado</li>
                  <li><code>/produce-first/grower/dashboard</code> - Grower</li>
                  <li><code>/produce-first/cooling/reception-scan</code> - Cooling</li>
                </ul>
              </div>
            } 
          />
          
          {/* ============================================================
              PLACEHOLDERS - Módulos en desarrollo
          ============================================================ */}
          <Route path="harvest-receptions" element={<PlaceholderView title="Recepciones de Báscula" />} />
          <Route path="expenses" element={<PlaceholderView title="Control de Gastos" />} />
          <Route path="advance-payments" element={<PlaceholderView title="Anticipos a Productores" />} />
          <Route path="sales-orders" element={<PlaceholderView title="Órdenes de Venta" />} />

          {/* ============================================================
              FALLBACK - Redirección por defecto
          ============================================================ */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

// ============================================================
// DEBUG: Logs adicionales para verificar que todo se exporta bien
// ============================================================
console.log('✅ [AppRoutes] AppRoutes exportado correctamente');
console.log('✅ [AppRoutes] Rutas registradas:');
console.log('  - /dashboard - Panel Principal Corporativo');
console.log('  - /grower/* - Ecosistema Grower (Legacy)');
console.log('  - /produce-cooling/* - Produce Cooling (Legacy)');
console.log('  - /produce-first/* - PRODUCE FIRST (Super Panel)');
console.log('  - /produce-cooling-test - Ruta de prueba Cooling');
console.log('  - /produce-first-test - Ruta de prueba PF');
console.log('  - /harvest-receptions - Placeholder');
console.log('  - /expenses - Placeholder');
console.log('  - /advance-payments - Placeholder');
console.log('  - /sales-orders - Placeholder');
console.log('✅ [AppRoutes] Todas las rutas registradas correctamente');