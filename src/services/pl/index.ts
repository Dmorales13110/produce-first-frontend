// src/services/pl/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface PLSummary {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  margin: number;
  totalHarvests: number;
  costsByCategory: Record<string, number>;
  revenueByGrower: {
    growerId: string;
    growerName: string;
    revenue: number;
    boxes: number;
  }[];
  monthlyEvolution: {
    month: string;
    revenue: number;
    costs: number;
    profit: number;
  }[];
}

export interface FinanceStats {
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

// ============================================================
// SERVICIO
// ============================================================

export const PLService = {
  /**
   * Obtener resumen de P&L
   * GET /pl/summary
   */
  getSummary: async (params?: { growerId?: string; fromDate?: string; toDate?: string }): Promise<PLSummary> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.growerId) queryParams.append('growerId', params.growerId);
      if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params?.toDate) queryParams.append('toDate', params.toDate);

      const url = `/pl/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: PLSummary }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PLService] getSummary error:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas financieras (de finanzas)
   * GET /finances/stats
   */
  getFinanceStats: async (): Promise<FinanceStats> => {
    try {
      const response = await api.get<{ success: boolean; data: FinanceStats }>('/finances/stats');
      return response.data;
    } catch (error) {
      console.error('❌ [PLService] getFinanceStats error:', error);
      throw error;
    }
  },

  /**
   * Obtener flujo de caja
   * GET /finances/cash-flow
   */
  getCashFlow: async (params?: { fromDate?: string; toDate?: string }): Promise<{ items: CashFlowItem[]; summary: CashFlowSummary }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params?.toDate) queryParams.append('toDate', params.toDate);

      const url = `/finances/cash-flow${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: { items: CashFlowItem[]; summary: CashFlowSummary } }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PLService] getCashFlow error:', error);
      throw error;
    }
  },

  /**
   * Obtener gastos (para detalle de costos)
   * GET /finances/expenses
   */
  getExpenses: async (params?: { category?: string; fromDate?: string; toDate?: string }): Promise<any[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params?.toDate) queryParams.append('toDate', params.toDate);

      const url = `/finances/expenses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: any[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [PLService] getExpenses error:', error);
      throw error;
    }
  },
};