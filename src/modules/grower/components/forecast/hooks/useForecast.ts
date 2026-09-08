// src/modules/grower/hooks/useForecast.ts
import { useState, useEffect, useCallback } from 'react';
import { ForecastService, type ForecastSummary, type ForecastFilters } from '../../../../../services/forecast';

interface UseForecastReturn {
  data: ForecastSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: ForecastFilters;
  setFilters: (filters: ForecastFilters) => void;
  refresh: () => Promise<void>;
}

export const useForecast = (): UseForecastReturn => {
  const [data, setData] = useState<ForecastSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ForecastFilters>({});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ForecastService.getForecast(filters);
      setData(result);
    } catch (err) {
      console.error('❌ [useForecast] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar pronóstico');
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