import { useState, useEffect, useCallback } from 'react';
import {
  InventoryService,
  type InventoryItem,
  type InventoryMovement,
  type InventoryStats,
  type Warehouse,
  type InventoryFilters,
  type CreateInventoryItemInput,
  type CreateInventoryMovementInput,
} from '../../../../../services/inventory';

interface UseInventoryReturn {
  items: InventoryItem[];
  movements: InventoryMovement[];
  stats: InventoryStats | null;
  warehouses: Warehouse[];
  isLoading: boolean;
  error: string | null;
  filters: InventoryFilters;
  setFilters: (filters: InventoryFilters) => void;
  refresh: () => Promise<void>;
  createItem: (data: CreateInventoryItemInput) => Promise<InventoryItem>;
  updateItem: (id: string, data: Partial<CreateInventoryItemInput>) => Promise<InventoryItem>;
  deleteItem: (id: string) => Promise<void>;
  createMovement: (data: CreateInventoryMovementInput) => Promise<InventoryMovement>;
}

export const useInventory = (initialFilters?: InventoryFilters): UseInventoryReturn => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InventoryFilters>(initialFilters || {});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [itemsData, statsData, warehousesData, movementsData] = await Promise.all([
        InventoryService.getItems(filters),
        InventoryService.getStats(filters),
        InventoryService.getWarehouses(),
        InventoryService.getMovements(),
      ]);
      setItems(itemsData);
      setStats(statsData);
      setWarehouses(warehousesData);
      setMovements(movementsData);
    } catch (err) {
      console.error('❌ [useInventory] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar inventario');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createItem = useCallback(async (data: CreateInventoryItemInput): Promise<InventoryItem> => {
    try {
      const result = await InventoryService.createItem(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useInventory] createItem error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateItem = useCallback(async (id: string, data: Partial<CreateInventoryItemInput>): Promise<InventoryItem> => {
    try {
      const result = await InventoryService.updateItem(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useInventory] updateItem error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    try {
      await InventoryService.deleteItem(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useInventory] deleteItem error:', err);
      throw err;
    }
  }, [fetchData]);

  const createMovement = useCallback(async (data: CreateInventoryMovementInput): Promise<InventoryMovement> => {
    try {
      const result = await InventoryService.createMovement(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useInventory] createMovement error:', err);
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    movements,
    stats,
    warehouses,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
    createItem,
    updateItem,
    deleteItem,
    createMovement,
  };
};