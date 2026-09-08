// components/ReceptionScan/hooks/useReceptionScan.ts

import { useState, useCallback, useEffect } from 'react';

// ============================================================
// TIPOS
// ============================================================

interface HarvestReception {
  id: string;
  code: string;
  lot_id: string;
  lot_name: string;
  grower_id: string;
  grower_name: string;
  reception_date: string;
  good_boxes: number;
  rejected_boxes: number;
  total_boxes: number;
  quality_percentage: number;
  weight_kg: number;
  status: 'pending' | 'received' | 'quality_checked' | 'advance_paid' | 'completed';
  received_by: string;
  quality_inspector: string | null;
  quality_notes: string | null;
  observations: string | null;
  created_at: string;
  updated_at: string;
}

interface ReceptionFilters {
  lot_id?: string;
  grower_id?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

// ============================================================
// DATOS MOCK
// ============================================================

const MOCK_RECEPTIONS: HarvestReception[] = [
  {
    id: '1',
    code: 'REC-001',
    lot_id: 'lot-1',
    lot_name: 'Lote San Aparicio 1',
    grower_id: 'grower-1',
    grower_name: 'Daily Veggies',
    reception_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    good_boxes: 450,
    rejected_boxes: 12,
    total_boxes: 462,
    quality_percentage: 97.4,
    weight_kg: 4620,
    status: 'completed',
    received_by: 'Juan Pérez',
    quality_inspector: 'Carlos López',
    quality_notes: 'Calidad aprobada - 98%',
    observations: 'Recepción completa',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    code: 'REC-002',
    lot_id: 'lot-2',
    lot_name: 'Lote La Escondida 2',
    grower_id: 'grower-2',
    grower_name: 'Agrícola JAV',
    reception_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    good_boxes: 280,
    rejected_boxes: 8,
    total_boxes: 288,
    quality_percentage: 97.2,
    weight_kg: 2880,
    status: 'quality_checked',
    received_by: 'María García',
    quality_inspector: 'Luis Martínez',
    quality_notes: 'Calidad en revisión - 95%',
    observations: 'Pendiente de liberación',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    code: 'REC-003',
    lot_id: 'lot-3',
    lot_name: 'Lote Fernando 3',
    grower_id: 'grower-3',
    grower_name: 'Fernando García',
    reception_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    good_boxes: 315,
    rejected_boxes: 5,
    total_boxes: 320,
    quality_percentage: 98.4,
    weight_kg: 3200,
    status: 'pending',
    received_by: 'Pedro Ramírez',
    quality_inspector: null,
    quality_notes: null,
    observations: 'Pendiente de inspección',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// HOOK
// ============================================================

export const useReceptionScan = (initialFilters?: ReceptionFilters) => {
  const [receptions, setReceptions] = useState<HarvestReception[]>(MOCK_RECEPTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReceptionFilters>(initialFilters || {});

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtrar datos mock
      let filtered = [...MOCK_RECEPTIONS];
      
      if (filters.status) {
        filtered = filtered.filter(r => r.status === filters.status);
      }
      if (filters.grower_id) {
        filtered = filtered.filter(r => r.grower_id === filters.grower_id);
      }
      if (filters.lot_id) {
        filtered = filtered.filter(r => r.lot_id === filters.lot_id);
      }
      
      setReceptions(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading receptions');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const scanFolio = useCallback(async (folio: string): Promise<HarvestReception | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const found = MOCK_RECEPTIONS.find(r => r.code === folio) || null;
      return found;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error scanning folio');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmReception = useCallback(async (data: any): Promise<HarvestReception> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const nueva: HarvestReception = {
        id: `rec-${Date.now()}`,
        code: `REC-${String(MOCK_RECEPTIONS.length + 1).padStart(3, '0')}`,
        lot_id: data.lot_id || 'lot-1',
        lot_name: 'Lote Nuevo',
        grower_id: data.grower_id || 'grower-1',
        grower_name: 'Productor Nuevo',
        reception_date: data.reception_date || new Date().toISOString(),
        good_boxes: data.good_boxes || 0,
        rejected_boxes: data.rejected_boxes || 0,
        total_boxes: (data.good_boxes || 0) + (data.rejected_boxes || 0),
        quality_percentage: 0,
        weight_kg: data.weight_kg || 0,
        status: 'pending',
        received_by: data.received_by || 'Usuario',
        quality_inspector: null,
        quality_notes: null,
        observations: data.observations || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setReceptions(prev => [nueva, ...prev]);
      return nueva;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error confirming reception';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmManualReception = useCallback(async (data: any): Promise<HarvestReception> => {
    return confirmReception(data);
  }, [confirmReception]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = {
    total: receptions.length,
    completed: receptions.filter(r => r.status === 'completed').length,
    discrepancies: receptions.filter(r => r.status === 'quality_checked').length,
    totalBoxes: receptions.reduce((sum, r) => sum + r.good_boxes, 0),
    avgTemperature: 0,
  };

  return {
    receptions,
    isLoading,
    error,
    filters,
    setFilters,
    scanFolio,
    confirmReception,
    confirmManualReception,
    refresh: loadData,
    stats,
  };
};