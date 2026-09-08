import { useState, useEffect, useCallback } from 'react';
import {
  PlanVsRealService,
  type PlanVsRealMetric,
  type PlanDeviation,
  type PlanVsRealSummary,
  type PlanVsRealFilters,
} from '../../../../../services/plan-vs-real';

interface UsePlanVsRealReturn {
  metrics: PlanVsRealMetric[];
  deviations: PlanDeviation[];
  summary: PlanVsRealSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: PlanVsRealFilters;
  setFilters: (filters: PlanVsRealFilters) => void;
  refresh: () => Promise<void>;
  updateDeviation: (id: string, data: { status?: string; action?: string }) => Promise<PlanDeviation>;
}

export const usePlanVsReal = (initialFilters?: PlanVsRealFilters): UsePlanVsRealReturn => {
  const [metrics, setMetrics] = useState<PlanVsRealMetric[]>([]);
  const [deviations, setDeviations] = useState<PlanDeviation[]>([]);
  const [summary, setSummary] = useState<PlanVsRealSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PlanVsRealFilters>(initialFilters || {});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [metricsData, deviationsData, summaryData] = await Promise.all([
        PlanVsRealService.getMetrics(filters),
        PlanVsRealService.getDeviations(filters),
        PlanVsRealService.getSummary(filters),
      ]);

      setMetrics(metricsData || []);
      setDeviations(deviationsData || []);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [usePlanVsReal] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos Plan vs Real');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateDeviation = useCallback(async (id: string, data: { status?: string; action?: string }): Promise<PlanDeviation> => {
    try {
      const result = await PlanVsRealService.updateDeviation(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [usePlanVsReal] updateDeviation error:', err);
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    metrics,
    deviations,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
    updateDeviation,
  };
};