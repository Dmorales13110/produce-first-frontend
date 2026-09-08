// src/modules/grower/hooks/useSectors.ts
import { useState, useEffect, useCallback } from 'react';
import { SectorsService, type Sector, type SectorSummary, type SectorFilters } from '../../../../../services/sectors';

interface UseSectorsReturn {
  sectors: Sector[];
  summary: SectorSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: SectorFilters;
  setFilters: (filters: SectorFilters) => void;
  refresh: () => Promise<void>;
}

export const useSectors = (): UseSectorsReturn => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [summary, setSummary] = useState<SectorSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SectorFilters>({});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sectorsData, summaryData] = await Promise.all([
        SectorsService.getSectors(filters),
        SectorsService.getSummary(filters),
      ]);
      setSectors(sectorsData);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [useSectors] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar sectores');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    sectors,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
  };
};