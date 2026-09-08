// src/services/seeds/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface SeedCrop {
  sku: string;
  name: string;
  description: string;
  category: string;
}

export interface SeedDosage {
  id: string;
  crop: string;
  variety: string;
  supplier: string;
  seedsPerHa: number;
  lbPerHa: number;
  grower_id?: string;
  product_sku?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDosageInput {
  crop: string;
  variety: string;
  supplier: string;
  seeds_per_ha: number;
  lb_per_ha: number;
  product_sku?: string;
  grower_id?: string;
}

export interface SeedNeed {
  crop: string;
  variety: string;
  haPlan: number;
  bruteLb: number;
  inventoryLb: number;
  netToOrder: number;
  netColor: string;
}

export interface SeedOrder {
  supplier: string;
  netLb: number;
  leadTime: string;
  firstPlanting: string;
  orderBefore: string;
  status: 'pending' | 'current' | 'completed';
  statusLabel: string;
  statusColor: string;
}

export interface SeedSummary {
  totalHa: number;
  totalNetToOrder: number;
  nextDeadline: string;
  nextDeadlineDetail: string;
}

export interface SeedFilters {
  growerId?: string;
  crop?: string;
  variety?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const SeedsService = {
  /**
   * Obtener cultivos disponibles
   * GET /seeds/crops
   */
  getCrops: async (filters?: SeedFilters): Promise<SeedCrop[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.growerId) queryParams.append('growerId', filters.growerId);

      const url = `/seeds/crops${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: SeedCrop[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [SeedsService] getCrops error:', error);
      throw error;
    }
  },

  /**
   * Obtener dosis de semilla
   * GET /seeds/dosages
   */
  getDosages: async (filters?: SeedFilters): Promise<SeedDosage[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.growerId) queryParams.append('growerId', filters.growerId);
      if (filters?.crop) queryParams.append('crop', filters.crop);

      const url = `/seeds/dosages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: SeedDosage[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [SeedsService] getDosages error:', error);
      throw error;
    }
  },

  /**
   * Crear nueva dosis
   * POST /seeds/dosages
   */
  createDosage: async (input: CreateDosageInput): Promise<SeedDosage> => {
    try {
      const response = await api.post<{ success: boolean; data: SeedDosage }>('/seeds/dosages', input);
      return response.data;
    } catch (error) {
      console.error('❌ [SeedsService] createDosage error:', error);
      throw error;
    }
  },

  /**
   * Actualizar dosis
   * PUT /seeds/dosages/:id
   */
  updateDosage: async (id: string, data: { seeds_per_ha?: number; lb_per_ha?: number }): Promise<SeedDosage> => {
    try {
      const response = await api.put<{ success: boolean; data: SeedDosage }>(`/seeds/dosages/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [SeedsService] updateDosage error:', error);
      throw error;
    }
  },

  /**
   * Eliminar dosis
   * DELETE /seeds/dosages/:id
   */
  deleteDosage: async (id: string): Promise<void> => {
    try {
      await api.delete(`/seeds/dosages/${id}`);
    } catch (error) {
      console.error('❌ [SeedsService] deleteDosage error:', error);
      throw error;
    }
  },

  /**
   * Obtener necesidades calculadas
   * GET /seeds/needs
   */
  getNeeds: async (filters?: SeedFilters): Promise<SeedNeed[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.growerId) queryParams.append('growerId', filters.growerId);

      const url = `/seeds/needs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: SeedNeed[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [SeedsService] getNeeds error:', error);
      throw error;
    }
  },

  /**
   * Obtener pedidos por proveedor
   * GET /seeds/orders
   */
  getOrders: async (filters?: SeedFilters): Promise<SeedOrder[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.growerId) queryParams.append('growerId', filters.growerId);

      const url = `/seeds/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: SeedOrder[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [SeedsService] getOrders error:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen de semilla
   * GET /seeds/summary
   */
  getSummary: async (filters?: SeedFilters): Promise<SeedSummary> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.growerId) queryParams.append('growerId', filters.growerId);

      const url = `/seeds/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: SeedSummary }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [SeedsService] getSummary error:', error);
      throw error;
    }
  },

  /**
   * Generar OC desde pedido
   * POST /seeds/generate-order
   */
  generateOrder: async (supplier: string): Promise<any> => {
    try {
      const response = await api.post<{ success: boolean; data: any }>('/seeds/generate-order', { supplier });
      return response.data;
    } catch (error) {
      console.error('❌ [SeedsService] generateOrder error:', error);
      throw error;
    }
  },
};