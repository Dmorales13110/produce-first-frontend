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

const MOCK_PRODUCTS: Product[] = [
  { id: '1', sku: 'SB21', name: 'Caja Strongbox SB21', description: 'Caja para exportación', category: 'Empaque', unit: 'pza', min_stock: 100, max_stock: 500, supplier: 'Frescopack', last_price: 37.12, currency: 'MXN', is_active: true, created_at: '', updated_at: '' },
  { id: '2', sku: 'SB28', name: 'Caja Strongbox SB28', description: 'Caja alta resistencia', category: 'Empaque', unit: 'pza', min_stock: 50, max_stock: 300, supplier: 'Frescopack', last_price: 39.80, currency: 'MXN', is_active: true, created_at: '', updated_at: '' },
  { id: '3', sku: 'TAR-01', name: 'Tarima de madera', description: 'Tarima estándar tratada', category: 'Tarimas', unit: 'pza', min_stock: 20, max_stock: 100, supplier: 'Joel Solís', last_price: 4.79, currency: 'USD', is_active: true, created_at: '', updated_at: '' },
  { id: '4', sku: 'ESQ-01', name: 'Esquinero de plástico', description: 'Protección para flejado', category: 'Consumibles', unit: 'pza', min_stock: 200, max_stock: 1000, supplier: 'Rubén Rmz.', last_price: 1.41, currency: 'MXN', is_active: true, created_at: '', updated_at: '' },
  { id: '5', sku: 'FLE-01', name: 'Fleje + sello', description: 'Rollo de fleje negro', category: 'Consumibles', unit: 'rollo', min_stock: 50, max_stock: 500, supplier: 'Flejes Carpa', last_price: 0.24, currency: 'USD', is_active: true, created_at: '', updated_at: '' },
];

const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Frescopack', business_name: 'Frescopack de México S.A.', type: 'Empaque', payment_terms: 'Neto 30', credit_days: 30, lead_time: 7, currency: 'MXN', total_purchases: 297652, is_active: true, created_at: '', updated_at: '' },
  { id: '2', name: 'Fletes GTO Norte', business_name: 'Transportes GTO Norte', type: 'Fletes', payment_terms: 'Neto 15', credit_days: 15, lead_time: 2, currency: 'MXN', total_purchases: 38500, is_active: true, created_at: '', updated_at: '' },
  { id: '3', name: 'Joe Arévalo', business_name: 'Agencia Aduanal Arévalo', type: 'Aduanas', payment_terms: 'Neto 15', credit_days: 15, lead_time: 5, currency: 'USD', total_purchases: 17738, is_active: true, created_at: '', updated_at: '' },
  { id: '4', name: 'J.P. Pacheco', business_name: 'Comercializadora Pacheco', type: 'Aduanas', payment_terms: 'Neto 30', credit_days: 30, lead_time: 3, currency: 'USD', total_purchases: 12450, is_active: true, created_at: '', updated_at: '' },
  { id: '5', name: 'Keystone Cold', business_name: 'Keystone Cold Storage', type: 'Logística', payment_terms: 'Neto 0', credit_days: 0, lead_time: 1, currency: 'USD', total_purchases: 8900, is_active: false, created_at: '', updated_at: '' },
];

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
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_PRODUCTS;
    } catch (error) {
      console.warn('⚠️ [CatalogService] Backend no disponible para products. Usando datos mock.');
      return MOCK_PRODUCTS;
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get<{ success: boolean; data: Product }>(`/catalog/products/${id}`);
      return response.data || MOCK_PRODUCTS[0];
    } catch (error) {
      return MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
    }
  },

  createProduct: async (input: CreateProductInput): Promise<Product> => {
    try {
      const response = await api.post<{ success: boolean; data: Product }>('/catalog/products', input);
      return response.data;
    } catch (error) {
      return {
        id: `mock-${Date.now()}`,
        ...input,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },

  updateProduct: async (id: string, input: Partial<CreateProductInput>): Promise<Product> => {
    try {
      const response = await api.put<{ success: boolean; data: Product }>(`/catalog/products/${id}`, input);
      return response.data;
    } catch (error) {
      const found = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
      return { ...found, ...input };
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      await api.delete(`/catalog/products/${id}`);
    } catch (error) {
      console.warn('⚠️ [CatalogService] deleteProduct mock ejecutado');
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
      return (response && response.data && response.data.length > 0) ? response.data : MOCK_SUPPLIERS;
    } catch (error) {
      console.warn('⚠️ [CatalogService] Backend no disponible para suppliers. Usando datos mock.');
      return MOCK_SUPPLIERS;
    }
  },

  getSupplierById: async (id: string): Promise<Supplier> => {
    try {
      const response = await api.get<{ success: boolean; data: Supplier }>(`/catalog/suppliers/${id}`);
      return response.data || MOCK_SUPPLIERS[0];
    } catch (error) {
      return MOCK_SUPPLIERS.find(s => s.id === id) || MOCK_SUPPLIERS[0];
    }
  },

  createSupplier: async (input: CreateSupplierInput): Promise<Supplier> => {
    try {
      const response = await api.post<{ success: boolean; data: Supplier }>('/catalog/suppliers', input);
      return response.data;
    } catch (error) {
      return {
        id: `mock-${Date.now()}`,
        ...input,
        total_purchases: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },

  updateSupplier: async (id: string, input: Partial<CreateSupplierInput>): Promise<Supplier> => {
    try {
      const response = await api.put<{ success: boolean; data: Supplier }>(`/catalog/suppliers/${id}`, input);
      return response.data;
    } catch (error) {
      const found = MOCK_SUPPLIERS.find(s => s.id === id) || MOCK_SUPPLIERS[0];
      return { ...found, ...input };
    }
  },

  deleteSupplier: async (id: string): Promise<void> => {
    try {
      await api.delete(`/catalog/suppliers/${id}`);
    } catch (error) {
      console.warn('⚠️ [CatalogService] deleteSupplier mock ejecutado');
    }
  },

  // ============================================================
  // ESTADÍSTICAS
  // ============================================================

  getSummary: async (): Promise<CatalogSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: CatalogSummary }>('/catalog/summary');
      return response.data || {
        totalProducts: MOCK_PRODUCTS.length,
        totalSuppliers: MOCK_SUPPLIERS.length,
        activeProducts: MOCK_PRODUCTS.filter(p => p.is_active).length,
        activeSuppliers: MOCK_SUPPLIERS.filter(s => s.is_active).length,
        totalValue: 350000,
      };
    } catch (error) {
      return {
        totalProducts: MOCK_PRODUCTS.length,
        totalSuppliers: MOCK_SUPPLIERS.length,
        activeProducts: MOCK_PRODUCTS.filter(p => p.is_active).length,
        activeSuppliers: MOCK_SUPPLIERS.filter(s => s.is_active).length,
        totalValue: 350000,
      };
    }
  },
};