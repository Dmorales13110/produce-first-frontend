// CxcServiciosFacturados/hooks/useCxcServiciosFacturados.ts

import { useState, useCallback, useEffect } from 'react';
import { AccountsReceivableService } from '../../../../services/accounts-receivable';
import { cxcServiciosFacturadosService } from '../services/cxcServiciosFacturadosService';
import type {
  FacturaCxc,
  CuentaCxc,
  CxcStats,
} from '../../types';

export const useCxcServiciosFacturados = () => {
  const [facturas, setFacturas] = useState<FacturaCxc[]>(cxcServiciosFacturadosService.getFacturas());
  const [cuentasCxc, setCuentasCxc] = useState<CuentaCxc[]>(cxcServiciosFacturadosService.getCuentasCxc());
  const [stats, setStats] = useState<CxcStats>(cxcServiciosFacturadosService.getStats(cxcServiciosFacturadosService.getCuentasCxc()));
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

      if (invoices && invoices.length > 0) {
        const mappedCuentas: CuentaCxc[] = invoices.map((inv, idx) => ({
          id: idx + 1,
          fFactura: inv.invoice_date || '24-nov',
          cliente: inv.customer?.commercial_name || inv.customer?.name || 'Cliente Comercial',
          factura: inv.invoice_number || `FAC-${inv.id.slice(0, 6)}`,
          concepto: inv.notes || 'Servicios Cooling',
          total: inv.total_amount || 0,
          cobrado: (inv.total_amount || 0) - (inv.balance || 0),
          saldo: inv.balance || 0,
          credito: '7d',
          vence: inv.due_date || '01-dic',
          fCobro: inv.status === 'paid' ? inv.due_date : '',
          estatus: inv.status === 'paid' ? 'cobrada' : inv.status === 'overdue' ? 'vencida' : 'por cobrar',
        }));
        setCuentasCxc(mappedCuentas);
        setStats(cxcServiciosFacturadosService.getStats(mappedCuentas));
      } else {
        const defaultCuentas = cxcServiciosFacturadosService.getCuentasCxc(filters);
        setCuentasCxc(defaultCuentas);
        setStats(cxcServiciosFacturadosService.getStats(defaultCuentas));
      }

      setFacturas(cxcServiciosFacturadosService.getFacturas());

    } catch (err) {
      console.warn('⚠️ [useCxcServiciosFacturados] Usando fallback local para CxC:', err);
      const defaultCuentas = cxcServiciosFacturadosService.getCuentasCxc(filters);
      setCuentasCxc(defaultCuentas);
      setFacturas(cxcServiciosFacturadosService.getFacturas());
      setStats(cxcServiciosFacturadosService.getStats(defaultCuentas));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const emitirFactura = useCallback((id: string, folio: string) => {
    const result = cxcServiciosFacturadosService.emitirFactura(id, folio);
    setFacturas(cxcServiciosFacturadosService.getFacturas());
    return result;
  }, []);

  const marcarCobradas = useCallback(async (ids: number[], fechaCobro: string) => {
    const result = cxcServiciosFacturadosService.marcarCobradas(ids, fechaCobro);
    setCuentasCxc(cxcServiciosFacturadosService.getCuentasCxc(filters));
    setStats(cxcServiciosFacturadosService.getStats(cxcServiciosFacturadosService.getCuentasCxc(filters)));
    return result;
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    facturas,
    cuentasCxc,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    emitirFactura,
    marcarCobradas,
    refresh: loadData,
  };
};