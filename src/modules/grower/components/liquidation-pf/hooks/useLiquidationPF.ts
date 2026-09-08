import { useState, useEffect, useCallback } from 'react';
import {
  LiquidationPFService,
  type Liquidation,
  type LiquidationTruck,
  type LiquidationReconciliation,
  type LiquidationSummary,
  type LiquidationFilters,
} from '../../../../../services/liquidation-pf';

interface UseLiquidationPFReturn {
  liquidation: Liquidation | null;
  trucks: LiquidationTruck[];
  reconciliation: LiquidationReconciliation[];
  summary: LiquidationSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateLiquidation: (data: any) => Promise<Liquidation>;
  addTruck: (data: any) => Promise<LiquidationTruck>;
  updateTruck: (id: string, data: any) => Promise<LiquidationTruck>;
  deleteTruck: (id: string) => Promise<void>;
  reconcile: () => Promise<Liquidation>;
  sendToCXC: () => Promise<Liquidation>;
}

export const useLiquidationPF = (liquidationId: string): UseLiquidationPFReturn => {
  const [liquidation, setLiquidation] = useState<Liquidation | null>(null);
  const [trucks, setTrucks] = useState<LiquidationTruck[]>([]);
  const [reconciliation, setReconciliation] = useState<LiquidationReconciliation[]>([]);
  const [summary, setSummary] = useState<LiquidationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!liquidationId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const [liquidationData, trucksData, reconciliationData, summaryData] = await Promise.all([
        LiquidationPFService.getLiquidationById(liquidationId),
        LiquidationPFService.getTrucks(liquidationId),
        LiquidationPFService.getReconciliation(liquidationId),
        LiquidationPFService.getSummary(liquidationId),
      ]);

      setLiquidation(liquidationData);
      setTrucks(trucksData || []);
      setReconciliation(reconciliationData || []);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [useLiquidationPF] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar liquidación');
    } finally {
      setIsLoading(false);
    }
  }, [liquidationId]);

  const updateLiquidation = useCallback(async (data: any): Promise<Liquidation> => {
    try {
      const result = await LiquidationPFService.updateLiquidation(liquidationId, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useLiquidationPF] updateLiquidation error:', err);
      throw err;
    }
  }, [liquidationId, fetchData]);

  const addTruck = useCallback(async (data: any): Promise<LiquidationTruck> => {
    try {
      const result = await LiquidationPFService.addTruck(liquidationId, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useLiquidationPF] addTruck error:', err);
      throw err;
    }
  }, [liquidationId, fetchData]);

  const updateTruck = useCallback(async (id: string, data: any): Promise<LiquidationTruck> => {
    try {
      const result = await LiquidationPFService.updateTruck(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useLiquidationPF] updateTruck error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteTruck = useCallback(async (id: string): Promise<void> => {
    try {
      await LiquidationPFService.deleteTruck(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useLiquidationPF] deleteTruck error:', err);
      throw err;
    }
  }, [fetchData]);

  const reconcile = useCallback(async (): Promise<Liquidation> => {
    try {
      const result = await LiquidationPFService.reconcile(liquidationId);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useLiquidationPF] reconcile error:', err);
      throw err;
    }
  }, [liquidationId, fetchData]);

  const sendToCXC = useCallback(async (): Promise<Liquidation> => {
    try {
      const result = await LiquidationPFService.sendToCXC(liquidationId);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useLiquidationPF] sendToCXC error:', err);
      throw err;
    }
  }, [liquidationId, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    liquidation,
    trucks,
    reconciliation,
    summary,
    isLoading,
    error,
    refresh: fetchData,
    updateLiquidation,
    addTruck,
    updateTruck,
    deleteTruck,
    reconcile,
    sendToCXC,
  };
};