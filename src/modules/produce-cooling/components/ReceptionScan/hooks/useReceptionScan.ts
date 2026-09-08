// components/ReceptionScan/hooks/useReceptionScan.ts

import { useState, useCallback, useEffect } from 'react';
import { receptionScanService } from '../../../services/receptionScanService';
import type { ReceptionRecord, FolioDetail, ReceptionFilters } from '../../../types';

export const useReceptionScan = (initialFilters?: ReceptionFilters) => {
  const [receptions, setReceptions] = useState<ReceptionRecord[]>([]);
  const [folioDetail, setFolioDetail] = useState<FolioDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReceptionFilters>(initialFilters || {});

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await receptionScanService.getReceptions(filters);
      setReceptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar recepciones');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const scanFolio = useCallback(async (folio: string): Promise<any> => {
    setIsLoading(true);
    setError(null);
    try {
      const detail = await receptionScanService.getFolioDetail(folio);
      setFolioDetail(detail);
      return detail;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al escanear folio');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmReception = useCallback(async (data: any): Promise<{ success: boolean; message: string; folio: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await receptionScanService.confirmReception(data);
      await loadData();
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al confirmar recepción';
      setError(errorMsg);
      return { success: false, message: errorMsg, folio: data?.folio || '' };
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  const confirmManualReception = useCallback(async (data: any): Promise<{ success: boolean; message: string; folio: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await receptionScanService.confirmManualReception(data);
      await loadData();
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al confirmar recepción manual';
      setError(errorMsg);
      return { success: false, message: errorMsg, folio: '' };
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    loadData();
    // Default preview folio
    receptionScanService.getFolioDetail('DV-2725').then(setFolioDetail);
  }, [loadData]);

  const stats = receptionScanService.getStats(receptions);

  return {
    receptions,
    folioDetail,
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