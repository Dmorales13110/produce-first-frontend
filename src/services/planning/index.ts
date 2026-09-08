// src/services/planning/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface PlanningMetric {
  label: string;
  val: string;
  sub: string;
  icon: string;
  color: string;
}

export interface PlanningWeek {
  semana: string;
  fecha: string;
  siembras: number;
  trasplantes: number;
  cajasEst: string;
  cajasEstNum: number;
  costoEst: string;
  costoEstNum: number;
  status: 'Cerrada' | 'En Ejecución' | 'Pendiente';
  progress: number;
}

export interface PlanningSummary {
  semanasProgramadas: number;
  posturasTotales: number;
  metaCajasGlobal: number;
  semanas: PlanningWeek[];
}

export interface PlanningFilters {
  status?: 'all' | 'active' | 'closed';
  year?: number;
}

// ============================================================
// SERVICIO
// ============================================================

export const PlanningService = {
  /**
   * Obtener resumen de planeación
   * GET /planning/summary
   */
  getSummary: async (filters?: PlanningFilters): Promise<PlanningSummary> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      if (filters?.year) {
        queryParams.append('year', String(filters.year));
      }

      const url = `/planning/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: PlanningSummary }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PlanningService] getSummary error:', error);
      throw error;
    }
  },

  /**
   * Obtener semanas de planeación
   * GET /planning/weeks
   */
  getWeeks: async (filters?: PlanningFilters): Promise<PlanningWeek[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      if (filters?.year) {
        queryParams.append('year', String(filters.year));
      }

      const url = `/planning/weeks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: PlanningWeek[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PlanningService] getWeeks error:', error);
      throw error;
    }
  },
};