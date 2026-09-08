// services/presupuestoPCService.ts

import type {
  TarifasPC,
  VolumenPresupuestado,
  CostoPC,
  ResultadoPlan,
  CapitalArranque,
  PresupuestoPCStats,
} from '../../types';

// Mock data - Tarifas
const MOCK_TARIFAS: TarifasPC = {
  coolingPropias: 0.70,
  coolingTerceros: 1.00,
  hieloAllIn: 1.35,
  pctHieloCasa: 50,
  costoHieloPropio: 0.45,
  costoHieloComprado: 1.10,
  servicioMaquinas: 3000,
  capacidadProd: 17.5,
  repackIngreso: 0.35,
  repackDestajo: 0.30,
  tcMxnUsd: 17.50,
  mesesOperando: 5,
};

// Mock data - Volumen
const MOCK_VOLUMEN: VolumenPresupuestado[] = [
  { fuente: 'San Aparicio (plan grower)', cajas: 128238, conHielo: 0, nota: 'comprometido' },
  { fuente: 'La Escondida (plan grower)', cajas: 116243, conHielo: 0, nota: 'comprometido' },
  { fuente: 'Snow Pea Tips', cajas: 35280, conHielo: 0, nota: '~1,500/semana' },
  { fuente: 'Terceros - brócoli', cajas: 600000, conHielo: 288000, nota: '60% brócoli = 80% con hielo', isDestacado: true },
  { fuente: 'TOTAL', cajas: 879761, conHielo: 288000, nota: '', isTotal: true },
];

// Mock data - Costos
const MOCK_COSTOS: CostoPC[] = [
  { key: 'renta', label: 'Renta (compromiso 12 meses)', base: '$280,000/mes', valor: 2380000 },
  { key: 'nomina', label: 'Nómina de planta', base: 'real temporada pasada', valor: 1577651 },
  { key: 'finiquitos', label: 'Finiquitos fin de temporada', base: '1.5 meses por persona', valor: 287079 },
  { key: 'montacargas', label: 'Montacargas (2 renta) + batería', base: '$32,480/mes + $15,000', valor: 177400 },
  { key: 'mantenimiento', label: 'Mantenimiento planta (buffet)', base: '$50,000/mes', valor: 250000 },
  { key: 'tunelVacio', label: 'Túnel de vacío - pre-temporada', base: 'refrigerante, sellos', valor: 270000 },
  { key: 'servicioMaquinasHielo', label: 'Servicio máquinas de hielo', base: '$3,000 USD/mes × 5 meses', valor: 262500 },
  { key: 'hieloComprado', label: 'Hielo comprado (50% - 144,000 cj = $1.10)', base: 'OC semanal a la fábrica', valor: 2772000 },
  { key: 'energiaAgua', label: 'Energía y agua - hielo propio (144,000 = $0.45)', base: 'CFE + pozo', valor: 1134000 },
  { key: 'sanidad', label: 'Sanidad (plagas + insumos + limpieza)', base: '$8,497/mes + $1,875/sem + $7,500/mes', valor: 120579 },
  { key: 'seguroImpuestos', label: 'Seguro + impuestos + contador + legal', base: 'admin', valor: 274104 },
];

// Mock data - Resultado
const MOCK_RESULTADO: ResultadoPlan[] = [
  { concepto: 'Cooling propio (279,761 × $0.70)', monto: 195833, tipo: 'ingreso' },
  { concepto: 'Cooling terceros (600,000 × $1.00)', monto: 312000, tipo: 'ingreso' },
  { concepto: 'Hielo all-in (288,000 × $1.35)', monto: 388800, tipo: 'ingreso' },
  { concepto: 'Repack (~ $0.35)', monto: 122210, tipo: 'ingreso' },
  { concepto: 'Ingresos', monto: 1018843, tipo: 'ingreso', destacado: true },
  { concepto: '(-) Costos operativos (planta + servicio máquinas)', monto: -319961, tipo: 'costo' },
  { concepto: '(-) Hielo blended: 50% propio $0.45 + 50% comprado $1.10', monto: -223200, tipo: 'costo' },
  { concepto: '(-) Destajo de repack (~ $0.30)', monto: -104751, tipo: 'costo' },
  { concepto: 'UTILIDAD PLAN PC', monto: 370931, tipo: 'utilidad', destacado: true },
];

// Mock data - Capital
const MOCK_CAPITAL: CapitalArranque[] = [
  { concepto: 'Túnel de vacío pre-temporada', monto: 270000, cuando: 'octubre' },
  { concepto: 'Renta de octubre (pago doble)', monto: 560000, cuando: 'oct 15' },
  { concepto: 'Buffer de arranque', monto: 500000, cuando: 'jul-oct' },
  { concepto: 'Primeras 2 semanas de nómina', monto: 145741, cuando: 'antes del primer cobro' },
];

export const presupuestoPCService = {
  // Tarifas
  getTarifas: (): TarifasPC => ({ ...MOCK_TARIFAS }),
  updateTarifas: (data: Partial<TarifasPC>): TarifasPC => {
    Object.assign(MOCK_TARIFAS, data);
    return { ...MOCK_TARIFAS };
  },

  // Volumen
  getVolumen: (): VolumenPresupuestado[] => [...MOCK_VOLUMEN],

  // Costos
  getCostos: (): CostoPC[] => [...MOCK_COSTOS],
  updateCosto: (key: string, valor: number): CostoPC | null => {
    const index = MOCK_COSTOS.findIndex(c => c.key === key);
    if (index === -1) return null;
    MOCK_COSTOS[index].valor = valor;
    return MOCK_COSTOS[index];
  },

  // Resultado
  getResultado: (): ResultadoPlan[] => [...MOCK_RESULTADO],

  // Capital
  getCapital: (): CapitalArranque[] => [...MOCK_CAPITAL],

  // Estadísticas
  getStats: (tarifas: TarifasPC, costos: CostoPC[]): PresupuestoPCStats => {
    const totalCostos = costos.reduce((sum, c) => sum + c.valor, 0);
    const totalIngresos = 1018843; // Mock
    const utilidad = 370931; // Mock
    const margen = 36.4;
    
    return {
      totalIngresos,
      totalCostos,
      utilidad,
      margen,
      puntoEquilibrio: '~124,100 cajas',
      capitalArranque: 1475741,
      hieloBlended: 0.775,
    };
  },
};