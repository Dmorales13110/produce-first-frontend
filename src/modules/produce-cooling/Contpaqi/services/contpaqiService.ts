// services/contpaqiService.ts

import type {
  EquivalenciaContpaqi,
  PaqueteExportacion,
  ContpaqiStats,
} from '../../types';

// Mock data - Equivalencias
const MOCK_EQUIVALENCIAS: EquivalenciaContpaqi[] = [
  { id: 1, categoria: 'ENERGÍA - HIELO PROPIO', cuenta: '600-021-000', nombre: 'Energía de producción de hielo', tipo: 'Costo' },
  { id: 2, categoria: 'RENTA', cuenta: '602-001-000', nombre: 'Rentas de inmuebles', tipo: 'Gasto' },
  { id: 3, categoria: 'NÓMINA PLANTA', cuenta: '603-001-000', nombre: 'Sueldos y salarios', tipo: 'Gasto' },
  { id: 4, categoria: 'DESTAJO REPACK', cuenta: '603-004-000', nombre: 'Mano de obra a destajo', tipo: 'Costo' },
  { id: 5, categoria: 'MONTACARGAS', cuenta: '601-008-000', nombre: 'Renta de equipo', tipo: 'Gasto' },
  { id: 6, categoria: 'MANTENIMIENTO', cuenta: '601-002-000', nombre: 'Mantenimiento de planta', tipo: 'Gasto' },
  { id: 7, categoria: 'SANIDAD', cuenta: '601-014-000', nombre: 'Sanidad y control de plagas', tipo: 'Gasto' },
  { id: 8, categoria: 'INSUMOS', cuenta: '601-006-000', nombre: 'Consumibles de planta', tipo: 'Gasto' },
  { id: 9, categoria: 'ADMIN (seguro, contador, legal)', cuenta: '601-001-000', nombre: 'Gastos de administración', tipo: 'Gasto' },
];

// Mock data - Paquetes de exportación
const MOCK_PAQUETES: PaqueteExportacion[] = [
  { paquete: 'Egresos + IVA', contenido: '48 facturas clasificadas', estado: 'por 2 facturas', color: 'yellow' },
  { paquete: 'Ingresos (CFDI de servicios)', contenido: '8 facturas de PC-CXC', estado: 'listo', color: 'blue' },
  { paquete: 'Nómina + destajo', contenido: '4 semanas + boletas repack', estado: 'listo', color: 'blue' },
];

export const contpaqiService = {
  // Equivalencias
  getEquivalencias: (): EquivalenciaContpaqi[] => [...MOCK_EQUIVALENCIAS],
  
  updateEquivalencia: (id: number, cuenta: string): EquivalenciaContpaqi | null => {
    const index = MOCK_EQUIVALENCIAS.findIndex(e => e.id === id);
    if (index === -1) return null;
    MOCK_EQUIVALENCIAS[index] = { ...MOCK_EQUIVALENCIAS[index], cuenta };
    return MOCK_EQUIVALENCIAS[index];
  },

  // Paquetes
  getPaquetes: (): PaqueteExportacion[] => [...MOCK_PAQUETES],
  
  exportarPaquete: (paquete: string): { success: boolean; message: string } => {
    console.log(`Exportando paquete: ${paquete}`);
    return {
      success: true,
      message: `Paquete "${paquete}" exportado correctamente`,
    };
  },

  // Estadísticas
  getStats: (): ContpaqiStats => {
    const equivalencias = MOCK_EQUIVALENCIAS;
    const paquetes = MOCK_PAQUETES;
    const pendientes = paquetes.filter(p => p.estado === 'por 2 facturas').length;
    
    return {
      totalCategorias: equivalencias.length,
      ivaAcreditable: 68400,
      paqueteProgreso: '96%',
      paqueteEstado: pendientes > 0 ? 'Pendiente' : 'Listo',
      facturasPendientes: 2,
    };
  },
};