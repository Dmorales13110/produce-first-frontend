// src/services/harvest-ticket/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface HarvestTicket {
  id: string;
  folio: string;
  fecha: string;
  producto: string;
  producto_sku?: string;
  cuadrilla: string;
  cuadrilla_id?: string;
  sectores: {
    sector: string;
    cajas: number;
    liberado: boolean;
    liberado_date?: string;
  }[];
  cosechadores: {
    nombre: string;
    cajas: number;
    importe: number;
  }[];
  totalCajas: number;
  totalImporte: number;
  status: 'emitida' | 'escaneada' | 'en_transito' | 'entregada';
  created_at: string;
  updated_at: string;
}

export interface CreateTicketInput {
  fecha: string;
  producto: string;
  cuadrilla: string;
  sectores: {
    sector: string;
    cajas: number;
  }[];
  cosechadores: {
    nombre: string;
    cajas: number;
  }[];
}

export interface TicketSummary {
  totalBoletas: number;
  totalCajas: number;
  precisionPromedio: number;
  precisionTemporada: number;
  boletasHoy: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const HarvestTicketService = {
  getTickets: async (filters?: any): Promise<HarvestTicket[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.fecha) queryParams.append('fecha', filters.fecha);
      if (filters?.producto) queryParams.append('producto', filters.producto);
      if (filters?.cuadrilla) queryParams.append('cuadrilla', filters.cuadrilla);
      if (filters?.status) queryParams.append('status', filters.status);

      const url = `/harvest-tickets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<ApiResponse<HarvestTicket[]>>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [HarvestTicketService] getTickets error:', error);
      throw error;
    }
  },

  getSummary: async (): Promise<TicketSummary> => {
    try {
      const response = await api.get<ApiResponse<TicketSummary>>('/harvest-tickets/summary');
      return response.data;
    } catch (error) {
      console.error('❌ [HarvestTicketService] getSummary error:', error);
      throw error;
    }
  },

  createTicket: async (input: CreateTicketInput): Promise<HarvestTicket> => {
    try {
      const response = await api.post<ApiResponse<HarvestTicket>>('/harvest-tickets', input);
      return response.data;
    } catch (error) {
      console.error('❌ [HarvestTicketService] createTicket error:', error);
      throw error;
    }
  },

  getTicketById: async (id: string): Promise<HarvestTicket> => {
    try {
      const response = await api.get<ApiResponse<HarvestTicket>>(`/harvest-tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [HarvestTicketService] getTicketById error:', error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: string): Promise<HarvestTicket> => {
    try {
      const response = await api.patch<ApiResponse<HarvestTicket>>(
        `/harvest-tickets/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('❌ [HarvestTicketService] updateStatus error:', error);
      throw error;
    }
  },

  deleteTicket: async (id: string): Promise<void> => {
    try {
      await api.delete(`/harvest-tickets/${id}`);
    } catch (error) {
      console.error('❌ [HarvestTicketService] deleteTicket error:', error);
      throw error;
    }
  },
};