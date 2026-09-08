// src/services/season/index.ts

export interface SeasonInfo {
  season: string;
  year: number;
  week: number;
  totalWeeks: number;
  startDate: string;
  endDate: string;
  seasonType: 'invierno' | 'primavera' | 'verano' | 'otoño';
  progress: number; // 0-100
}

export const SeasonService = {
  /**
   * Obtener información de la temporada actual
   */
  getCurrentSeason: (): SeasonInfo => {
    const now = new Date();
    const year = now.getFullYear();
    
    // Calcular semana del año (ISO 8601)
    const weekNumber = SeasonService.getWeekNumber(now);
    
    // Determinar temporada basada en el mes
    const month = now.getMonth();
    let seasonType: 'invierno' | 'primavera' | 'verano' | 'otoño';
    let seasonName: string;
    let startDate: string;
    let endDate: string;
    let totalWeeks: number;
    let startMonth: number;
    let endMonth: number;

    // Primavera: Marzo - Mayo
    if (month >= 2 && month <= 4) {
      seasonType = 'primavera';
      seasonName = `Primavera ${year}`;
      startDate = `${year}-03-01`;
      endDate = `${year}-05-31`;
      totalWeeks = 13;
      startMonth = 2;
      endMonth = 4;
    }
    // Verano: Junio - Agosto
    else if (month >= 5 && month <= 7) {
      seasonType = 'verano';
      seasonName = `Verano ${year}`;
      startDate = `${year}-06-01`;
      endDate = `${year}-08-31`;
      totalWeeks = 13;
      startMonth = 5;
      endMonth = 7;
    }
    // Otoño: Septiembre - Noviembre
    else if (month >= 8 && month <= 10) {
      seasonType = 'otoño';
      seasonName = `Otoño ${year}`;
      startDate = `${year}-09-01`;
      endDate = `${year}-11-30`;
      totalWeeks = 13;
      startMonth = 8;
      endMonth = 10;
    }
    // Invierno: Diciembre - Febrero
    else {
      seasonType = 'invierno';
      // Si es diciembre, el año de la temporada es el actual, pero termina el año siguiente
      if (month === 11) {
        seasonName = `Invierno ${year}-${year + 1}`;
        startDate = `${year}-12-01`;
        endDate = `${year + 1}-02-28`;
        totalWeeks = 13;
        startMonth = 11;
        endMonth = 1;
      } else {
        // Enero o Febrero, la temporada comenzó el año anterior
        seasonName = `Invierno ${year - 1}-${year}`;
        startDate = `${year - 1}-12-01`;
        endDate = `${year}-02-28`;
        totalWeeks = 13;
        startMonth = 11;
        endMonth = 1;
      }
    }

    // Calcular semana de la temporada
    const seasonWeek = SeasonService.getSeasonWeek(now, startDate);
    
    // Calcular progreso
    const progress = Math.min((seasonWeek / totalWeeks) * 100, 100);

    return {
      season: seasonName,
      year,
      week: seasonWeek,
      totalWeeks,
      startDate,
      endDate,
      seasonType,
      progress: Math.round(progress),
    };
  },

  /**
   * Obtener número de semana ISO 8601
   */
  getWeekNumber: (date: Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  },

  /**
   * Calcular semana de la temporada
   */
  getSeasonWeek: (date: Date, startDate: string): number => {
    const start = new Date(startDate);
    const diff = date.getTime() - start.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.ceil(days / 7));
  },

  /**
   * Obtener todas las temporadas del año
   */
  getAllSeasons: (year: number): SeasonInfo[] => {
    const seasons: SeasonInfo[] = [];
    
    // Primavera
    const springStart = new Date(year, 2, 1);
    const springEnd = new Date(year, 4, 31);
    seasons.push({
      season: `Primavera ${year}`,
      year,
      week: 1,
      totalWeeks: 13,
      startDate: `${year}-03-01`,
      endDate: `${year}-05-31`,
      seasonType: 'primavera',
      progress: 0,
    });

    // Verano
    seasons.push({
      season: `Verano ${year}`,
      year,
      week: 1,
      totalWeeks: 13,
      startDate: `${year}-06-01`,
      endDate: `${year}-08-31`,
      seasonType: 'verano',
      progress: 0,
    });

    // Otoño
    seasons.push({
      season: `Otoño ${year}`,
      year,
      week: 1,
      totalWeeks: 13,
      startDate: `${year}-09-01`,
      endDate: `${year}-11-30`,
      seasonType: 'otoño',
      progress: 0,
    });

    // Invierno (abarca dos años)
    seasons.push({
      season: `Invierno ${year}-${year + 1}`,
      year,
      week: 1,
      totalWeeks: 13,
      startDate: `${year}-12-01`,
      endDate: `${year + 1}-02-28`,
      seasonType: 'invierno',
      progress: 0,
    });

    return seasons;
  },

  /**
   * Obtener rango de semanas para una temporada
   */
  getSeasonWeeks: (seasonInfo: SeasonInfo): { week: number; label: string }[] => {
    const weeks = [];
    for (let i = 1; i <= seasonInfo.totalWeeks; i++) {
      weeks.push({
        week: i,
        label: `S${i}`,
      });
    }
    return weeks;
  },

  /**
   * Formatear fecha para mostrar
   */
  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  },

  /**
   * Obtener nombre de la temporada en español
   */
  getSeasonName: (seasonType: 'invierno' | 'primavera' | 'verano' | 'otoño'): string => {
    const names = {
      invierno: 'Invierno',
      primavera: 'Primavera',
      verano: 'Verano',
      otoño: 'Otoño',
    };
    return names[seasonType];
  },
};