// services/receptionScanService.ts

import {
  MOCK_RECEPTIONS,
  MOCK_FOLIO_DETAIL,
  EXTERNAL_PRODUCERS,
  AVAILABLE_VEGETABLES,
  COLD_ROOM_POSITIONS,
  type ReceptionRecord,
  type FolioDetail,
  type ReceptionFilters,
  type ManualCaptureData,
} from '../types';

export const receptionScanService = {
  // Get receptions with filters
  getReceptions: (filters?: ReceptionFilters): ReceptionRecord[] => {
    let data = [...MOCK_RECEPTIONS];

    if (filters?.producer && filters.producer !== 'Todos') {
      data = data.filter(r => r.producer === filters.producer);
    }
    if (filters?.product && filters.product !== 'Todos') {
      data = data.filter(r => r.product === filters.product);
    }
    if (filters?.dateRange === 'week') {
      // Mock: return all data for now
      // In production, this would filter by date
    }

    return data;
  },

  // Get folio detail by code
  getFolioDetail: (folio: string): FolioDetail | null => {
    if (folio === MOCK_FOLIO_DETAIL.folio) {
      return { ...MOCK_FOLIO_DETAIL };
    }
    
    // Generate mock detail for unknown folio
    return {
      folio,
      producer: 'Unknown Producer',
      producerId: 'UNK-001',
      product: 'Unknown Product',
      productId: 'UNK-001',
      invoiceBoxes: 0,
      sectors: 'Not specified',
      crew: 'Not specified',
    };
  },

  // Confirm reception by scan
  confirmReception: (data: {
    folio: string;
    receivedBoxes: number;
    temperature: number;
    coldRoomPosition: string;
    pallets: number;
  }): { success: boolean; message: string; folio: string } => {
    console.log('📦 [ReceptionScan] Confirming reception:', data);
    
    // Mock: always successful
    return {
      success: true,
      message: `Reception ${data.folio} confirmed successfully`,
      folio: data.folio,
    };
  },

  // Confirm manual reception
  confirmManualReception: (data: ManualCaptureData): { 
    success: boolean; 
    message: string; 
    folio: string;
  } => {
    console.log('📦 [ReceptionScan] Confirming manual reception:', data);
    
    const generatedFolio = `${data.producer.substring(0, 3).toUpperCase()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    return {
      success: true,
      message: `Manual reception ${generatedFolio} confirmed successfully`,
      folio: generatedFolio,
    };
  },

  // Get select options
  getOptions: () => ({
    producers: ['Todos', ...new Set(MOCK_RECEPTIONS.map(r => r.producer))],
    products: ['Todos', ...new Set(MOCK_RECEPTIONS.map(r => r.product))],
    externalProducers: EXTERNAL_PRODUCERS,
    vegetables: AVAILABLE_VEGETABLES,
    coldRoomPositions: COLD_ROOM_POSITIONS,
  }),

  // Get statistics
  getStats: (receptions: ReceptionRecord[]) => {
    const total = receptions.length;
    const completed = receptions.filter(r => r.status === 'completed').length;
    const discrepancies = receptions.filter(r => r.status === 'discrepancy').length;
    const totalBoxes = receptions.reduce((sum, r) => sum + r.receivedBoxes, 0);
    const totalDiscrepancy = receptions.reduce((sum, r) => sum + r.delta, 0);

    return {
      total,
      completed,
      discrepancies,
      totalBoxes,
      totalDiscrepancy,
      avgTemperature: receptions.reduce((sum, r) => sum + (r.temperature || 0), 0) / (total || 1),
    };
  },
};