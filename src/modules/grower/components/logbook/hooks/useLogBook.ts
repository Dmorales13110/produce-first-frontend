// src/modules/grower/hooks/useLogBook.ts
import { useState, useEffect, useCallback } from 'react';
import { LogBookService, type LogEntry, type LogSummary } from '../../../../../services/logbook';

interface UseLogBookReturn {
  logs: LogEntry[];
  summary: LogSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createLog: (data: any) => Promise<LogEntry>;
  updateLog: (data: any) => Promise<LogEntry>;
  deleteLog: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<LogEntry>;
}

export const useLogBook = (): UseLogBookReturn => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [summary, setSummary] = useState<LogSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [logsData, summaryData] = await Promise.all([
        LogBookService.getLogs(),
        LogBookService.getSummary(),
      ]);
      setLogs(logsData);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [useLogBook] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar bitácora');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLog = useCallback(async (data: any): Promise<LogEntry> => {
    try {
      const result = await LogBookService.createLog(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useLogBook] createLog error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateLog = useCallback(async (data: any): Promise<LogEntry> => {
    try {
      const result = await LogBookService.updateLog(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useLogBook] updateLog error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteLog = useCallback(async (id: string): Promise<void> => {
    try {
      await LogBookService.deleteLog(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useLogBook] deleteLog error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateStatus = useCallback(async (id: string, status: string): Promise<LogEntry> => {
    try {
      const result = await LogBookService.updateStatus(id, status);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useLogBook] updateStatus error:', err);
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    logs,
    summary,
    isLoading,
    error,
    refresh: fetchData,
    createLog,
    updateLog,
    deleteLog,
    updateStatus,
  };
};