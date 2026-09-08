// src/modules/grower/pl/hooks/usePL.ts
import { useState, useEffect, useCallback } from 'react';
import { PLService } from '../../../../../services/pl';
import type { PLSummary, FinanceStats } from '../../../../../services/pl';

interface UsePLReturn {
  summary: PLSummary | null;
  stats: FinanceStats | null;
  isLoading: boolean;
  error: string | null;
  selectedGrower: string;
  setSelectedGrower: (id: string) => void;
  refresh: () => Promise<void>;
  getGrowerOptions: () => { value: string; label: string }[];
}

export const usePL = (): UsePLReturn => {
  const [summary, setSummary] = useState<PLSummary | null>(null);
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrower, setSelectedGrower] = useState<string>('todos');

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (selectedGrower !== 'todos') {
        params.growerId = selectedGrower;
      }
      
      const [summaryData, statsData] = await Promise.all([
        PLService.getSummary(params),
        PLService.getFinanceStats(),
      ]);
      
      setSummary(summaryData);
      setStats(statsData);
    } catch (err) {
      console.error('❌ [usePL] refresh error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos de P&L');
    } finally {
      setIsLoading(false);
    }
  }, [selectedGrower]);

  const getGrowerOptions = useCallback(() => {
    if (!stats?.advancesByGrower) return [{ value: 'todos', label: 'Todos los ranchos' }];
    
    const uniqueGrowers = stats.advancesByGrower.map(g => ({
      value: g.grower_id,
      label: g.grower_name || 'Rancho sin nombre',
    }));
    
    return [{ value: 'todos', label: 'Todos los ranchos' }, ...uniqueGrowers];
  }, [stats]);

  useEffect(() => {
    refresh();
  }, [refresh, selectedGrower]);

  return {
    summary,
    stats,
    isLoading,
    error,
    selectedGrower,
    setSelectedGrower,
    refresh,
    getGrowerOptions,
  };
};