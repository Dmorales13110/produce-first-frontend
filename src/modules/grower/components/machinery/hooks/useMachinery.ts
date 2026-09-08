import { useState, useEffect, useCallback, useRef } from 'react';
import {
  MachineryService,
  type MachineryEquipment,
  type MachineryEvent,
  type MachineryService as MachineryServiceType,
  type MachinerySummary,
  type MachineryFilters,
} from '../../../../../services/machinery';

interface UseMachineryReturn {
  equipment: MachineryEquipment[];
  events: MachineryEvent[];
  services: MachineryServiceType[];
  summary: MachinerySummary | null;
  isLoading: boolean;
  error: string | null;
  filters: MachineryFilters;
  setFilters: (filters: MachineryFilters) => void;
  refresh: () => Promise<void>;
  // CRUD Equipment
  createEquipment: (data: any) => Promise<MachineryEquipment>;
  updateEquipment: (id: string, data: any) => Promise<MachineryEquipment>;
  deleteEquipment: (id: string) => Promise<void>;
  getEquipmentById: (id: string) => Promise<MachineryEquipment>;
  // CRUD Events
  createEvent: (data: any) => Promise<MachineryEvent>;
  updateEvent: (id: string, data: any) => Promise<MachineryEvent>;
  deleteEvent: (id: string) => Promise<void>;
  // CRUD Services
  createService: (data: any) => Promise<MachineryServiceType>;
  updateService: (id: string, data: any) => Promise<MachineryServiceType>;
  deleteService: (id: string) => Promise<void>;
  today: Date;
}

export const useMachinery = (initialFilters?: MachineryFilters): UseMachineryReturn => {
  const [equipment, setEquipment] = useState<MachineryEquipment[]>([]);
  const [events, setEvents] = useState<MachineryEvent[]>([]);
  const [services, setServices] = useState<MachineryServiceType[]>([]);
  const [summary, setSummary] = useState<MachinerySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MachineryFilters>(initialFilters || {});
  
  const isMounted = useRef(true);
  const fetchInProgress = useRef(false);
  const initialFetchDone = useRef(false);

  const today = new Date();

  const fetchData = useCallback(async () => {
    if (fetchInProgress.current) return;

    fetchInProgress.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const [equipmentData, eventsData, servicesData, summaryData] = await Promise.all([
        MachineryService.getEquipment(filters),
        MachineryService.getEvents(),
        MachineryService.getServices(),
        MachineryService.getSummary(),
      ]);

      if (isMounted.current) {
        setEquipment(equipmentData || []);
        setEvents(eventsData || []);
        setServices(servicesData || []);
        setSummary(summaryData);
        initialFetchDone.current = true;
      }
    } catch (err) {
      console.error('❌ [useMachinery] fetch error:', err);
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Error al cargar maquinaria');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
      fetchInProgress.current = false;
    }
  }, [filters]);

  // ============================================================
  // CRUD EQUIPMENT
  // ============================================================

  const createEquipment = useCallback(async (data: any): Promise<MachineryEquipment> => {
    try {
      const result = await MachineryService.createEquipment(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useMachinery] createEquipment error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateEquipment = useCallback(async (id: string, data: any): Promise<MachineryEquipment> => {
    try {
      const result = await MachineryService.updateEquipment(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useMachinery] updateEquipment error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteEquipment = useCallback(async (id: string): Promise<void> => {
    try {
      await MachineryService.deleteEquipment(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useMachinery] deleteEquipment error:', err);
      throw err;
    }
  }, [fetchData]);

  const getEquipmentById = useCallback(async (id: string): Promise<MachineryEquipment> => {
    try {
      return await MachineryService.getEquipmentById(id);
    } catch (err) {
      console.error('❌ [useMachinery] getEquipmentById error:', err);
      throw err;
    }
  }, []);

  // ============================================================
  // CRUD EVENTS
  // ============================================================

  const createEvent = useCallback(async (data: any): Promise<MachineryEvent> => {
    try {
      const result = await MachineryService.createEvent(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useMachinery] createEvent error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateEvent = useCallback(async (id: string, data: any): Promise<MachineryEvent> => {
    try {
      const result = await MachineryService.updateEvent(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useMachinery] updateEvent error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteEvent = useCallback(async (id: string): Promise<void> => {
    try {
      await MachineryService.deleteEvent(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useMachinery] deleteEvent error:', err);
      throw err;
    }
  }, [fetchData]);

  // ============================================================
  // CRUD SERVICES
  // ============================================================

  const createService = useCallback(async (data: any): Promise<MachineryServiceType> => {
    try {
      const result = await MachineryService.createService(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useMachinery] createService error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateService = useCallback(async (id: string, data: any): Promise<MachineryServiceType> => {
    try {
      const result = await MachineryService.updateService(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useMachinery] updateService error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteService = useCallback(async (id: string): Promise<void> => {
    try {
      await MachineryService.deleteService(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useMachinery] deleteService error:', err);
      throw err;
    }
  }, [fetchData]);

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    isMounted.current = true;
    if (!initialFetchDone.current) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialFetchDone.current) {
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    equipment,
    events,
    services,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentById,
    createEvent,
    updateEvent,
    deleteEvent,
    createService,
    updateService,
    deleteService,
    today,
  };
};