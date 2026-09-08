// Maintenance/hooks/useMaintenance.ts

import { useState, useCallback, useEffect } from 'react';
import { MachineryService } from '../../../../services/machinery';
import { maintenanceService } from '../services/maintenanceService';
import type {
  Equipo,
  EventoEquipo,
  MaintenanceStats,
} from '../../types';

export const useMaintenance = () => {
  const [equipos, setEquipos] = useState<Equipo[]>(maintenanceService.getEquipos());
  const [eventos, setEventos] = useState<EventoEquipo[]>(maintenanceService.getEventos());
  const [stats, setStats] = useState<MaintenanceStats>(maintenanceService.getStats());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ equipo: 'Todos', estado: 'Todos' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [equipment, backendEvents] = await Promise.allSettled([
        MachineryService.getEquipment(),
        MachineryService.getEvents(),
      ]);

      if (equipment.status === 'fulfilled' && equipment.value.length > 0) {
        const mapped: Equipo[] = equipment.value.map((eq, idx) => ({
          id: idx + 1,
          nombre: eq.name,
          capNominal: eq.brand || 'Capacidad nominal',
          rendReal: eq.model || 'Rendimiento estándar',
          ultServicio: eq.last_maintenance_date || 'pre-temporada',
          costoMto: eq.total_maintenance_cost || 0,
          estado: eq.status === 'operando' ? 'operando' : 'en falla',
          editable: true,
          lectura: eq.status === 'operando' ? 'Operando' : 'En falla',
        }));
        setEquipos(mapped);
      } else {
        setEquipos(maintenanceService.getEquipos(filters));
      }

      if (backendEvents.status === 'fulfilled' && backendEvents.value.length > 0) {
        const mappedEvents: EventoEquipo[] = backendEvents.value.map((ev, idx) => ({
          id: idx + 1,
          tipo: ev.event_type === 'service' ? 'Servicio / reparación' : 'Lectura diaria',
          equipo: ev.machinery?.name || 'Equipo de planta',
          descripcion: ev.notes || ev.work_description || 'Mantenimiento preventivo',
          costo: ev.cost ? `$${ev.cost}` : '$0',
          lectura: ev.fuel_liters ? `${ev.fuel_liters} L` : 'Normal',
          reporto: ev.operator_name || 'Operador túnel',
          fecha: ev.event_date || '26-nov',
        }));
        setEventos(mappedEvents);
      } else {
        setEventos(maintenanceService.getEventos());
      }

      setStats(maintenanceService.getStats());

    } catch (err) {
      console.warn('⚠️ [useMaintenance] Usando fallback local para maquinaria:', err);
      setEquipos(maintenanceService.getEquipos(filters));
      setEventos(maintenanceService.getEventos());
      setStats(maintenanceService.getStats());
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateEquipo = useCallback((id: number, rendReal: string) => {
    maintenanceService.updateEquipo(id, rendReal);
    setEquipos(maintenanceService.getEquipos(filters));
  }, [filters]);

  const saveEvento = useCallback((data: any) => {
    const nuevo = maintenanceService.saveEvento(data);
    setEventos(maintenanceService.getEventos());
    try {
      MachineryService.createEvent({
        machinery_id: 'default',
        event_date: new Date().toISOString().split('T')[0],
        event_type: 'service',
        notes: data.descripcion,
        cost: Number(data.costo?.replace(/[^0-9.]/g, '')) || 0,
      });
    } catch (e) {
      console.warn('⚠️ [useMaintenance] Fallo al guardar evento en backend:', e);
    }
    return nuevo;
  }, []);

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
    updateEquipo,
    saveEvento,
    refresh: loadData,
  };
};