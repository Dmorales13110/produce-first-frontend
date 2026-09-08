// src/modules/dashboard/hooks/useSeasonInfo.ts
import { useState, useEffect, useCallback } from 'react';
import { SeasonService, type SeasonInfo } from '../../../../../services/season';

interface UseSeasonInfoReturn {
  seasonInfo: SeasonInfo | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  getSeasonWeeks: (season: SeasonInfo) => { week: number; label: string }[];
}

export const useSeasonInfo = (): UseSeasonInfoReturn => {
  const [seasonInfo, setSeasonInfo] = useState<SeasonInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasonInfo = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const info = SeasonService.getCurrentSeason();
      setSeasonInfo(info);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener información de la temporada';
      setError(errorMessage);
      console.error('❌ [useSeasonInfo] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSeasonWeeks = useCallback((season: SeasonInfo) => {
    return SeasonService.getSeasonWeeks(season);
  }, []);

  useEffect(() => {
    fetchSeasonInfo();
  }, [fetchSeasonInfo]);

  return {
    seasonInfo,
    isLoading,
    error,
    refresh: fetchSeasonInfo,
    getSeasonWeeks,
  };
};