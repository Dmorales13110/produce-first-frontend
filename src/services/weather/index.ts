// src/services/weather/index.ts
export interface WeatherData {
  temp: number;
  humidity: number;
  wind: number;
  condition: string;
  icon: string;
  feelsLike: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  location: string;
}

export interface WeatherForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  precipitation: number;
}

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

// Mapeo de condiciones de OpenWeather a texto en español
const conditionMap: Record<string, string> = {
  'Clear': 'Despejado',
  'Clouds': 'Nublado',
  'Rain': 'Lluvia',
  'Drizzle': 'Llovizna',
  'Thunderstorm': 'Tormenta',
  'Snow': 'Nieve',
  'Mist': 'Niebla',
  'Smoke': 'Humo',
  'Haze': 'Bruma',
  'Dust': 'Polvo',
  'Fog': 'Niebla',
  'Sand': 'Arena',
  'Ash': 'Ceniza',
  'Squall': 'Chubasco',
  'Tornado': 'Tornado',
};

const conditionIconMap: Record<string, string> = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Drizzle': '🌦️',
  'Thunderstorm': '⛈️',
  'Snow': '❄️',
  'Mist': '🌫️',
  'Fog': '🌫️',
  'Haze': '🌫️',
  'Dust': '💨',
  'Smoke': '💨',
};

export const WeatherService = {
  /**
   * Obtener clima actual para una ubicación
   */
  getCurrentWeather: async (lat: number = 20.5, lon: number = -100.5): Promise<WeatherData | null> => {
    try {
      if (!WEATHER_API_KEY) {
        console.warn('⚠️ [WeatherService] No API key configurada, usando datos simulados');
        return WeatherService.getMockWeather();
      }

      const response = await fetch(
        `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}&lang=es`
      );

      if (!response.ok) {
        throw new Error(`Error fetching weather: ${response.status}`);
      }

      const data = await response.json();
      const condition = data.weather?.[0]?.main || 'Clear';
      const description = data.weather?.[0]?.description || '';

      return {
        temp: Math.round(data.main?.temp || 22),
        humidity: data.main?.humidity || 65,
        wind: Math.round((data.wind?.speed || 0) * 3.6), // Convertir m/s a km/h
        condition: conditionMap[condition] || description || 'Despejado',
        icon: conditionIconMap[condition] || '☀️',
        feelsLike: Math.round(data.main?.feels_like || 22),
        pressure: data.main?.pressure || 1013,
        uvIndex: 0, // OpenWeather no da UV en la API free
        sunrise: new Date(data.sys?.sunrise * 1000).toLocaleTimeString('es-MX'),
        sunset: new Date(data.sys?.sunset * 1000).toLocaleTimeString('es-MX'),
        location: data.name || 'Ubicación',
      };
    } catch (error) {
      console.error('❌ [WeatherService] Error:', error);
      return WeatherService.getMockWeather();
    }
  },

  /**
   * Obtener pronóstico de 5 días
   */
  getForecast: async (lat: number = 20.5, lon: number = -100.5): Promise<WeatherForecast[]> => {
    try {
      if (!WEATHER_API_KEY) {
        return WeatherService.getMockForecast();
      }

      const response = await fetch(
        `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}&lang=es`
      );

      if (!response.ok) {
        throw new Error(`Error fetching forecast: ${response.status}`);
      }

      const data = await response.json();
      const dailyData: { [key: string]: any } = {};

      data.list?.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toLocaleDateString('es-MX');
        if (!dailyData[date]) {
          dailyData[date] = {
            temps: [],
            conditions: [],
            icons: [],
            precipitation: 0,
          };
        }
        dailyData[date].temps.push(item.main?.temp || 0);
        dailyData[date].conditions.push(item.weather?.[0]?.main || 'Clear');
        dailyData[date].icons.push(item.weather?.[0]?.icon || '');
        dailyData[date].precipitation += (item.rain?.['3h'] || 0);
      });

      return Object.entries(dailyData).slice(0, 5).map(([date, data]) => {
        const condition = data.conditions.reduce((a: string, b: string) => a, data.conditions[0]);
        return {
          date,
          tempMax: Math.round(Math.max(...data.temps)),
          tempMin: Math.round(Math.min(...data.temps)),
          condition: conditionMap[condition] || condition,
          icon: conditionIconMap[condition] || '☀️',
          precipitation: Math.round(data.precipitation * 100) / 100,
        };
      });
    } catch (error) {
      console.error('❌ [WeatherService] Forecast error:', error);
      return WeatherService.getMockForecast();
    }
  },

  // ============================================================
  // DATOS SIMULADOS (fallback)
  // ============================================================

  getMockWeather: (): WeatherData => ({
    temp: 22,
    humidity: 65,
    wind: 12,
    condition: 'Soleado',
    icon: '☀️',
    feelsLike: 22,
    pressure: 1013,
    uvIndex: 3,
    sunrise: '07:12 AM',
    sunset: '18:45 PM',
    location: 'San Miguel de Allende',
  }),

  getMockForecast: (): WeatherForecast[] => {
    const today = new Date();
    return [
      { date: today.toLocaleDateString('es-MX'), tempMax: 24, tempMin: 14, condition: 'Soleado', icon: '☀️', precipitation: 0 },
      { date: new Date(today.setDate(today.getDate() + 1)).toLocaleDateString('es-MX'), tempMax: 23, tempMin: 15, condition: 'Parcialmente nublado', icon: '⛅', precipitation: 0.2 },
      { date: new Date(today.setDate(today.getDate() + 1)).toLocaleDateString('es-MX'), tempMax: 20, tempMin: 12, condition: 'Lluvia ligera', icon: '🌦️', precipitation: 2.5 },
      { date: new Date(today.setDate(today.getDate() + 1)).toLocaleDateString('es-MX'), tempMax: 22, tempMin: 13, condition: 'Nublado', icon: '☁️', precipitation: 0.5 },
      { date: new Date(today.setDate(today.getDate() + 1)).toLocaleDateString('es-MX'), tempMax: 25, tempMin: 16, condition: 'Soleado', icon: '☀️', precipitation: 0 },
    ];
  },
};