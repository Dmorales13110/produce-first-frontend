// services/catalogosPCService.ts

import type {
  ProveedorPC,
  ProductoPC,
  CatalogosPCStats,
} from '../../types';

// Mock data - Proveedores
const MOCK_PROVEEDORES: ProveedorPC[] = [
  { 
    id: 1, 
    proveedor: 'Fábrica de hielo', 
    tipo: 'Hielo (50% comprado)', 
    condiciones: 'semanal', 
    credito: 7, 
    leadTime: '1 día', 
    gasto: '$2.77M MXN (144K cj × $1.10)',
    isActive: true,
  },
  { 
    id: 2, 
    proveedor: 'Arrendadora del parque', 
    tipo: 'Renta', 
    condiciones: 'día 15 de cada mes', 
    credito: 0, 
    leadTime: '—', 
    gasto: '$2,380,000',
    isActive: true,
  },
  { 
    id: 3, 
    proveedor: 'Montacargas GTO (2 renta)', 
    tipo: 'Equipo', 
    condiciones: 'mensual', 
    credito: 15, 
    leadTime: '3 días', 
    gasto: '$162,400 + batería $15,000',
    isActive: true,
  },
  { 
    id: 4, 
    proveedor: 'Refrigeración Bajío', 
    tipo: 'Equipo', 
    condiciones: 'factura', 
    credito: 15, 
    leadTime: '2 días', 
    gasto: 'mantenimiento variable',
    isActive: true,
  },
  { 
    id: 5, 
    proveedor: 'Control de plagas', 
    tipo: 'Inocuidad', 
    condiciones: 'mensual', 
    credito: 15, 
    leadTime: '—', 
    gasto: '$42,485',
    isActive: true,
  },
  { 
    id: 6, 
    proveedor: 'Contador / legal', 
    tipo: 'Servicios', 
    condiciones: 'semanal / mensual', 
    credito: 0, 
    leadTime: '—', 
    gasto: '$152,580',
    isActive: true,
  },
];

// Mock data - Productos
const MOCK_PRODUCTOS: ProductoPC[] = [
  { 
    id: 1, 
    sku: 'REF-014', 
    producto: 'Refrigerante túnel', 
    unidad: 'kg', 
    proveedor: 'Refrig. Bajío', 
    ultPrecio: '$1,840', 
    min: 10, 
    max: 30,
    isActive: true,
  },
  { 
    id: 2, 
    sku: 'INS-001', 
    producto: 'Guantes nitrilo', 
    unidad: 'caja 100', 
    proveedor: 'Insumos GTO', 
    ultPrecio: '$185', 
    min: 6, 
    max: 20,
    isActive: true,
  },
  { 
    id: 3, 
    sku: 'INS-004', 
    producto: 'Redes y cofias', 
    unidad: 'paq 100', 
    proveedor: 'Insumos GTO', 
    ultPrecio: '$120', 
    min: 4, 
    max: 12,
    isActive: true,
  },
  { 
    id: 4, 
    sku: 'LIM-002', 
    producto: 'Sanitizante grado alimenticio', 
    unidad: 'bidón 20L', 
    proveedor: 'Insumos GTO', 
    ultPrecio: '$960', 
    min: 2, 
    max: 8,
    isActive: true,
  },
];

export const catalogosPCService = {
  // Proveedores
  getProveedores: (filters?: { tipo?: string; estatus?: string }): ProveedorPC[] => {
    let data = [...MOCK_PROVEEDORES];

    if (filters?.tipo && filters.tipo !== 'Todos') {
      data = data.filter(p => p.tipo.includes(filters.tipo as string));
    }
    if (filters?.estatus === 'Activos') {
      data = data.filter(p => p.isActive);
    }

    return data;
  },

  updateProveedor: (id: number, data: Partial<ProveedorPC>): ProveedorPC | null => {
    const index = MOCK_PROVEEDORES.findIndex(p => p.id === id);
    if (index === -1) return null;
    MOCK_PROVEEDORES[index] = { ...MOCK_PROVEEDORES[index], ...data };
    return MOCK_PROVEEDORES[index];
  },

  // Productos
  getProductos: (): ProductoPC[] => [...MOCK_PRODUCTOS],

  updateProducto: (id: number, data: Partial<ProductoPC>): ProductoPC | null => {
    const index = MOCK_PRODUCTOS.findIndex(p => p.id === id);
    if (index === -1) return null;
    MOCK_PRODUCTOS[index] = { ...MOCK_PRODUCTOS[index], ...data };
    return MOCK_PRODUCTOS[index];
  },

  // Estadísticas
  getStats: (): CatalogosPCStats => {
    const proveedores = MOCK_PROVEEDORES;
    const productos = MOCK_PRODUCTOS;
    
    return {
      totalProveedores: proveedores.length,
      proveedoresActivos: proveedores.filter(p => p.isActive).length,
      totalProductos: productos.length,
      productosActivos: productos.filter(p => p.isActive).length,
      proveedorEstrella: 'CFE (energía hielo)',
      gastoEstrella: '$1.10/cj · entrega diaria',
      peculiaridad: 'consumo diario ligado al volumen enhielado',
    };
  },

  // Opciones para filtros
  getOptions: () => ({
    tiposProveedor: ['Todos', 'Hielo', 'Renta', 'Equipo', 'Inocuidad', 'Servicios'],
    estatusProveedor: ['Activos', 'Todos'],
  }),
};