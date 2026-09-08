// OrdenesCompraPC/hooks/useOrdenesCompraPC.ts

import { useState, useCallback, useEffect } from 'react';
import { PurchaseOrderService } from '../../../../services/purchase-orders';
import type { PurchaseOrder } from '../../../../services/purchase-orders';

interface OrdenCompraPCStats {
  totalOCs: number;
  abiertas: number;
  recibidas: number;
  totalComprometido: number;
  conciliadas: number;
  urgentes: number;
}

export const useOrdenesCompraPC = () => {
  const [ordenes, setOrdenes] = useState<PurchaseOrder[]>([]);
  const [stats, setStats] = useState<OrdenCompraPCStats>({
    totalOCs: 0,
    abiertas: 0,
    recibidas: 0,
    totalComprometido: 0,
    conciliadas: 0,
    urgentes: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ proveedor: 'Todos', categoria: 'Todas', estatus: 'Todas' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const orders = await PurchaseOrderService.getOrders({
        status: filters.estatus === 'Todas' ? undefined : filters.estatus,
      });

      setOrdenes(orders);

      // Calcular estadísticas
      setStats({
        totalOCs: orders.length,
        abiertas: orders.filter(o => o.status === 'draft' || o.status === 'authorized').length,
        recibidas: orders.filter(o => o.status === 'received').length,
        totalComprometido: orders.reduce((sum, o) => sum + o.total, 0),
        conciliadas: orders.filter(o => o.status === 'invoiced').length,
        urgentes: orders.filter(o => o.status === 'draft').length,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ordenes,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: loadData,
  };
};