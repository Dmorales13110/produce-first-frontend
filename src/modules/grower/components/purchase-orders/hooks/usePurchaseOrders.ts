// src/modules/grower/hooks/usePurchaseOrders.ts
import { useState, useEffect, useCallback } from 'react';
import { PurchaseOrderService, type PurchaseOrder, type PurchaseOrderSummary, type PurchaseOrderFilters } from '../../../../../services/purchase-orders';

interface UsePurchaseOrdersReturn {
  orders: PurchaseOrder[];
  summary: PurchaseOrderSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: PurchaseOrderFilters;
  setFilters: (filters: PurchaseOrderFilters) => void;
  refresh: () => Promise<void>;
  createOrder: (data: any) => Promise<PurchaseOrder>;
  updateStatus: (id: string, status: string) => Promise<PurchaseOrder>;
  deleteOrder: (id: string) => Promise<void>;
}

export const usePurchaseOrders = (): UsePurchaseOrdersReturn => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [summary, setSummary] = useState<PurchaseOrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PurchaseOrderFilters>({});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [ordersData, summaryData] = await Promise.all([
        PurchaseOrderService.getOrders(filters),
        PurchaseOrderService.getSummary(),
      ]);
      setOrders(ordersData);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [usePurchaseOrders] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar órdenes');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createOrder = useCallback(async (data: any): Promise<PurchaseOrder> => {
    try {
      const result = await PurchaseOrderService.createOrder(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [usePurchaseOrders] createOrder error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateStatus = useCallback(async (id: string, status: string): Promise<PurchaseOrder> => {
    try {
      const result = await PurchaseOrderService.updateStatus(id, status);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [usePurchaseOrders] updateStatus error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteOrder = useCallback(async (id: string): Promise<void> => {
    try {
      await PurchaseOrderService.deleteOrder(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [usePurchaseOrders] deleteOrder error:', err);
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    orders,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
    createOrder,
    updateStatus,
    deleteOrder,
  };
};