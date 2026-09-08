// src/modules/grower/hooks/useTechnical.ts
import { useState, useEffect, useCallback } from 'react';
import { TechnicalService, type TechnicalSummary, type TechnicalParameter, type YieldSpec } from '../../../../../services/technical';

interface UseTechnicalReturn {
  data: TechnicalSummary | null;
  parameters: TechnicalParameter[];
  yieldSpecs: YieldSpec[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useTechnical = (): UseTechnicalReturn => {
  const [data, setData] = useState<TechnicalSummary | null>(null);
  const [parameters, setParameters] = useState<TechnicalParameter[]>([]);
  const [yieldSpecs, setYieldSpecs] = useState<YieldSpec[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [techData, paramsData, specsData] = await Promise.all([
        TechnicalService.getTechnicalData(),
        TechnicalService.getParameters(),
        TechnicalService.getYieldSpecs(),
      ]);
      setData(techData);
      setParameters(paramsData);
      setYieldSpecs(specsData);
    } catch (err) {
      console.error('❌ [useTechnical] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar fichas técnicas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    parameters,
    yieldSpecs,
    isLoading,
    error,
    refresh: fetchData,
  };
};