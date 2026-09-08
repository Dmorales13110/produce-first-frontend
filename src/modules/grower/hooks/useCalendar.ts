// src/modules/grower/hooks/useCalendar.ts
import { useState, useEffect, useCallback } from 'react';
import { CalendarService, type CalendarEvent } from '../../../services/calendar';

interface UseCalendarReturn {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>) => Promise<CalendarEvent>;
  updateEvent: (event: Partial<CalendarEvent> & { id: string }) => Promise<CalendarEvent>;
  deleteEvent: (id: string) => Promise<void>;
  getEventsForMonth: (year: number, month: number) => Promise<CalendarEvent[]>;
  getEventsForDay: (year: number, month: number, day: number) => Promise<CalendarEvent[]>;
}

export const useCalendar = (): UseCalendarReturn => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await CalendarService.getEvents();
      setEvents(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar eventos';
      setError(errorMessage);
      console.error('❌ [useCalendar] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getEventsForMonth = useCallback(async (year: number, month: number) => {
    try {
      return await CalendarService.getEventsForMonth(year, month);
    } catch (err) {
      console.error('❌ [useCalendar] getEventsForMonth error:', err);
      throw err;
    }
  }, []);

  const getEventsForDay = useCallback(async (year: number, month: number, day: number) => {
    try {
      return await CalendarService.getEventsForDay(year, month, day);
    } catch (err) {
      console.error('❌ [useCalendar] getEventsForDay error:', err);
      throw err;
    }
  }, []);

  const addEvent = useCallback(async (event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newEvent = await CalendarService.createEvent(event);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      console.error('❌ [useCalendar] addEvent error:', err);
      throw err;
    }
  }, []);

  const updateEvent = useCallback(async (event: Partial<CalendarEvent> & { id: string }) => {
    try {
      const updated = await CalendarService.updateEvent(event);
      setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
      return updated;
    } catch (err) {
      console.error('❌ [useCalendar] updateEvent error:', err);
      throw err;
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      await CalendarService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('❌ [useCalendar] deleteEvent error:', err);
      throw err;
    }
  }, []);

  return {
    events,
    isLoading,
    error,
    refresh: fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForMonth,
    getEventsForDay,
  };
};