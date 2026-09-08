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

const MOCK_METRICS: PlanVsRealMetric[] = [
  { id: '1', concept: 'Superficie Sembrada (Ha)', plan_value: 180, real_value: 182.8, progress_percent: 101.5, projected_value: 182.8, variance: 2.8, status: 'on-track', week_number: 48, year: 2026, created_at: '', updated_at: '' },
  { id: '2', concept: 'Cajas Cosechadas (Totales)', plan_value: 45000, real_value: 41200, progress_percent: 91.5, projected_value: 44000, variance: -3800, status: 'attention', week_number: 48, year: 2026, created_at: '', updated_at: '' },
  { id: '3', concept: 'Costo por Jornal ($/día)', plan_value: 380, real_value: 415, progress_percent: 109.2, projected_value: 410, variance: 35, status: 'critical', week_number: 48, year: 2026, created_at: '', updated_at: '' },
  { id: '4', concept: 'Rendimiento (Cajas/Ha)', plan_value: 250, real_value: 242, progress_percent: 96.8, projected_value: 248, variance: -8, status: 'on-track', week_number: 48, year: 2026, created_at: '', updated_at: '' },
];

const MOCK_DEVIATIONS: PlanDeviation[] = [
  { id: 'dev-1', signal_text: 'Sobreprecio en Jornales Agrícolas', detail: 'Incremento del 9.2% en costo de labor por alta demanda en cosecha de ejote', action: 'Revisar tabuladores por destajo en Campo 3', severity: 'high', impact_amount: 14200, status: 'active', week_number: 48, year: 2026, created_at: '', updated_at: '' },
  { id: 'dev-2', signal_text: 'Retraso de Arribo en Fletes Refrigerados', detail: 'Flete reportó demora de 4 horas en caseta Querétaro', action: 'Monitorear termógrafo y coordinar rampa en frío', severity: 'medium', impact_amount: 3500, status: 'resolved', week_number: 48, year: 2026, created_at: '', updated_at: '' },
];

const MOCK_SUMMARY: PlanVsRealSummary = {
  totalPlan: 180,
  totalReal: 182.8,
  avgProgress: 97.4,
  onTrackCount: 2,
  attentionCount: 1,
  criticalCount: 1,
  totalImpact: 17700,
};

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
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_METRICS;
    } catch (error) {
      console.warn('⚠️ [PlanVsRealService] Backend no disponible para metrics. Usando datos mock.');
      return MOCK_METRICS;
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
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_DEVIATIONS;
    } catch (error) {
      console.warn('⚠️ [PlanVsRealService] Backend no disponible para deviations. Usando datos mock.');
      return MOCK_DEVIATIONS;
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
      return response.data || MOCK_SUMMARY;
    } catch (error) {
      console.warn('⚠️ [PlanVsRealService] Backend no disponible para summary. Usando datos mock.');
      return MOCK_SUMMARY;
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
      return response.data || { metrics: MOCK_METRICS, deviations: MOCK_DEVIATIONS, summary: MOCK_SUMMARY };
    } catch (error) {
      return { metrics: MOCK_METRICS, deviations: MOCK_DEVIATIONS, summary: MOCK_SUMMARY };
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
      const found = MOCK_DEVIATIONS.find(d => d.id === id) || MOCK_DEVIATIONS[0];
      return { ...found, ...data } as PlanDeviation;
    }
  },
};
