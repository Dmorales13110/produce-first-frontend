// src/modules/grower/hooks/useHarvestTicket.ts
import { useState, useEffect, useCallback } from 'react';
import { HarvestTicketService, type HarvestTicket, type TicketSummary, type TicketFilters } from '../../../../../services/harvest-ticket';

interface UseHarvestTicketReturn {
  tickets: HarvestTicket[];
  summary: TicketSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: TicketFilters;
  setFilters: (filters: TicketFilters) => void;
  refresh: () => Promise<void>;
  createTicket: (data: any) => Promise<HarvestTicket>;
  updateStatus: (id: string, status: string) => Promise<HarvestTicket>;
  deleteTicket: (id: string) => Promise<void>;
  getTicketById: (id: string) => Promise<HarvestTicket>;
}

export const useHarvestTicket = (): UseHarvestTicketReturn => {
  const [tickets, setTickets] = useState<HarvestTicket[]>([]);
  const [summary, setSummary] = useState<TicketSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TicketFilters>({});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [ticketsData, summaryData] = await Promise.all([
        HarvestTicketService.getTickets(filters),
        HarvestTicketService.getSummary(),
      ]);
      setTickets(ticketsData);
      setSummary(summaryData);
    } catch (err) {
      console.error('❌ [useHarvestTicket] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar boletas');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createTicket = useCallback(async (data: any): Promise<HarvestTicket> => {
    try {
      const result = await HarvestTicketService.createTicket(data);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useHarvestTicket] createTicket error:', err);
      throw err;
    }
  }, [fetchData]);

  const updateStatus = useCallback(async (id: string, status: string): Promise<HarvestTicket> => {
    try {
      const result = await HarvestTicketService.updateStatus(id, status);
      await fetchData();
      return result;
    } catch (err) {
      console.error('❌ [useHarvestTicket] updateStatus error:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteTicket = useCallback(async (id: string): Promise<void> => {
    try {
      await HarvestTicketService.deleteTicket(id);
      await fetchData();
    } catch (err) {
      console.error('❌ [useHarvestTicket] deleteTicket error:', err);
      throw err;
    }
  }, [fetchData]);

  const getTicketById = useCallback(async (id: string): Promise<HarvestTicket> => {
    try {
      return await HarvestTicketService.getTicketById(id);
    } catch (err) {
      console.error('❌ [useHarvestTicket] getTicketById error:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    tickets,
    summary,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
    createTicket,
    updateStatus,
    deleteTicket,
    getTicketById,
  };
};