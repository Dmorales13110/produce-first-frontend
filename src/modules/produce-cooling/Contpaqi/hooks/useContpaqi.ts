// Contpaqi/hooks/useContpaqi.ts

import { useState, useCallback, useEffect } from 'react';
import { contpaqiService } from '../services/contpaqiService';
import type {
  EquivalenciaContpaqi,
  PaqueteExportacion,
  ContpaqiStats,
} from '../../types';

interface UseContpaqiReturn {
  equivalencias: EquivalenciaContpaqi[];
  paquetes: PaqueteExportacion[];
  stats: ContpaqiStats;
  isLoading: boolean;
  error: string | null;
  updateEquivalencia: (id: number, cuenta: string) => EquivalenciaContpaqi | null;
  exportarPaquete: (paquete: string) => Promise<{ success: boolean; message: string }>;
  refresh: () => void;
}

export const useContpaqi = (): UseContpaqiReturn => {
  const [equivalencias, setEquivalencias] = useState<EquivalenciaContpaqi[]>([]);
  const [paquetes, setPaquetes] = useState<PaqueteExportacion[]>([]);
  const [stats, setStats] = useState<ContpaqiStats>({
    totalCategorias: 0,
    ivaAcreditable: 0,
    paqueteProgreso: '',
    paqueteEstado: '',
    facturasPendientes: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const equivalenciasData = contpaqiService.getEquivalencias();
      setEquivalencias(equivalenciasData);

      const paquetesData = contpaqiService.getPaquetes();
      setPaquetes(paquetesData);

      const statsData = contpaqiService.getStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateEquivalencia = useCallback((id: number, cuenta: string): EquivalenciaContpaqi | null => {
    const updated = contpaqiService.updateEquivalencia(id, cuenta);
    if (updated) {
      setEquivalencias(prev => prev.map(e => e.id === id ? updated : e));
    }
    return updated;
  }, []);

  const exportarPaquete = useCallback(async (paquete: string) => {
    setIsLoading(true);
    try {
      const result = contpaqiService.exportarPaquete(paquete);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al exportar paquete';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    equivalencias,
    paquetes,
    stats,
    isLoading,
    error,
    updateEquivalencia,
    exportarPaquete,
    refresh: loadData,
  };
};