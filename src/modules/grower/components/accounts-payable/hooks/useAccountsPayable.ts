import { useState, useEffect, useCallback } from 'react';
import {
  AccountsPayableService,
  type Invoice,
  type Payment,
  type SATConciliation,
  type Supplier,
  type AccountsPayableSummary,
  type InvoiceFilters,
  type CreateInvoiceInput,
  type CreatePaymentInput,
  type MarkAsPaidInput,
} from '../../../../../services/accounts-payable';

interface UseAccountsPayableReturn {
  // Datos
  invoices: Invoice[];
  payments: Payment[];
  satConciliations: SATConciliation[];
  suppliers: Supplier[];
  summary: AccountsPayableSummary | null;
  
  // Estados
  isLoading: boolean;
  error: string | null;
  filters: InvoiceFilters;
  
  // Acciones
  setFilters: (filters: InvoiceFilters) => void;
  refresh: () => Promise<void>;
  
  // CRUD Facturas
  createInvoice: (data: CreateInvoiceInput) => Promise<Invoice>;
  updateInvoice: (id: string, data: Partial<CreateInvoiceInput>) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;
  
  // Pagos
  registerPayment: (data: CreatePaymentInput) => Promise<Payment>;
  getPayments: (invoiceId?: string) => Promise<Payment[]>;
  
  // SAT
  conciliateSAT: (invoiceId: string, data: { category: string; purchaseOrder?: string }) => Promise<SATConciliation>;
  
  // Acciones masivas
  markAsPaid: (data: MarkAsPaidInput) => Promise<any>;
}

export const useAccountsPayable = (initialFilters?: InvoiceFilters): UseAccountsPayableReturn => {
  // Estados
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [satConciliations, setSatConciliations] = useState<SATConciliation[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [summary, setSummary] = useState<AccountsPayableSummary | null>(null);
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
      const [invoicesData, suppliersData, summaryData, paymentsData, satData] = await Promise.all([
        AccountsPayableService.getInvoices(filters),
        AccountsPayableService.getSuppliers(),
        AccountsPayableService.getSummary(),
        AccountsPayableService.getPayments(),
        AccountsPayableService.getSATConciliations(),
      ]);
      
      setInvoices(invoicesData);
      setSuppliers(suppliersData);
      setSummary(summaryData);
      setPayments(paymentsData);
      setSatConciliations(satData);
    } catch (err) {
      console.error('❌ [useAccountsPayable] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos de cuentas por pagar');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // ============================================================
  // CRUD - INVOICES
  // ============================================================

  const createInvoice = useCallback(async (data: CreateInvoiceInput): Promise<Invoice> => {
    try {
      const result = await AccountsPayableService.createInvoice(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAccountsPayable] createInvoice error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateInvoice = useCallback(async (id: string, data: Partial<CreateInvoiceInput>): Promise<Invoice> => {
    try {
      const result = await AccountsPayableService.updateInvoice(id, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAccountsPayable] updateInvoice error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteInvoice = useCallback(async (id: string): Promise<void> => {
    try {
      await AccountsPayableService.deleteInvoice(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useAccountsPayable] deleteInvoice error:', err);
      throw err;
    }
  }, [fetchData]);

  // ============================================================
  // PAYMENTS
  // ============================================================

  const registerPayment = useCallback(async (data: CreatePaymentInput): Promise<Payment> => {
    try {
      const result = await AccountsPayableService.registerPayment(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAccountsPayable] registerPayment error:', err);
      throw err;
    }
  }, [fetchData]);

  const getPayments = useCallback(async (invoiceId?: string): Promise<Payment[]> => {
    try {
      return await AccountsPayableService.getPayments(invoiceId);
    } catch (err) {
      console.error('❌ [useAccountsPayable] getPayments error:', err);
      throw err;
    }
  }, []);

  // ============================================================
  // SAT CONCILIATION
  // ============================================================

  const conciliateSAT = useCallback(async (invoiceId: string, data: { category: string; purchaseOrder?: string }): Promise<SATConciliation> => {
    try {
      const result = await AccountsPayableService.conciliateSAT(invoiceId, data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAccountsPayable] conciliateSAT error:', err);
      throw err;
    }
  }, [fetchData]);

  // ============================================================
  // BULK ACTIONS
  // ============================================================

  const markAsPaid = useCallback(async (data: MarkAsPaidInput): Promise<any> => {
    try {
      const result = await AccountsPayableService.markAsPaid(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useAccountsPayable] markAsPaid error:', err);
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
    payments,
    satConciliations,
    suppliers,
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
    
    // Pagos
    registerPayment,
    getPayments,
    
    // SAT
    conciliateSAT,
    
    // Acciones masivas
    markAsPaid,
  };
};