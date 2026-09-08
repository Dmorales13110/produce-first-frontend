// src/modules/grower/hooks/useConcentrated.ts
import { useState, useEffect, useCallback } from 'react';
import { ConcentratedService, type ConcentratedSummary, type ConcentratedFilters } from '../../../../../services/concentrated';

interface UseConcentratedReturn {
  data: ConcentratedSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: ConcentratedFilters;
  setFilters: (filters: ConcentratedFilters) => void;
  refresh: () => Promise<void>;
}

export const useConcentrated = (): UseConcentratedReturn => {
  const [data, setData] = useState<ConcentratedSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ConcentratedFilters>({});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ConcentratedService.getConcentrated(filters);
      setData(result);
    } catch (err) {
      console.error('❌ [useConcentrated] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar concentrados');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
  };
};