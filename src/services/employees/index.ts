import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface Employee {
  id: string;
  code: string;
  full_name: string;
  position: string;
  employee_type: 'Fijo' | 'Capitan' | 'Eventual';
  salary: number;
  has_file: boolean;
  status: 'activo' | 'inactivo';
  seniority: string;
  team_id?: string;
  phone?: string;
  email?: string;
  hire_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HarvesterRanking {
  id: string;
  product: string;
  champion: string;
  team: string;
  boxes_per_day: number;
  target_boxes: number;
  vs_target: string;
  week_number: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface HarvestRate {
  id: string;
  product: string;
  piece_rate: number;
  target_boxes: number;
  freight: number;
  total_rate: number;
  actual_cost: string;
  validity_date: string;
  week_number: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface EmployeesSummary {
  totalEmployees: number;
  fixedEmployees: number;
  temporaryEmployees: number;
  activeEmployees: number;
  attendance: string;
}

export interface EmployeeFilters {
  status?: string;
  type?: string;
  position?: string;
  search?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const EmployeesService = {
  // ============================================================
  // EMPLOYEES
  // ============================================================

  getEmployees: async (filters?: EmployeeFilters): Promise<Employee[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.position) queryParams.append('position', filters.position);
      if (filters?.search) queryParams.append('search', filters.search);

      const url = `/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: Employee[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [EmployeesService] getEmployees error:', error);
      throw error;
    }
  },

  createEmployee: async (data: any): Promise<Employee> => {
    try {
      const response = await api.post<{ success: boolean; data: Employee }>('/employees', data);
      return response.data;
    } catch (error) {
      console.error('❌ [EmployeesService] createEmployee error:', error);
      throw error;
    }
  },

  updateEmployee: async (id: string, data: any): Promise<Employee> => {
    try {
      const response = await api.put<{ success: boolean; data: Employee }>(`/employees/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [EmployeesService] updateEmployee error:', error);
      throw error;
    }
  },

  deleteEmployee: async (id: string): Promise<void> => {
    try {
      await api.delete(`/employees/${id}`);
    } catch (error) {
      console.error('❌ [EmployeesService] deleteEmployee error:', error);
      throw error;
    }
  },

  // ============================================================
  // RANKING
  // ============================================================

  getRanking: async (weekNumber?: number, year?: number): Promise<HarvesterRanking[]> => {
    try {
      const params = new URLSearchParams();
      if (weekNumber) params.append('weekNumber', weekNumber.toString());
      if (year) params.append('year', year.toString());

      const url = `/employees/ranking${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: HarvesterRanking[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [EmployeesService] getRanking error:', error);
      throw error;
    }
  },

  // ============================================================
  // HARVEST RATES
  // ============================================================

  getRates: async (weekNumber?: number, year?: number): Promise<HarvestRate[]> => {
    try {
      const params = new URLSearchParams();
      if (weekNumber) params.append('weekNumber', weekNumber.toString());
      if (year) params.append('year', year.toString());

      const url = `/employees/rates${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: HarvestRate[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [EmployeesService] getRates error:', error);
      throw error;
    }
  },

  updateRates: async (id: string, data: any): Promise<HarvestRate> => {
    try {
      const response = await api.put<{ success: boolean; data: HarvestRate }>(`/employees/rates/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [EmployeesService] updateRates error:', error);
      throw error;
    }
  },

  // ============================================================
  // SUMMARY
  // ============================================================

  getSummary: async (): Promise<EmployeesSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: EmployeesSummary }>('/employees/summary');
      return response.data;
    } catch (error) {
      console.error('❌ [EmployeesService] getSummary error:', error);
      throw error;
    }
  },
};