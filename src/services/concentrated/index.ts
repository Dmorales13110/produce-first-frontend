// src/services/concentrated/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface ConcentratedRecord {
  id: string;
  fecha: string;
  viajes: number;
  bruto: number; // kg
  tara: number; // kg
  neto: number; // kg
  merma: number; // porcentaje
  mermaColor: 'green' | 'yellow' | 'red';
  detalles?: {
    recepcion_id: string;
    code: string;
    good_boxes: number;
    rejected_boxes: number;
    weight_kg: number;
  }[];
}

export interface ConcentratedSummary {
  totalViajes: number;
  totalBruto: number;
  totalTara: number;
  totalNeto: number;
  promedioMerma: number;
  mejorDia: {
    fecha: string;
    neto: number;
    viajes: number;
  };
  records: ConcentratedRecord[];
}

export interface ConcentratedFilters {
  fromDate?: string;
  toDate?: string;
  growerId?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const ConcentratedService = {
  /**
   * Obtener concentrado de pesajes
   * GET /concentrated
   */
  getConcentrated: async (filters?: ConcentratedFilters): Promise<ConcentratedSummary> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters?.toDate) queryParams.append('toDate', filters.toDate);
      if (filters?.growerId) queryParams.append('growerId', filters.growerId);

      const url = `/concentrated${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: ConcentratedSummary }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [ConcentratedService] getConcentrated error:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen rápido de concentrados
   * GET /concentrated/summary
   */
  getSummary: async (filters?: ConcentratedFilters): Promise<ConcentratedSummary> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters?.toDate) queryParams.append('toDate', filters.toDate);
      if (filters?.growerId) queryParams.append('growerId', filters.growerId);

      const url = `/concentrated/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: ConcentratedSummary }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [ConcentratedService] getSummary error:', error);
      throw error;
    }
  },
};