// services/cxpSATConciliadoService.ts

import type {
  FacturaSAT,
  CuentaCxp,
  FlujoVencimiento,
  CxpSATStats,
} from '../../types';

// Mock data - Facturas SAT
const MOCK_FACTURAS: FacturaSAT[] = [
  {
    id: '1',
    factura: 'F-2241',
    proveedor: 'Arrendadora',
    concepto: 'Renta · pago día 15',
    monto: 396667,
    categoria: 'RENTA',
    oc: 'Sin OC · contrato',
    conciliada: false,
  },
  {
    id: '2',
    factura: 'F-2242',
    proveedor: 'CFE',
    concepto: 'Energía eléctrica - hielo propio',
    monto: 1134000,
    categoria: 'ENERGÍA',
    oc: 'OC-PC-2026-0039',
    conciliada: false,
  },
  {
    id: '3',
    factura: 'F-2243',
    proveedor: 'Refrig. Bajío',
    concepto: 'Refacciones túnel',
    monto: 18400,
    categoria: 'MANTENIMIENTO',
    oc: 'OC-PC-2026-0037',
    conciliada: true,
  },
];

// Mock data - Lista Maestra
const MOCK_CUENTAS: CuentaCxp[] = [
  {
    id: 1,
    fFactura: '01-dic',
    proveedor: 'Arrendadora',
    concepto: 'Renta (día 15)',
    totalMXN: 396667,
    pagado: 0,
    saldo: 396667,
    credito: '0d',
    vence: '15-dic',
    fPago: '',
    estatus: 'sin vencer',
    colorEstatus: 'blue',
  },
  {
    id: 2,
    fFactura: '12-nov',
    proveedor: 'Refrig. Bajío',
    concepto: 'Refacciones túnel',
    totalMXN: 18400,
    pagado: 0,
    saldo: 18400,
    credito: '15d',
    vence: '27-nov',
    fPago: '',
    estatus: 'vencida',
    colorEstatus: 'red',
  },
  {
    id: 3,
    fFactura: '08-nov',
    proveedor: 'Montacargas GTO',
    concepto: 'Renta 2 unidades',
    totalMXN: 32480,
    pagado: 32480,
    saldo: 0,
    credito: '15d',
    vence: '23-nov',
    fPago: '20-nov',
    estatus: 'pagada',
    colorEstatus: 'gray',
  },
  {
    id: 4,
    fFactura: '05-nov',
    proveedor: 'Contador',
    concepto: 'Iguala semanal',
    totalMXN: 5200,
    pagado: 5200,
    saldo: 0,
    credito: '0d',
    vence: '05-nov',
    fPago: '05-nov',
    estatus: 'pagada',
    colorEstatus: 'gray',
  },
  {
    id: 5,
    fFactura: '28-nov',
    proveedor: 'Insumos GTO',
    concepto: 'Sanitizante y guantes',
    totalMXN: 12450,
    pagado: 0,
    saldo: 12450,
    credito: '15d',
    vence: '13-dic',
    fPago: '',
    estatus: 'por vencer',
    colorEstatus: 'yellow',
  },
];

// Mock data - Flujo por vencimiento
const MOCK_FLUJO: FlujoVencimiento[] = [
  { semana: 'Sem 49 (planta)', monto: 148000, tipo: 'planta' },
  { semana: 'Día 15-dic (renta)', monto: 397000, tipo: 'renta' },
  { semana: 'Sem 50', monto: 139000, tipo: 'planta' },
  { semana: 'Sem 51', monto: 142000, tipo: 'planta' },
  { semana: 'Día 15-ene (renta)', monto: 397000, tipo: 'renta' },
];

export const cxpSATConciliadoService = {
  // Facturas SAT
  getFacturas: (): FacturaSAT[] => [...MOCK_FACTURAS],
  
  conciliarFactura: (id: string, data: { categoria: string; oc: string }): FacturaSAT | null => {
    const index = MOCK_FACTURAS.findIndex(f => f.id === id);
    if (index === -1) return null;
    MOCK_FACTURAS[index] = { 
      ...MOCK_FACTURAS[index], 
      categoria: data.categoria,
      oc: data.oc,
      conciliada: true,
    };
    return MOCK_FACTURAS[index];
  },

  // Lista Maestra
  getCuentas: (filters?: { proveedor?: string; categoria?: string; estatus?: string }): CuentaCxp[] => {
    let data = [...MOCK_CUENTAS];

    if (filters?.proveedor && filters.proveedor !== 'Todos') {
      data = data.filter(c => c.proveedor === filters.proveedor);
    }
    if (filters?.estatus && filters.estatus !== 'Por pagar' && filters.estatus !== 'Todas') {
      const estatusMap: Record<string, string[]> = {
        'Vencidas': ['vencida'],
        'Por vencer 7d': ['por vencer'],
        'Pagadas': ['pagada'],
      };
      const estatuses = estatusMap[filters.estatus] || [];
      data = data.filter(c => estatuses.includes(c.estatus));
    }
    if (filters?.estatus === 'Por pagar') {
      data = data.filter(c => c.estatus !== 'pagada');
    }

    return data;
  },

  marcarPagadas: (ids: number[], fechaPago: string, banco: string): { success: boolean; message: string } => {
    ids.forEach(id => {
      const index = MOCK_CUENTAS.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_CUENTAS[index].fPago = fechaPago;
        MOCK_CUENTAS[index].pagado = MOCK_CUENTAS[index].totalMXN;
        MOCK_CUENTAS[index].saldo = 0;
        MOCK_CUENTAS[index].estatus = 'pagada';
        MOCK_CUENTAS[index].colorEstatus = 'gray';
      }
    });
    return {
      success: true,
      message: `${ids.length} facturas marcadas como pagadas`,
    };
  },

  // Flujo por vencimiento
  getFlujo: (): FlujoVencimiento[] => [...MOCK_FLUJO],

  // Estadísticas
  getStats: (cuentas: CuentaCxp[]): CxpSATStats => {
    const totalSaldo = cuentas.reduce((sum, c) => sum + c.saldo, 0);
    const totalPagado = cuentas.reduce((sum, c) => sum + c.pagado, 0);
    const totalFacturas = cuentas.length;
    const pagadas = cuentas.filter(c => c.estatus === 'pagada').length;
    const vencidas = cuentas.filter(c => c.estatus === 'vencida').length;
    
    return {
      saldoPorPagar: totalSaldo,
      rentaMensual: 396667,
      pagoSemanalPromedio: 605621,
      totalFacturas,
      conciliadas: MOCK_FACTURAS.filter(f => f.conciliada).length,
      pendientes: MOCK_FACTURAS.filter(f => !f.conciliada).length,
      vencidas,
    };
  },

  // Opciones para filtros
  getOptions: () => ({
    proveedores: ['Todos', 'Arrendadora', 'Refrig. Bajío', 'Montacargas GTO', 'Contador', 'Insumos GTO'],
    categorias: ['Todas', 'RENTA', 'ENERGÍA', 'MANTENIMIENTO', 'INSUMOS', 'SERVICIOS'],
    estatus: ['Por pagar', 'Vencidas', 'Por vencer 7d', 'Pagadas', 'Todas'],
    bancos: ['Cuenta PC ****3312', 'Cuenta Operativa ****9821'],
  }),
};