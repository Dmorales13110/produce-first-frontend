// src/modules/grower/hooks/usePlanning.ts
import { useState, useEffect, useCallback } from 'react';
import { PlanningService, type PlanningSummary, type PlanningWeek, type PlanningFilters } from '../../../../../services/planning';

interface UsePlanningReturn {
  summary: PlanningSummary | null;
  weeks: PlanningWeek[];
  isLoading: boolean;
  error: string | null;
  filters: PlanningFilters;
  setFilters: (filters: PlanningFilters) => void;
  refresh: () => Promise<void>;
}

export const usePlanning = (): UsePlanningReturn => {
  const [summary, setSummary] = useState<PlanningSummary | null>(null);
  const [weeks, setWeeks] = useState<PlanningWeek[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PlanningFilters>({ status: 'all' });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryData, weeksData] = await Promise.all([
        PlanningService.getSummary(filters),
        PlanningService.getWeeks(filters),
      ]);
      setSummary(summaryData);
      setWeeks(weeksData);
    } catch (err) {
      console.error('❌ [usePlanning] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar planeación');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    summary,
    weeks,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
  };
};