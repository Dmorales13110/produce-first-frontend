import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface AttendanceDaily {
  id: string;
  employee_id: string;
  employee?: any;
  attendance_date: string;
  check_in?: string;
  check_out?: string;
  hours_worked: number;
  overtime_hours: number;
  status: 'present' | 'absent' | 'vacation' | 'sick' | 'holiday';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceWeeklySummary {
  id: string;
  week_number: number;
  year: number;
  total_employees: number;
  present_count: number;
  absent_count: number;
  total_hours: number;
  total_overtime: number;
  attendance_percent: number;
  created_at: string;
  updated_at: string;
}

export interface AttendanceStats {
  totalEmployees: number;
  present: number;
  absent: number;
  totalHours: number;
  overtime: number;
  attendancePercent: number;
}

export interface AttendanceFilters {
  dateFrom?: string;
  dateTo?: string;
  employeeId?: string;
  status?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const AttendanceService = {
  /**
   * Obtener asistencia diaria
   * GET /attendance/daily
   */
 // En el servicio, asegurar que getDaily maneje correctamente los filtros
getDaily: async (filters?: AttendanceFilters): Promise<AttendanceDaily[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
    if (filters?.employeeId) queryParams.append('employeeId', filters.employeeId);
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.search) queryParams.append('search', filters.search);

    const url = `/attendance/daily${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('📡 [AttendanceService] Fetching daily attendance:', url);
    
    const response = await api.get<{ success: boolean; data: AttendanceDaily[] }>(url);
    return response.data || [];
  } catch (error) {
    console.error('❌ [AttendanceService] getDaily error:', error);
    return [];
  }
},

  /**
   * Guardar asistencia diaria
   * POST /attendance/daily
   */
  saveDaily: async (data: { employee_id: string; attendance_date: string; check_in?: string; check_out?: string; hours_worked?: number; status: string; notes?: string }): Promise<AttendanceDaily> => {
    try {
      const response = await api.post<{ success: boolean; data: AttendanceDaily }>('/attendance/daily', data);
      return response.data;
    } catch (error) {
      console.error('❌ [AttendanceService] saveDaily error:', error);
      throw error;
    }
  },

  /**
   * Actualizar asistencia
   * PUT /attendance/daily/:id
   */
  updateDaily: async (id: string, data: any): Promise<AttendanceDaily> => {
    try {
      const response = await api.put<{ success: boolean; data: AttendanceDaily }>(`/attendance/daily/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [AttendanceService] updateDaily error:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen semanal
   * GET /attendance/weekly-summary
   */
  getWeeklySummary: async (weekNumber?: number, year?: number): Promise<AttendanceWeeklySummary> => {
    try {
      const params = new URLSearchParams();
      if (weekNumber) params.append('weekNumber', weekNumber.toString());
      if (year) params.append('year', year.toString());

      const url = `/attendance/weekly-summary${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: AttendanceWeeklySummary }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [AttendanceService] getWeeklySummary error:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas
   * GET /attendance/stats
   */
  getStats: async (date?: string): Promise<AttendanceStats> => {
    try {
      const url = date ? `/attendance/stats?date=${date}` : '/attendance/stats';
      const response = await api.get<{ success: boolean; data: AttendanceStats }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [AttendanceService] getStats error:', error);
      throw error;
    }
  },

  /**
   * Cerrar lista del día
   * POST /attendance/close-day
   */
  closeDay: async (date: string): Promise<any> => {
    try {
      const response = await api.post<{ success: boolean; data: any }>('/attendance/close-day', { date });
      return response.data;
    } catch (error) {
      console.error('❌ [AttendanceService] closeDay error:', error);
      throw error;
    }
  },
};