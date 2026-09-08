import { useState, useEffect, useCallback } from 'react';
import {
  FinanceDashboardService,
  type FinancialMetric,
  type RanchSummary,
  type HarvestProgress,
  type DashboardSummary,
  type FinanceDashboardData,
} from '../../../../../services/finance-dashboard';

interface UseFinanceDashboardReturn {
  data: FinanceDashboardData | null;
  metrics: FinancialMetric[];
  ranches: RanchSummary[];
  harvestProgress: HarvestProgress | null;
  summary: DashboardSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  empresaId: string | null;
  setEmpresaId: (id: string | null) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  filteredRanches: RanchSummary[];
  totalMetrics: {
    totalRevenue: number;
    totalCosts: number;
    totalProfit: number;
    avgMargin: number;
  };
}

export const useFinanceDashboard = (initialEmpresaId?: string): UseFinanceDashboardReturn => {
  const [data, setData] = useState<FinanceDashboardData | null>(null);
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
  const [ranches, setRanches] = useState<RanchSummary[]>([]);
  const [harvestProgress, setHarvestProgress] = useState<HarvestProgress | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [empresaId, setEmpresaId] = useState<string | null>(initialEmpresaId || null);
  const [timeRange, setTimeRange] = useState<string>('ytd');

  // Filtrar ranchos por empresa
  const filteredRanches = ranches.filter(ranch => {
    if (!empresaId) return true;
    return ranch.empresa_id === empresaId;
  });

  // Calcular totales
  const totalMetrics = {
    totalRevenue: metrics.find(m => m.metric_key === 'total_revenue')?.current_value || 0,
    totalCosts: metrics.find(m => m.metric_key === 'operating_costs')?.current_value || 0,
    totalProfit: metrics.find(m => m.metric_key === 'net_profit')?.current_value || 0,
    avgMargin: metrics.find(m => m.metric_key === 'net_margin')?.current_value || 0,
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashboardData, metricsData, ranchesData, progressData, summaryData] = await Promise.all([
        FinanceDashboardService.getDashboardData(empresaId || undefined),
        FinanceDashboardService.getMetrics(),
        FinanceDashboardService.getRanches(),
        FinanceDashboardService.getHarvestProgress(),
        FinanceDashboardService.getSummary(),
      ]);

      setData(dashboardData);
      setMetrics(metricsData);
      setRanches(ranchesData);
      setHarvestProgress(progressData);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [useFinanceDashboard] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar dashboard financiero');
    } finally {
      setIsLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    metrics,
    ranches,
    harvestProgress,
    summary,
    isLoading,
    error,
    refresh: fetchData,
    empresaId,
    setEmpresaId,
    timeRange,
    setTimeRange,
    filteredRanches,
    totalMetrics,
  };
};