import { api } from '../apiClient';

// ============================================================
// TIPOS
// ============================================================

export interface CardMovement {
    id: string;
    movement_date: string;
    merchant: string;
    amount: number;
    empresa: string;
    category: string;
    invoice_number: string;
    status: 'clasificado' | 'por_clasificar' | 'sin_comprobante';
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface CardImport {
    id: string;
    import_date: string;
    total_movements: number;
    total_amount: number;
    file_name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface CardSummary {
    totalMovements: number;
    clasificados: number;
    porClasificar: number;
    sinComprobante: number;
    montoPorClasificar: number;
    totalAmount: number;
    clasificadosPercent: number;
}

export interface CardFilters {
    status?: string;
    empresa?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

// ============================================================
// SERVICIO
// ============================================================

export const CardConciliationService = {
    // ============================================================
    // MOVEMENTS
    // ============================================================

    getMovements: async (filters?: CardFilters): Promise<CardMovement[]> => {
        try {
            const queryParams = new URLSearchParams();
            if (filters?.status) queryParams.append('status', filters.status);
            if (filters?.empresa) queryParams.append('empresa', filters.empresa);
            if (filters?.category) queryParams.append('category', filters.category);
            if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
            if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
            if (filters?.search) queryParams.append('search', filters.search);

            const url = `/card-conciliation/movements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await api.get<{ success: boolean; data: CardMovement[] }>(url);
            return response.data;
        } catch (error) {
            console.error('❌ [CardConciliationService] getMovements error:', error);
            throw error;
        }
    },

    getMovementById: async (id: string): Promise<CardMovement> => {
        try {
            const response = await api.get<{ success: boolean; data: CardMovement }>(`/card-conciliation/movements/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ [CardConciliationService] getMovementById error:', error);
            throw error;
        }
    },

    updateMovement: async (id: string, data: any): Promise<CardMovement> => {
        try {
            const response = await api.put<{ success: boolean; data: CardMovement }>(`/card-conciliation/movements/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('❌ [CardConciliationService] updateMovement error:', error);
            throw error;
        }
    },

    updateMovementsBatch: async (movements: any[]): Promise<any> => {
        try {
            const response = await api.post<{ success: boolean; data: any }>('/card-conciliation/movements/batch', { movements });
            return response.data;
        } catch (error) {
            console.error('❌ [CardConciliationService] updateMovementsBatch error:', error);
            throw error;
        }
    },

    // ============================================================
    // IMPORTS
    // ============================================================

    getImports: async (): Promise<CardImport[]> => {
        try {
            const response = await api.get<{ success: boolean; data: CardImport[] }>('/card-conciliation/imports');
            return response.data;
        } catch (error) {
            console.error('❌ [CardConciliationService] getImports error:', error);
            throw error;
        }
    },

    importMovements: async (data: any): Promise<CardImport> => {
        try {
            const response = await api.post<{ success: boolean; data: CardImport }>('/card-conciliation/imports', data);
            return response.data;
        } catch (error) {
            console.error('❌ [CardConciliationService] importMovements error:', error);
            throw error;
        }
    },

    // ============================================================
    // SUMMARY
    // ============================================================

    getSummary: async (): Promise<CardSummary> => {
        try {
            const response = await api.get<{ success: boolean; data: CardSummary }>('/card-conciliation/summary');
            return response.data;
        } catch (error) {
            console.error('❌ [CardConciliationService] getSummary error:', error);
            throw error;
        }
    },
    // Agregar al servicio

    /**
     * Registrar gasto desde movimiento
     * POST /card-conciliation/movements/:id/register-expense
     */
    registerExpense: async (movementId: string, data: any): Promise<any> => {
        try {
            const response = await api.post<{ success: boolean; data: any }>(
                `/card-conciliation/movements/${movementId}/register-expense`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('❌ [CardConciliationService] registerExpense error:', error);
            throw error;
        }
    },

    /**
     * Registrar gasto manual (sin movimiento de tarjeta)
     * POST /card-conciliation/expenses/manual
     */
    registerManualExpense: async (data: any): Promise<any> => {
        try {
            const response = await api.post<{ success: boolean; data: any }>(
                '/card-conciliation/expenses/manual',
                data
            );
            return response.data;
        } catch (error) {
            console.error('❌ [CardConciliationService] registerManualExpense error:', error);
            throw error;
        }
    },
};