import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface BankBalance {
  id: string;
  bank_name: string;
  account_number: string;
  balance: number;
  currency: 'MXN' | 'USD';
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface CashFlowProjection {
  period: string;
  inflows: number;
  outflows: number;
  net: number;
  note?: string;
  isWarning?: boolean;
}

export interface WeeklyEvent {
  type: 'in' | 'out';
  description: string;
  amount: number;
  date: string;
}

export interface WeeklyDetail {
  week: string;
  startDate: string;
  endDate: string;
  inflows: number;
  outflows: number;
  net: number;
  cumulative: number;
  events: WeeklyEvent[];
}

export interface LiquidityGap {
  month: string;
  gap: number;
  cumulative: number;
  status: 'positive' | 'negative' | 'warning';
}

export interface UpcomingPayment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  supplier: string;
}

export interface UpcomingReceivable {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  customer: string;
}

export interface WeeklyTrend {
  week: string;
  balance: number;
}

export interface CashFlowSummary {
  totalBalance: number;
  availableBalance: number;
  projectedBalance: number;
  nextWeekInflows: number;
  nextWeekOutflows: number;
  nextWeekNet: number;
  liquidityScore: number;
  upcomingPayments: UpcomingPayment[];
  upcomingReceivables: UpcomingReceivable[];
  weeklyTrend: WeeklyTrend[];
}

export interface SaveBankBalanceInput {
  bank_name: string;
  account_number: string;
  balance: number;
  currency?: 'MXN' | 'USD';
}

export interface SaveExchangeRateInput {
  rate: number;
  date?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const CashFlowService = {
  // ============================================================
  // BANK BALANCES
  // ============================================================

  /**
   * Obtener saldos bancarios
   * GET /cash-flow/bank-balances
   */
  getBankBalances: async (): Promise<BankBalance[]> => {
    try {
      const response = await api.get<{ success: boolean; data: BankBalance[] }>(
        '/cash-flow/bank-balances'
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CashFlowService] getBankBalances error:', error);
      throw error;
    }
  },

  /**
   * Guardar saldo bancario
   * POST /cash-flow/bank-balances
   */
  saveBankBalance: async (data: SaveBankBalanceInput): Promise<BankBalance> => {
    try {
      const response = await api.post<{ success: boolean; data: BankBalance }>(
        '/cash-flow/bank-balances',
        data
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CashFlowService] saveBankBalance error:', error);
      throw error;
    }
  },

  // ============================================================
  // EXCHANGE RATE (usa tipo_cambio_diario)
  // ============================================================

  /**
   * Obtener tipo de cambio actual
   * GET /cash-flow/exchange-rate
   */
  getExchangeRate: async (): Promise<{ rate: number; date: string }> => {
    try {
      const response = await api.get<{ success: boolean; data: { rate: number; date: string } }>(
        '/cash-flow/exchange-rate'
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CashFlowService] getExchangeRate error:', error);
      throw error;
    }
  },

  /**
   * Guardar tipo de cambio
   * POST /cash-flow/exchange-rate
   */
  saveExchangeRate: async (data: SaveExchangeRateInput): Promise<any> => {
    try {
      const response = await api.post<{ success: boolean; data: any }>(
        '/cash-flow/exchange-rate',
        data
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CashFlowService] saveExchangeRate error:', error);
      throw error;
    }
  },

  // ============================================================
  // PROJECTION
  // ============================================================

  /**
   * Obtener proyección de flujo de caja
   * GET /cash-flow/projection
   */
  getProjection: async (period?: string): Promise<CashFlowProjection[]> => {
    try {
      const url = period ? `/cash-flow/projection?period=${period}` : '/cash-flow/projection';
      const response = await api.get<{ success: boolean; data: CashFlowProjection[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [CashFlowService] getProjection error:', error);
      throw error;
    }
  },

  // ============================================================
  // WEEKLY DETAIL
  // ============================================================

  /**
   * Obtener detalle semanal
   * GET /cash-flow/weekly-detail
   */
  getWeeklyDetail: async (weeks: number = 4): Promise<WeeklyDetail[]> => {
    try {
      const response = await api.get<{ success: boolean; data: WeeklyDetail[] }>(
        `/cash-flow/weekly-detail?weeks=${weeks}`
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CashFlowService] getWeeklyDetail error:', error);
      throw error;
    }
  },

  // ============================================================
  // LIQUIDITY GAPS
  // ============================================================

  /**
   * Obtener brechas de liquidez
   * GET /cash-flow/liquidity-gaps
   */
  getLiquidityGaps: async (months: number = 3): Promise<LiquidityGap[]> => {
    try {
      const response = await api.get<{ success: boolean; data: LiquidityGap[] }>(
        `/cash-flow/liquidity-gaps?months=${months}`
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CashFlowService] getLiquidityGaps error:', error);
      throw error;
    }
  },

  // ============================================================
  // SUMMARY
  // ============================================================

  /**
   * Obtener resumen de flujo de caja
   * GET /cash-flow/summary
   */
  getSummary: async (): Promise<CashFlowSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: CashFlowSummary }>(
        '/cash-flow/summary'
      );
      return response.data;
    } catch (error) {
      console.error('❌ [CashFlowService] getSummary error:', error);
      throw error;
    }
  },
};