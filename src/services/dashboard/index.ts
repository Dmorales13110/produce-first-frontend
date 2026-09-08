// src/services/dashboard/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS - Adaptados a la respuesta real del backend
// ============================================================

export interface CFOMetrics {
  // Generales
  totalCustomers: number;
  activeCustomers: number;
  totalGrowers: number;
  activeGrowers: number;
  totalProjections: number;
  activeProjections: number;
  totalHarvests: number;
  totalBoxesHarvested: number;
  averageQuality: number;

  // Financieras (desde /finances/stats)
  totalAdvances: number;
  pendingAdvances: number;
  paidAdvances: number;
  totalAdvancesAmount: number;
  pendingAdvancesAmount: number;
  paidAdvancesAmount: number;
  totalExpenses: number;
  pendingExpenses: number;
  paidExpenses: number;
  totalExpensesAmount: number;
  pendingExpensesAmount: number;
  paidExpensesAmount: number;
  netBalance: number;

  // YTD
  boxesYtd: number;
  revenueYtd: number;
  collectionPending: number;
}

export interface FinanceStatsResponse {
  totalAdvances: number;
  pendingAdvances: number;
  approvedAdvances: number;
  paidAdvances: number;
  totalAdvancesAmount: number;
  pendingAdvancesAmount: number;
  approvedAdvancesAmount: number;
  paidAdvancesAmount: number;
  totalExpenses: number;
  pendingExpenses: number;
  approvedExpenses: number;
  paidExpenses: number;
  totalExpensesAmount: number;
  pendingExpensesAmount: number;
  approvedExpensesAmount: number;
  paidExpensesAmount: number;
  netBalance: number;
  advancesByGrower: {
    grower_id: string;
    grower_name: string;
    totalAmount: number;
    pendingAmount: number;
    paidAmount: number;
    count: number;
  }[];
  expensesByType: {
    type: string;
    amount: number;
    count: number;
    percentage: number;
  }[];
  monthlyEvolution: {
    month: string;
    advances: number;
    expenses: number;
    net: number;
  }[];
}

export interface CashFlowItem {
  id: string;
  date: string;
  concept: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  reference?: string;
  reference_type?: 'advance' | 'expense' | 'invoice' | 'sale';
}

export interface CashFlowSummary {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  pendingIncome: number;
  pendingExpenses: number;
  overdueInvoices: number;
  currentBalance: number;
}

export interface PendingInvoice {
  id: string;
  code: string;
  client_name: string;
  client_id: string;
  amount: number;
  due_date: string;
  days_overdue: number;
  status: 'pending' | 'overdue' | 'paid';
  reference_type: string;
  reference_id: string;
}

export interface Receivable {
  id: string;
  client_name: string;
  client_id: string;
  total_invoices: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  last_invoice_date: string;
  days_average: number;
}

export interface Payable {
  id: string;
  supplier_name: string;
  supplier_id?: string;
  total_invoices: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  last_invoice_date: string;
  days_average: number;
}

export interface TopClient {
  id: string;
  name: string;
  code: string;
  volume: number;
  revenue: number;
  margin: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sku: string;
  boxes: number;
  revenue: number;
  margin: number;
}

export interface WeeklyShipment {
  id: string;
  code: string;
  clientName: string;
  productName: string;
  boxes: number;
  scheduledDate: string;
  status: 'planned' | 'in_transit' | 'delivered' | 'cancelled';
}

export interface DashboardAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  module: string;
  timestamp: string;
  action?: {
    label: string;
    url: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface YtdMetrics {
  boxesYtd: number;
  revenueYtd: number;
  collectionPending: number;
  totalHarvests: number;
  averageQuality: number;
}

// ============================================================
// SERVICIO
// ============================================================

export const DashboardService = {
  /**
   * Obtener métricas CFO combinando datos de múltiples fuentes
   * - Generales: harvest_receptions, customers, growers, demand_projections
   * - Financieras: /finances/stats
   */
  getCFOMetrics: async (): Promise<CFOMetrics> => {
    try {
      // ✅ Obtener métricas financieras del módulo de finanzas
      const statsResponse = await api.get<ApiResponse<FinanceStatsResponse>>('/finances/stats');
      const stats = statsResponse.data;

      // ✅ Obtener métricas generales (puedes mantener las consultas directas o usar otros endpoints)
      // Por ahora usamos datos de ejemplo, pero deberías obtenerlos de tus tablas
      
      return {
        // Generales (deberías obtenerlos de tus tablas)
        totalCustomers: 0,
        activeCustomers: 0,
        totalGrowers: 0,
        activeGrowers: 0,
        totalProjections: 0,
        activeProjections: 0,
        totalHarvests: 0,
        totalBoxesHarvested: 0,
        averageQuality: 0,

        // Financieras (desde /finances/stats)
        totalAdvances: stats.totalAdvances,
        pendingAdvances: stats.pendingAdvances,
        paidAdvances: stats.paidAdvances,
        totalAdvancesAmount: stats.totalAdvancesAmount,
        pendingAdvancesAmount: stats.pendingAdvancesAmount,
        paidAdvancesAmount: stats.paidAdvancesAmount,
        totalExpenses: stats.totalExpenses,
        pendingExpenses: stats.pendingExpenses,
        paidExpenses: stats.paidExpenses,
        totalExpensesAmount: stats.totalExpensesAmount,
        pendingExpensesAmount: stats.pendingExpensesAmount,
        paidExpensesAmount: stats.paidExpensesAmount,
        netBalance: stats.netBalance,

        // YTD (deberías calcularlo)
        boxesYtd: 0,
        revenueYtd: 0,
        collectionPending: stats.pendingAdvancesAmount,
      };
    } catch (error) {
      console.error('❌ [DashboardService] getCFOMetrics error:', error);
      throw error;
    }
  },

  /**
   * Obtener métricas YTD
   */
  getYtdMetrics: async (): Promise<YtdMetrics> => {
    try {
      const statsResponse = await api.get<ApiResponse<FinanceStatsResponse>>('/finances/stats');
      const stats = statsResponse.data;

      return {
        boxesYtd: 0,
        revenueYtd: 0,
        collectionPending: stats.pendingAdvancesAmount,
        totalHarvests: 0,
        averageQuality: 0,
      };
    } catch (error) {
      console.error('❌ [DashboardService] getYtdMetrics error:', error);
      throw error;
    }
  },

  /**
   * Obtener flujo de caja
   * GET /finances/cash-flow
   */
  getCashFlow: async (): Promise<{ items: CashFlowItem[]; summary: CashFlowSummary }> => {
    try {
      const response = await api.get<ApiResponse<{ items: CashFlowItem[]; summary: CashFlowSummary }>>('/finances/cash-flow');
      return response.data;
    } catch (error) {
      console.error('❌ [DashboardService] getCashFlow error:', error);
      throw error;
    }
  },

  /**
   * Obtener facturas pendientes
   * GET /finances/invoices/pending
   */
  getPendingInvoices: async (): Promise<PendingInvoice[]> => {
    try {
      const response = await api.get<ApiResponse<PendingInvoice[]>>('/finances/invoices/pending');
      return response.data;
    } catch (error) {
      console.error('❌ [DashboardService] getPendingInvoices error:', error);
      throw error;
    }
  },

  /**
   * Obtener cuentas por cobrar
   * GET /finances/receivables
   */
  getReceivables: async (): Promise<Receivable[]> => {
    try {
      const response = await api.get<ApiResponse<Receivable[]>>('/finances/receivables');
      return response.data;
    } catch (error) {
      console.error('❌ [DashboardService] getReceivables error:', error);
      throw error;
    }
  },

  /**
   * Obtener cuentas por pagar
   * GET /finances/payables
   */
  getPayables: async (): Promise<Payable[]> => {
    try {
      const response = await api.get<ApiResponse<Payable[]>>('/finances/payables');
      return response.data;
    } catch (error) {
      console.error('❌ [DashboardService] getPayables error:', error);
      throw error;
    }
  },

  /**
   * Obtener top clientes
   * GET /dashboard/top-clients
   */
  getTopClients: async (limit: number = 10): Promise<TopClient[]> => {
    try {
      const response = await api.get<ApiResponse<TopClient[]>>(`/dashboard/top-clients?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('❌ [DashboardService] getTopClients error:', error);
      throw error;
    }
  },

  /**
   * Obtener top productos
   * GET /dashboard/top-products
   */
  getTopProducts: async (limit: number = 10): Promise<TopProduct[]> => {
    try {
      const response = await api.get<ApiResponse<TopProduct[]>>(`/dashboard/top-products?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('❌ [DashboardService] getTopProducts error:', error);
      throw error;
    }
  },

  /**
   * Obtener embarques de la semana
   * GET /dashboard/weekly-shipments
   */
  getWeeklyShipments: async (): Promise<WeeklyShipment[]> => {
    try {
      const response = await api.get<ApiResponse<WeeklyShipment[]>>('/dashboard/weekly-shipments');
      return response.data;
    } catch (error) {
      console.error('❌ [DashboardService] getWeeklyShipments error:', error);
      throw error;
    }
  },

  /**
   * Obtener alertas del sistema
   * GET /dashboard/alerts
   */
  getAlerts: async (): Promise<DashboardAlert[]> => {
    try {
      const response = await api.get<ApiResponse<DashboardAlert[]>>('/dashboard/alerts');
      return response.data;
    } catch (error) {
      console.error('❌ [DashboardService] getAlerts error:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los datos del dashboard
   */
  getDashboardData: async () => {
    try {
      const [metrics, clients, products, shipments, alerts, cashFlow, pendingInvoices, receivables, payables] = await Promise.all([
        DashboardService.getCFOMetrics(),
        DashboardService.getTopClients(5),
        DashboardService.getTopProducts(5),
        DashboardService.getWeeklyShipments(),
        DashboardService.getAlerts(),
        DashboardService.getCashFlow(),
        DashboardService.getPendingInvoices(),
        DashboardService.getReceivables(),
        DashboardService.getPayables(),
      ]);

      return {
        metrics,
        clients,
        products,
        shipments,
        alerts,
        cashFlow,
        pendingInvoices,
        receivables,
        payables,
      };
    } catch (error) {
      console.error('❌ [DashboardService] getDashboardData error:', error);
      throw error;
    }
  },
};