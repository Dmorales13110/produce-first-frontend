import { useState, useEffect, useCallback } from 'react';
import {
  CashFlowService,
  type BankBalance,
  type CashFlowProjection,
  type WeeklyDetail,
  type LiquidityGap,
  type CashFlowSummary,
  type SaveBankBalanceInput,
  type SaveExchangeRateInput,
} from '../../../../../services/cash-flow';

interface UseCashFlowReturn {
  // Datos
  balances: BankBalance[];
  projection: CashFlowProjection[];
  weeklyDetail: WeeklyDetail[];
  liquidityGaps: LiquidityGap[];
  summary: CashFlowSummary | null;
  exchangeRate: { rate: number; date: string } | null;
  
  // Estados
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  refresh: () => Promise<void>;
  saveBankBalance: (data: SaveBankBalanceInput) => Promise<BankBalance>;
  saveExchangeRate: (data: SaveExchangeRateInput) => Promise<any>;
}

export const useCashFlow = (): UseCashFlowReturn => {
  const [balances, setBalances] = useState<BankBalance[]>([]);
  const [projection, setProjection] = useState<CashFlowProjection[]>([]);
  const [weeklyDetail, setWeeklyDetail] = useState<WeeklyDetail[]>([]);
  const [liquidityGaps, setLiquidityGaps] = useState<LiquidityGap[]>([]);
  const [summary, setSummary] = useState<CashFlowSummary | null>(null);
  const [exchangeRate, setExchangeRate] = useState<{ rate: number; date: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        balancesData,
        projectionData,
        weeklyData,
        gapsData,
        summaryData,
        rateData,
      ] = await Promise.all([
        CashFlowService.getBankBalances(),
        CashFlowService.getProjection(),
        CashFlowService.getWeeklyDetail(4),
        CashFlowService.getLiquidityGaps(3),
        CashFlowService.getSummary(),
        CashFlowService.getExchangeRate(),
      ]);

      setBalances(balancesData || []);
      setProjection(projectionData || []);
      setWeeklyDetail(weeklyData || []);
      setLiquidityGaps(gapsData || []);
      setSummary(summaryData);
      setExchangeRate(rateData);
    } catch (err) {
      console.error('❌ [useCashFlow] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos de flujo de caja');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveBankBalance = useCallback(async (data: SaveBankBalanceInput): Promise<BankBalance> => {
    try {
      const result = await CashFlowService.saveBankBalance(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useCashFlow] saveBankBalance error:', err);
      throw err;
    }
  }, [fetchData]);

  const saveExchangeRate = useCallback(async (data: SaveExchangeRateInput): Promise<any> => {
    try {
      const result = await CashFlowService.saveExchangeRate(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useCashFlow] saveExchangeRate error:', err);
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    balances,
    projection,
    weeklyDetail,
    liquidityGaps,
    summary,
    exchangeRate,
    isLoading,
    error,
    refresh: fetchData,
    saveBankBalance,
    saveExchangeRate,
  };
};