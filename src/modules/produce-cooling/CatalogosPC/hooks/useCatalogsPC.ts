// CatalogosPC/hooks/useCatalogosPC.ts

import { useState, useCallback, useEffect } from 'react';
import { CatalogService } from '../../../../services/catalog';
import type { Supplier, Product } from '../../../../services/catalog';

// Extender tipos para el frontend
interface ProveedorPC {
  id: number;
  proveedor: string;
  tipo: string;
  condiciones: string;
  credito: number;
  leadTime: string;
  gasto: string;
  isActive: boolean;
}

interface ProductoPC {
  id: number;
  sku: string;
  producto: string;
  unidad: string;
  proveedor: string;
  ultPrecio: string;
  min: number;
  max: number;
  isActive: boolean;
}

interface CatalogosPCStats {
  totalProveedores: number;
  proveedoresActivos: number;
  totalProductos: number;
  productosActivos: number;
  proveedorEstrella: string;
  gastoEstrella: string;
  peculiaridad: string;
}

// ✅ DATOS MOCK PARA PROVEEDORES
const MOCK_PROVEEDORES: ProveedorPC[] = [
  { id: 1, proveedor: 'Frescopack', tipo: 'Empaque', condiciones: 'Neto 30', credito: 30, leadTime: '7d', gasto: '$297,652', isActive: true },
  { id: 2, proveedor: 'Fletes GTO Norte', tipo: 'Fletes', condiciones: 'Neto 15', credito: 15, leadTime: '2d', gasto: '$38,500', isActive: true },
  { id: 3, proveedor: 'Joe Arévalo', tipo: 'Aduanas', condiciones: 'Neto 15', credito: 15, leadTime: '5d', gasto: '$17,738', isActive: true },
  { id: 4, proveedor: 'J.P. Pacheco', tipo: 'Aduanas', condiciones: 'Neto 30', credito: 30, leadTime: '3d', gasto: '$12,450', isActive: true },
  { id: 5, proveedor: 'Keystone Cold', tipo: 'Logística', condiciones: 'Neto 0', credito: 0, leadTime: '1d', gasto: '$8,900', isActive: false },
];

// ✅ DATOS MOCK PARA PRODUCTOS
const MOCK_PRODUCTOS: ProductoPC[] = [
  { id: 1, sku: 'SB21', producto: 'Caja Strongbox SB21', unidad: 'pza', proveedor: 'Frescopack', ultPrecio: '$37.12', min: 100, max: 500, isActive: true },
  { id: 2, sku: 'SB28', producto: 'Caja Strongbox SB28', unidad: 'pza', proveedor: 'Frescopack', ultPrecio: '$39.80', min: 50, max: 300, isActive: true },
  { id: 3, sku: 'TAR-01', producto: 'Tarima de madera', unidad: 'pza', proveedor: 'Joel Solís', ultPrecio: '$4.79', min: 20, max: 100, isActive: true },
  { id: 4, sku: 'ESQ-01', producto: 'Esquinero de plástico', unidad: 'pza', proveedor: 'Rubén Rmz.', ultPrecio: '$1.41', min: 200, max: 1000, isActive: true },
  { id: 5, sku: 'FLE-01', producto: 'Fleje + sello', unidad: 'rollo', proveedor: 'Flejes Carpa', ultPrecio: '$0.24', min: 50, max: 500, isActive: true },
];

// ✅ DATOS MOCK PARA ESTADÍSTICAS
const MOCK_STATS: CatalogosPCStats = {
  totalProveedores: MOCK_PROVEEDORES.length,
  proveedoresActivos: MOCK_PROVEEDORES.filter(p => p.isActive).length,
  totalProductos: MOCK_PRODUCTOS.length,
  productosActivos: MOCK_PRODUCTOS.filter(p => p.isActive).length,
  proveedorEstrella: 'Frescopack',
  gastoEstrella: '$297,652',
  peculiaridad: 'El hielo se pide por consumo proyectado',
};

export const useCatalogosPC = () => {
  const [proveedores, setProveedores] = useState<ProveedorPC[]>(MOCK_PROVEEDORES);
  const [productos, setProductos] = useState<ProductoPC[]>(MOCK_PRODUCTOS);
  const [stats, setStats] = useState<CatalogosPCStats>(MOCK_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ tipo: 'Todos', estatus: 'Activos' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Intentar obtener datos del backend
      const [suppliers, products] = await Promise.all([
        CatalogService.getSuppliers({
          is_active: filters.estatus === 'Activos' ? true : undefined,
        }),
        CatalogService.getProducts(),
      ]);

      // Si hay datos del backend, mapearlos; si no, usar mock
      if (suppliers && suppliers.length > 0) {
        const mappedProveedores: ProveedorPC[] = suppliers.map((s, index) => ({
          id: index + 1,
          proveedor: s.name || s.business_name || 'N/A',
          tipo: s.type || 'Otros',
          condiciones: s.payment_terms || 'Neto 30',
          credito: s.credit_days || 30,
          leadTime: s.lead_time ? `${s.lead_time}d` : '—',
          gasto: s.total_purchases ? `$${s.total_purchases.toLocaleString()}` : '$0',
          isActive: s.is_active ?? true,
        }));
        setProveedores(mappedProveedores);
      } else {
        // Usar mock si el backend no devuelve datos
        setProveedores(MOCK_PROVEEDORES);
      }

      if (products && products.length > 0) {
        const mappedProductos: ProductoPC[] = products.map((p, index) => ({
          id: index + 1,
          sku: p.sku || `SKU-${index + 1}`,
          producto: p.name || p.description || 'N/A',
          unidad: p.unit || 'pza',
          proveedor: p.supplier || p.supplier_name || 'N/A',
          ultPrecio: p.last_price ? `$${p.last_price.toFixed(2)}` : '$0.00',
          min: p.min_stock || 0,
          max: p.max_stock || 0,
          isActive: p.is_active ?? true,
        }));
        setProductos(mappedProductos);
      } else {
        setProductos(MOCK_PRODUCTOS);
      }

      // Calcular estadísticas con los datos disponibles
      const dataProveedores = suppliers && suppliers.length > 0 ? 
        suppliers.map((s, index) => ({ ...s, id: index })) : 
        MOCK_PROVEEDORES;
      const dataProductos = products && products.length > 0 ? 
        products.map((p, index) => ({ ...p, id: index })) : 
        MOCK_PRODUCTOS;

      const totalPurchase = dataProveedores.reduce((sum: number, s: any) => sum + (s.total_purchases || 0), 0);
      const topSupplier = dataProveedores.length > 0 ? 
        dataProveedores.reduce((a: any, b: any) => (a.total_purchases || 0) > (b.total_purchases || 0) ? a : b) : null;

      setStats({
        totalProveedores: dataProveedores.length,
        proveedoresActivos: dataProveedores.filter((s: any) => s.is_active !== false).length,
        totalProductos: dataProductos.length,
        productosActivos: dataProductos.filter((p: any) => p.is_active !== false).length,
        proveedorEstrella: topSupplier?.name || topSupplier?.proveedor || 'Frescopack',
        gastoEstrella: topSupplier ? `$${(topSupplier.total_purchases || 0).toLocaleString()}` : '$297,652',
        peculiaridad: 'El hielo se pide por consumo proyectado',
      });

    } catch (err) {
      console.error('❌ [useCatalogosPC] Error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
      
      // ✅ En caso de error, usar datos mock
      setProveedores(MOCK_PROVEEDORES);
      setProductos(MOCK_PRODUCTOS);
      setStats(MOCK_STATS);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // ✅ Función para actualizar proveedor (mock)
  const updateProveedor = useCallback((id: number, data: Partial<ProveedorPC>) => {
    let updated: ProveedorPC | null = null;
    setProveedores(prev => {
      const newList = prev.map(p => {
        if (p.id === id) {
          updated = { ...p, ...data };
          return updated;
        }
        return p;
      });
      return newList;
    });
    return updated;
  }, []);

  // ✅ Función para actualizar producto (mock)
  const updateProducto = useCallback((id: number, data: Partial<ProductoPC>) => {
    let updated: ProductoPC | null = null;
    setProductos(prev => {
      const newList = prev.map(p => {
        if (p.id === id) {
          updated = { ...p, ...data };
          return updated;
        }
        return p;
      });
      return newList;
    });
    return updated;
  }, []);

  // ✅ Función para agregar producto (mock)
  const addProducto = useCallback((data: any) => {
    const nuevo: ProductoPC = {
      id: Math.max(...MOCK_PRODUCTOS.map(p => p.id), 0) + 1,
      sku: data.sku || `PC-${String(MOCK_PRODUCTOS.length + 1).padStart(3, '0')}`,
      producto: data.producto || 'Nuevo producto',
      unidad: data.unidad || 'pza',
      proveedor: data.proveedor || 'N/A',
      ultPrecio: data.ultPrecio || '$0.00',
      min: data.min || 0,
      max: data.max || 0,
      isActive: true,
    };
    setProductos(prev => [...prev, nuevo]);
    return nuevo;
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    proveedores,
    productos,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    updateProveedor,
    updateProducto,
    addProducto,
    refresh: loadData,
  };
};