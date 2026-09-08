// CashFlow/hooks/useCashFlow.ts

import { useState, useCallback, useEffect } from 'react';
import { CashFlowService } from '../../../../services/cash-flow';
import type { BankBalance } from '../../../../services/cash-flow';

interface CashFlowStats {
  saldoCuenta: number;
  flujoMes: number;
  deudaJunioOctubre: number;
  totalEntradas: number;
  totalSalidas: number;
}

export const useCashFlow = () => {
  const [saldos, setSaldos] = useState<BankBalance[]>([]);
  const [stats, setStats] = useState<CashFlowStats>({
    saldoCuenta: 0,
    flujoMes: 0,
    deudaJunioOctubre: 0,
    totalEntradas: 0,
    totalSalidas: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const balances = await CashFlowService.getBankBalances();
      const summary = await CashFlowService.getSummary();

      setSaldos(balances);

      // Calcular estadísticas
      const totalBalance = balances.reduce((sum, b) => sum + b.balance, 0);
      setStats({
        saldoCuenta: totalBalance,
        flujoMes: summary?.nextWeekNet || 0,
        deudaJunioOctubre: 0,
        totalEntradas: summary?.nextWeekInflows || 0,
        totalSalidas: summary?.nextWeekOutflows || 0,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    flujo: [],
    stats,
    saldoCorte: stats.saldoCuenta,
    isLoading,
    error,
    updateSaldo: (saldo: number) => {},
    refresh: loadData,
  };
};