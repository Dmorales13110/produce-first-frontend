// src/modules/produce-first/index.ts

console.log('🔵 [ProduceFirst] ===== MÓDULO PRODUCE FIRST =====');
console.log('🔵 [ProduceFirst] Archivo index.ts cargado');

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProduceFirstLayout } from './ProduceFirstLayout';

// Importar submódulos existentes
import GrowerModule from '../../modules/grower';
import ProduceCoolingModule from '../../modules/produce-cooling';

// Dashboard consolidado de Produce First
import { ProduceFirstDashboardView } from './Dashboard/index';

// ============================================================
// MÓDULOS DE PRODUCE FIRST - PLANEACIÓN COMERCIAL
// ============================================================
import { CatalogosView } from './Catalogos';
import { ProgramaVentasSiembraView } from './VentaVsSiembra';
import { PronosticoSemanalView } from './SemanalMultiProductor';

// ============================================================
// MÓDULOS DE PRODUCE FIRST - VENTA Y EMBARQUE
// ============================================================
import { PlanificadorCargaView } from './PlanificadorCarga';
import { ProformaInstruccionEmbarqueView } from './Proforma';
import { CxCClientesView } from './Clientes';
import { LiquidacionesQuejasClientesView } from './Liquidaciones';

// ============================================================
// MÓDULOS DE PRODUCE FIRST - COMPRAS Y MATERIAL
// ============================================================
import { OrdenesCompraPFView } from './OrdenesCompra';
import { MaterialEmpaquePFView } from './Empaque';

// ============================================================
// MÓDULOS DE PRODUCE FIRST - PRODUCTORES
// ============================================================
import { CuentaCorrienteProductorView } from './CuentaCorriente';
import { MotorLiquidacionesPFView } from './MotorLiquidaciones';

// ============================================================
// MÓDULOS DE PRODUCE FIRST - DINERO PF
// ============================================================
import { PresupuestoPyLPFView } from './PresupuestoPyLPF';
import { CxPProduceFirstView } from './CxP';
import { BancosPFSaldoFlujoView } from './BancosSaldoFlujo';
import { NominaGastosOficinaPFView } from './Nomina';
import { ContpaqiEquivalenciasExportView } from './Contpaqi';

// ============================================================
// MÓDULOS DE PRODUCE FIRST - RESULTADO
// ============================================================
import { RegistroLiquidacionesView } from './RegistroLiquidaciones';
import { DashboardProduceFirstView } from './DashboardResults';

// ============================================================
// MÓDULOS DE PRODUCE FIRST - ADMINISTRACIÓN
// ============================================================
import { UsuariosPermisosView } from './UsuariosPermisos';

// ============================================================
// MÓDULOS DE PRODUCE FIRST - PORTALES
// ============================================================
import { PortalClientesView } from './PortalClientes';

// ============================================================
// PLACEHOLDERS PARA MÓDULOS EN DESARROLLO
// ============================================================
const PlaceholderModule = ({ title, code }: { title: string; code: string }) => (
  <div style={{ 
    padding: '60px 40px', 
    backgroundColor: '#FFFFFF', 
    borderRadius: '12px',
    border: '1px solid #E8E5DC',
    textAlign: 'center',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <div style={{ 
      fontSize: '48px', 
      marginBottom: '16px',
      opacity: 0.3,
    }}>🚧</div>
    <h2 style={{ color: '#1A3A5C', marginBottom: '8px' }}>{title}</h2>
    <p style={{ color: '#6B7280', marginBottom: '4px' }}>Módulo en construcción</p>
    <p style={{ color: '#9CA3AF', fontSize: '12px' }}>Código: {code}</p>
  </div>
);

console.log('🔵 [ProduceFirst] Importaciones completadas');

// Componente principal del módulo Produce First
const ProduceFirstModule: React.FC = () => {
  console.log('🔵 [ProduceFirst] ===== RENDERIZANDO MÓDULO =====');
  console.log('🔵 [ProduceFirst] Ruta actual:', window.location.pathname);
  
  return (
    <Routes>
      {/* ============================================================
          GRP1 · Dashboard · Grupo PF
      ============================================================ */}
      <Route 
        path="/" 
        element={
          <ProduceFirstLayout>
            <ProduceFirstDashboardView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* ============================================================
          PLANEACIÓN COMERCIAL
      ============================================================ */}
      
      {/* PF1 · Catálogos · Clientes, Productores y Anticipos */}
      <Route 
        path="pf1" 
        element={
          <ProduceFirstLayout>
            <CatalogosView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PF2 · Programa de Ventas vs Siembra */}
      <Route 
        path="pf2" 
        element={
          <ProduceFirstLayout>
            <ProgramaVentasSiembraView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PF3 · Pronóstico Semanal Multi-productor */}
      <Route 
        path="pf3" 
        element={
          <ProduceFirstLayout>
            <PronosticoSemanalView />
          </ProduceFirstLayout>
        } 
      />

      {/* ============================================================
          VENTA Y EMBARQUE
      ============================================================ */}
      
      {/* PF4 · Planificador de Carga */}
      <Route 
        path="pf4" 
        element={
          <ProduceFirstLayout>
            <PlanificadorCargaView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PF5 · Proforma · Instrucción de Embarque */}
      <Route 
        path="pf5" 
        element={
          <ProduceFirstLayout>
            <ProformaInstruccionEmbarqueView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PF6 · CxC de Clientes */}
      <Route 
        path="pf6" 
        element={
          <ProduceFirstLayout>
            <CxCClientesView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PFLQC · Liquidaciones y Quejas de Clientes */}
      <Route 
        path="pflqc" 
        element={
          <ProduceFirstLayout>
            <LiquidacionesQuejasClientesView />
          </ProduceFirstLayout>
        } 
      />

      {/* ============================================================
          COMPRAS Y MATERIAL
      ============================================================ */}
      
      {/* PFOC · Órdenes de Compra de PF */}
      <Route 
        path="pfoc" 
        element={
          <ProduceFirstLayout>
            <OrdenesCompraPFView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PFMAT · Material de Empaque */}
      <Route 
        path="pfmat" 
        element={
          <ProduceFirstLayout>
            <MaterialEmpaquePFView />
          </ProduceFirstLayout>
        } 
      />

      {/* ============================================================
          PRODUCTORES
      ============================================================ */}
      
      {/* PF7 · Cuenta Corriente del Productor */}
      <Route 
        path="pf7" 
        element={
          <ProduceFirstLayout>
            <CuentaCorrienteProductorView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PF8 · Motor de Liquidaciones */}
      <Route 
        path="pf8" 
        element={
          <ProduceFirstLayout>
            <MotorLiquidacionesPFView />
          </ProduceFirstLayout>
        } 
      />

      {/* ============================================================
          DINERO PF
      ============================================================ */}
      
      {/* PF10 · Presupuesto y P&L de PF */}
      <Route 
        path="pf10" 
        element={
          <ProduceFirstLayout>
            <PresupuestoPyLPFView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PF9 · CxP de Produce First */}
      <Route 
        path="pf9" 
        element={
          <ProduceFirstLayout>
            <CxPProduceFirstView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PFBAN · Bancos de PF · Saldo y Flujo */}
      <Route 
        path="pfban" 
        element={
          <ProduceFirstLayout>
            <BancosPFSaldoFlujoView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PFNOM · Nómina y Gastos de Oficina PF */}
      <Route 
        path="pfnom" 
        element={
          <ProduceFirstLayout>
            <NominaGastosOficinaPFView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PFCONT · Contpaqi de PF · Equivalencias y Export */}
      <Route 
        path="pfcont" 
        element={
          <ProduceFirstLayout>
            <ContpaqiEquivalenciasExportView />
          </ProduceFirstLayout>
        } 
      />

      {/* ============================================================
          RESULTADO
      ============================================================ */}
      
      {/* PFREG · Registro de Liquidaciones */}
      <Route 
        path="pfreg" 
        element={
          <ProduceFirstLayout>
            <RegistroLiquidacionesView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* PFDASH · Dashboard de Produce First */}
      <Route 
        path="pfdash" 
        element={
          <ProduceFirstLayout>
            <DashboardProduceFirstView />
          </ProduceFirstLayout>
        } 
      />

      {/* ============================================================
          ADMINISTRACIÓN
      ============================================================ */}
      
      {/* PFUSR · Usuarios y Permisos de PF */}
      <Route 
        path="pfusr" 
        element={
          <ProduceFirstLayout>
            <UsuariosPermisosView />
          </ProduceFirstLayout>
        } 
      />

      {/* ============================================================
          PORTAL DE CLIENTES · PF-WEB1
      ============================================================ */}
      
      {/* PFW1 · Client Portal */}
      <Route 
        path="pfw1" 
        element={
          <ProduceFirstLayout>
            <PortalClientesView />
          </ProduceFirstLayout>
        } 
      />
      
      {/* Alias de acceso directo */}
      <Route 
        path="portal-clientes" 
        element={
          <ProduceFirstLayout>
            <PortalClientesView />
          </ProduceFirstLayout>
        } 
      />

      {/* ============================================================
          SUBMÓDULOS EXISTENTES (Integración)
      ============================================================ */}
      
      {/* Ruta de prueba */}
      <Route 
        path="test" 
        element={
          <ProduceFirstLayout>
            <div style={{ padding: '40px', backgroundColor: '#E7F5FF', minHeight: '100vh' }}>
              <h1 style={{ color: '#1864AB' }}>✅ TEST - Produce First Module Works!</h1>
              <p>Si ves esto, el módulo se cargó correctamente.</p>
            </div>
          </ProduceFirstLayout>
        } 
      />
      
      {/* Submódulo Grower - Todas las rutas de grower */}
      <Route 
        path="grower/*" 
        element={
          <ProduceFirstLayout>
            <GrowerModule />
          </ProduceFirstLayout>
        } 
      />
      
      {/* Submódulo Produce Cooling - Todas las rutas de cooling */}
      <Route 
        path="cooling/*" 
        element={
          <ProduceFirstLayout>
            <ProduceCoolingModule />
          </ProduceFirstLayout>
        } 
      />

      {/* ============================================================
          FALLBACK
      ============================================================ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

console.log('🔵 [ProduceFirst] Exportando componente...');

export default ProduceFirstModule;
