import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  capacity: number;
  current_occupancy: number;
  manager?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  notes?: string;
  empresa_id?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  type: 'seed' | 'fertilizer' | 'pesticide' | 'tool' | 'packaging' | 'other';
  category: string;
  subcategory?: string;
  unit: string;
  quantity: number;
  min_stock: number;
  max_stock: number;
  warehouse_id: string;
  warehouse?: Warehouse;
  supplier?: string;
  batch_number?: string;
  expiry_date?: string;
  unit_price: number;
  total_value: number;
  status: 'active' | 'inactive' | 'low_stock' | 'out_of_stock';
  notes?: string;
  last_updated: string;
  created_at: string;
  updated_at: string;
  empresa_id?: string;
}

export interface InventoryMovement {
  id: string;
  code: string;
  item_id: string;
  type: 'in' | 'out';
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  date: string;
  reason: 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'damage' | 'return';
  reference_id?: string;
  reference_type?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  item?: InventoryItem;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  movementsToday: number;
  valueByCategory: Array<{ category: string; value: number; percentage: number }>;
  weeklyEvolution: Array<{ week: string; value: number }>;
  topSuppliers: Array<{ supplier: string; value: number }>;
  warehouseDistribution: Array<{ warehouse: string; items: number; value: number }>;
}

export interface CreateInventoryItemInput {
  code: string;
  name: string;
  type: string;
  category: string;
  subcategory?: string;
  unit: string;
  quantity: number;
  min_stock: number;
  max_stock: number;
  warehouse_id: string;
  supplier?: string;
  batch_number?: string;
  expiry_date?: string;
  unit_price: number;
  notes?: string;
}

export interface CreateInventoryMovementInput {
  item_id: string;
  type: 'in' | 'out';
  quantity: number;
  reason: 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'damage' | 'return';
  reference_id?: string;
  reference_type?: string;
  notes?: string;
}

export interface InventoryFilters {
  warehouseId?: string;
  type?: string;
  category?: string;
  status?: string;
  search?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const InventoryService = {
  // ============================================================
  // WAREHOUSES
  // ============================================================

  getWarehouses: async (): Promise<Warehouse[]> => {
    try {
      const response = await api.get<{ success: boolean; data: Warehouse[] }>('/inventory/warehouses');
      return response.data;
    } catch (error) {
      console.error('❌ [InventoryService] getWarehouses error:', error);
      throw error;
    }
  },

  getWarehouseById: async (id: string): Promise<Warehouse> => {
    try {
      const response = await api.get<{ success: boolean; data: Warehouse }>(`/inventory/warehouses/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [InventoryService] getWarehouseById error:', error);
      throw error;
    }
  },

  createWarehouse: async (data: any): Promise<Warehouse> => {
    try {
      const response = await api.post<{ success: boolean; data: Warehouse }>('/inventory/warehouses', data);
      return response.data;
    } catch (error) {
      console.error('❌ [InventoryService] createWarehouse error:', error);
      throw error;
    }
  },

  updateWarehouse: async (id: string, data: any): Promise<Warehouse> => {
    try {
      const response = await api.put<{ success: boolean; data: Warehouse }>(`/inventory/warehouses/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [InventoryService] updateWarehouse error:', error);
      throw error;
    }
  },

  deleteWarehouse: async (id: string): Promise<void> => {
    try {
      await api.delete(`/inventory/warehouses/${id}`);
    } catch (error) {
      console.error('❌ [InventoryService] deleteWarehouse error:', error);
      throw error;
    }
  },

  // ============================================================
  // INVENTORY ITEMS
  // ============================================================

  getItems: async (filters?: InventoryFilters): Promise<InventoryItem[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.warehouseId) queryParams.append('warehouseId', filters.warehouseId);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.search) queryParams.append('search', filters.search);

      const url = `/inventory/items${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: InventoryItem[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [InventoryService] getItems error:', error);
      throw error;
    }
  },

  getItemById: async (id: string): Promise<InventoryItem> => {
    try {
      const response = await api.get<{ success: boolean; data: InventoryItem }>(`/inventory/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [InventoryService] getItemById error:', error);
      throw error;
    }
  },

  createItem: async (data: CreateInventoryItemInput): Promise<InventoryItem> => {
    try {
      const response = await api.post<{ success: boolean; data: InventoryItem }>('/inventory/items', data);
      return response.data;
    } catch (error) {
      console.error('❌ [InventoryService] createItem error:', error);
      throw error;
    }
  },

  updateItem: async (id: string, data: Partial<CreateInventoryItemInput>): Promise<InventoryItem> => {
    try {
      const response = await api.put<{ success: boolean; data: InventoryItem }>(`/inventory/items/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [InventoryService] updateItem error:', error);
      throw error;
    }
  },

  deleteItem: async (id: string): Promise<void> => {
    try {
      await api.delete(`/inventory/items/${id}`);
    } catch (error) {
      console.error('❌ [InventoryService] deleteItem error:', error);
      throw error;
    }
  },

  // ============================================================
  // INVENTORY MOVEMENTS
  // ============================================================

  getMovements: async (filters?: any): Promise<InventoryMovement[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.itemId) queryParams.append('itemId', filters.itemId);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

      const url = `/inventory/movements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: InventoryMovement[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [InventoryService] getMovements error:', error);
      throw error;
    }
  },

  createMovement: async (data: CreateInventoryMovementInput): Promise<InventoryMovement> => {
    try {
      const response = await api.post<{ success: boolean; data: InventoryMovement }>('/inventory/movements', data);
      return response.data;
    } catch (error) {
      console.error('❌ [InventoryService] createMovement error:', error);
      throw error;
    }
  },

  // ============================================================
  // STATS
  // ============================================================

  getStats: async (filters?: any): Promise<InventoryStats> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.warehouseId) queryParams.append('warehouseId', filters.warehouseId);

      const url = `/inventory/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: InventoryStats }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [InventoryService] getStats error:', error);
      throw error;
    }
  },
};