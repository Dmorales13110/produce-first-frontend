// Payroll/hooks/usePayroll.ts

import { useState, useCallback, useEffect } from 'react';
import { PayrollService } from '../../../../services/payroll';
import { AttendanceService } from '../../../../services/attendance';
import { payrollService } from '../services/payrollService';
import type {
  Empleado,
  AsistenciaDia,
  BoletaDestajo,
  NominaSemanal,
  PayrollStats,
} from '../../types';

export const usePayroll = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [asistencia, setAsistencia] = useState<AsistenciaDia[]>([]);
  const [boletaDestajo, setBoletaDestajo] = useState<BoletaDestajo>(payrollService.getBoletaDestajo());
  const [nominaSemanal, setNominaSemanal] = useState<NominaSemanal>(payrollService.getNominaSemanal());
  const [stats, setStats] = useState<PayrollStats>(payrollService.getStats());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ puesto: 'Todos', estatus: 'Activos' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Intentar cargar trabajadores reales del backend
      const [workersResult, attendanceResult, payrollResult] = await Promise.allSettled([
        PayrollService.getWorkers(),
        AttendanceService.getDaily(),
        PayrollService.getPayroll(),
      ]);

      if (workersResult.status === 'fulfilled' && workersResult.value.length > 0) {
        const mappedEmpleados: Empleado[] = workersResult.value.map((w, idx) => ({
          id: idx + 1,
          nombre: w.full_name,
          puesto: w.department || 'Operador',
          tipo: 'Fijo',
          sueldo: `$${w.daily_wage * 6}`,
          expediente: true,
          estado: w.is_active ? 'activo' : 'inactivo',
          turno: '13:00–01:00',
        }));
        setEmpleados(mappedEmpleados);
      } else {
        setEmpleados(payrollService.getEmpleados(filters));
      }

      setAsistencia(payrollService.getAsistencia());
      setBoletaDestajo(payrollService.getBoletaDestajo());

      let totalNom = 73280;
      if (payrollResult.status === 'fulfilled' && payrollResult.value.length > 0) {
        totalNom = payrollResult.value.reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
      }

      setNominaSemanal({
        semana: 'S48',
        sueldosFijos: Math.round(totalNom * 0.85),
        horasExtra: Math.round(totalNom * 0.08),
        destajo: Math.round(totalNom * 0.07),
        total: totalNom,
      });

      setStats({
        totalEmpleados: empleados.length || payrollService.getStats().totalEmpleados,
        totalNomina: totalNom || 1577651,
        destajoTarifa: 0.30,
        nominaSemana: `$${totalNom.toLocaleString()}`,
      });

    } catch (err) {
      console.warn('⚠️ [usePayroll] Usando fallback local para nómina:', err);
      setEmpleados(payrollService.getEmpleados(filters));
      setAsistencia(payrollService.getAsistencia());
      setBoletaDestajo(payrollService.getBoletaDestajo());
      setNominaSemanal(payrollService.getNominaSemanal());
      setStats(payrollService.getStats());
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const addEmpleado = useCallback((data: Partial<Empleado>) => {
    const nuevo = payrollService.addEmpleado(data);
    setEmpleados(prev => [...prev, nuevo]);
    return nuevo;
  }, []);

  const saveAsistencia = useCallback(async (data: AsistenciaDia[]) => {
    try {
      const result = payrollService.saveAsistencia(data);
      setAsistencia(data);
      return result;
    } catch (e: any) {
      return { success: false, message: e.message || 'Error al guardar asistencia' };
    }
  }, []);

  const updateBoletaDestajo = useCallback(async (trabajadores: any[]) => {
    try {
      const result = payrollService.updateBoletaDestajo(trabajadores);
      setBoletaDestajo(prev => ({ ...prev, trabajadores }));
      return result;
    } catch (e: any) {
      return { success: false, message: e.message || 'Error al actualizar boleta' };
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    empleados,
    asistencia,
    boletaDestajo,
    nominaSemanal,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    addEmpleado,
    saveAsistencia,
    updateBoletaDestajo,
    refresh: loadData,
  };
};