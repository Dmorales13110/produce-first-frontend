// services/maintenanceService.ts

import type {
  Equipo,
  EventoEquipo,
  MaintenanceStats,
} from '../../types';

// Mock data - Equipos
const MOCK_EQUIPOS: Equipo[] = [
  { 
    id: 1,
    nombre: 'Túnel de vacío', 
    capNominal: '12 tarimas/ciclo', 
    rendReal: '13 ciclos/día prom.', 
    ultServicio: 'pre-temporada ($270,000)', 
    costoMto: 278400, 
    estado: 'operando', 
    editable: false,
    lectura: '13 ciclos/día',
  },
  { 
    id: 2,
    nombre: 'Máquina de hielo 25 t', 
    capNominal: '25 t/día', 
    rendReal: '12.5 t/día', 
    ultServicio: '18-nov', 
    costoMto: 22400, 
    estado: 'operando', 
    editable: true,
    lectura: '12.5 t',
  },
  { 
    id: 3,
    nombre: 'Máquina de hielo 10 t', 
    capNominal: '10 t/día', 
    rendReal: '5.0 t/día', 
    ultServicio: '18-nov', 
    costoMto: 9800, 
    estado: 'operando', 
    editable: true,
    lectura: '5.0 t',
  },
  { 
    id: 4,
    nombre: 'Inyector de hielo', 
    capNominal: '—', 
    rendReal: '—', 
    ultServicio: '20-nov', 
    costoMto: 61200, 
    estado: 'en falla', 
    editable: false,
    lectura: 'en falla · refacción jue',
  },
  { 
    id: 5,
    nombre: 'Cuarto frío', 
    capNominal: '168 tarimas', 
    rendReal: '2.8 °C prom.', 
    ultServicio: 'preventivo nov', 
    costoMto: 18900, 
    estado: 'operando', 
    editable: false,
    lectura: '2.8 °C',
  },
  { 
    id: 6,
    nombre: 'Líneas de banda 1 · 2 · 3', 
    capNominal: '3 líneas repack', 
    rendReal: '1,344 cj/día prom.', 
    ultServicio: 'oct', 
    costoMto: 7200, 
    estado: 'operando', 
    editable: false,
    lectura: '1,344 cj',
  },
  { 
    id: 7,
    nombre: 'Montacargas 1 y 2 (renta)', 
    capNominal: '—', 
    rendReal: '—', 
    ultServicio: 'incluido en renta', 
    costoMto: 0, 
    estado: 'operando', 
    editable: false,
    lectura: '—',
  },
];

// Mock data - Eventos
const MOCK_EVENTOS: EventoEquipo[] = [
  {
    id: 1,
    tipo: 'Servicio / reparación',
    equipo: 'Inyector de hielo',
    descripcion: 'cambio de boquillas',
    costo: '$8,400 · F-0914',
    lectura: '4.2 t ayer',
    reporto: 'Operador túnel',
    fecha: '26-nov',
  },
];

export const maintenanceService = {
  // Equipos
  getEquipos: (filters?: { equipo?: string; estado?: string }): Equipo[] => {
    let data = [...MOCK_EQUIPOS];

    if (filters?.equipo && filters.equipo !== 'Todos') {
      data = data.filter(e => {
        if (filters.equipo === 'Máquinas de hielo') {
          return e.nombre.includes('Máquina de hielo');
        }
        return e.nombre.includes(filters.equipo);
      });
    }
    if (filters?.estado === 'Operando') {
      data = data.filter(e => e.estado === 'operando');
    }
    if (filters?.estado === 'En falla') {
      data = data.filter(e => e.estado === 'en falla');
    }

    return data;
  },

  updateEquipo: (id: number, rendReal: string): Equipo | null => {
    const index = MOCK_EQUIPOS.findIndex(e => e.id === id);
    if (index === -1) return null;
    MOCK_EQUIPOS[index] = { ...MOCK_EQUIPOS[index], rendReal };
    return MOCK_EQUIPOS[index];
  },

  // Eventos
  getEventos: (): EventoEquipo[] => [...MOCK_EVENTOS],
  
  saveEvento: (data: Partial<EventoEquipo>): EventoEquipo => {
    const nuevo: EventoEquipo = {
      id: MOCK_EVENTOS.length + 1,
      tipo: data.tipo || 'Servicio / reparación',
      equipo: data.equipo || 'Equipo no especificado',
      descripcion: data.descripcion || '',
      costo: data.costo || '$0',
      lectura: data.lectura || '',
      reporto: data.reporto || 'Sin asignar',
      fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
    };
    MOCK_EVENTOS.unshift(nuevo);
    return nuevo;
  },

  // Estadísticas
  getStats: (): MaintenanceStats => {
    const equipos = MOCK_EQUIPOS;
    const total = equipos.length;
    const enFalla = equipos.filter(e => e.estado === 'en falla').length;
    const costoTotal = equipos.reduce((sum, e) => sum + e.costoMto, 0);
    
    return {
      totalEquipos: total,
      activos: equipos.filter(e => e.estado === 'operando').length,
      enFalla,
      hieloCapacidad: 17.5,
      hieloDemanda: 14.2,
      costoMtoMes: 61300,
      presupuestoMto: 50000,
    };
  },

  // Datos para gráfico de restricción
  getRestriccionData: () => {
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const capacidad = 17.5;
    const demanda = [14.2, 15.1, 16.8, 18.5, 13.5, 15.0];
    const capacidadData = dias.map(() => capacidad);
    
    return { dias, capacidad: capacidadData, demanda };
  },
};