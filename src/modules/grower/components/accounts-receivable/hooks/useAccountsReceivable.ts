import { useState, useEffect, useCallback } from 'react';
import {
  AccountsReceivableService,
  type SalesInvoice,
  type PendingSettlement,
  type Customer,
  type AccountsReceivableSummary,
  type InvoiceFilters,
  type CreateSalesInvoiceInput,
  type CreatePendingSettlementInput,
  type MarkAsPaidInput,
} from '../../../../../services/accounts-receivable';

interface UseAccountsReceivableReturn {
  // Datos
  invoices: SalesInvoice[];
  settlements: PendingSettlement[];
  customers: Customer[];
  summary: AccountsReceivableSummary | null;
  
  // Estados
  isLoading: boolean;
  error: string | null;
  filters: InvoiceFilters;
  
  // Acciones
  setFilters: (filters: InvoiceFilters) => void;
  refresh: () => Promise<void>;
  
  // CRUD Facturas
  createInvoice: (data: CreateSalesInvoiceInput) => Promise<SalesInvoice>;
  updateInvoice: (id: string, data: Partial<CreateSalesInvoiceInput>) => Promise<SalesInvoice>;
  deleteInvoice: (id: string) => Promise<void>;
  
  // Liquidaciones
  createSettlement: (data: CreatePendingSettlementInput) => Promise<PendingSettlement>;
  emitInvoiceFromSettlement: (settlementId: string, invoiceNumber: string) => Promise<SalesInvoice>;
  
  // Acciones masivas
  markAsPaid: (data: MarkAsPaidInput) => Promise<any>;
}

export const useAccountsReceivable = (initialFilters?: InvoiceFilters): UseAccountsReceivableReturn => {
  // Estados
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [settlements, setSettlements] = useState<PendingSettlement[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [summary, setSummary] = useState<AccountsReceivableSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InvoiceFilters>(initialFilters || {});

  // ============================================================
  // FETCH DATA
  // ============================================================

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [invoicesData, settlementsData, customersData, summaryData] = await Promise.all([
        AccountsReceivableService.getInvoices(filters),
        AccountsReceivableService.getPendingSettlements(),
        AccountsReceivableService.getCustomers(),
        AccountsReceivableService.getSummary(),
      ]);

      setInvoices(invoicesData);
      setSettlements(settlementsData);
      setCustomers(customersData);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [useAccountsReceivable] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos de cuentas por cobrar');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // ============================================================
  // CRUD - INVOICES
  // ============================================================

  const createInvoice = useCallback(async (data: CreateSalesInvoiceInput): Promise<SalesInvoice> => {
    try {
      const result = await AccountsReceivableService.createInvoice(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAccountsReceivable] createInvoice error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateInvoice = useCallback(async (id: string, data: Partial<CreateSalesInvoiceInput>): Promise<SalesInvoice> => {
    try {
      const result = await AccountsReceivableService.updateInvoice(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAccountsReceivable] updateInvoice error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteInvoice = useCallback(async (id: string): Promise<void> => {
    try {
      await AccountsReceivableService.deleteInvoice(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useAccountsReceivable] deleteInvoice error:', err);
      throw err;
    }
  }, [fetchData]);

  // ============================================================
  // SETTLEMENTS
  // ============================================================

  const createSettlement = useCallback(async (data: CreatePendingSettlementInput): Promise<PendingSettlement> => {
    try {
      const result = await AccountsReceivableService.createSettlement(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAccountsReceivable] createSettlement error:', err);
      throw err;
    }
  }, [fetchData]);

  const emitInvoiceFromSettlement = useCallback(async (settlementId: string, invoiceNumber: string): Promise<SalesInvoice> => {
    try {
      const result = await AccountsReceivableService.emitInvoiceFromSettlement(settlementId, invoiceNumber);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAccountsReceivable] emitInvoiceFromSettlement error:', err);
      throw err;
    }
  }, [fetchData]);

  // ============================================================
  // BULK ACTIONS
  // ============================================================

  const markAsPaid = useCallback(async (data: MarkAsPaidInput): Promise<any> => {
    try {
      const result = await AccountsReceivableService.markAsPaid(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAccountsReceivable] markAsPaid error:', err);
      throw err;
    }
  }, [fetchData]);

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============================================================
  // RETURN
  // ============================================================

  return {
    // Datos
    invoices,
    settlements,
    customers,
    summary,
    
    // Estados
    isLoading,
    error,
    filters,
    
    // Acciones
    setFilters,
    refresh: fetchData,
    
    // CRUD Facturas
    createInvoice,
    updateInvoice,
    deleteInvoice,
    
    // Liquidaciones
    createSettlement,
    emitInvoiceFromSettlement,
    
    // Acciones masivas
    markAsPaid,
  };
};