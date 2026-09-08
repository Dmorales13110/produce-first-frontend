// src/services/catalog/index.ts
import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  unit: string;
  min_stock: number;
  max_stock: number;
  supplier: string;
  supplier_id?: string;
  last_price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  business_name?: string;
  rfc?: string;
  type: string;
  payment_terms: string;
  credit_days: number;
  lead_time: number | null;
  currency: string;
  total_purchases: number;
  is_active: boolean;
  contact_name?: string;
  contact_phone?: string;
  email?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface CatalogSummary {
  totalProducts: number;
  totalSuppliers: number;
  activeProducts: number;
  activeSuppliers: number;
  totalValue: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  supplier?: string;
  is_active?: boolean;
  min_price?: number;
  max_price?: number;
}

export interface SupplierFilters {
  search?: string;
  type?: string;
  currency?: string;
  is_active?: boolean;
}

export interface CreateProductInput {
  sku: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  unit: string;
  min_stock: number;
  max_stock: number;
  supplier: string;
  supplier_id?: string;
  last_price: number;
  currency: string;
}

export interface CreateSupplierInput {
  name: string;
  business_name?: string;
  rfc?: string;
  type: string;
  payment_terms: string;
  credit_days: number;
  lead_time?: number;
  currency: string;
  contact_name?: string;
  contact_phone?: string;
  email?: string;
  address?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const CatalogService = {
  // ============================================================
  // PRODUCTOS
  // ============================================================

  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.supplier) queryParams.append('supplier', filters.supplier);
      if (filters?.is_active !== undefined) queryParams.append('is_active', String(filters.is_active));
      if (filters?.min_price) queryParams.append('min_price', String(filters.min_price));
      if (filters?.max_price) queryParams.append('max_price', String(filters.max_price));

      const url = `/catalog/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: Product[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [CatalogService] getProducts error:', error);
      throw error;
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get<{ success: boolean; data: Product }>(`/catalog/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [CatalogService] getProductById error:', error);
      throw error;
    }
  },

  createProduct: async (input: CreateProductInput): Promise<Product> => {
    try {
      const response = await api.post<{ success: boolean; data: Product }>('/catalog/products', input);
      return response.data;
    } catch (error) {
      console.error('❌ [CatalogService] createProduct error:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, input: Partial<CreateProductInput>): Promise<Product> => {
    try {
      const response = await api.put<{ success: boolean; data: Product }>(`/catalog/products/${id}`, input);
      return response.data;
    } catch (error) {
      console.error('❌ [CatalogService] updateProduct error:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      await api.delete(`/catalog/products/${id}`);
    } catch (error) {
      console.error('❌ [CatalogService] deleteProduct error:', error);
      throw error;
    }
  },

  // ============================================================
  // PROVEEDORES
  // ============================================================

  getSuppliers: async (filters?: SupplierFilters): Promise<Supplier[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.currency) queryParams.append('currency', filters.currency);
      if (filters?.is_active !== undefined) queryParams.append('is_active', String(filters.is_active));

      const url = `/catalog/suppliers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: Supplier[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [CatalogService] getSuppliers error:', error);
      throw error;
    }
  },

  getSupplierById: async (id: string): Promise<Supplier> => {
    try {
      const response = await api.get<{ success: boolean; data: Supplier }>(`/catalog/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [CatalogService] getSupplierById error:', error);
      throw error;
    }
  },

  createSupplier: async (input: CreateSupplierInput): Promise<Supplier> => {
    try {
      const response = await api.post<{ success: boolean; data: Supplier }>('/catalog/suppliers', input);
      return response.data;
    } catch (error) {
      console.error('❌ [CatalogService] createSupplier error:', error);
      throw error;
    }
  },

  updateSupplier: async (id: string, input: Partial<CreateSupplierInput>): Promise<Supplier> => {
    try {
      const response = await api.put<{ success: boolean; data: Supplier }>(`/catalog/suppliers/${id}`, input);
      return response.data;
    } catch (error) {
      console.error('❌ [CatalogService] updateSupplier error:', error);
      throw error;
    }
  },

  deleteSupplier: async (id: string): Promise<void> => {
    try {
      await api.delete(`/catalog/suppliers/${id}`);
    } catch (error) {
      console.error('❌ [CatalogService] deleteSupplier error:', error);
      throw error;
    }
  },

  // ============================================================
  // ESTADÍSTICAS
  // ============================================================

  getSummary: async (): Promise<CatalogSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: CatalogSummary }>('/catalog/summary');
      return response.data;
    } catch (error) {
      console.error('❌ [CatalogService] getSummary error:', error);
      throw error;
    }
  },
};