import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface Customer {
  id: string;
  code: string;
  name: string;
  business_name: string;
  rfc: string;
  email: string;
  phone: string;
  customer_status: 'active' | 'inactive';
  payment_terms: number;
  credit_limit: number;
  created_at: string;
  updated_at: string;
}

export interface SalesInvoice {
  id: string;
  code: string;
  customer_id: string;
  customer?: Customer;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  concept: string;
  total_amount: number;
  paid_amount: number;
  balance: number;
  status: 'pending' | 'overdue' | 'paid' | 'partial' | 'clarification';
  credit_terms: string;
  payment_date?: string;
  payment_method?: string;
  bank_reference?: string;
  category?: string;
  sale_order_id?: string;
  notes?: string;
  is_sent: boolean;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PendingSettlement {
  id: string;
  code: string;
  customer_id: string;
  customer?: Customer;
  settlement_date: string;
  concept: string;
  total_amount: number;
  invoice_number?: string;
  status: 'pending' | 'invoiced' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountsReceivableSummary {
  totalReceivable: number;
  overdueCount: number;
  paidCount: number;
  totalInvoices: number;
  totalCollected: number;
  pendingInvoices: number;
  byCustomer: Array<{
    customer_id: string;
    customer_name: string;
    total: number;
    count: number;
    percentage: number;
  }>;
}

export interface InvoiceFilters {
  status?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CreateSalesInvoiceInput {
  customer_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  concept: string;
  total_amount: number;
  credit_terms?: string;
  category?: string;
  sale_order_id?: string;
  notes?: string;
}

export interface CreatePendingSettlementInput {
  customer_id: string;
  settlement_date: string;
  concept: string;
  total_amount: number;
  invoice_number?: string;
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

export const AccountsReceivableService = {
  // ============================================================
  // INVOICES
  // ============================================================

  /**
   * Obtener facturas con filtros
   * GET /accounts-receivable/invoices
   */
  getInvoices: async (filters?: InvoiceFilters): Promise<SalesInvoice[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.customerId) queryParams.append('customerId', filters.customerId);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
      if (filters?.search) queryParams.append('search', filters.search);

      const url = `/accounts-receivable/invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: SalesInvoice[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsReceivableService] getInvoices error:', error);
      throw error;
    }
  },

  /**
   * Obtener una factura por ID
   * GET /accounts-receivable/invoices/:id
   */
  getInvoiceById: async (id: string): Promise<SalesInvoice> => {
    try {
      const response = await api.get<{ success: boolean; data: SalesInvoice }>(`/accounts-receivable/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsReceivableService] getInvoiceById error:', error);
      throw error;
    }
  },

  /**
   * Crear nueva factura
   * POST /accounts-receivable/invoices
   */
  createInvoice: async (data: CreateSalesInvoiceInput): Promise<SalesInvoice> => {
    try {
      const response = await api.post<{ success: boolean; data: SalesInvoice }>('/accounts-receivable/invoices', data);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsReceivableService] createInvoice error:', error);
      throw error;
    }
  },

  /**
   * Actualizar factura
   * PUT /accounts-receivable/invoices/:id
   */
  updateInvoice: async (id: string, data: Partial<CreateSalesInvoiceInput>): Promise<SalesInvoice> => {
    try {
      const response = await api.put<{ success: boolean; data: SalesInvoice }>(`/accounts-receivable/invoices/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsReceivableService] updateInvoice error:', error);
      throw error;
    }
  },

  /**
   * Eliminar factura
   * DELETE /accounts-receivable/invoices/:id
   */
  deleteInvoice: async (id: string): Promise<void> => {
    try {
      await api.delete(`/accounts-receivable/invoices/${id}`);
    } catch (error) {
      console.error('❌ [AccountsReceivableService] deleteInvoice error:', error);
      throw error;
    }
  },

  // ============================================================
  // SETTLEMENTS
  // ============================================================

  /**
   * Obtener liquidaciones pendientes
   * GET /accounts-receivable/settlements
   */
  getPendingSettlements: async (filters?: { customerId?: string; status?: string }): Promise<PendingSettlement[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.customerId) queryParams.append('customerId', filters.customerId);
      if (filters?.status) queryParams.append('status', filters.status);

      const url = `/accounts-receivable/settlements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ success: boolean; data: PendingSettlement[] }>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsReceivableService] getPendingSettlements error:', error);
      throw error;
    }
  },

  /**
   * Crear nueva liquidación
   * POST /accounts-receivable/settlements
   */
  createSettlement: async (data: CreatePendingSettlementInput): Promise<PendingSettlement> => {
    try {
      const response = await api.post<{ success: boolean; data: PendingSettlement }>('/accounts-receivable/settlements', data);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsReceivableService] createSettlement error:', error);
      throw error;
    }
  },

  /**
   * Emitir factura desde liquidación
   * POST /accounts-receivable/settlements/:id/emit
   */
  emitInvoiceFromSettlement: async (settlementId: string, invoiceNumber: string): Promise<SalesInvoice> => {
    try {
      const response = await api.post<{ success: boolean; data: SalesInvoice }>(
        `/accounts-receivable/settlements/${settlementId}/emit`,
        { invoice_number: invoiceNumber }
      );
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsReceivableService] emitInvoiceFromSettlement error:', error);
      throw error;
    }
  },

  // ============================================================
  // CUSTOMERS
  // ============================================================

  /**
   * Obtener clientes
   * GET /accounts-receivable/customers
   */
  getCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await api.get<{ success: boolean; data: Customer[] }>('/accounts-receivable/customers');
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsReceivableService] getCustomers error:', error);
      throw error;
    }
  },

  // ============================================================
  // SUMMARY
  // ============================================================

  /**
   * Obtener resumen de cuentas por cobrar
   * GET /accounts-receivable/summary
   */
  getSummary: async (): Promise<AccountsReceivableSummary> => {
    try {
      const response = await api.get<{ success: boolean; data: AccountsReceivableSummary }>('/accounts-receivable/summary');
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsReceivableService] getSummary error:', error);
      throw error;
    }
  },

  // ============================================================
  // BULK ACTIONS
  // ============================================================

  /**
   * Marcar múltiples facturas como cobradas
   * POST /accounts-receivable/bulk/mark-paid
   */
  markAsPaid: async (data: MarkAsPaidInput): Promise<any> => {
    try {
      const response = await api.post<{ success: boolean; data: any }>('/accounts-receivable/bulk/mark-paid', data);
      return response.data;
    } catch (error) {
      console.error('❌ [AccountsReceivableService] markAsPaid error:', error);
      throw error;
    }
  },
};