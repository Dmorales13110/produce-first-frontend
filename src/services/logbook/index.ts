// src/services/logbook/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface LogEntry {
  id: string;
  code: string;
  date: string;
  sector: string;
  sector_id?: string;
  parameter: string;
  tech: string;
  tech_id?: string;
  status: 'Liberado' | 'Pendiente' | 'En Proceso' | 'Cancelado';
  description?: string;
  grower_id?: string;
  grower_name?: string;
  lot_id?: string;
  lot_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateLogInput {
  date: string;
  sector: string;
  parameter: string;
  tech: string;
  status: 'Liberado' | 'Pendiente' | 'En Proceso' | 'Cancelado';
  description?: string;
  grower_id?: string;
  lot_id?: string;
}

export interface UpdateLogInput extends Partial<CreateLogInput> {
  id: string;
}

export interface LogSummary {
  totalLogs: number;
  liberados: number;
  pendientes: number;
  enProceso: number;
  cancelados: number;
}

// ============================================================
// SERVICIO
// ============================================================

export const LogBookService = {
  /**
   * Obtener todos los registros
   * GET /logbook
   */
  getLogs: async (params?: { 
    status?: string; 
    startDate?: string; 
    endDate?: string;
    sector?: string;
  }): Promise<LogEntry[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.sector) queryParams.append('sector', params.sector);

      const url = `/logbook${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: LogEntry[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [LogBookService] getLogs error:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen de bitácora
   * GET /logbook/summary
   */
  getSummary: async (): Promise<LogSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: LogSummary }>('/logbook/summary');
      return response.data;
    } catch (error) {
      console.error('❌ [LogBookService] getSummary error:', error);
      throw error;
    }
  },

  /**
   * Crear nuevo registro
   * POST /logbook
   */
  createLog: async (input: CreateLogInput): Promise<LogEntry> => {
    try {
      const response = await api.post<{ success: boolean; data: LogEntry }>('/logbook', input);
      return response.data;
    } catch (error) {
      console.error('❌ [LogBookService] createLog error:', error);
      throw error;
    }
  },

  /**
   * Actualizar registro
   * PUT /logbook/:id
   */
  updateLog: async (input: UpdateLogInput): Promise<LogEntry> => {
    try {
      const { id, ...updates } = input;
      const response = await api.put<{ success: boolean; data: LogEntry }>(`/logbook/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('❌ [LogBookService] updateLog error:', error);
      throw error;
    }
  },

  /**
   * Eliminar registro
   * DELETE /logbook/:id
   */
  deleteLog: async (id: string): Promise<void> => {
    try {
      await api.delete(`/logbook/${id}`);
    } catch (error) {
      console.error('❌ [LogBookService] deleteLog error:', error);
      throw error;
    }
  },

  /**
   * Cambiar estado de registro
   * PATCH /logbook/:id/status
   */
  updateStatus: async (id: string, status: string): Promise<LogEntry> => {
    try {
      const response = await api.patch<{ success: boolean; data: LogEntry }>(
        `/logbook/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('❌ [LogBookService] updateStatus error:', error);
      throw error;
    }
  },
};