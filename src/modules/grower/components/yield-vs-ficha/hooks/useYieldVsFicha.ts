import { useState, useEffect, useCallback } from 'react';
import {
  YieldVsFichaService,
  type CropYield,
  type YieldWeeklyData,
  type YieldSummary,
  type YieldFilters,
} from '../../../../../services/yield-vs-ficha';

interface UseYieldVsFichaReturn {
  crops: CropYield[];
  weeklyData: YieldWeeklyData[];
  summary: YieldSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: YieldFilters;
  setFilters: (filters: YieldFilters) => void;
  refresh: () => Promise<void>;
  updateCrop: (id: string, data: Partial<CropYield>) => Promise<CropYield>;
}

export const useYieldVsFicha = (initialFilters?: YieldFilters): UseYieldVsFichaReturn => {
  const [crops, setCrops] = useState<CropYield[]>([]);
  const [weeklyData, setWeeklyData] = useState<YieldWeeklyData[]>([]);
  const [summary, setSummary] = useState<YieldSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<YieldFilters>(initialFilters || {});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cropsData, weeklyData, summaryData] = await Promise.all([
        YieldVsFichaService.getCrops(filters),
        YieldVsFichaService.getWeeklyData(undefined, filters.weekNumber, filters.year),
        YieldVsFichaService.getSummary(filters),
      ]);

      setCrops(cropsData || []);
      setWeeklyData(weeklyData || []);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [useYieldVsFicha] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos de yield');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateCrop = useCallback(async (id: string, data: Partial<CropYield>): Promise<CropYield> => {
    try {
      const result = await YieldVsFichaService.updateCrop(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useYieldVsFicha] updateCrop error:', err);
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    crops,
    weeklyData,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
    updateCrop,
  };
};