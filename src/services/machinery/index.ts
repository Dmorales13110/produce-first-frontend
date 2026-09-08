import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface MachineryEquipment {
  id: string;
  code: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  hour_meter: number;
  last_service: string;
  next_service: string;
  fuel_consumption_weekly: number;
  maintenance_cost: number;
  cost_per_hour: number;
  status: 'operando' | 'en_reparacion' | 'detenido';
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MachineryEvent {
  id: string;
  equipment_id: string;
  equipment?: MachineryEquipment;
  event_type: 'labor' | 'diesel' | 'service';
  event_date: string;
  event_time: string;
  sector?: string;
  labor_type?: string;
  quantity: number;
  unit?: string;
  cost: number;
  operator?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MachineryService {
  id: string;
  equipment_id: string;
  service_date: string;
  service_type: string;
  description: string;
  cost: number;
  provider: string;
  invoice_number: string;
  hour_meter_at_service: number;
  next_service_hours: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MachinerySummary {
  // KPIs Principales
  totalEquipment: number;
  equipmentOperating: number;
  equipmentStopped: number;
  equipmentInRepair: number;
  equipmentDetenido: number;
  operationalPercent: number;
  
  // Consumo y Costos
  fuelConsumption: string;
  fuelConsumptionLiters: number;
  fuelCost: string;
  fuelCostValue: number;
  sectorCost: string;
  sectorCostValue: number;
  totalMaintenanceCost: string;
  totalMaintenanceCostValue: number;
  avgCostPerHour: number;
  
  // Eventos del Día
  eventsToday: number;
  laborEventsToday: number;
  dieselEventsToday: number;
  serviceEventsToday: number;
  
  // Rendimiento
  avgHoursPerDay: number;
  totalHoursWorked: number;
  efficiencyScore: number;
}

export interface MachineryFilters {
  status?: string;
  type?: string;
  search?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const MachineryService = {
  // ============================================================
  // EQUIPMENT - CRUD COMPLETO
  // ============================================================

  getEquipment: async (filters?: MachineryFilters): Promise<MachineryEquipment[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.search) queryParams.append('search', filters.search);

      const url = `/machinery/equipment${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: MachineryEquipment[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] getEquipment error:', error);
      throw error;
    }
  },

  getEquipmentById: async (id: string): Promise<MachineryEquipment> => {
    try {
      const response = await api.get<{ success: boolean; data: MachineryEquipment }>(`/machinery/equipment/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] getEquipmentById error:', error);
      throw error;
    }
  },

  createEquipment: async (data: any): Promise<MachineryEquipment> => {
    try {
      const response = await api.post<{ success: boolean; data: MachineryEquipment }>('/machinery/equipment', data);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] createEquipment error:', error);
      throw error;
    }
  },

  updateEquipment: async (id: string, data: any): Promise<MachineryEquipment> => {
    try {
      const response = await api.put<{ success: boolean; data: MachineryEquipment }>(`/machinery/equipment/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] updateEquipment error:', error);
      throw error;
    }
  },

  deleteEquipment: async (id: string): Promise<void> => {
    try {
      await api.delete(`/machinery/equipment/${id}`);
    } catch (error) {
      console.error('❌ [MachineryService] deleteEquipment error:', error);
      throw error;
    }
  },

  // ============================================================
  // EVENTS - CRUD COMPLETO
  // ============================================================

  getEvents: async (date?: string, equipmentId?: string): Promise<MachineryEvent[]> => {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (equipmentId) params.append('equipmentId', equipmentId);

      const url = `/machinery/events${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: MachineryEvent[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] getEvents error:', error);
      throw error;
    }
  },

  getEventById: async (id: string): Promise<MachineryEvent> => {
    try {
      const response = await api.get<{ success: boolean; data: MachineryEvent }>(`/machinery/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] getEventById error:', error);
      throw error;
    }
  },

  createEvent: async (data: any): Promise<MachineryEvent> => {
    try {
      const response = await api.post<{ success: boolean; data: MachineryEvent }>('/machinery/events', data);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] createEvent error:', error);
      throw error;
    }
  },

  updateEvent: async (id: string, data: any): Promise<MachineryEvent> => {
    try {
      const response = await api.put<{ success: boolean; data: MachineryEvent }>(`/machinery/events/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] updateEvent error:', error);
      throw error;
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      await api.delete(`/machinery/events/${id}`);
    } catch (error) {
      console.error('❌ [MachineryService] deleteEvent error:', error);
      throw error;
    }
  },

  // ============================================================
  // SERVICES - CRUD COMPLETO
  // ============================================================

  getServices: async (equipmentId?: string): Promise<MachineryService[]> => {
    try {
      const url = equipmentId ? `/machinery/services?equipmentId=${equipmentId}` : '/machinery/services';
      const response = await api.get<{ success: boolean; data: MachineryService[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] getServices error:', error);
      throw error;
    }
  },

  getServiceById: async (id: string): Promise<MachineryService> => {
    try {
      const response = await api.get<{ success: boolean; data: MachineryService }>(`/machinery/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] getServiceById error:', error);
      throw error;
    }
  },

  createService: async (data: any): Promise<MachineryService> => {
    try {
      const response = await api.post<{ success: boolean; data: MachineryService }>('/machinery/services', data);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] createService error:', error);
      throw error;
    }
  },

  updateService: async (id: string, data: any): Promise<MachineryService> => {
    try {
      const response = await api.put<{ success: boolean; data: MachineryService }>(`/machinery/services/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] updateService error:', error);
      throw error;
    }
  },

  deleteService: async (id: string): Promise<void> => {
    try {
      await api.delete(`/machinery/services/${id}`);
    } catch (error) {
      console.error('❌ [MachineryService] deleteService error:', error);
      throw error;
    }
  },

  // ============================================================
  // SUMMARY
  // ============================================================

  getSummary: async (): Promise<MachinerySummary> => {
    try {
      const response = await api.get<{ success: boolean; data: MachinerySummary }>('/machinery/summary');
      return response.data;
    } catch (error) {
      console.error('❌ [MachineryService] getSummary error:', error);
      throw error;
    }
  },
};