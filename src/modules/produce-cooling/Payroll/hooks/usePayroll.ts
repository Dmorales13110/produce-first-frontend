// Payroll/hooks/usePayroll.ts

import { useState, useCallback, useEffect } from 'react';
import { PayrollService } from '../../../../services/payroll';
import { AttendanceService } from '../../../../services/attendance';
import type { Worker, Attendance } from '../../../../services/payroll';
import type { AttendanceDaily } from '../../../../services/attendance';

interface PayrollStats {
  totalEmpleados: number;
  totalNomina: number;
  promedioDiario: number;
  asistenciaPromedio: number;
}

export const usePayroll = () => {
  const [empleados, setEmpleados] = useState<Worker[]>([]);
  const [asistencia, setAsistencia] = useState<AttendanceDaily[]>([]);
  const [stats, setStats] = useState<PayrollStats>({
    totalEmpleados: 0,
    totalNomina: 0,
    promedioDiario: 0,
    asistenciaPromedio: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ puesto: 'Todos', estatus: 'Activos' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener trabajadores
      const workers = await PayrollService.getWorkers();
      setEmpleados(workers);

      // Obtener asistencia
      const attendance = await AttendanceService.getDaily();
      setAsistencia(attendance);

      // Obtener nómina semanal
      const payroll = await PayrollService.getPayroll();
      const totalAmount = payroll.reduce((sum, p) => sum + p.total_amount, 0);

      // Calcular estadísticas
      setStats({
        totalEmpleados: workers.filter(w => w.is_active).length,
        totalNomina: totalAmount,
        promedioDiario: 0,
        asistenciaPromedio: attendance.length > 0 ? 
          (attendance.filter(a => a.status === 'present').length / attendance.length) * 100 : 0,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    empleados,
    asistencia,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: loadData,
  };
};