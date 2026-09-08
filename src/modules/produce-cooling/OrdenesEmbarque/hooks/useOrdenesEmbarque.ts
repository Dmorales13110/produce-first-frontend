// OrdenesEmbarque/hooks/useOrdenesEmbarque.ts

import { useState, useCallback, useEffect } from 'react';
import { PurchaseOrderService } from '../../../../services/purchase-orders';
import { ordenesEmbarqueService } from '../services/ordenesEmbarqueService';
import type {
  CargaItem,
  ProformaItem,
  OrdenEmbarque,
  OrdenesEmbarqueStats,
} from '../../types';

export const useOrdenesEmbarque = () => {
  const [filters, setFilters] = useState({ cliente: 'Todos', estatus: 'Todas', rango: 'Semana' });
  const [cargas, setCargas] = useState<CargaItem[]>(() => ordenesEmbarqueService.getCargas());
  const [proformas, setProformas] = useState<ProformaItem[]>(() => ordenesEmbarqueService.getProformas());
  const [ordenes, setOrdenes] = useState<OrdenEmbarque[]>(() => ordenesEmbarqueService.getOrdenes());
  const [stats, setStats] = useState<OrdenesEmbarqueStats>(() => ordenesEmbarqueService.getStats());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Obtener órdenes de compra (embarques) del backend
      const orders = await PurchaseOrderService.getOrders();

      if (orders && orders.length > 0) {
        // Mapear a OrdenEmbarque del módulo produce-cooling
        const mappedOrdenes: OrdenEmbarque[] = orders.map(o => {
          let estatus = 'por aceptar';
          let color = 'blue';
          let aceptada = '—';
          let confirmada = '—';

          if (o.status === 'authorized') {
            estatus = 'por aceptar';
            aceptada = '✓';
            color = 'blue';
          } else if (o.status === 'received') {
            estatus = 'cargando';
            aceptada = '✓';
            confirmada = 'en carga';
            color = 'amber';
          } else if (o.status === 'invoiced') {
            estatus = 'confirmada';
            aceptada = '✓';
            confirmada = '✓';
            color = 'teal';
          }

          const cajasTotal = o.items?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || 0;

          return {
            proforma: o.code || 'PRF-N/A',
            cliente: o.proveedor || 'Cliente General',
            salida: o.entrega_requerida ? new Date(o.entrega_requerida).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '—',
            cajas: cajasTotal.toLocaleString(),
            aceptada,
            confirmada,
            estatus,
            color,
          };
        });

        // Filtrar según filtros seleccionados
        let filtered = mappedOrdenes;
        if (filters.cliente && filters.cliente !== 'Todos') {
          filtered = filtered.filter(o => o.cliente === filters.cliente);
        }
        if (filters.estatus && filters.estatus !== 'Todas') {
          filtered = filtered.filter(o => o.estatus === filters.estatus);
        }

        setOrdenes(filtered.length > 0 ? filtered : ordenesEmbarqueService.getOrdenes(filters));
      } else {
        setOrdenes(ordenesEmbarqueService.getOrdenes(filters));
      }

      setCargas(ordenesEmbarqueService.getCargas());
      setProformas(ordenesEmbarqueService.getProformas());
      setStats(ordenesEmbarqueService.getStats());
    } catch (err) {
      console.warn('⚠️ [useOrdenesEmbarque] Backend no disponible, usando mock:', err);
      setOrdenes(ordenesEmbarqueService.getOrdenes(filters));
      setCargas(ordenesEmbarqueService.getCargas());
      setProformas(ordenesEmbarqueService.getProformas());
      setStats(ordenesEmbarqueService.getStats());
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Manejar cargas
  const toggleCarga = useCallback((id: number) => {
    const updated = ordenesEmbarqueService.toggleCarga(id);
    if (updated) {
      setCargas(ordenesEmbarqueService.getCargas());
    }
  }, []);

  const updateCarga = useCallback((id: number, value: number | string) => {
    const updated = ordenesEmbarqueService.updateCarga(id, { real: value });
    if (updated) {
      setCargas(ordenesEmbarqueService.getCargas());
    }
  }, []);

  // Acciones
  const aceptarProforma = useCallback(async () => {
    const res = ordenesEmbarqueService.aceptarProforma();
    setProformas(ordenesEmbarqueService.getProformas());
    return res;
  }, []);

  const confirmarCarga = useCallback(async (data: any) => {
    const res = ordenesEmbarqueService.confirmarCarga(data);
    setCargas(ordenesEmbarqueService.getCargas());
    return res;
  }, []);

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