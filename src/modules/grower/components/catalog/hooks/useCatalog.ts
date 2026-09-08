// src/modules/grower/hooks/useCatalog.ts
import { useState, useEffect, useCallback } from 'react';
import { CatalogService, type Product, type Supplier, type CatalogSummary } from '../../../../../services/catalog';

interface UseCatalogReturn {
  products: Product[];
  suppliers: Supplier[];
  summary: CatalogSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshSuppliers: () => Promise<void>;
  createProduct: (data: any) => Promise<Product>;
  updateProduct: (id: string, data: any) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  createSupplier: (data: any) => Promise<Supplier>;
  updateSupplier: (id: string, data: any) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
}

export const useCatalog = (): UseCatalogReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [summary, setSummary] = useState<CatalogSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    try {
      const data = await CatalogService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('❌ [useCatalog] refreshProducts error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    }
  }, []);

  const refreshSuppliers = useCallback(async () => {
    try {
      const data = await CatalogService.getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error('❌ [useCatalog] refreshSuppliers error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar proveedores');
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsData, suppliersData, summaryData] = await Promise.all([
        CatalogService.getProducts(),
        CatalogService.getSuppliers(),
        CatalogService.getSummary(),
      ]);
      setProducts(productsData);
      setSuppliers(suppliersData);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [useCatalog] refresh error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar catálogos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: any): Promise<Product> => {
    try {
      const result = await CatalogService.createProduct(data);
      await refreshProducts();
      return result;
    } catch (err) {
      console.error('❌ [useCatalog] createProduct error:', err);
      throw err;
    }
  }, [refreshProducts]);

  const updateProduct = useCallback(async (id: string, data: any): Promise<Product> => {
    try {
      const result = await CatalogService.updateProduct(id, data);
      await refreshProducts();
      return result;
    } catch (err) {
      console.error('❌ [useCatalog] updateProduct error:', err);
      throw err;
    }
  }, [refreshProducts]);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    try {
      await CatalogService.deleteProduct(id);
      await refreshProducts();
    } catch (err) {
      console.error('❌ [useCatalog] deleteProduct error:', err);
      throw err;
    }
  }, [refreshProducts]);

  const createSupplier = useCallback(async (data: any): Promise<Supplier> => {
    try {
      const result = await CatalogService.createSupplier(data);
      await refreshSuppliers();
      return result;
    } catch (err) {
      console.error('❌ [useCatalog] createSupplier error:', err);
      throw err;
    }
  }, [refreshSuppliers]);

  const updateSupplier = useCallback(async (id: string, data: any): Promise<Supplier> => {
    try {
      const result = await CatalogService.updateSupplier(id, data);
      await refreshSuppliers();
      return result;
    } catch (err) {
      console.error('❌ [useCatalog] updateSupplier error:', err);
      throw err;
    }
  }, [refreshSuppliers]);

  const deleteSupplier = useCallback(async (id: string): Promise<void> => {
    try {
      await CatalogService.deleteSupplier(id);
      await refreshSuppliers();
    } catch (err) {
      console.error('❌ [useCatalog] deleteSupplier error:', err);
      throw err;
    }
  }, [refreshSuppliers]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    products,
    suppliers,
    summary,
    isLoading,
    error,
    refresh,
    refreshProducts,
    refreshSuppliers,
    createProduct,
    updateProduct,
    deleteProduct,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
};