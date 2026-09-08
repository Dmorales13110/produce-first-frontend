import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface CropYield {
  id: string;
  crop_name: string;
  technical_spec: number;
  actual_yield: number;
  yield_percent: number;
  closed_posturas: number;
  status: 'excellent' | 'good' | 'attention' | 'critical';
  trend: string;
  notes: string;
  week_number: number;
  year: number;
  empresa_id?: string;
  created_at: string;
  updated_at: string;
}

export interface YieldWeeklyData {
  id: string;
  crop_name: string;
  week_number: number;
  year: number;
  yield_percent: number;
  created_at: string;
  updated_at: string;
}

export interface YieldSummary {
  averageYield: number;
  totalClosed: number;
  aboveTarget: number;
  belowTarget: number;
  bestCrop: {
    crop_name: string;
    yield_percent: number;
    trend: string;
  } | null;
  worstCrop: {
    crop_name: string;
    yield_percent: number;
    trend: string;
  } | null;
}

export interface YieldFilters {
  status?: string;
  weekNumber?: number;
  year?: number;
  empresaId?: string;
}

// ============================================================
// SERVICIO
// ============================================================

const MOCK_CROPS: CropYield[] = [
  { id: '1', crop_name: 'Ejote Verde Strike', technical_spec: 250, actual_yield: 242, yield_percent: 96.8, closed_posturas: 14500, status: 'good', trend: 'stable', notes: '', week_number: 48, year: 2023, created_at: '', updated_at: '' },
  { id: '2', crop_name: 'Calabaza Italiana Grey', technical_spec: 380, actual_yield: 350, yield_percent: 92.1, closed_posturas: 17500, status: 'attention', trend: 'down', notes: '', week_number: 48, year: 2023, created_at: '', updated_at: '' },
];

const MOCK_WEEKLY: YieldWeeklyData[] = [
  { id: '1', crop_name: 'Ejote', week_number: 45, year: 2023, yield_percent: 95, created_at: '', updated_at: '' },
  { id: '2', crop_name: 'Ejote', week_number: 46, year: 2023, yield_percent: 96, created_at: '', updated_at: '' },
];

const MOCK_SUMMARY: YieldSummary = {
  averageYield: 94.4,
  totalClosed: 32000,
  aboveTarget: 1,
  belowTarget: 1,
  bestCrop: { crop_name: 'Ejote Verde Strike', yield_percent: 96.8, trend: 'stable' },
  worstCrop: { crop_name: 'Calabaza Italiana Grey', yield_percent: 92.1, trend: 'down' },
};

export const YieldVsFichaService = {
  /**
   * Obtener cultivos y rendimientos
   * GET /yield-vs-ficha/crops
   */
  getCrops: async (filters?: YieldFilters): Promise<CropYield[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.cropName) queryParams.append('cropName', filters.cropName);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/yield-vs-ficha/crops${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: CropYield[] }>(url);
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_CROPS;
    } catch (error) {
      console.warn('⚠️ [YieldVsFichaService] Backend no disponible. Usando datos mock.');
      return MOCK_CROPS;
    }
  },

  /**
   * Obtener datos semanales para gráficos
   * GET /yield-vs-ficha/weekly
   */
  getWeeklyData: async (cropName?: string, weekNumber?: number, year?: number): Promise<YieldWeeklyData[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (cropName) queryParams.append('cropName', cropName);
      if (weekNumber) queryParams.append('weekNumber', weekNumber.toString());
      if (year) queryParams.append('year', year.toString());

      const url = `/yield-vs-ficha/weekly${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: YieldWeeklyData[] }>(url);
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_WEEKLY;
    } catch (error) {
      return MOCK_WEEKLY;
    }
  },

  /**
   * Obtener resumen
   * GET /yield-vs-ficha/summary
   */
  getSummary: async (filters?: YieldFilters): Promise<YieldSummary> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/yield-vs-ficha/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: YieldSummary }>(url);
      return response.data || MOCK_SUMMARY;
    } catch (error) {
      return MOCK_SUMMARY;
    }
  },

  /**
   * Obtener dashboard completo
   * GET /yield-vs-ficha/dashboard
   */
  getDashboard: async (filters?: YieldFilters): Promise<{ crops: CropYield[]; weekly: YieldWeeklyData[]; summary: YieldSummary }> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/yield-vs-ficha/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: { crops: CropYield[]; weekly: YieldWeeklyData[]; summary: YieldSummary } }>(url);
      return response.data || { crops: MOCK_CROPS, weekly: MOCK_WEEKLY, summary: MOCK_SUMMARY };
    } catch (error) {
      return { crops: MOCK_CROPS, weekly: MOCK_WEEKLY, summary: MOCK_SUMMARY };
    }
  },

  /**
   * Actualizar yield de un cultivo
   * PUT /yield-vs-ficha/crops/:id
   */
  updateCrop: async (id: string, data: Partial<CropYield>): Promise<CropYield> => {
    try {
      const response = await api.put<{ success: boolean; data: CropYield }>(`/yield-vs-ficha/crops/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [YieldVsFichaService] updateCrop error:', error);
      throw error;
    }
  },
};