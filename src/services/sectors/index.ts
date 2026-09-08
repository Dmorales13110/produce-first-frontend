// src/services/sectors/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface Sector {
  id: string;
  sector_id: string;
  cultivo: string;
  ha: number;
  grupo: string;
  estado: string;
  avance: number;
  cajas: string;
  cajasNum: number;
  color: string;
  lot_id?: string;
  grower_id?: string;
  grower_name?: string;
  planting_date?: string;
  expected_harvest_date?: string;
  observations?: string;
}

export interface SectorSummary {
  totalSectores: number;
  totalHa: number;
  cultivosUnicos: number;
  enCosecha: number;
  enDesarrollo: number;
  enMonitoreo: number;
  sectoresPorGrupo: {
    grupo: string;
    count: number;
    ha: number;
  }[];
  sectoresPorEstado: {
    estado: string;
    count: number;
  }[];
}

export interface SectorFilters {
  growerId?: string;
  grupo?: string;
  estado?: string;
  search?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const SectorsService = {
  /**
   * Obtener sectores
   * GET /sectors
   */
  getSectors: async (filters?: SectorFilters): Promise<Sector[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.growerId) queryParams.append('growerId', filters.growerId);
      if (filters?.grupo) queryParams.append('grupo', filters.grupo);
      if (filters?.estado) queryParams.append('estado', filters.estado);
      if (filters?.search) queryParams.append('search', filters.search);

      const url = `/sectors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: Sector[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [SectorsService] getSectors error:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen de sectores
   * GET /sectors/summary
   */
  getSummary: async (filters?: SectorFilters): Promise<SectorSummary> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.growerId) queryParams.append('growerId', filters.growerId);

      const url = `/sectors/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: SectorSummary }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [SectorsService] getSummary error:', error);
      throw error;
    }
  },

  /**
   * Obtener sectores por grower
   * GET /sectors/grower/:growerId
   */
  getSectorsByGrower: async (growerId: string): Promise<Sector[]> => {
    try {
      const response = await api.get<{ success: boolean; data: Sector[] }>(`/sectors/grower/${growerId}`);
      return response.data;
    } catch (error) {
      console.error('❌ [SectorsService] getSectorsByGrower error:', error);
      throw error;
    }
  },
};