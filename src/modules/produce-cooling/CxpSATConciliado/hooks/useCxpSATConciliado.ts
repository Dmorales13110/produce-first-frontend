// CxpSATConciliado/hooks/useCxpSATConciliado.ts

import { useState, useCallback, useEffect } from 'react';
import { AccountsPayableService } from '../../../../services/accounts-payable';
import type { Invoice } from '../../../../services/accounts-payable';

interface CuentaCxp {
  id: string;
  proveedor: string;
  factura: string;
  monto: number;
  saldo: number;
  vence: string;
  estatus: string;
}

interface CxpSATStats {
  saldoPorPagar: number;
  rentaMensual: number;
  pagoSemanalPromedio: number;
  totalFacturas: number;
  conciliadas: number;
  pendientes: number;
  vencidas: number;
}

export const useCxpSATConciliado = () => {
  const [facturas, setFacturas] = useState<Invoice[]>([]);
  const [cuentas, setCuentas] = useState<CuentaCxp[]>([]);
  const [stats, setStats] = useState<CxpSATStats>({
    saldoPorPagar: 0,
    rentaMensual: 0,
    pagoSemanalPromedio: 0,
    totalFacturas: 0,
    conciliadas: 0,
    pendientes: 0,
    vencidas: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ proveedor: 'Todos', categoria: 'Todas', estatus: 'Por pagar' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const invoices = await AccountsPayableService.getInvoices({
        status: filters.estatus === 'Por pagar' ? 'pending' : 
                filters.estatus === 'Vencidas' ? 'overdue' : 
                filters.estatus === 'Pagadas' ? 'paid' : undefined,
      });

      setFacturas(invoices);

      // Mapear a CuentaCxp
      const cuentasData: CuentaCxp[] = invoices.map(inv => ({
        id: inv.id,
        proveedor: inv.supplier?.name || 'N/A',
        factura: inv.invoice_number || inv.code,
        monto: inv.total_amount,
        saldo: inv.balance,
        vence: inv.due_date,
        estatus: inv.status === 'paid' ? 'pagada' : 
                 inv.status === 'overdue' ? 'vencida' : 'por pagar',
      }));
      setCuentas(cuentasData);

      // Calcular estadísticas
      const totalBalance = invoices.reduce((sum, inv) => sum + inv.balance, 0);
      const totalInvoices = invoices.length;
      const conciliadas = invoices.filter(inv => inv.is_sat_conciliated).length;
      const pendientes = invoices.filter(inv => inv.status === 'pending').length;
      const vencidas = invoices.filter(inv => inv.status === 'overdue').length;

      setStats({
        saldoPorPagar: totalBalance,
        rentaMensual: 0,
        pagoSemanalPromedio: 0,
        totalFacturas: totalInvoices,
        conciliadas,
        pendientes,
        vencidas,
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
    facturas,
    cuentas,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: loadData,
  };
};