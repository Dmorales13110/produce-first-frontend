// BitacorasVentasServicios/hooks/useBitacorasVentasServicios.ts

import { useState, useCallback, useEffect } from 'react';
import { LogBookService } from '../../../../services/logbook';
import { bitacorasVentasServiciosService } from '../services/bitacorasVentasServiciosService';
import type {
  VacioRecord,
  HieloRecord,
  EnhieladoRecord,
  RepackRecord,
  VentaServicioRecord,
  TemperaturaData,
  BitacorasStats,
} from '../../types';

export const useBitacorasVentasServicios = () => {
  const [vacio, setVacio] = useState<VacioRecord[]>(() => bitacorasVentasServiciosService.getVacio());
  const [hielo, setHielo] = useState<HieloRecord[]>(() => bitacorasVentasServiciosService.getHielo());
  const [enhielado, setEnhielado] = useState<EnhieladoRecord[]>(() => bitacorasVentasServiciosService.getEnhielado());
  const [repack, setRepack] = useState<RepackRecord[]>(() => bitacorasVentasServiciosService.getRepack());
  const [ventasServicios, setVentasServicios] = useState<VentaServicioRecord[]>(() =>
    bitacorasVentasServiciosService.getVentasServicios()
  );
  const [temperaturas, setTemperaturas] = useState<TemperaturaData[]>(() =>
    bitacorasVentasServiciosService.getTemperaturas()
  );
  const [stats, setStats] = useState<BitacorasStats>(() => bitacorasVentasServiciosService.getStats());

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ventasFilters, setVentasFilters] = useState<{ rango?: string; cliente?: string; servicio?: string }>({
    rango: 'Hoy',
    cliente: 'Todos',
    servicio: 'Todos',
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [logsResult] = await Promise.allSettled([
        LogBookService.getLogs(),
      ]);

      if (logsResult.status === 'fulfilled' && Array.isArray(logsResult.value) && logsResult.value.length > 0) {
        const logs = logsResult.value;
        const vacioLogs = logs.filter(l => l.parameter === 'Vacio');

        if (vacioLogs.length > 0) {
          const mappedVacio: VacioRecord[] = vacioLogs.map((l, index) => ({
            ciclo: vacioLogs.length - index,
            folios: l.code || l.grower_name || 'Ciclo Operativo',
            tarimas: 10,
            entrada: l.date ? new Date(l.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '12:00',
            tEntrada: 21.5,
            salida: '12:45',
            tSalida: 3.2,
            operador: l.recorded_by_name || 'Operador',
          }));
          setVacio(mappedVacio);
        }
      } else {
        setVacio(bitacorasVentasServiciosService.getVacio());
      }

      setHielo(bitacorasVentasServiciosService.getHielo());
      setEnhielado(bitacorasVentasServiciosService.getEnhielado());
      setRepack(bitacorasVentasServiciosService.getRepack());
      setVentasServicios(bitacorasVentasServiciosService.getVentasServicios(ventasFilters));
      setTemperaturas(bitacorasVentasServiciosService.getTemperaturas());
      setStats(bitacorasVentasServiciosService.getStats());
    } catch (err) {
      console.warn('⚠️ [useBitacorasVentasServicios] Error cargando datos, usando fallback:', err);
      setVacio(bitacorasVentasServiciosService.getVacio());
      setHielo(bitacorasVentasServiciosService.getHielo());
      setEnhielado(bitacorasVentasServiciosService.getEnhielado());
      setRepack(bitacorasVentasServiciosService.getRepack());
      setVentasServicios(bitacorasVentasServiciosService.getVentasServicios(ventasFilters));
      setTemperaturas(bitacorasVentasServiciosService.getTemperaturas());
      setStats(bitacorasVentasServiciosService.getStats());
    } finally {
      setIsLoading(false);
    }
  }, [ventasFilters]);

  // Funciones de guardado
  const saveVacio = useCallback(async (data: Partial<VacioRecord>) => {
    try {
      const nuevo = bitacorasVentasServiciosService.saveVacio(data);
      setVacio(bitacorasVentasServiciosService.getVacio());
      setStats(bitacorasVentasServiciosService.getStats());

      // Intentar sincronizar con backend
      try {
        await LogBookService.createLog({
          date: new Date().toISOString().split('T')[0],
          time: data.entrada || new Date().toTimeString().split(' ')[0],
          parameter: 'Vacio',
          value: data.tSalida || 0,
          unit: '°C',
          notes: `Ciclo: ${nuevo.ciclo}, Folios: ${nuevo.folios}, Tarimas: ${nuevo.tarimas}`,
        });
      } catch (beErr) {
        console.warn('⚠️ Backend no disponible para bitácora vacio:', beErr);
      }

      return nuevo;
    } catch (err) {
      console.error('Error al guardar vacío:', err);
      throw err;
    }
  }, []);

  const saveHielo = useCallback(async (data: Partial<HieloRecord>) => {
    const nuevo = bitacorasVentasServiciosService.saveHielo(data);
    setHielo(bitacorasVentasServiciosService.getHielo());
    setStats(bitacorasVentasServiciosService.getStats());
    return nuevo;
  }, []);

  const saveEnhielado = useCallback(async (data: Partial<EnhieladoRecord>) => {
    const nuevo = bitacorasVentasServiciosService.saveEnhielado(data);
    setEnhielado(bitacorasVentasServiciosService.getEnhielado());
    setStats(bitacorasVentasServiciosService.getStats());
    return nuevo;
  }, []);

  const saveRepack = useCallback(async (data: Partial<RepackRecord>) => {
    const nuevo = bitacorasVentasServiciosService.saveRepack(data);
    setRepack(bitacorasVentasServiciosService.getRepack());
    return nuevo;
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    vacio,
    hielo,
    enhielado,
    repack,
    ventasServicios,
    temperaturas,
    stats,
    isLoading,
    error,
    saveVacio,
    saveHielo,
    saveEnhielado,
    saveRepack,
    setVentasFilters,
    refresh: loadData,
  };
};