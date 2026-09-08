// types/index.ts

export interface ReceptionRecord {
  id: string;
  time: string;
  folio: string;
  producer: string;
  product: string;
  invoiceBoxes: number;
  receivedBoxes: number;
  delta: number;
  coldRoomPosition: string;
  temperature?: number;
  pallets?: number;
  status: 'completed' | 'pending' | 'discrepancy';
}

export interface FolioDetail {
  folio: string;
  producer: string;
  producerId: string;
  product: string;
  productId: string;
  invoiceBoxes: number;
  sectors: string;
  crew: string;
  temperature?: number;
  coldRoomPosition?: string;
  pallets?: number;
  receivedBoxes?: number;
}

export interface ManualCaptureData {
  producer: string;
  vegetable: string;
  pallets: number;
  boxesPerPallet: number;
  temperature: number;
  coldRoomPosition: string;
  generatedFolio: string;
}

export interface ReceptionFilters {
  producer?: string;
  product?: string;
  dateRange?: 'today' | 'week' | 'month';
}

// Mock Data
export const MOCK_RECEPTIONS: ReceptionRecord[] = [
  { 
    id: '1',
    time: '14:20', 
    folio: 'DV-2725', 
    producer: 'Daily Veggies', 
    product: 'Shanghai Bok Choy', 
    invoiceBoxes: 584, 
    receivedBoxes: 584, 
    delta: 0, 
    coldRoomPosition: 'Fila A-3', 
    temperature: 12.4, 
    pallets: 13,
    status: 'completed'
  },
  { 
    id: '2',
    time: '12:05', 
    folio: 'DV-2724', 
    producer: 'Daily Veggies', 
    product: 'Baby Napa', 
    invoiceBoxes: 730, 
    receivedBoxes: 730, 
    delta: 0, 
    coldRoomPosition: 'Fila B-1', 
    temperature: 11.8, 
    pallets: 16,
    status: 'completed'
  },
  { 
    id: '3',
    time: '11:10', 
    folio: 'JAV-0512', 
    producer: 'Agrícola JAV', 
    product: 'Choy Mieu', 
    invoiceBoxes: 450, 
    receivedBoxes: 446, 
    delta: -4, 
    coldRoomPosition: 'Fila A-3', 
    temperature: 13.2, 
    pallets: 10,
    status: 'discrepancy'
  },
  { 
    id: '4',
    time: '09:30', 
    folio: 'ZER-118', 
    producer: 'Daniel Zermeño', 
    product: 'Coliflor', 
    invoiceBoxes: 840, 
    receivedBoxes: 840, 
    delta: 0, 
    coldRoomPosition: 'Fila C-2', 
    temperature: 10.5, 
    pallets: 20,
    status: 'completed'
  },
];

export const MOCK_FOLIO_DETAIL: FolioDetail = {
  folio: 'DV-2725',
  producer: 'Daily Veggies',
  producerId: 'DV-001',
  product: 'Shanghai Bok Choy',
  productId: 'PROD-001',
  invoiceBoxes: 584,
  sectors: '3b-1 (405) + 5a-2 (179) · con postura y variedad',
  crew: 'San Antonio',
};

export const EXTERNAL_PRODUCERS = [
  'Daniel Zermeño',
  'Fernando',
  'Earth Feed',
  'Terceros'
];

export const AVAILABLE_VEGETABLES = [
  'Coliflor',
  'Brocoli',
  'Celery',
  'Lechuga',
  'Shanghai Bok Choy',
  'Baby Napa',
  'Choy Mieu'
];

export const COLD_ROOM_POSITIONS = [
  'Fila A-1',
  'Fila A-2',
  'Fila A-3',
  'Fila B-1',
  'Fila B-2',
  'Fila C-1',
  'Fila C-2',
];

export interface TrazabilidadRecord {
  fecha: string;
  folio: string;
  productor: string;
  vegetal: string;
  recibidas: number;
  ventas: {
    folio: string;
    cajas: number | null;
  }[];
  saldo: number;
}

export interface KardexRecord {
  fecha: string;
  movimiento: string;
  productos: {
    nombre: string;
    tc?: string;
    cajas: string;
  }[];
}

export interface OcupacionItem {
  producto: string;
  tarimas: number;
  porcentaje: number;
}

export interface TrazabilidadStats {
  totalTarimas: number;
  tarimasOcupadas: number;
  tarimasLibres: number;
  porcentajeOcupacion: number;
  totalCajas: number;
  foliosVivos: number;
  diasPromedio: number;
}

export interface VacioRecord {
  ciclo: number;
  folios: string;
  tarimas: number;
  entrada: string;
  tEntrada: number;
  salida: string;
  tSalida: number;
  operador: string;
}

export interface HieloRecord {
  fecha: string;
  m25?: number;
  m24?: number;
  m10: number;
  total: number;
  cajas: string;
  kgCaja: number;
  estado: string;
  color: string;
}

export interface EnhieladoRecord {
  hora: string;
  folio: string;
  producto: string;
  tarimas: number;
  hieloKg: number;
  responsable: string;
}

export interface RepackRecord {
  linea: string;
  folio: string;
  cajas: number;
  turno: string;
}

export interface VentaServicioRecord {
  producto: string;
  enfriadas: number;
  servicio: number;
  hielo: number;
  repack: number;
  total: number;
  pagado: number;
  pendiente: number;
}

export interface TemperaturaData {
  ciclo: string;
  tEntrada: number;
  tSalida: number;
}

export interface BitacorasStats {
  ciclosHoy: number;
  tempEntradaPromedio: number;
  tempSalidaPromedio: number;
  hieloProducido: number;
  hieloMeta: number;
  pendienteCobro: number;
  totalServicios: number;
  totalPagado: number;
}
export interface CargaItem {
  id: number;
  checked: boolean;
  folio: string;
  producto: string;
  instruido: number;
  real: number | string;
}

export interface ProformaItem {
  producto: string;
  instruido: string | number;
  folio: string;
  disp: string | number;
  alcanza: 'ok' | 'justo' | 'insuficiente';
}

export interface OrdenEmbarque {
  proforma: string;
  cliente: string;
  salida: string;
  cajas: string;
  aceptada: string;
  confirmada: string;
  estatus: 'por aceptar' | 'cargando' | 'confirmada';
  color: string;
}

export interface OrdenesEmbarqueStats {
  bandejaHoy: number;
  porAceptar: number;
  enCarga: number;
  confirmadasHoy: number;
  cajasConfirmadas: number;
  diferencias: number;
  proformasPendientes: number;
}

export interface PartidaOC {
  id: number;
  concepto: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
}

export interface OrdenCompraPC {
  id: string;
  noOC: string;
  proveedor: string;
  categoria: string;
  entregaRequerida: string;
  destino: string;
  partidas: PartidaOC[];
  total: number;
  estatus: 'borrador' | 'autorizada' | 'recibida' | 'facturada' | 'conciliada';
  cxp: string;
  fechaCreacion: string;
}

export interface OrdenCompraPCStats {
  totalOCs: number;
  abiertas: number;
  recibidas: number;
  totalComprometido: number;
  conciliadas: number;
  urgentes: number;
}
export interface ProveedorPC {
  id: number;
  proveedor: string;
  tipo: string;
  condiciones: string;
  credito: number;
  leadTime: string;
  gasto: string;
  isActive: boolean;
}

export interface ProductoPC {
  id: number;
  sku: string;
  producto: string;
  unidad: string;
  proveedor: string;
  ultPrecio: string;
  min: number;
  max: number;
  isActive: boolean;
}

export interface CatalogosPCStats {
  totalProveedores: number;
  proveedoresActivos: number;
  totalProductos: number;
  productosActivos: number;
  proveedorEstrella: string;
  gastoEstrella: string;
  peculiaridad: string;
}

export interface TarifasPC {
  coolingPropias: number;
  coolingTerceros: number;
  hieloAllIn: number;
  pctHieloCasa: number;
  costoHieloPropio: number;
  costoHieloComprado: number;
  servicioMaquinas: number;
  capacidadProd: number;
  repackIngreso: number;
  repackDestajo: number;
  tcMxnUsd: number;
  mesesOperando: number;
}

export interface VolumenPresupuestado {
  fuente: string;
  cajas: number;
  conHielo: number;
  nota: string;
  isTotal?: boolean;
  isDestacado?: boolean;
}

export interface CostoPC {
  key: string;
  label: string;
  base: string;
  valor: number;
}

export interface ResultadoPlan {
  concepto: string;
  monto: number;
  tipo: 'ingreso' | 'costo' | 'utilidad';
  destacado?: boolean;
}

export interface CapitalArranque {
  concepto: string;
  monto: number;
  cuando: string;
}

export interface PresupuestoPCStats {
  totalIngresos: number;
  totalCostos: number;
  utilidad: number;
  margen: number;
  puntoEquilibrio: string;
  capitalArranque: number;
  hieloBlended: number;
}
export interface FacturaSAT {
  id: string;
  factura: string;
  proveedor: string;
  concepto: string;
  monto: number;
  categoria: string;
  oc: string;
  conciliada: boolean;
}

export interface CuentaCxp {
  id: number;
  fFactura: string;
  proveedor: string;
  concepto: string;
  totalMXN: number;
  pagado: number;
  saldo: number;
  credito: string;
  vence: string;
  fPago: string;
  estatus: 'sin vencer' | 'por vencer' | 'vencida' | 'pagada';
  colorEstatus: string;
}

export interface FlujoVencimiento {
  semana: string;
  monto: number;
  tipo: 'planta' | 'renta';
}

export interface CxpSATStats {
  saldoPorPagar: number;
  rentaMensual: number;
  pagoSemanalPromedio: number;
  totalFacturas: number;
  conciliadas: number;
  pendientes: number;
  vencidas: number;
}
export interface FacturaCxc {
  id: string;
  corte: string;
  cliente: string;
  contenido: string;
  importe: number;
  factura: string;
  emitida: boolean;
  tipo: 'propio' | 'terceros';
}

export interface CuentaCxc {
  id: number;
  fFactura: string;
  cliente: string;
  factura: string;
  concepto: string;
  total: number;
  cobrado: number;
  saldo: number;
  credito: string;
  vence: string;
  fCobro: string;
  estatus: 'por cobrar' | 'vencida' | 'cobrada';
}

export interface CxcStats {
  cobroSemanalPromedio: number;
  porCobrar: number;
  clientes: string;
  facturaNace: string;
  totalFacturas: number;
  cobradas: number;
  pendientes: number;
  vencidas: number;
}
export interface CashFlowRecord {
  semana: string;
  entradas: number;
  salidas: number;
  neto: number;
  nota: string;
}

export interface CashFlowStats {
  saldoCuenta: number;
  tcMxnUsd: number;
  entradaSemanal: number;
  salidaSemanal: number;
  rentaMensual: number;
  alerta15: string;
}

export interface CashFlowData {
  stats: CashFlowStats;
  flujo: CashFlowRecord[];
  saldoCorte: number;
}

export interface EquivalenciaContpaqi {
  id: number;
  categoria: string;
  cuenta: string;
  nombre: string;
  tipo: 'Costo' | 'Gasto' | 'Ingreso';
}

export interface PaqueteExportacion {
  paquete: string;
  contenido: string;
  estado: 'listo' | 'por 2 facturas' | 'pendiente';
  color: 'blue' | 'yellow' | 'green' | 'red';
}

export interface ContpaqiStats {
  totalCategorias: number;
  ivaAcreditable: number;
  paqueteProgreso: string;
  paqueteEstado: string;
  facturasPendientes: number;
}
export interface Empleado {
  id: number;
  nombre: string;
  puesto: string;
  tipo: 'Fijo' | 'Destajo + base' | 'Eventual';
  sueldo: string;
  expediente: boolean;
  estado: 'activo' | 'inactivo';
  turno?: string;
}

export interface AsistenciaDia {
  empleadoId: number;
  presente: boolean;
  horasExtra: number;
}

export interface BoletaDestajo {
  id: number;
  folio: string;
  fecha: string;
  producto: string;
  tarifa: number;
  trabajadores: TrabajadorDestajo[];
}

export interface TrabajadorDestajo {
  id: number;
  nombre: string;
  cajas: number;
}

export interface NominaSemanal {
  semana: string;
  sueldosFijos: number;
  horasExtra: number;
  destajo: number;
  total: number;
}

export interface PayrollStats {
  totalEmpleados: number;
  totalNomina: number;
  destajoTarifa: number;
  nominaSemana: string;
}
export interface Equipo {
  id: number;
  nombre: string;
  capNominal: string;
  rendReal: string;
  ultServicio: string;
  costoMto: number;
  estado: 'operando' | 'en falla' | 'mantenimiento';
  editable: boolean;
  lectura?: string;
}

export interface EventoEquipo {
  id: number;
  tipo: string;
  equipo: string;
  descripcion: string;
  costo: string;
  lectura: string;
  reporto: string;
  fecha: string;
}

export interface MaintenanceStats {
  totalEquipos: number;
  activos: number;
  enFalla: number;
  hieloCapacidad: number;
  hieloDemanda: number;
  costoMtoMes: number;
  presupuestoMto: number;
}
export interface UsuarioPC {
  id: number;
  usuario: string;
  rol: string;
  pantallas: string;
  pin: string;
  estado: 'activo' | 'inactivo';
  turno?: string;
}

export interface PermisoPC {
  id: string;
  nombre: string;
  descripcion: string;
  pantallas: string[];
}

export interface UsersPermissionsStats {
  totalUsuarios: number;
  activos: number;
  conPin: number;
  perfiles: number;
}