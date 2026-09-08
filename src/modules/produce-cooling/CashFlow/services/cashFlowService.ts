// services/cashFlowService.ts

import type {
  CashFlowRecord,
  CashFlowStats,
} from '../../types';

// Mock data - Flujo semanal
const MOCK_FLUJO: CashFlowRecord[] = [
  { semana: 'S49 (día 15)', entradas: 824000, salidas: 1003000, neto: -179000, nota: 'semana de renta' },
  { semana: 'S50', entradas: 824000, salidas: 606000, neto: 218000, nota: '' },
  { semana: 'S51', entradas: 824000, salidas: 606000, neto: 218000, nota: '' },
  { semana: 'S52 (día 15)', entradas: 824000, salidas: 1003000, neto: -179000, nota: 'renta + hielo pico CNY' },
];

// Mock data - Stats
const MOCK_STATS: CashFlowStats = {
  saldoCuenta: 824600,
  tcMxnUsd: 17.50,
  entradaSemanal: 823000,
  salidaSemanal: 606000,
  rentaMensual: 396667,
  alerta15: 'renta $396,667',
};

export const cashFlowService = {
  // Get cash flow data
  getCashFlow: (): { flujo: CashFlowRecord[]; stats: CashFlowStats } => {
    return {
      flujo: [...MOCK_FLUJO],
      stats: { ...MOCK_STATS },
    };
  },

  // Update balance
  updateSaldo: (saldo: number): CashFlowStats => {
    MOCK_STATS.saldoCuenta = saldo;
    return { ...MOCK_STATS };
  },

  // Get stats
  getStats: (): CashFlowStats => {
    return { ...MOCK_STATS };
  },

  // Get chart data for visualization
  getChartData: () => {
    const semanas = ['S48', 'S49', 'S50', 'S51', 'S52', 'S1'];
    const entradas = MOCK_FLUJO.map(f => f.entradas / 1000);
    const salidas = MOCK_FLUJO.map(f => f.salidas / 1000);
    
    return { semanas, entradas, salidas };
  },
};