// src/modules/produce-cooling/index.ts

console.log('🔵 [ProduceCooling] ===== MÓDULO PRODUCE COOLING =====');
console.log('🔵 [ProduceCooling] Archivo index.ts cargado');

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProduceCoolingLayout } from './ProduceCoolingLayout';
import { ReceptionScanView } from './components/ReceptionScan';
import { TrazabilidadInventarioView } from './TrazabilidadInventario';
import {BitacorasVentasServiciosView} from './BitacorasVentasServicios';
import {OrdenesEmbarqueView} from './OrdenesEmbarque';
import {OrdenesCompraPCView} from './OrdenesCompraPC';
import { CatalogosPCView } from './CatalogosPC';
import {PresupuestoPCView} from './PresupuestoPC';
import {CxpSATConciliadoView} from './CxpSATConciliado';
import {CxcServiciosFacturadosView} from './CxcServiciosFacturados';
import {CashFlowView} from './CashFlow';
import {ContpaqiView} from './Contpaqi';
import {PayrollView} from './Payroll';
import { MaintenanceView } from './Maintenance';
import { PLPlanVsRealView } from './PLPlanVsRealView';
import {UsersPermissionsView} from './UsersPermissions';
import { DashboardPCView } from './DashboardPC';

console.log('🔵 [ProduceCooling] Importaciones completadas');

// Placeholder para submódulos en desarrollo
const PlaceholderModule = ({ title }: { title: string }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p style={{ color: '#6B7280' }}>Este submódulo está en construcción</p>
  </div>
);

// Componente principal del módulo Produce Cooling
const ProduceCoolingModule: React.FC = () => {
  console.log('🔵 [ProduceCooling] ===== RENDERIZANDO MÓDULO =====');
  console.log('🔵 [ProduceCooling] Ruta actual:', window.location.pathname);
  console.log('🔵 [ProduceCooling] Todas las rutas registradas:');
  console.log('  - / (redirige a reception-scan)');
  console.log('  - /test (página de prueba)');
  console.log('  - /reception-scan');
  console.log('  - /trazabilidad-inventario');
  console.log('  - /bitacoras-ventas-servicios');
  console.log('  - /ordenes-embarque');
  console.log('  - /ordenes-compra');
  console.log('  - /catalogos');
  console.log('  - /presupuesto');
  console.log('  - /cxp');
  console.log('  - /cxc');
  console.log('  - /bancos');
  console.log('  - /contpaqi');
  console.log('  - /nomina');
  console.log('  - /mantenimiento');
  console.log('  - /usuarios-permisos');
  console.log('  - /pl');
  console.log('  - /dashboard');
  
  return (
    <Routes>
      {/* Ruta de prueba para verificar que el módulo funciona */}
      <Route 
        path="test" 
        element={
          <div style={{ padding: '40px', backgroundColor: '#E7F5FF', minHeight: '100vh' }}>
            <h1 style={{ color: '#1864AB' }}>✅ TEST - Produce Cooling Module Works!</h1>
            <p>Si ves esto, el módulo se cargó correctamente.</p>
            <p>Ruta actual: <code>{window.location.pathname}</code></p>
            <p>Prueba navegando a:</p>
            <ul>
              <li><code>/produce-cooling/reception-scan</code></li>
              <li><code>/produce-cooling/dashboard</code></li>
            </ul>
          </div>
        } 
      />
      
      {/* Ruta principal: redirige a reception-scan */}
      <Route path="/" element={<Navigate to="reception-scan" replace />} />
      
      {/* ============================================================
          OPERACIÓN · ENFRÍA, ENHIELA, EMBARCA
      ============================================================ */}
      <Route 
        path="reception-scan" 
        element={
          <ProduceCoolingLayout>
            <ReceptionScanView />
          </ProduceCoolingLayout>
        } 
      />
      <Route 
        path="trazabilidad-inventario" 
        element={
          <ProduceCoolingLayout>
            <TrazabilidadInventarioView />
          </ProduceCoolingLayout>
        } 
      />
      <Route 
        path="bitacoras-ventas-servicios" 
        element={
          <ProduceCoolingLayout>
            <BitacorasVentasServiciosView />
          </ProduceCoolingLayout>
        } 
      />
      <Route 
        path="ordenes-embarque" 
        element={
          <ProduceCoolingLayout>
            <OrdenesEmbarqueView />
          </ProduceCoolingLayout>
        } 
      />

      {/* ============================================================
          COMPRAS
      ============================================================ */}
      <Route 
        path="ordenes-compra" 
        element={
          <ProduceCoolingLayout>
              <OrdenesCompraPCView />
          </ProduceCoolingLayout>
        } 
      />
      <Route 
        path="catalogos" 
        element={
          <ProduceCoolingLayout>
            <CatalogosPCView />
          </ProduceCoolingLayout>
        } 
      />

      {/* ============================================================
          DINERO
      ============================================================ */}
      <Route 
        path="presupuesto" 
        element={
          <ProduceCoolingLayout>
            <PresupuestoPCView />
          </ProduceCoolingLayout>
        } 
      />
      <Route 
        path="cxp" 
        element={
          <ProduceCoolingLayout>
            <CxpSATConciliadoView />
          </ProduceCoolingLayout>
        } 
      />
      <Route 
        path="cxc" 
        element={
          <ProduceCoolingLayout>
            <CxcServiciosFacturadosView />
          </ProduceCoolingLayout>
        } 
      />
      <Route 
        path="bancos" 
        element={
          <ProduceCoolingLayout>
            <CashFlowView />
          </ProduceCoolingLayout>
        } 
      />
      <Route 
        path="contpaqi" 
        element={
          <ProduceCoolingLayout>
            <ContpaqiView />
          </ProduceCoolingLayout>
        } 
      />

      {/* ============================================================
          PERSONAL
      ============================================================ */}
      <Route 
        path="nomina" 
        element={
          <ProduceCoolingLayout>
            <PayrollView />
          </ProduceCoolingLayout>
        } 
      />

      {/* ============================================================
          PLANTA
      ============================================================ */}
      <Route 
        path="mantenimiento" 
        element={
          <ProduceCoolingLayout>
            <MaintenanceView />
          </ProduceCoolingLayout>
        } 
      />

      {/* ============================================================
          ADMINISTRACIÓN
      ============================================================ */}
      <Route 
        path="usuarios-permisos" 
        element={
          <ProduceCoolingLayout>
            <UsersPermissionsView />
          </ProduceCoolingLayout>
        } 
      />

      {/* ============================================================
          RESULTADO
      ============================================================ */}
      <Route 
        path="pl" 
        element={
          <ProduceCoolingLayout>
            <PLPlanVsRealView/>
          </ProduceCoolingLayout>
        } 
      />
      <Route 
        path="dashboard" 
        element={
          <ProduceCoolingLayout>
            <DashboardPCView/>
          </ProduceCoolingLayout>
        } 
      />

      {/* Fallback dentro del módulo */}
      <Route path="*" element={<Navigate to="reception-scan" replace />} />
    </Routes>
  );
};

console.log('🔵 [ProduceCooling] Exportando componente...');

export default ProduceCoolingModule;

// Exportaciones adicionales para uso directo
export * from './ProduceCoolingLayout';
export * from './components/ReceptionScan';
export * from './components/ReceptionScan/hooks/useReceptionScan';