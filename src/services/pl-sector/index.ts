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

const MOCK_LIVE: SectorLive[] = [
  { id: '1', sector_code: 'SEC-01', crop: 'Ejote Verde Strike', area_ha: 14.5, accumulated_expense: 145000, boxes_harvested: 3500, projected_liquidation: 195000, profit: 50000, profit_per_box: 14.28, status: 'sano', progress_percent: 75, trend: '+4.2%', week_number: 48, year: 2026, created_at: '', updated_at: '' },
  { id: '2', sector_code: 'SEC-02', crop: 'Calabaza Italiana Grey', area_ha: 12.0, accumulated_expense: 110000, boxes_harvested: 2800, projected_liquidation: 135000, profit: 25000, profit_per_box: 8.92, status: 'vigilar', progress_percent: 60, trend: '-1.5%', week_number: 48, year: 2026, created_at: '', updated_at: '' },
];

const MOCK_CLOSED: SectorClosed[] = [
  { id: 'c-1', sector_code: 'SEC-09', crop: 'Pepino Persa', area_ha: 8.0, boxes_harvested: 3200, revenue: 160000, cost: 98000, profit: 62000, profit_per_box: 19.37, vs_plan: '+12%', is_best: true, week_number: 48, year: 2026, created_at: '', updated_at: '' },
];

const MOCK_SUMMARY: PLSummary = {
  totalLive: 2,
  totalClosed: 1,
  totalRed: 0,
  bestClosed: {
    sector_code: 'SEC-09',
    profit_per_box: 19.37,
    vs_plan: '+12%',
  },
  totalProfitClosed: 62000,
};

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
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_LIVE;
    } catch (error) {
      console.warn('⚠️ [PLSectorService] Backend no disponible. Usando datos mock.');
      return MOCK_LIVE;
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
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_CLOSED;
    } catch (error) {
      return MOCK_CLOSED;
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
      return response.data || MOCK_SUMMARY;
    } catch (error) {
      return MOCK_SUMMARY;
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
      return response.data || { live: MOCK_LIVE, closed: MOCK_CLOSED, summary: MOCK_SUMMARY };
    } catch (error) {
      return { live: MOCK_LIVE, closed: MOCK_CLOSED, summary: MOCK_SUMMARY };
    }
  },
};