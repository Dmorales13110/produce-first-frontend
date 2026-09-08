import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface Supplier {
  id: string;
  code: string;
  name: string;
  business_name: string;
  rfc: string;
  type: string;
  payment_terms: string;
  credit_days: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  code: string;
  supplier_id: string;
  supplier?: Supplier;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  concept: string;
  total_amount: number;
  paid_amount: number;
  balance: number;
  status: 'pending' | 'overdue' | 'paid' | 'partial';
  credit_terms: string;
  payment_date?: string;
  payment_method?: string;
  bank_reference?: string;
  category?: string;
  purchase_order_id?: string;
  notes?: string;
  is_sat_conciliated: boolean;
  sat_xml_url?: string;
  created_at: string;
  updated_at: string;
  empresa_id?: string;
}

export interface Payment {
  id: string;
  code: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  bank_reference?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SATConciliation {
  id: string;
  invoice_id: string;
  xml_original_url?: string;
  xml_processed_at?: string;
  category_matched?: string;
  purchase_order_matched?: string;
  is_conciliated: boolean;
  conciliated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountsPayableSummary {
  totalBalance: number;
  overdueCount: number;
  paidCount: number;
  totalInvoices: number;
  avgDays: number;
  totalByCategory: Array<{ category: string; total: number }>;
}

export interface InvoiceFilters {
  status?: string;
  supplierId?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CreateInvoiceInput {
  supplier_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  concept: string;
  total_amount: number;
  credit_terms?: string;
  category?: string;
  purchase_order_id?: string;
  notes?: string;
}

export interface CreatePaymentInput {
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method: 'transfer' | 'cash' | 'check';
  bank_reference?: string;
  notes?: string;
}

export interface MarkAsPaidInput {
  invoiceIds: string[];
  payment_date: string;
  payment_method: 'transfer' | 'cash' | 'check';
  bank_reference?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const AccountsPayableService = {
  // ============================================================
  // INVOICES
  // ============================================================

  /**
   * Obtener facturas con filtros
   * GET /accounts-payable/invoices
   */
  getInvoices: async (filters?: InvoiceFilters): Promise<Invoice[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.supplierId) queryParams.append('supplierId', filters.supplierId);
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
      if (filters?.search) queryParams.append('search', filters.search);

      const url = `/accounts-payable/invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: Invoice[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsPayableService] getInvoices error:', error);
      throw error;
    }
  },

  /**
   * Obtener una factura por ID
   * GET /accounts-payable/invoices/:id
   */
  getInvoiceById: async (id: string): Promise<Invoice> => {
    try {
      const response = await api.get<{ success: boolean; data: Invoice }>(`/accounts-payable/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsPayableService] getInvoiceById error:', error);
      throw error;
    }
  },

  /**
   * Crear nueva factura
   * POST /accounts-payable/invoices
   */
  createInvoice: async (data: CreateInvoiceInput): Promise<Invoice> => {
    try {
      const response = await api.post<{ success: boolean; data: Invoice }>('/accounts-payable/invoices', data);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsPayableService] createInvoice error:', error);
      throw error;
    }
  },

  /**
   * Actualizar factura
   * PUT /accounts-payable/invoices/:id
   */
  updateInvoice: async (id: string, data: Partial<CreateInvoiceInput>): Promise<Invoice> => {
    try {
      const response = await api.put<{ success: boolean; data: Invoice }>(`/accounts-payable/invoices/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsPayableService] updateInvoice error:', error);
      throw error;
    }
  },

  /**
   * Eliminar factura
   * DELETE /accounts-payable/invoices/:id
   */
  deleteInvoice: async (id: string): Promise<void> => {
    try {
      await api.delete(`/accounts-payable/invoices/${id}`);
    } catch (error) {
      console.error('❌ [AccountsPayableService] deleteInvoice error:', error);
      throw error;
    }
  },

  // ============================================================
  // PAYMENTS
  // ============================================================

  /**
   * Registrar pago
   * POST /accounts-payable/payments
   */
  registerPayment: async (data: CreatePaymentInput): Promise<Payment> => {
    try {
      const response = await api.post<{ success: boolean; data: Payment }>('/accounts-payable/payments', data);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsPayableService] registerPayment error:', error);
      throw error;
    }
  },

  /**
   * Obtener pagos
   * GET /accounts-payable/payments
   */
  getPayments: async (invoiceId?: string): Promise<Payment[]> => {
    try {
      const url = invoiceId ? `/accounts-payable/payments?invoiceId=${invoiceId}` : '/accounts-payable/payments';
      const response = await api.get<{ success: boolean; data: Payment[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsPayableService] getPayments error:', error);
      throw error;
    }
  },

  // ============================================================
  // SAT CONCILIATION
  // ============================================================

  /**
   * Obtener conciliaciones SAT
   * GET /accounts-payable/sat
   */
  getSATConciliations: async (invoiceId?: string): Promise<SATConciliation[]> => {
    try {
      const url = invoiceId ? `/accounts-payable/sat?invoiceId=${invoiceId}` : '/accounts-payable/sat';
      const response = await api.get<{ success: boolean; data: SATConciliation[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsPayableService] getSATConciliations error:', error);
      throw error;
    }
  },

  /**
   * Conciliar factura con SAT
   * POST /accounts-payable/sat/:invoiceId/conciliate
   */
  conciliateSAT: async (invoiceId: string, data: { category: string; purchaseOrder?: string }): Promise<SATConciliation> => {
    try {
      const response = await api.post<{ success: boolean; data: SATConciliation }>(
        `/accounts-payable/sat/${invoiceId}/conciliate`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsPayableService] conciliateSAT error:', error);
      throw error;
    }
  },

  // ============================================================
  // SUPPLIERS
  // ============================================================

  /**
   * Obtener proveedores
   * GET /accounts-payable/suppliers
   */
  getSuppliers: async (): Promise<Supplier[]> => {
    try {
      const response = await api.get<{ success: boolean; data: Supplier[] }>('/accounts-payable/suppliers');
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsPayableService] getSuppliers error:', error);
      throw error;
    }
  },

  // ============================================================
  // SUMMARY
  // ============================================================

  /**
   * Obtener resumen de cuentas por pagar
   * GET /accounts-payable/summary
   */
  getSummary: async (): Promise<AccountsPayableSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: AccountsPayableSummary }>('/accounts-payable/summary');
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsPayableService] getSummary error:', error);
      throw error;
    }
  },

  // ============================================================
  // BULK ACTIONS
  // ============================================================

  /**
   * Marcar múltiples facturas como pagadas
   * POST /accounts-payable/bulk/mark-paid
   */
  markAsPaid: async (data: MarkAsPaidInput): Promise<any> => {
    try {
      const response = await api.post<{ success: boolean; data: any }>('/accounts-payable/bulk/mark-paid', data);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsPayableService] markAsPaid error:', error);
      throw error;
    }
  },
};