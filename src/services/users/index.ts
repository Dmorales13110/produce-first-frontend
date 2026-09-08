import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  auth_user_id?: string;
  name: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  role_id: string;
  status: string;
  is_active: boolean;
  grower_id?: string;
  empresa_id?: string;
  grower?: any;
  zone?: string;
  device_type: 'celular' | 'tablet' | 'computadora';
  pin_code?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface AccessLog {
  id: string;
  user_id: string;
  user?: User;
  action: string;
  module: string;
  details: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface UsersSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  lastLogin: string;
  roles: Record<string, number>;
}

export interface UsersFilters {
  status?: string;
  roleId?: string;
  search?: string;
  empresaId?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const UsersService = {
  // ============================================================
  // USERS
  // ============================================================

  getUsers: async (filters?: UsersFilters): Promise<User[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.roleId) queryParams.append('roleId', filters.roleId);
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.empresaId) queryParams.append('empresaId', filters.empresaId);

      const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: User[] }>(url);
      return response.data || [];
    } catch (error) {
      console.error('❌ [UsersService] getUsers error:', error);
      return [];
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get<{ success: boolean; data: User }>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [UsersService] getUserById error:', error);
      throw error;
    }
  },

  createUser: async (data: any): Promise<User> => {
    try {
      const response = await api.post<{ success: boolean; data: User }>('/users', data);
      return response.data;
    } catch (error) {
      console.error('❌ [UsersService] createUser error:', error);
      throw error;
    }
  },

  updateUser: async (id: string, data: any): Promise<User> => {
    try {
      const response = await api.put<{ success: boolean; data: User }>(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [UsersService] updateUser error:', error);
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error('❌ [UsersService] deleteUser error:', error);
      throw error;
    }
  },

  toggleUserStatus: async (id: string, isActive: boolean): Promise<User> => {
    try {
      const response = await api.patch<{ success: boolean; data: User }>(`/users/${id}/status`, { is_active: isActive });
      return response.data;
    } catch (error) {
      console.error('❌ [UsersService] toggleUserStatus error:', error);
      throw error;
    }
  },

  // ============================================================
  // ROLES
  // ============================================================

  getRoles: async (): Promise<UserRole[]> => {
    try {
      const response = await api.get<{ success: boolean; data: UserRole[] }>('/users/roles');
      return response.data || [];
    } catch (error) {
      console.error('❌ [UsersService] getRoles error:', error);
      return [];
    }
  },

  createRole: async (data: any): Promise<UserRole> => {
    try {
      const response = await api.post<{ success: boolean; data: UserRole }>('/users/roles', data);
      return response.data;
    } catch (error) {
      console.error('❌ [UsersService] createRole error:', error);
      throw error;
    }
  },

  updateRole: async (id: string, data: any): Promise<UserRole> => {
    try {
      const response = await api.put<{ success: boolean; data: UserRole }>(`/users/roles/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [UsersService] updateRole error:', error);
      throw error;
    }
  },

  deleteRole: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/roles/${id}`);
    } catch (error) {
      console.error('❌ [UsersService] deleteRole error:', error);
      throw error;
    }
  },

  // ============================================================
  // ACCESS LOGS
  // ============================================================

  getAccessLogs: async (userId?: string, limit?: number): Promise<AccessLog[]> => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (limit) params.append('limit', limit.toString());

      const url = `/users/logs${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: AccessLog[] }>(url);
      return response.data || [];
    } catch (error) {
      console.error('❌ [UsersService] getAccessLogs error:', error);
      return [];
    }
  },

  // ============================================================
  // SUMMARY
  // ============================================================

  getSummary: async (): Promise<UsersSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: UsersSummary }>('/users/summary');
      return response.data || {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        lastLogin: 'Nunca',
        roles: {},
      };
    } catch (error) {
      console.error('❌ [UsersService] getSummary error:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        lastLogin: 'Nunca',
        roles: {},
      };
    }
  },
};