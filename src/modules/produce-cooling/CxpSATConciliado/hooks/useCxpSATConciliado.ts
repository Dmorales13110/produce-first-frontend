// CxpSATConciliado/hooks/useCxpSATConciliado.ts

import { useState, useCallback, useEffect } from 'react';
import { AccountsPayableService } from '../../../../services/accounts-payable';
import { cxpSATConciliadoService } from '../services/cxpSATConciliadoService';
import type {
  FacturaSAT,
  CuentaCxp,
  FlujoVencimiento,
  CxpSATStats,
} from '../../types';

export const useCxpSATConciliado = () => {
  const [facturas, setFacturas] = useState<FacturaSAT[]>(cxpSATConciliadoService.getFacturas());
  const [cuentas, setCuentas] = useState<CuentaCxp[]>(cxpSATConciliadoService.getCuentas());
  const [flujo, setFlujo] = useState<FlujoVencimiento[]>(cxpSATConciliadoService.getFlujo());
  const [stats, setStats] = useState<CxpSATStats>(cxpSATConciliadoService.getStats(cxpSATConciliadoService.getCuentas()));
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

      if (invoices && invoices.length > 0) {
        const mappedCuentas: CuentaCxp[] = invoices.map((inv, idx) => ({
          id: idx + 1,
          fFactura: inv.invoice_date || '01-dic',
          proveedor: inv.supplier?.name || 'Proveedor General',
          concepto: inv.notes || inv.invoice_number || 'Factura compra',
          totalMXN: inv.total_amount || 0,
          pagado: (inv.total_amount || 0) - (inv.balance || 0),
          saldo: inv.balance || 0,
          credito: '15d',
          vence: inv.due_date || '15-dic',
          fPago: inv.status === 'paid' ? inv.due_date : '',
          estatus: inv.status === 'paid' ? 'pagada' : inv.status === 'overdue' ? 'vencida' : 'sin vencer',
          colorEstatus: inv.status === 'paid' ? 'gray' : inv.status === 'overdue' ? 'red' : 'blue',
        }));
        setCuentas(mappedCuentas);
        setStats(cxpSATConciliadoService.getStats(mappedCuentas));
      } else {
        const defaultCuentas = cxpSATConciliadoService.getCuentas(filters);
        setCuentas(defaultCuentas);
        setStats(cxpSATConciliadoService.getStats(defaultCuentas));
      }

      setFacturas(cxpSATConciliadoService.getFacturas());
      setFlujo(cxpSATConciliadoService.getFlujo());

    } catch (err) {
      console.warn('⚠️ [useCxpSATConciliado] Usando fallback local para Cxp:', err);
      const defaultCuentas = cxpSATConciliadoService.getCuentas(filters);
      setCuentas(defaultCuentas);
      setFacturas(cxpSATConciliadoService.getFacturas());
      setFlujo(cxpSATConciliadoService.getFlujo());
      setStats(cxpSATConciliadoService.getStats(defaultCuentas));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const conciliarFactura = useCallback((id: string, data: { categoria: string; oc: string }) => {
    const result = cxpSATConciliadoService.conciliarFactura(id, data);
    setFacturas(cxpSATConciliadoService.getFacturas());
    return result;
  }, []);

  const marcarPagadas = useCallback(async (ids: number[], fechaPago: string, banco: string) => {
    const result = cxpSATConciliadoService.marcarPagadas(ids, fechaPago, banco);
    setCuentas(cxpSATConciliadoService.getCuentas(filters));
    setStats(cxpSATConciliadoService.getStats(cxpSATConciliadoService.getCuentas(filters)));
    return result;
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    facturas,
    cuentas,
    flujo,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    conciliarFactura,
    marcarPagadas,
    refresh: loadData,
  };
};