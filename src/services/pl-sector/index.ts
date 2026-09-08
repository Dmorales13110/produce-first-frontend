import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface SectorLive {
  id: string;
  sector_code: string;
  crop: string;
  area_ha: number;
  accumulated_expense: number;
  boxes_harvested: number;
  projected_liquidation: number;
  profit: number;
  profit_per_box: number;
  status: 'sano' | 'vigilar' | 'en rojo';
  progress_percent: number;
  trend: string;
  week_number: number;
  year: number;
  empresa_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SectorClosed {
  id: string;
  sector_code: string;
  crop: string;
  area_ha: number;
  boxes_harvested: number;
  revenue: number;
  cost: number;
  profit: number;
  profit_per_box: number;
  vs_plan: string;
  is_best: boolean;
  week_number: number;
  year: number;
  empresa_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PLSummary {
  totalLive: number;
  totalClosed: number;
  totalRed: number;
  bestClosed: {
    sector_code: string;
    profit_per_box: number;
    vs_plan: string;
  } | null;
  totalProfitClosed: number;
}

export interface PLFilters {
  status?: string;
  weekNumber?: number;
  year?: number;
  empresaId?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const PLSectorService = {
  /**
   * Obtener sectores vivos
   * GET /pl-sector/live
   */
  getLiveSectors: async (filters?: PLFilters): Promise<SectorLive[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/pl-sector/live${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: SectorLive[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PLSectorService] getLiveSectors error:', error);
      throw error;
    }
  },

  /**
   * Obtener sectores cerrados
   * GET /pl-sector/closed
   */
  getClosedSectors: async (filters?: PLFilters): Promise<SectorClosed[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/pl-sector/closed${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: SectorClosed[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PLSectorService] getClosedSectors error:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen P&L
   * GET /pl-sector/summary
   */
  getSummary: async (filters?: PLFilters): Promise<PLSummary> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/pl-sector/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: PLSummary }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PLSectorService] getSummary error:', error);
      throw error;
    }
  },

  /**
   * Obtener datos completos del dashboard
   * GET /pl-sector/dashboard
   */
  getDashboard: async (filters?: PLFilters): Promise<{ live: SectorLive[]; closed: SectorClosed[]; summary: PLSummary }> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/pl-sector/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: { live: SectorLive[]; closed: SectorClosed[]; summary: PLSummary } }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PLSectorService] getDashboard error:', error);
      throw error;
    }
  },
};