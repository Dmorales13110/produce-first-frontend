import { useState, useEffect, useCallback } from 'react';
import {
  BudgetService,
  type BudgetSeason,
  type BudgetCost,
  type BudgetFOB,
  type BudgetSummary,
  type CreateCostInput,
  type UpdateCostInput,
  type CreateFOBInput,
  type UpdateFOBInput,
} from '../../../../../services/budget';

// ID de temporada por defecto
const DEFAULT_SEASON_ID = '00000000-0000-0000-0000-000000000001';

interface UseBudgetReturn {
  season: BudgetSeason | null;
  costs: BudgetCost[];
  fob: BudgetFOB[];
  summary: BudgetSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateSeason: (data: Partial<BudgetSeason>) => Promise<BudgetSeason>;
  createCost: (data: CreateCostInput) => Promise<BudgetCost>;
  updateCost: (id: string, data: UpdateCostInput) => Promise<BudgetCost>;
  deleteCost: (id: string) => Promise<void>;
  createFOB: (data: CreateFOBInput) => Promise<BudgetFOB>;
  updateFOB: (id: string, data: UpdateFOBInput) => Promise<BudgetFOB>;
  deleteFOB: (id: string) => Promise<void>;
  saveBudget: () => Promise<void>;
}

export const useBudget = (seasonId: string = DEFAULT_SEASON_ID): UseBudgetReturn => {
  const [season, setSeason] = useState<BudgetSeason | null>(null);
  const [costs, setCosts] = useState<BudgetCost[]>([]);
  const [fob, setFob] = useState<BudgetFOB[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!seasonId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const summaryData = await BudgetService.getSummary(seasonId);
      setSummary(summaryData);
      setSeason(summaryData.season);
      setCosts(summaryData.costs);
      setFob(summaryData.fob);
    } catch (err) {
      console.error('❌ [useBudget] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar presupuesto');
    } finally {
      setIsLoading(false);
    }
  }, [seasonId]);

  const updateSeason = useCallback(async (data: Partial<BudgetSeason>): Promise<BudgetSeason> => {
    try {
      const result = await BudgetService.updateSeason(seasonId, data);
      setSeason(result);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useBudget] updateSeason error:', err);
      throw err;
    }
  }, [seasonId, fetchData]);

  const createCost = useCallback(async (data: CreateCostInput): Promise<BudgetCost> => {
    try {
      const result = await BudgetService.createCost(seasonId, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useBudget] createCost error:', err);
      throw err;
    }
  }, [seasonId, fetchData]);

  const updateCost = useCallback(async (id: string, data: UpdateCostInput): Promise<BudgetCost> => {
    try {
      const result = await BudgetService.updateCost(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useBudget] updateCost error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteCost = useCallback(async (id: string): Promise<void> => {
    try {
      await BudgetService.deleteCost(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useBudget] deleteCost error:', err);
      throw err;
    }
  }, [fetchData]);

  const createFOB = useCallback(async (data: CreateFOBInput): Promise<BudgetFOB> => {
    try {
      const result = await BudgetService.createFOB(seasonId, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useBudget] createFOB error:', err);
      throw err;
    }
  }, [seasonId, fetchData]);

  const updateFOB = useCallback(async (id: string, data: UpdateFOBInput): Promise<BudgetFOB> => {
    try {
      const result = await BudgetService.updateFOB(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useBudget] updateFOB error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteFOB = useCallback(async (id: string): Promise<void> => {
    try {
      await BudgetService.deleteFOB(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useBudget] deleteFOB error:', err);
      throw err;
    }
  }, [fetchData]);

  const saveBudget = useCallback(async (): Promise<void> => {
    try {
      await BudgetService.saveBudget(seasonId, { costs, fob, season });
      await fetchData();
    } catch (err) {
      console.error('❌ [useBudget] saveBudget error:', err);
      throw err;
    }
  }, [seasonId, costs, fob, season, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    season,
    costs,
    fob,
    summary,
    isLoading,
    error,
    refresh: fetchData,
    updateSeason,
    createCost,
    updateCost,
    deleteCost,
    createFOB,
    updateFOB,
    deleteFOB,
    saveBudget,
  };
};