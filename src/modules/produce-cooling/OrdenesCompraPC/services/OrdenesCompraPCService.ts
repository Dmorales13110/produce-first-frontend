// services/ordenesCompraPCService.ts

import type {
  PartidaOC,
  OrdenCompraPC,
  OrdenCompraPCStats,
} from '../../types';

// Mock data - Partidas
const MOCK_PARTIDAS: PartidaOC[] = [
  { id: 1, concepto: 'Boquillas + kit inyector', cantidad: 1, unidad: 'kit', precioUnitario: 18400 },
  { id: 2, concepto: '', cantidad: 0, unidad: '', precioUnitario: 0 },
];

// Mock data - Órdenes de Compra
const MOCK_ORDENES: OrdenCompraPC[] = [
  {
    id: '1',
    noOC: 'OC-PC-2026-0038',
    proveedor: 'Refrigeración Bajío',
    categoria: 'HIELO',
    entregaRequerida: 'lun 30-nov',
    destino: 'Consumo directo (hielo)',
    partidas: [
      { id: 1, concepto: 'Boquillas + kit inyector', cantidad: 1, unidad: 'kit', precioUnitario: 18400 },
    ],
    total: 18400,
    estatus: 'autorizada',
    cxp: 'al llegar XML',
    fechaCreacion: '2026-11-25',
  },
  {
    id: '2',
    noOC: 'OC-PC-2026-0037',
    proveedor: 'Refrig. Bajío',
    categoria: 'MANTENIMIENTO',
    entregaRequerida: 'vie 27-nov',
    destino: 'Expediente túnel',
    partidas: [
      { id: 1, concepto: 'Mantenimiento preventivo', cantidad: 1, unidad: 'servicio', precioUnitario: 18400 },
    ],
    total: 18400,
    estatus: 'recibida',
    cxp: 'F-0912 conciliada ✓',
    fechaCreacion: '2026-11-24',
  },
  {
    id: '3',
    noOC: 'OC-PC-2026-0036',
    proveedor: 'Insumos GTO',
    categoria: 'INSUMOS',
    entregaRequerida: 'jue 26-nov',
    destino: 'Almacén insumos',
    partidas: [
      { id: 1, concepto: 'Insumos varios', cantidad: 1, unidad: 'lote', precioUnitario: 4320 },
    ],
    total: 4320,
    estatus: 'recibida',
    cxp: 'conciliada ✓',
    fechaCreacion: '2026-11-23',
  },
  {
    id: '4',
    noOC: 'OC-PC-2026-0035',
    proveedor: 'Refrigeración Bajío',
    categoria: 'ENERGÍA',
    entregaRequerida: 'mar 24-nov',
    destino: 'Consumo directo (hielo)',
    partidas: [
      { id: 1, concepto: 'Hielo comprado (50%)', cantidad: 1, unidad: 'tonelada', precioUnitario: 12500 },
    ],
    total: 12500,
    estatus: 'conciliada',
    cxp: 'F-0910 conciliada ✓',
    fechaCreacion: '2026-11-22',
  },
];

export const ordenesCompraPCService = {
  // Obtener todas las órdenes
  getOrdenes: (filters?: { proveedor?: string; categoria?: string; estatus?: string }): OrdenCompraPC[] => {
    let data = [...MOCK_ORDENES];

    if (filters?.proveedor && filters.proveedor !== 'Todos') {
      data = data.filter(o => o.proveedor === filters.proveedor);
    }
    if (filters?.categoria && filters.categoria !== 'Todas') {
      data = data.filter(o => o.categoria === filters.categoria);
    }
    if (filters?.estatus && filters.estatus !== 'Todas') {
      if (filters.estatus === 'Abiertas') {
        data = data.filter(o => o.estatus === 'autorizada' || o.estatus === 'borrador');
      } else if (filters.estatus === 'Recibidas') {
        data = data.filter(o => o.estatus === 'recibida' || o.estatus === 'facturada');
      }
    }

    return data;
  },

  // Obtener una orden por ID
  getOrdenById: (id: string): OrdenCompraPC | null => {
    const orden = MOCK_ORDENES.find(o => o.id === id);
    return orden || null;
  },

  // Crear nueva orden
  createOrden: (data: Partial<OrdenCompraPC>): OrdenCompraPC => {
    const nuevaOrden: OrdenCompraPC = {
      id: String(MOCK_ORDENES.length + 1),
      noOC: data.noOC || `OC-PC-2026-${String(1000 + MOCK_ORDENES.length + 1).padStart(4, '0')}`,
      proveedor: data.proveedor || 'Proveedor no especificado',
      categoria: data.categoria || 'OTROS',
      entregaRequerida: data.entregaRequerida || new Date().toLocaleDateString('es-MX'),
      destino: data.destino || 'Sin destino',
      partidas: data.partidas || [],
      total: data.total || 0,
      estatus: 'autorizada',
      cxp: 'pendiente',
      fechaCreacion: new Date().toISOString(),
    };
    MOCK_ORDENES.unshift(nuevaOrden);
    return nuevaOrden;
  },

  // Actualizar una orden
  updateOrden: (id: string, data: Partial<OrdenCompraPC>): OrdenCompraPC | null => {
    const index = MOCK_ORDENES.findIndex(o => o.id === id);
    if (index === -1) return null;
    MOCK_ORDENES[index] = { ...MOCK_ORDENES[index], ...data };
    return MOCK_ORDENES[index];
  },

  // Estadísticas
  getStats: (): OrdenCompraPCStats => {
    const ordenes = MOCK_ORDENES;
    const abiertas = ordenes.filter(o => o.estatus === 'autorizada' || o.estatus === 'borrador').length;
    const recibidas = ordenes.filter(o => o.estatus === 'recibida' || o.estatus === 'facturada').length;
    const conciliadas = ordenes.filter(o => o.estatus === 'conciliada').length;
    const totalComprometido = ordenes.reduce((sum, o) => sum + o.total, 0);

    return {
      totalOCs: ordenes.length,
      abiertas,
      recibidas,
      totalComprometido,
      conciliadas,
      urgentes: 1, // Mock: una orden urgente
    };
  },

  // Opciones para filtros
  getOptions: () => ({
    proveedores: ['Todos', 'Refrigeración Bajío', 'Refrig. Bajío', 'Insumos GTO'],
    categorias: ['Todas', 'HIELO', 'MANTENIMIENTO', 'INSUMOS', 'ENERGÍA'],
    estatus: ['Todas', 'Abiertas', 'Recibidas'],
    unidades: ['kit', 'servicio', 'lote', 'tonelada', 'pieza', 'kg'],
    destinos: ['Consumo directo (hielo)', 'Expediente túnel', 'Almacén insumos', 'Inyector'],
  }),
};