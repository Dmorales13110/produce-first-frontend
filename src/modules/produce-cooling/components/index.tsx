// src/modules/produce-cooling/index.ts

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProduceCoolingLayout } from '../ProduceCoolingLayout';
import { ReceptionScanView } from './ReceptionScan/index';

// Placeholder para submódulos en desarrollo
const PlaceholderModule = ({ title }: { title: string }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p style={{ color: '#6B7280' }}>Este submódulo está en construcción</p>
  </div>
);

// Componente principal del módulo Produce Cooling
const ProduceCoolingModule: React.FC = () => {
  return (
    <Routes>
      {/* Ruta principal: redirige a reception-scan */}
      <Route path="/" element={<Navigate to="reception-scan" replace />} />
      
      {/* ============================================================
          OPERACIÓN · ENFRÍA, ENHIELA, EMBARCA
      ============================================================ */}
      <Route path="reception-scan" element={<ProduceCoolingLayout><ReceptionScanView /></ProduceCoolingLayout>} />
      <Route path="trazabilidad-inventario" element={<ProduceCoolingLayout><PlaceholderModule title="PC1 · Trazabilidad e Inventario" /></ProduceCoolingLayout>} />
      <Route path="bitacoras-ventas-servicios" element={<ProduceCoolingLayout><PlaceholderModule title="PC4 · Bitácoras y Ventas de Servicios" /></ProduceCoolingLayout>} />
      <Route path="ordenes-embarque" element={<ProduceCoolingLayout><PlaceholderModule title="PCEMB · Órdenes de Embarque" /></ProduceCoolingLayout>} />

      {/* ============================================================
          COMPRAS
      ============================================================ */}
      <Route path="ordenes-compra" element={<ProduceCoolingLayout><PlaceholderModule title="PCOC · Órdenes de Compra de PC" /></ProduceCoolingLayout>} />
      <Route path="catalogos" element={<ProduceCoolingLayout><PlaceholderModule title="PCCAT · Catálogos de PC" /></ProduceCoolingLayout>} />

      {/* ============================================================
          DINERO
      ============================================================ */}
      <Route path="presupuesto" element={<ProduceCoolingLayout><PlaceholderModule title="PCPRE · Presupuesto de PC" /></ProduceCoolingLayout>} />
      <Route path="cxp" element={<ProduceCoolingLayout><PlaceholderModule title="PCCXP · CxP de PC" /></ProduceCoolingLayout>} />
      <Route path="cxc" element={<ProduceCoolingLayout><PlaceholderModule title="PCCXC · CxC de PC" /></ProduceCoolingLayout>} />
      <Route path="bancos" element={<ProduceCoolingLayout><PlaceholderModule title="PCBAN · Bancos de PC" /></ProduceCoolingLayout>} />
      <Route path="contpaqi" element={<ProduceCoolingLayout><PlaceholderModule title="PCCONT · Contpaqi de PC" /></ProduceCoolingLayout>} />

      {/* ============================================================
          PERSONAL
      ============================================================ */}
      <Route path="nomina" element={<ProduceCoolingLayout><PlaceholderModule title="PCNOM · Personal de Planta" /></ProduceCoolingLayout>} />

      {/* ============================================================
          PLANTA
      ============================================================ */}
      <Route path="mantenimiento" element={<ProduceCoolingLayout><PlaceholderModule title="PCMTO · Mantenimiento y Equipos" /></ProduceCoolingLayout>} />

      {/* ============================================================
          ADMINISTRACIÓN
      ============================================================ */}
      <Route path="usuarios-permisos" element={<ProduceCoolingLayout><PlaceholderModule title="PCUSR · Usuarios y Permisos de PC" /></ProduceCoolingLayout>} />

      {/* ============================================================
          RESULTADO
      ============================================================ */}
      <Route path="pl" element={<ProduceCoolingLayout><PlaceholderModule title="PCPL · P&L de PC" /></ProduceCoolingLayout>} />
      <Route path="dashboard" element={<ProduceCoolingLayout><PlaceholderModule title="PC5 · Dashboard de PC" /></ProduceCoolingLayout>} />

      {/* Fallback dentro del módulo */}
      <Route path="*" element={<Navigate to="reception-scan" replace />} />
    </Routes>
  );
};

export default ProduceCoolingModule;

// Exportaciones adicionales para uso directo
export * from '../ProduceCoolingLayout';
export * from './ReceptionScan/index';
export * from './ReceptionScan/hooks/useReceptionScan';
export * from '../types';
export * from '../services/receptionScanService';