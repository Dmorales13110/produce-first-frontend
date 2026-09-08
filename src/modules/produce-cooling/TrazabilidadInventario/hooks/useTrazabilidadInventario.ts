// TrazabilidadInventario/hooks/useTrazabilidadInventario.ts

import { useState, useCallback, useEffect } from 'react';

// ============================================================
// TIPOS
// ============================================================

interface TrazabilidadRecord {
  id: string;
  folio: string;
  productor: string;
  vegetal: string;
  cajas: number;
  fecha: string;
  status: string;
  ubicacion: string;
}

interface KardexRecord {
  fecha: string;
  movimiento: string;
  entrada: number;
  salida: number;
  saldo: number;
}

interface OcupacionItem {
  zona: string;
  ocupadas: number;
  total: number;
}

interface TrazabilidadStats {
  totalTarimas: number;
  tarimasOcupadas: number;
  tarimasLibres: number;
  porcentajeOcupacion: number;
  totalCajas: number;
  foliosVivos: number;
  diasPromedio: number;
}

// ============================================================
// DATOS MOCK
// ============================================================

const MOCK_TRAZABILIDAD: TrazabilidadRecord[] = [
  { id: '1', folio: 'JAV-0508', productor: 'Agrícola JAV', vegetal: 'Bok Choy Mieu', cajas: 180, fecha: '2026-09-01', status: 'Activo', ubicacion: 'Túnel 1' },
  { id: '2', folio: 'JAV-0510', productor: 'Agrícola JAV', vegetal: 'Shanghai Bok', cajas: 450, fecha: '2026-09-02', status: 'Activo', ubicacion: 'Cámara 2' },
  { id: '3', folio: 'ZER-118', productor: 'Daniel Zermeño', vegetal: 'Coliflor', cajas: 280, fecha: '2026-09-03', status: 'Activo', ubicacion: 'Túnel 1' },
  { id: '4', folio: 'DV-2725', productor: 'Daily Veggies', vegetal: 'Shanghai Bok', cajas: 540, fecha: '2026-09-04', status: 'Activo', ubicacion: 'Cámara 1' },
  { id: '5', folio: 'DV-2721', productor: 'Daily Veggies', vegetal: 'Baby Bok Choy', cajas: 390, fecha: '2026-09-05', status: 'Activo', ubicacion: 'Túnel 2' },
];

const MOCK_KARDEX: KardexRecord[] = [
  { fecha: '2026-09-01', movimiento: 'Entrada JAV-0508', entrada: 180, salida: 0, saldo: 180 },
  { fecha: '2026-09-02', movimiento: 'Entrada JAV-0510', entrada: 450, salida: 0, saldo: 630 },
  { fecha: '2026-09-03', movimiento: 'Salida - Embarque', entrada: 0, salida: 200, saldo: 430 },
  { fecha: '2026-09-04', movimiento: 'Entrada DV-2725', entrada: 540, salida: 0, saldo: 970 },
  { fecha: '2026-09-05', movimiento: 'Salida - Repack', entrada: 0, salida: 100, saldo: 870 },
];

const MOCK_OCUPACION: OcupacionItem[] = [
  { zona: 'Túnel 1', ocupadas: 12, total: 20 },
  { zona: 'Túnel 2', ocupadas: 8, total: 20 },
  { zona: 'Cámara 1', ocupadas: 15, total: 25 },
  { zona: 'Cámara 2', ocupadas: 10, total: 25 },
];

// ============================================================
// HOOK
// ============================================================

export const useTrazabilidadInventario = () => {
  const [trazabilidad, setTrazabilidad] = useState<TrazabilidadRecord[]>(MOCK_TRAZABILIDAD);
  const [kardex, setKardex] = useState<KardexRecord[]>(MOCK_KARDEX);
  const [ocupacion, setOcupacion] = useState<OcupacionItem[]>(MOCK_OCUPACION);
  const [stats, setStats] = useState<TrazabilidadStats>({
    totalTarimas: 90,
    tarimasOcupadas: 45,
    tarimasLibres: 45,
    porcentajeOcupacion: 50,
    totalCajas: 1840,
    foliosVivos: 5,
    diasPromedio: 3.2,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ productor: 'Todos', vegetal: 'Todos', estado: 'Con saldo' });
  const [kardexFilters, setKardexFilters] = useState({ producto: 'Todos', rango: 'Esta semana' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      // Todo con datos mock
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    trazabilidad,
    kardex,
    ocupacion,
    stats,
    isLoading,
    error,
    filters,
    kardexFilters,
    setFilters,
    setKardexFilters,
    refresh: loadData,
  };
};