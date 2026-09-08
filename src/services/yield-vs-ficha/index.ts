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

export const YieldVsFichaService = {
  /**
   * Obtener datos de yield por cultivo
   * GET /yield-vs-ficha/crops
   */
  getCrops: async (filters?: YieldFilters): Promise<CropYield[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/yield-vs-ficha/crops${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: CropYield[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [YieldVsFichaService] getCrops error:', error);
      throw error;
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
      return response.data;
    } catch (error) {
      console.error('❌ [YieldVsFichaService] getWeeklyData error:', error);
      throw error;
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
      return response.data;
    } catch (error) {
      console.error('❌ [YieldVsFichaService] getSummary error:', error);
      throw error;
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
      return response.data;
    } catch (error) {
      console.error('❌ [YieldVsFichaService] getDashboard error:', error);
      throw error;
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