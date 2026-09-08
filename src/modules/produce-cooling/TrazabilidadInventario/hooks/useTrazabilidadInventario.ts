// TrazabilidadInventario/hooks/useTrazabilidadInventario.ts

import { useState, useCallback, useEffect } from 'react';
import type {
  TrazabilidadRecord,
  KardexRecord,
  OcupacionItem,
  TrazabilidadStats,
} from '../../types';
import { trazabilidadInventarioService } from '../services/trazabilidadInventarioService';
import { api } from '../../../../services/apiClient';

export const useTrazabilidadInventario = () => {
  const [filters, setFilters] = useState({ productor: 'Todos', vegetal: 'Todos', estado: 'Con saldo' });
  const [kardexFilters, setKardexFilters] = useState({ producto: 'Todos', rango: 'Esta semana' });

  const [trazabilidad, setTrazabilidad] = useState<TrazabilidadRecord[]>(() =>
    trazabilidadInventarioService.getTrazabilidad({ productor: 'Todos', vegetal: 'Todos', estado: 'Con saldo' })
  );
  const [kardex, setKardex] = useState<KardexRecord[]>(() =>
    trazabilidadInventarioService.getKardex({ producto: 'Todos', rango: 'Esta semana' })
  );
  const [ocupacion, setOcupacion] = useState<OcupacionItem[]>(() =>
    trazabilidadInventarioService.getOcupacion()
  );
  const [stats, setStats] = useState<TrazabilidadStats>(() =>
    trazabilidadInventarioService.getStats()
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Intentar consultar backend para recepciones/inventario
      const [backendReceptions] = await Promise.allSettled([
        api.get<any[]>('/harvest-receptions'),
      ]);

      // Cargar datos locales con filtros actuales
      let currentTrazabilidad = trazabilidadInventarioService.getTrazabilidad(filters);

      // Si el backend devuelve recepciones, enriquecer o complementar la trazabilidad
      if (backendReceptions.status === 'fulfilled' && Array.isArray(backendReceptions.value) && backendReceptions.value.length > 0) {
        const mappedBackend: TrazabilidadRecord[] = backendReceptions.value.map(item => ({
          fecha: item.date ? new Date(item.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '—',
          folio: item.folio || item.code || String(item.id || ''),
          productor: item.grower_name || item.grower || 'Productor Local',
          vegetal: item.product_name || item.variety || 'Vegetal',
          recibidas: Number(item.total_boxes || item.boxes_received || item.quantity || 0),
          ventas: [],
          saldo: Number(item.total_boxes || item.boxes_received || item.quantity || 0),
        }));

        // Combinar datos reales prioritariamente con los de catálogo
        currentTrazabilidad = [...mappedBackend, ...currentTrazabilidad];
      }

      setTrazabilidad(currentTrazabilidad);
      setKardex(trazabilidadInventarioService.getKardex(kardexFilters));
      setOcupacion(trazabilidadInventarioService.getOcupacion());
      setStats(trazabilidadInventarioService.getStats());
    } catch (err) {
      console.warn('⚠️ [useTrazabilidadInventario] Usando datos locales de respaldo:', err);
      setTrazabilidad(trazabilidadInventarioService.getTrazabilidad(filters));
      setKardex(trazabilidadInventarioService.getKardex(kardexFilters));
      setOcupacion(trazabilidadInventarioService.getOcupacion());
      setStats(trazabilidadInventarioService.getStats());
    } finally {
      setIsLoading(false);
    }
  }, [filters, kardexFilters]);

  // Actualizar trazabilidad cuando cambien los filtros
  useEffect(() => {
    setTrazabilidad(trazabilidadInventarioService.getTrazabilidad(filters));
  }, [filters]);

  // Actualizar kardex cuando cambien sus filtros
  useEffect(() => {
    setKardex(trazabilidadInventarioService.getKardex(kardexFilters));
  }, [kardexFilters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    trazabilidad,
    kardex,
    ocupacion,
    stats,
    isLoading,
    error,
    filters,
    kardexFilters,
    setFilters,
    setKardexFilters,
    refresh: loadData,
  };
};