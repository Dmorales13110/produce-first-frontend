// src/services/purchase-orders/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface PurchaseOrder {
  id: string;
  code: string;
  empresa: string;
  proveedor: string;
  proveedor_id?: string;
  categoria: string;
  destino: string;
  entrega_requerida: string;
  items: PurchaseOrderItem[];
  total: number;
  status: 'draft' | 'authorized' | 'received' | 'cancelled' | 'invoiced';
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  concept: string;
  sku?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
}

export interface CreatePurchaseOrderInput {
  empresa: string;
  proveedor: string;
  proveedor_id?: string;
  categoria: string;
  destino: string;
  entrega_requerida: string;
  items: {
    concept: string;
    sku?: string;
    quantity: number;
    unit: string;
    unit_price: number;
  }[];
}

export interface PurchaseOrderSummary {
  totalOrders: number;
  totalAmount: number;
  received: number;
  authorized: number;
  pending: number;
  conciliated: number;
}

export interface PurchaseOrderFilters {
  status?: string;
  proveedor?: string;
  categoria?: string;
  fromDate?: string;
  toDate?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const PurchaseOrderService = {
  /**
   * Obtener todas las órdenes de compra
   * GET /purchase-orders
   */
  getOrders: async (filters?: PurchaseOrderFilters): Promise<PurchaseOrder[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.proveedor) queryParams.append('proveedor', filters.proveedor);
      if (filters?.categoria) queryParams.append('categoria', filters.categoria);
      if (filters?.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters?.toDate) queryParams.append('toDate', filters.toDate);

      const url = `/purchase-orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: PurchaseOrder[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PurchaseOrderService] getOrders error:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen de órdenes
   * GET /purchase-orders/summary
   */
  getSummary: async (): Promise<PurchaseOrderSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: PurchaseOrderSummary }>('/purchase-orders/summary');
      return response.data;
    } catch (error) {
      console.error('❌ [PurchaseOrderService] getSummary error:', error);
      throw error;
    }
  },

  /**
   * Crear nueva orden de compra
   * POST /purchase-orders
   */
  createOrder: async (input: CreatePurchaseOrderInput): Promise<PurchaseOrder> => {
    try {
      const response = await api.post<{ success: boolean; data: PurchaseOrder }>('/purchase-orders', input);
      return response.data;
    } catch (error) {
      console.error('❌ [PurchaseOrderService] createOrder error:', error);
      throw error;
    }
  },

  /**
   * Actualizar estado de orden
   * PATCH /purchase-orders/:id/status
   */
  updateStatus: async (id: string, status: string): Promise<PurchaseOrder> => {
    try {
      const response = await api.patch<{ success: boolean; data: PurchaseOrder }>(
        `/purchase-orders/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('❌ [PurchaseOrderService] updateStatus error:', error);
      throw error;
    }
  },

  /**
   * Eliminar orden
   * DELETE /purchase-orders/:id
   */
  deleteOrder: async (id: string): Promise<void> => {
    try {
      await api.delete(`/purchase-orders/${id}`);
    } catch (error) {
      console.error('❌ [PurchaseOrderService] deleteOrder error:', error);
      throw error;
    }
  },

  /**
   * Obtener orden por ID
   * GET /purchase-orders/:id
   */
  getOrderById: async (id: string): Promise<PurchaseOrder> => {
    try {
      const response = await api.get<{ success: boolean; data: PurchaseOrder }>(`/purchase-orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [PurchaseOrderService] getOrderById error:', error);
      throw error;
    }
  },
};