// src/modules/dashboard/hooks/useDashboardData.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardService } from '../../../../../services/dashboard';
import type { 
  CFOMetrics, 
  TopClient, 
  TopProduct, 
  WeeklyShipment, 
  DashboardAlert, 
  YtdMetrics,
  CashFlowItem,
  CashFlowSummary,
  PendingInvoice,
  Receivable,
  Payable
} from '../../../../../services/dashboard';

interface DashboardData {
  metrics: CFOMetrics | null;
  clients: TopClient[];
  products: TopProduct[];
  shipments: WeeklyShipment[];
  alerts: DashboardAlert[];
  ytd: YtdMetrics | null;
  cashFlow: { items: CashFlowItem[]; summary: CashFlowSummary } | null;
  pendingInvoices: PendingInvoice[];
  receivables: Receivable[];
  payables: Payable[];
}

interface UseDashboardDataReturn {
  data: DashboardData;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData>({
    metrics: null,
    clients: [],
    products: [],
    shipments: [],
    alerts: [],
    ytd: null,
    cashFlow: null,
    pendingInvoices: [],
    receivables: [],
    payables: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const isFetching = useRef(false);

  const fetchDashboardData = useCallback(async () => {
    if (isFetching.current) return;
    
    isFetching.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        DashboardService.getCFOMetrics(),
        DashboardService.getTopClients(5),
        DashboardService.getTopProducts(5),
        DashboardService.getWeeklyShipments(),
        DashboardService.getAlerts(),
        DashboardService.getYtdMetrics(),
        DashboardService.getCashFlow(),
        DashboardService.getPendingInvoices(),
        DashboardService.getReceivables(),
        DashboardService.getPayables(),
      ]);

      const [
        metricsResult,
        clientsResult,
        productsResult,
        shipmentsResult,
        alertsResult,
        ytdResult,
        cashFlowResult,
        pendingInvoicesResult,
        receivablesResult,
        payablesResult,
      ] = results;

      const newData: DashboardData = {
        metrics: metricsResult.status === 'fulfilled' ? metricsResult.value : null,
        clients: clientsResult.status === 'fulfilled' ? clientsResult.value : [],
        products: productsResult.status === 'fulfilled' ? productsResult.value : [],
        shipments: shipmentsResult.status === 'fulfilled' ? shipmentsResult.value : [],
        alerts: alertsResult.status === 'fulfilled' ? alertsResult.value : [],
        ytd: ytdResult.status === 'fulfilled' ? ytdResult.value : null,
        cashFlow: cashFlowResult.status === 'fulfilled' ? cashFlowResult.value : null,
        pendingInvoices: pendingInvoicesResult.status === 'fulfilled' ? pendingInvoicesResult.value : [],
        receivables: receivablesResult.status === 'fulfilled' ? receivablesResult.value : [],
        payables: payablesResult.status === 'fulfilled' ? payablesResult.value : [],
      };

      // Log de errores individuales
      if (metricsResult.status === 'rejected') console.error('❌ getCFOMetrics:', metricsResult.reason);
      if (clientsResult.status === 'rejected') console.error('❌ getTopClients:', clientsResult.reason);
      if (productsResult.status === 'rejected') console.error('❌ getTopProducts:', productsResult.reason);
      if (shipmentsResult.status === 'rejected') console.error('❌ getWeeklyShipments:', shipmentsResult.reason);
      if (alertsResult.status === 'rejected') console.error('❌ getAlerts:', alertsResult.reason);
      if (ytdResult.status === 'rejected') console.error('❌ getYtdMetrics:', ytdResult.reason);
      if (cashFlowResult.status === 'rejected') console.error('❌ getCashFlow:', cashFlowResult.reason);
      if (pendingInvoicesResult.status === 'rejected') console.error('❌ getPendingInvoices:', pendingInvoicesResult.reason);
      if (receivablesResult.status === 'rejected') console.error('❌ getReceivables:', receivablesResult.reason);
      if (payablesResult.status === 'rejected') console.error('❌ getPayables:', payablesResult.reason);

      if (isMounted.current) {
        setData(newData);
      }

    } catch (err) {
      if (isMounted.current) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos del dashboard';
        setError(errorMessage);
        console.error('❌ [useDashboardData] Error general:', err);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchDashboardData();

    return () => {
      isMounted.current = false;
    };
  }, [fetchDashboardData]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchDashboardData,
  };
};