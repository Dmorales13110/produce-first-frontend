// services/payrollService.ts

import type {
  Empleado,
  AsistenciaDia,
  BoletaDestajo,
  TrabajadorDestajo,
  NominaSemanal,
  PayrollStats,
} from '../../types';

// Mock data - Plantilla
const MOCK_EMPLEADOS: Empleado[] = [
  { id: 1, nombre: 'Jefe de planta', puesto: 'Supervisor', tipo: 'Fijo', sueldo: '$4,800', expediente: true, estado: 'activo', turno: '13:00–01:00' },
  { id: 2, nombre: 'Operador túnel A', puesto: 'Técnico', tipo: 'Fijo', sueldo: '$3,200', expediente: true, estado: 'activo', turno: '13:00–01:00' },
  { id: 3, nombre: 'Operador túnel B', puesto: 'Técnico', tipo: 'Fijo', sueldo: '$3,200', expediente: true, estado: 'activo', turno: '13:00–01:00' },
  { id: 4, nombre: 'Montacarguistas (2)', puesto: 'Operador', tipo: 'Fijo', sueldo: '$2,900 c/u', expediente: true, estado: 'activo', turno: '13:00–01:00' },
  { id: 5, nombre: 'Báscula / recepción', puesto: 'Captura', tipo: 'Fijo', sueldo: '$2,600', expediente: true, estado: 'activo', turno: '14:00–22:00' },
  { id: 6, nombre: 'Línea de repack (8)', puesto: 'Operador', tipo: 'Destajo + base', sueldo: '$1,680 + $0.30/cj', expediente: true, estado: 'activo', turno: '14:00–22:00' },
  { id: 7, nombre: 'Limpieza y apoyo (9)', puesto: 'Operador', tipo: 'Fijo', sueldo: '$2,000 c/u', expediente: true, estado: 'activo', turno: '14:00–22:00' },
];

// Mock data - Trabajadores destajo
const MOCK_TRABAJADORES_DESTAJO: TrabajadorDestajo[] = [
  { id: 1, nombre: 'Línea 1 · María T.', cajas: 212 },
  { id: 2, nombre: 'Línea 1 · Josefina R.', cajas: 198 },
  { id: 3, nombre: 'Línea 2 · Pedro L.', cajas: 186 },
  { id: 4, nombre: '+ 5 más...', cajas: 748 },
];

// Mock data - Asistencia
const MOCK_ASISTENCIA: AsistenciaDia[] = [
  { empleadoId: 1, presente: true, horasExtra: 0 },
  { empleadoId: 2, presente: true, horasExtra: 2 },
  { empleadoId: 3, presente: true, horasExtra: 0 },
  { empleadoId: 4, presente: true, horasExtra: 0 },
  { empleadoId: 5, presente: true, horasExtra: 0 },
  { empleadoId: 6, presente: true, horasExtra: 0 },
  { empleadoId: 7, presente: true, horasExtra: 0 },
];

// Mock data - Nómina semanal
const MOCK_NOMINA: NominaSemanal = {
  semana: 'S48',
  sueldosFijos: 63560,
  horasExtra: 4860,
  destajo: 4860,
  total: 73280,
};

export const payrollService = {
  // Empleados
  getEmpleados: (filters?: { puesto?: string; estatus?: string }): Empleado[] => {
    let data = [...MOCK_EMPLEADOS];

    if (filters?.puesto && filters.puesto !== 'Todos') {
      data = data.filter(e => e.puesto === filters.puesto);
    }
    if (filters?.estatus === 'Activos') {
      data = data.filter(e => e.estado === 'activo');
    }

    return data;
  },

  addEmpleado: (data: Partial<Empleado>): Empleado => {
    const nuevo: Empleado = {
      id: MOCK_EMPLEADOS.length + 1,
      nombre: data.nombre || 'Nuevo empleado',
      puesto: data.puesto || 'Operador',
      tipo: data.tipo || 'Fijo',
      sueldo: data.sueldo || '$0',
      expediente: false,
      estado: 'activo',
      turno: data.turno || '08:00–16:00',
    };
    MOCK_EMPLEADOS.push(nuevo);
    return nuevo;
  },

  // Asistencia
  getAsistencia: (): AsistenciaDia[] => [...MOCK_ASISTENCIA],
  
  saveAsistencia: (data: AsistenciaDia[]): { success: boolean; message: string } => {
    MOCK_ASISTENCIA.length = 0;
    MOCK_ASISTENCIA.push(...data);
    return {
      success: true,
      message: 'Asistencia guardada correctamente',
    };
  },

  // Boleta destajo
  getBoletaDestajo: (): BoletaDestajo => {
    return {
      id: 1,
      folio: 'RPK-0412',
      fecha: '26-nov',
      producto: 'Brócoli re-empacado',
      tarifa: 0.30,
      trabajadores: [...MOCK_TRABAJADORES_DESTAJO],
    };
  },

  updateBoletaDestajo: (trabajadores: TrabajadorDestajo[]): { success: boolean; message: string } => {
    MOCK_TRABAJADORES_DESTAJO.length = 0;
    MOCK_TRABAJADORES_DESTAJO.push(...trabajadores);
    return {
      success: true,
      message: 'Boleta de destajo actualizada',
    };
  },

  // Nómina semanal
  getNominaSemanal: (): NominaSemanal => ({ ...MOCK_NOMINA }),

  // Estadísticas
  getStats: (): PayrollStats => {
    return {
      totalEmpleados: MOCK_EMPLEADOS.filter(e => e.estado === 'activo').length,
      totalNomina: 1577651,
      destajoTarifa: 0.30,
      nominaSemana: `$${MOCK_NOMINA.total.toLocaleString()}`,
    };
  },
};