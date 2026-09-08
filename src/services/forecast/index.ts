// src/services/forecast/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface ForecastKPI {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

export interface ForecastDailyData {
  day: string;
  pronostico: number;
  real: number;
  cumplimiento: number;
}

export interface ForecastBreakdown {
  producto: string;
  rancho: string;
  sector: string;
  pronostico: number;
  real: number;
  acierto: string;
}

export interface ForecastRanchData {
  name: string;
  value: number;
  ton: string;
}

export interface ForecastSummary {
  kpis: ForecastKPI[];
  chartData: ForecastDailyData[];
  breakdown: ForecastBreakdown[];
  ranchData: ForecastRanchData[];
  totalPronostico: number;
  totalReal: number;
  cumplimientoGlobal: number;
  semana: string;
}

export interface ForecastFilters {
  semana?: string;
  rancho?: string;
  producto?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const ForecastService = {
  /**
   * Obtener resumen de pronóstico
   * GET /forecast
   */
  getForecast: async (filters?: ForecastFilters): Promise<ForecastSummary> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.semana) queryParams.append('semana', filters.semana);
      if (filters?.rancho) queryParams.append('rancho', filters.rancho);
      if (filters?.producto) queryParams.append('producto', filters.producto);

      const url = `/forecast${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: ForecastSummary }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [ForecastService] getForecast error:', error);
      throw error;
    }
  },

  /**
   * Obtener KPIs del pronóstico
   * GET /forecast/kpis
   */
  getKPIs: async (filters?: ForecastFilters): Promise<ForecastKPI[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.semana) queryParams.append('semana', filters.semana);

      const url = `/forecast/kpis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: ForecastKPI[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [ForecastService] getKPIs error:', error);
      throw error;
    }
  },

  /**
   * Obtener datos de la gráfica
   * GET /forecast/chart
   */
  getChartData: async (filters?: ForecastFilters): Promise<ForecastDailyData[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.semana) queryParams.append('semana', filters.semana);

      const url = `/forecast/chart${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: ForecastDailyData[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [ForecastService] getChartData error:', error);
      throw error;
    }
  },

  /**
   * Obtener desglose analítico
   * GET /forecast/breakdown
   */
  getBreakdown: async (filters?: ForecastFilters): Promise<ForecastBreakdown[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.semana) queryParams.append('semana', filters.semana);
      if (filters?.rancho) queryParams.append('rancho', filters.rancho);
      if (filters?.producto) queryParams.append('producto', filters.producto);

      const url = `/forecast/breakdown${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: ForecastBreakdown[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [ForecastService] getBreakdown error:', error);
      throw error;
    }
  },

  /**
   * Obtener datos de ranchos
   * GET /forecast/ranches
   */
  getRanchData: async (filters?: ForecastFilters): Promise<ForecastRanchData[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.semana) queryParams.append('semana', filters.semana);

      const url = `/forecast/ranches${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: ForecastRanchData[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [ForecastService] getRanchData error:', error);
      throw error;
    }
  },
};