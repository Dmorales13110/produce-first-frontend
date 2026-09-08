import { useState, useEffect, useCallback, useRef } from 'react';
import {
  AttendanceService,
  type AttendanceDaily,
  type AttendanceWeeklySummary,
  type AttendanceStats,
  type AttendanceFilters,
} from '../../../../../services/attendance';

interface UseAttendanceReturn {
  dailyRecords: AttendanceDaily[];
  weeklySummary: AttendanceWeeklySummary | null;
  stats: AttendanceStats | null;
  isLoading: boolean;
  error: string | null;
  filters: AttendanceFilters;
  setFilters: (filters: AttendanceFilters) => void;
  refresh: () => Promise<void>;
  saveDaily: (data: any) => Promise<AttendanceDaily>;
  updateDaily: (id: string, data: any) => Promise<AttendanceDaily>;
  closeDay: (date: string) => Promise<any>;
  today: Date;
  weekRange: { dateFrom: string; dateTo: string };
  getWeekNumber: () => number;
}

export const useAttendance = (initialFilters?: AttendanceFilters): UseAttendanceReturn => {
  const [dailyRecords, setDailyRecords] = useState<AttendanceDaily[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<AttendanceWeeklySummary | null>(null);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AttendanceFilters>(initialFilters || {});
  
  // Refs para controlar el ciclo de vida
  const isMounted = useRef(true);
  const fetchInProgress = useRef(false);
  const initialFetchDone = useRef(false);
  const filtersRef = useRef(filters);

  const today = new Date();
  
  const getWeekNumber = useCallback((): number => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = (now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000);
    return Math.ceil(diff);
  }, []);

  const getWeekRange = useCallback(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    const friday = new Date(monday);
    friday.setDate(friday.getDate() + 4);
    
    return {
      dateFrom: monday.toISOString().split('T')[0],
      dateTo: friday.toISOString().split('T')[0],
    };
  }, []);

  const weekRange = getWeekRange();

  // Función fetchData estable (no depende de filtros como dependencia)
  const fetchData = useCallback(async () => {
    // Evitar llamadas simultáneas
    if (fetchInProgress.current) {
      console.log('⏳ [useAttendance] Fetch already in progress, skipping...');
      return;
    }

    fetchInProgress.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const currentFilters = filtersRef.current;
      console.log('📊 [useAttendance] Fetching attendance data with filters:', currentFilters);
      
      const [dailyData, weeklyData, statsData] = await Promise.all([
        AttendanceService.getDaily({
          ...currentFilters,
          dateFrom: currentFilters.dateFrom || weekRange.dateFrom,
          dateTo: currentFilters.dateTo || weekRange.dateTo,
        }),
        AttendanceService.getWeeklySummary(),
        AttendanceService.getStats(),
      ]);

      if (isMounted.current) {
        setDailyRecords(dailyData || []);
        setWeeklySummary(weeklyData);
        setStats(statsData);
        initialFetchDone.current = true;
        console.log('✅ [useAttendance] Data loaded successfully');
      }
    } catch (err) {
      console.error('❌ [useAttendance] fetch error:', err);
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Error al cargar asistencia');
        setDailyRecords([]);
        setWeeklySummary(null);
        setStats({
          totalEmployees: 0,
          present: 0,
          absent: 0,
          totalHours: 0,
          overtime: 0,
          attendancePercent: 0,
        });
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
      fetchInProgress.current = false;
    }
  }, [weekRange]);

  // Función para refrescar (se puede llamar desde fuera)
  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const saveDaily = useCallback(async (data: any): Promise<AttendanceDaily> => {
    try {
      const result = await AttendanceService.saveDaily(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAttendance] saveDaily error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateDaily = useCallback(async (id: string, data: any): Promise<AttendanceDaily> => {
    try {
      const result = await AttendanceService.updateDaily(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAttendance] updateDaily error:', err);
      throw err;
    }
  }, [fetchData]);

  const closeDay = useCallback(async (date: string): Promise<any> => {
    try {
      const result = await AttendanceService.closeDay(date);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAttendance] closeDay error:', err);
      throw err;
    }
  }, [fetchData]);

  // Actualizar el ref cuando cambian los filtros
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Solo ejecutar una vez al montar el componente
  useEffect(() => {
    isMounted.current = true;
    
    // Solo hacer fetch si no se ha hecho antes
    if (!initialFetchDone.current) {
      fetchData();
    }

    // Limpiar al desmontar
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío - SOLO UNA VEZ

  // Cuando cambien los filtros, hacer fetch (con debounce)
  useEffect(() => {
    // Si ya se hizo el fetch inicial y los filtros cambian
    if (initialFetchDone.current) {
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 1000); // Debounce de 1 segundo

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // Solo depende de filters

  return {
    dailyRecords,
    weeklySummary,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    saveDaily,
    updateDaily,
    closeDay,
    today,
    weekRange,
    getWeekNumber,
  };
};