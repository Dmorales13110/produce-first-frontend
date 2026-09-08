// OrdenesEmbarque/hooks/useOrdenesEmbarque.ts

import { useState, useCallback, useEffect } from 'react';
import { PurchaseOrderService } from '../../../../services/purchase-orders';

// Definir interfaces
interface OrdenEmbarque {
  id: string;
  code: string;
  cliente: string;
  producto: string;
  cajas: number;
  fecha: string;
  status: string;
}

interface CargaItem {
  id: number;
  folio: string;
  producto: string;
  instruido: number;
  real: number | string;
  checked: boolean;
}

interface ProformaItem {
  id: string;
  folio: string;
  producto: string;
  instruido: number;
  disp: number;
  alcanza: 'ok' | 'justo' | 'insuficiente';
}

interface OrdenesEmbarqueStats {
  bandejaHoy: number;
  porAceptar: number;
  enCarga: number;
  confirmadasHoy: number;
  cajasConfirmadas: number;
  diferencias: number;
  proformasPendientes: number;
}

// Datos mock para proformas y cargas mientras el backend no esté listo
const MOCK_PROFORMAS: ProformaItem[] = [
  { id: '1', folio: 'JAV-0508', producto: 'Bok Choy Mieu', instruido: 180, disp: 200, alcanza: 'ok' },
  { id: '2', folio: 'JAV-0510', producto: 'Shanghai Bok', instruido: 450, disp: 430, alcanza: 'justo' },
];

const MOCK_CARGAS: CargaItem[] = [
  { id: 1, folio: 'JAV-0508', producto: 'Bok Choy Mieu', instruido: 180, real: '', checked: false },
  { id: 2, folio: 'JAV-0510', producto: 'Shanghai Bok', instruido: 450, real: '', checked: false },
  { id: 3, folio: 'JAV-0512', producto: 'Coliflor', instruido: 315, real: '', checked: false },
];

export const useOrdenesEmbarque = () => {
  const [cargas, setCargas] = useState<CargaItem[]>([]);
  const [proformas, setProformas] = useState<ProformaItem[]>([]);
  const [ordenes, setOrdenes] = useState<OrdenEmbarque[]>([]);
  const [stats, setStats] = useState<OrdenesEmbarqueStats>({
    bandejaHoy: 0,
    porAceptar: 0,
    enCarga: 0,
    confirmadasHoy: 0,
    cajasConfirmadas: 0,
    diferencias: 0,
    proformasPendientes: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ cliente: 'Todos', estatus: 'Todas', rango: 'Semana' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Obtener órdenes de compra (embarques)
      const orders = await PurchaseOrderService.getOrders({
        status: filters.estatus === 'Todas' ? undefined : filters.estatus,
      });

      // Mapear a OrdenEmbarque
      const ordenesData: OrdenEmbarque[] = orders.map(o => ({
        id: o.id,
        code: o.code,
        cliente: o.proveedor || 'N/A',
        producto: o.items?.[0]?.concept || 'N/A',
        cajas: Math.round(o.items?.[0]?.quantity || 0),
        fecha: o.entrega_requerida || o.created_at,
        status: o.status || 'draft',
      }));
      setOrdenes(ordenesData);

      // 2. Establecer datos mock para proformas y cargas (mientras el backend no esté listo)
      setProformas(MOCK_PROFORMAS);
      setCargas(MOCK_CARGAS);

      // 3. Calcular estadísticas
      setStats({
        bandejaHoy: orders.filter(o => o.status === 'draft').length,
        porAceptar: orders.filter(o => o.status === 'authorized').length,
        enCarga: orders.filter(o => o.status === 'received').length,
        confirmadasHoy: orders.filter(o => o.status === 'invoiced').length,
        cajasConfirmadas: orders.reduce((sum, o) => sum + (o.items?.[0]?.quantity || 0), 0),
        diferencias: 0,
        proformasPendientes: orders.filter(o => o.status === 'draft').length,
      });

    } catch (err) {
      console.error('❌ [useOrdenesEmbarque] Error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
      
      // ✅ En caso de error, usar datos mock
      setProformas(MOCK_PROFORMAS);
      setCargas(MOCK_CARGAS);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // ✅ Funciones para manejar cargas
  const toggleCarga = useCallback((id: number) => {
    setCargas(prev => prev.map(c => 
      c.id === id ? { ...c, checked: !c.checked } : c
    ));
  }, []);

  const updateCarga = useCallback((id: number, value: number | string) => {
    setCargas(prev => prev.map(c => 
      c.id === id ? { ...c, real: value } : c
    ));
  }, []);

  // ✅ Funciones para aceptar proforma y confirmar carga
  const aceptarProforma = useCallback(async () => {
    // Simular llamada al backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Marcar proformas como aceptadas
    setProformas([]);
    
    return { success: true, message: 'Proforma aceptada correctamente' };
  }, []);

  const confirmarCarga = useCallback(async (data: any) => {
    // Simular llamada al backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Resetear cargas
    setCargas(prev => prev.map(c => ({ ...c, checked: false, real: '' })));
    
    return { success: true, message: 'Carga confirmada correctamente' };
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    cargas,
    proformas,
    ordenes,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    toggleCarga,
    updateCarga,
    aceptarProforma,
    confirmarCarga,
    refresh: loadData,
  };
};