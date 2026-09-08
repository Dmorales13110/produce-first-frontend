// services/bitacorasVentasServiciosService.ts

import type {
  VacioRecord,
  HieloRecord,
  EnhieladoRecord,
  RepackRecord,
  VentaServicioRecord,
  TemperaturaData,
  BitacorasStats,
} from '../../types';

// Mock data - Vacío
const MOCK_VACIO: VacioRecord[] = [
  { ciclo: 14, folios: 'DV-2725 - ZER-11B', tarimas: 12, entrada: '15:42', tEntrada: 22.1, salida: '16:10', tSalida: 3.4, operador: 'Túnel A' },
  { ciclo: 13, folios: 'DV-2724', tarimas: 10, entrada: '14:58', tEntrada: 20.8, salida: '15:26', tSalida: 3.1, operador: 'Túnel A' },
  { ciclo: 12, folios: 'JAV-0512 - FER-224', tarimas: 12, entrada: '14:10', tEntrada: 21.6, salida: '14:39', tSalida: 2.9, operador: 'Túnel B' },
  { ciclo: 11, folios: 'DV-2723 - TER-001', tarimas: 8, entrada: '13:20', tEntrada: 22.4, salida: '13:48', tSalida: 3.0, operador: 'Túnel B' },
  { ciclo: 10, folios: 'ZER-118', tarimas: 6, entrada: '12:15', tEntrada: 21.2, salida: '12:43', tSalida: 3.2, operador: 'Túnel A' },
];

// Mock data - Hielo
const MOCK_HIELO: HieloRecord[] = [
  { fecha: '26-nov', m25: 11.8, m10: 4.4, total: 16.2, cajas: '1,980', kgCaja: 8.2, estado: 'ok', color: 'teal' },
  { fecha: '25-nov', m25: 12.1, m10: 4.7, total: 16.8, cajas: '2,040', kgCaja: 8.2, estado: 'ok', color: 'teal' },
  { fecha: '24-nov', m24: 8.2, m10: 4.1, total: 12.3, cajas: '1,490', kgCaja: 8.3, estado: '25t: paro 3h', color: 'amber' },
  { fecha: '23-nov', m25: 10.5, m10: 3.8, total: 14.3, cajas: '1,720', kgCaja: 8.3, estado: 'ok', color: 'teal' },
];

// Mock data - Enhielado
const MOCK_ENHIELADO: EnhieladoRecord[] = [
  { hora: '16:20', folio: 'ZER-11B', producto: 'Coliflor', tarimas: 8, hieloKg: 22, responsable: 'Inyector' },
  { hora: '15:05', folio: 'TER-BR-04', producto: 'Brócoli (tercero)', tarimas: 22, hieloKg: 24, responsable: 'Inyector' },
  { hora: '13:40', folio: 'JAV-0512', producto: 'Choy Mieu', tarimas: 8, hieloKg: 20, responsable: 'Manual - inyector en falla' },
  { hora: '12:10', folio: 'DV-2725', producto: 'Shanghai Bok', tarimas: 12, hieloKg: 21, responsable: 'Inyector' },
];

// Mock data - Repack
const MOCK_REPACK: RepackRecord[] = [
  { linea: 'Línea 1', folio: 'TER-BR-04 Brócoli', cajas: 448, turno: 'vespertino' },
  { linea: 'Línea 2', folio: 'ZER-11B Coliflor', cajas: 320, turno: 'matutino' },
  { linea: 'Línea 3', folio: 'DV-2725 Shanghai', cajas: 280, turno: 'vespertino' },
];

// Mock data - Ventas de Servicios
const MOCK_VENTAS_SERVICIOS: VentaServicioRecord[] = [
  { producto: 'Baby napa', enfriadas: 2520, servicio: 2520, hielo: 0, repack: 0, total: 2520, pagado: 452, pendiente: 2068 },
  { producto: 'Coliflor', enfriadas: 5964, servicio: 5964, hielo: 0, repack: 0, total: 5964, pagado: 1070, pendiente: 4894 },
  { producto: 'Celtuce', enfriadas: 6840, servicio: 6840, hielo: 0, repack: 0, total: 6840, pagado: 1226, pendiente: 5614 },
  { producto: 'Brócoli (tercero)', enfriadas: 11200, servicio: 11200, hielo: 12096, repack: 470, total: 23766, pagado: 11190, pendiente: 12576 },
];

// Mock data - Temperaturas
const MOCK_TEMPERATURAS: TemperaturaData[] = [
  { ciclo: 'C8', tEntrada: 21.5, tSalida: 3.2 },
  { ciclo: 'C9', tEntrada: 22.0, tSalida: 3.4 },
  { ciclo: 'C10', tEntrada: 22.4, tSalida: 3.8 },
  { ciclo: 'C11', tEntrada: 21.2, tSalida: 3.0 },
  { ciclo: 'C12', tEntrada: 21.6, tSalida: 2.9 },
  { ciclo: 'C13', tEntrada: 20.8, tSalida: 3.1 },
  { ciclo: 'C14', tEntrada: 22.1, tSalida: 3.4 },
];

export const bitacorasVentasServiciosService = {
  // Vacío
  getVacio: (): VacioRecord[] => [...MOCK_VACIO],
  
  saveVacio: (data: Partial<VacioRecord>): VacioRecord => {
    const nuevoCiclo = {
      ciclo: MOCK_VACIO.length + 1,
      folios: data.folios || 'Nuevo ciclo',
      tarimas: data.tarimas || 0,
      entrada: data.entrada || new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      tEntrada: data.tEntrada || 0,
      salida: data.salida || '',
      tSalida: data.tSalida || 0,
      operador: data.operador || 'Sin asignar',
    };
    MOCK_VACIO.unshift(nuevoCiclo);
    return nuevoCiclo;
  },

  // Hielo
  getHielo: (): HieloRecord[] => [...MOCK_HIELO],
  
  saveHielo: (data: Partial<HieloRecord>): HieloRecord => {
    const nuevoRegistro = {
      fecha: data.fecha || new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
      m25: data.m25,
      m10: data.m10 || 0,
      total: (data.m25 || 0) + (data.m10 || 0),
      cajas: data.cajas || '0',
      kgCaja: data.kgCaja || 0,
      estado: data.estado || 'ok',
      color: data.color || 'teal',
    };
    MOCK_HIELO.unshift(nuevoRegistro);
    return nuevoRegistro;
  },

  // Enhielado
  getEnhielado: (): EnhieladoRecord[] => [...MOCK_ENHIELADO],
  
  saveEnhielado: (data: Partial<EnhieladoRecord>): EnhieladoRecord => {
    const nuevoRegistro = {
      hora: data.hora || new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      folio: data.folio || 'Nuevo folio',
      producto: data.producto || 'Sin producto',
      tarimas: data.tarimas || 0,
      hieloKg: data.hieloKg || 0,
      responsable: data.responsable || 'Sin asignar',
    };
    MOCK_ENHIELADO.unshift(nuevoRegistro);
    return nuevoRegistro;
  },

  // Repack
  getRepack: (): RepackRecord[] => [...MOCK_REPACK],
  
  saveRepack: (data: Partial<RepackRecord>): RepackRecord => {
    const nuevoRegistro = {
      linea: data.linea || 'Línea 1',
      folio: data.folio || 'Nuevo folio',
      cajas: data.cajas || 0,
      turno: data.turno || 'matutino',
    };
    MOCK_REPACK.unshift(nuevoRegistro);
    return nuevoRegistro;
  },

  // Ventas de Servicios
  getVentasServicios: (filters?: { rango?: string; cliente?: string; servicio?: string }): VentaServicioRecord[] => {
    let data = [...MOCK_VENTAS_SERVICIOS];
    
    if (filters?.rango === 'Semana') {
      // Mock: devolver todos por ahora
    }
    if (filters?.rango === 'Corte del mes') {
      // Mock: devolver todos por ahora
    }
    
    return data;
  },

  // Temperaturas
  getTemperaturas: (): TemperaturaData[] => [...MOCK_TEMPERATURAS],

  // Estadísticas
  getStats: (): BitacorasStats => {
    const ultimoVacio = MOCK_VACIO[0];
    const ultimoHielo = MOCK_HIELO[0];
    const totalVentas = MOCK_VENTAS_SERVICIOS.reduce((sum, v) => sum + v.total, 0);
    const totalPagado = MOCK_VENTAS_SERVICIOS.reduce((sum, v) => sum + v.pagado, 0);
    const totalPendiente = MOCK_VENTAS_SERVICIOS.reduce((sum, v) => sum + v.pendiente, 0);

    return {
      ciclosHoy: MOCK_VACIO.length,
      tempEntradaPromedio: MOCK_VACIO.reduce((sum, v) => sum + v.tEntrada, 0) / MOCK_VACIO.length,
      tempSalidaPromedio: MOCK_VACIO.reduce((sum, v) => sum + v.tSalida, 0) / MOCK_VACIO.length,
      hieloProducido: ultimoHielo?.total || 0,
      hieloMeta: 17.5,
      pendienteCobro: totalPendiente,
      totalServicios: totalVentas,
      totalPagado: totalPagado,
    };
  },

  // Opciones para filtros
  getOptions: () => ({
    lineas: ['Línea 1', 'Línea 2', 'Línea 3'],
    turnos: ['matutino', 'vespertino', 'nocturno'],
    operadores: ['Túnel A', 'Túnel B'],
    clientes: ['Todos', 'Daily Veggies', 'Agrícola JAV', 'Fernando García'],
    servicios: ['Todos', 'Enfriamiento', 'Hielo', 'Repack'],
    rangos: ['Hoy', 'Semana', 'Corte del mes'],
  }),
};