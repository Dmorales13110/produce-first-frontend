import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface FinancialMetric {
  id: string;
  metric_key: string;
  metric_name: string;
  current_value: number;
  previous_value: number;
  change_percent: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  progress: number;
  description: string;
  updated_at: string;
}

export interface RanchSummary {
  id: string;
  ranch_name: string;
  empresa_id?: string;
  active_sectors: number;
  yield_percent: number;
  accumulated_expense: number;
  projected_profit: number;
  status: 'Excelente' | 'Sano' | 'Atencion' | 'Critico';
  status_color: string;
  last_updated: string;
}

export interface HarvestProgress {
  id: string;
  week_number: number;
  year: number;
  total_boxes_harvested: number;
  total_boxes_planned: number;
  total_boxes_projected: number;
  progress_percent: number;
  updated_at: string;
}

export interface DashboardSummary {
  totalHa: number;
  totalPosturas: number;
  temporada: string;
  semanaActual: number;
  semanasTotales: number;
  fechaCorte: string;
  agronomos: string[];
  topVariedades: string[];
}

export interface FinanceDashboardData {
  metrics: FinancialMetric[];
  ranches: RanchSummary[];
  harvestProgress: HarvestProgress;
  summary: DashboardSummary;
}

// ============================================================
// SERVICIO
// ============================================================

export const FinanceDashboardService = {
  /**
   * Obtener todas las métricas del dashboard
   * GET /finance-dashboard
   */
  getDashboardData: async (empresaId?: string): Promise<FinanceDashboardData> => {
    try {
      const url = empresaId ? `/finance-dashboard?empresaId=${empresaId}` : '/finance-dashboard';
      const response = await api.get<{ success: boolean; data: FinanceDashboardData }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [FinanceDashboardService] getDashboardData error:', error);
      throw error;
    }
  },

  /**
   * Obtener solo métricas financieras
   * GET /finance-dashboard/metrics
   */
  getMetrics: async (): Promise<FinancialMetric[]> => {
    try {
      const response = await api.get<{ success: boolean; data: FinancialMetric[] }>('/finance-dashboard/metrics');
      return response.data;
    } catch (error) {
      console.error('❌ [FinanceDashboardService] getMetrics error:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen de ranchos
   * GET /finance-dashboard/ranches
   */
  getRanches: async (empresaId?: string): Promise<RanchSummary[]> => {
    try {
      const url = empresaId ? `/finance-dashboard/ranches?empresaId=${empresaId}` : '/finance-dashboard/ranches';
      const response = await api.get<{ success: boolean; data: RanchSummary[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [FinanceDashboardService] getRanches error:', error);
      throw error;
    }
  },

  /**
   * Obtener progreso de cosecha
   * GET /finance-dashboard/harvest-progress
   */
  getHarvestProgress: async (weekNumber?: number, year?: number): Promise<HarvestProgress> => {
    try {
      const params = new URLSearchParams();
      if (weekNumber) params.append('weekNumber', weekNumber.toString());
      if (year) params.append('year', year.toString());
      
      const url = `/finance-dashboard/harvest-progress${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: HarvestProgress }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [FinanceDashboardService] getHarvestProgress error:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen del dashboard
   * GET /finance-dashboard/summary
   */
  getSummary: async (): Promise<DashboardSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: DashboardSummary }>('/finance-dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('❌ [FinanceDashboardService] getSummary error:', error);
      throw error;
    }
  },
};