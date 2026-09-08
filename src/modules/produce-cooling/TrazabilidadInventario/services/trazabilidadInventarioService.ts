// services/trazabilidadInventarioService.ts

import type {
  TrazabilidadRecord,
  KardexRecord,
  OcupacionItem,
  TrazabilidadStats,
} from '../../types';

// Mock data - Trazabilidad
const MOCK_TRAZABILIDAD: TrazabilidadRecord[] = [
  { 
    fecha: '21-oct', 
    folio: '2251', 
    productor: 'Earth Feed', 
    vegetal: 'Shanghai Mieu', 
    recibidas: 900, 
    ventas: [
      { folio: 'V-2101', cajas: 450 },
      { folio: 'V-2104', cajas: 450 },
      { folio: 'V-2106', cajas: null },
    ],
    saldo: 0 
  },
  { 
    fecha: '25-oct', 
    folio: '2301', 
    productor: 'Daily Veggies', 
    vegetal: 'Baby Bok Choy', 
    recibidas: 586, 
    ventas: [
      { folio: 'V-2102', cajas: 330 },
      { folio: 'V-2106', cajas: 180 },
      { folio: 'V-2107', cajas: null },
    ],
    saldo: 76 
  },
  { 
    fecha: '26-oct', 
    folio: '2303', 
    productor: 'Daily Veggies', 
    vegetal: 'Shanghai Bok', 
    recibidas: 1096, 
    ventas: [
      { folio: 'V-2103', cajas: 540 },
      { folio: 'V-2105', cajas: 420 },
      { folio: 'V-2108', cajas: 120 },
    ],
    saldo: 16 
  },
  { 
    fecha: '31-oct', 
    folio: '2351', 
    productor: 'Fernando García', 
    vegetal: 'Snow Pea Tips', 
    recibidas: 204, 
    ventas: [
      { folio: 'V-2104', cajas: 204 },
      { folio: 'V-2105', cajas: null },
      { folio: 'V-2106', cajas: null },
    ],
    saldo: 0 
  },
  { 
    fecha: '04-nov', 
    folio: '2313', 
    productor: 'Daily Veggies', 
    vegetal: 'Shanghai Bok', 
    recibidas: 1186, 
    ventas: [
      { folio: 'V-2110', cajas: 690 },
      { folio: 'V-2111', cajas: null },
      { folio: 'V-2112', cajas: null },
    ],
    saldo: 496 
  },
  { 
    fecha: '04-nov', 
    folio: '2354', 
    productor: 'Fernando García', 
    vegetal: 'Snow Pea Tips', 
    recibidas: 156, 
    ventas: [
      { folio: 'V-2113', cajas: null },
      { folio: 'V-2114', cajas: null },
      { folio: 'V-2115', cajas: null },
    ],
    saldo: 156 
  },
];

// Mock data - Kardex
const MOCK_KARDEX: KardexRecord[] = [
  { 
    fecha: '04-may', 
    movimiento: 'RECIBIDO', 
    productos: [
      { nombre: 'Nappa', tc: '8 × 30', cajas: '+240' },
      { nombre: 'Coliflor', tc: '16 × 30', cajas: '+480' },
      { nombre: 'Celtuce', tc: '8 × 30', cajas: '+240' },
    ]
  },
  { 
    fecha: '04-may', 
    movimiento: 'INVENTARIO', 
    productos: [
      { nombre: 'Nappa', tc: '', cajas: '780' },
      { nombre: 'Coliflor', tc: '', cajas: '498' },
      { nombre: 'Celtuce', tc: '', cajas: '240' },
    ]
  },
  { 
    fecha: '05-may', 
    movimiento: 'RECIBIDO', 
    productos: [
      { nombre: 'Nappa', tc: '9 × 30', cajas: '+270' },
      { nombre: 'Coliflor', tc: '', cajas: '' },
      { nombre: 'Celtuce', tc: '2 × 30', cajas: '+60' },
    ]
  },
  { 
    fecha: '05-may', 
    movimiento: 'INVENTARIO', 
    productos: [
      { nombre: 'Nappa', tc: '', cajas: '1,050' },
      { nombre: 'Coliflor', tc: '', cajas: '498' },
      { nombre: 'Celtuce', tc: '', cajas: '300' },
    ]
  },
  { 
    fecha: '06-may', 
    movimiento: 'CARGA 2116', 
    productos: [
      { nombre: 'Nappa', tc: '', cajas: '-450' },
      { nombre: 'Coliflor', tc: '', cajas: '-300' },
      { nombre: 'Celtuce', tc: '', cajas: '-150' },
    ]
  },
  { 
    fecha: '06-may', 
    movimiento: 'CARGA YUANQI', 
    productos: [
      { nombre: 'Nappa', tc: '', cajas: '-120' },
      { nombre: 'Coliflor', tc: '', cajas: '' },
      { nombre: 'Celtuce', tc: '', cajas: '' },
    ]
  },
  { 
    fecha: '06-may', 
    movimiento: 'INVENTARIO', 
    productos: [
      { nombre: 'Nappa', tc: '', cajas: '780' },
      { nombre: 'Coliflor', tc: '', cajas: '198' },
      { nombre: 'Celtuce', tc: '', cajas: '660' },
    ]
  },
];

// Mock data - Ocupación
const MOCK_OCUPACION: OcupacionItem[] = [
  { producto: 'Shanghai Bok', tarimas: 42, porcentaje: 75 },
  { producto: 'Nappa', tarimas: 26, porcentaje: 46 },
  { producto: 'Coliflor', tarimas: 17, porcentaje: 30 },
  { producto: 'Celtuce', tarimas: 14, porcentaje: 25 },
  { producto: 'Tips', tarimas: 8, porcentaje: 14 },
  { producto: 'Otros', tarimas: 5, porcentaje: 9 },
];

export const trazabilidadInventarioService = {
  // Trazabilidad
  getTrazabilidad: (filters?: { productor?: string; vegetal?: string; estado?: string }): TrazabilidadRecord[] => {
    let data = [...MOCK_TRAZABILIDAD];

    if (filters?.productor && filters.productor !== 'Todos') {
      data = data.filter(r => r.productor === filters.productor);
    }
    if (filters?.vegetal && filters.vegetal !== 'Todos') {
      data = data.filter(r => r.vegetal === filters.vegetal);
    }
    if (filters?.estado === 'Con saldo') {
      data = data.filter(r => r.saldo > 0);
    }
    if (filters?.estado === 'Agotados') {
      data = data.filter(r => r.saldo === 0);
    }

    return data;
  },

  // Kardex
  getKardex: (filters?: { producto?: string; rango?: string }): KardexRecord[] => {
    let data = [...MOCK_KARDEX];

    if (filters?.producto && filters.producto !== 'Todos') {
      data = data.map(record => ({
        ...record,
        productos: record.productos.filter(p => p.nombre === filters.producto)
      })).filter(record => record.productos.length > 0);
    }

    return data;
  },

  // Ocupación
  getOcupacion: (): OcupacionItem[] => {
    return [...MOCK_OCUPACION];
  },

  // Estadísticas
  getStats: (): TrazabilidadStats => {
    const totalTarimas = 168;
    const tarimasOcupadas = 112;
    const tarimasLibres = totalTarimas - tarimasOcupadas;
    const totalCajas = 4182;
    const foliosVivos = 9;
    const diasPromedio = 1.4;

    return {
      totalTarimas,
      tarimasOcupadas,
      tarimasLibres,
      porcentajeOcupacion: (tarimasOcupadas / totalTarimas) * 100,
      totalCajas,
      foliosVivos,
      diasPromedio,
    };
  },

  // Opciones para filtros
  getOptions: () => {
    const productores = ['Todos', ...new Set(MOCK_TRAZABILIDAD.map(r => r.productor))];
    const vegetales = ['Todos', ...new Set(MOCK_TRAZABILIDAD.map(r => r.vegetal))];
    const productosKardex = ['Todos', 'Nappa', 'Coliflor', 'Celtuce'];

    return {
      productores,
      vegetales,
      productosKardex,
      estados: ['Con saldo', 'Agotados', 'Todos'],
      rangos: ['Esta semana', 'Mes'],
    };
  },
};