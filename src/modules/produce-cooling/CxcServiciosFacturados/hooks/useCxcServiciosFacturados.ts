// CxcServiciosFacturados/hooks/useCxcServiciosFacturados.ts

import { useState, useCallback, useEffect } from 'react';
import { AccountsReceivableService } from '../../../../services/accounts-receivable';
import type { SalesInvoice } from '../../../../services/accounts-receivable';

interface FacturaCxc {
  id: string;
  cliente: string;
  folio: string;
  monto: number;
  saldo: number;
  vence: string;
  estatus: string;
}

interface CxcStats {
  cobroSemanalPromedio: number;
  porCobrar: number;
  clientes: string;
  facturaNace: string;
  totalFacturas: number;
  cobradas: number;
  pendientes: number;
  vencidas: number;
}

export const useCxcServiciosFacturados = () => {
  const [facturas, setFacturas] = useState<SalesInvoice[]>([]);
  const [stats, setStats] = useState<CxcStats>({
    cobroSemanalPromedio: 0,
    porCobrar: 0,
    clientes: '',
    facturaNace: '',
    totalFacturas: 0,
    cobradas: 0,
    pendientes: 0,
    vencidas: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ cliente: 'Todos', servicio: 'Todos', estatus: 'Por cobrar' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const invoices = await AccountsReceivableService.getInvoices({
        status: filters.estatus === 'Por cobrar' ? 'pending' : 
                filters.estatus === 'Vencidas' ? 'overdue' : 
                filters.estatus === 'Cobradas' ? 'paid' : undefined,
      });

      setFacturas(invoices);

      // Calcular estadísticas
      const totalBalance = invoices.reduce((sum, inv) => sum + inv.balance, 0);
      const totalInvoices = invoices.length;
      const cobradas = invoices.filter(inv => inv.status === 'paid').length;
      const pendientes = invoices.filter(inv => inv.status === 'pending' || inv.status === 'partial').length;
      const vencidas = invoices.filter(inv => inv.status === 'overdue').length;

      setStats({
        cobroSemanalPromedio: 0,
        porCobrar: totalBalance,
        clientes: '',
        facturaNace: '',
        totalFacturas: totalInvoices,
        cobradas,
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
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: loadData,
  };
};