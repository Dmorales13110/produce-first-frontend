// PresupuestoPC/hooks/usePresupuestoPC.ts

import { useState, useCallback, useEffect } from 'react';
import { BudgetService } from '../../../../services/budget';
import { presupuestoPCService } from '../services/presupuestoPCService';
import type {
  TarifasPC,
  VolumenPresupuestado,
  CostoPC,
  ResultadoPlan,
  CapitalArranque,
  PresupuestoPCStats,
} from '../../types';

export const usePresupuestoPC = () => {
  const [tarifas, setTarifas] = useState<TarifasPC>(presupuestoPCService.getTarifas());
  const [volumen, setVolumen] = useState<VolumenPresupuestado[]>(presupuestoPCService.getVolumen());
  const [costos, setCostos] = useState<CostoPC[]>(presupuestoPCService.getCostos());
  const [resultado, setResultado] = useState<ResultadoPlan[]>(presupuestoPCService.getResultado());
  const [capital, setCapital] = useState<CapitalArranque[]>(presupuestoPCService.getCapital());
  const [stats, setStats] = useState<PresupuestoPCStats>(presupuestoPCService.getStats(presupuestoPCService.getTarifas(), presupuestoPCService.getCostos()));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Intentar obtener temporada activa y costos reales del backend
      const seasons = await BudgetService.getSeasons();
      const activeSeason = seasons.find(s => s.status === 'active');
      
      if (activeSeason) {
        const [costs, fob] = await Promise.allSettled([
          BudgetService.getCosts(activeSeason.id),
          BudgetService.getFOB(activeSeason.id),
        ]);

        if (costs.status === 'fulfilled' && costs.value.length > 0) {
          const totalCost = costs.value.reduce((sum, c) => sum + (c.san_aparicio || 0) + (c.la_escondida || 0), 0);
          setStats(prev => ({
            ...prev,
            totalCostos: totalCost || prev.totalCostos,
          }));
        }
      }

      setTarifas(presupuestoPCService.getTarifas());
      setVolumen(presupuestoPCService.getVolumen());
      setCostos(presupuestoPCService.getCostos());
      setResultado(presupuestoPCService.getResultado());
      setCapital(presupuestoPCService.getCapital());

    } catch (err) {
      console.warn('⚠️ [usePresupuestoPC] Error cargando presupuesto del backend, usando datos base:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTarifas = useCallback((data: Partial<TarifasPC>) => {
    const updated = presupuestoPCService.updateTarifas(data);
    setTarifas({ ...updated });
    setStats(presupuestoPCService.getStats(updated, costos));
  }, [costos]);

  const updateCosto = useCallback((key: string, valor: number) => {
    presupuestoPCService.updateCosto(key, valor);
    const updatedCostos = presupuestoPCService.getCostos();
    setCostos([...updatedCostos]);
    setStats(presupuestoPCService.getStats(tarifas, updatedCostos));
  }, [tarifas]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    tarifas,
    volumen,
    costos,
    resultado,
    capital,
    stats,
    isLoading,
    error,
    updateTarifas,
    updateCosto,
    refresh: loadData,
  };
};