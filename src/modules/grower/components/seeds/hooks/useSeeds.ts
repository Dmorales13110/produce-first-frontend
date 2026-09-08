// src/modules/grower/hooks/useSeeds.ts
import { useState, useEffect, useCallback } from 'react';
import { SeedsService, type SeedDosage, type SeedNeed,type  SeedOrder, type SeedSummary, type SeedCrop, type SeedFilters } from '../../../../../services/seeds';

interface UseSeedsReturn {
  crops: SeedCrop[];
  dosages: SeedDosage[];
  needs: SeedNeed[];
  orders: SeedOrder[];
  summary: SeedSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createDosage: (data: any) => Promise<SeedDosage>;
  updateDosage: (id: string, data: any) => Promise<SeedDosage>;
  deleteDosage: (id: string) => Promise<void>;
  generateOrder: (supplier: string) => Promise<any>;
}

export const useSeeds = (): UseSeedsReturn => {
  const [crops, setCrops] = useState<SeedCrop[]>([]);
  const [dosages, setDosages] = useState<SeedDosage[]>([]);
  const [needs, setNeeds] = useState<SeedNeed[]>([]);
  const [orders, setOrders] = useState<SeedOrder[]>([]);
  const [summary, setSummary] = useState<SeedSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cropsData, dosagesData, needsData, ordersData, summaryData] = await Promise.all([
        SeedsService.getCrops(),
        SeedsService.getDosages(),
        SeedsService.getNeeds(),
        SeedsService.getOrders(),
        SeedsService.getSummary(),
      ]);
      setCrops(cropsData);
      setDosages(dosagesData);
      setNeeds(needsData);
      setOrders(ordersData);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [useSeeds] refresh error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos de semilla');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDosage = useCallback(async (data: any): Promise<SeedDosage> => {
    try {
      const result = await SeedsService.createDosage(data);
      await refresh();
      return result;
    } catch (err) {
      console.error('❌ [useSeeds] createDosage error:', err);
      throw err;
    }
  }, [refresh]);

  const updateDosage = useCallback(async (id: string, data: any): Promise<SeedDosage> => {
    try {
      const result = await SeedsService.updateDosage(id, data);
      await refresh();
      return result;
    } catch (err) {
      console.error('❌ [useSeeds] updateDosage error:', err);
      throw err;
    }
  }, [refresh]);

  const deleteDosage = useCallback(async (id: string): Promise<void> => {
    try {
      await SeedsService.deleteDosage(id);
      await refresh();
    } catch (err) {
      console.error('❌ [useSeeds] deleteDosage error:', err);
      throw err;
    }
  }, [refresh]);

  const generateOrder = useCallback(async (supplier: string): Promise<any> => {
    try {
      const result = await SeedsService.generateOrder(supplier);
      await refresh();
      return result;
    } catch (err) {
      console.error('❌ [useSeeds] generateOrder error:', err);
      throw err;
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    crops,
    dosages,
    needs,
    orders,
    summary,
    isLoading,
    error,
    refresh,
    createDosage,
    updateDosage,
    deleteDosage,
    generateOrder,
  };
};