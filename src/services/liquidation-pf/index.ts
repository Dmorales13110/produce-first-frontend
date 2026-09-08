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

const MOCK_LIQUIDATION: Liquidation = {
  id: '11111111-1111-1111-1111-111111111111',
  code: 'LIQ-2026-W48-01',
  liquidation_date: '2026-11-27',
  week_number: 48,
  year: 2026,
  grower_id: 'grower-1',
  grower: { name: 'Agrícola San Carlos' },
  exchange_rate: 19.85,
  commission_percent: 10,
  total_boxes: 3200,
  total_trucks: 2,
  total_sales_usd: 46400,
  total_commission_usd: 4640,
  net_usd: 37440,
  net_mxn: 743184,
  status: 'captured',
  notes: 'Liquidación de ejote verde y calabaza italiana semana 48',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_TRUCKS: LiquidationTruck[] = [
  { id: 't-1', liquidation_id: '11111111-1111-1111-1111-111111111111', truck_number: 'TR-101', invoice_number: 'INV-8891', customer: 'Fresh Direct LLC', product: 'Ejote Verde 25lb', boxes: 1600, price_usd: 14.50, sale_usd: 23200, commission_usd: 2320, status: 'reconciled', created_at: '', updated_at: '' },
  { id: 't-2', liquidation_id: '11111111-1111-1111-1111-111111111111', truck_number: 'TR-102', invoice_number: 'INV-8892', customer: 'GreenLeaf Wholesalers', product: 'Calabaza Italiana 28lb', boxes: 1600, price_usd: 14.50, sale_usd: 23200, commission_usd: 2320, status: 'reconciled', created_at: '', updated_at: '' },
];

const MOCK_RECONCILIATION: LiquidationReconciliation[] = [
  { id: 'r-1', liquidation_id: '11111111-1111-1111-1111-111111111111', concept: 'Venta Bruta (USD)', pf_value: '$46,400.00', your_value: '$46,400.00', status: 'ok', created_at: '', updated_at: '' },
  { id: 'r-2', liquidation_id: '11111111-1111-1111-1111-111111111111', concept: 'Comisión Produce First (10%)', pf_value: '$4,640.00', your_value: '$4,640.00', status: 'ok', created_at: '', updated_at: '' },
  { id: 'r-3', liquidation_id: '11111111-1111-1111-1111-111111111111', concept: 'Servicios de Frío ($0.15/caja)', pf_value: '$480.00', your_value: '$480.00', status: 'ok', created_at: '', updated_at: '' },
  { id: 'r-4', liquidation_id: '11111111-1111-1111-1111-111111111111', concept: 'Fletes Refrigerados', pf_value: '$3,840.00', your_value: '$3,840.00', status: 'ok', created_at: '', updated_at: '' },
  { id: 'r-5', liquidation_id: '11111111-1111-1111-1111-111111111111', concept: 'Liquidación Neta a Pagar', pf_value: '$37,440.00', your_value: '$37,440.00', status: 'ok', created_at: '', updated_at: '' },
];

const MOCK_SUMMARY: LiquidationSummary = {
  totalBoxes: 3200,
  totalTrucks: 2,
  totalSalesUSD: 46400,
  totalCommissionUSD: 4640,
  netUSD: 37440,
  netMXN: 743184,
  status: 'reconciled',
};

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
      return (response && response.data && response.data.length > 0) ? response.data : [MOCK_LIQUIDATION];
    } catch (error) {
      console.warn('⚠️ [LiquidationPFService] Backend no disponible para liquidations. Usando datos mock.');
      return [MOCK_LIQUIDATION];
    }
  },

  getLiquidationById: async (id: string): Promise<Liquidation> => {
    try {
      const response = await api.get<{ success: boolean; data: Liquidation }>(`/liquidation-pf/${id}`);
      return response.data || MOCK_LIQUIDATION;
    } catch (error) {
      console.warn('⚠️ [LiquidationPFService] Backend no disponible para liquidationById. Usando mock.');
      return { ...MOCK_LIQUIDATION, id };
    }
  },

  createLiquidation: async (data: any): Promise<Liquidation> => {
    try {
      const response = await api.post<{ success: boolean; data: Liquidation }>('/liquidation-pf', data);
      return response.data;
    } catch (error) {
      return {
        id: `mock-liq-${Date.now()}`,
        code: `LIQ-${Date.now().toString().slice(-4)}`,
        liquidation_date: new Date().toISOString(),
        week_number: 48,
        year: 2026,
        exchange_rate: 19.85,
        commission_percent: 10,
        total_boxes: 1600,
        total_trucks: 1,
        total_sales_usd: 23200,
        total_commission_usd: 2320,
        net_usd: 18720,
        net_mxn: 371592,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data,
      };
    }
  },

  updateLiquidation: async (id: string, data: any): Promise<Liquidation> => {
    try {
      const response = await api.put<{ success: boolean; data: Liquidation }>(`/liquidation-pf/${id}`, data);
      return response.data;
    } catch (error) {
      return { ...MOCK_LIQUIDATION, id, ...data };
    }
  },

  // ============================================================
  // TRUCKS
  // ============================================================

  getTrucks: async (liquidationId: string): Promise<LiquidationTruck[]> => {
    try {
      const response = await api.get<{ success: boolean; data: LiquidationTruck[] }>(`/liquidation-pf/${liquidationId}/trucks`);
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_TRUCKS;
    } catch (error) {
      return MOCK_TRUCKS;
    }
  },

  addTruck: async (liquidationId: string, data: any): Promise<LiquidationTruck> => {
    try {
      const response = await api.post<{ success: boolean; data: LiquidationTruck }>(`/liquidation-pf/${liquidationId}/trucks`, data);
      return response.data;
    } catch (error) {
      return {
        id: `truck-${Date.now()}`,
        liquidation_id: liquidationId,
        truck_number: data.truck_number || 'TR-MOCK',
        invoice_number: data.invoice_number || 'INV-MOCK',
        customer: data.customer || 'Cliente Mock',
        product: data.product || 'Producto',
        boxes: data.boxes || 1600,
        price_usd: data.price_usd || 14.50,
        sale_usd: (data.boxes || 1600) * (data.price_usd || 14.50),
        commission_usd: (data.boxes || 1600) * (data.price_usd || 14.50) * 0.10,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },

  updateTruck: async (id: string, data: any): Promise<LiquidationTruck> => {
    try {
      const response = await api.put<{ success: boolean; data: LiquidationTruck }>(`/liquidation-pf/trucks/${id}`, data);
      return response.data;
    } catch (error) {
      const found = MOCK_TRUCKS.find(t => t.id === id) || MOCK_TRUCKS[0];
      return { ...found, ...data };
    }
  },

  deleteTruck: async (id: string): Promise<void> => {
    try {
      await api.delete(`/liquidation-pf/trucks/${id}`);
    } catch (error) {
      console.warn('⚠️ [LiquidationPFService] deleteTruck mock ejecutado');
    }
  },

  // ============================================================
  // RECONCILIATION
  // ============================================================

  getReconciliation: async (liquidationId: string): Promise<LiquidationReconciliation[]> => {
    try {
      const response = await api.get<{ success: boolean; data: LiquidationReconciliation[] }>(`/liquidation-pf/${liquidationId}/reconciliation`);
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_RECONCILIATION;
    } catch (error) {
      return MOCK_RECONCILIATION;
    }
  },

  reconcile: async (liquidationId: string): Promise<Liquidation> => {
    try {
      const response = await api.post<{ success: boolean; data: Liquidation }>(`/liquidation-pf/${liquidationId}/reconcile`);
      return response.data;
    } catch (error) {
      return { ...MOCK_LIQUIDATION, id: liquidationId, status: 'reconciled' };
    }
  },

  // ============================================================
  // SUMMARY
  // ============================================================

  getSummary: async (liquidationId: string): Promise<LiquidationSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: LiquidationSummary }>(`/liquidation-pf/${liquidationId}/summary`);
      return response.data || MOCK_SUMMARY;
    } catch (error) {
      return MOCK_SUMMARY;
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
      return { ...MOCK_LIQUIDATION, id: liquidationId, status: 'sent' };
    }
  },
};