// Maintenance/hooks/useMaintenance.ts

import { useState, useCallback, useEffect } from 'react';
import { MachineryService } from '../../../../services/machinery';
import type { MachineryEquipment, MachineryEvent } from '../../../../services/machinery';

interface MaintenanceStats {
  totalEquipos: number;
  operando: number;
  enReparacion: number;
  detenido: number;
  eventosHoy: number;
  costoMantenimiento: number;
}

export const useMaintenance = () => {
  const [equipos, setEquipos] = useState<MachineryEquipment[]>([]);
  const [eventos, setEventos] = useState<MachineryEvent[]>([]);
  const [stats, setStats] = useState<MaintenanceStats>({
    totalEquipos: 0,
    operando: 0,
    enReparacion: 0,
    detenido: 0,
    eventosHoy: 0,
    costoMantenimiento: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ equipo: 'Todos', estado: 'Todos' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const equipment = await MachineryService.getEquipment();
      const events = await MachineryService.getEvents();

      setEquipos(equipment);
      setEventos(events);

      // Calcular estadísticas
      setStats({
        totalEquipos: equipment.length,
        operando: equipment.filter(e => e.status === 'operando').length,
        enReparacion: equipment.filter(e => e.status === 'en_reparacion').length,
        detenido: equipment.filter(e => e.status === 'detenido').length,
        eventosHoy: events.length,
        costoMantenimiento: events
          .filter(e => e.event_type === 'service')
          .reduce((sum, e) => sum + (e.cost || 0), 0),
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    equipos,
    eventos,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: loadData,
  };
};