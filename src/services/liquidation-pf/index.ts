import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface Liquidation {
  id: string;
  code: string;
  liquidation_date: string;
  week_number: number;
  year: number;
  grower_id?: string;
  grower?: any;
  exchange_rate: number;
  commission_percent: number;
  total_boxes: number;
  total_trucks: number;
  total_sales_usd: number;
  total_commission_usd: number;
  net_usd: number;
  net_mxn: number;
  status: 'draft' | 'captured' | 'reconciled' | 'sent';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LiquidationTruck {
  id: string;
  liquidation_id: string;
  truck_number: string;
  invoice_number: string;
  customer: string;
  product: string;
  boxes: number;
  price_usd: number;
  sale_usd: number;
  commission_usd: number;
  status: 'pending' | 'reconciled' | 'discrepancy';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LiquidationReconciliation {
  id: string;
  liquidation_id: string;
  concept: string;
  pf_value: string;
  your_value: string;
  status: 'ok' | 'discrepancy';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LiquidationSummary {
  totalBoxes: number;
  totalTrucks: number;
  totalSalesUSD: number;
  totalCommissionUSD: number;
  netUSD: number;
  netMXN: number;
  status: string;
}

export interface LiquidationFilters {
  status?: string;
  weekNumber?: number;
  year?: number;
  growerId?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const LiquidationPFService = {
  // ============================================================
  // LIQUIDATIONS
  // ============================================================

  getLiquidations: async (filters?: LiquidationFilters): Promise<Liquidation[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.growerId) queryParams.append('growerId', filters.growerId);

      const url = `/liquidation-pf${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: Liquidation[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [LiquidationPFService] getLiquidations error:', error);
      throw error;
    }
  },

  getLiquidationById: async (id: string): Promise<Liquidation> => {
    try {
      const response = await api.get<{ success: boolean; data: Liquidation }>(`/liquidation-pf/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [LiquidationPFService] getLiquidationById error:', error);
      throw error;
    }
  },

  createLiquidation: async (data: any): Promise<Liquidation> => {
    try {
      const response = await api.post<{ success: boolean; data: Liquidation }>('/liquidation-pf', data);
      return response.data;
    } catch (error) {
      console.error('❌ [LiquidationPFService] createLiquidation error:', error);
      throw error;
    }
  },

  updateLiquidation: async (id: string, data: any): Promise<Liquidation> => {
    try {
      const response = await api.put<{ success: boolean; data: Liquidation }>(`/liquidation-pf/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [LiquidationPFService] updateLiquidation error:', error);
      throw error;
    }
  },

  // ============================================================
  // TRUCKS
  // ============================================================

  getTrucks: async (liquidationId: string): Promise<LiquidationTruck[]> => {
    try {
      const response = await api.get<{ success: boolean; data: LiquidationTruck[] }>(`/liquidation-pf/${liquidationId}/trucks`);
      return response.data;
    } catch (error) {
      console.error('❌ [LiquidationPFService] getTrucks error:', error);
      throw error;
    }
  },

  addTruck: async (liquidationId: string, data: any): Promise<LiquidationTruck> => {
    try {
      const response = await api.post<{ success: boolean; data: LiquidationTruck }>(`/liquidation-pf/${liquidationId}/trucks`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [LiquidationPFService] addTruck error:', error);
      throw error;
    }
  },

  updateTruck: async (id: string, data: any): Promise<LiquidationTruck> => {
    try {
      const response = await api.put<{ success: boolean; data: LiquidationTruck }>(`/liquidation-pf/trucks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [LiquidationPFService] updateTruck error:', error);
      throw error;
    }
  },

  deleteTruck: async (id: string): Promise<void> => {
    try {
      await api.delete(`/liquidation-pf/trucks/${id}`);
    } catch (error) {
      console.error('❌ [LiquidationPFService] deleteTruck error:', error);
      throw error;
    }
  },

  // ============================================================
  // RECONCILIATION
  // ============================================================

  getReconciliation: async (liquidationId: string): Promise<LiquidationReconciliation[]> => {
    try {
      const response = await api.get<{ success: boolean; data: LiquidationReconciliation[] }>(`/liquidation-pf/${liquidationId}/reconciliation`);
      return response.data;
    } catch (error) {
      console.error('❌ [LiquidationPFService] getReconciliation error:', error);
      throw error;
    }
  },

  reconcile: async (liquidationId: string): Promise<Liquidation> => {
    try {
      const response = await api.post<{ success: boolean; data: Liquidation }>(`/liquidation-pf/${liquidationId}/reconcile`);
      return response.data;
    } catch (error) {
      console.error('❌ [LiquidationPFService] reconcile error:', error);
      throw error;
    }
  },

  // ============================================================
  // SUMMARY
  // ============================================================

  getSummary: async (liquidationId: string): Promise<LiquidationSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: LiquidationSummary }>(`/liquidation-pf/${liquidationId}/summary`);
      return response.data;
    } catch (error) {
      console.error('❌ [LiquidationPFService] getSummary error:', error);
      throw error;
    }
  },

  // ============================================================
  // SEND TO CXC
  // ============================================================

  sendToCXC: async (liquidationId: string): Promise<Liquidation> => {
    try {
      const response = await api.post<{ success: boolean; data: Liquidation }>(`/liquidation-pf/${liquidationId}/send-to-cxc`);
      return response.data;
    } catch (error) {
      console.error('❌ [LiquidationPFService] sendToCXC error:', error);
      throw error;
    }
  },
};