// src/services/technical/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface TechnicalParameter {
  id: string;
  crop: string;
  variety: string;
  temp: string;
  tempVal: number;
  humidity: string;
  humVal: number;
  ph: string;
  ec: string;
  daysToHarvest: string;
  status: 'Óptimo' | 'Atención' | 'Crítico';
  icon: string;
  alert: string | null;
  product_sku?: string;
  grower_id?: string;
}

export interface YieldSpec {
  id: string;
  crop: string;
  yieldTarget: string;
  weightBox: string;
  maxWaste: string;
  actionCode: string;
  product_sku?: string;
}

export interface TechnicalSummary {
  parameters: TechnicalParameter[];
  yieldSpecs: YieldSpec[];
  totalCrops: number;
  activeCrops: number;
  alertCount: number;
}

// ============================================================
// SERVICIO
// ============================================================

export const TechnicalService = {
  /**
   * Obtener fichas técnicas
   * GET /technical
   */
  getTechnicalData: async (): Promise<TechnicalSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: TechnicalSummary }>('/technical');
      return response.data;
    } catch (error) {
      console.error('❌ [TechnicalService] getTechnicalData error:', error);
      throw error;
    }
  },

  /**
   * Obtener parámetros de cultivos
   * GET /technical/parameters
   */
  getParameters: async (): Promise<TechnicalParameter[]> => {
    try {
      const response = await api.get<{ success: boolean; data: TechnicalParameter[] }>('/technical/parameters');
      return response.data;
    } catch (error) {
      console.error('❌ [TechnicalService] getParameters error:', error);
      throw error;
    }
  },

  /**
   * Obtener especificaciones de rendimiento
   * GET /technical/yield-specs
   */
  getYieldSpecs: async (): Promise<YieldSpec[]> => {
    try {
      const response = await api.get<{ success: boolean; data: YieldSpec[] }>('/technical/yield-specs');
      return response.data;
    } catch (error) {
      console.error('❌ [TechnicalService] getYieldSpecs error:', error);
      throw error;
    }
  },
};