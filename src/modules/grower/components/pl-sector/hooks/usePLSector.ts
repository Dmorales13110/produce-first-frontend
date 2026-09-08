import { useState, useEffect, useCallback } from 'react';
import {
  PLSectorService,
  type SectorLive,
  type SectorClosed,
  type PLSummary,
  type PLFilters,
} from '../../../../../services/pl-sector';

interface UsePLSectorReturn {
  liveSectors: SectorLive[];
  closedSectors: SectorClosed[];
  summary: PLSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: PLFilters;
  setFilters: (filters: PLFilters) => void;
  refresh: () => Promise<void>;
}

export const usePLSector = (initialFilters?: PLFilters): UsePLSectorReturn => {
  const [liveSectors, setLiveSectors] = useState<SectorLive[]>([]);
  const [closedSectors, setClosedSectors] = useState<SectorClosed[]>([]);
  const [summary, setSummary] = useState<PLSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PLFilters>(initialFilters || {});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [liveData, closedData, summaryData] = await Promise.all([
        PLSectorService.getLiveSectors(filters),
        PLSectorService.getClosedSectors(filters),
        PLSectorService.getSummary(filters),
      ]);

      setLiveSectors(liveData || []);
      setClosedSectors(closedData || []);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [usePLSector] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos P&L');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    liveSectors,
    closedSectors,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
  };
};