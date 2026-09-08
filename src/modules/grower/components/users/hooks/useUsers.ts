import { useState, useEffect, useCallback, useRef } from 'react';
import {
  UsersService,
  type User,
  type UserRole,
  type AccessLog,
  type UsersSummary,
  type UsersFilters,
} from '../../../../../services/users';

interface UseUsersReturn {
  users: User[];
  roles: UserRole[];
  logs: AccessLog[];
  summary: UsersSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: UsersFilters;
  setFilters: (filters: UsersFilters) => void;
  refresh: () => Promise<void>;
  createUser: (data: any) => Promise<User>;
  updateUser: (id: string, data: any) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string, isActive: boolean) => Promise<User>;
  createRole: (data: any) => Promise<UserRole>;
  updateRole: (id: string, data: any) => Promise<UserRole>;
  deleteRole: (id: string) => Promise<void>;
}

export const useUsers = (initialFilters?: UsersFilters): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [summary, setSummary] = useState<UsersSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UsersFilters>(initialFilters || {});
  
  const isMounted = useRef(true);
  const fetchInProgress = useRef(false);
  const initialFetchDone = useRef(false);

  const fetchData = useCallback(async () => {
    if (fetchInProgress.current) return;

    fetchInProgress.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const [usersData, rolesData, logsData, summaryData] = await Promise.all([
        UsersService.getUsers(filters),
        UsersService.getRoles(),
        UsersService.getAccessLogs(undefined, 50),
        UsersService.getSummary(),
      ]);

      if (isMounted.current) {
        setUsers(usersData || []);
        setRoles(rolesData || []);
        setLogs(logsData || []);
        setSummary(summaryData);
        initialFetchDone.current = true;
      }
    } catch (err) {
      console.error('❌ [useUsers] fetch error:', err);
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
      fetchInProgress.current = false;
    }
  }, [filters]);

  const createUser = useCallback(async (data: any): Promise<User> => {
    try {
      const result = await UsersService.createUser(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useUsers] createUser error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateUser = useCallback(async (id: string, data: any): Promise<User> => {
    try {
      const result = await UsersService.updateUser(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useUsers] updateUser error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    try {
      await UsersService.deleteUser(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useUsers] deleteUser error:', err);
      throw err;
    }
  }, [fetchData]);

  const toggleUserStatus = useCallback(async (id: string, isActive: boolean): Promise<User> => {
    try {
      const result = await UsersService.toggleUserStatus(id, isActive);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useUsers] toggleUserStatus error:', err);
      throw err;
    }
  }, [fetchData]);

  const createRole = useCallback(async (data: any): Promise<UserRole> => {
    try {
      const result = await UsersService.createRole(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useUsers] createRole error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateRole = useCallback(async (id: string, data: any): Promise<UserRole> => {
    try {
      const result = await UsersService.updateRole(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useUsers] updateRole error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteRole = useCallback(async (id: string): Promise<void> => {
    try {
      await UsersService.deleteRole(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useUsers] deleteRole error:', err);
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    isMounted.current = true;
    if (!initialFetchDone.current) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (initialFetchDone.current) {
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [filters]);

  return {
    users,
    roles,
    logs,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    createRole,
    updateRole,
    deleteRole,
  };
};