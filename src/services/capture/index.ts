// src/services/capture/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface Grower {
  id: string;
  legal_name: string;
  commercial_name: string;
  rfc: string | null;
  is_active: boolean;
  phone: string | null;
  email: string;
}

export interface Lot {
  id: string;
  code: string;
  name: string;
  grower_id: string;
  grower_name?: string;
  area_hectareas: number;
  location: string | null;
  is_active: boolean;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  quantity: number;
  unit_price: number;
}

export interface HarvestReceptionInput {
  lot_id: string;
  grower_id: string;
  reception_date: string;
  good_boxes: number;
  rejected_boxes?: number;
  weight_kg: number;
  observations?: string | null;
  received_by: string;
  quality_inspector?: string | null;
  status?: string;
}

export interface HarvestReceptionResponse {
  id: string;
  code: string;
  lot_id: string;
  lot_name?: string;
  grower_id: string;
  grower_name?: string;
  reception_date: string;
  good_boxes: number;
  rejected_boxes: number;
  total_boxes: number;
  quality_percentage: number;
  weight_kg: number;
  advance_amount_usd: number | null;
  paid_amount_usd: number | null;
  pending_amount_usd: number | null;
  total_value_usd: number | null;
  avg_weight_per_box: number;
  status: string;
  received_by: string;
  quality_inspector: string | null;
  quality_notes: string | null;
  observations: string | null;
  created_at: string;
  updated_at: string;
}

export interface QualityInspectionInput {
  harvest_reception_id: string;
  inspector_id: string;
  inspected_boxes: {
    box_number: number;
    is_approved: boolean;
    rejection_reason?: string | null;
    rejection_notes?: string | null;
  }[];
  notes?: string | null;
}

export interface QualitySummary {
  totalInspected: number;
  approved: number;
  rejected: number;
  approvalRate: number;
  topRejectionReasons: {
    reason: string;
    count: number;
  }[];
}

export interface PendingRejection {
  id: string;
  harvest_reception_id: string;
  grower_id: string;
  rejected_boxes: number;
  rejection_reasons: Record<string, number>;
  status: string;
  created_at: string;
  harvest_receptions?: {
    code: string;
    harvest_date: string;
  };
}

export interface ExpenseInput {
  type: 'transport' | 'packaging' | 'labor' | 'maintenance' | 'supplies' | 'other';
  category: string;
  subcategory?: string | null;
  amount: number;
  date: string;
  description: string;
  lot_id?: string | null;
  harvest_id?: string | null;
  notes?: string | null;
  provider?: string | null;
}

// ============================================================
// SERVICIO
// ============================================================

export const CaptureService = {
  // ============================================================
  // GROWERS
  // ============================================================

  getGrowers: async (): Promise<Grower[]> => {
    try {
      const response = await api.get<{ success: boolean; data: Grower[] }>('/growers');
      return response.data.filter(g => g.is_active !== false);
    } catch (error) {
      console.error('❌ [CaptureService] getGrowers error:', error);
      throw error;
    }
  },

  getGrowerById: async (id: string): Promise<Grower> => {
    try {
      const response = await api.get<{ success: boolean; data: Grower }>(`/growers/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [CaptureService] getGrowerById error:', error);
      throw error;
    }
  },

  // ============================================================
  // LOTS
  // ============================================================

  getLots: async (): Promise<Lot[]> => {
    try {
      const response = await api.get<{ success: boolean; data: Lot[] }>('/lots');
      return response.data.filter(lot => lot.is_active !== false);
    } catch (error) {
      console.error('❌ [CaptureService] getLots error:', error);
      throw error;
    }
  },

  getLotById: async (id: string): Promise<Lot> => {
    try {
      const response = await api.get<{ success: boolean; data: Lot }>(`/lots/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [CaptureService] getLotById error:', error);
      throw error;
    }
  },

  getLotsByGrower: async (growerId: string): Promise<Lot[]> => {
    try {
      const response = await api.get<{ success: boolean; data: Lot[] }>(`/lots/grower/${growerId}`);
      return response.data.filter(lot => lot.is_active !== false);
    } catch (error) {
      console.error('❌ [CaptureService] getLotsByGrower error:', error);
      throw error;
    }
  },

  // ============================================================
  // PRODUCTS (Inventory Items)
  // ============================================================

  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get<{ success: boolean; data: Product[] }>('/inventory/items');
      return response.data;
    } catch (error) {
      console.error('❌ [CaptureService] getProducts error:', error);
      throw error;
    }
  },

  // ============================================================
  // HARVEST RECEPTIONS
  // ============================================================

  createHarvestReception: async (input: HarvestReceptionInput): Promise<HarvestReceptionResponse> => {
    try {
      const response = await api.post<{ success: boolean; data: HarvestReceptionResponse }>(
        '/harvest-receptions',
        input
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CaptureService] createHarvestReception error:', error);
      throw error;
    }
  },

  getHarvestReceptions: async (params?: {
    lot_id?: string;
    grower_id?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<HarvestReceptionResponse[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.lot_id) queryParams.append('lot_id', params.lot_id);
      if (params?.grower_id) queryParams.append('grower_id', params.grower_id);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params?.toDate) queryParams.append('toDate', params.toDate);

      const url = `/harvest-receptions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: any[] }>(url);
      
      const data = response.data || response;
      
      if (!Array.isArray(data)) {
        console.warn('⚠️ [CaptureService] Los datos no son un array:', data);
        return [];
      }

      return data.map((item: any) => ({
        id: item.id,
        code: item.code || `REC-${item.id?.substring(0, 8) || '0000'}`,
        lot_id: item.lot_id || 'N/A',
        lot_name: item.lot_name || item.lot?.name || 'N/A',
        grower_id: item.grower_id || 'N/A',
        grower_name: item.grower_name || item.grower?.commercial_name || item.grower?.name || 'N/A',
        reception_date: item.reception_date || item.harvest_date || item.created_at || new Date().toISOString(),
        good_boxes: item.good_boxes || 0,
        rejected_boxes: item.rejected_boxes || 0,
        total_boxes: item.total_boxes || (item.good_boxes || 0) + (item.rejected_boxes || 0),
        quality_percentage: item.quality_percentage || 0,
        weight_kg: item.weight_kg || 0,
        advance_amount_usd: item.advance_amount_usd || null,
        paid_amount_usd: item.paid_amount_usd || null,
        pending_amount_usd: item.pending_amount_usd || null,
        total_value_usd: item.total_value_usd || null,
        avg_weight_per_box: item.avg_weight_per_box || 0,
        status: item.status || 'pending',
        received_by: item.received_by || 'N/A',
        quality_inspector: item.quality_inspector || null,
        quality_notes: item.quality_notes || null,
        observations: item.observations || null,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    } catch (error) {
      console.error('❌ [CaptureService] getHarvestReceptions error:', error);
      throw error;
    }
  },

  getHarvestReceptionById: async (id: string): Promise<HarvestReceptionResponse> => {
    try {
      const response = await api.get<{ success: boolean; data: any }>(`/harvest-receptions/${id}`);
      const item = response.data;
      
      return {
        id: item.id,
        code: item.code || `REC-${item.id?.substring(0, 8) || '0000'}`,
        lot_id: item.lot_id || 'N/A',
        lot_name: item.lot_name || item.lot?.name || 'N/A',
        grower_id: item.grower_id || 'N/A',
        grower_name: item.grower_name || item.grower?.commercial_name || item.grower?.name || 'N/A',
        reception_date: item.reception_date || item.harvest_date || item.created_at || new Date().toISOString(),
        good_boxes: item.good_boxes || 0,
        rejected_boxes: item.rejected_boxes || 0,
        total_boxes: item.total_boxes || (item.good_boxes || 0) + (item.rejected_boxes || 0),
        quality_percentage: item.quality_percentage || 0,
        weight_kg: item.weight_kg || 0,
        advance_amount_usd: item.advance_amount_usd || null,
        paid_amount_usd: item.paid_amount_usd || null,
        pending_amount_usd: item.pending_amount_usd || null,
        total_value_usd: item.total_value_usd || null,
        avg_weight_per_box: item.avg_weight_per_box || 0,
        status: item.status || 'pending',
        received_by: item.received_by || 'N/A',
        quality_inspector: item.quality_inspector || null,
        quality_notes: item.quality_notes || null,
        observations: item.observations || null,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    } catch (error) {
      console.error('❌ [CaptureService] getHarvestReceptionById error:', error);
      throw error;
    }
  },

  updateHarvestReceptionStatus: async (
    id: string,
    status: string,
    advance_amount_usd?: number
  ): Promise<HarvestReceptionResponse> => {
    try {
      const response = await api.patch<{ success: boolean; data: any }>(
        `/harvest-receptions/${id}/status`,
        { status, advance_amount_usd }
      );
      const item = response.data;
      
      return {
        id: item.id,
        code: item.code || `REC-${item.id?.substring(0, 8) || '0000'}`,
        lot_id: item.lot_id || 'N/A',
        lot_name: item.lot_name || item.lot?.name || 'N/A',
        grower_id: item.grower_id || 'N/A',
        grower_name: item.grower_name || item.grower?.commercial_name || item.grower?.name || 'N/A',
        reception_date: item.reception_date || item.harvest_date || item.created_at || new Date().toISOString(),
        good_boxes: item.good_boxes || 0,
        rejected_boxes: item.rejected_boxes || 0,
        total_boxes: item.total_boxes || (item.good_boxes || 0) + (item.rejected_boxes || 0),
        quality_percentage: item.quality_percentage || 0,
        weight_kg: item.weight_kg || 0,
        advance_amount_usd: item.advance_amount_usd || null,
        paid_amount_usd: item.paid_amount_usd || null,
        pending_amount_usd: item.pending_amount_usd || null,
        total_value_usd: item.total_value_usd || null,
        avg_weight_per_box: item.avg_weight_per_box || 0,
        status: item.status || 'pending',
        received_by: item.received_by || 'N/A',
        quality_inspector: item.quality_inspector || null,
        quality_notes: item.quality_notes || null,
        observations: item.observations || null,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    } catch (error) {
      console.error('❌ [CaptureService] updateHarvestReceptionStatus error:', error);
      throw error;
    }
  },

  // ============================================================
  // QUALITY
  // ============================================================

  inspectQuality: async (input: QualityInspectionInput): Promise<any> => {
    try {
      const response = await api.post<{ success: boolean; data: any }>(
        '/quality/inspect',
        input
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CaptureService] inspectQuality error:', error);
      throw error;
    }
  },

  getPendingRejections: async (growerId: string): Promise<PendingRejection[]> => {
    try {
      const response = await api.get<{ success: boolean; data: PendingRejection[] }>(
        `/quality/pending/${growerId}`
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CaptureService] getPendingRejections error:', error);
      throw error;
    }
  },

  resolveRejection: async (rejectionId: string): Promise<void> => {
    try {
      await api.patch(`/quality/resolve/${rejectionId}`);
    } catch (error) {
      console.error('❌ [CaptureService] resolveRejection error:', error);
      throw error;
    }
  },

  getQualitySummary: async (harvestReceptionId: string): Promise<QualitySummary | null> => {
    try {
      const response = await api.get<{ success: boolean; data: QualitySummary }>(
        `/quality/summary/${harvestReceptionId}`
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CaptureService] getQualitySummary error:', error);
      throw error;
    }
  },

  // ============================================================
  // EXPENSES (Labores)
  // ============================================================

  createExpense: async (input: ExpenseInput): Promise<any> => {
    try {
      const response = await api.post<{ success: boolean; data: any }>(
        '/finances/expenses',
        input
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CaptureService] createExpense error:', error);
      throw error;
    }
  },

  getExpenses: async (params?: { lot_id?: string; type?: string }): Promise<any[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.lot_id) queryParams.append('lot_id', params.lot_id);
      if (params?.type) queryParams.append('type', params.type);

      const url = `/finances/expenses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: any[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [CaptureService] getExpenses error:', error);
      throw error;
    }
  },
};