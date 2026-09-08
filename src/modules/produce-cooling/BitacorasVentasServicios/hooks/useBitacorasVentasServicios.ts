// BitacorasVentasServicios/hooks/useBitacorasVentasServicios.ts

import { useState, useCallback, useEffect } from 'react';
import { LogBookService } from '../../../../services/logbook';
import { PLService } from '../../../../services/pl';

interface VacioRecord {
  id: string;
  folio: string;
  productor: string;
  cajas: number;
  tempEntrada: number;
  tempSalida: number;
  fecha: string;
}

interface HieloRecord {
  id: string;
  turno: string;
  producido: number;
  vendido: number;
  fecha: string;
}

interface EnhieladoRecord {
  id: string;
  folio: string;
  cajas: number;
  hieloUsado: number;
  fecha: string;
}

interface RepackRecord {
  id: string;
  folio: string;
  cajas: number;
  producto: string;
  fecha: string;
}

interface BitacorasStats {
  ciclosHoy: number;
  tempEntradaPromedio: number;
  tempSalidaPromedio: number;
  hieloProducido: number;
  hieloMeta: number;
  pendienteCobro: number;
  totalServicios: number;
  totalPagado: number;
}

export const useBitacorasVentasServicios = () => {
  const [vacio, setVacio] = useState<VacioRecord[]>([]);
  const [hielo, setHielo] = useState<HieloRecord[]>([]);
  const [enhielado, setEnhielado] = useState<EnhieladoRecord[]>([]);
  const [repack, setRepack] = useState<RepackRecord[]>([]);
  const [stats, setStats] = useState<BitacorasStats>({
    ciclosHoy: 0,
    tempEntradaPromedio: 0,
    tempSalidaPromedio: 0,
    hieloProducido: 0,
    hieloMeta: 17.5,
    pendienteCobro: 0,
    totalServicios: 0,
    totalPagado: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener logs de bitácora
      const logs = await LogBookService.getLogs();
      
      // Transformar logs a las estructuras de Produce Cooling
      const vacioData: VacioRecord[] = logs
        .filter(l => l.parameter === 'Vacio')
        .map(l => ({
          id: l.id,
          folio: l.code || l.id,
          productor: l.grower_name || 'N/A',
          cajas: 0, // Se calcularía de otro endpoint
          tempEntrada: 0,
          tempSalida: 0,
          fecha: l.date || l.created_at || '',
        }));
      setVacio(vacioData);

      // Obtener P&L para estadísticas
      const plSummary = await PLService.getSummary();
      
      setStats({
        ciclosHoy: logs.filter(l => l.status === 'Liberado').length,
        tempEntradaPromedio: 0,
        tempSalidaPromedio: 0,
        hieloProducido: 0,
        hieloMeta: 17.5,
        pendienteCobro: 0,
        totalServicios: logs.length,
        totalPagado: 0,
      });

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
    vacio,
    hielo,
    enhielado,
    repack,
    stats,
    isLoading,
    error,
    refresh: loadData,
  };
};