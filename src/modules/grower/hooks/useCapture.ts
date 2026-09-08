// src/modules/grower/hooks/useCapture.ts
import { useState, useEffect, useCallback } from 'react';
import { CaptureService, type Grower, type Lot, type Product, type HarvestReceptionResponse } from '../../../services/capture';

interface UseCaptureReturn {
  // Datos
  growers: Grower[];
  lots: Lot[];
  products: Product[];
  harvests: HarvestReceptionResponse[];
  isLoading: boolean;
  error: string | null;

  // Acciones
  refreshGrowers: () => Promise<void>;
  refreshLots: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshHarvests: (params?: any) => Promise<void>;

  // Submits
  submitHarvest: (data: any) => Promise<any>;
  submitExpense: (data: any) => Promise<any>;
  inspectQuality: (data: any) => Promise<any>;
  getPendingRejections: (growerId: string) => Promise<any>;
  resolveRejection: (rejectionId: string) => Promise<void>;
  updateHarvestStatus: (id: string, status: string, advance?: number) => Promise<any>;

  // Getters
  getLotsByGrower: (growerId: string) => Lot[];
  getHarvestsByLot: (lotId: string) => HarvestReceptionResponse[];
}

export const useCapture = (): UseCaptureReturn => {
  const [growers, setGrowers] = useState<Grower[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [harvests, setHarvests] = useState<HarvestReceptionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // REFRESH FUNCTIONS
  // ============================================================

  const refreshGrowers = useCallback(async () => {
    try {
      const data = await CaptureService.getGrowers();
      setGrowers(data);
    } catch (err) {
      console.error('❌ [useCapture] refreshGrowers error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar productores');
    }
  }, []);

  const refreshLots = useCallback(async () => {
    try {
      const data = await CaptureService.getLots();
      setLots(data);
    } catch (err) {
      console.error('❌ [useCapture] refreshLots error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar lotes');
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      const data = await CaptureService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('❌ [useCapture] refreshProducts error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    }
  }, []);

  const refreshHarvests = useCallback(async (params?: any) => {
    try {
      const data = await CaptureService.getHarvestReceptions(params);
      setHarvests(data);
    } catch (err) {
      console.error('❌ [useCapture] refreshHarvests error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar recepciones');
    }
  }, []);

  // ============================================================
  // SUBMIT FUNCTIONS
  // ============================================================

  const submitHarvest = useCallback(async (data: any) => {
    try {
      setIsLoading(true);
      const result = await CaptureService.createHarvestReception(data);
      await refreshHarvests();
      return result;
    } catch (err) {
      console.error('❌ [useCapture] submitHarvest error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshHarvests]);

  const submitExpense = useCallback(async (data: any) => {
    try {
      setIsLoading(true);
      const result = await CaptureService.createExpense(data);
      return result;
    } catch (err) {
      console.error('❌ [useCapture] submitExpense error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const inspectQuality = useCallback(async (data: any) => {
    try {
      setIsLoading(true);
      const result = await CaptureService.inspectQuality(data);
      await refreshHarvests();
      return result;
    } catch (err) {
      console.error('❌ [useCapture] inspectQuality error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshHarvests]);

  const getPendingRejections = useCallback(async (growerId: string) => {
    try {
      return await CaptureService.getPendingRejections(growerId);
    } catch (err) {
      console.error('❌ [useCapture] getPendingRejections error:', err);
      throw err;
    }
  }, []);

  const resolveRejection = useCallback(async (rejectionId: string) => {
    try {
      await CaptureService.resolveRejection(rejectionId);
    } catch (err) {
      console.error('❌ [useCapture] resolveRejection error:', err);
      throw err;
    }
  }, []);

  const updateHarvestStatus = useCallback(async (id: string, status: string, advance?: number) => {
    try {
      const result = await CaptureService.updateHarvestReceptionStatus(id, status, advance);
      await refreshHarvests();
      return result;
    } catch (err) {
      console.error('❌ [useCapture] updateHarvestStatus error:', err);
      throw err;
    }
  }, [refreshHarvests]);

  // ============================================================
  // GETTERS
  // ============================================================

  const getLotsByGrower = useCallback((growerId: string) => {
    return lots.filter(lot => lot.grower_id === growerId);
  }, [lots]);

  const getHarvestsByLot = useCallback((lotId: string) => {
    return harvests.filter(h => h.lot_id === lotId);
  }, [harvests]);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          refreshGrowers(),
          refreshLots(),
          refreshProducts(),
          refreshHarvests(),
        ]);
      } catch (err) {
        console.error('❌ [useCapture] Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [refreshGrowers, refreshLots, refreshProducts, refreshHarvests]);

  return {
    // Datos
    growers,
    lots,
    products,
    harvests,
    isLoading,
    error,

    // Acciones
    refreshGrowers,
    refreshLots,
    refreshProducts,
    refreshHarvests,

    // Submits
    submitHarvest,
    submitExpense,
    inspectQuality,
    getPendingRejections,
    resolveRejection,
    updateHarvestStatus,

    // Getters
    getLotsByGrower,
    getHarvestsByLot,
  };
};