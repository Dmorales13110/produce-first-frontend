// services/receptionScanService.ts

import { api } from '../../../services/apiClient';
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
  // Get receptions with filters connected to backend
  getReceptions: async (filters?: ReceptionFilters): Promise<ReceptionRecord[]> => {
    try {
      const response = await api.get<{ success: boolean; data: any[] }>('/harvest-receptions');
      const rawData = response?.data || response;

      if (Array.isArray(rawData) && rawData.length > 0) {
        const mapped: ReceptionRecord[] = rawData.map((item: any) => {
          const good = item.good_boxes || 0;
          const total = item.total_boxes || good + (item.rejected_boxes || 0);
          const delta = item.rejected_boxes || 0;
          return {
            id: String(item.id),
            time: item.created_at
              ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '12:00',
            folio: item.code || `REC-${String(item.id).substring(0, 6)}`,
            producer: item.grower?.commercial_name || item.grower?.name || item.grower_name || 'Productor General',
            product: item.lot?.name || item.lot_name || 'Hortaliza',
            invoiceBoxes: total,
            receivedBoxes: good,
            delta: delta,
            coldRoomPosition: item.observations?.match(/Fila [A-Z]-[0-9]/)?.[0] || 'Fila A-1',
            temperature: 12.0,
            pallets: Math.ceil(good / 40) || 1,
            status: item.status === 'completed' ? 'completed' : delta > 0 ? 'discrepancy' : 'pending',
          };
        });

        let data = mapped;
        if (filters?.producer && filters.producer !== 'Todos') {
          data = data.filter(r => r.producer === filters.producer);
        }
        if (filters?.product && filters.product !== 'Todos') {
          data = data.filter(r => r.product === filters.product);
        }
        return data;
      }
    } catch (err) {
      console.warn('⚠️ [receptionScanService] No se pudo conectar a backend /harvest-receptions, usando datos base:', err);
    }

    // Fallback con datos base si backend no tiene registros o falla
    let data = [...MOCK_RECEPTIONS];
    if (filters?.producer && filters.producer !== 'Todos') {
      data = data.filter(r => r.producer === filters.producer);
    }
    if (filters?.product && filters.product !== 'Todos') {
      data = data.filter(r => r.product === filters.product);
    }
    return data;
  },

  // Get folio detail by code
  getFolioDetail: async (folio: string): Promise<FolioDetail | null> => {
    try {
      const response = await api.get<{ success: boolean; data: any[] }>(`/harvest-receptions?code=${encodeURIComponent(folio)}`);
      const rawData = response?.data || response;
      if (Array.isArray(rawData) && rawData.length > 0) {
        const item = rawData[0];
        return {
          folio: item.code || folio,
          producer: item.grower?.commercial_name || item.grower?.name || 'Productor General',
          producerId: item.grower_id || 'UNK-001',
          product: item.lot?.name || item.lot_name || 'Vegetal',
          productId: item.lot_id || 'UNK-001',
          invoiceBoxes: item.total_boxes || item.good_boxes || 0,
          sectors: item.lot?.name || 'Sector 1',
          crew: item.received_by || 'Cuadrilla A',
          temperature: 12.0,
          coldRoomPosition: 'Fila A-1',
          pallets: Math.ceil((item.good_boxes || 1) / 40),
          receivedBoxes: item.good_boxes || 0,
        };
      }
    } catch (err) {
      console.warn('⚠️ [receptionScanService] Error buscando folio en backend:', err);
    }

    if (folio === MOCK_FOLIO_DETAIL.folio) {
      return { ...MOCK_FOLIO_DETAIL };
    }
    
    // Generate mock detail for unknown folio
    return {
      folio,
      producer: 'Daily Veggies',
      producerId: 'DV-001',
      product: 'Shanghai Bok Choy',
      productId: 'PROD-001',
      invoiceBoxes: 500,
      sectors: 'Sector Norte',
      crew: 'Cuadrilla 1',
    };
  },

  // Confirm reception by scan
  confirmReception: async (data: {
    folio: string;
    receivedBoxes: number;
    temperature: number;
    coldRoomPosition: string;
    pallets: number;
  }): Promise<{ success: boolean; message: string; folio: string }> => {
    console.log('📦 [ReceptionScan] Confirming reception:', data);
    try {
      await api.post('/harvest-receptions', {
        observations: `Posición: ${data.coldRoomPosition}, Temp: ${data.temperature}°C, Pallets: ${data.pallets}, Folio: ${data.folio}`,
        good_boxes: data.receivedBoxes,
        weight_kg: data.receivedBoxes * 10,
        received_by: 'Operador Cooling',
      });
    } catch (err) {
      console.warn('⚠️ [receptionScanService] Backend reception post failed, local fallback:', err);
    }
    
    return {
      success: true,
      message: `Recepción ${data.folio} confirmada exitosamente`,
      folio: data.folio,
    };
  },

  // Confirm manual reception
  confirmManualReception: async (data: ManualCaptureData): Promise<{ 
    success: boolean; 
    message: string; 
    folio: string;
  }> => {
    console.log('📦 [ReceptionScan] Confirming manual reception:', data);
    const totalBoxes = data.pallets * data.boxesPerPallet;
    const generatedFolio = `${data.producer.substring(0, 3).toUpperCase()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    try {
      await api.post('/harvest-receptions', {
        observations: `Captura manual: ${data.producer} - ${data.vegetable}. Posición: ${data.coldRoomPosition}, Temp: ${data.temperature}°C`,
        good_boxes: totalBoxes,
        weight_kg: totalBoxes * 10,
        received_by: 'Operador Cooling (Manual)',
      });
    } catch (err) {
      console.warn('⚠️ [receptionScanService] Backend manual post failed, local fallback:', err);
    }
    
    return {
      success: true,
      message: `Recepción manual ${generatedFolio} confirmada exitosamente`,
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