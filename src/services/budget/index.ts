import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface BudgetSeason {
  id: string;
  name: string;
  year_start: number;
  year_end: number;
  exchange_rate: number;
  commission_percent: number;
  advance_percent: number;
  total_hectareas: number;
  status: 'draft' | 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface BudgetCost {
  id: string;
  season_id: string;
  category: string;
  san_aparicio: number;
  la_escondida: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetFOB {
  id: string;
  season_id: string;
  crop_1: string;
  fob_1: number;
  crop_2: string;
  fob_2: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetResult {
  id: string;
  season_id: string;
  total_boxes: number;
  total_fob_usd: number;
  total_cost_usd: number;
  net_liquidation_usd: number;
  profit_usd: number;
  profit_per_box: number;
  margin_percent: number;
  execution_percent: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetSummary {
  season: BudgetSeason;
  costs: BudgetCost[];
  fob: BudgetFOB[];
  result: BudgetResult;
  totals: {
    totalSA: number;
    totalLE: number;
    averageCost: number;
  };
}

export interface CreateCostInput {
  category: string;
  san_aparicio?: number;
  la_escondida?: number;
  notes?: string;
}

export interface UpdateCostInput {
  category?: string;
  san_aparicio?: number;
  la_escondida?: number;
  notes?: string;
}

export interface CreateFOBInput {
  crop_1: string;
  fob_1?: number;
  crop_2?: string;
  fob_2?: number;
}

export interface UpdateFOBInput {
  crop_1?: string;
  fob_1?: number;
  crop_2?: string;
  fob_2?: number;
}

// ============================================================
// SERVICIO
// ============================================================

export const BudgetService = {
  // ============================================================
  // SEASONS
  // ============================================================

  getSeasons: async (): Promise<BudgetSeason[]> => {
    try {
      const response = await api.get<{ success: boolean; data: BudgetSeason[] }>('/budget/seasons');
      return response.data;
    } catch (error) {
      console.error('❌ [BudgetService] getSeasons error:', error);
      throw error;
    }
  },

  getSeason: async (seasonId: string): Promise<BudgetSeason> => {
    try {
      const response = await api.get<{ success: boolean; data: BudgetSeason }>(`/budget/seasons/${seasonId}`);
      return response.data;
    } catch (error) {
      console.error('❌ [BudgetService] getSeason error:', error);
      throw error;
    }
  },

  updateSeason: async (seasonId: string, data: Partial<BudgetSeason>): Promise<BudgetSeason> => {
    try {
      const response = await api.put<{ success: boolean; data: BudgetSeason }>(`/budget/seasons/${seasonId}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [BudgetService] updateSeason error:', error);
      throw error;
    }
  },

  // ============================================================
  // COSTS - CRUD COMPLETO
  // ============================================================

  getCosts: async (seasonId: string): Promise<BudgetCost[]> => {
    try {
      const response = await api.get<{ success: boolean; data: BudgetCost[] }>(`/budget/costs?seasonId=${seasonId}`);
      return response.data;
    } catch (error) {
      console.error('❌ [BudgetService] getCosts error:', error);
      throw error;
    }
  },

  createCost: async (seasonId: string, data: CreateCostInput): Promise<BudgetCost> => {
    try {
      const response = await api.post<{ success: boolean; data: BudgetCost }>(
        `/budget/costs?seasonId=${seasonId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('❌ [BudgetService] createCost error:', error);
      throw error;
    }
  },

  updateCost: async (id: string, data: UpdateCostInput): Promise<BudgetCost> => {
    try {
      const response = await api.put<{ success: boolean; data: BudgetCost }>(`/budget/costs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [BudgetService] updateCost error:', error);
      throw error;
    }
  },

  deleteCost: async (id: string): Promise<void> => {
    try {
      await api.delete(`/budget/costs/${id}`);
    } catch (error) {
      console.error('❌ [BudgetService] deleteCost error:', error);
      throw error;
    }
  },

  // ============================================================
  // FOB - CRUD COMPLETO
  // ============================================================

  getFOB: async (seasonId: string): Promise<BudgetFOB[]> => {
    try {
      const response = await api.get<{ success: boolean; data: BudgetFOB[] }>(`/budget/fob?seasonId=${seasonId}`);
      return response.data;
    } catch (error) {
      console.error('❌ [BudgetService] getFOB error:', error);
      throw error;
    }
  },

  createFOB: async (seasonId: string, data: CreateFOBInput): Promise<BudgetFOB> => {
    try {
      const response = await api.post<{ success: boolean; data: BudgetFOB }>(
        `/budget/fob?seasonId=${seasonId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('❌ [BudgetService] createFOB error:', error);
      throw error;
    }
  },

  updateFOB: async (id: string, data: UpdateFOBInput): Promise<BudgetFOB> => {
    try {
      const response = await api.put<{ success: boolean; data: BudgetFOB }>(`/budget/fob/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [BudgetService] updateFOB error:', error);
      throw error;
    }
  },

  deleteFOB: async (id: string): Promise<void> => {
    try {
      await api.delete(`/budget/fob/${id}`);
    } catch (error) {
      console.error('❌ [BudgetService] deleteFOB error:', error);
      throw error;
    }
  },

  // ============================================================
  // SUMMARY & SAVE
  // ============================================================

  getSummary: async (seasonId: string): Promise<BudgetSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: BudgetSummary }>(`/budget/summary?seasonId=${seasonId}`);
      return response.data;
    } catch (error) {
      console.error('❌ [BudgetService] getSummary error:', error);
      throw error;
    }
  },

  saveBudget: async (seasonId: string, data: any): Promise<any> => {
    try {
      const response = await api.post<{ success: boolean; data: any }>('/budget/save', {
        seasonId,
        ...data,
      });
      return response.data;
    } catch (error) {
      console.error('❌ [BudgetService] saveBudget error:', error);
      throw error;
    }
  },
};