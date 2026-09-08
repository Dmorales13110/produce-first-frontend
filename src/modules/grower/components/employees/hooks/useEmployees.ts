import { useState, useEffect, useCallback } from 'react';
import {
  EmployeesService,
  type Employee,
  type HarvesterRanking,
  type HarvestRate,
  type EmployeesSummary,
  type EmployeeFilters,
} from '../../../../../services/employees';

interface UseEmployeesReturn {
  employees: Employee[];
  ranking: HarvesterRanking[];
  rates: HarvestRate[];
  summary: EmployeesSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: EmployeeFilters;
  setFilters: (filters: EmployeeFilters) => void;
  refresh: () => Promise<void>;
  createEmployee: (data: any) => Promise<Employee>;
  updateEmployee: (id: string, data: any) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  updateRate: (id: string, data: any) => Promise<HarvestRate>;
}

export const useEmployees = (initialFilters?: EmployeeFilters): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [ranking, setRanking] = useState<HarvesterRanking[]>([]);
  const [rates, setRates] = useState<HarvestRate[]>([]);
  const [summary, setSummary] = useState<EmployeesSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>(initialFilters || {});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [employeesData, rankingData, ratesData, summaryData] = await Promise.all([
        EmployeesService.getEmployees(filters),
        EmployeesService.getRanking(),
        EmployeesService.getRates(),
        EmployeesService.getSummary(),
      ]);

      setEmployees(employeesData || []);
      setRanking(rankingData || []);
      setRates(ratesData || []);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [useEmployees] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar empleados');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createEmployee = useCallback(async (data: any): Promise<Employee> => {
    try {
      const result = await EmployeesService.createEmployee(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useEmployees] createEmployee error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateEmployee = useCallback(async (id: string, data: any): Promise<Employee> => {
    try {
      const result = await EmployeesService.updateEmployee(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useEmployees] updateEmployee error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteEmployee = useCallback(async (id: string): Promise<void> => {
    try {
      await EmployeesService.deleteEmployee(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useEmployees] deleteEmployee error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateRate = useCallback(async (id: string, data: any): Promise<HarvestRate> => {
    try {
      const result = await EmployeesService.updateRates(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useEmployees] updateRate error:', err);
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    employees,
    ranking,
    rates,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updateRate,
  };
};