// src/services/calendar/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  day: number;
  month: number;
  year: number;
  type: 'harvest' | 'transplant' | 'maintenance';
  sector: string;
  time: string;
  grower_id: string | null;
  grower_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEventInput {
  title: string;
  description?: string | null;
  day: number;
  month: number;
  year: number;
  type: 'harvest' | 'transplant' | 'maintenance';
  sector: string;
  time: string;
  grower_id?: string | null;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  count?: number;
  message?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const CalendarService = {
  /**
   * Obtener todos los eventos
   * GET /calendar/events
   */
  getEvents: async (params?: { year?: number; month?: number; start_date?: string; end_date?: string }): Promise<CalendarEvent[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.year !== undefined) queryParams.append('year', String(params.year));
      if (params?.month !== undefined) queryParams.append('month', String(params.month));
      if (params?.start_date) queryParams.append('start_date', params.start_date);
      if (params?.end_date) queryParams.append('end_date', params.end_date);

      const url = `/calendar/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<ApiResponse<CalendarEvent[]>>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [CalendarService] getEvents error:', error);
      throw error;
    }
  },

  /**
   * Obtener eventos de un mes específico
   * GET /calendar/events/month/:year/:month
   */
  getEventsForMonth: async (year: number, month: number): Promise<CalendarEvent[]> => {
    try {
      const response = await api.get<ApiResponse<CalendarEvent[]>>(`/calendar/events/month/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error('❌ [CalendarService] getEventsForMonth error:', error);
      throw error;
    }
  },

  /**
   * Obtener eventos de un día específico
   * GET /calendar/events/day/:year/:month/:day
   */
  getEventsForDay: async (year: number, month: number, day: number): Promise<CalendarEvent[]> => {
    try {
      const response = await api.get<ApiResponse<CalendarEvent[]>>(`/calendar/events/day/${year}/${month}/${day}`);
      return response.data;
    } catch (error) {
      console.error('❌ [CalendarService] getEventsForDay error:', error);
      throw error;
    }
  },

  /**
   * Obtener eventos próximos
   * GET /calendar/events/upcoming
   */
  getUpcomingEvents: async (days: number = 7): Promise<CalendarEvent[]> => {
    try {
      const response = await api.get<ApiResponse<CalendarEvent[]>>(`/calendar/events/upcoming?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('❌ [CalendarService] getUpcomingEvents error:', error);
      throw error;
    }
  },

  /**
   * Obtener un evento por ID
   * GET /calendar/events/:id
   */
  getEventById: async (id: string): Promise<CalendarEvent> => {
    try {
      const response = await api.get<ApiResponse<CalendarEvent>>(`/calendar/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [CalendarService] getEventById error:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo evento
   * POST /calendar/events
   */
  createEvent: async (input: CreateEventInput): Promise<CalendarEvent> => {
    try {
      const response = await api.post<ApiResponse<CalendarEvent>>('/calendar/events', input);
      return response.data;
    } catch (error) {
      console.error('❌ [CalendarService] createEvent error:', error);
      throw error;
    }
  },

  /**
   * Actualizar un evento
   * PUT /calendar/events/:id
   */
  updateEvent: async (input: UpdateEventInput): Promise<CalendarEvent> => {
    try {
      const { id, ...updates } = input;
      const response = await api.put<ApiResponse<CalendarEvent>>(`/calendar/events/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('❌ [CalendarService] updateEvent error:', error);
      throw error;
    }
  },

  /**
   * Eliminar un evento
   * DELETE /calendar/events/:id
   */
  deleteEvent: async (id: string): Promise<void> => {
    try {
      await api.delete<ApiResponse<void>>(`/calendar/events/${id}`);
    } catch (error) {
      console.error('❌ [CalendarService] deleteEvent error:', error);
      throw error;
    }
  },
};