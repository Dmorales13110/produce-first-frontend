import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CardConciliationService,
  type CardMovement,
  type CardImport,
  type CardSummary,
  type CardFilters,
} from '../../../../../services/card-conciliation';

interface UseCardConciliationReturn {
  movements: CardMovement[];
  imports: CardImport[];
  summary: CardSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: CardFilters;
  setFilters: (filters: CardFilters) => void;
  refresh: () => Promise<void>;
  updateMovement: (id: string, data: any) => Promise<CardMovement>;
  updateMovementsBatch: (movements: any[]) => Promise<any>;
  importMovements: (data: any) => Promise<CardImport>;
  registerExpense: (movementId: string, data: any) => Promise<any>;
  registerManualExpense: (data: any) => Promise<any>;
}

export const useCardConciliation = (initialFilters?: CardFilters): UseCardConciliationReturn => {
  const [movements, setMovements] = useState<CardMovement[]>([]);
  const [imports, setImports] = useState<CardImport[]>([]);
  const [summary, setSummary] = useState<CardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CardFilters>(initialFilters || {});
  
  const isMounted = useRef(true);
  const fetchInProgress = useRef(false);
  const initialFetchDone = useRef(false);

  const fetchData = useCallback(async () => {
    if (fetchInProgress.current) return;

    fetchInProgress.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const [movementsData, importsData, summaryData] = await Promise.all([
        CardConciliationService.getMovements(filters),
        CardConciliationService.getImports(),
        CardConciliationService.getSummary(),
      ]);

      if (isMounted.current) {
        setMovements(movementsData || []);
        setImports(importsData || []);
        setSummary(summaryData);
        initialFetchDone.current = true;
      }
    } catch (err) {
      console.error('❌ [useCardConciliation] fetch error:', err);
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Error al cargar conciliación');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
      fetchInProgress.current = false;
    }
  }, [filters]);

  const updateMovement = useCallback(async (id: string, data: any): Promise<CardMovement> => {
    try {
      const result = await CardConciliationService.updateMovement(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useCardConciliation] updateMovement error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateMovementsBatch = useCallback(async (movementsData: any[]): Promise<any> => {
    try {
      const result = await CardConciliationService.updateMovementsBatch(movementsData);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useCardConciliation] updateMovementsBatch error:', err);
      throw err;
    }
  }, [fetchData]);

  const importMovements = useCallback(async (data: any): Promise<CardImport> => {
    try {
      const result = await CardConciliationService.importMovements(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useCardConciliation] importMovements error:', err);
      throw err;
    }
  }, [fetchData]);

  // ============================================================
  // REGISTRAR GASTOS
  // ============================================================

  const registerExpense = useCallback(async (movementId: string, data: any): Promise<any> => {
    try {
      const result = await CardConciliationService.registerExpense(movementId, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useCardConciliation] registerExpense error:', err);
      throw err;
    }
  }, [fetchData]);

  const registerManualExpense = useCallback(async (data: any): Promise<any> => {
    try {
      const result = await CardConciliationService.registerManualExpense(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useCardConciliation] registerManualExpense error:', err);
      throw err;
    }
  }, [fetchData]);

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    isMounted.current = true;
    if (!initialFetchDone.current) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialFetchDone.current) {
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    movements,
    imports,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
    updateMovement,
    updateMovementsBatch,
    importMovements,
    registerExpense,
    registerManualExpense,
  };
};