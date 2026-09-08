import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface PlanVsRealMetric {
  id: string;
  concept: string;
  plan_value: number;
  real_value: number;
  progress_percent: number;
  projected_value: number;
  variance: number;
  status: 'on-track' | 'attention' | 'critical';
  week_number: number;
  year: number;
  empresa_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PlanDeviation {
  id: string;
  signal_text: string;
  detail: string;
  action: string;
  severity: 'high' | 'medium' | 'low';
  impact_amount: number;
  status: 'active' | 'resolved' | 'dismissed';
  week_number: number;
  year: number;
  empresa_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PlanVsRealSummary {
  totalPlan: number;
  totalReal: number;
  avgProgress: number;
  onTrackCount: number;
  attentionCount: number;
  criticalCount: number;
  totalImpact: number;
}

export interface PlanVsRealFilters {
  status?: string;
  weekNumber?: number;
  year?: number;
  empresaId?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const PlanVsRealService = {
  /**
   * Obtener métricas Plan vs Real
   * GET /plan-vs-real/metrics
   */
  getMetrics: async (filters?: PlanVsRealFilters): Promise<PlanVsRealMetric[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/plan-vs-real/metrics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: PlanVsRealMetric[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PlanVsRealService] getMetrics error:', error);
      throw error;
    }
  },

  /**
   * Obtener desviaciones
   * GET /plan-vs-real/deviations
   */
  getDeviations: async (filters?: { severity?: string; status?: string; weekNumber?: number; year?: number }): Promise<PlanDeviation[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.severity) queryParams.append('severity', filters.severity);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());

      const url = `/plan-vs-real/deviations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: PlanDeviation[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PlanVsRealService] getDeviations error:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen
   * GET /plan-vs-real/summary
   */
  getSummary: async (filters?: PlanVsRealFilters): Promise<PlanVsRealSummary> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/plan-vs-real/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: PlanVsRealSummary }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PlanVsRealService] getSummary error:', error);
      throw error;
    }
  },

  /**
   * Obtener dashboard completo
   * GET /plan-vs-real/dashboard
   */
  getDashboard: async (filters?: PlanVsRealFilters): Promise<{ metrics: PlanVsRealMetric[]; deviations: PlanDeviation[]; summary: PlanVsRealSummary }> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/plan-vs-real/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: { metrics: PlanVsRealMetric[]; deviations: PlanDeviation[]; summary: PlanVsRealSummary } }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PlanVsRealService] getDashboard error:', error);
      throw error;
    }
  },

  /**
   * Actualizar estado de desviación
   * PUT /plan-vs-real/deviations/:id
   */
  updateDeviation: async (id: string, data: { status?: string; action?: string }): Promise<PlanDeviation> => {
    try {
      const response = await api.put<{ success: boolean; data: PlanDeviation }>(`/plan-vs-real/deviations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [PlanVsRealService] updateDeviation error:', error);
      throw error;
    }
  },
};
