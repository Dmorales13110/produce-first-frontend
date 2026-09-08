// src/modules/grower/capture/hooks/useCapture.ts
import { useState, useEffect, useCallback } from 'react';
import { CaptureService } from '../../../../../services/capture';
import type {
  Grower,
  Lot,
  Product,
  HarvestReceptionResponse,
  HarvestReceptionInput,
  ExpenseInput,
  QualityInspectionInput,
  PendingRejection,
  QualitySummary,
} from '../../../../../services/capture';

interface UseCaptureReturn {
  // Datos
  growers: Grower[];
  lots: Lot[];
  products: Product[];
  harvests: HarvestReceptionResponse[];
  isLoading: boolean;
  error: string | null;
  selectedGrower: string | null;
  selectedLot: string | null;

  // Setters
  setSelectedGrower: (id: string | null) => void;
  setSelectedLot: (id: string | null) => void;

  // Refresh
  refreshGrowers: () => Promise<void>;
  refreshLots: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshHarvests: (params?: any) => Promise<void>;

  // Submits
  submitHarvest: (data: HarvestReceptionInput) => Promise<HarvestReceptionResponse>;
  submitExpense: (data: ExpenseInput) => Promise<any>;
  inspectQuality: (data: QualityInspectionInput) => Promise<any>;
  updateHarvestStatus: (id: string, status: string, advance?: number) => Promise<any>;

  // Quality
  getPendingRejections: (growerId: string) => Promise<PendingRejection[]>;
  resolveRejection: (rejectionId: string) => Promise<void>;
  getQualitySummary: (harvestReceptionId: string) => Promise<QualitySummary | null>;

  // Getters filtrados
  getLotsByGrower: (growerId: string) => Lot[];
  getHarvestsByLot: (lotId: string) => HarvestReceptionResponse[];
  getHarvestsByGrower: (growerId: string) => HarvestReceptionResponse[];
  getProductsByCategory: (category: string) => Product[];

  // Estadísticas
  getStats: () => {
    totalHarvests: number;
    totalGoodBoxes: number;
    totalRejectedBoxes: number;
    averageQuality: number;
    totalWeight: number;
  };
}

export const useCapture = (): UseCaptureReturn => {
  const [growers, setGrowers] = useState<Grower[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [harvests, setHarvests] = useState<HarvestReceptionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrower, setSelectedGrower] = useState<string | null>(null);
  const [selectedLot, setSelectedLot] = useState<string | null>(null);

  // ============================================================
  // REFRESH FUNCTIONS
  // ============================================================

  const refreshGrowers = useCallback(async () => {
    try {
      const data = await CaptureService.getGrowers();
      setGrowers(data);
      if (data.length > 0 && !selectedGrower) {
        setSelectedGrower(data[0].id);
      }
    } catch (err) {
      console.error('❌ [useCapture] refreshGrowers error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar productores');
    }
  }, [selectedGrower]);

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
      console.log('📊 [useCapture] Refrescando harvests...');
      const data = await CaptureService.getHarvestReceptions(params);
      console.log('📊 [useCapture] Datos recibidos:', data.length);
      setHarvests(data);
    } catch (err) {
      console.error('❌ [useCapture] refreshHarvests error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar recepciones');
    }
  }, []);

  // ============================================================
  // SUBMIT FUNCTIONS
  // ============================================================

  const submitHarvest = useCallback(async (data: HarvestReceptionInput): Promise<HarvestReceptionResponse> => {
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

  const submitExpense = useCallback(async (data: ExpenseInput): Promise<any> => {
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

  const inspectQuality = useCallback(async (data: QualityInspectionInput): Promise<any> => {
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

  const updateHarvestStatus = useCallback(async (id: string, status: string, advance?: number): Promise<any> => {
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
  // QUALITY FUNCTIONS
  // ============================================================

  const getPendingRejections = useCallback(async (growerId: string): Promise<PendingRejection[]> => {
    try {
      return await CaptureService.getPendingRejections(growerId);
    } catch (err) {
      console.error('❌ [useCapture] getPendingRejections error:', err);
      throw err;
    }
  }, []);

  const resolveRejection = useCallback(async (rejectionId: string): Promise<void> => {
    try {
      await CaptureService.resolveRejection(rejectionId);
    } catch (err) {
      console.error('❌ [useCapture] resolveRejection error:', err);
      throw err;
    }
  }, []);

  const getQualitySummary = useCallback(async (harvestReceptionId: string): Promise<QualitySummary | null> => {
    try {
      return await CaptureService.getQualitySummary(harvestReceptionId);
    } catch (err) {
      console.error('❌ [useCapture] getQualitySummary error:', err);
      throw err;
    }
  }, []);

  // ============================================================
  // GETTERS FILTRADOS
  // ============================================================

  const getLotsByGrower = useCallback((growerId: string): Lot[] => {
    return lots.filter(lot => lot.grower_id === growerId && lot.is_active !== false);
  }, [lots]);

  const getHarvestsByLot = useCallback((lotId: string): HarvestReceptionResponse[] => {
    return harvests.filter(h => h.lot_id === lotId);
  }, [harvests]);

  const getHarvestsByGrower = useCallback((growerId: string): HarvestReceptionResponse[] => {
    return harvests.filter(h => h.grower_id === growerId);
  }, [harvests]);

  const getProductsByCategory = useCallback((category: string): Product[] => {
    return products.filter(p => p.category === category);
  }, [products]);

  // ============================================================
  // ESTADÍSTICAS - CORREGIDO
  // ============================================================

  const getStats = useCallback(() => {
    // ✅ Usar TODOS los harvests, sin filtrar por selectedGrower
    const filteredHarvests = harvests;

    console.log('📊 [getStats] Total harvests:', harvests.length);
    
    if (filteredHarvests.length === 0) {
      return {
        totalHarvests: 0,
        totalGoodBoxes: 0,
        totalRejectedBoxes: 0,
        averageQuality: 0,
        totalWeight: 0,
      };
    }

    const totalHarvests = filteredHarvests.length;
    const totalGoodBoxes = filteredHarvests.reduce((sum, h) => sum + (h.good_boxes || 0), 0);
    const totalRejectedBoxes = filteredHarvests.reduce((sum, h) => sum + (h.rejected_boxes || 0), 0);
    const totalWeight = filteredHarvests.reduce((sum, h) => sum + (h.weight_kg || 0), 0);

    let avgQuality = 0;
    if (totalHarvests > 0) {
      const totalQuality = filteredHarvests.reduce((sum, h) => sum + (h.quality_percentage || 0), 0);
      avgQuality = totalQuality / totalHarvests;
    }

    const stats = {
      totalHarvests,
      totalGoodBoxes,
      totalRejectedBoxes,
      averageQuality: Math.round(avgQuality * 10) / 10,
      totalWeight,
    };

    console.log('📊 [getStats] Resultado:', stats);
    return stats;
  }, [harvests]); // ✅ Solo depende de harvests

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

  // ============================================================
  // AUTO-REFRESH CUANDO CAMBIA EL FILTRO - DESACTIVADO
  // ============================================================
  // ✅ Comentado para que siempre muestre todos los datos
  // useEffect(() => {
  //   const params: any = {};
  //   if (selectedGrower) params.grower_id = selectedGrower;
  //   if (selectedLot) params.lot_id = selectedLot;
  //   refreshHarvests(params);
  // }, [selectedGrower, selectedLot, refreshHarvests]);

  return {
    // Datos
    growers,
    lots,
    products,
    harvests,
    isLoading,
    error,
    selectedGrower,
    selectedLot,

    // Setters
    setSelectedGrower,
    setSelectedLot,

    // Refresh
    refreshGrowers,
    refreshLots,
    refreshProducts,
    refreshHarvests,

    // Submits
    submitHarvest,
    submitExpense,
    inspectQuality,
    updateHarvestStatus,

    // Quality
    getPendingRejections,
    resolveRejection,
    getQualitySummary,

    // Getters
    getLotsByGrower,
    getHarvestsByLot,
    getHarvestsByGrower,
    getProductsByCategory,

    // Estadísticas
    getStats,
  };
};