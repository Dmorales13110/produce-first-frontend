// services/cxcServiciosFacturadosService.ts

import type {
  FacturaCxc,
  CuentaCxc,
  CxcStats,
} from '../../types';

// Mock data - Facturas a emitir
const MOCK_FACTURAS: FacturaCxc[] = [
  {
    id: '1',
    corte: 'S48 · propio',
    cliente: 'Produce First',
    contenido: 'cooling 9,840 cj + embolsado 370',
    importe: 186420,
    factura: 'PC-F-0221',
    emitida: false,
    tipo: 'propio',
  },
  {
    id: '2',
    corte: 'S48 · terceros',
    cliente: 'Cliente brócoli',
    contenido: 'cooling 11,200 cj + hielo 8,960',
    importe: 437180,
    factura: 'PC-F-0222',
    emitida: false,
    tipo: 'terceros',
  },
];

// Mock data - Lista Maestra CxC
const MOCK_CUENTAS_CXC: CuentaCxc[] = [
  {
    id: 1,
    fFactura: '24-nov',
    cliente: 'Cliente brócoli',
    factura: 'PC-F-0219',
    concepto: 'Servicios S47',
    total: 418200,
    cobrado: 0,
    saldo: 418200,
    credito: '7d',
    vence: '01-dic',
    fCobro: '',
    estatus: 'por cobrar',
  },
  {
    id: 2,
    fFactura: '24-nov',
    cliente: 'Produce First',
    factura: 'PC-F-0218',
    concepto: 'Servicios S47 (interco.)',
    total: 172300,
    cobrado: 172300,
    saldo: 0,
    credito: '15d',
    vence: '09-dic',
    fCobro: '26-nov',
    estatus: 'cobrada',
  },
  {
    id: 3,
    fFactura: '17-nov',
    cliente: 'Cliente brócoli',
    factura: 'PC-F-0215',
    concepto: 'Servicios S46',
    total: 402110,
    cobrado: 402110,
    saldo: 0,
    credito: '7d',
    vence: '24-nov',
    fCobro: '24-nov',
    estatus: 'cobrada',
  },
  {
    id: 4,
    fFactura: '01-dic',
    cliente: 'Cliente brócoli',
    factura: 'PC-F-0222',
    concepto: 'Servicios S48 (cooling + hielo)',
    total: 437180,
    cobrado: 0,
    saldo: 437180,
    credito: '7d',
    vence: '08-dic',
    fCobro: '',
    estatus: 'por cobrar',
  },
];

export const cxcServiciosFacturadosService = {
  // Facturas a emitir
  getFacturas: (): FacturaCxc[] => [...MOCK_FACTURAS],
  
  emitirFactura: (id: string, folio: string): FacturaCxc | null => {
    const index = MOCK_FACTURAS.findIndex(f => f.id === id);
    if (index === -1) return null;
    MOCK_FACTURAS[index] = { 
      ...MOCK_FACTURAS[index], 
      factura: folio,
      emitida: true,
    };
    return MOCK_FACTURAS[index];
  },

  // Lista Maestra CxC
  getCuentasCxc: (filters?: { cliente?: string; servicio?: string; estatus?: string }): CuentaCxc[] => {
    let data = [...MOCK_CUENTAS_CXC];

    if (filters?.cliente && filters.cliente !== 'Todos') {
      data = data.filter(c => c.cliente === filters.cliente);
    }
    if (filters?.estatus && filters.estatus !== 'Por cobrar' && filters.estatus !== 'Todas') {
      const estatusMap: Record<string, string> = {
        'Vencidas': 'vencida',
        'Cobradas': 'cobrada',
      };
      const estatusFilter = estatusMap[filters.estatus];
      if (estatusFilter) {
        data = data.filter(c => c.estatus === estatusFilter);
      }
    }
    if (filters?.estatus === 'Por cobrar') {
      data = data.filter(c => c.estatus === 'por cobrar' || c.estatus === 'vencida');
    }

    return data;
  },

  marcarCobradas: (ids: number[], fechaCobro: string): { success: boolean; message: string } => {
    ids.forEach(id => {
      const index = MOCK_CUENTAS_CXC.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_CUENTAS_CXC[index].fCobro = fechaCobro;
        MOCK_CUENTAS_CXC[index].cobrado = MOCK_CUENTAS_CXC[index].total;
        MOCK_CUENTAS_CXC[index].saldo = 0;
        MOCK_CUENTAS_CXC[index].estatus = 'cobrada';
      }
    });
    return {
      success: true,
      message: `${ids.length} facturas marcadas como cobradas`,
    };
  },

  // Estadísticas
  getStats: (cuentas: CuentaCxc[]): CxcStats => {
    const totalCuentas = cuentas.length;
    const cobradas = cuentas.filter(c => c.estatus === 'cobrada').length;
    const pendientes = cuentas.filter(c => c.estatus === 'por cobrar').length;
    const vencidas = cuentas.filter(c => c.estatus === 'vencida').length;
    const porCobrar = cuentas.reduce((sum, c) => sum + c.saldo, 0);
    
    return {
      cobroSemanalPromedio: 823545,
      porCobrar,
      clientes: 'PF (propio) + terceros',
      facturaNace: 'del corte de servicios',
      totalFacturas: totalCuentas,
      cobradas,
      pendientes,
      vencidas,
    };
  },

  // Opciones para filtros
  getOptions: () => ({
    clientes: ['Todos', 'Cliente brócoli', 'Produce First'],
    servicios: ['Todos', 'Cooling', 'Hielo', 'Embolsado'],
    estatus: ['Por cobrar', 'Vencidas', 'Cobradas'],
  }),
};