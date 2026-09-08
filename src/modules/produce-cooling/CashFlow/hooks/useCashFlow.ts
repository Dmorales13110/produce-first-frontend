// CashFlow/hooks/useCashFlow.ts

import { useState, useCallback, useEffect } from 'react';
import { CashFlowService } from '../../../../services/cash-flow';
import { cashFlowService } from '../services/cashFlowService';
import type { CashFlowRecord, CashFlowStats } from '../../types';

export const useCashFlow = () => {
  const [flujo, setFlujo] = useState<CashFlowRecord[]>([]);
  const [stats, setStats] = useState<CashFlowStats>({
    saldoCuenta: 824600,
    tcMxnUsd: 17.50,
    entradaSemanal: 823000,
    salidaSemanal: 606000,
    rentaMensual: 396667,
    alerta15: 'renta $396,667',
  });
  const [saldoCorte, setSaldoCorte] = useState<number>(824600);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [balances, summary, projection, rateData] = await Promise.allSettled([
        CashFlowService.getBankBalances(),
        CashFlowService.getSummary(),
        CashFlowService.getProjection(),
        CashFlowService.getExchangeRate(),
      ]);

      let calculatedSaldo = 824600;
      if (balances.status === 'fulfilled' && balances.value.length > 0) {
        calculatedSaldo = balances.value.reduce((sum, b) => sum + (b.balance || 0), 0);
      }

      let currentTc = 17.50;
      if (rateData.status === 'fulfilled' && rateData.value?.rate) {
        currentTc = rateData.value.rate;
      }

      let entradas = 823000;
      let salidas = 606000;
      if (summary.status === 'fulfilled' && summary.value) {
        if (summary.value.nextWeekInflows) entradas = summary.value.nextWeekInflows;
        if (summary.value.nextWeekOutflows) salidas = summary.value.nextWeekOutflows;
      }

      setStats({
        saldoCuenta: calculatedSaldo,
        tcMxnUsd: currentTc,
        entradaSemanal: entradas,
        salidaSemanal: salidas,
        rentaMensual: 396667,
        alerta15: 'renta $396,667',
      });
      setSaldoCorte(calculatedSaldo);

      if (projection.status === 'fulfilled' && projection.value.length > 0) {
        const mappedFlujo: CashFlowRecord[] = projection.value.map(p => ({
          semana: p.period,
          entradas: p.inflows,
          salidas: p.outflows,
          neto: p.net,
          nota: p.note || '',
        }));
        setFlujo(mappedFlujo);
      } else {
        // Fallback datos base
        setFlujo(cashFlowService.getCashFlow().flujo);
      }

    } catch (err) {
      console.warn('⚠️ [useCashFlow] Error conectando con backend cash-flow, usando datos base:', err);
      const defaultData = cashFlowService.getCashFlow();
      setFlujo(defaultData.flujo);
      setStats(defaultData.stats);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSaldo = useCallback(async (newSaldo: number) => {
    setSaldoCorte(newSaldo);
    setStats(prev => ({ ...prev, saldoCuenta: newSaldo }));
    try {
      await CashFlowService.saveBankBalance({
        bank_name: 'Cuenta Principal Produce Cooling',
        account_number: 'PC-BANK-01',
        balance: newSaldo,
        currency: 'MXN',
      });
    } catch (e) {
      console.warn('⚠️ [useCashFlow] Error guardando saldo en backend:', e);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    flujo,
    stats,
    saldoCorte,
    isLoading,
    error,
    updateSaldo,
    refresh: loadData,
  };
};