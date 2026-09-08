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

const MOCK_METRICS: FinancialMetric[] = [
  { id: '1', metric_key: 'costo_ha', metric_name: 'Costo Real por Hectárea', current_value: 124500, previous_value: 118000, change_percent: 5.5, trend: 'up', color: '#1F5C3A', progress: 85, description: 'Promedio acumulado temporada', updated_at: '' },
  { id: '2', metric_key: 'margen_operativo', metric_name: 'Margen Operativo Agrícola', current_value: 28.4, previous_value: 31.2, change_percent: -2.8, trend: 'down', color: '#2A6A8A', progress: 72, description: 'Sobre precio FOB frontera', updated_at: '' },
];

const MOCK_RANCHES: RanchSummary[] = [
  { id: '1', ranch_name: 'Rancho Santa María', active_sectors: 8, yield_percent: 94.5, accumulated_expense: 1450000, projected_profit: 420000, status: 'Sano', status_color: 'green', last_updated: '' },
  { id: '2', ranch_name: 'Rancho El Porvenir', active_sectors: 6, yield_percent: 88.2, accumulated_expense: 980000, projected_profit: 210000, status: 'Atencion', status_color: 'yellow', last_updated: '' },
];

const MOCK_HARVEST_PROGRESS: HarvestProgress = {
  id: 'hp-1',
  week_number: 48,
  year: 2026,
  total_boxes_harvested: 41200,
  total_boxes_planned: 45000,
  total_boxes_projected: 44000,
  progress_percent: 91.5,
  updated_at: '',
};

const MOCK_SUMMARY: DashboardSummary = {
  totalHa: 182.8,
  totalPosturas: 224,
  temporada: 'Invierno 2026-2027',
  semanaActual: 48,
  semanasTotales: 30,
  fechaCorte: '27-nov-2026',
  agronomos: ['Ing. R. Silva', 'Ing. M. Gomez', 'Ing. N. Hernandez'],
  topVariedades: ['Ejote Verde Strike', 'Calabaza Grey Zucchini', 'Pepino Persa'],
};

export const FinanceDashboardService = {
  /**
   * Obtener datos completos del dashboard financiero
   * GET /finance-dashboard
   */
  getDashboardData: async (empresaId?: string): Promise<FinanceDashboardData> => {
    try {
      const url = empresaId ? `/finance-dashboard?empresaId=${empresaId}` : '/finance-dashboard';
      const response = await api.get<{ success: boolean; data: FinanceDashboardData }>(url);
      return response.data || { metrics: MOCK_METRICS, ranches: MOCK_RANCHES, harvestProgress: MOCK_HARVEST_PROGRESS, summary: MOCK_SUMMARY };
    } catch (error) {
      console.warn('⚠️ [FinanceDashboardService] Backend no disponible. Usando datos mock.');
      return { metrics: MOCK_METRICS, ranches: MOCK_RANCHES, harvestProgress: MOCK_HARVEST_PROGRESS, summary: MOCK_SUMMARY };
    }
  },

  /**
   * Obtener solo métricas financieras
   * GET /finance-dashboard/metrics
   */
  getMetrics: async (): Promise<FinancialMetric[]> => {
    try {
      const response = await api.get<{ success: boolean; data: FinancialMetric[] }>('/finance-dashboard/metrics');
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_METRICS;
    } catch (error) {
      return MOCK_METRICS;
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
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_RANCHES;
    } catch (error) {
      return MOCK_RANCHES;
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
      return response.data || MOCK_HARVEST_PROGRESS;
    } catch (error) {
      return MOCK_HARVEST_PROGRESS;
    }
  },

  /**
   * Obtener resumen del dashboard
   * GET /finance-dashboard/summary
   */
  getSummary: async (): Promise<DashboardSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: DashboardSummary }>('/finance-dashboard/summary');
      return response.data || MOCK_SUMMARY;
    } catch (error) {
      return MOCK_SUMMARY;
    }
  },
};