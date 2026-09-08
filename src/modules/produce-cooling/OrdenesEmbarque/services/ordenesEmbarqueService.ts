// services/ordenesEmbarqueService.ts

import type {
  CargaItem,
  ProformaItem,
  OrdenEmbarque,
  OrdenesEmbarqueStats,
} from '../../types';

// Mock data - Cargas
const MOCK_CARGAS: CargaItem[] = [
  { id: 1, checked: true, folio: 'DV-2725', producto: 'Shanghai Bok', instruido: 540, real: 540 },
  { id: 2, checked: true, folio: 'ZER-118', producto: 'Coliflor', instruido: 280, real: 280 },
  { id: 3, checked: true, folio: 'JAV-0512', producto: 'Choy Mieu', instruido: 176, real: 176 },
  { id: 4, checked: false, folio: 'DV-2721', producto: 'Baby Bok', instruido: 390, real: '' },
  { id: 5, checked: false, folio: 'DV-2718', producto: 'Baby Bok', instruido: 60, real: '' },
];

// Mock data - Proformas
const MOCK_PROFORMAS: ProformaItem[] = [
  { producto: 'Shanghai Bok Choy', instruido: 540, folio: 'DV-2725', disp: 584, alcanza: 'ok' },
  { producto: 'Coliflor', instruido: 280, folio: 'ZER-118', disp: 280, alcanza: 'justo' },
  { producto: 'Choy Mieu', instruido: 176, folio: 'JAV-0512', disp: 176, alcanza: 'justo' },
  { producto: 'Baby Bok Choy', instruido: '390 + 60', folio: 'DV-2721 + DV-2718', disp: '390 + 74', alcanza: 'ok' },
];

// Mock data - Órdenes
const MOCK_ORDENES: OrdenEmbarque[] = [
  { proforma: 'PRF-0147', cliente: 'Fresh Direct', salida: '28-nov', cajas: '1,446', aceptada: '—', confirmada: '—', estatus: 'por aceptar', color: 'blue' },
  { proforma: 'PRF-0146', cliente: 'GreenLeaf', salida: '27-nov', cajas: '1,280', aceptada: '✓ 14:05', confirmada: 'en carga', estatus: 'cargando', color: 'amber' },
  { proforma: 'PRF-0145', cliente: 'Grubmarket', salida: '26-nov', cajas: '990', aceptada: '✓', confirmada: '✓ 17:40', estatus: 'confirmada', color: 'teal' },
];

export const ordenesEmbarqueService = {
  // Cargas
  getCargas: (): CargaItem[] => [...MOCK_CARGAS],
  
  updateCarga: (id: number, data: Partial<CargaItem>): CargaItem | null => {
    const index = MOCK_CARGAS.findIndex(c => c.id === id);
    if (index === -1) return null;
    MOCK_CARGAS[index] = { ...MOCK_CARGAS[index], ...data };
    return MOCK_CARGAS[index];
  },

  toggleCarga: (id: number): CargaItem | null => {
    const index = MOCK_CARGAS.findIndex(c => c.id === id);
    if (index === -1) return null;
    MOCK_CARGAS[index].checked = !MOCK_CARGAS[index].checked;
    if (!MOCK_CARGAS[index].checked) {
      MOCK_CARGAS[index].real = '';
    } else {
      MOCK_CARGAS[index].real = MOCK_CARGAS[index].instruido;
    }
    return MOCK_CARGAS[index];
  },

  // Proformas
  getProformas: (): ProformaItem[] => [...MOCK_PROFORMAS],
  
  aceptarProforma: (): { success: boolean; message: string } => {
    return {
      success: true,
      message: 'Proforma aceptada correctamente · enviada a piso de carga',
    };
  },

  // Órdenes
  getOrdenes: (filters?: { cliente?: string; estatus?: string; rango?: string }): OrdenEmbarque[] => {
    let data = [...MOCK_ORDENES];

    if (filters?.cliente && filters.cliente !== 'Todos') {
      data = data.filter(o => o.cliente === filters.cliente);
    }
    if (filters?.estatus && filters.estatus !== 'Todas') {
      data = data.filter(o => o.estatus === filters.estatus);
    }

    return data;
  },

  confirmarCarga: (data: {
    cargas: CargaItem[];
    temperatura: number;
    sello: string;
    horaSalida: string;
  }): { success: boolean; message: string } => {
    console.log('Confirmando carga:', data);
    return {
      success: true,
      message: 'Carga confirmada · inventario actualizado · factura liberada',
    };
  },

  // Estadísticas
  getStats: (): OrdenesEmbarqueStats => {
    const cargas = MOCK_CARGAS;
    const ordenes = MOCK_ORDENES;
    
    return {
      bandejaHoy: 2,
      porAceptar: ordenes.filter(o => o.estatus === 'por aceptar').length,
      enCarga: ordenes.filter(o => o.estatus === 'cargando').length,
      confirmadasHoy: 1,
      cajasConfirmadas: 990,
      diferencias: 1,
      proformasPendientes: ordenes.filter(o => o.estatus === 'por aceptar' || o.estatus === 'cargando').length,
    };
  },

  // Opciones para filtros
  getOptions: () => ({
    clientes: ['Todos', 'Fresh Direct', 'GreenLeaf', 'Grubmarket'],
    estatus: ['Todas', 'por aceptar', 'cargando', 'confirmada'],
    rangos: ['Hoy', 'Semana'],
  }),
};