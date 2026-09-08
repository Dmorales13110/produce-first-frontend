import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface PayrollTeam {
  id: string;
  code: string;
  name: string;
  empresa_id?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Worker {
  id: string;
  code: string;
  name: string;
  last_name: string;
  rfc?: string;
  curp?: string;
  nss?: string;
  team_id?: string;
  team?: PayrollTeam;
  position?: string;
  salary_type: 'salario' | 'destajo' | 'mixto';
  base_salary: number;
  is_active: boolean;
  hire_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  worker_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  hours_worked: number;
  status: 'present' | 'absent' | 'vacation' | 'sick' | 'holiday';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PayrollItem {
  id: string;
  code: string;
  week_number: number;
  year: number;
  team_id: string;
  team?: PayrollTeam;
  total_workers: number;
  total_days: number;
  total_hours: number;
  total_piecework: number;
  total_amount: number;
  status: 'draft' | 'ready' | 'authorized' | 'paid';
  authorization_date?: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PayrollDetail {
  id: string;
  payroll_id: string;
  worker_id: string;
  worker?: Worker;
  days_worked: number;
  hours_worked: number;
  piecework_amount: number;
  salary_amount: number;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PayrollSummary {
  totalAmount: number;
  totalWorkers: number;
  totalHours: number;
  totalPiecework: number;
  byTeam: Array<{
    team_id: string;
    team_name: string;
    workers: number;
    amount: number;
    percentage: number;
  }>;
  byStatus: {
    draft: number;
    ready: number;
    authorized: number;
    paid: number;
  };
}

export interface PayrollFilters {
  weekNumber?: number;
  year?: number;
  teamId?: string;
  status?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const PayrollService = {
  // ============================================================
  // TEAMS
  // ============================================================

  getTeams: async (): Promise<PayrollTeam[]> => {
    try {
      const response = await api.get<{ success: boolean; data: PayrollTeam[] }>('/payroll/teams');
      return response.data;
    } catch (error) {
      console.error('❌ [PayrollService] getTeams error:', error);
      throw error;
    }
  },

  // ============================================================
  // WORKERS
  // ============================================================

  getWorkers: async (teamId?: string): Promise<Worker[]> => {
    try {
      const url = teamId ? `/payroll/workers?teamId=${teamId}` : '/payroll/workers';
      const response = await api.get<{ success: boolean; data: Worker[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PayrollService] getWorkers error:', error);
      throw error;
    }
  },

  // ============================================================
  // ATTENDANCE
  // ============================================================

  getAttendance: async (filters?: { workerId?: string; dateFrom?: string; dateTo?: string }): Promise<Attendance[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.workerId) queryParams.append('workerId', filters.workerId);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

      const url = `/payroll/attendance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: Attendance[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PayrollService] getAttendance error:', error);
      throw error;
    }
  },

  saveAttendance: async (data: { worker_id: string; date: string; check_in?: string; check_out?: string; hours_worked?: number; status: string }): Promise<Attendance> => {
    try {
      const response = await api.post<{ success: boolean; data: Attendance }>('/payroll/attendance', data);
      return response.data;
    } catch (error) {
      console.error('❌ [PayrollService] saveAttendance error:', error);
      throw error;
    }
  },

  // ============================================================
  // PAYROLL
  // ============================================================

  getPayroll: async (filters?: PayrollFilters): Promise<PayrollItem[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.weekNumber) queryParams.append('weekNumber', filters.weekNumber.toString());
      if (filters?.year) queryParams.append('year', filters.year.toString());
      if (filters?.teamId) queryParams.append('teamId', filters.teamId);
      if (filters?.status) queryParams.append('status', filters.status);

      const url = `/payroll${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: PayrollItem[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PayrollService] getPayroll error:', error);
      throw error;
    }
  },

  getPayrollById: async (id: string): Promise<PayrollItem> => {
    try {
      const response = await api.get<{ success: boolean; data: PayrollItem }>(`/payroll/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [PayrollService] getPayrollById error:', error);
      throw error;
    }
  },

  getPayrollDetails: async (payrollId: string): Promise<PayrollDetail[]> => {
    try {
      const response = await api.get<{ success: boolean; data: PayrollDetail[] }>(`/payroll/${payrollId}/details`);
      return response.data;
    } catch (error) {
      console.error('❌ [PayrollService] getPayrollDetails error:', error);
      throw error;
    }
  },

  generatePayroll: async (weekNumber: number, year?: number): Promise<PayrollItem> => {
    try {
      const response = await api.post<{ success: boolean; data: PayrollItem }>('/payroll/generate', {
        weekNumber,
        year: year || new Date().getFullYear(),
      });
      return response.data;
    } catch (error) {
      console.error('❌ [PayrollService] generatePayroll error:', error);
      throw error;
    }
  },

  authorizePayroll: async (id: string): Promise<PayrollItem> => {
    try {
      const response = await api.post<{ success: boolean; data: PayrollItem }>(`/payroll/${id}/authorize`);
      return response.data;
    } catch (error) {
      console.error('❌ [PayrollService] authorizePayroll error:', error);
      throw error;
    }
  },

  markAsPaid: async (id: string, paymentDate?: string): Promise<PayrollItem> => {
    try {
      const response = await api.post<{ success: boolean; data: PayrollItem }>(`/payroll/${id}/paid`, {
        payment_date: paymentDate || new Date().toISOString().split('T')[0],
      });
      return response.data;
    } catch (error) {
      console.error('❌ [PayrollService] markAsPaid error:', error);
      throw error;
    }
  },

  // ============================================================
  // SUMMARY
  // ============================================================

  getSummary: async (weekNumber?: number, year?: number): Promise<PayrollSummary> => {
    try {
      const queryParams = new URLSearchParams();
      if (weekNumber) queryParams.append('weekNumber', weekNumber.toString());
      if (year) queryParams.append('year', year.toString());

      const url = `/payroll/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: PayrollSummary }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PayrollService] getSummary error:', error);
      throw error;
    }
  },
};