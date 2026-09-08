import { useState, useEffect, useCallback } from 'react';
import {
  PayrollService,
  type PayrollTeam,
  type Worker,
  type Attendance,
  type PayrollItem,
  type PayrollDetail,
  type PayrollSummary,
  type PayrollFilters,
} from '../../../../../services/payroll';

interface UsePayrollReturn {
  // Datos
  teams: PayrollTeam[];
  workers: Worker[];
  attendance: Attendance[];
  payroll: PayrollItem[];
  payrollDetails: PayrollDetail[];
  summary: PayrollSummary | null;
  
  // Estados
  isLoading: boolean;
  error: string | null;
  filters: PayrollFilters;
  
  // Acciones
  setFilters: (filters: PayrollFilters) => void;
  refresh: () => Promise<void>;
  generatePayroll: (weekNumber: number, year?: number) => Promise<PayrollItem>;
  authorizePayroll: (id: string) => Promise<PayrollItem>;
  markAsPaid: (id: string, paymentDate?: string) => Promise<PayrollItem>;
  saveAttendance: (data: { worker_id: string; date: string; check_in?: string; check_out?: string; hours_worked?: number; status: string }) => Promise<Attendance>;
}

export const usePayroll = (initialFilters?: PayrollFilters): UsePayrollReturn => {
  const [teams, setTeams] = useState<PayrollTeam[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payroll, setPayroll] = useState<PayrollItem[]>([]);
  const [payrollDetails, setPayrollDetails] = useState<PayrollDetail[]>([]);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PayrollFilters>(initialFilters || {});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [teamsData, workersData, attendanceData, payrollData, summaryData] = await Promise.all([
        PayrollService.getTeams(),
        PayrollService.getWorkers(),
        PayrollService.getAttendance(),
        PayrollService.getPayroll(filters),
        PayrollService.getSummary(filters.weekNumber, filters.year),
      ]);

      setTeams(teamsData || []);
      setWorkers(workersData || []);
      setAttendance(attendanceData || []);
      setPayroll(payrollData || []);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [usePayroll] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos de nómina');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const generatePayroll = useCallback(async (weekNumber: number, year?: number): Promise<PayrollItem> => {
    try {
      const result = await PayrollService.generatePayroll(weekNumber, year);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [usePayroll] generatePayroll error:', err);
      throw err;
    }
  }, [fetchData]);

  const authorizePayroll = useCallback(async (id: string): Promise<PayrollItem> => {
    try {
      const result = await PayrollService.authorizePayroll(id);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [usePayroll] authorizePayroll error:', err);
      throw err;
    }
  }, [fetchData]);

  const markAsPaid = useCallback(async (id: string, paymentDate?: string): Promise<PayrollItem> => {
    try {
      const result = await PayrollService.markAsPaid(id, paymentDate);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [usePayroll] markAsPaid error:', err);
      throw err;
    }
  }, [fetchData]);

  const saveAttendance = useCallback(async (data: { worker_id: string; date: string; check_in?: string; check_out?: string; hours_worked?: number; status: string }): Promise<Attendance> => {
    try {
      const result = await PayrollService.saveAttendance(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [usePayroll] saveAttendance error:', err);
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    teams,
    workers,
    attendance,
    payroll,
    payrollDetails,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
    generatePayroll,
    authorizePayroll,
    markAsPaid,
    saveAttendance,
  };
};