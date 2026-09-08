// PresupuestoPC/hooks/usePresupuestoPC.ts

import { useState, useCallback, useEffect } from 'react';
import { BudgetService } from '../../../../services/budget';

interface TarifasPC {
  coolingPropio: number;
  coolingTerceros: number;
  hieloAllIn: number;
  repack: number;
  embolsado: number;
}

interface PresupuestoPCStats {
  ingresoPlan: number;
  gastoPlan: number;
  utilidadPlan: number;
  deudaTotal: number;
}

export const usePresupuestoPC = () => {
  const [tarifas, setTarifas] = useState<TarifasPC>({
    coolingPropio: 0.70,
    coolingTerceros: 1.00,
    hieloAllIn: 1.35,
    repack: 0.35,
    embolsado: 3.00,
  });
  const [stats, setStats] = useState<PresupuestoPCStats>({
    ingresoPlan: 0,
    gastoPlan: 0,
    utilidadPlan: 0,
    deudaTotal: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener temporada activa
      const seasons = await BudgetService.getSeasons();
      const activeSeason = seasons.find(s => s.status === 'active');
      
      if (activeSeason) {
        // Obtener costos
        const costs = await BudgetService.getCosts(activeSeason.id);
        // Obtener FOB
        const fob = await BudgetService.getFOB(activeSeason.id);
        
        // Calcular estadísticas
        const totalCost = costs.reduce((sum, c) => sum + c.san_aparicio + c.la_escondida, 0);
        const totalFOB = fob.reduce((sum, f) => sum + f.fob_1 + f.fob_2, 0);
        const commission = totalFOB * (activeSeason.commission_percent / 100);

        setStats({
          ingresoPlan: commission,
          gastoPlan: totalCost,
          utilidadPlan: commission - totalCost,
          deudaTotal: 0,
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    tarifas,
    stats,
    isLoading,
    error,
    refresh: loadData,
  };
};